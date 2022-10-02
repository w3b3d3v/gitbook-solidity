# Operadores bit a bit

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract BitwiseOps {
    // x     = 1110 = 8 + 4 + 2 + 0 = 14
    // y     = 1011 = 8 + 0 + 2 + 1 = 11
    // x & y = 1010 = 8 + 0 + 2 + 0 = 10
    function and(uint x, uint y) external pure returns (uint) {
        return x & y;
    }

    // x     = 1100 = 8 + 4 + 0 + 0 = 12
    // y     = 1001 = 8 + 0 + 0 + 1 = 9
    // x | y = 1101 = 8 + 4 + 0 + 1 = 13
    function or(uint x, uint y) external pure returns (uint) {
        return x | y;
    }

    // x     = 1100 = 8 + 4 + 0 + 0 = 12
    // y     = 0101 = 0 + 4 + 0 + 1 = 5
    // x ^ y = 1001 = 8 + 0 + 0 + 1 = 9
    function xor(uint x, uint y) external pure returns (uint) {
        return x ^ y;
    }

    // x  = 00001100 =   0 +  0 +  0 +  0 + 8 + 4 + 0 + 0 = 12
    // ~x = 11110011 = 128 + 64 + 32 + 16 + 0 + 0 + 2 + 1 = 243
    function not(uint8 x) external pure returns (uint8) {
        return ~x;
    }

    // 1 << 0 = 0001 --> 0001 = 1
    // 1 << 1 = 0001 --> 0010 = 2
    // 1 << 2 = 0001 --> 0100 = 4
    // 1 << 3 = 0001 --> 1000 = 8
    // 3 << 2 = 0011 --> 1100 = 12
    function shiftLeft(uint x, uint bits) external pure returns (uint) {
        return x << bits;
    }

    // 8  >> 0 = 1000 --> 1000 = 8
    // 8  >> 1 = 1000 --> 0100 = 4
    // 8  >> 2 = 1000 --> 0010 = 2
    // 8  >> 3 = 1000 --> 0001 = 1
    // 8  >> 4 = 1000 --> 0000 = 0
    // 12 >> 1 = 1100 --> 0110 = 6
    function shiftRight(uint x, uint bits) external pure returns (uint) {
        return x >> bits;
    }

    // Pegando os últimos n bits de x
    function getLastNBits(uint x, uint n) external pure returns (uint) {
        // Exemplo, últimos 3 bits
        // x        = 1101 = 13
        // mask     = 0111 = 7
        // x & mask = 0101 = 5
        uint mask = (1 << n) - 1;
        return x & mask;
    }

    // Pegando os últimos n bits de x usando operador mod
    function getLastNBitsUsingMod(uint x, uint n) external pure returns (uint) {
        // 1 << n = 2 ** n
        return x % (1 << n);
    }

    // Pegando posição do bit mais significativo
    // x = 1100 = 10, bit mais significativo = 1000, então esta função retornará 3
    function mostSignificantBit(uint x) external pure returns (uint) {
        uint i = 0;
        while ((x >>= 1) > 0) {
            ++i;
        }
        return i;
    }

    // Pegando os primeiros n bits de x
    // len = tamanho dos bits em x = posição do bit mais significativo de x, + 1
    function getFirstNBits(
        uint x,
        uint n,
        uint len
    ) external pure returns (uint) {
        // Exemplo
        // x        = 1110 = 14, n = 2, len = 4
        // mask     = 1100 = 12
        // x & mask = 1100 = 12
        uint mask = ((1 << n) - 1) << (len - n);
        return x & mask;
    }

    // Encontrando o bit mais significativo usando busca binária
    function mostSignificantBitWithBinarySearch(uint x)
        external
        pure
        returns (uint8 r)
    {
        // x >= 2 ** 128
        if (x >= 0x100000000000000000000000000000000) {
            x >>= 128;
            r += 128;
        }
        // x >= 2 ** 64
        if (x >= 0x10000000000000000) {
            x >>= 64;
            r += 64;
        }
        // x >= 2 ** 32
        if (x >= 0x100000000) {
            x >>= 32;
            r += 32;
        }
        // x >= 2 ** 16
        if (x >= 0x10000) {
            x >>= 16;
            r += 16;
        }
        // x >= 2 ** 8
        if (x >= 0x100) {
            x >>= 8;
            r += 8;
        }
        // x >= 2 ** 4
        if (x >= 0x10) {
            x >>= 4;
            r += 4;
        }
        // x >= 2 ** 2
        if (x >= 0x4) {
            x >>= 2;
            r += 2;
        }
        // x >= 2 ** 1
        if (x >= 0x2) r += 1;
    }
}

