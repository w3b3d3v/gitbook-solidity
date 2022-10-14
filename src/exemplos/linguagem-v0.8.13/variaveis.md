# Variáveis

Existem 3 tipos de variáveis no Solidity

- **Local**
  - Declarado dentro de uma função
  - Não armazenada na blockchain
- **Estado**
  - Declarado fora de uma função
  - Armazenada na blockchain
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

## Teste no Remix

- [Variaveis.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFZhcmlhdmVpcyB7CiAgICAvLyBWYXJpYXZlaXMgZGUgZXN0YWRvIHNhbyBhcm1hemVuYWRhcyBubyBibG9ja2NoYWluLgogICAgc3RyaW5nIHB1YmxpYyB0ZXh0ID0gIkhlbGxvIjsKICAgIHVpbnQgcHVibGljIG51bSA9IDEyMzsKCiAgICBmdW5jdGlvbiBkb1NvbWV0aGluZygpIHB1YmxpYyB7CiAgICAgICAgLy8gVmFyaWF2ZWlzIGxvY2FpcyBuYW8gZmljYW0gc2FsdmFzIG5vIGJsb2NrY2hhaW4uCiAgICAgICAgdWludCBpID0gNDU2OwoKICAgICAgICAvLyBBcXVpIGVzdGFvIGFsZ3VtYXMgdmFyaWF2ZWlzIGdsb2JhaXMKICAgICAgICB1aW50IHRpbWVzdGFtcCA9IGJsb2NrLnRpbWVzdGFtcDsgLy8gUmVnaXN0cm8gZGEgaG9yYSBkbyBibG9jbyBhdHVhbAogICAgICAgIGFkZHJlc3Mgc2VuZGVyID0gbXNnLnNlbmRlcjsgLy8gRW5kZXJlY28gZG8gcmVtZXRlbnRlCiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
