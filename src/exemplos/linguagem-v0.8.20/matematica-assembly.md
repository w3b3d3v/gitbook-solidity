# Assembly Math

Exemplo de erro em `assembly`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyMath {
    function yul_add(uint x, uint y) public pure returns (uint z) {
        assembly {
            z := add(x, y)
            if lt(z, x) { revert(0, 0) }
        }
    }
    
    function yul_mul(uint x, uint y) public pure returns (uint z) {
        assembly {
            switch x
            case 0 { z := 0 }
            default {
                z := mul(x, y)
                if iszero(eq(div(z, x), y)) { revert(0, 0) }
            }
        }
    }
    
    // Arredondar para o múltiplo mais próximo de b
    function yul_fixed_point_round(uint x, uint b) public pure returns (uint z) {
        assembly {
            // b = 100
            // x = 90
            // z = 90 / 100 * 100 = 0, want z = 100
            // z := mul(div(x, b), b)
            
            let half := div(b, 2)
            z := add(x, half)
            z := mul(div(z, b), b)
            // x = 90
            // half = 50
            // z = 90 + 50 = 140
            // z = 140 / 100 * 100 = 100
        }
    }
}
```

## Teste no Remix

- [AssemblyVariable.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5TWF0aCB7CiAgICBmdW5jdGlvbiB5dWxfYWRkKHVpbnQgeCwgdWludCB5KSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50IHopIHsKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIHogOj0gYWRkKHgsIHkpCiAgICAgICAgICAgIGlmIGx0KHosIHgpIHsgcmV2ZXJ0KDAsIDApIH0KICAgICAgICB9CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIHl1bF9tdWwodWludCB4LCB1aW50IHkpIHB1YmxpYyBwdXJlIHJldHVybnMgKHVpbnQgeikgewogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgc3dpdGNoIHgKICAgICAgICAgICAgY2FzZSAwIHsgeiA6PSAwIH0KICAgICAgICAgICAgZGVmYXVsdCB7CiAgICAgICAgICAgICAgICB6IDo9IG11bCh4LCB5KQogICAgICAgICAgICAgICAgaWYgaXN6ZXJvKGVxKGRpdih6LCB4KSwgeSkpIHsgcmV2ZXJ0KDAsIDApIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIAogICAgLy8gQXJyZWRvbmRhciBwYXJhIG8gbXVsdGlwbG8gbWFpcyBwcm94aW1vIGRlIGIKICAgIGZ1bmN0aW9uIHl1bF9maXhlZF9wb2ludF9yb3VuZCh1aW50IHgsIHVpbnQgYikgcHVibGljIHB1cmUgcmV0dXJucyAodWludCB6KSB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvLyBiID0gMTAwCiAgICAgICAgICAgIC8vIHggPSA5MAogICAgICAgICAgICAvLyB6ID0gOTAgLyAxMDAgKiAxMDAgPSAwLCB3YW50IHogPSAxMDAKICAgICAgICAgICAgLy8geiA6PSBtdWwoZGl2KHgsIGIpLCBiKQogICAgICAgICAgICAKICAgICAgICAgICAgbGV0IGhhbGYgOj0gZGl2KGIsIDIpCiAgICAgICAgICAgIHogOj0gYWRkKHgsIGhhbGYpCiAgICAgICAgICAgIHogOj0gbXVsKGRpdih6LCBiKSwgYikKICAgICAgICAgICAgLy8geCA9IDkwCiAgICAgICAgICAgIC8vIGhhbGYgPSA1MAogICAgICAgICAgICAvLyB6ID0gOTAgKyA1MCA9IDE0MAogICAgICAgICAgICAvLyB6ID0gMTQwIC8gMTAwICogMTAwID0gMTAwCiAgICAgICAgfQogICAgfQp9=&version=soljson-v0.8.20+commit.a1b79de6.js)