```

## Teste no Remix

[Bitwise.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEJpdHdpc2VPcHMgewogICAgLy8geCAgICAgPSAxMTEwID0gOCArIDQgKyAyICsgMCA9IDE0CiAgICAvLyB5ICAgICA9IDEwMTEgPSA4ICsgMCArIDIgKyAxID0gMTEKICAgIC8vIHggJiB5ID0gMTAxMCA9IDggKyAwICsgMiArIDAgPSAxMAogICAgZnVuY3Rpb24gYW5kKHVpbnQgeCwgdWludCB5KSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4geCAmIHk7CiAgICB9CgogICAgLy8geCAgICAgPSAxMTAwID0gOCArIDQgKyAwICsgMCA9IDEyCiAgICAvLyB5ICAgICA9IDEwMDEgPSA4ICsgMCArIDAgKyAxID0gOQogICAgLy8geCB8IHkgPSAxMTAxID0gOCArIDQgKyAwICsgMSA9IDEzCiAgICBmdW5jdGlvbiBvcih1aW50IHgsIHVpbnQgeSkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIHggfCB5OwogICAgfQoKICAgIC8vIHggICAgID0gMTEwMCA9IDggKyA0ICsgMCArIDAgPSAxMgogICAgLy8geSAgICAgPSAwMTAxID0gMCArIDQgKyAwICsgMSA9IDUKICAgIC8vIHggXiB5ID0gMTAwMSA9IDggKyAwICsgMCArIDEgPSA5CiAgICBmdW5jdGlvbiB4b3IodWludCB4LCB1aW50IHkpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiB4IF4geTsKICAgIH0KCiAgICAvLyB4ICA9IDAwMDAxMTAwID0gICAwICsgIDAgKyAgMCArICAwICsgOCArIDQgKyAwICsgMCA9IDEyCiAgICAvLyB+eCA9IDExMTEwMDExID0gMTI4ICsgNjQgKyAzMiArIDE2ICsgMCArIDAgKyAyICsgMSA9IDI0MwogICAgZnVuY3Rpb24gbm90KHVpbnQ4IHgpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludDgpIHsKICAgICAgICByZXR1cm4gfng7CiAgICB9CgogICAgLy8gMSA8PCAwID0gMDAwMSAtLT4gMDAwMSA9IDEKICAgIC8vIDEgPDwgMSA9IDAwMDEgLS0+IDAwMTAgPSAyCiAgICAvLyAxIDw8IDIgPSAwMDAxIC0tPiAwMTAwID0gNAogICAgLy8gMSA8PCAzID0gMDAwMSAtLT4gMTAwMCA9IDgKICAgIC8vIDMgPDwgMiA9IDAwMTEgLS0+IDExMDAgPSAxMgogICAgZnVuY3Rpb24gc2hpZnRMZWZ0KHVpbnQgeCwgdWludCBiaXRzKSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4geCA8PCBiaXRzOwogICAgfQoKICAgIC8vIDggID4+IDAgPSAxMDAwIC0tPiAxMDAwID0gOAogICAgLy8gOCAgPj4gMSA9IDEwMDAgLS0+IDAxMDAgPSA0CiAgICAvLyA4ICA+PiAyID0gMTAwMCAtLT4gMDAxMCA9IDIKICAgIC8vIDggID4+IDMgPSAxMDAwIC0tPiAwMDAxID0gMQogICAgLy8gOCAgPj4gNCA9IDEwMDAgLS0+IDAwMDAgPSAwCiAgICAvLyAxMiA+PiAxID0gMTEwMCAtLT4gMDExMCA9IDYKICAgIGZ1bmN0aW9uIHNoaWZ0UmlnaHQodWludCB4LCB1aW50IGJpdHMpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiB4ID4+IGJpdHM7CiAgICB9CgogICAgLy8gUGVnYW5kbyBvcyB1bHRpbW9zIG4gYml0cyBkZSB4CiAgICBmdW5jdGlvbiBnZXRMYXN0TkJpdHModWludCB4LCB1aW50IG4pIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIC8vIEV4ZW1wbG8sIHVsdGltb3MgMyBiaXRzCiAgICAgICAgLy8geCAgICAgICAgPSAxMTAxID0gMTMKICAgICAgICAvLyBtYXNrICAgICA9IDAxMTEgPSA3CiAgICAgICAgLy8geCAmIG1hc2sgPSAwMTAxID0gNQogICAgICAgIHVpbnQgbWFzayA9ICgxIDw8IG4pIC0gMTsKICAgICAgICByZXR1cm4geCAmIG1hc2s7CiAgICB9CgogICAgLy8gUGVnYW5kbyBvcyB1bHRpbW9zIG4gYml0cyBkZSB4IHVzYW5kbyBvcGVyYWRvciBtb2QKICAgIGZ1bmN0aW9uIGdldExhc3ROQml0c1VzaW5nTW9kKHVpbnQgeCwgdWludCBuKSBleHRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICAvLyAxIDw8IG4gPSAyICoqIG4KICAgICAgICByZXR1cm4geCAlICgxIDw8IG4pOwogICAgfQoKICAgIC8vIFBlZ2FuZG8gcG9zaWNhbyBkbyBiaXQgbWFpcyBzaWduaWZpY2F0aXZvCiAgICAvLyB4ID0gMTEwMCA9IDEwLCBiaXQgbWFpcyBzaWduaWZpY2F0aXZvID0gMTAwMCwgZW50YW8gZXN0YSBmdW5jYW8gcmV0b3JuYXJhIDMKICAgIGZ1bmN0aW9uIG1vc3RTaWduaWZpY2FudEJpdCh1aW50IHgpIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIHVpbnQgaSA9IDA7CiAgICAgICAgd2hpbGUgKCh4ID4+PSAxKSA+IDApIHsKICAgICAgICAgICAgKytpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gaTsKICAgIH0KCiAgICAvLyBQZWdhbmRvIG9zIHByaW1laXJvcyBuIGJpdHMgZGUgeAogICAgLy8gbGVuID0gdGFtYW5obyBkb3MgYml0cyBlbSB4ID0gcG9zaWNhbyBkbyBiaXQgbWFpcyBzaWduaWZpY2F0aXZvIGRlIHgsICsgMQogICAgZnVuY3Rpb24gZ2V0Rmlyc3ROQml0cygKICAgICAgICB1aW50IHgsCiAgICAgICAgdWludCBuLAogICAgICAgIHVpbnQgbGVuCiAgICApIGV4dGVybmFsIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIC8vIEV4ZW1wbG8KICAgICAgICAvLyB4ICAgICAgICA9IDExMTAgPSAxNCwgbiA9IDIsIGxlbiA9IDQKICAgICAgICAvLyBtYXNrICAgICA9IDExMDAgPSAxMgogICAgICAgIC8vIHggJiBtYXNrID0gMTEwMCA9IDEyCiAgICAgICAgdWludCBtYXNrID0gKCgxIDw8IG4pIC0gMSkgPDwgKGxlbiAtIG4pOwogICAgICAgIHJldHVybiB4ICYgbWFzazsKICAgIH0KCiAgICAvLyBFbmNvbnRyYW5kbyBvIGJpdCBtYWlzIHNpZ25pZmljYXRpdm8gdXNhbmRvIGJ1c2NhIGJpbmFyaWEKICAgIGZ1bmN0aW9uIG1vc3RTaWduaWZpY2FudEJpdFdpdGhCaW5hcnlTZWFyY2godWludCB4KQogICAgICAgIGV4dGVybmFsCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKHVpbnQ4IHIpCiAgICB7CiAgICAgICAgLy8geCA+PSAyICoqIDEyOAogICAgICAgIGlmICh4ID49IDB4MTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSB7CiAgICAgICAgICAgIHggPj49IDEyODsKICAgICAgICAgICAgciArPSAxMjg7CiAgICAgICAgfQogICAgICAgIC8vIHggPj0gMiAqKiA2NAogICAgICAgIGlmICh4ID49IDB4MTAwMDAwMDAwMDAwMDAwMDApIHsKICAgICAgICAgICAgeCA+Pj0gNjQ7CiAgICAgICAgICAgIHIgKz0gNjQ7CiAgICAgICAgfQogICAgICAgIC8vIHggPj0gMiAqKiAzMgogICAgICAgIGlmICh4ID49IDB4MTAwMDAwMDAwKSB7CiAgICAgICAgICAgIHggPj49IDMyOwogICAgICAgICAgICByICs9IDMyOwogICAgICAgIH0KICAgICAgICAvLyB4ID49IDIgKiogMTYKICAgICAgICBpZiAoeCA+PSAweDEwMDAwKSB7CiAgICAgICAgICAgIHggPj49IDE2OwogICAgICAgICAgICByICs9IDE2OwogICAgICAgIH0KICAgICAgICAvLyB4ID49IDIgKiogOAogICAgICAgIGlmICh4ID49IDB4MTAwKSB7CiAgICAgICAgICAgIHggPj49IDg7CiAgICAgICAgICAgIHIgKz0gODsKICAgICAgICB9CiAgICAgICAgLy8geCA+PSAyICoqIDQKICAgICAgICBpZiAoeCA+PSAweDEwKSB7CiAgICAgICAgICAgIHggPj49IDQ7CiAgICAgICAgICAgIHIgKz0gNDsKICAgICAgICB9CiAgICAgICAgLy8geCA+PSAyICoqIDIKICAgICAgICBpZiAoeCA+PSAweDQpIHsKICAgICAgICAgICAgeCA+Pj0gMjsKICAgICAgICAgICAgciArPSAyOwogICAgICAgIH0KICAgICAgICAvLyB4ID49IDIgKiogMQogICAgICAgIGlmICh4ID49IDB4MikgciArPSAxOwogICAgfQp9)
