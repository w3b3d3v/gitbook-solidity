# Primeira Aplicação

Aqui está um exemplo simples de contrato no qual você pode obter, incrementar e decrementar um contador em um contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Contador {
    uint public count;

    // Função para obter à conta atual
    function get() public view returns (uint) {
        return count;
    }

    // Função para incrementar 1 à conta
    function inc() public {
        count += 1;
    }

    // Função para decrementar 1 à conta
    function dec() public {
        count -= 1;
    }
}
```

## Teste no Remix

- [Contador.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IENvbnRhZG9yIHsKICAgIHVpbnQgcHVibGljIGNvdW50OwoKICAgIC8vIEZ1bmNhbyBwYXJhIG9idGVyIGEgY29udGEgYXR1YWwKICAgIGZ1bmN0aW9uIGdldCgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gY291bnQ7CiAgICB9CgogICAgLy8gRnVuY2FvIHBhcmEgaW5jcmVtZW50YXIgMSBhIGNvbnRhCiAgICBmdW5jdGlvbiBpbmMoKSBwdWJsaWMgewogICAgICAgIGNvdW50ICs9IDE7CiAgICB9CgogICAgLy8gRnVuY2FvIHBhcmEgZGVjcmVtZW50YXIgMSBhIGNvbnRhCiAgICBmdW5jdGlvbiBkZWMoKSBwdWJsaWMgewogICAgICAgIGNvdW50IC09IDE7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
