# Chamando Contratos de Classe Pai

Contratos de classe pai podem ser chamados diretamente ou usando a palavra-chave `super`.

Usando a palavra-chave `super`, todos os contratos de classe pai imediatos serão chamados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/* Árvore de herança
   A
 /  \
B   C
 \ /
  D
*/

contract A {
    // Isto é chamado um evento. Você pode emitir eventos de sua função
    // e eles serão registrados no log da transação.
    // No nosso caso, isso será útil para traçar chamadas de função.
    event Log(string message);

    function foo() public virtual {
        emit Log("A.foo chamado");
    }

    function bar() public virtual {
        emit Log("A.bar chamado");
    }
}

contract B is A {
    function foo() public virtual override {
        emit Log("B.foo chamado");
        A.foo();
    }

    function bar() public virtual override {
        emit Log("B.bar chamado");
        super.bar();
    }
}

contract C is A {
    function foo() public virtual override {
        emit Log("C.foo chamado");
        A.foo();
    }

    function bar() public virtual override {
        emit Log("C.bar chamado");
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

## Experimente no Remix
- [Super.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qIEFydm9yZSBkZSBoZXJhbmNhCiAgIEEKIC8gIFwKQiAgIEMKIFwgLwogIEQKKi8KCmNvbnRyYWN0IEEgewogICAgLy8gSXN0byBlIGNoYW1hZG8gdW0gZXZlbnRvLiBWb2NlIHBvZGUgZW1pdGlyIGV2ZW50b3MgZGUgc3VhIGZ1bmNhbwogICAgLy8gZSBlbGVzIHNlcmFvIHJlZ2lzdHJhZG9zIG5vIGxvZyBkYSB0cmFuc2FjYW8uCiAgICAvLyBObyBub3NzbyBjYXNvLCBpc3NvIHNlcmEgdXRpbCBwYXJhIHRyYWNhciBjaGFtYWRhcyBkZSBmdW5jYW8uCiAgICBldmVudCBMb2coc3RyaW5nIG1lc3NhZ2UpOwoKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyB2aXJ0dWFsIHsKICAgICAgICBlbWl0IExvZygiQS5mb28gY2hhbWFkbyIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGJhcigpIHB1YmxpYyB2aXJ0dWFsIHsKICAgICAgICBlbWl0IExvZygiQS5iYXIgY2hhbWFkbyIpOwogICAgfQp9Cgpjb250cmFjdCBCIGlzIEEgewogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHZpcnR1YWwgb3ZlcnJpZGUgewogICAgICAgIGVtaXQgTG9nKCJCLmZvbyBjaGFtYWRvIik7CiAgICAgICAgQS5mb28oKTsKICAgIH0KCiAgICBmdW5jdGlvbiBiYXIoKSBwdWJsaWMgdmlydHVhbCBvdmVycmlkZSB7CiAgICAgICAgZW1pdCBMb2coIkIuYmFyIGNoYW1hZG8iKTsKICAgICAgICBzdXBlci5iYXIoKTsKICAgIH0KfQoKY29udHJhY3QgQyBpcyBBIHsKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyB2aXJ0dWFsIG92ZXJyaWRlIHsKICAgICAgICBlbWl0IExvZygiQy5mb28gY2hhbWFkbyIpOwogICAgICAgIEEuZm9vKCk7CiAgICB9CgogICAgZnVuY3Rpb24gYmFyKCkgcHVibGljIHZpcnR1YWwgb3ZlcnJpZGUgewogICAgICAgIGVtaXQgTG9nKCJDLmJhciBjaGFtYWRvIik7CiAgICAgICAgc3VwZXIuYmFyKCk7CiAgICB9Cn0KCmNvbnRyYWN0IEQgaXMgQiwgQyB7CiAgICAvLyBUZW50ZToKICAgIC8vIC0gQ2hhbWUgRC5mb28gZSB2ZXJpZmlxdWUgb3MgbG9ncyBkYSB0cmFuc2FjYW8uCiAgICAvLyAgIEVtYm9yYSBEIGhlcmRlIEEsIEIgZSBDLCBlbGUgc28gY2hhbW91IEMgZSBkZXBvaXMgQS4KICAgIC8vIC0gQ2hhbWUgRC5iYXIgZSB2ZXJpZmlxdWUgb3MgbG9ncyBkYSB0cmFuc2FjYW8KICAgIC8vICAgRCBjaGFtb3UgQywgZGVwb2lzIEIsIGUgZmluYWxtZW50ZSBBLgogICAgLy8gICBFbWJvcmEgc3VwZXIgZm9pIGNoYW1hZG8gMiB2ZXplcyAocG9yIEIgZSBDKSBlbGUgc28gY2hhbW91IEEgdW1hIHZlei4KCiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgb3ZlcnJpZGUoQiwgQykgewogICAgICAgIHN1cGVyLmZvbygpOwogICAgfQoKICAgIGZ1bmN0aW9uIGJhcigpIHB1YmxpYyBvdmVycmlkZShCLCBDKSB7CiAgICAgICAgc3VwZXIuYmFyKCk7CiAgICB9Cn0=)