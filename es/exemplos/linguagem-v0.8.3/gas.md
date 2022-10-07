# Gás

#### Quanto`ether` você precisa para pagar uma transação? <a href="#how-much-ether-do-you-need-to-pay-for-a-transaction" id="how-much-ether-do-you-need-to-pay-for-a-transaction"></a>

Você paga a quantia de `gas spent * gas price` em `ether`, onde

* `gas` é uma unidade de computação
* `gas spent` é o total de `gas` usado numa transação
* `gas price` é quanto de `ether` você pretende pagar por `gas`

Transações com maior preço de gas apresentam maior prioridade para serem incluídas em um bloco.

O gás que não é gasto será reembolsado.

#### Limite de gás <a href="#gas-limit" id="gas-limit"></a>

&#x20;Existem 2 limites máximos para a quantidade de gás que você pode gastar

* `gas limit` (máximo de gás que você pretende usar para sua transação, definido por você)
* `block gas limit` (máximo de gás permitido num bloco, definido pela rede)

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Gas {
    uint public i = 0;

    // Usar todo o gás que você envia causa falha na sua transação.
    // Mudanças de estado são desfeitas.
    // Gás usado não é reembolsado .
    function forever() public {
        // Aqui rodamos um loop até que todo o gás seja gasto
        // e a transação falha
        while (true) {
            i += 1;
        }
    }
}
```

