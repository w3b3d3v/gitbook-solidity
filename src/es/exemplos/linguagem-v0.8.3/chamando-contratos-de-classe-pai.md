# Invocando Contratos padres

Contratos padres pueden ser invocados directamente o usando la palabra reservada `super`.

Usando la palabra reservada `super`, todos los contratos padres inmediatos serán invocados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/* Árbol de herencia
   A
 /  \
B   C
 \ /
  D
*/

contract A {
    // Esto es llamado un evento. Tu puedes emitir eventos desde tu función
    // y ellos son registrados en el log de transacción.
    // En nuestro caso, esto será útil para rastrear llamadas de función.
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
    // Intenta:
    // - Llama a D.foo y revisa los logs de la transacción.
    //   Si bien D hereda A, B y C, solo se llamó a C y después A. 
    // - Llama a D.bar y revisa los logs de la transacción
    //   D llamó a C, después B, y finalmente A.
    //   Sin embargo super fue invocado 2 veces (por B e C) y solo llamó a A una vez.

    function foo() public override(B, C) {
        super.foo();
    }

    function bar() public override(B, C) {
        super.bar();
    }
}
```
