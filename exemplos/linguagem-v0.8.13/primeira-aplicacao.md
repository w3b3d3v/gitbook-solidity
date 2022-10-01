# Primeira Aplicação

Aqui está um exemplo simples de contrato no qual você pode obter, incrementar e decrementar um contador em um contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    uint public count;

    // Função para obter à conta atual
    function get() public view returns (uint) {
        return count;
    }

    // Função para incrementar 1 à conta
    function inc() public {
        count += 1;
    }

    // Função para decrementar 1 à conta
    function dec() public {
        count -= 1;
    }
}
```
