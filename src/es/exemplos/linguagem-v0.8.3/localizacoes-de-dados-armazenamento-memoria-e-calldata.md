# Localizaciones de Datos - Almacenamiento, Memoria y Calldata

Variables son declaradas como `storage`, `memory` o `calldata` para especificar explícitamente la localización de los datos.

* `storage` - es una variable de estado (almacenada en el blockchain)
* `memory` - es una variable que está en memoria y existe mientras una función es invocada
* `calldata` - localización especial de datos que contiene argumentos de función, solamente disponible para funciones `external`&#x20;

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
        // invoca _f con variables de estado
        _f(arr, map, myStructs[1]);

        // obtiene un struct de un mapping
        MyStruct storage myStruct = myStructs[1];
        // crea un struct en memoria
        MyStruct memory myMemStruct = MyStruct(0);
    }

    function _f(
        uint[] storage _arr,
        mapping(uint => address) storage _map,
        MyStruct storage _myStruct
    ) internal {
        // realiza operaciones con variables storage
    }

    // Puedes devolver variables de memoria
    function g(uint[] memory _arr) public returns (uint[] memory) {
        // realiza operaciones con el arreglo de memoria
    }

    function h(uint[] calldata _arr) external {
        // realiza operaciones con el arreglo de calldata 
    }
}
```