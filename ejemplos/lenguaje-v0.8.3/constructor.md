# Constructor

Um`constructor` é uma função opcional que é executada com a criação de um contrato.

Aqui estão exemplos de como passar argumentos para `constructors`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// Contrato base X
contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

// Contrato base Y
contract Y {
    string public text;

    constructor(string memory _text) {
        text = _text;
    }
}

// Existem duas formas de inicializar um contrato de classe pai com parâmetros.

// Passe os parâmetros aqui na lista de herança.
contract B is X("Input to X"), Y("Input to Y") {

}

contract C is X, Y {
    // Passe os parâmetros aqui no constructor,
    // semelhante aos modificadores de função.
    constructor(string memory _name, string memory _text) X(_name) Y(_text) {}
}

// Constructors da classe pai são sempre chamados na ordem de herança
// independentemente da ordem dos contratos de classe pai listados no
// constructor do contrato de classe filho.

// Ordem dos constructors chamados:
// 1. Y
// 2. X
// 3. D
contract D is X, Y {
    constructor() X("X was called") Y("Y was called") {}
}

// Ordem dos constructors chamados:
// 1. Y
// 2. X
// 3. E
contract E is X, Y {
    constructor() Y("Y was called") X("X was called") {}
}
```
