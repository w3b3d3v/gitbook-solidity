# Ether e Wei

Transações são pagas com `ether`.

Da mesma forma que um dólar equivale a 100 cents, um `ether` equivale a 10^18 `wei`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract EtherUnits {
    uint public oneWei = 1 wei;
    // 1 wei é igual a 1
    bool public isOneWei = 1 wei == 1;

    uint public oneEther = 1 ether;
    // 1 ether é igual a 10^18 wei
    bool public isOneEther = 1 ether == 1e18;
}
```
