# Codificação ABI

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20 {
    function transfer(address, uint) external;
}

contract AbiEncode {
    function encodeWithSignature(address to, uint amount)
        external
        pure
        returns (bytes memory)
    {
        // Typo is not checked - "transfer(address, uint)"
        return abi.encodeWithSignature("transfer(address,uint256)", to, amount);
    }

    function encodeWithSelector(address to, uint amount)
        external
        pure
        returns (bytes memory)
    {
        // Type is not checked - (IERC20.transfer.selector, true, amount)
        return abi.encodeWithSelector(IERC20.transfer.selector, to, amount);
    }

    function encodeCall(address to, uint amount) external pure returns (bytes memory) {
        // Typo and type errors will not compile
        return abi.encodeCall(IERC20.transfer, (to, amount));
    }
}
```

## Experimente no Remix

- [AbiEncode.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmludGVyZmFjZSBJRVJDMjAgewogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgdWludCkgZXh0ZXJuYWw7Cn0KCmNvbnRyYWN0IEFiaUVuY29kZSB7CiAgICBmdW5jdGlvbiBlbmNvZGVXaXRoU2lnbmF0dXJlKGFkZHJlc3MgdG8sIHVpbnQgYW1vdW50KQogICAgICAgIGV4dGVybmFsCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKGJ5dGVzIG1lbW9yeSkKICAgIHsKICAgICAgICAvLyBUeXBvIGlzIG5vdCBjaGVja2VkIC0gInRyYW5zZmVyKGFkZHJlc3MsIHVpbnQpIgogICAgICAgIHJldHVybiBhYmkuZW5jb2RlV2l0aFNpZ25hdHVyZSgidHJhbnNmZXIoYWRkcmVzcyx1aW50MjU2KSIsIHRvLCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGVuY29kZVdpdGhTZWxlY3RvcihhZGRyZXNzIHRvLCB1aW50IGFtb3VudCkKICAgICAgICBleHRlcm5hbAogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zIChieXRlcyBtZW1vcnkpCiAgICB7CiAgICAgICAgLy8gVHlwZSBpcyBub3QgY2hlY2tlZCAtIChJRVJDMjAudHJhbnNmZXIuc2VsZWN0b3IsIHRydWUsIGFtb3VudCkKICAgICAgICByZXR1cm4gYWJpLmVuY29kZVdpdGhTZWxlY3RvcihJRVJDMjAudHJhbnNmZXIuc2VsZWN0b3IsIHRvLCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGVuY29kZUNhbGwoYWRkcmVzcyB0bywgdWludCBhbW91bnQpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAoYnl0ZXMgbWVtb3J5KSB7CiAgICAgICAgLy8gVHlwbyBhbmQgdHlwZSBlcnJvcnMgd2lsbCBub3QgY29tcGlsZQogICAgICAgIHJldHVybiBhYmkuZW5jb2RlQ2FsbChJRVJDMjAudHJhbnNmZXIsICh0bywgYW1vdW50KSk7CiAgICB9Cn0=)
