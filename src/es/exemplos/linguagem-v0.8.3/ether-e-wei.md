# Ether y Wei

Las transacciones se pagan con `ether`.

De la misma forma que un dólar equivale a 100 centavos, un (1) `ether` equivale a 10^18 `wei`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract EtherUnits {
    uint public oneWei = 1 wei;
    // 1 wei es igual a 1
    bool public isOneWei = 1 wei == 1;

    uint public oneEther = 1 ether;
    // 1 ether es igual a 10^18 wei
    bool public isOneEther = 1 ether == 1e18;
}
```
