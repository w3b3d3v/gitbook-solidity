# Primera Aplicación

Aquí está un ejemplo simple de contrato en el cual puedes obtener, aumentar y disminuir el valor de un contador.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Counter {
    uint public count;

    // Función que obtiene el valor actual del contador
    function get() public view returns (uint) {
        return count;
    }

    // Función que aumenta en 1 el contador
    function inc() public {
        count += 1;
    }

    // Función que disminuye en 1 el contador
    function dec() public {
        count -= 1;
    }
}
```
