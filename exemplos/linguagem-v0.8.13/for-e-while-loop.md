# For e While Loop

Solidity suporta `for`, `while` e `do while`.

Não escreva loops sem limites, já que isso pode levar ao limite do gás, causando falha na transação.

Pela razão acima, `while` e `do while` são raramente usados.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

## Teste no Remix

- [Loop.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IExvb3AgewogICAgZnVuY3Rpb24gbG9vcCgpIHB1YmxpYyB7CiAgICAgICAgLy8gZm9yIGxvb3AKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7CiAgICAgICAgICAgIGlmIChpID09IDMpIHsKICAgICAgICAgICAgICAgIC8vIFB1bGUgcGFyYSBhIHByb3hpbWEgaXRlcmFjYW8gY29tIGNvbnRpbnVlCiAgICAgICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgICAgfQogICAgICAgICAgICBpZiAoaSA9PSA1KSB7CiAgICAgICAgICAgICAgICAvLyBTYWlhIGRvIGxvb3AgY29tIGJyZWFrCiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgLy8gd2hpbGUgbG9vcAogICAgICAgIHVpbnQgajsKICAgICAgICB3aGlsZSAoaiA8IDEwKSB7CiAgICAgICAgICAgIGorKzsKICAgICAgICB9CiAgICB9Cn0=)
