# Leilão Inglês

Leilão inglês de NFT.

#### Leilão <a href="#auction" id="auction"></a>

1. O vendedor do NFT implementa este contrato.
2. O leilão dura 7 dias.
3. Os participantes podem dar um lance depositando uma quantia de ETH maior do que a mais alta oferta corrente.
4. Todos os licitantes com exceção do que deu o lance mais alto podem retirar os seus lances

#### Depois do leilão <a href="#after-the-auction" id="after-the-auction"></a>

1. Quem deu o lance mais alto se torna o possuidor do NFT.
2. O vendedor recebe o lance mais alto de ETH.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface IERC721 {
    function transfer(address, uint) external;

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
            nft.transfer(highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.transfer(seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
```
