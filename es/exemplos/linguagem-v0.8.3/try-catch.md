# Try Catch

`try / catch` só pode captar erros de chamadas de função externa e criação de contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// Contrato externo usado para exemplos de try / catch
contract Foo {
    address public owner;

    constructor(address _owner) {
        require(_owner != address(0), "invalid address");
        assert(_owner != 0x0000000000000000000000000000000000000001);
        owner = _owner;
    }

    function myFunc(uint x) public pure returns (string memory) {
        require(x != 0, "require failed");
        return "my func was called";
    }
}

contract Bar {
    event Log(string message);
    event LogBytes(bytes data);

    Foo public foo;

    constructor() {
        // Este contrato Foo é usado como exemplo de try catch com chamada externa
        foo = new Foo(msg.sender);
    }

    // Exemplo de try / catch com chamada externa
    // tryCatchExternalCall(0) => Log("external call failed")
    // tryCatchExternalCall(1) => Log("my func was called")
    function tryCatchExternalCall(uint _i) public {
        try foo.myFunc(_i) returns (string memory result) {
            emit Log(result);
        } catch {
            emit Log("external call failed");
        }
    }

    // Exemplo de try / catch com criação de contrato
    // tryCatchNewContract(0x0000000000000000000000000000000000000000) => Log("invalid address")
    // tryCatchNewContract(0x0000000000000000000000000000000000000001) => LogBytes("")
    // tryCatchNewContract(0x0000000000000000000000000000000000000002) => Log("Foo created")
    function tryCatchNewContract(address _owner) public {
        try new Foo(_owner) returns (Foo foo) {
            // você pode usar a variável foo aqui
            emit Log("Foo created");
        } catch Error(string memory reason) {
            // pega a falha revert() e require()
            emit Log(reason);
        } catch (bytes memory reason) {
            // pega a falha assert()
            emit LogBytes(reason);
        }
    }
}
```
