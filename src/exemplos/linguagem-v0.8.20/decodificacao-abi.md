# Decodificação ABI

`abi.encode` codifica dados em `bytes`.

`abi.decode` decodifica `bytes` de volta em dados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AbiDecode {
    struct MyStruct {
        string name;
        uint[2] nums;
    }

    function encode(
        uint x,
        address addr,
        uint[] calldata arr,
        MyStruct calldata myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(x, addr, arr, myStruct);
    }

    function decode(bytes calldata data)
        external
        pure
        returns (
            uint x,
            address addr,
            uint[] memory arr,
            MyStruct memory myStruct
        )
    {
        // (uint x, address addr, uint[] memory arr, MyStruct myStruct) = ...
        (x, addr, arr, myStruct) = abi.decode(data, (uint, address, uint[], MyStruct));
    }
}
```

## Teste no Remix

- [AbiDecode.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFiaURlY29kZSB7CiAgICBzdHJ1Y3QgTXlTdHJ1Y3QgewogICAgICAgIHN0cmluZyBuYW1lOwogICAgICAgIHVpbnRbMl0gbnVtczsKICAgIH0KCiAgICBmdW5jdGlvbiBlbmNvZGUoCiAgICAgICAgdWludCB4LAogICAgICAgIGFkZHJlc3MgYWRkciwKICAgICAgICB1aW50W10gY2FsbGRhdGEgYXJyLAogICAgICAgIE15U3RydWN0IGNhbGxkYXRhIG15U3RydWN0CiAgICApIGV4dGVybmFsIHB1cmUgcmV0dXJucyAoYnl0ZXMgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIGFiaS5lbmNvZGUoeCwgYWRkciwgYXJyLCBteVN0cnVjdCk7CiAgICB9CgogICAgZnVuY3Rpb24gZGVjb2RlKGJ5dGVzIGNhbGxkYXRhIGRhdGEpCiAgICAgICAgZXh0ZXJuYWwKICAgICAgICBwdXJlCiAgICAgICAgcmV0dXJucyAoCiAgICAgICAgICAgIHVpbnQgeCwKICAgICAgICAgICAgYWRkcmVzcyBhZGRyLAogICAgICAgICAgICB1aW50W10gbWVtb3J5IGFyciwKICAgICAgICAgICAgTXlTdHJ1Y3QgbWVtb3J5IG15U3RydWN0CiAgICAgICAgKQogICAgewogICAgICAgIC8vICh1aW50IHgsIGFkZHJlc3MgYWRkciwgdWludFtdIG1lbW9yeSBhcnIsIE15U3RydWN0IG15U3RydWN0KSA9IC4uLgogICAgICAgICh4LCBhZGRyLCBhcnIsIG15U3RydWN0KSA9IGFiaS5kZWNvZGUoZGF0YSwgKHVpbnQsIGFkZHJlc3MsIHVpbnRbXSwgTXlTdHJ1Y3QpKTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
