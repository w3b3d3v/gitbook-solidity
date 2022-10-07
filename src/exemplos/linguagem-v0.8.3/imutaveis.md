# Imutáveis

Variáveis imutáveis são como as constantes. Os valores dessas variáveis podem ser definidos dentro do construtor mas não podem ser modificados depois.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Immutable {
    // convenção de codificação de letras maiúsculas para variáveis imutáveis
    address public immutable MY_ADDRESS;
    uint public immutable MY_UINT;

    constructor(uint _myUint) {
        MY_ADDRESS = msg.sender;
        MY_UINT = _myUint;
    }
}
```
