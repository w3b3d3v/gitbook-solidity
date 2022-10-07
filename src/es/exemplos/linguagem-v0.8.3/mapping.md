# Mapping

Maps son creados con la sintaxis `mapping(keyType => valueType)`.

`keyType` puede ser cualquier tipo de valor built-in como `uint`, `address` o `bytes`.

`valueType` puede ser de cualquier tipo incluyendo otro mapping o un arreglo.

Mappings no son iterables.

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Mapping {
    // Mapping de address del tipo uint
    mapping(address => uint) public myMap;

    function get(address _addr) public view returns (uint) {
        // Mapping siempre devuelve um valor.
        // Si el valor nunca fue definido, devolverá el valor por defecto.
        return myMap[_addr];
    }

    function set(address _addr, uint _i) public {
        // Actualiza el valor de esa dirección
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Restaura el valor al valor por defecto.
        delete myMap[_addr];
    }
}

contract NestedMapping {
    // Mapping anidado (mapping de address dentro de otro mapping)
    mapping(address => mapping(uint => bool)) public nested;

    function get(address _addr1, uint _i) public view returns (bool) {
        // Puede obtener los valores de un mapping anidado
        // hasta cuando no fue inicializado.
        return nested[_addr1][_i];
    }

    function set(
        address _addr1,
        uint _i,
        bool _boo
    ) public {
        nested[_addr1][_i] = _boo;
    }

    function remove(address _addr1, uint _i) public {
        delete nested[_addr1][_i];
    }
}
```
