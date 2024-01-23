# Leilão Holandês

Leilão holandês de NFT.

#### Auction <a href="#auction" id="auction"></a>

1. O vendedor de NFT implementa este contrato estabelecendo um preço inicial para o NFT.
2. O leilão dura 7 dias.
3. O preço do NFT cai com o tempo
4. Os participantes podem comprar depositando uma quantidade de ETH maior que o preço atual calculado pelo contrato inteligente.
5. O leilão termina quando alguém compra o NFT.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

contract DutchAuction {
    uint private constant DURATION = 7 days;

    IERC721 public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    uint public immutable discountRate;

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
        discountRate = _discountRate;

        require(_startingPrice >= _discountRate * DURATION, "starting price < min");

        nft = IERC721(_nft);
        nftId = _nftId;
    }

    function getPrice() public view returns (uint) {
        uint timeElapsed = block.timestamp - startAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < expiresAt, "auction expired");

        uint price = getPrice();
        require(msg.value >= price, "ETH < price");

        nft.transferFrom(seller, msg.sender, nftId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(seller);
    }
}
```

## Teste no Remix

- [DutchAuction.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmludGVyZmFjZSBJRVJDNzIxIHsKICAgIGZ1bmN0aW9uIHRyYW5zZmVyRnJvbSgKICAgICAgICBhZGRyZXNzIF9mcm9tLAogICAgICAgIGFkZHJlc3MgX3RvLAogICAgICAgIHVpbnQgX25mdElkCiAgICApIGV4dGVybmFsOwp9Cgpjb250cmFjdCBEdXRjaEF1Y3Rpb24gewogICAgdWludCBwcml2YXRlIGNvbnN0YW50IERVUkFUSU9OID0gNyBkYXlzOwoKICAgIElFUkM3MjEgcHVibGljIGltbXV0YWJsZSBuZnQ7CiAgICB1aW50IHB1YmxpYyBpbW11dGFibGUgbmZ0SWQ7CgogICAgYWRkcmVzcyBwYXlhYmxlIHB1YmxpYyBpbW11dGFibGUgc2VsbGVyOwogICAgdWludCBwdWJsaWMgaW1tdXRhYmxlIHN0YXJ0aW5nUHJpY2U7CiAgICB1aW50IHB1YmxpYyBpbW11dGFibGUgc3RhcnRBdDsKICAgIHVpbnQgcHVibGljIGltbXV0YWJsZSBleHBpcmVzQXQ7CiAgICB1aW50IHB1YmxpYyBpbW11dGFibGUgZGlzY291bnRSYXRlOwoKICAgIGNvbnN0cnVjdG9yKAogICAgICAgIHVpbnQgX3N0YXJ0aW5nUHJpY2UsCiAgICAgICAgdWludCBfZGlzY291bnRSYXRlLAogICAgICAgIGFkZHJlc3MgX25mdCwKICAgICAgICB1aW50IF9uZnRJZAogICAgKSB7CiAgICAgICAgc2VsbGVyID0gcGF5YWJsZShtc2cuc2VuZGVyKTsKICAgICAgICBzdGFydGluZ1ByaWNlID0gX3N0YXJ0aW5nUHJpY2U7CiAgICAgICAgc3RhcnRBdCA9IGJsb2NrLnRpbWVzdGFtcDsKICAgICAgICBleHBpcmVzQXQgPSBibG9jay50aW1lc3RhbXAgKyBEVVJBVElPTjsKICAgICAgICBkaXNjb3VudFJhdGUgPSBfZGlzY291bnRSYXRlOwoKICAgICAgICByZXF1aXJlKF9zdGFydGluZ1ByaWNlID49IF9kaXNjb3VudFJhdGUgKiBEVVJBVElPTiwgInN0YXJ0aW5nIHByaWNlIDwgbWluIik7CgogICAgICAgIG5mdCA9IElFUkM3MjEoX25mdCk7CiAgICAgICAgbmZ0SWQgPSBfbmZ0SWQ7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0UHJpY2UoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgdWludCB0aW1lRWxhcHNlZCA9IGJsb2NrLnRpbWVzdGFtcCAtIHN0YXJ0QXQ7CiAgICAgICAgdWludCBkaXNjb3VudCA9IGRpc2NvdW50UmF0ZSAqIHRpbWVFbGFwc2VkOwogICAgICAgIHJldHVybiBzdGFydGluZ1ByaWNlIC0gZGlzY291bnQ7CiAgICB9CgogICAgZnVuY3Rpb24gYnV5KCkgZXh0ZXJuYWwgcGF5YWJsZSB7CiAgICAgICAgcmVxdWlyZShibG9jay50aW1lc3RhbXAgPCBleHBpcmVzQXQsICJhdWN0aW9uIGV4cGlyZWQiKTsKCiAgICAgICAgdWludCBwcmljZSA9IGdldFByaWNlKCk7CiAgICAgICAgcmVxdWlyZShtc2cudmFsdWUgPj0gcHJpY2UsICJFVEggPCBwcmljZSIpOwoKICAgICAgICBuZnQudHJhbnNmZXJGcm9tKHNlbGxlciwgbXNnLnNlbmRlciwgbmZ0SWQpOwogICAgICAgIHVpbnQgcmVmdW5kID0gbXNnLnZhbHVlIC0gcHJpY2U7CiAgICAgICAgaWYgKHJlZnVuZCA+IDApIHsKICAgICAgICAgICAgcGF5YWJsZShtc2cuc2VuZGVyKS50cmFuc2ZlcihyZWZ1bmQpOwogICAgICAgIH0KICAgICAgICBzZWxmZGVzdHJ1Y3Qoc2VsbGVyKTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
