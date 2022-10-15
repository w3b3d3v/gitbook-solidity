# Selector de función

Cuando una función es llamada, los primeros 4 bytes del `calldata` especifican a cuál función invocar.

Estos 4 bytes son llamados selector de función.

Toma por ejemplo, el código de abajo. Usa `call` para ejecutar `transfer` en un contrato de la dirección `addr`.

```solidity
addr.call(abi.encodeWithSignature("transfer(address,uint256)", 0xSomeAddress, 123))solid
```

Los primeros 4 bytes que regresaron de `abi.encodeWithSignature(....)` es la función de selector.

¿Puede que quizá salves una pequeña cantidad de gas si pre computado y colocas la función de selector en el código?

Aquí está cómo la función del selector es computado.

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
