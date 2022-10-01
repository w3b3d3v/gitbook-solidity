# Ether e Wei

Transações são pagas com `ether`.

Da mesma forma que 1 real equivale a 100 centavos, 1 `ether` equivale a 10<sup>18</sup> `wei`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract UnidadesEther {
    uint public oneWei = 1 wei;
    // 1 wei é igual a 1
    bool public isOneWei = 1 wei == 1;

    uint public oneEther = 1 ether;
    // 1 ether é igual a 10^18 wei
    bool public isOneEther = 1 ether == 1e18;
}
```

## Experimente no Remix

- [UnidadesEther.sol](https://remix.ethereum.org/#code=IyBFdGhlciBlIFdlaQoKVHJhbnNhY29lcyBzYW8gcGFnYXMgY29tIGBldGhlcmAuCgpEYSBtZXNtYSBmb3JtYSBxdWUgMSByZWFsIGVxdWl2YWxlIGEgMTAwIGNlbnRhdm9zLCAxIGBldGhlcmAgZXF1aXZhbGUgYSAxMF4xOCBgd2VpYC4KCmBgYHNvbGlkaXR5Ci8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQKcHJhZ21hIHNvbGlkaXR5IF4wLjguMzsKCmNvbnRyYWN0IFVuaWRhZGVzRXRoZXIgewogICAgdWludCBwdWJsaWMgb25lV2VpID0gMSB3ZWk7CiAgICAvLyAxIHdlaSBlIGlndWFsIGEgMQogICAgYm9vbCBwdWJsaWMgaXNPbmVXZWkgPSAxIHdlaSA9PSAxOwoKICAgIHVpbnQgcHVibGljIG9uZUV0aGVyID0gMSBldGhlcjsKICAgIC8vIDEgZXRoZXIgZSBpZ3VhbCBhIDEwXjE4IHdlaQogICAgYm9vbCBwdWJsaWMgaXNPbmVFdGhlciA9IDEgZXRoZXIgPT0gMWUxODsKfQpgYGAKCiMjIEV4cGVyaW1lbnRlIG5vIFJlbWl4CgotIFtVbmlkYWRlc0V0aGVyLnNvbF0oKQ==)