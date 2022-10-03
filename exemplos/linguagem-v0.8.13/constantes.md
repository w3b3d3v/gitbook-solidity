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

## Teste no Remix

- [Constantes.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnN0YW50ZXMgewogICAgLy8gQ29udmVuY2FvIGRlIGNvZGlmaWNhY2FvIHBhcmEgdmFyaWF2ZWlzIGNvbnN0YW50ZXMgZW0gbWFpdXNjdWxhcwogICAgYWRkcmVzcyBwdWJsaWMgY29uc3RhbnQgTVlfQUREUkVTUyA9IDB4Nzc3Nzg4ODg5OTk5QWFBQWJCYmJDY2NjZGREZGVlZUVmRkZmQ2NDYzsKICAgIHVpbnQgcHVibGljIGNvbnN0YW50IE1ZX1VJTlQgPSAxMjM7Cn0=)
