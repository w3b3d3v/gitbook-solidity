# Seletor de Função

Quando uma função é chamada, os 4 primeiros bytes da `calldata` especifica qual função chamar.

Esses 4 bytes são chamados seletor de função.

Pegue como exemplo, este código abaixo. Ele usa `call` para executar `transfer` num contrato de endereço `addr`.

```solidity
addr.call(abi.encodeWithSignature("transfer(address,uint256)", 0xSomeAddress, 123))solid
```

Os primeiros 4 bytes retornados de `abi.encodeWithSignature(....)` é o seletor de função.

Talvez você possa salvar uma pequena quantidade de gás se você computar e colocar o seletor da função inline no seu código?

Aqui está como o seletor de função é computado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract FunctionSelector {
    /*
    "transfer(address,uint256)"
    0xa9059cbb
    "transferFrom(address,address,uint256)"
    0x23b872dd
    */
    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
```
