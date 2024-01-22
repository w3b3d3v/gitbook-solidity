# Assembly Loop

Exemplo de loop em `assembly`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyLoop {
    function yul_for_loop() public pure returns (uint z) {
        assembly {
            for { let i := 0 } lt(i, 10) { i := add(i, 1) } {
                z := add(z, 1)
            }
        }
    }
    
    function yul_while_loop() public pure returns (uint z) {
        assembly {
            let i := 0
            for {} lt(i, 5) {} {
                i := add(i, 1)
                z := add(z, 1)
            }
        }
    }
}
```

## Teste no Remix

- [AssemblyVariable.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5TG9vcCB7CiAgICBmdW5jdGlvbiB5dWxfZm9yX2xvb3AoKSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50IHopIHsKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIGZvciB7IGxldCBpIDo9IDAgfSBsdChpLCAxMCkgeyBpIDo9IGFkZChpLCAxKSB9IHsKICAgICAgICAgICAgICAgIHogOj0gYWRkKHosIDEpCiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIHl1bF93aGlsZV9sb29wKCkgcHVibGljIHB1cmUgcmV0dXJucyAodWludCB6KSB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICBsZXQgaSA6PSAwCiAgICAgICAgICAgIGZvciB7fSBsdChpLCA1KSB7fSB7CiAgICAgICAgICAgICAgICBpIDo9IGFkZChpLCAxKQogICAgICAgICAgICAgICAgeiA6PSBhZGQoeiwgMSkKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KfQ=&version=soljson-v0.8.20+commit.a1b79de6.js)
