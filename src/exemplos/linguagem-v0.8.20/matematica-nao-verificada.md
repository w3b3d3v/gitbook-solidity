# Unchecked Math

O Overflow e o underflow de números no Solidity 0.8 geram um erro. Isto pode ser desativado usando `unchecked`.

A desativação da overflow/underflow poupa gás.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UncheckedMath {
    function add(uint x, uint y) external pure returns (uint) {
        // 22291 gas
        // return x + y;

        // 22103 gas
        unchecked {
            return x + y;
        }
    }

    function sub(uint x, uint y) external pure returns (uint) {
        // 22329 gas
        // return x - y;

        // 22147 gas
        unchecked {
            return x - y;
        }
    }

    function sumOfCubes(uint x, uint y) external pure returns (uint) {
        // Envolva lógica matemática complexa dentro de unchecked
        unchecked {
            uint x3 = x * x * x;
            uint y3 = y * y * y;

            return x3 + y3;
        }
    }
}
```

## Teste no Remix

- [UncheckedMath.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFVuY2hlY2tlZE1hdGggewogICAgZnVuY3Rpb24gYWRkKHVpbnQgeCwgdWludCB5KSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICAvLyAyMjI5MSBnYXMKICAgICAgICAvLyByZXR1cm4geCArIHk7CgogICAgICAgIC8vIDIyMTAzIGdhcwogICAgICAgIHVuY2hlY2tlZCB7CiAgICAgICAgICAgIHJldHVybiB4ICsgeTsKICAgICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gc3ViKHVpbnQgeCwgdWludCB5KSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICAvLyAyMjMyOSBnYXMKICAgICAgICAvLyByZXR1cm4geCAtIHk7CgogICAgICAgIC8vIDIyMTQ3IGdhcwogICAgICAgIHVuY2hlY2tlZCB7CiAgICAgICAgICAgIHJldHVybiB4IC0geTsKICAgICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gc3VtT2ZDdWJlcyh1aW50IHgsIHVpbnQgeSkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgLy8gRW52b2x2YSBsb2dpY2EgbWF0ZW1hdGljYSBjb21wbGV4YSBkZW50cm8gZGUgdW5jaGVja2VkCiAgICAgICAgdW5jaGVja2VkIHsKICAgICAgICAgICAgdWludCB4MyA9IHggKiB4ICogeDsKICAgICAgICAgICAgdWludCB5MyA9IHkgKiB5ICogeTsKCiAgICAgICAgICAgIHJldHVybiB4MyArIHkzOwogICAgICAgIH0KICAgIH0KfQ=&version=soljson-v0.8.20+commit.a1b79de6.js)
