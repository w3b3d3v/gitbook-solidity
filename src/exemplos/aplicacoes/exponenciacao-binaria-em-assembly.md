# Exponenciação binária em assembly

Exemplo de exponenciação binária em assembly

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssemblyBinExp {
    // Binary exponentiation to calculate x**n
    function rpow(uint256 x, uint256 n, uint256 b)
        public
        pure
        returns (uint256 z)
    {
        assembly {
            switch x
            // x = 0
            case 0 {
                switch n
                // n = 0 --> x**n = 0**0 --> 1
                case 0 { z := b }
                // n > 0 --> x**n = 0**n --> 0
                default { z := 0 }
            }
            default {
                switch mod(n, 2)
                // x > 0 and n is even --> z = 1
                case 0 { z := b }
                // x > 0 and n is odd --> z = x
                default { z := x }

                let half := div(b, 2) // for rounding.
                // n = n / 2, while n > 0, n = n / 2
                for { n := div(n, 2) } n { n := div(n, 2) } {
                    let xx := mul(x, x)
                    // Check overflow - revert if xx / x != x
                    if iszero(eq(div(xx, x), x)) { revert(0, 0) }
                    // Round (xx + half) / b
                    let xxRound := add(xx, half)
                    // Check overflow - revert if xxRound < xx
                    if lt(xxRound, xx) { revert(0, 0) }
                    x := div(xxRound, b)
                    // if n % 2 == 1
                    if mod(n, 2) {
                        let zx := mul(z, x)
                        // revert if x != 0 and zx / x != z
                        if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) {
                            revert(0, 0)
                        }
                        // Round (zx + half) / b
                        let zxRound := add(zx, half)
                        // Check overflow - revert if zxRound < zx
                        if lt(zxRound, zx) { revert(0, 0) }
                        z := div(zxRound, b)
                    }
                }
            }
        }
    }
}
```

## Teste no Remix

- [EtherWallet.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFzc2VtYmx5QmluRXhwIHsKICAgIC8vIEJpbmFyeSBleHBvbmVudGlhdGlvbiB0byBjYWxjdWxhdGUgeCoqbgogICAgZnVuY3Rpb24gcnBvdyh1aW50MjU2IHgsIHVpbnQyNTYgbiwgdWludDI1NiBiKQogICAgICAgIHB1YmxpYwogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zICh1aW50MjU2IHopCiAgICB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICBzd2l0Y2ggeAogICAgICAgICAgICAvLyB4ID0gMAogICAgICAgICAgICBjYXNlIDAgewogICAgICAgICAgICAgICAgc3dpdGNoIG4KICAgICAgICAgICAgICAgIC8vIG4gPSAwIC0tPiB4KipuID0gMCoqMCAtLT4gMQogICAgICAgICAgICAgICAgY2FzZSAwIHsgeiA6PSBiIH0KICAgICAgICAgICAgICAgIC8vIG4gPiAwIC0tPiB4KipuID0gMCoqbiAtLT4gMAogICAgICAgICAgICAgICAgZGVmYXVsdCB7IHogOj0gMCB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgZGVmYXVsdCB7CiAgICAgICAgICAgICAgICBzd2l0Y2ggbW9kKG4sIDIpCiAgICAgICAgICAgICAgICAvLyB4ID4gMCBhbmQgbiBpcyBldmVuIC0tPiB6ID0gMQogICAgICAgICAgICAgICAgY2FzZSAwIHsgeiA6PSBiIH0KICAgICAgICAgICAgICAgIC8vIHggPiAwIGFuZCBuIGlzIG9kZCAtLT4geiA9IHgKICAgICAgICAgICAgICAgIGRlZmF1bHQgeyB6IDo9IHggfQoKICAgICAgICAgICAgICAgIGxldCBoYWxmIDo9IGRpdihiLCAyKSAvLyBmb3Igcm91bmRpbmcuCiAgICAgICAgICAgICAgICAvLyBuID0gbiAvIDIsIHdoaWxlIG4gPiAwLCBuID0gbiAvIDIKICAgICAgICAgICAgICAgIGZvciB7IG4gOj0gZGl2KG4sIDIpIH0gbiB7IG4gOj0gZGl2KG4sIDIpIH0gewogICAgICAgICAgICAgICAgICAgIGxldCB4eCA6PSBtdWwoeCwgeCkKICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBvdmVyZmxvdyAtIHJldmVydCBpZiB4eCAvIHggIT0geAogICAgICAgICAgICAgICAgICAgIGlmIGlzemVybyhlcShkaXYoeHgsIHgpLCB4KSkgeyByZXZlcnQoMCwgMCkgfQogICAgICAgICAgICAgICAgICAgIC8vIFJvdW5kICh4eCArIGhhbGYpIC8gYgogICAgICAgICAgICAgICAgICAgIGxldCB4eFJvdW5kIDo9IGFkZCh4eCwgaGFsZikKICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBvdmVyZmxvdyAtIHJldmVydCBpZiB4eFJvdW5kIDwgeHgKICAgICAgICAgICAgICAgICAgICBpZiBsdCh4eFJvdW5kLCB4eCkgeyByZXZlcnQoMCwgMCkgfQogICAgICAgICAgICAgICAgICAgIHggOj0gZGl2KHh4Um91bmQsIGIpCiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbiAlIDIgPT0gMQogICAgICAgICAgICAgICAgICAgIGlmIG1vZChuLCAyKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB6eCA6PSBtdWwoeiwgeCkKICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJ0IGlmIHggIT0gMCBhbmQgenggLyB4ICE9IHoKICAgICAgICAgICAgICAgICAgICAgICAgaWYgYW5kKGlzemVybyhpc3plcm8oeCkpLCBpc3plcm8oZXEoZGl2KHp4LCB4KSwgeikpKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnQoMCwgMCkKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAvLyBSb3VuZCAoenggKyBoYWxmKSAvIGIKICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHp4Um91bmQgOj0gYWRkKHp4LCBoYWxmKQogICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBvdmVyZmxvdyAtIHJldmVydCBpZiB6eFJvdW5kIDwgengKICAgICAgICAgICAgICAgICAgICAgICAgaWYgbHQoenhSb3VuZCwgengpIHsgcmV2ZXJ0KDAsIDApIH0KICAgICAgICAgICAgICAgICAgICAgICAgeiA6PSBkaXYoenhSb3VuZCwgYikKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9Cn0K=&version=soljson-v0.8.20+commit.a1b79de6.js)
