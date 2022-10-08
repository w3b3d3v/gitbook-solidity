# Herencia

Solidity soporta herencia múltiple. Los contratos pueden heredar de otro contrato usando la palabra reservada `is`.

Función que será sobreescrita por un contrato hijo debe ser declarada como `virtual`.

Función que va a sobreescribir una función padre debe usar la palabra reservada `override`.

El orden de herencia es importante.

Debes listar los contratos padres en el orden desde lo "más básico" hacia lo "más derivado".

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/* Gráfico de herencia
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

// Contratos heredan de otro contrato usando la palabra reservada `is`.
contract B is A {
    // Sobreescribe A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "B";
    }
}

contract C is A {
    // Sobreescribe A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "C";
    }
}

// Contratos pueden heredar de múltiples contratos padre.
// Cuando una función es invocada y está definida múltiples veces en
// contratos diferentes, los contratos padres son buscados desde
// derecha hacia la izquierda, y por profundidad en primer lugar.

contract D is B, C {
    // D.foo() devuelve "C"
    // ya que C es el contrato padre más a la derecha con la función foo()
    function foo() public pure override(B, C) returns (string memory) {
        return super.foo();
    }
}

contract E is C, B {
    // E.foo() devuelve "B"
    // ya que B es el contrato padre más a la derecha con la función foo()
    function foo() public pure override(C, B) returns (string memory) {
        return super.foo();
    }
}

// Herencia debe ser ordenada de los "más básico" hacia lo "más derivado".
// Intercambiar el orden de A y B arrojará un error de compilación.
contract F is A, B {
    function foo() public pure override(A, B) returns (string memory) {
        return super.foo();
    }
}
```