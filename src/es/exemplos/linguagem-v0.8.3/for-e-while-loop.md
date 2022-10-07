# For y While Loop

Solidity soporta `for`, `while` y `do while` loops.

No escriba loops sin límites, ya que eso puede llevar al límite de gas, causando que la transacción falle.

Por la razón mencionada previamente, `while` y `do while` loops son raramente usados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Loop {
    function loop() public {
        // for loop
        for (uint i = 0; i < 10; i++) {
            if (i == 3) {
                // Salta a la siguiente iteración con continue
                continue;
            }
            if (i == 5) {
                // Sale del loop con break
                break;
            }
        }

        // while loop
        uint j;
        while (j < 10) {
            j++;
        }
    }
}
```
