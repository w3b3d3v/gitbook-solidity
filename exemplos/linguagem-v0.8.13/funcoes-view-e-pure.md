# Funções View e Pure

Funções Getter podem ser declaradas com `view` ou `pure`.

Função `View` declara que nenhum estado será alterado.

Função `Pure` declara que nenhuma variável de estado será alterada ou lida.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ViewAndPure {
    uint public x = 1;

    // Promete que não vai ter modificação do estado.
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    // Promete não vai ter modificação ou leitura de um estado.
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
```

## Experimente no Remix

- [Imutavel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFZpZXdBbmRQdXJlIHsKICAgIHVpbnQgcHVibGljIHggPSAxOwoKICAgIC8vIFByb21ldGUgcXVlIG5hbyB2YWkgdGVyIG1vZGlmaWNhY2FvIGRvIGVzdGFkby4KICAgIGZ1bmN0aW9uIGFkZFRvWCh1aW50IHkpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4geCArIHk7CiAgICB9CgogICAgLy8gUHJvbWV0ZSBuYW8gdmFpIHRlciBtb2RpZmljYWNhbyBvdSBsZWl0dXJhIGRlIHVtIGVzdGFkby4KICAgIGZ1bmN0aW9uIGFkZCh1aW50IGksIHVpbnQgaikgcHVibGljIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBpICsgajsKICAgIH0KfQ==)
