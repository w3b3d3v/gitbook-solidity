# Arreglo

Un arreglo puede tener un tamaño fijo por tiempo de compilación o un tamaño dinámico.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Array {
    // Diversas formas de inicializar un arreglo
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Arreglo de tamaño fijo, todos los elementos inicializados en 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity puede devolver el array entero.
    // Pero esa función debe ser evitada por arreglos
    // que aumentan indefinidamente en longitud.
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // Adiciona elementos al arreglo
        // Eso aumentará la longitud del arreglo por 1.
        arr.push(i);
    }

    function pop() public {
        // Remueve el último elemento del arreglo
        // Eso disminuirá la longitud del arreglo por 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function remove(uint index) public {
        // Eliminar no altera la longitud del arreglo.
        // Reinicia el valor del índice a su valor por defecto,
        // en este caso 0
        delete arr[index];
    }

    function examples() external {
        // crea un arreglo en la memoria, solamente los de tamaño fijo pueden ser creados
        uint[] memory a = new uint[](5);
    }
}
```

#### Ejemplos de remoción de un elemento del arreglo <a href="#examples-of-removing-array-element" id="examples-of-removing-array-element"></a>

Remueve elementos del arreglo cambiando elementos de derecha a izquierda.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ArrayRemoveByShifting {
    // [1, 2, 3] -- remove(1) --> [1, 3, 3] --> [1, 3]
    // [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] --> [1, 2, 4, 5, 6]
    // [1, 2, 3, 4, 5, 6] -- remove(0) --> [2, 3, 4, 5, 6, 6] --> [2, 3, 4, 5, 6]
    // [1] -- remove(0) --> [1] --> []

    uint[] public arr;

    function remove(uint _index) public {
        require(_index < arr.length, "index out of bound");

        for (uint i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function test() external {
        arr = [1, 2, 3, 4, 5];
        remove(2);
        // [1, 2, 4, 5]
        assert(arr[0] == 1);
        assert(arr[1] == 2);
        assert(arr[2] == 4);
        assert(arr[3] == 5);
        assert(arr.length == 4);

        arr = [1];
        remove(0);
        // []
        assert(arr.length == 0);
    }
}
```

Remueve un elemento copiando el último elemento al lugar donde está el elemento a ser removido

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ArrayReplaceFromEnd {
    uint[] public arr;

    // Eliminar un elemento crea un espacio en el arreglo.
    // Un truco para conservar el arreglo compacto es
    // mover el último elemento al lugar del que será eliminado
    function remove(uint index) public {
        // Mueva el último elemento al lugar donde está el elemento a ser removido.
        arr[index] = arr[arr.length - 1];
        // Remueve el último elemento
        arr.pop();
    }

    function test() public {
        arr = [1, 2, 3, 4];

        remove(1);
        // [1, 4, 3]
        assert(arr.length == 3);
        assert(arr[0] = 1);
        assert(arr[1] = 4);
        assert(arr[2] = 3);

        remove(2);
        // [1, 4]
        assert(arr.length == 2);
        assert(arr[0] = 1);
        assert(arr[1] = 4);
    }
}
```
