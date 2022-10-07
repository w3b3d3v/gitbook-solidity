# Delegatecall

`delegatecall` é uma função de baixo nível semelhante a `call`.

Quando o contrato `A` executa `delegatecall` para contratar `B`, o código de B é executado

com armazenamento do contrato A, `msg.sender` e `msg.value`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// NOTA: Primeiro implemente este contrato
contract B {
    // NOTA: o layout de armazenamento deve ser o mesmo do contrato A
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
        // O armazenamento de A é definido, B não é modificado.
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
}
```
