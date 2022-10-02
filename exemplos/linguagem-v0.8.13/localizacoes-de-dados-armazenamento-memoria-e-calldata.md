# Localizações de Dados - Armazenamento, Memória e Calldata

Variáveis são declaradas como `storage`, `memory`ou `calldata` para especificar claramente a localização dos dados.

- `storage` - é uma variável de estado (armazenada na blockchain)
- `memory` - é uma variável que está na memória e existe enquanto uma função está sendo chamada
- `calldata` - localização de dados especiais que contém argumentos de função, somente disponível para funções `external`&#x20;

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LocaisDeDados {
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
        // opera com variáveis de armazenamento
    }

    // Você pode retornar variáveis de memória
    function g(uint[] memory _arr) public returns (uint[] memory) {
        // opera com array de memória
    }

    function h(uint[] calldata _arr) external {
        // opera com array calldata
    }
}
```

## Teste no Remix

- [LocaisDeDados.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IExvY2Fpc0RlRGFkb3MgewogICAgdWludFtdIHB1YmxpYyBhcnI7CiAgICBtYXBwaW5nKHVpbnQgPT4gYWRkcmVzcykgbWFwOwogICAgc3RydWN0IE15U3RydWN0IHsKICAgICAgICB1aW50IGZvbzsKICAgIH0KICAgIG1hcHBpbmcodWludCA9PiBNeVN0cnVjdCkgbXlTdHJ1Y3RzOwoKICAgIGZ1bmN0aW9uIGYoKSBwdWJsaWMgewogICAgICAgIC8vIGNoYW1hIF9mIGNvbSB2YXJpYXZlaXMgZGUgZXN0YWRvCiAgICAgICAgX2YoYXJyLCBtYXAsIG15U3RydWN0c1sxXSk7CgogICAgICAgIC8vIG9idGVtIHVtYSBzdHJ1Y3QgZGUgdW0gbWFwcGluZwogICAgICAgIE15U3RydWN0IHN0b3JhZ2UgbXlTdHJ1Y3QgPSBteVN0cnVjdHNbMV07CgogICAgICAgIC8vIGNyaWEgdW1hIHN0cnVjdCBuYSBtZW1vcmlhCiAgICAgICAgTXlTdHJ1Y3QgbWVtb3J5IG15TWVtU3RydWN0ID0gTXlTdHJ1Y3QoMCk7CiAgICB9CgogICAgZnVuY3Rpb24gX2YoCiAgICAgICAgdWludFtdIHN0b3JhZ2UgX2FyciwKICAgICAgICBtYXBwaW5nKHVpbnQgPT4gYWRkcmVzcykgc3RvcmFnZSBfbWFwLAogICAgICAgIE15U3RydWN0IHN0b3JhZ2UgX215U3RydWN0CiAgICApIGludGVybmFsIHsKICAgICAgICAvLyBvcGVyYSBjb20gdmFyaWF2ZWlzIGRlIGFybWF6ZW5hbWVudG8KICAgIH0KCiAgICAvLyBWb2NlIHBvZGUgcmV0b3JuYXIgdmFyaWF2ZWlzIGRlIG1lbW9yaWEKICAgIGZ1bmN0aW9uIGcodWludFtdIG1lbW9yeSBfYXJyKSBwdWJsaWMgcmV0dXJucyAodWludFtdIG1lbW9yeSkgewogICAgICAgIC8vIG9wZXJhIGNvbSBhcnJheSBkZSBtZW1vcmlhCiAgICB9CgogICAgZnVuY3Rpb24gaCh1aW50W10gY2FsbGRhdGEgX2FycikgZXh0ZXJuYWwgewogICAgICAgIC8vIG9wZXJhIGNvbSBhcnJheSBjYWxsZGF0YQogICAgfQp9)
