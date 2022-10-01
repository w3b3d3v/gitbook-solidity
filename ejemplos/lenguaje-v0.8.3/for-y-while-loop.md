# For e While Loop

Solidity suporta `for`, `while e` `do while` loops.

Não escreva loops sem limites, já que isso pode levar ao limite do gás, causando falha na transação.

Pela razão acima, `while` e `do while` loops são raramente usados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Loop {
    function loop() public {
        // for loop
        for (uint i = 0; i < 10; i++) {
            if (i == 3) {
                // Pule para a próxima iteração com continue
                continue;
            }
            if (i == 5) {
                // Saia do loop com break
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
