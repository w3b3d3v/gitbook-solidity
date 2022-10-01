# If/Else

Solidity suporta estruturas condicionais `if`, `else if` and `else`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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

        // forma abreviada de escrever a instrução if / else 
        return _x < 10 ? 1 : 2;
    }
}
```
