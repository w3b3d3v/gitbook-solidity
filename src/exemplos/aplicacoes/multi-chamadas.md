# Multi chamadas

Um exemplo de contrato que agrega várias consultas usando um loop `for` e `staticcall`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiCall {
    function multiCall(address[] calldata targets, bytes[] calldata data)
        external
        view
        returns (bytes[] memory)
    {
        require(targets.length == data.length, "target length != data length");

        bytes[] memory results = new bytes[](data.length);

        for (uint i; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].staticcall(data[i]);
            require(success, "call failed");
            results[i] = result;
        }

        return results;
    }
}
```

Contrato para testar `MultiCall`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestMultiCall {
    function test(uint _i) external pure returns (uint) {
        return _i;
    }

    function getData(uint _i) external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.test.selector, _i);
    }
}
```

## Teste no Remix

- [MultiCall.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IE11bHRpQ2FsbCB7CiAgICBmdW5jdGlvbiBtdWx0aUNhbGwoYWRkcmVzc1tdIGNhbGxkYXRhIHRhcmdldHMsIGJ5dGVzW10gY2FsbGRhdGEgZGF0YSkKICAgICAgICBleHRlcm5hbAogICAgICAgIHZpZXcKICAgICAgICByZXR1cm5zIChieXRlc1tdIG1lbW9yeSkKICAgIHsKICAgICAgICByZXF1aXJlKHRhcmdldHMubGVuZ3RoID09IGRhdGEubGVuZ3RoLCAidGFyZ2V0IGxlbmd0aCAhPSBkYXRhIGxlbmd0aCIpOwoKICAgICAgICBieXRlc1tdIG1lbW9yeSByZXN1bHRzID0gbmV3IGJ5dGVzW10oZGF0YS5sZW5ndGgpOwoKICAgICAgICBmb3IgKHVpbnQgaTsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgKGJvb2wgc3VjY2VzcywgYnl0ZXMgbWVtb3J5IHJlc3VsdCkgPSB0YXJnZXRzW2ldLnN0YXRpY2NhbGwoZGF0YVtpXSk7CiAgICAgICAgICAgIHJlcXVpcmUoc3VjY2VzcywgImNhbGwgZmFpbGVkIik7CiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSByZXN1bHQ7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gcmVzdWx0czsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
- [TestMultiCall.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFRlc3RNdWx0aUNhbGwgewogICAgZnVuY3Rpb24gdGVzdCh1aW50IF9pKSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gX2k7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0RGF0YSh1aW50IF9pKSBleHRlcm5hbCBwdXJlIHJldHVybnMgKGJ5dGVzIG1lbW9yeSkgewogICAgICAgIHJldHVybiBhYmkuZW5jb2RlV2l0aFNlbGVjdG9yKHRoaXMudGVzdC5zZWxlY3RvciwgX2kpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
