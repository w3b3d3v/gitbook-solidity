# Constantes

Constantes são variáveis que não podem ser modificadas.

Seu valor é codificado e o uso de constantes pode economizar no custo de gás.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Constantes {
    // Convenção de codificação para variáveis constantes em maiúsculas
    address public constant MY_ADDRESS = 0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;
}
```

## Experimente no Remix

- [Constantes.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnN0YW50cyB7CiAgICAvLyBDb252ZW5jYW8gZGUgY29kaWZpY2FjYW8gcGFyYSB2YXJpYXZlaXMgY29uc3RhbnRlcyBlbSBtYWl1c2N1bGFzCiAgICBhZGRyZXNzIHB1YmxpYyBjb25zdGFudCBNWV9BRERSRVNTID0gMHg3Nzc3ODg4ODk5OTlBYUFBYkJiYkNjY2NkZERkZWVlRWZGRmZDY0NjOwogICAgdWludCBwdWJsaWMgY29uc3RhbnQgTVlfVUlOVCA9IDEyMzsKfQ==)
