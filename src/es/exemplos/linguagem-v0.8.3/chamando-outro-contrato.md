# Llamando a otro Contrato

El contrato puede llamar o invocar a otros contratos de dos formas.

La manera más sencilla es solo llamarlo, como `A.foo(x, y, z)`.

Otra forma de llamar a otros contratos es usando la función de bajo nivel `call`.

Este método no es el recomendado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Callee {
    uint public x;
    uint public value;

    function setX(uint _x) public returns (uint) {
        x = _x;
        return x;
    }

    function setXandSendEther(uint _x) public payable returns (uint, uint) {
        x = _x;
        value = msg.value;

        return (x, value);
    }
}

contract Caller {
    function setX(Callee _callee, uint _x) public {
        uint x = _callee.setX(_x);
    }

    function setXFromAddress(address _addr, uint _x) public {
        Callee callee = Callee(_addr);
        callee.setX(_x);
    }

    function setXandSendEther(Callee _callee, uint _x) public payable {
        (uint x, uint value) = _callee.setXandSendEther{value: msg.value}(_x);
    }
}
```
