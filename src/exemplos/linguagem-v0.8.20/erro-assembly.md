# Assembly Error

Exemplo de erro em `assembly`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyError {
    function yul_revert(uint x) public pure {
        assembly {
            // revert(p, s) - end execution
            //                revert state changes
            //                return data mem[p…(p+s))
            if gt(x, 10) { revert(0, 0) }
        }
    }
}
```

## Teste no Remix

- [AssemblyVariable.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5RXJyb3IgewogICAgZnVuY3Rpb24geXVsX3JldmVydCh1aW50IHgpIHB1YmxpYyBwdXJlIHsKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIC8vIHJldmVydChwLCBzKSAtIGVuZCBleGVjdXRpb24KICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgcmV2ZXJ0IHN0YXRlIGNoYW5nZXMKICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEgbWVtW3A/KHArcykpCiAgICAgICAgICAgIGlmIGd0KHgsIDEwKSB7IHJldmVydCgwLCAwKSB9CiAgICAgICAgfQogICAgfQp9=&version=soljson-v0.8.20+commit.a1b79de6.js)
