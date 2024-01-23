# Assembly Conditional Statements

Exemplo de declarações condicionais em `assembly`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyIf {
    function yul_if(uint x) public pure returns (uint z) {
        assembly {
            // if condition = 1 { code }
            // no else
            // if 0 { z := 99 }
            // if 1 { z := 99 }
            if lt(x, 10) { z := 99 }
        }
    }
    
    function yul_switch(uint x) public pure returns (uint z) {
        assembly {
            switch x
            case 1 {
                z := 10
            }
            case 2 {
                z := 20
            }
            default {
                z := 0
            }
        }
    }
}
```

## Teste no Remix

- [AssemblyVariable.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5SWYgewogICAgZnVuY3Rpb24geXVsX2lmKHVpbnQgeCkgcHVibGljIHB1cmUgcmV0dXJucyAodWludCB6KSB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvLyBpZiBjb25kaXRpb24gPSAxIHsgY29kZSB9CiAgICAgICAgICAgIC8vIG5vIGVsc2UKICAgICAgICAgICAgLy8gaWYgMCB7IHogOj0gOTkgfQogICAgICAgICAgICAvLyBpZiAxIHsgeiA6PSA5OSB9CiAgICAgICAgICAgIGlmIGx0KHgsIDEwKSB7IHogOj0gOTkgfQogICAgICAgIH0KICAgIH0KICAgIAogICAgZnVuY3Rpb24geXVsX3N3aXRjaCh1aW50IHgpIHB1YmxpYyBwdXJlIHJldHVybnMgKHVpbnQgeikgewogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgc3dpdGNoIHgKICAgICAgICAgICAgY2FzZSAxIHsKICAgICAgICAgICAgICAgIHogOj0gMTAKICAgICAgICAgICAgfQogICAgICAgICAgICBjYXNlIDIgewogICAgICAgICAgICAgICAgeiA6PSAyMAogICAgICAgICAgICB9CiAgICAgICAgICAgIGRlZmF1bHQgewogICAgICAgICAgICAgICAgeiA6PSAwCiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
