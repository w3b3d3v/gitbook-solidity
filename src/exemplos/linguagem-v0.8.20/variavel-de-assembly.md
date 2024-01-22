# Assembly Variable

Exemplo de como declarar variáveis dentro do `assembly`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyVariable {
    function yul_let() public pure returns (uint z) {
        assembly {
            // A linguagem utilizada para assembly se chama Yul
            // Variáveis locais
            let x := 123
            z := 456
        }
    }
}
```

## Teste no Remix

- [AssemblyVariable.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5VmFyaWFibGUgewogICAgZnVuY3Rpb24geXVsX2xldCgpIHB1YmxpYyBwdXJlIHJldHVybnMgKHVpbnQgeikgewogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgLy8gQSBsaW5ndWFnZW0gdXRpbGl6YWRhIHBhcmEgYXNzZW1ibHkgc2UgY2hhbWEgWXVsCiAgICAgICAgICAgIC8vIFZhcmlhdmVpcyBsb2NhaXMKICAgICAgICAgICAgbGV0IHggOj0gMTIzCiAgICAgICAgICAgIHogOj0gNDU2CiAgICAgICAgfQogICAgfQp9=&version=soljson-v0.8.20+commit.a1b79de6.js)