# Librería

Las librerías son similares a los contratos, pero no puedes declarar ninguna variable de estado y tampoco no puedes enviar ether.

Una librería está integrada al contrato si todas las funciones de la librería son internas.

De otra forma, la librería debe ser desplegada y luego enlazada antes de que el contrato sea desplegada.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint) {
        uint z = x + y;
        require(z >= x, "uint overflow");

        return z;
    }
}

library Math {
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // else z = 0 (default value)
    }
}

contract TestSafeMath {
    using SafeMath for uint;

    uint public MAX_UINT = 2**256 - 1;

    function testAdd(uint x, uint y) public pure returns (uint) {
        return x.add(y);
    }

    function testSquareRoot(uint x) public pure returns (uint) {
        return Math.sqrt(x);
    }
}

// La función Array borra elementos en el índice y reorganiza el array
// así no hay huecos entre los elementos.
library Array {
    function remove(uint[] storage arr, uint index) public {
        // Mueve el último elemento hacia el lugar que se va a borrar
        require(arr.length > 0, "Can't remove from empty array");
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
}

contract TestArray {
    using Array for uint[];

    uint[] public arr;

    function testArrayRemove() public {
        for (uint i = 0; i < 3; i++) {
            arr.push(i);
        }

        arr.remove(1);

        assert(arr.length == 2);
        assert(arr[0] == 0);
        assert(arr[1] == 2);
    }
}
```
