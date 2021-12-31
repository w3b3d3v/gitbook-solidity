# Escondendo Códigos Maliciosos com Contrato Externo

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Em Solidity, qualquer endereço pode ser passado a um contrato, mesmo que o contrato nesse endereço não seja o contrato real que foi passado.

Isso pode ser explorado para esconder um código malicioso. Vejamos como.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Inicialize um novo contrato dentro do constructor
* Torne o endereço do contrato externo `public` de forma que o código do contrato externo possa ser revisado

```solidity
Bar public bar;

constructor() public {
    bar = new Bar();
}
```
