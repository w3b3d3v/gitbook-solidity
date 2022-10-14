# If/Else

Solidity suporta estruturas condicionais `if`, `else if` e `else`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract IfElse {
    function foo(uint x) public pure returns (uint) {
        if (x < 10) {
            return 0;
        } else if (x < 20) {
            return 1;
        } else {
            return 2;
        }
    }

    function ternary(uint _x) public pure returns (uint) {
        // if (_x < 10) {
        //     retorna 1;
        // }
        // retorna 2;

        // um forma abreviada de escrever a instrução if / else
        // é usando o operador "?" ele é chamado de operador ternário
        return _x < 10 ? 1 : 2;
    }
}
```

## Teste no Remix

- [IfElse.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IElmRWxzZSB7CiAgICBmdW5jdGlvbiBmb28odWludCB4KSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgaWYgKHggPCAxMCkgewogICAgICAgICAgICByZXR1cm4gMDsKICAgICAgICB9IGVsc2UgaWYgKHggPCAyMCkgewogICAgICAgICAgICByZXR1cm4gMTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICByZXR1cm4gMjsKICAgICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gdGVybmFyeSh1aW50IF94KSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgLy8gaWYgKF94IDwgMTApIHsKICAgICAgICAvLyAgICAgcmV0b3JuYSAxOwogICAgICAgIC8vIH0KICAgICAgICAvLyByZXRvcm5hIDI7CgogICAgICAgIC8vIHVtIGZvcm1hIGFicmV2aWFkYSBkZSBlc2NyZXZlciBhIGluc3RydWNhbyBpZiAvIGVsc2UKICAgICAgICAvLyBlIHVzYW5kbyBvIG9wZXJhZG9yIFwiP1wiIGVsZSBlIGNoYW1hZG8gZGUgb3BlcmFkb3IgdGVybmFyaW8KICAgICAgICByZXR1cm4gX3ggPCAxMCA/IDEgOiAyOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
