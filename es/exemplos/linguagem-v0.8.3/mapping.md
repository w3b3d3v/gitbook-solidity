# Mapping

Mapas são criados com a sintaxe mapping`keyType => valueType)`.

`keyType` podem ser valores como `uint`, `address` or `bytes`.

`valueType` pode ser de qualquer tipo incluindo outro mapping ou uma matriz.

Mappings não são iteráveis.

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Mapping {
    // Mapping de address para uint
    mapping(address => uint) public myMap;

    function get(address _addr) public view returns (uint) {
        // Mapping sempre retorna um valor.
        // Se o valor nunca foi definido, vai retornar o valor padrão.
        return myMap[_addr];
    }

    function set(address _addr, uint _i) public {
        // Atualiza o valor nesse endereço
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Redefine o valor para o padrão.
        delete myMap[_addr];
    }
}

contract NestedMapping {
    // Mapping aninhado (mapping de address para outro mapping)
    mapping(address => mapping(uint => bool)) public nested;

    function get(address _addr1, uint _i) public view returns (bool) {
        // Você pode obter valores de um mapping aninhado
        // mesmo quando ele não tiver sido inicializado.
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
