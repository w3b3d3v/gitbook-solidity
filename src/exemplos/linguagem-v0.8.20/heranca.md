# Herança

Solidity suporta herança múltipla. Contratos podem herdar outro contrato usando a palavra-chave `is`.

Função que será substituída por um contrato da classe filho deve ser declarada como `virtual`.

Função que vai substituir uma função da classe pai deve usar a palavra-chave `override`.

A ordem da herança é importante.

Você deve listar contratos da classe pai na ordem do "mais básico" para o "mais derivado".

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

- [Heranca.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8qIEdyw6FmaWNvIGRlIGhlcmFuw6dhCiAgICBBCiAgIC8gXAogIEIgICBDCiAvIFwgLwpGICBELEUKCiovCgpjb250cmFjdCBBIHsKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyBwdXJlIHZpcnR1YWwgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiAiQSI7CiAgICB9Cn0KCi8vIENvbnRyYXRvcyBoZXJkYW0gb3V0cm9zIGNvbnRyYXRvcyB1c2FuZG8gYSBwYWxhdnJhLWNoYXZlICdpcycuCmNvbnRyYWN0IEIgaXMgQSB7CiAgICAvLyBTdWJzdGl0dWkgQS5mb28oKQogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHB1cmUgdmlydHVhbCBvdmVycmlkZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuICJCIjsKICAgIH0KfQoKY29udHJhY3QgQyBpcyBBIHsKICAgIC8vIFN1YnN0aXR1aSBBLmZvbygpCiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgcHVyZSB2aXJ0dWFsIG92ZXJyaWRlIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gIkMiOwogICAgfQp9CgovLyBDb250cmF0b3MgcG9kZW0gaGVyZGFyIGRlIG11bHRpcGxvcyBjb250cmF0b3MgZGUgY2xhc3NlIHBhaS4KLy8gUXVhbmRvIHVtYSBmdW5jYW8gZSBjaGFtYWRhIHF1ZSBlIGRlZmluaWRhIG11bHRpcGxhcyB2ZXplcyBlbQovLyBjb250cmF0b3MgZGlmZXJlbnRlcywgY29udHJhdG9zIGRhIGNsYXNzZSBwYWkgc2FvIHByb2N1cmFkb3MgZGEKLy8gZGlyZWl0YSBwYXJhIGEgZXNxdWVyZGEsIGUgcG9yIGJ1c2NhIGRlIHByb2Z1bmRpZGFkZS4KCmNvbnRyYWN0IEQgaXMgQiwgQyB7CiAgICAvLyBELmZvbygpIHJldG9ybmEgIkMiCiAgICAvLyBqYSBxdWUgQyBlIG8gY29udHJhdG8gZGUgY2xhc3NlIHBhaSBtYWlzIGRhIGRpcmVpdGEgY29tIGZ1bmNhbyBmb28oKQogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHB1cmUgb3ZlcnJpZGUoQiwgQykgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBzdXBlci5mb28oKTsKICAgIH0KfQoKY29udHJhY3QgRSBpcyBDLCBCIHsKICAgIC8vIEUuZm9vKCkgcmV0b3JuYSAiQiIKICAgIC8vIGphIHF1ZSBCIGUgbyBjb250cmF0byBkZSBjbGFzc2UgcGFpIG1haXMgZGEgZGlyZWl0YSBjb20gZnVuY2FvIGZvbygpCiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgcHVyZSBvdmVycmlkZShDLCBCKSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIHN1cGVyLmZvbygpOwogICAgfQp9CgovLyBIZXJhbmNhIGRldmUgc2VyIG9yZGVuYWRhIGRvICJtYWlzIGJhc2ljbyIgcGFyYSBvICJtYWlzIGRlcml2YWRvIi4KLy8gVHJvY2FyIGEgb3JkZW0gZGUgQSBlIEIgY3JpYSB1bSBlcnJvIGRlIGNvbXBpbGFjYW8uCmNvbnRyYWN0IEYgaXMgQSwgQiB7CiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgcHVyZSBvdmVycmlkZShBLCBCKSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIHN1cGVyLmZvbygpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)