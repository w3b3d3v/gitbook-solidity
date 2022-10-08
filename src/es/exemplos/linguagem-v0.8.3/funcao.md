# Funciones

Existen diversas formas de devolver salidas desde una función.

Funciones públicas no pueden aceptar ciertos tipos de datos como entradas o salidas

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Function {
    // Funciones pueden devolver múltiples valores.
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

    // Valores devueltos pueden ser por nombres.
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

    // Valores devueltos pueden ser asignados a sus nombres.
    // En este caso la sentencia 'return' puede ser omitida.
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

    // Usa asignación por desestructuración cuando se invoca a otra
    // función que devuelve múltiples valores.
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

        // Valores pueden ser dejados por fuera.
        (uint x, , uint y) = (4, 5, 6);

        return (i, b, j, x, y);
    }

    // No usar map ni para entrada ni para salida
    
    // Puedes usar arreglos para la entrada
    function arrayInput(uint[] memory _arr) public {}

    // Puedes usar arreglos para la salida
    uint[] public arr;

    function arrayOutput() public view returns (uint[] memory) {
        return arr;
    }
}

// Invoca funciones con clave-valor de entrada
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