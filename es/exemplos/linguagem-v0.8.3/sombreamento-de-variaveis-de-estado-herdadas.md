# Sombreado de Variables de Estado Heredados

Al contrario de las funciones, las variables de estado no pueden sobreescribirse por redeclaración en el contrato hijo.

Vamos a aprender como sobreescribir correctamente las variables de estado heredadas.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract A {
    string public name = "Contract A";

    function getName() public view returns (string memory) {
        return name;
    }
}

// Sombreado no está permitido en Solidity 0.6
// Esto no compilará
// contract B is A {
//     string public name = "Contract B";
// }

contract C is A {
    // Esta es la forma correcta de sobreescribir las variables de estado heredadas.
    constructor() {
        name = "Contract C";
    }

    // C.getName devuelve "Contract C"
}
```
