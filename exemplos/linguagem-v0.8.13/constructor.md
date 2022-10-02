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

## Experimente no Remix

- [Constructor.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwoKLy8gQ29udHJhdG8gYmFzZSBYCmNvbnRyYWN0IFggewogICAgc3RyaW5nIHB1YmxpYyBuYW1lOwoKICAgIGNvbnN0cnVjdG9yKHN0cmluZyBtZW1vcnkgX25hbWUpIHsKICAgICAgICBuYW1lID0gX25hbWU7CiAgICB9Cn0KCi8vIENvbnRyYXRvIGJhc2UgWQpjb250cmFjdCBZIHsKICAgIHN0cmluZyBwdWJsaWMgdGV4dDsKCiAgICBjb25zdHJ1Y3RvcihzdHJpbmcgbWVtb3J5IF90ZXh0KSB7CiAgICAgICAgdGV4dCA9IF90ZXh0OwogICAgfQp9CgovLyBFeGlzdGVtIGR1YXMgZm9ybWFzIGRlIGluaWNpYWxpemFyIHVtIGNvbnRyYXRvIGRlIGNsYXNzZSBwYWkgY29tIHBhcmFtZXRyb3MuCgovLyBQYXNzZSBvcyBwYXJhbWV0cm9zIGFxdWkgbmEgbGlzdGEgZGUgaGVyYW5jYS4KY29udHJhY3QgQiBpcyBYKFwiRW50cmFkYSBlbSBYXCIpLCBZKFwiRW50cmFkYSBlbSBZXCIpIHsKCn0KCmNvbnRyYWN0IEMgaXMgWCwgWSB7CiAgICAvLyBQYXNzZSBvcyBwYXJhbWV0cm9zIGFxdWkgbm8gY29uc3RydWN0b3IsCiAgICAvLyBzZW1lbGhhbnRlIGFvcyBtb2RpZmljYWRvcmVzIGRlIGZ1bmNhby4KICAgIGNvbnN0cnVjdG9yKHN0cmluZyBtZW1vcnkgX25hbWUsIHN0cmluZyBtZW1vcnkgX3RleHQpIFgoX25hbWUpIFkoX3RleHQpIHt9Cn0KCi8vIENvbnN0cnVjdG9ycyBkYSBjbGFzc2UgcGFpIHNhbyBzZW1wcmUgY2hhbWFkb3MgbmEgb3JkZW0gZGUgaGVyYW5jYQovLyBpbmRlcGVuZGVudGVtZW50ZSBkYSBvcmRlbSBkb3MgY29udHJhdG9zIGRlIGNsYXNzZSBwYWkgbGlzdGFkb3Mgbm8KLy8gY29uc3RydWN0b3IgZG8gY29udHJhdG8gZGUgY2xhc3NlIGZpbGhvLgoKLy8gT3JkZW0gZG9zIGNvbnN0cnVjdG9ycyBjaGFtYWRvczoKLy8gMS4gWQovLyAyLiBYCi8vIDMuIEQKY29udHJhY3QgRCBpcyBYLCBZIHsKICAgIGNvbnN0cnVjdG9yKCkgWChcIlggZm9pIGNoYW1hZG9cIikgWShcIlkgZm9pIGNoYW1hZG9cIikge30KfQoKLy8gT3JkZW0gZG9zIGNvbnN0cnVjdG9ycyBjaGFtYWRvczoKLy8gMS4gWQovLyAyLiBYCi8vIDMuIEUKY29udHJhY3QgRSBpcyBYLCBZIHsKICAgIGNvbnN0cnVjdG9yKCkgWShcIlkgZm9pIGNoYW1hZG9cIikgWChcIlggZm9pIGNoYW1hZG9cIikge30KfQ)