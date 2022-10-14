# Implante qualquer Contrato

Implante qualquer contrato chamando `Proxy.deploy(bytes memory _code)`

Por este exemplo, você pode obter bytecodes do contrato chamando `Helper.getBytecode1` e `Helper.getBytecode2`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Proxy {
    event Deploy(address);

    receive() external payable {}

    function deploy(bytes memory _code) external payable returns (address addr) {
        assembly {
            // create(v, p, n)
            // v = quantidade de ETH a ser enviado
            // p = ponteiro na memória para iniciar o código
            // n = tamanho do código
            addr := create(callvalue(), add(_code, 0x20), mload(_code))
        }
        // retorna address 0 on error
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

## Teste no Remix

- [Proxy.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFByb3h5IHsKICAgIGV2ZW50IERlcGxveShhZGRyZXNzKTsKCiAgICByZWNlaXZlKCkgZXh0ZXJuYWwgcGF5YWJsZSB7fQoKICAgIGZ1bmN0aW9uIGRlcGxveShieXRlcyBtZW1vcnkgX2NvZGUpIGV4dGVybmFsIHBheWFibGUgcmV0dXJucyAoYWRkcmVzcyBhZGRyKSB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvLyBjcmVhdGUodiwgcCwgbikKICAgICAgICAgICAgLy8gdiA9IHF1YW50aWRhZGUgZGUgRVRIIGEgc2VyIGVudmlhZG8KICAgICAgICAgICAgLy8gcCA9IHBvbnRlaXJvIG5hIG1lbW9yaWEgcGFyYSBpbmljaWFyIG8gY29kaWdvCiAgICAgICAgICAgIC8vIG4gPSB0YW1hbmhvIGRvIGNvZGlnbwogICAgICAgICAgICBhZGRyIDo9IGNyZWF0ZShjYWxsdmFsdWUoKSwgYWRkKF9jb2RlLCAweDIwKSwgbWxvYWQoX2NvZGUpKQogICAgICAgIH0KICAgICAgICAvLyByZXRvcm5hIGFkZHJlc3MgMCBvbiBlcnJvcgogICAgICAgIHJlcXVpcmUoYWRkciAhPSBhZGRyZXNzKDApLCAiZGVwbG95IGZhaWxlZCIpOwoKICAgICAgICBlbWl0IERlcGxveShhZGRyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBleGVjdXRlKGFkZHJlc3MgX3RhcmdldCwgYnl0ZXMgbWVtb3J5IF9kYXRhKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICAoYm9vbCBzdWNjZXNzLCApID0gX3RhcmdldC5jYWxse3ZhbHVlOiBtc2cudmFsdWV9KF9kYXRhKTsKICAgICAgICByZXF1aXJlKHN1Y2Nlc3MsICJmYWlsZWQiKTsKICAgIH0KfQoKY29udHJhY3QgVGVzdENvbnRyYWN0MSB7CiAgICBhZGRyZXNzIHB1YmxpYyBvd25lciA9IG1zZy5zZW5kZXI7CgogICAgZnVuY3Rpb24gc2V0T3duZXIoYWRkcmVzcyBfb3duZXIpIHB1YmxpYyB7CiAgICAgICAgcmVxdWlyZShtc2cuc2VuZGVyID09IG93bmVyLCAibm90IG93bmVyIik7CiAgICAgICAgb3duZXIgPSBfb3duZXI7CiAgICB9Cn0KCmNvbnRyYWN0IFRlc3RDb250cmFjdDIgewogICAgYWRkcmVzcyBwdWJsaWMgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgdWludCBwdWJsaWMgdmFsdWUgPSBtc2cudmFsdWU7CiAgICB1aW50IHB1YmxpYyB4OwogICAgdWludCBwdWJsaWMgeTsKCiAgICBjb25zdHJ1Y3Rvcih1aW50IF94LCB1aW50IF95KSBwYXlhYmxlIHsKICAgICAgICB4ID0gX3g7CiAgICAgICAgeSA9IF95OwogICAgfQp9Cgpjb250cmFjdCBIZWxwZXIgewogICAgZnVuY3Rpb24gZ2V0Qnl0ZWNvZGUxKCkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICBieXRlcyBtZW1vcnkgYnl0ZWNvZGUgPSB0eXBlKFRlc3RDb250cmFjdDEpLmNyZWF0aW9uQ29kZTsKICAgICAgICByZXR1cm4gYnl0ZWNvZGU7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0Qnl0ZWNvZGUyKHVpbnQgX3gsIHVpbnQgX3kpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAoYnl0ZXMgbWVtb3J5KSB7CiAgICAgICAgYnl0ZXMgbWVtb3J5IGJ5dGVjb2RlID0gdHlwZShUZXN0Q29udHJhY3QyKS5jcmVhdGlvbkNvZGU7CiAgICAgICAgcmV0dXJuIGFiaS5lbmNvZGVQYWNrZWQoYnl0ZWNvZGUsIGFiaS5lbmNvZGUoX3gsIF95KSk7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0Q2FsbGRhdGEoYWRkcmVzcyBfb3duZXIpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAoYnl0ZXMgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIGFiaS5lbmNvZGVXaXRoU2lnbmF0dXJlKCJzZXRPd25lcihhZGRyZXNzKSIsIF9vd25lcik7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
