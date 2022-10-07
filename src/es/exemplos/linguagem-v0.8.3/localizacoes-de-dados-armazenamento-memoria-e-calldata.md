# Localizações de Dados - Armazenamento, Memória e Calldata

Variáveis são declaradas como `storage`, `memory`ou `calldata` para especificar claramente a localização dos dados.

* `storage` - é uma variável de estado (armazena no blockchain)
* `memory` - é uma variável que está na memória e existe enquanto uma função está sendo chamada
* `calldata` - localização de dados especiais que contém argumentos de função, somente disponível para funções `external`&#x20;

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract DataLocations {
    uint[] public arr;
    mapping(uint => address) map;
    struct MyStruct {
        uint foo;
    }
    mapping(uint => MyStruct) myStructs;

    function f() public {
        // chama _f com variáveis de estado
        _f(arr, map, myStructs[1]);

        // obtém uma struct de um mapping
        MyStruct storage myStruct = myStructs[1];
        // cria uma struct na memória
        MyStruct memory myMemStruct = MyStruct(0);
    }

    function _f(
        uint[] storage _arr,
        mapping(uint => address) storage _map,
        MyStruct storage _myStruct
    ) internal {
        // opera com variáveis armazenadas
    }

    // Você pode retornar variáveis de memória
    function g(uint[] memory _arr) public returns (uint[] memory) {
        // opera com a matriz de memória
    }

    function h(uint[] calldata _arr) external {
        // opera com matriz calldata 
    }
}
```
