# Implante qualquer Contrato

Implante qualquer contrato chamando `Proxy.deploy(bytes memory _code)`

Por este exemplo, você pode obter bytecodes do contrato chamando `Helper.getBytecode1` e `Helper.getBytecode2`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Proxy {
    event Deploy(address);

    fallback() external payable {}

    function deploy(bytes memory _code) external payable returns (address addr) {
        assembly {
            // create(v, p, n)
            // v = quantidade de ETH a ser enviado
            // p = ponteiro na memória para iniciar o código
            // n = tamanho do código
            addr := create(callvalue(), add(_code, 0x20), mload(_code))
        }
        // retorna endereço 0 em erro
        require(addr != address(0), "deploy failed");

        emit Deploy(addr);
    }

    function execute(address _target, bytes memory _data) external payable {
        (bool success, ) = _target.call{value: msg.value}(_data);
        require(success, "failed");
    }
}

contract TestContract1 {
    address public owner = msg.sender;

    function setOwner(address _owner) public {
        require(msg.sender == owner, "not owner");
        owner = _owner;
    }
}

contract TestContract2 {
    address public owner = msg.sender;
    uint public value = msg.value;
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) payable {
        x = _x;
        y = _y;
    }
}

contract Helper {
    function getBytecode1() external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract1).creationCode;
        return bytecode;
    }

    function getBytecode2(uint _x, uint _y) external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract2).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_x, _y));
    }

    function getCalldata(address _owner) external pure returns (bytes memory) {
        return abi.encodeWithSignature("setOwner(address)", _owner);
    }
}
```
