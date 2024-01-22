# Função

Existem diversas formas de retornar saídas de uma função.

Funções públicas não podem aceitar certos tipos de dados como entradas e saídas

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Funcao {
    // Funções podem retornar valores múltiplos.
    function returnMany()
        public
        pure
        returns (
            uint,
            bool,
            uint
        )
    {
        return (1, true, 2);
    }

    // Valores retornados podem ser nomeados.
    function named()
        public
        pure
        returns (
            uint x,
            bool b,
            uint y
        )
    {
        return (1, true, 2);
    }

    // Valores de retorno podem ser atribuídos a seus nomes.
    // Nesse caso, a instrução de retorno pode ser omitida.
    function assigned()
        public
        pure
        returns (
            uint x,
            bool b,
            uint y
        )
    {
        x = 1;
        b = true;
        y = 2;
    }

    // Usa atribuição de desestruturação ao chamar outro
    // função que retorna múltiplos valores.
    function destructingAssigments()
        public
        pure
        returns (
            uint,
            bool,
            uint,
            uint,
            uint
        )
    {
        (uint i, bool b, uint j) = returnMany();

        // Valores podem ser deixados de fora.
        (uint x, , uint y) = (4, 5, 6);

        return (i, b, j, x, y);
    }

    // Não pode usar mapa nem para entrada nem para saída

    // Pode usar array para entrada
    function arrayInput(uint[] memory _arr) public {}

    // Pode usar array para saída
    uint[] public arr;

    function arrayOutput() public view returns (uint[] memory) {
        return arr;
    }
}

// Função de chamada com entradas de chave-valor
contract XYZ {
    function someFuncWithManyInputs(
        uint x,
        uint y,
        uint z,
        address a,
        bool b,
        string memory c
    ) public pure returns (uint) {}

    function callFunc() external pure returns (uint) {
        return someFuncWithManyInputs(1, 2, 3, address(0), true, "c");
    }

    function callFuncWithKeyValue() external pure returns (uint) {
        return
            someFuncWithManyInputs({a: address(0), b: true, c: "c", x: 1, y: 2, z: 3});
    }
}
```

## Teste no Remix

- [Funcao.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEZ1bmNhbyB7CiAgICAvLyBGdW5jb2VzIHBvZGVtIHJldG9ybmFyIHZhbG9yZXMgbXVsdGlwbG9zLgogICAgZnVuY3Rpb24gcmV0dXJuTWFueSgpCiAgICAgICAgcHVibGljCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKAogICAgICAgICAgICB1aW50LAogICAgICAgICAgICBib29sLAogICAgICAgICAgICB1aW50CiAgICAgICAgKQogICAgewogICAgICAgIHJldHVybiAoMSwgdHJ1ZSwgMik7CiAgICB9CgogICAgLy8gVmFsb3JlcyByZXRvcm5hZG9zIHBvZGVtIHNlciBub21lYWRvcy4KICAgIGZ1bmN0aW9uIG5hbWVkKCkKICAgICAgICBwdWJsaWMKICAgICAgICBwdXJlCiAgICAgICAgcmV0dXJucyAoCiAgICAgICAgICAgIHVpbnQgeCwKICAgICAgICAgICAgYm9vbCBiLAogICAgICAgICAgICB1aW50IHkKICAgICAgICApCiAgICB7CiAgICAgICAgcmV0dXJuICgxLCB0cnVlLCAyKTsKICAgIH0KCiAgICAvLyBWYWxvcmVzIGRlIHJldG9ybm8gcG9kZW0gc2VyIGF0cmlidWlkb3MgYSBzZXVzIG5vbWVzLgogICAgLy8gTmVzc2UgY2FzbywgYSBpbnN0cnVjYW8gZGUgcmV0b3JubyBwb2RlIHNlciBvbWl0aWRhLgogICAgZnVuY3Rpb24gYXNzaWduZWQoKQogICAgICAgIHB1YmxpYwogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgdWludCB4LAogICAgICAgICAgICBib29sIGIsCiAgICAgICAgICAgIHVpbnQgeQogICAgICAgICkKICAgIHsKICAgICAgICB4ID0gMTsKICAgICAgICBiID0gdHJ1ZTsKICAgICAgICB5ID0gMjsKICAgIH0KCiAgICAvLyBVc2EgYXRyaWJ1aWNhbyBkZSBkZXNlc3RydXR1cmFjYW8gYW8gY2hhbWFyIG91dHJvCiAgICAvLyBmdW5jYW8gcXVlIHJldG9ybmEgbXVsdGlwbG9zIHZhbG9yZXMuCiAgICBmdW5jdGlvbiBkZXN0cnVjdGluZ0Fzc2lnbWVudHMoKQogICAgICAgIHB1YmxpYwogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgdWludCwKICAgICAgICAgICAgYm9vbCwKICAgICAgICAgICAgdWludCwKICAgICAgICAgICAgdWludCwKICAgICAgICAgICAgdWludAogICAgICAgICkKICAgIHsKICAgICAgICAodWludCBpLCBib29sIGIsIHVpbnQgaikgPSByZXR1cm5NYW55KCk7CgogICAgICAgIC8vIFZhbG9yZXMgcG9kZW0gc2VyIGRlaXhhZG9zIGRlIGZvcmEuCiAgICAgICAgKHVpbnQgeCwgLCB1aW50IHkpID0gKDQsIDUsIDYpOwoKICAgICAgICByZXR1cm4gKGksIGIsIGosIHgsIHkpOwogICAgfQoKICAgIC8vIE5hbyBwb2RlIHVzYXIgbWFwYSBuZW0gcGFyYSBlbnRyYWRhIG5lbSBwYXJhIHNhaWRhCgogICAgLy8gUG9kZSB1c2FyIGFycmF5IHBhcmEgZW50cmFkYQogICAgZnVuY3Rpb24gYXJyYXlJbnB1dCh1aW50W10gbWVtb3J5IF9hcnIpIHB1YmxpYyB7fQoKICAgIC8vIFBvZGUgdXNhciBhcnJheSBwYXJhIHNhaWRhCiAgICB1aW50W10gcHVibGljIGFycjsKCiAgICBmdW5jdGlvbiBhcnJheU91dHB1dCgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnRbXSBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gYXJyOwogICAgfQp9CgovLyBGdW5jYW8gZGUgY2hhbWFkYSBjb20gZW50cmFkYXMgZGUgY2hhdmUtdmFsb3IKY29udHJhY3QgWFlaIHsKICAgIGZ1bmN0aW9uIHNvbWVGdW5jV2l0aE1hbnlJbnB1dHMoCiAgICAgICAgdWludCB4LAogICAgICAgIHVpbnQgeSwKICAgICAgICB1aW50IHosCiAgICAgICAgYWRkcmVzcyBhLAogICAgICAgIGJvb2wgYiwKICAgICAgICBzdHJpbmcgbWVtb3J5IGMKICAgICkgcHVibGljIHB1cmUgcmV0dXJucyAodWludCkge30KCiAgICBmdW5jdGlvbiBjYWxsRnVuYygpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBzb21lRnVuY1dpdGhNYW55SW5wdXRzKDEsIDIsIDMsIGFkZHJlc3MoMCksIHRydWUsICJjIik7CiAgICB9CgogICAgZnVuY3Rpb24gY2FsbEZ1bmNXaXRoS2V5VmFsdWUoKSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4KICAgICAgICAgICAgc29tZUZ1bmNXaXRoTWFueUlucHV0cyh7YTogYWRkcmVzcygwKSwgYjogdHJ1ZSwgYzogImMiLCB4OiAxLCB5OiAyLCB6OiAzfSk7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
