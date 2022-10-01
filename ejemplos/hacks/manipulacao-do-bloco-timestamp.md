# Manipulação do Bloco Timestamp

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

`block.timestamp` podem ser manipulados por mineradores com as seguintes limitações

* não pode ser carimbado com um tempo anterior ao de seu bloco pai
* não pode estar muito longe no futuro

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Roulette é um jogo onde você pode ganhar todo Ether num contrato
se você conseguir submeter uma transação num tempo específico.
Um jogador precisa enviar 10 Ether e vence se o block.timestamp % 15 == 0.
*/

/*
1. Implante o Roulette com 10 Ether
2. Eve roda um poderoso minerador que pode manipular o bloco timestamp.
3. Eve configura o block.timestamp para um número no futuro que é divisível por
   15 e encontra o bloco hash alvo.
4. O bloco de Eve é incluído na chain com sucesso, Eve ganha o jogo
   Roulette.
*/

contract Roulette {
    uint public pastBlockTime;

    constructor() payable {}

    function spin() external payable {
        require(msg.value == 10 ether); // must send 10 ether to play
        require(block.timestamp != pastBlockTime); // only 1 transaction per block

        pastBlockTime = block.timestamp;

        if (block.timestamp % 15 == 0) {
            (bool sent, ) = msg.sender.call{value: address(this).balance}("");
            require(sent, "Failed to send Ether");
        }
    }
}
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Não use `block.timestamp` para uma fonte de entropia e número aleatório
