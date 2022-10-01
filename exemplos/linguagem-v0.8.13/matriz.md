# Array (lista)

O `array` pode ter um tamanho fixo em tempo de compilação ou um tamanho dinâmico.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Array {
    // Diversas formas de inicializar uma array
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Array de tamanho fixo, todos elementos começam em 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity pode retornar o array inteiro.
    // Mas essa função deve ser evitada para arrays
    // que aumentam indefinidamente em comprimento.
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // Adiciona elementos ao array
        // Isso aumentará o comprimento do array em 1.
        arr.push(i);
    }

    function pop() public {
        // Remove o último elemento do array
        // Isso diminuirá o comprimento da array em 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function remove(uint index) public {
        // Excluir não altera o comprimento do array.
        // Ele reinicia o valor no índice para o valor padrão,
        // nesse caso 0
        delete arr[index];
    }

    function examples() external {
        // cria array na memória, somente as de tamanho fixo podem ser criadas
        uint[] memory a = new uint[](5);
    }
}
```

#### Exemplos de remoção de um elemento da array <a href="#examples-of-removing-array-element" id="examples-of-removing-array-element"></a>

Remova elementos da array trocando elementos da direita com o da esquerda.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract RemocaoDeElemento {
    // [1, 2, 3] -- remove(1) --> [1, 3, 3] --> [1, 3]
    // [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] --> [1, 2, 4, 5, 6]
    // [1, 2, 3, 4, 5, 6] -- remove(0) --> [2, 3, 4, 5, 6, 6] --> [2, 3, 4, 5, 6]
    // [1] -- remove(0) --> [1] --> []

    uint[] public arr;

    function remove(uint _index) public {
        require(_index < arr.length, "index fora do limite");

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

Remova um elemento da array copiando o último elemento para o lugar a ser removido

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract RemovendoSubstituindoPeloFinal {
    uint[] public arr;

    // Apagar um elemento cria um espaço no array.
    // Um truque para manter o array compacto é
    // mover o último elemento para o local a ser apagado.
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

## Experimente no Remix

- [Array.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEFycmF5IHsKICAgIC8vIERpdmVyc2FzIGZvcm1hcyBkZSBpbmljaWFsaXphciB1bWEgYXJyYXkKICAgIHVpbnRbXSBwdWJsaWMgYXJyOwogICAgdWludFtdIHB1YmxpYyBhcnIyID0gWzEsIDIsIDNdOwogICAgLy8gQXJyYXkgZGUgdGFtYW5obyBmaXhvLCB0b2RvcyBlbGVtZW50b3MgY29tZWNhbSBlbSAwCiAgICB1aW50WzEwXSBwdWJsaWMgbXlGaXhlZFNpemVBcnI7CgogICAgZnVuY3Rpb24gZ2V0KHVpbnQgaSkgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBhcnJbaV07CiAgICB9CgogICAgLy8gU29saWRpdHkgcG9kZSByZXRvcm5hciBvIGFycmF5IGludGVpcm8uCiAgICAvLyBNYXMgZXNzYSBmdW5jYW8gZGV2ZSBzZXIgZXZpdGFkYSBwYXJhIGFycmF5cwogICAgLy8gcXVlIGF1bWVudGFtIGluZGVmaW5pZGFtZW50ZSBlbSBjb21wcmltZW50by4KICAgIGZ1bmN0aW9uIGdldEFycigpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnRbXSBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gYXJyOwogICAgfQoKICAgIGZ1bmN0aW9uIHB1c2godWludCBpKSBwdWJsaWMgewogICAgICAgIC8vIEFkaWNpb25hIGVsZW1lbnRvcyBhbyBhcnJheQogICAgICAgIC8vIElzc28gYXVtZW50YXJhIG8gY29tcHJpbWVudG8gZG8gYXJyYXkgZW0gMS4KICAgICAgICBhcnIucHVzaChpKTsKICAgIH0KCiAgICBmdW5jdGlvbiBwb3AoKSBwdWJsaWMgewogICAgICAgIC8vIFJlbW92ZSBvIHVsdGltbyBlbGVtZW50byBkbyBhcnJheQogICAgICAgIC8vIElzc28gZGltaW51aXJhIG8gY29tcHJpbWVudG8gZGEgYXJyYXkgZW0gMQogICAgICAgIGFyci5wb3AoKTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRMZW5ndGgoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIGFyci5sZW5ndGg7CiAgICB9CgogICAgZnVuY3Rpb24gcmVtb3ZlKHVpbnQgaW5kZXgpIHB1YmxpYyB7CiAgICAgICAgLy8gRXhjbHVpciBuYW8gYWx0ZXJhIG8gY29tcHJpbWVudG8gZG8gYXJyYXkuCiAgICAgICAgLy8gRWxlIHJlaW5pY2lhIG8gdmFsb3Igbm8gaW5kaWNlIHBhcmEgbyB2YWxvciBwYWRyYW8sCiAgICAgICAgLy8gbmVzc2UgY2FzbyAwCiAgICAgICAgZGVsZXRlIGFycltpbmRleF07CiAgICB9CgogICAgZnVuY3Rpb24gZXhhbXBsZXMoKSBleHRlcm5hbCB7CiAgICAgICAgLy8gY3JpYSBhcnJheSBuYSBtZW1vcmlhLCBzb21lbnRlIGFzIGRlIHRhbWFuaG8gZml4byBwb2RlbSBzZXIgY3JpYWRhcwogICAgICAgIHVpbnRbXSBtZW1vcnkgYSA9IG5ldyB1aW50W10oNSk7CiAgICB9Cn0=)

- [RemocaoDeElemento.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFJlbW9jYW9EZUVsZW1lbnRvIHsKICAgIC8vIFsxLCAyLCAzXSAtLSByZW1vdmUoMSkgLS0+IFsxLCAzLCAzXSAtLT4gWzEsIDNdCiAgICAvLyBbMSwgMiwgMywgNCwgNSwgNl0gLS0gcmVtb3ZlKDIpIC0tPiBbMSwgMiwgNCwgNSwgNiwgNl0gLS0+IFsxLCAyLCA0LCA1LCA2XQogICAgLy8gWzEsIDIsIDMsIDQsIDUsIDZdIC0tIHJlbW92ZSgwKSAtLT4gWzIsIDMsIDQsIDUsIDYsIDZdIC0tPiBbMiwgMywgNCwgNSwgNl0KICAgIC8vIFsxXSAtLSByZW1vdmUoMCkgLS0+IFsxXSAtLT4gW10KCiAgICB1aW50W10gcHVibGljIGFycjsKCiAgICBmdW5jdGlvbiByZW1vdmUodWludCBfaW5kZXgpIHB1YmxpYyB7CiAgICAgICAgcmVxdWlyZShfaW5kZXggPCBhcnIubGVuZ3RoLCBcImluZGV4IGZvcmEgZG8gbGltaXRlXCIpOwoKICAgICAgICBmb3IgKHVpbnQgaSA9IF9pbmRleDsgaSA8IGFyci5sZW5ndGggLSAxOyBpKyspIHsKICAgICAgICAgICAgYXJyW2ldID0gYXJyW2kgKyAxXTsKICAgICAgICB9CiAgICAgICAgYXJyLnBvcCgpOwogICAgfQoKICAgIGZ1bmN0aW9uIHRlc3QoKSBleHRlcm5hbCB7CiAgICAgICAgYXJyID0gWzEsIDIsIDMsIDQsIDVdOwogICAgICAgIHJlbW92ZSgyKTsKICAgICAgICAvLyBbMSwgMiwgNCwgNV0KICAgICAgICBhc3NlcnQoYXJyWzBdID09IDEpOwogICAgICAgIGFzc2VydChhcnJbMV0gPT0gMik7CiAgICAgICAgYXNzZXJ0KGFyclsyXSA9PSA0KTsKICAgICAgICBhc3NlcnQoYXJyWzNdID09IDUpOwogICAgICAgIGFzc2VydChhcnIubGVuZ3RoID09IDQpOwoKICAgICAgICBhcnIgPSBbMV07CiAgICAgICAgcmVtb3ZlKDApOwogICAgICAgIC8vIFtdCiAgICAgICAgYXNzZXJ0KGFyci5sZW5ndGggPT0gMCk7CiAgICB9Cn0=)

- [RemovendoSubstituindoPeloFinal.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFJlbW92ZW5kb1N1YnN0aXR1aW5kb1BlbG9GaW5hbCB7CiAgICB1aW50W10gcHVibGljIGFycjsKCiAgICAvLyBBcGFnYXIgdW0gZWxlbWVudG8gY3JpYSB1bSBlc3BhY28gbm8gYXJyYXkuCiAgICAvLyBVbSB0cnVxdWUgcGFyYSBtYW50ZXIgbyBhcnJheSBjb21wYWN0byBlCiAgICAvLyBtb3ZlciBvIHVsdGltbyBlbGVtZW50byBwYXJhIG8gbG9jYWwgYSBzZXIgYXBhZ2Fkby4KICAgIGZ1bmN0aW9uIHJlbW92ZSh1aW50IGluZGV4KSBwdWJsaWMgewogICAgICAgIC8vIE1vdmEgbyB1bHRpbW8gZWxlbWVudG8gcGFyYSBvIGxvY2FsIG9uZGUgZWxlIHNlcmEgYXBhZ2Fkby4KICAgICAgICBhcnJbaW5kZXhdID0gYXJyW2Fyci5sZW5ndGggLSAxXTsKICAgICAgICAvLyBSZW1vdmEgbyB1bHRpbW8gZWxlbWVudG8KICAgICAgICBhcnIucG9wKCk7CiAgICB9CgogICAgZnVuY3Rpb24gdGVzdCgpIHB1YmxpYyB7CiAgICAgICAgYXJyID0gWzEsIDIsIDMsIDRdOwoKICAgICAgICByZW1vdmUoMSk7CiAgICAgICAgLy8gWzEsIDQsIDNdCiAgICAgICAgYXNzZXJ0KGFyci5sZW5ndGggPT0gMyk7CiAgICAgICAgYXNzZXJ0KGFyclswXSA9IDEpOwogICAgICAgIGFzc2VydChhcnJbMV0gPSA0KTsKICAgICAgICBhc3NlcnQoYXJyWzJdID0gMyk7CgogICAgICAgIHJlbW92ZSgyKTsKICAgICAgICAvLyBbMSwgNF0KICAgICAgICBhc3NlcnQoYXJyLmxlbmd0aCA9PSAyKTsKICAgICAgICBhc3NlcnQoYXJyWzBdID0gMSk7CiAgICAgICAgYXNzZXJ0KGFyclsxXSA9IDQpOwogICAgfQp9)
