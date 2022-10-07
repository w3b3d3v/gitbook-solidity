# Constantes

Constantes são variáveis que não podem ser modificadas.

Seu valor é codificado e o uso de constantes pode economizar no custo de gás.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Constants {
    // convenção de codificação de letras maiúsculas para constantes
    address public constant MY_ADDRESS = 0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;
}
```
