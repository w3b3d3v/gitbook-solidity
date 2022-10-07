# Inmutables

Variables inmutables son como las constantes. Los valores de esas variables pueden ser definidos dentro del constructor pero no pueden ser modificados después.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Immutable {
    // las variables inmutables se escriben en mayúscula por convención de codificación
    address public immutable MY_ADDRESS;
    uint public immutable MY_UINT;

    constructor(uint _myUint) {
        MY_ADDRESS = msg.sender;
        MY_UINT = _myUint;
    }
}
```
