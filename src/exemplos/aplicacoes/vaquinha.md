# Vaquinha

Token ERC20 de financiamento coletivo

1. O usuário cria uma campanha.
2. Os usuários podem se comprometer, transferindo seu token para uma campanha.
3. Após o término da campanha, o criador da campanha pode reivindicar os fundos se o valor total prometido for maior que a meta da campanha.
4. Caso contrário, a campanha não atingiu seu objetivo, os usuários podem retirar sua promessa.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address, uint) external returns (bool);

    function transferFrom(
        address,
        address,
        uint
    ) external returns (bool);
}

contract CrowdFund {
    event Launch(
        uint id,
        address indexed creator,
        uint goal,
        uint32 startAt,
        uint32 endAt
    );
    event Cancel(uint id);
    event Pledge(uint indexed id, address indexed caller, uint amount);
    event Unpledge(uint indexed id, address indexed caller, uint amount);
    event Claim(uint id);
    event Refund(uint id, address indexed caller, uint amount);

    struct Campaign {
        // Criador da campanha
        address creator;
        // Quantidade de tokens para arrecadar
        uint goal;
        // Valor total prometido
        uint pledged;
        // Timestamp do início da campanha
        uint32 startAt;
        // Timestamp do final da campanha
        uint32 endAt;
        // True se a meta foi alcançada e o criador reivindicou os tokens.
        bool claimed;
    }

    IERC20 public immutable token;
    // Contagem total de campanhas criadas.
    // Também é usado para gerar id para novas campanhas.
    uint public count;
    // Mapping do id para o Campaign
    mapping(uint => Campaign) public campaigns;
    // Mapping do campaign id => doador => valor prometido
    mapping(uint => mapping(address => uint)) public pledgedAmount;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function launch(
        uint _goal,
        uint32 _startAt,
        uint32 _endAt
    ) external {
        require(_startAt >= block.timestamp, "start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 90 days, "end at > max duration");

        count += 1;
        campaigns[count] = Campaign({
            creator: msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false
        });

        emit Launch(count, msg.sender, _goal, _startAt, _endAt);
    }

    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(block.timestamp < campaign.startAt, "started");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "not started");
        require(block.timestamp <= campaign.endAt, "ended");

        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);

        emit Pledge(_id, msg.sender, _amount);
    }

    function unpledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.endAt, "ended");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit Unpledge(_id, msg.sender, _amount);
    }

    function claim(uint _id) external {
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged >= campaign.goal, "pledged < goal");
        require(!campaign.claimed, "claimed");

        campaign.claimed = true;
        token.transfer(campaign.creator, campaign.pledged);

        emit Claim(_id);
    }

    function refund(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged < campaign.goal, "pledged >= goal");

        uint bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit Refund(_id, msg.sender, bal);
    }
}
```

## Teste no Remix

- [CrowdFund.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmludGVyZmFjZSBJRVJDMjAgewogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgdWludCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CgogICAgZnVuY3Rpb24gdHJhbnNmZXJGcm9tKAogICAgICAgIGFkZHJlc3MsCiAgICAgICAgYWRkcmVzcywKICAgICAgICB1aW50CiAgICApIGV4dGVybmFsIHJldHVybnMgKGJvb2wpOwp9Cgpjb250cmFjdCBDcm93ZEZ1bmQgewogICAgZXZlbnQgTGF1bmNoKAogICAgICAgIHVpbnQgaWQsCiAgICAgICAgYWRkcmVzcyBpbmRleGVkIGNyZWF0b3IsCiAgICAgICAgdWludCBnb2FsLAogICAgICAgIHVpbnQzMiBzdGFydEF0LAogICAgICAgIHVpbnQzMiBlbmRBdAogICAgKTsKICAgIGV2ZW50IENhbmNlbCh1aW50IGlkKTsKICAgIGV2ZW50IFBsZWRnZSh1aW50IGluZGV4ZWQgaWQsIGFkZHJlc3MgaW5kZXhlZCBjYWxsZXIsIHVpbnQgYW1vdW50KTsKICAgIGV2ZW50IFVucGxlZGdlKHVpbnQgaW5kZXhlZCBpZCwgYWRkcmVzcyBpbmRleGVkIGNhbGxlciwgdWludCBhbW91bnQpOwogICAgZXZlbnQgQ2xhaW0odWludCBpZCk7CiAgICBldmVudCBSZWZ1bmQodWludCBpZCwgYWRkcmVzcyBpbmRleGVkIGNhbGxlciwgdWludCBhbW91bnQpOwoKICAgIHN0cnVjdCBDYW1wYWlnbiB7CiAgICAgICAgLy8gQ3JpYWRvciBkYSBjYW1wYW5oYQogICAgICAgIGFkZHJlc3MgY3JlYXRvcjsKICAgICAgICAvLyBRdWFudGlkYWRlIGRlIHRva2VucyBwYXJhIGFycmVjYWRhcgogICAgICAgIHVpbnQgZ29hbDsKICAgICAgICAvLyBWYWxvciB0b3RhbCBwcm9tZXRpZG8KICAgICAgICB1aW50IHBsZWRnZWQ7CiAgICAgICAgLy8gVGltZXN0YW1wIGRvIGluaWNpbyBkYSBjYW1wYW5oYQogICAgICAgIHVpbnQzMiBzdGFydEF0OwogICAgICAgIC8vIFRpbWVzdGFtcCBkbyBmaW5hbCBkYSBjYW1wYW5oYQogICAgICAgIHVpbnQzMiBlbmRBdDsKICAgICAgICAvLyBUcnVlIHNlIGEgbWV0YSBmb2kgYWxjYW5jYWRhIGUgbyBjcmlhZG9yIHJlaXZpbmRpY291IG9zIHRva2Vucy4KICAgICAgICBib29sIGNsYWltZWQ7CiAgICB9CgogICAgSUVSQzIwIHB1YmxpYyBpbW11dGFibGUgdG9rZW47CiAgICAvLyBDb250YWdlbSB0b3RhbCBkZSBjYW1wYW5oYXMgY3JpYWRhcy4KICAgIC8vIFRhbWJlbSBlIHVzYWRvIHBhcmEgZ2VyYXIgaWQgcGFyYSBub3ZhcyBjYW1wYW5oYXMuCiAgICB1aW50IHB1YmxpYyBjb3VudDsKICAgIC8vIE1hcHBpbmcgZG8gaWQgcGFyYSBvIENhbXBhaWduCiAgICBtYXBwaW5nKHVpbnQgPT4gQ2FtcGFpZ24pIHB1YmxpYyBjYW1wYWlnbnM7CiAgICAvLyBNYXBwaW5nIGRvIGNhbXBhaWduIGlkID0+IGRvYWRvciA9PiB2YWxvciBwcm9tZXRpZG8KICAgIG1hcHBpbmcodWludCA9PiBtYXBwaW5nKGFkZHJlc3MgPT4gdWludCkpIHB1YmxpYyBwbGVkZ2VkQW1vdW50OwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX3Rva2VuKSB7CiAgICAgICAgdG9rZW4gPSBJRVJDMjAoX3Rva2VuKTsKICAgIH0KCiAgICBmdW5jdGlvbiBsYXVuY2goCiAgICAgICAgdWludCBfZ29hbCwKICAgICAgICB1aW50MzIgX3N0YXJ0QXQsCiAgICAgICAgdWludDMyIF9lbmRBdAogICAgKSBleHRlcm5hbCB7CiAgICAgICAgcmVxdWlyZShfc3RhcnRBdCA+PSBibG9jay50aW1lc3RhbXAsICJzdGFydCBhdCA8IG5vdyIpOwogICAgICAgIHJlcXVpcmUoX2VuZEF0ID49IF9zdGFydEF0LCAiZW5kIGF0IDwgc3RhcnQgYXQiKTsKICAgICAgICByZXF1aXJlKF9lbmRBdCA8PSBibG9jay50aW1lc3RhbXAgKyA5MCBkYXlzLCAiZW5kIGF0ID4gbWF4IGR1cmF0aW9uIik7CgogICAgICAgIGNvdW50ICs9IDE7CiAgICAgICAgY2FtcGFpZ25zW2NvdW50XSA9IENhbXBhaWduKHsKICAgICAgICAgICAgY3JlYXRvcjogbXNnLnNlbmRlciwKICAgICAgICAgICAgZ29hbDogX2dvYWwsCiAgICAgICAgICAgIHBsZWRnZWQ6IDAsCiAgICAgICAgICAgIHN0YXJ0QXQ6IF9zdGFydEF0LAogICAgICAgICAgICBlbmRBdDogX2VuZEF0LAogICAgICAgICAgICBjbGFpbWVkOiBmYWxzZQogICAgICAgIH0pOwoKICAgICAgICBlbWl0IExhdW5jaChjb3VudCwgbXNnLnNlbmRlciwgX2dvYWwsIF9zdGFydEF0LCBfZW5kQXQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNhbmNlbCh1aW50IF9pZCkgZXh0ZXJuYWwgewogICAgICAgIENhbXBhaWduIG1lbW9yeSBjYW1wYWlnbiA9IGNhbXBhaWduc1tfaWRdOwogICAgICAgIHJlcXVpcmUoY2FtcGFpZ24uY3JlYXRvciA9PSBtc2cuc2VuZGVyLCAibm90IGNyZWF0b3IiKTsKICAgICAgICByZXF1aXJlKGJsb2NrLnRpbWVzdGFtcCA8IGNhbXBhaWduLnN0YXJ0QXQsICJzdGFydGVkIik7CgogICAgICAgIGRlbGV0ZSBjYW1wYWlnbnNbX2lkXTsKICAgICAgICBlbWl0IENhbmNlbChfaWQpOwogICAgfQoKICAgIGZ1bmN0aW9uIHBsZWRnZSh1aW50IF9pZCwgdWludCBfYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgQ2FtcGFpZ24gc3RvcmFnZSBjYW1wYWlnbiA9IGNhbXBhaWduc1tfaWRdOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wID49IGNhbXBhaWduLnN0YXJ0QXQsICJub3Qgc3RhcnRlZCIpOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wIDw9IGNhbXBhaWduLmVuZEF0LCAiZW5kZWQiKTsKCiAgICAgICAgY2FtcGFpZ24ucGxlZGdlZCArPSBfYW1vdW50OwogICAgICAgIHBsZWRnZWRBbW91bnRbX2lkXVttc2cuc2VuZGVyXSArPSBfYW1vdW50OwogICAgICAgIHRva2VuLnRyYW5zZmVyRnJvbShtc2cuc2VuZGVyLCBhZGRyZXNzKHRoaXMpLCBfYW1vdW50KTsKCiAgICAgICAgZW1pdCBQbGVkZ2UoX2lkLCBtc2cuc2VuZGVyLCBfYW1vdW50KTsKICAgIH0KCiAgICBmdW5jdGlvbiB1bnBsZWRnZSh1aW50IF9pZCwgdWludCBfYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgQ2FtcGFpZ24gc3RvcmFnZSBjYW1wYWlnbiA9IGNhbXBhaWduc1tfaWRdOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wIDw9IGNhbXBhaWduLmVuZEF0LCAiZW5kZWQiKTsKCiAgICAgICAgY2FtcGFpZ24ucGxlZGdlZCAtPSBfYW1vdW50OwogICAgICAgIHBsZWRnZWRBbW91bnRbX2lkXVttc2cuc2VuZGVyXSAtPSBfYW1vdW50OwogICAgICAgIHRva2VuLnRyYW5zZmVyKG1zZy5zZW5kZXIsIF9hbW91bnQpOwoKICAgICAgICBlbWl0IFVucGxlZGdlKF9pZCwgbXNnLnNlbmRlciwgX2Ftb3VudCk7CiAgICB9CgogICAgZnVuY3Rpb24gY2xhaW0odWludCBfaWQpIGV4dGVybmFsIHsKICAgICAgICBDYW1wYWlnbiBzdG9yYWdlIGNhbXBhaWduID0gY2FtcGFpZ25zW19pZF07CiAgICAgICAgcmVxdWlyZShjYW1wYWlnbi5jcmVhdG9yID09IG1zZy5zZW5kZXIsICJub3QgY3JlYXRvciIpOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wID4gY2FtcGFpZ24uZW5kQXQsICJub3QgZW5kZWQiKTsKICAgICAgICByZXF1aXJlKGNhbXBhaWduLnBsZWRnZWQgPj0gY2FtcGFpZ24uZ29hbCwgInBsZWRnZWQgPCBnb2FsIik7CiAgICAgICAgcmVxdWlyZSghY2FtcGFpZ24uY2xhaW1lZCwgImNsYWltZWQiKTsKCiAgICAgICAgY2FtcGFpZ24uY2xhaW1lZCA9IHRydWU7CiAgICAgICAgdG9rZW4udHJhbnNmZXIoY2FtcGFpZ24uY3JlYXRvciwgY2FtcGFpZ24ucGxlZGdlZCk7CgogICAgICAgIGVtaXQgQ2xhaW0oX2lkKTsKICAgIH0KCiAgICBmdW5jdGlvbiByZWZ1bmQodWludCBfaWQpIGV4dGVybmFsIHsKICAgICAgICBDYW1wYWlnbiBtZW1vcnkgY2FtcGFpZ24gPSBjYW1wYWlnbnNbX2lkXTsKICAgICAgICByZXF1aXJlKGJsb2NrLnRpbWVzdGFtcCA+IGNhbXBhaWduLmVuZEF0LCAibm90IGVuZGVkIik7CiAgICAgICAgcmVxdWlyZShjYW1wYWlnbi5wbGVkZ2VkIDwgY2FtcGFpZ24uZ29hbCwgInBsZWRnZWQgPj0gZ29hbCIpOwoKICAgICAgICB1aW50IGJhbCA9IHBsZWRnZWRBbW91bnRbX2lkXVttc2cuc2VuZGVyXTsKICAgICAgICBwbGVkZ2VkQW1vdW50W19pZF1bbXNnLnNlbmRlcl0gPSAwOwogICAgICAgIHRva2VuLnRyYW5zZmVyKG1zZy5zZW5kZXIsIGJhbCk7CgogICAgICAgIGVtaXQgUmVmdW5kKF9pZCwgbXNnLnNlbmRlciwgYmFsKTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
