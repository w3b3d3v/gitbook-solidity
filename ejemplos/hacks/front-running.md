# Front Running

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Transações levam algum tempo antes de serem mineradas. Um invasor pode observar o pool de transações e enviar uma transação, inclui-la num bloco antes da transação original. Esse mecanismo pode ser usado para reordenar as transações em benefício dos invasores.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Alice cria um jogo de advinhação.
Você ganha 10 ether se você encontrar o string correto que bata com o hash alvo
Vejamos como esse contrato é vulnerável para front running.
*/

/*
1. Alice implanta FindThisHash com 10 Ether.
2. Bob encontra o string correto que bate com o hash alvo. ("Ethereum")
3. Bob chama solve("Ethereum") com o preço de gás estabelecido em 15 gwei.
4. Eve está observando o pool das transações para submeter uma resposta.
5. Eve vê a resposta de Bob e chama solve("Ethereum") com um preço de gás mais 
   alto do que o de Bob (100 gwei).
6. A transação de Eve foi minerada antes da transação de Bob.
   Eve ganha a recompensa de 10 ether.

O que aconteceu?
Transações levam algum tempo antes de serem mineradas.
Transações que ainda não foram mineradas são colocadas no pool de transações.
Transações com preço de gás mais alto são tipicamente mineradas primeiro.
Um invasor obtém a resposta de pool de transações, envia uma transação com um
preço de gás mais alto, de forma que sua transação será incluída num bloco
antes do original.
*/

contract FindThisHash {
    bytes32 public constant hash =
        0x564ccaf7594d66b1eaaea24fe01f0585bf52ee70852af4eac0cc4b04711cd0e2;

    constructor() payable {}

    function solve(string memory solution) public {
        require(hash == keccak256(abi.encodePacked(solution)), "Incorrect answer");

        (bool sent, ) = msg.sender.call{value: 10 ether}("");
        require(sent, "Failed to send Ether");
    }
}
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* use esquema de commit-reveal
* use envio de submarino
