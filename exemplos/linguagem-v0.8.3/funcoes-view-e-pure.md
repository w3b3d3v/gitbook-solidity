# Funções View e Pure

Funções Getter podem ser declaradas`view` or `pure`.

Função `View` declara que nenhum estado será mudado.

Função `Pure` declara que nenhuma variável de estado será mudada ou lida.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ViewAndPure {
    uint public x = 1;

    // Promete que não haja modificação do estado.
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    // Promete não haja modificação ou leitura de um estado.
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
```
