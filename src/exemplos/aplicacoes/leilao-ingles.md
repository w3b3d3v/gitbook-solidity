# Leilão Inglês

Leilão inglês de NFT.

#### Leilão <a href="#auction" id="auction"></a>

1. O vendedor do NFT implementa este contrato.
2. O leilão dura 7 dias.
3. Os participantes podem dar um lance depositando uma quantia de ETH maior do que a mais alta oferta corrente.
4. Todos os licitantes com exceção do que deu o lance mais alto podem retirar os seus lances

#### Depois do leilão <a href="#after-the-auction" id="after-the-auction"></a>

1. Quem deu o lance mais alto se torna o novo proprietário do NFT.
2. O vendedor recebe o lance mais alto de ETH.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid
    ) {
        nft = IERC721(_nft);
        nftId = _nftId;

        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
```

## Teste no Remix

- [EnglishAuction.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmludGVyZmFjZSBJRVJDNzIxIHsKICAgIGZ1bmN0aW9uIHNhZmVUcmFuc2ZlckZyb20oCiAgICAgICAgYWRkcmVzcyBmcm9tLAogICAgICAgIGFkZHJlc3MgdG8sCiAgICAgICAgdWludCB0b2tlbklkCiAgICApIGV4dGVybmFsOwoKICAgIGZ1bmN0aW9uIHRyYW5zZmVyRnJvbSgKICAgICAgICBhZGRyZXNzLAogICAgICAgIGFkZHJlc3MsCiAgICAgICAgdWludAogICAgKSBleHRlcm5hbDsKfQoKY29udHJhY3QgRW5nbGlzaEF1Y3Rpb24gewogICAgZXZlbnQgU3RhcnQoKTsKICAgIGV2ZW50IEJpZChhZGRyZXNzIGluZGV4ZWQgc2VuZGVyLCB1aW50IGFtb3VudCk7CiAgICBldmVudCBXaXRoZHJhdyhhZGRyZXNzIGluZGV4ZWQgYmlkZGVyLCB1aW50IGFtb3VudCk7CiAgICBldmVudCBFbmQoYWRkcmVzcyB3aW5uZXIsIHVpbnQgYW1vdW50KTsKCiAgICBJRVJDNzIxIHB1YmxpYyBuZnQ7CiAgICB1aW50IHB1YmxpYyBuZnRJZDsKCiAgICBhZGRyZXNzIHBheWFibGUgcHVibGljIHNlbGxlcjsKICAgIHVpbnQgcHVibGljIGVuZEF0OwogICAgYm9vbCBwdWJsaWMgc3RhcnRlZDsKICAgIGJvb2wgcHVibGljIGVuZGVkOwoKICAgIGFkZHJlc3MgcHVibGljIGhpZ2hlc3RCaWRkZXI7CiAgICB1aW50IHB1YmxpYyBoaWdoZXN0QmlkOwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQpIHB1YmxpYyBiaWRzOwoKICAgIGNvbnN0cnVjdG9yKAogICAgICAgIGFkZHJlc3MgX25mdCwKICAgICAgICB1aW50IF9uZnRJZCwKICAgICAgICB1aW50IF9zdGFydGluZ0JpZAogICAgKSB7CiAgICAgICAgbmZ0ID0gSUVSQzcyMShfbmZ0KTsKICAgICAgICBuZnRJZCA9IF9uZnRJZDsKCiAgICAgICAgc2VsbGVyID0gcGF5YWJsZShtc2cuc2VuZGVyKTsKICAgICAgICBoaWdoZXN0QmlkID0gX3N0YXJ0aW5nQmlkOwogICAgfQoKICAgIGZ1bmN0aW9uIHN0YXJ0KCkgZXh0ZXJuYWwgewogICAgICAgIHJlcXVpcmUoIXN0YXJ0ZWQsICJzdGFydGVkIik7CiAgICAgICAgcmVxdWlyZShtc2cuc2VuZGVyID09IHNlbGxlciwgIm5vdCBzZWxsZXIiKTsKCiAgICAgICAgbmZ0LnRyYW5zZmVyRnJvbShtc2cuc2VuZGVyLCBhZGRyZXNzKHRoaXMpLCBuZnRJZCk7CiAgICAgICAgc3RhcnRlZCA9IHRydWU7CiAgICAgICAgZW5kQXQgPSBibG9jay50aW1lc3RhbXAgKyA3IGRheXM7CgogICAgICAgIGVtaXQgU3RhcnQoKTsKICAgIH0KCiAgICBmdW5jdGlvbiBiaWQoKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICByZXF1aXJlKHN0YXJ0ZWQsICJub3Qgc3RhcnRlZCIpOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wIDwgZW5kQXQsICJlbmRlZCIpOwogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID4gaGlnaGVzdEJpZCwgInZhbHVlIDwgaGlnaGVzdCIpOwoKICAgICAgICBpZiAoaGlnaGVzdEJpZGRlciAhPSBhZGRyZXNzKDApKSB7CiAgICAgICAgICAgIGJpZHNbaGlnaGVzdEJpZGRlcl0gKz0gaGlnaGVzdEJpZDsKICAgICAgICB9CgogICAgICAgIGhpZ2hlc3RCaWRkZXIgPSBtc2cuc2VuZGVyOwogICAgICAgIGhpZ2hlc3RCaWQgPSBtc2cudmFsdWU7CgogICAgICAgIGVtaXQgQmlkKG1zZy5zZW5kZXIsIG1zZy52YWx1ZSk7CiAgICB9CgogICAgZnVuY3Rpb24gd2l0aGRyYXcoKSBleHRlcm5hbCB7CiAgICAgICAgdWludCBiYWwgPSBiaWRzW21zZy5zZW5kZXJdOwogICAgICAgIGJpZHNbbXNnLnNlbmRlcl0gPSAwOwogICAgICAgIHBheWFibGUobXNnLnNlbmRlcikudHJhbnNmZXIoYmFsKTsKCiAgICAgICAgZW1pdCBXaXRoZHJhdyhtc2cuc2VuZGVyLCBiYWwpOwogICAgfQoKICAgIGZ1bmN0aW9uIGVuZCgpIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKHN0YXJ0ZWQsICJub3Qgc3RhcnRlZCIpOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wID49IGVuZEF0LCAibm90IGVuZGVkIik7CiAgICAgICAgcmVxdWlyZSghZW5kZWQsICJlbmRlZCIpOwoKICAgICAgICBlbmRlZCA9IHRydWU7CiAgICAgICAgaWYgKGhpZ2hlc3RCaWRkZXIgIT0gYWRkcmVzcygwKSkgewogICAgICAgICAgICBuZnQuc2FmZVRyYW5zZmVyRnJvbShhZGRyZXNzKHRoaXMpLCBoaWdoZXN0QmlkZGVyLCBuZnRJZCk7CiAgICAgICAgICAgIHNlbGxlci50cmFuc2ZlcihoaWdoZXN0QmlkKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBuZnQuc2FmZVRyYW5zZmVyRnJvbShhZGRyZXNzKHRoaXMpLCBzZWxsZXIsIG5mdElkKTsKICAgICAgICB9CgogICAgICAgIGVtaXQgRW5kKGhpZ2hlc3RCaWRkZXIsIGhpZ2hlc3RCaWQpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
