# Escondendo Códigos Maliciosos com Contrato Externo

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

No Solidity qualquer endereço pode ser convertido em contrato específico, mesmo que o contrato no endereço não seja o que está sendo lançado.
Isso pode ser explorado para ocultar códigos maliciosos. Vamos ver como.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Digamos que Alice pode ver o código de Foo e Bar mas não o de Mal.
É óbvio para Alice que Foo.callBar() executa o código dentro do Bar.log().
Contudo, Eve implementa Foo com o endereço do Mal, de forma que chamando Foo.callBar()
será executado na verdade o código em Mal.
*/

/*
1. Eve implanta Mal
2. Eve implementa Foo com o endereço de Mal
3. Alice chama Foo.callBar() após ler o código e julgar que ele seja
   seguro para ser chamado.
4. Apesar de Alice esperar que Bar.log() seja executado, Mal.log() foi executado.
*/

contract Foo {
    Bar bar;

    constructor(address _bar) {
        bar = Bar(_bar);
    }

    function callBar() public {
        bar.log();
    }
}

contract Bar {
    event Log(string message);

    function log() public {
        emit Log("Bar was called");
    }
}

// Esse código está escondido num arquivo separado
contract Mal {
    event Log(string message);

    // function () external {
    //     emit Log("Mal was called");
    // }

    // Na verdade nós podemos executar o mesmo exploit mesmo que essa função
    // não exista, usando o fallback
    function log() public {
        emit Log("Mal was called");
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Inicialize um novo contrato dentro do constructor
- Torne o endereço do contrato externo `public` de forma que o código do contrato externo possa ser revisado

```solidity
Bar public bar;

constructor() public {
    bar = new Bar();
}
```

## Teste no Remix

- [ExternalContract.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkRpZ2Ftb3MgcXVlIEFsaWNlIHBvZGUgdmVyIG8gY29kaWdvIGRlIEZvbyBlIEJhciBtYXMgbmFvIG8gZGUgTWFsLgpFIG9idmlvIHBhcmEgQWxpY2UgcXVlIEZvby5jYWxsQmFyKCkgZXhlY3V0YSBvIGNvZGlnbyBkZW50cm8gZG8gQmFyLmxvZygpLgpDb250dWRvLCBFdmUgaW1wbGVtZW50YSBGb28gY29tIG8gZW5kZXJlY28gZG8gTWFsLCBkZSBmb3JtYSBxdWUgY2hhbWFuZG8gRm9vLmNhbGxCYXIoKQpzZXJhIGV4ZWN1dGFkbyBuYSB2ZXJkYWRlIG8gY29kaWdvIGVtIE1hbC4KKi8KCi8qCjEuIEV2ZSBpbXBsYW50YSBNYWwKMi4gRXZlIGltcGxlbWVudGEgRm9vIGNvbSBvIGVuZGVyZWNvIGRlIE1hbAozLiBBbGljZSBjaGFtYSBGb28uY2FsbEJhcigpIGFwb3MgbGVyIG8gY29kaWdvIGUganVsZ2FyIHF1ZSBlbGUgc2VqYQogICBzZWd1cm8gcGFyYSBzZXIgY2hhbWFkby4KNC4gQXBlc2FyIGRlIEFsaWNlIGVzcGVyYXIgcXVlIEJhci5sb2coKSBzZWphIGV4ZWN1dGFkbywgTWFsLmxvZygpIGZvaSBleGVjdXRhZG8uCiovCgpjb250cmFjdCBGb28gewogICAgQmFyIGJhcjsKCiAgICBjb25zdHJ1Y3RvcihhZGRyZXNzIF9iYXIpIHsKICAgICAgICBiYXIgPSBCYXIoX2Jhcik7CiAgICB9CgogICAgZnVuY3Rpb24gY2FsbEJhcigpIHB1YmxpYyB7CiAgICAgICAgYmFyLmxvZygpOwogICAgfQp9Cgpjb250cmFjdCBCYXIgewogICAgZXZlbnQgTG9nKHN0cmluZyBtZXNzYWdlKTsKCiAgICBmdW5jdGlvbiBsb2coKSBwdWJsaWMgewogICAgICAgIGVtaXQgTG9nKCJCYXIgd2FzIGNhbGxlZCIpOwogICAgfQp9CgovLyBFc3NlIGNvZGlnbyBlc3RhIGVzY29uZGlkbyBudW0gYXJxdWl2byBzZXBhcmFkbwpjb250cmFjdCBNYWwgewogICAgZXZlbnQgTG9nKHN0cmluZyBtZXNzYWdlKTsKCiAgICAvLyBmdW5jdGlvbiAoKSBleHRlcm5hbCB7CiAgICAvLyAgICAgZW1pdCBMb2coIk1hbCB3YXMgY2FsbGVkIik7CiAgICAvLyB9CgogICAgLy8gTmEgdmVyZGFkZSBub3MgcG9kZW1vcyBleGVjdXRhciBvIG1lc21vIGV4cGxvaXQgbWVzbW8gcXVlIGVzc2EgZnVuY2FvCiAgICAvLyBuYW8gZXhpc3RhLCB1c2FuZG8gbyBmYWxsYmFjawogICAgZnVuY3Rpb24gbG9nKCkgcHVibGljIHsKICAgICAgICBlbWl0IExvZygiTWFsIHdhcyBjYWxsZWQiKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
