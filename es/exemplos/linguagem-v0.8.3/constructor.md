# Constructor

Un `constructor` es una función opcional que es ejecutada cuando se crea el contrato.

A continuación ejemplos de como pasar argumentos a los `constructors`.

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

// Existen dos formas de inicializar un contrato padre con parámetros.

// Pasa los parámetros aquí en la lista de herencia.
contract B is X("Input to X"), Y("Input to Y") {

}

contract C is X, Y {
    // Pasa los parámetros aquí en el constructor,
    // semejante a los modificadores de función.
    constructor(string memory _name, string memory _text) X(_name) Y(_text) {}
}

// Constructores padres son siempre invocados en el orden de herencia
// independientemente del orden de los contratos padres listados en el
// constructor del contrato hijo.

// Orden de los constructores invocados:
// 1. Y
// 2. X
// 3. D
contract D is X, Y {
    constructor() X("X was called") Y("Y was called") {}
}

// Orden de los constructores invocados:
// 1. Y
// 2. X
// 3. E
contract E is X, Y {
    constructor() Y("Y was called") X("X was called") {}
}
```
