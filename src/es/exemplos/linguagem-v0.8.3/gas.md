# Gas

#### Cuánto`ether` se necesita para pagar una transacción? <a href="#how-much-ether-do-you-need-to-pay-for-a-transaction" id="how-much-ether-do-you-need-to-pay-for-a-transaction"></a>

Pagas la cantidad de `gas spent * gas price` en `ether`, donde

* `gas` es una unidad computacional
* `gas spent` es la cantidad total de `gas` usado en una transacción
* `gas price` es cuanto `ether` estás dispuesto a pagar por `gas`

Transacciones con mayor precio de gas tienen mayor prioridad de ser incluidas en un bloque.

El gas no gastado será reembolsado.

#### Límite de gas <a href="#gas-limit" id="gas-limit"></a>

&#x20;Existen 2 límites máximos para la cantidad de gas que se puede gastar

* `gas limit` (máximo gas que estás dispuesto a usar en tu transacción, definido por ti)
* `block gas limit` (máximo gas permitido en un bloque, definido por la red)

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Gas {
    uint public i = 0;

    // Usar todo el gas que usted envia hace que su transacción falle.
    // Cambios de estado son deshechos.
    // Gas usado no es reembolsado.
    function forever() public {
        // Aqui ejecutamos un loop hasta que todo el gas sea gastado
        // y la transacción falla
        while (true) {
            i += 1;
        }
    }
}
```

