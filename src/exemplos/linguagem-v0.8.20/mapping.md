# Mapping

Mapas são criados com a sintaxe `mapping(Tipo => Valor)`.

`Tipo` podem ser valores como `uint`, `address`, `string` ou `bytes`.

`Valor` pode ser de qualquer tipo, incluindo outro `mapping` ou uma `array`.

Mappings não são iteráveis.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

contract MappingAninhado {
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

## Teste no Remix

- [Mapping.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IE1hcHBpbmcgewogICAgLy8gTWFwcGluZyBkZSBhZGRyZXNzIHBhcmEgdWludAogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQpIHB1YmxpYyBteU1hcDsKCiAgICBmdW5jdGlvbiBnZXQoYWRkcmVzcyBfYWRkcikgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIC8vIE1hcHBpbmcgc2VtcHJlIHJldG9ybmEgdW0gdmFsb3IuCiAgICAgICAgLy8gU2UgbyB2YWxvciBudW5jYSBmb2kgZGVmaW5pZG8sIHZhaSByZXRvcm5hciBvIHZhbG9yIHBhZHJhby4KICAgICAgICByZXR1cm4gbXlNYXBbX2FkZHJdOwogICAgfQoKICAgIGZ1bmN0aW9uIHNldChhZGRyZXNzIF9hZGRyLCB1aW50IF9pKSBwdWJsaWMgewogICAgICAgIC8vIEF0dWFsaXphIG8gdmFsb3IgbmVzc2UgZW5kZXJlY28KICAgICAgICBteU1hcFtfYWRkcl0gPSBfaTsKICAgIH0KCiAgICBmdW5jdGlvbiByZW1vdmUoYWRkcmVzcyBfYWRkcikgcHVibGljIHsKICAgICAgICAvLyBSZWRlZmluZSBvIHZhbG9yIHBhcmEgbyBwYWRyYW8uCiAgICAgICAgZGVsZXRlIG15TWFwW19hZGRyXTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
- [MappingAninhado.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IE1hcHBpbmdBbmluaGFkbyB7CiAgICAvLyBNYXBwaW5nIGFuaW5oYWRvIChtYXBwaW5nIGRlIGFkZHJlc3MgcGFyYSBvdXRybyBtYXBwaW5nKQogICAgbWFwcGluZyhhZGRyZXNzID0+IG1hcHBpbmcodWludCA9PiBib29sKSkgcHVibGljIG5lc3RlZDsKCiAgICBmdW5jdGlvbiBnZXQoYWRkcmVzcyBfYWRkcjEsIHVpbnQgX2kpIHB1YmxpYyB2aWV3IHJldHVybnMgKGJvb2wpIHsKICAgICAgICAvLyBWb2NlIHBvZGUgb2J0ZXIgdmFsb3JlcyBkZSB1bSBtYXBwaW5nIGFuaW5oYWRvCiAgICAgICAgLy8gbWVzbW8gcXVhbmRvIGVsZSBuYW8gdGl2ZXIgc2lkbyBpbmljaWFsaXphZG8uCiAgICAgICAgcmV0dXJuIG5lc3RlZFtfYWRkcjFdW19pXTsKICAgIH0KCiAgICBmdW5jdGlvbiBzZXQoCiAgICAgICAgYWRkcmVzcyBfYWRkcjEsCiAgICAgICAgdWludCBfaSwKICAgICAgICBib29sIF9ib28KICAgICkgcHVibGljIHsKICAgICAgICBuZXN0ZWRbX2FkZHIxXVtfaV0gPSBfYm9vOwogICAgfQoKICAgIGZ1bmN0aW9uIHJlbW92ZShhZGRyZXNzIF9hZGRyMSwgdWludCBfaSkgcHVibGljIHsKICAgICAgICBkZWxldGUgbmVzdGVkW19hZGRyMV1bX2ldOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
