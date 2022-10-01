# Variáveis

Existem 3 tipos de variáveis no Solidity

- **Local**
  - Declarada dentro de uma função
  - Não armazenada no blockchain
- **Estado**
  - Declarada fora de uma função
  - Armazenada no blockchain
- **Global** (fornece informação sobre o blockchain)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Variaveis {
    // Variáveis de estado são armazenadas no blockchain.
    string public text = "Hello";
    uint public num = 123;

    function doSomething() public {
        // Variáveis locais não ficam salvas no blockchain.
        uint i = 456;

        // Aqui estão algumas variáveis globais
        uint timestamp = block.timestamp; // Registro da hora do bloco atual
        address sender = msg.sender; // Endereço do remetente
    }
}
```

## Experimente no Remix

- [Variaveis.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFZhcmlhdmVpcyB7CiAgICAvLyBWYXJpYXZlaXMgZGUgZXN0YWRvIHNhbyBhcm1hemVuYWRhcyBubyBibG9ja2NoYWluLgogICAgc3RyaW5nIHB1YmxpYyB0ZXh0ID0gXCJIZWxsb1wiOwogICAgdWludCBwdWJsaWMgbnVtID0gMTIzOwoKICAgIGZ1bmN0aW9uIGRvU29tZXRoaW5nKCkgcHVibGljIHsKICAgICAgICAvLyBWYXJpYXZlaXMgbG9jYWlzIG5hbyBmaWNhbSBzYWx2YXMgbm8gYmxvY2tjaGFpbi4KICAgICAgICB1aW50IGkgPSA0NTY7CgogICAgICAgIC8vIEFxdWkgZXN0YW8gYWxndW1hcyB2YXJpYXZlaXMgZ2xvYmFpcwogICAgICAgIHVpbnQgdGltZXN0YW1wID0gYmxvY2sudGltZXN0YW1wOyAvLyBSZWdpc3RybyBkYSBob3JhIGRvIGJsb2NvIGF0dWFsCiAgICAgICAgYWRkcmVzcyBzZW5kZXIgPSBtc2cuc2VuZGVyOyAvLyBFbmRlcmVjbyBkbyByZW1ldGVudGUKICAgIH0KfQ==)
