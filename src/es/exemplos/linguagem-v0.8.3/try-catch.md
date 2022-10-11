# Try Catch

`try / catch` solo puede detectar errores de las llamadas de función externa y de la creación de contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// Contrato externo usado para ejemplos de try / catch
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
        // Este contrato Foo es usado como ejemplo de try catch como llamada externa
        foo = new Foo(msg.sender);
    }

    // Ejemplo de try / catch con llamada externa
    // tryCatchExternalCall(0) => Log("external call failed")
    // tryCatchExternalCall(1) => Log("my func was called")
    function tryCatchExternalCall(uint _i) public {
        try foo.myFunc(_i) returns (string memory result) {
            emit Log(result);
        } catch {
            emit Log("external call failed");
        }
    }

    // Ejemplo de try / catch con la creación de contrato
    // tryCatchNewContract(0x0000000000000000000000000000000000000000) => Log("invalid address")
    // tryCatchNewContract(0x0000000000000000000000000000000000000001) => LogBytes("")
    // tryCatchNewContract(0x0000000000000000000000000000000000000002) => Log("Foo created")
    function tryCatchNewContract(address _owner) public {
        try new Foo(_owner) returns (Foo foo) {
            // Puedes usar la variable foo aquí
            emit Log("Foo created");
        } catch Error(string memory reason) {
            // catch falla en el revert() y require()
            emit Log(reason);
        } catch (bytes memory reason) {
            // catch falla assert()
            emit LogBytes(reason);
        }
    }
}
```
