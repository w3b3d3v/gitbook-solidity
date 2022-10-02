# Olá Mundo

`pragma` especifica a versão do compilador do Solidity.

```solidity
// SPDX-License-Identifier: MIT
// A versão do compilador deve ser maior que ou igual a 0.8.13 e menor que 0.9.0
pragma solidity ^0.8.13;

contract OlaMundo {
    string public greet = "Ola Mundo!";
}
```
## Teste no Remix

- [OlaMundo.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVAovLyBBIHZlcnNhbyBkbyBjb21waWxhZG9yIGRldmUgc2VyIG1haW9yIHF1ZSBvdSBpZ3VhbCBhIDAuOC4xMyBlIG1lbm9yIHF1ZSAwLjkuMApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IE9sYU11bmRvIHsKICAgIHN0cmluZyBwdWJsaWMgZ3JlZXQgPSAiT2xhIE11bmRvISI7Cn0=)

