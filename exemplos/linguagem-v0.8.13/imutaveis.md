# Imutáveis

Variáveis imutáveis são como as constantes. Os valores dessas variáveis podem ser definidos dentro do construtor mas não podem ser modificados depois.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Imutavel {
    // Convenção de codificação para variáveis constantes em maiúsculas
    address public immutable MY_ADDRESS;
    uint public immutable MY_UINT;

    constructor(uint _myUint) {
        MY_ADDRESS = msg.sender;
        MY_UINT = _myUint;
    }
}
```

## Teste no Remix

- [Imutavel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEltdXRhdmVsIHsKICAgIC8vIENvbnZlbmNhbyBkZSBjb2RpZmljYWNhbyBwYXJhIHZhcmlhdmVpcyBjb25zdGFudGVzIGVtIG1haXVzY3VsYXMKICAgIGFkZHJlc3MgcHVibGljIGltbXV0YWJsZSBNWV9BRERSRVNTOwogICAgdWludCBwdWJsaWMgaW1tdXRhYmxlIE1ZX1VJTlQ7CgogICAgY29uc3RydWN0b3IodWludCBfbXlVaW50KSB7CiAgICAgICAgTVlfQUREUkVTUyA9IG1zZy5zZW5kZXI7CiAgICAgICAgTVlfVUlOVCA9IF9teVVpbnQ7CiAgICB9Cn0=)
