# Try Catch

`try / catch` só pode captar erros de chamadas de função externa e criação de contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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
    // tryCatchExternalCall(0) => Log("falha na chamada externa")
    // tryCatchExternalCall(1) => Log("minha função foi chamada")
    function tryCatchExternalCall(uint _i) public {
        try foo.myFunc(_i) returns (string memory result) {
            emit Log(result);
        } catch {
            emit Log("falha na chamada externa");
        }
    }

    // Exemplo de try / catch com criação de contrato
    // tryCatchNewContract(0x0000000000000000000000000000000000000000) => Log("ebdereço inválido")
    // tryCatchNewContract(0x0000000000000000000000000000000000000001) => LogBytes("")
    // tryCatchNewContract(0x0000000000000000000000000000000000000002) => Log("Foo criado")
    function tryCatchNewContract(address _owner) public {
        try new Foo(_owner) returns (Foo foo) {
            // você pode usar a variável foo aqui
            emit Log("Foo criado");
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

## Teste no Remix

- [TryCatch.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIENvbnRyYXRvIGV4dGVybm8gdXNhZG8gcGFyYSBleGVtcGxvcyBkZSB0cnkgLyBjYXRjaApjb250cmFjdCBGb28gewogICAgYWRkcmVzcyBwdWJsaWMgb3duZXI7CgogICAgY29uc3RydWN0b3IoYWRkcmVzcyBfb3duZXIpIHsKICAgICAgICByZXF1aXJlKF9vd25lciAhPSBhZGRyZXNzKDApLCAiaW52YWxpZCBhZGRyZXNzIik7CiAgICAgICAgYXNzZXJ0KF9vd25lciAhPSAweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEpOwogICAgICAgIG93bmVyID0gX293bmVyOwogICAgfQoKICAgIGZ1bmN0aW9uIG15RnVuYyh1aW50IHgpIHB1YmxpYyBwdXJlIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXF1aXJlKHggIT0gMCwgInJlcXVpcmUgZmFpbGVkIik7CiAgICAgICAgcmV0dXJuICJteSBmdW5jIHdhcyBjYWxsZWQiOwogICAgfQp9Cgpjb250cmFjdCBCYXIgewogICAgZXZlbnQgTG9nKHN0cmluZyBtZXNzYWdlKTsKICAgIGV2ZW50IExvZ0J5dGVzKGJ5dGVzIGRhdGEpOwoKICAgIEZvbyBwdWJsaWMgZm9vOwoKICAgIGNvbnN0cnVjdG9yKCkgewogICAgICAgIC8vIEVzdGUgY29udHJhdG8gRm9vIGUgdXNhZG8gY29tbyBleGVtcGxvIGRlIHRyeSBjYXRjaCBjb20gY2hhbWFkYSBleHRlcm5hCiAgICAgICAgZm9vID0gbmV3IEZvbyhtc2cuc2VuZGVyKTsKICAgIH0KCiAgICAvLyBFeGVtcGxvIGRlIHRyeSAvIGNhdGNoIGNvbSBjaGFtYWRhIGV4dGVybmEKICAgIC8vIHRyeUNhdGNoRXh0ZXJuYWxDYWxsKDApID0+IExvZygiZmFsaGEgbmEgY2hhbWFkYSBleHRlcm5hIikKICAgIC8vIHRyeUNhdGNoRXh0ZXJuYWxDYWxsKDEpID0+IExvZygibWluaGEgZnVuY2FvIGZvaSBjaGFtYWRhIikKICAgIGZ1bmN0aW9uIHRyeUNhdGNoRXh0ZXJuYWxDYWxsKHVpbnQgX2kpIHB1YmxpYyB7CiAgICAgICAgdHJ5IGZvby5teUZ1bmMoX2kpIHJldHVybnMgKHN0cmluZyBtZW1vcnkgcmVzdWx0KSB7CiAgICAgICAgICAgIGVtaXQgTG9nKHJlc3VsdCk7CiAgICAgICAgfSBjYXRjaCB7CiAgICAgICAgICAgIGVtaXQgTG9nKCJmYWxoYSBuYSBjaGFtYWRhIGV4dGVybmEiKTsKICAgICAgICB9CiAgICB9CgogICAgLy8gRXhlbXBsbyBkZSB0cnkgLyBjYXRjaCBjb20gY3JpYWNhbyBkZSBjb250cmF0bwogICAgLy8gdHJ5Q2F0Y2hOZXdDb250cmFjdCgweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApID0+IExvZygiZWJkZXJlY28gaW52YWxpZG8iKQogICAgLy8gdHJ5Q2F0Y2hOZXdDb250cmFjdCgweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEpID0+IExvZ0J5dGVzKCIiKQogICAgLy8gdHJ5Q2F0Y2hOZXdDb250cmFjdCgweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIpID0+IExvZygiRm9vIGNyaWFkbyIpCiAgICBmdW5jdGlvbiB0cnlDYXRjaE5ld0NvbnRyYWN0KGFkZHJlc3MgX293bmVyKSBwdWJsaWMgewogICAgICAgIHRyeSBuZXcgRm9vKF9vd25lcikgcmV0dXJucyAoRm9vIGZvbykgewogICAgICAgICAgICAvLyB2b2NlIHBvZGUgdXNhciBhIHZhcmlhdmVsIGZvbyBhcXVpCiAgICAgICAgICAgIGVtaXQgTG9nKCJGb28gY3JpYWRvIik7CiAgICAgICAgfSBjYXRjaCBFcnJvcihzdHJpbmcgbWVtb3J5IHJlYXNvbikgewogICAgICAgICAgICAvLyBwZWdhIGEgZmFsaGEgcmV2ZXJ0KCkgZSByZXF1aXJlKCkKICAgICAgICAgICAgZW1pdCBMb2cocmVhc29uKTsKICAgICAgICB9IGNhdGNoIChieXRlcyBtZW1vcnkgcmVhc29uKSB7CiAgICAgICAgICAgIC8vIHBlZ2EgYSBmYWxoYSBhc3NlcnQoKQogICAgICAgICAgICBlbWl0IExvZ0J5dGVzKHJlYXNvbik7CiAgICAgICAgfQogICAgfQp9)