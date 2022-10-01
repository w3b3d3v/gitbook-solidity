# Leyendo y escribiendo Variables de Estado

Para escribir o actualizar una variable de estado necesitas enviar una transacción.

Por otro lado, puedes leer las variables de estado, gratuitamente, sin ninguna tasa de transacción.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract SimpleStorage {
    // Variable de estado que almacena un número
    uint public num;

    // Necesitas enviar una transacción para escribir en una variable de estado.
    function set(uint _num) public {
        num = _num;
    }

    // Puedes leer una variable de estado sin enviar una transacción.
    function get() public view returns (uint) {
        return num;
    }
}
```
