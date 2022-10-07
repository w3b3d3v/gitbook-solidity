# Variables

Existen 3 tipos de variables en Solidity

* **local**
  * declarada dentro de una función
  * no se almacena en el blockchain
* **de estado**
  * declarada afuera de una función
  * se almacena en el blockchain
* **global** (proporciona información sobre el blockchain)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Variables {
  // Variables de estado son almacenadas en el blockchain.
  string public text = "Hello";
  uint public num = 123;

  function doSomething() public {
    // Variables locales no quedan guardadas en el blockchain.
    uint i = 456;

    // Aquí están algunas variables globales
    uint timestamp = block.timestamp; // Marca de tiempo del bloque actual
    address sender = msg.sender; // Dirección del remitente
  }
}
```
