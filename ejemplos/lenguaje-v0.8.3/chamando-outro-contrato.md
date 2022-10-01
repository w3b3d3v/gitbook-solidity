# Chamando outro Contrato

Um contrato pode chamar outros contratos de 2 formas.

A maneira mais fácil é apenas chamá-lo, como `A.foo(x, y, z)`.

Outra maneira de chamar outros contratos é usar chamada de nível baixo.

Esse método não é recomendado.

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
```
