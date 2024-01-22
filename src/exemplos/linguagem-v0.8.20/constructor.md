# Constructor

Um `constructor` é uma função opcional que é executada com a criação de um contrato.

Aqui estão exemplos de como passar argumentos para `constructors`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

// Existem duas formas de iniciar um contrato de classe pai com parâmetros.

// Passe os parâmetros aqui na lista de herança.
contract B is X("Entrada em X"), Y("Entrada em Y") {

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
    constructor() X("X foi chamado") Y("Y foi chamado") {}
}

// Ordem dos constructors chamados:
// 1. Y
// 2. X
// 3. E
contract E is X, Y {
    constructor() Y("Y foi chamado") X("X foi chamado") {}
}
```

## Teste no Remix

- [Constructor.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8vIENvbnRyYXRvIGJhc2UgWApjb250cmFjdCBYIHsKICAgIHN0cmluZyBwdWJsaWMgbmFtZTsKCiAgICBjb25zdHJ1Y3RvcihzdHJpbmcgbWVtb3J5IF9uYW1lKSB7CiAgICAgICAgbmFtZSA9IF9uYW1lOwogICAgfQp9CgovLyBDb250cmF0byBiYXNlIFkKY29udHJhY3QgWSB7CiAgICBzdHJpbmcgcHVibGljIHRleHQ7CgogICAgY29uc3RydWN0b3Ioc3RyaW5nIG1lbW9yeSBfdGV4dCkgewogICAgICAgIHRleHQgPSBfdGV4dDsKICAgIH0KfQoKLy8gRXhpc3RlbSBkdWFzIGZvcm1hcyBkZSBpbmljaWFyIHVtIGNvbnRyYXRvIGRlIGNsYXNzZSBwYWkgY29tIHBhcmFtZXRyb3MuCgovLyBQYXNzZSBvcyBwYXJhbWV0cm9zIGFxdWkgbmEgbGlzdGEgZGUgaGVyYW5jYS4KY29udHJhY3QgQiBpcyBYKCJFbnRyYWRhIGVtIFgiKSwgWSgiRW50cmFkYSBlbSBZIikgewoKfQoKY29udHJhY3QgQyBpcyBYLCBZIHsKICAgIC8vIFBhc3NlIG9zIHBhcmFtZXRyb3MgYXF1aSBubyBjb25zdHJ1Y3RvciwKICAgIC8vIHNlbWVsaGFudGUgYW9zIG1vZGlmaWNhZG9yZXMgZGUgZnVuY2FvLgogICAgY29uc3RydWN0b3Ioc3RyaW5nIG1lbW9yeSBfbmFtZSwgc3RyaW5nIG1lbW9yeSBfdGV4dCkgWChfbmFtZSkgWShfdGV4dCkge30KfQoKLy8gQ29uc3RydWN0b3JzIGRhIGNsYXNzZSBwYWkgc2FvIHNlbXByZSBjaGFtYWRvcyBuYSBvcmRlbSBkZSBoZXJhbmNhCi8vIGluZGVwZW5kZW50ZW1lbnRlIGRhIG9yZGVtIGRvcyBjb250cmF0b3MgZGUgY2xhc3NlIHBhaSBsaXN0YWRvcyBubwovLyBjb25zdHJ1Y3RvciBkbyBjb250cmF0byBkZSBjbGFzc2UgZmlsaG8uCgovLyBPcmRlbSBkb3MgY29uc3RydWN0b3JzIGNoYW1hZG9zOgovLyAxLiBZCi8vIDIuIFgKLy8gMy4gRApjb250cmFjdCBEIGlzIFgsIFkgewogICAgY29uc3RydWN0b3IoKSBYKCJYIGZvaSBjaGFtYWRvIikgWSgiWSBmb2kgY2hhbWFkbyIpIHt9Cn0KCi8vIE9yZGVtIGRvcyBjb25zdHJ1Y3RvcnMgY2hhbWFkb3M6Ci8vIDEuIFkKLy8gMi4gWAovLyAzLiBFCmNvbnRyYWN0IEUgaXMgWCwgWSB7CiAgICBjb25zdHJ1Y3RvcigpIFkoIlkgZm9pIGNoYW1hZG8iKSBYKCJYIGZvaSBjaGFtYWRvIikge30KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
