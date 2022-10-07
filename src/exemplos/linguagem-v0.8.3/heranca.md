# Herança

Solidity suporta herança múltipla. Contratos podem herdar outro contrato usando a palavra-chave `is`.

Função que será substituída por um contrato da classe filho deve ser declarada como `virtual`.

Função que vai substituir uma função da classe pai deve usar a palavra-chave `override`.

A ordem da herança é importante.

Você deve listar contratos da classe pai na ordem do "mais básico" para o "mais derivado".

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
