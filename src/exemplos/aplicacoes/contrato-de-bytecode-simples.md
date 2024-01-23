# Contrato de Bytecode simples

Exemplo simples de contrato escrito em bytecode

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Factory {
    event Log(address addr);

    // Deploys a contract that always returns 42
    function deploy() external {
        bytes memory bytecode = hex"69602a60005260206000f3600052600a6016f3";
        address addr;
        assembly {
            // create(value, offset, size)
            addr := create(0, add(bytecode, 0x20), 0x13)
        }
        require(addr != address(0));

        emit Log(addr);
    }
}

interface IContract {
    function getMeaningOfLife() external view returns (uint);
}

// https://www.evm.codes/playground
/*
Run time code - return 42
602a60005260206000f3

// Store 42 to memory
mstore(p, v) - store v at memory p to p + 32

PUSH1 0x2a
PUSH1 0
MSTORE

// Return 32 bytes from memory
return(p, s) - end execution and return data from memory p to p + s

PUSH1 0x20
PUSH1 0
RETURN

Creation code - return runtime code
69602a60005260206000f3600052600a6016f3

// Store run time code to memory
PUSH10 0X602a60005260206000f3
PUSH1 0
MSTORE

// Return 10 bytes from memory starting at offset 22
PUSH1 0x0a
PUSH1 0x16
RETURN
*/
```

## Teste no Remix

- [Factory.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEZhY3RvcnkgewogICAgZXZlbnQgTG9nKGFkZHJlc3MgYWRkcik7CgogICAgLy8gRGVwbG95cyBhIGNvbnRyYWN0IHRoYXQgYWx3YXlzIHJldHVybnMgNDIKICAgIGZ1bmN0aW9uIGRlcGxveSgpIGV4dGVybmFsIHsKICAgICAgICBieXRlcyBtZW1vcnkgYnl0ZWNvZGUgPSBoZXhcIjY5NjAyYTYwMDA1MjYwMjA2MDAwZjM2MDAwNTI2MDBhNjAxNmYzXCI7CiAgICAgICAgYWRkcmVzcyBhZGRyOwogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgLy8gY3JlYXRlKHZhbHVlLCBvZmZzZXQsIHNpemUpCiAgICAgICAgICAgIGFkZHIgOj0gY3JlYXRlKDAsIGFkZChieXRlY29kZSwgMHgyMCksIDB4MTMpCiAgICAgICAgfQogICAgICAgIHJlcXVpcmUoYWRkciAhPSBhZGRyZXNzKDApKTsKCiAgICAgICAgZW1pdCBMb2coYWRkcik7CiAgICB9Cn0KCmludGVyZmFjZSBJQ29udHJhY3QgewogICAgZnVuY3Rpb24gZ2V0TWVhbmluZ09mTGlmZSgpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludCk7Cn0KCi8vIGh0dHBzOi8vd3d3LmV2bS5jb2Rlcy9wbGF5Z3JvdW5kCi8qClJ1biB0aW1lIGNvZGUgLSByZXR1cm4gNDIKNjAyYTYwMDA1MjYwMjA2MDAwZjMKCi8vIFN0b3JlIDQyIHRvIG1lbW9yeQptc3RvcmUocCwgdikgLSBzdG9yZSB2IGF0IG1lbW9yeSBwIHRvIHAgKyAzMgoKUFVTSDEgMHgyYQpQVVNIMSAwCk1TVE9SRQoKLy8gUmV0dXJuIDMyIGJ5dGVzIGZyb20gbWVtb3J5CnJldHVybihwLCBzKSAtIGVuZCBleGVjdXRpb24gYW5kIHJldHVybiBkYXRhIGZyb20gbWVtb3J5IHAgdG8gcCArIHMKClBVU0gxIDB4MjAKUFVTSDEgMApSRVRVUk4KCkNyZWF0aW9uIGNvZGUgLSByZXR1cm4gcnVudGltZSBjb2RlCjY5NjAyYTYwMDA1MjYwMjA2MDAwZjM2MDAwNTI2MDBhNjAxNmYzCgovLyBTdG9yZSBydW4gdGltZSBjb2RlIHRvIG1lbW9yeQpQVVNIMTAgMFg2MDJhNjAwMDUyNjAyMDYwMDBmMwpQVVNIMSAwCk1TVE9SRQoKLy8gUmV0dXJuIDEwIGJ5dGVzIGZyb20gbWVtb3J5IHN0YXJ0aW5nIGF0IG9mZnNldCAyMgpQVVNIMSAweDBhClBVU0gxIDB4MTYKUkVUVVJOCiov=&version=soljson-v0.8.20+commit.a1b79de6.js)
