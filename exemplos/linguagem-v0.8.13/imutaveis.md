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

## Experimente no Remix

- [Constantes.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnN0YW50cyB7CiAgICAvLyBDb252ZW5jYW8gZGUgY29kaWZpY2FjYW8gcGFyYSB2YXJpYXZlaXMgY29uc3RhbnRlcyBlbSBtYWl1c2N1bGFzCiAgICBhZGRyZXNzIHB1YmxpYyBjb25zdGFudCBNWV9BRERSRVNTID0gMHg3Nzc3ODg4ODk5OTlBYUFBYkJiYkNjY2NkZERkZWVlRWZGRmZDY0NjOwogICAgdWludCBwdWJsaWMgY29uc3RhbnQgTVlfVUlOVCA9IDEyMzsKfQ==)
