# Delegatecall

`delegatecall` é uma função de baixo nível semelhante a `call`.

Quando o contrato `A` executa `delegatecall` para contratar `B`, o código de `B` é executado

com armazenamento do contrato `A`, `msg.sender` e `msg.value`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

## Teste no Remix

- [Delegatecall.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIE5PVEE6IFByaW1laXJvIGltcGxlbWVudGUgZXN0ZSBjb250cmF0bwpjb250cmFjdCBCIHsKICAgIC8vIE5PVEE6IG8gbGF5b3V0IGRlIGFybWF6ZW5hbWVudG8gZGV2ZSBzZXIgbyBtZXNtbyBkbyBjb250cmF0byBBCiAgICB1aW50IHB1YmxpYyBudW07CiAgICBhZGRyZXNzIHB1YmxpYyBzZW5kZXI7CiAgICB1aW50IHB1YmxpYyB2YWx1ZTsKCiAgICBmdW5jdGlvbiBzZXRWYXJzKHVpbnQgX251bSkgcHVibGljIHBheWFibGUgewogICAgICAgIG51bSA9IF9udW07CiAgICAgICAgc2VuZGVyID0gbXNnLnNlbmRlcjsKICAgICAgICB2YWx1ZSA9IG1zZy52YWx1ZTsKICAgIH0KfQoKY29udHJhY3QgQSB7CiAgICB1aW50IHB1YmxpYyBudW07CiAgICBhZGRyZXNzIHB1YmxpYyBzZW5kZXI7CiAgICB1aW50IHB1YmxpYyB2YWx1ZTsKCiAgICBmdW5jdGlvbiBzZXRWYXJzKGFkZHJlc3MgX2NvbnRyYWN0LCB1aW50IF9udW0pIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICAvLyBPIGFybWF6ZW5hbWVudG8gZGUgQSBlIGRlZmluaWRvLCBCIG5hbyBlIG1vZGlmaWNhZG8uCiAgICAgICAgKGJvb2wgc3VjY2VzcywgYnl0ZXMgbWVtb3J5IGRhdGEpID0gX2NvbnRyYWN0LmRlbGVnYXRlY2FsbCgKICAgICAgICAgICAgYWJpLmVuY29kZVdpdGhTaWduYXR1cmUoInNldFZhcnModWludDI1NikiLCBfbnVtKQogICAgICAgICk7CiAgICB9Cn0=)
