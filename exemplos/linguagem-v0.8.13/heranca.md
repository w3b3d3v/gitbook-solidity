# Herança

Solidity suporta herança múltipla. Contratos podem herdar outro contrato usando a palavra-chave `is`.

Função que será substituída por um contrato da classe filho deve ser declarada como `virtual`.

Função que vai substituir uma função da classe pai deve usar a palavra-chave `override`.

A ordem da herança é importante.

Você deve listar contratos da classe pai na ordem do "mais básico" para o "mais derivado".

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/* Gráfico de herança
    A
   / \
  B   C
 / \ /
F  D,E

*/

contract A {
    function foo() public pure virtual returns (string memory) {
        return "A";
    }
}

// Contratos herdam outros contratos usando a palavra-chave 'is'.
contract B is A {
    // Substitui A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "B";
    }
}

contract C is A {
    // Substitui A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "C";
    }
}

// Contratos podem herdar de múltiplos contratos de classe pai.
// Quando uma função é chamada que é definida múltiplas vezes em
// contratos diferentes, contratos da classe pai são procurados da
// direita para a esquerda, e por busca de profundidade.

contract D is B, C {
    // D.foo() retorna "C"
    // já que C é o contrato de classe pai mais da direita com função foo()
    function foo() public pure override(B, C) returns (string memory) {
        return super.foo();
    }
}

contract E is C, B {
    // E.foo() retorna "B"
    // já que B é o contrato de classe pai mais da direita com função foo()
    function foo() public pure override(C, B) returns (string memory) {
        return super.foo();
    }
}

// Herança deve ser ordenada do "mais básico" para o "mais derivado".
// Trocar a ordem de A e B cria um erro de compilação.
contract F is A, B {
    function foo() public pure override(A, B) returns (string memory) {
        return super.foo();
    }
}
```

## Teste no Remix

- [Heranca.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qIEdyYWZpY28gZGUgaGVyYW5jYQogICAgQQogICAvIFwKICBCICAgQwogLyBcIC8KRiAgRCxFCgoqLwoKY29udHJhY3QgQSB7CiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgcHVyZSB2aXJ0dWFsIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gIkEiOwogICAgfQp9CgovLyBDb250cmF0b3MgaGVyZGFtIG91dHJvcyBjb250cmF0b3MgdXNhbmRvIGEgcGFsYXZyYS1jaGF2ZSAnaXMnLgpjb250cmFjdCBCIGlzIEEgewogICAgLy8gU3Vic3RpdHVpIEEuZm9vKCkKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyBwdXJlIHZpcnR1YWwgb3ZlcnJpZGUgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiAiQiI7CiAgICB9Cn0KCmNvbnRyYWN0IEMgaXMgQSB7CiAgICAvLyBTdWJzdGl0dWkgQS5mb28oKQogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHB1cmUgdmlydHVhbCBvdmVycmlkZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuICJDIjsKICAgIH0KfQoKLy8gQ29udHJhdG9zIHBvZGVtIGhlcmRhciBkZSBtdWx0aXBsb3MgY29udHJhdG9zIGRlIGNsYXNzZSBwYWkuCi8vIFF1YW5kbyB1bWEgZnVuY2FvIGUgY2hhbWFkYSBxdWUgZSBkZWZpbmlkYSBtdWx0aXBsYXMgdmV6ZXMgZW0KLy8gY29udHJhdG9zIGRpZmVyZW50ZXMsIGNvbnRyYXRvcyBkYSBjbGFzc2UgcGFpIHNhbyBwcm9jdXJhZG9zIGRhCi8vIGRpcmVpdGEgcGFyYSBhIGVzcXVlcmRhLCBlIHBvciBidXNjYSBkZSBwcm9mdW5kaWRhZGUuCgpjb250cmFjdCBEIGlzIEIsIEMgewogICAgLy8gRC5mb28oKSByZXRvcm5hICJDIgogICAgLy8gamEgcXVlIEMgZSBvIGNvbnRyYXRvIGRlIGNsYXNzZSBwYWkgbWFpcyBkYSBkaXJlaXRhIGNvbSBmdW5jYW8gZm9vKCkKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyBwdXJlIG92ZXJyaWRlKEIsIEMpIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gc3VwZXIuZm9vKCk7CiAgICB9Cn0KCmNvbnRyYWN0IEUgaXMgQywgQiB7CiAgICAvLyBFLmZvbygpIHJldG9ybmEgIkIiCiAgICAvLyBqYSBxdWUgQiBlIG8gY29udHJhdG8gZGUgY2xhc3NlIHBhaSBtYWlzIGRhIGRpcmVpdGEgY29tIGZ1bmNhbyBmb28oKQogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHB1cmUgb3ZlcnJpZGUoQywgQikgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBzdXBlci5mb28oKTsKICAgIH0KfQoKLy8gSGVyYW5jYSBkZXZlIHNlciBvcmRlbmFkYSBkbyAibWFpcyBiYXNpY28iIHBhcmEgbyAibWFpcyBkZXJpdmFkbyIuCi8vIFRyb2NhciBhIG9yZGVtIGRlIEEgZSBCIGNyaWEgdW0gZXJybyBkZSBjb21waWxhY2FvLgpjb250cmFjdCBGIGlzIEEsIEIgewogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHB1cmUgb3ZlcnJpZGUoQSwgQikgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBzdXBlci5mb28oKTsKICAgIH0KfQ)