# Primeira Aplicação

Aqui está um exemplo simples de contrato no qual você pode obter, incrementar e decrementar um contador em um contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

- [Contador.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnRhZG9yIHsKICAgIHVpbnQgcHVibGljIGNvdW50OwoKICAgIC8vIEZ1bmNhbyBwYXJhIG9idGVyIGEgY29udGEgYXR1YWwKICAgIGZ1bmN0aW9uIGdldCgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gY291bnQ7CiAgICB9CgogICAgLy8gRnVuw6fDo28gcGFyYSBpbmNyZW1lbnRhciAxIGEgY29udGEKICAgIGZ1bmN0aW9uIGluYygpIHB1YmxpYyB7CiAgICAgICAgY291bnQgKz0gMTsKICAgIH0KCiAgICAvLyBGdW7Dp8OjbyBwYXJhIGRlY3JlbWVudGFyIDEgYSBjb250YQogICAgZnVuY3Rpb24gZGVjKCkgcHVibGljIHsKICAgICAgICBjb3VudCAtPSAxOwogICAgfQp9)
