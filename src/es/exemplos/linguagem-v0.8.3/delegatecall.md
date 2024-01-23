# Delegatecall

`delegatecall` es una función de bajo nivel, similar a `call`.

Cuando el contrato `A` ejecuta `delegatecall` para contratar a `B`, el código de `B` es ejecutado

con el almacenamiento (storage) del contrato A, `msg.sender` y `msg.value`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// NOTA: Despliega este contrato en primer lugar
contract B {
    // NOTA: el layout del almacenamiento debe ser el mismo como el del contrato A
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract A {
    uint public num;
    address public sender;
    uint public value;

    function setVars(address _contract, uint _num) public payable {
        // El almacenamiento de A es establecido, B no se modificó.
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
}
```
