# Constantes

Constantes son variables que no pueden ser modificadas.

Su valor es escrito en el código (hardcoded) y el uso de constantes puede ahorrar costo de gas.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Constants {
    // las constantes se escriben en mayúscula por convención de codificación
    address public constant MY_ADDRESS = 0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;
}
```
