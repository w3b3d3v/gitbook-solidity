# Função

Existem diversas formas de retornar saídas de uma função.

Funções públicas não podem aceitar certos tipos de dados como entradas e saídas

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Function {
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

    // Valores retornados podem ser atribuídos a seus nomes.
    // Nesse caso a afirmação retornada pode ser omitida.
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

    // Usa atribuição de desestruturação quando chama uma outra
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
    
    // Pode usar matriz para entrada
    function arrayInput(uint[] memory _arr) public {}

    // Pode usar matriz para saída
    uint[] public arr;

    function arrayOutput() public view returns (uint[] memory) {
        return arr;
    }
}
```
