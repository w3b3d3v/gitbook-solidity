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

## Teste no Remix

- [Super.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qIMOBcnZvcmUgZGUgaGVyYW7Dp2EKICAgQQogLyAgXApCICAgQwogXCAvCiAgRAoqLwoKY29udHJhY3QgQSB7CiAgICAvLyBJc3RvIGUgY2hhbWFkbyB1bSBldmVudG8uIFZvY2UgcG9kZSBlbWl0aXIgZXZlbnRvcyBkZSBzdWEgZnVuY2FvCiAgICAvLyBlIGVsZXMgc2VyYW8gcmVnaXN0cmFkb3Mgbm8gbG9nIGRhIHRyYW5zYWNhby4KICAgIC8vIE5vIG5vc3NvIGNhc28sIGlzc28gc2VyYSB1dGlsIHBhcmEgdHJhY2FyIGNoYW1hZGFzIGRlIGZ1bmNhby4KICAgIGV2ZW50IExvZyhzdHJpbmcgbWVzc2FnZSk7CgogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHZpcnR1YWwgewogICAgICAgIGVtaXQgTG9nKCJBLmZvbyBjaGFtYWRvIik7CiAgICB9CgogICAgZnVuY3Rpb24gYmFyKCkgcHVibGljIHZpcnR1YWwgewogICAgICAgIGVtaXQgTG9nKCJBLmJhciBjaGFtYWRvIik7CiAgICB9Cn0KCmNvbnRyYWN0IEIgaXMgQSB7CiAgICBmdW5jdGlvbiBmb28oKSBwdWJsaWMgdmlydHVhbCBvdmVycmlkZSB7CiAgICAgICAgZW1pdCBMb2coIkIuZm9vIGNoYW1hZG8iKTsKICAgICAgICBBLmZvbygpOwogICAgfQoKICAgIGZ1bmN0aW9uIGJhcigpIHB1YmxpYyB2aXJ0dWFsIG92ZXJyaWRlIHsKICAgICAgICBlbWl0IExvZygiQi5iYXIgY2hhbWFkbyIpOwogICAgICAgIHN1cGVyLmJhcigpOwogICAgfQp9Cgpjb250cmFjdCBDIGlzIEEgewogICAgZnVuY3Rpb24gZm9vKCkgcHVibGljIHZpcnR1YWwgb3ZlcnJpZGUgewogICAgICAgIGVtaXQgTG9nKCJDLmZvbyBjaGFtYWRvIik7CiAgICAgICAgQS5mb28oKTsKICAgIH0KCiAgICBmdW5jdGlvbiBiYXIoKSBwdWJsaWMgdmlydHVhbCBvdmVycmlkZSB7CiAgICAgICAgZW1pdCBMb2coIkMuYmFyIGNoYW1hZG8iKTsKICAgICAgICBzdXBlci5iYXIoKTsKICAgIH0KfQoKY29udHJhY3QgRCBpcyBCLCBDIHsKICAgIC8vIFRlbnRlOgogICAgLy8gLSBDaGFtZSBELmZvbyBlIHZlcmlmaXF1ZSBvcyBsb2dzIGRhIHRyYW5zYWNhby4KICAgIC8vICAgRW1ib3JhIEQgaGVyZGUgQSwgQiBlIEMsIGVsZSBzbyBjaGFtb3UgQyBlIGRlcG9pcyBBLgogICAgLy8gLSBDaGFtZSBELmJhciBlIHZlcmlmaXF1ZSBvcyBsb2dzIGRhIHRyYW5zYWNhbwogICAgLy8gICBEIGNoYW1vdSBDLCBkZXBvaXMgQiwgZSBmaW5hbG1lbnRlIEEuCiAgICAvLyAgIEVtYm9yYSBzdXBlciBmb2kgY2hhbWFkbyAyIHZlemVzIChwb3IgQiBlIEMpIGVsZSBzbyBjaGFtb3UgQSB1bWEgdmV6LgoKICAgIGZ1bmN0aW9uIGZvbygpIHB1YmxpYyBvdmVycmlkZShCLCBDKSB7CiAgICAgICAgc3VwZXIuZm9vKCk7CiAgICB9CgogICAgZnVuY3Rpb24gYmFyKCkgcHVibGljIG92ZXJyaWRlKEIsIEMpIHsKICAgICAgICBzdXBlci5iYXIoKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
