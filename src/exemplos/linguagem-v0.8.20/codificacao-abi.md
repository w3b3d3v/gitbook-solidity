# Codificação ABI

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address, uint) external;
}

contract AbiEncode {
    function encodeWithSignature(address to, uint amount)
        external
        pure
        returns (bytes memory)
    {
        // Erro de digitação não é verificado - "transfer(address, uint)"
        return abi.encodeWithSignature("transfer(address,uint256)", to, amount);
    }

    function encodeWithSelector(address to, uint amount)
        external
        pure
        returns (bytes memory)
    {
        // Tipo não está marcado - (IERC20.transfer.selector, true, amount)
        return abi.encodeWithSelector(IERC20.transfer.selector, to, amount);
    }

    function encodeCall(address to, uint amount) external pure returns (bytes memory) {
        // Erros de digitação e tipo não serão compilados
        return abi.encodeCall(IERC20.transfer, (to, amount));
    }
}
```

## Teste no Remix

- [AbiEncode.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmludGVyZmFjZSBJRVJDMjAgewogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgdWludCkgZXh0ZXJuYWw7Cn0KCmNvbnRyYWN0IEFiaUVuY29kZSB7CiAgICBmdW5jdGlvbiBlbmNvZGVXaXRoU2lnbmF0dXJlKGFkZHJlc3MgdG8sIHVpbnQgYW1vdW50KQogICAgICAgIGV4dGVybmFsCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKGJ5dGVzIG1lbW9yeSkKICAgIHsKICAgICAgICAvLyBFcnJvIGRlIGRpZ2l0YWNhbyBuYW8gZSB2ZXJpZmljYWRvIC0gInRyYW5zZmVyKGFkZHJlc3MsIHVpbnQpIgogICAgICAgIHJldHVybiBhYmkuZW5jb2RlV2l0aFNpZ25hdHVyZSgidHJhbnNmZXIoYWRkcmVzcyx1aW50MjU2KSIsIHRvLCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGVuY29kZVdpdGhTZWxlY3RvcihhZGRyZXNzIHRvLCB1aW50IGFtb3VudCkKICAgICAgICBleHRlcm5hbAogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zIChieXRlcyBtZW1vcnkpCiAgICB7CiAgICAgICAgLy8gVGlwbyBuYW8gZXN0YSBtYXJjYWRvIC0gKElFUkMyMC50cmFuc2Zlci5zZWxlY3RvciwgdHJ1ZSwgYW1vdW50KQogICAgICAgIHJldHVybiBhYmkuZW5jb2RlV2l0aFNlbGVjdG9yKElFUkMyMC50cmFuc2Zlci5zZWxlY3RvciwgdG8sIGFtb3VudCk7CiAgICB9CgogICAgZnVuY3Rpb24gZW5jb2RlQ2FsbChhZGRyZXNzIHRvLCB1aW50IGFtb3VudCkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICAvLyBFcnJvcyBkZSBkaWdpdGFjYW8gZSB0aXBvIG5hbyBzZXJhbyBjb21waWxhZG9zCiAgICAgICAgcmV0dXJuIGFiaS5lbmNvZGVDYWxsKElFUkMyMC50cmFuc2ZlciwgKHRvLCBhbW91bnQpKTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
