# Chamando Contratos de Classe Pai

Contratos de classe pai podem ser chamados diretamente ou usando a palavra-chave `super`.

Usando a palavra-chave `super`, todos os contratos de classe pai imediatos serão chamados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/* Árvore de herança
   A
 /  \
B   C
 \ /
  D
*/

contract A {
    // Isto é chamado um evento. Você pode emitir eventos de sua função
    // e eles serão logados no log da transação.
    // No nosso caso, isso será útil para traçar chamadas de função.
    event Log(string message);

    function foo() public virtual {
        emit Log("A.foo called");
    }

    function bar() public virtual {
        emit Log("A.bar called");
    }
}

contract B is A {
    function foo() public virtual override {
        emit Log("B.foo called");
        A.foo();
    }

    function bar() public virtual override {
        emit Log("B.bar called");
        super.bar();
    }
}

contract C is A {
    function foo() public virtual override {
        emit Log("C.foo called");
        A.foo();
    }

    function bar() public virtual override {
        emit Log("C.bar called");
        super.bar();
    }
}

contract D is B, C {
    // Tente:
    // - Chame D.foo e verifique os logs da transação.
    //   Embora D herde A, B e C, ele só chamou C e depois A. 
    // - Chame D.bar e verifique os logs da transação
    //   D chamou C, depois B, e finalmente A.
    //   Embora super foi chamado 2 vezes (por B e C) ele só chamou A uma vez.

    function foo() public override(B, C) {
        super.foo();
    }

    function bar() public override(B, C) {
        super.bar();
    }
}
```
