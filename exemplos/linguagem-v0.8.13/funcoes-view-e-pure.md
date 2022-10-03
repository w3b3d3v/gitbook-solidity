# Funções View e Pure

Funções Getter podem ser declaradas com `view` ou `pure`.

Função `View` declara que nenhum estado será alterado.

Função `Pure` declara que nenhuma variável de estado será alterada ou lida.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ViewAndPure {
    uint public x = 1;

    // Promete não modificar o estado.
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    // Promete não modificar ou ler o estado.
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
```

## Teste no Remix

- [ViewAndPure.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFZpZXdBbmRQdXJlIHsKICAgIHVpbnQgcHVibGljIHggPSAxOwoKICAgIC8vIFByb21ldGUgbmFvIG1vZGlmaWNhciBvIGVzdGFkby4KICAgIGZ1bmN0aW9uIGFkZFRvWCh1aW50IHkpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4geCArIHk7CiAgICB9CgogICAgLy8gUHJvbWV0ZSBuYW8gbW9kaWZpY2FyIG91IGxlciBvIGVzdGFkby4KICAgIGZ1bmN0aW9uIGFkZCh1aW50IGksIHVpbnQgaikgcHVibGljIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBpICsgajsKICAgIH0KfQ==)
