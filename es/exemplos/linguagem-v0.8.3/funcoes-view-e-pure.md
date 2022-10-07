# Funciones View y Pure

Funciones Getter pueden ser declaradas`view` o `pure`.

Función `View` declara que no se cambiará ningún estado.

Función `Pure` declara que ninguna variable de estado será cambiada o leida.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ViewAndPure {
    uint public x = 1;

    // Promete que no modifica el estado.
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    // Promete que no modifica o lee desde un estado.
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
```
