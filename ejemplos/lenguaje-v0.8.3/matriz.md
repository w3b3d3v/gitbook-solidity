# Matriz

Matrizes podem ter um tempo de compilação de tamanho fixo ou dinâmico.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Array {
    // Diversas formas de inicializar uma matriz
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Matriz de tamanho fixo, todos elementos começam em 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity pode retornar a matriz inteira.
    // Mas essa função deve ser evitada por matrizes
    // que aumentam indefinidamente em comprimento.
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // Adiciona elementos à matriz
        // Isso aumentará o comprimento da matriz de 1.
        arr.push(i);
    }

    function pop() public {
        // Remove o último elemento da matriz
        // Isso diminuirá o comprimento da matriz de 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function remove(uint index) public {
        // Delete não altera o comprimento da matriz.
        // Ele reinicia o valor no índice para o valor padrão,
        // nesse caso 0
        delete arr[index];
    }

    function examples() external {
        // cria uma matriz na memória, somente as de tamanho fixo podem ser criadas
        uint[] memory a = new uint[](5);
    }
}
```

#### Exemplos de remoção de um elemento da matriz <a href="#examples-of-removing-array-element" id="examples-of-removing-array-element"></a>

Remova elementos da matriz trocando elementos da direita para a esquerda.

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

Remova um elemento da matriz copiando o último elemento para o lugar a ser removido

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ArrayReplaceFromEnd {
    uint[] public arr;

    // Apagar um elemento cria um espaço na matriz.
    // Um truque para conservar a matriz compacta é
    // mover o último elemento para um lugar para ser apagado.
    function remove(uint index) public {
        // Mova o último elemento para o local onde ele será apagado.
        arr[index] = arr[arr.length - 1];
        // Remova o último elemento
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
