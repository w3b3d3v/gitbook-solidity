# Tipos de Datos Primarios

Aquí son presentados algunos tipos de datos primarios disponibles en Solidity.

* `boolean`
* `uint`
* `int`
* `address`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Primitives {
    bool public boo = true;

    /*
    uint representa un número entero sin signo, es decir números no negativos
    diferentes tamaños están disponibles
        uint8   varia desde 0 hasta 2 ** 8 - 1
        uint16  varia desde 0 hasta 2 ** 16 - 1
        ...
        uint256 varia desde 0 hasta 2 ** 256 - 1
    */
    uint8 public u8 = 1;
    uint public u256 = 456;
    uint public u = 123; // uint es un alias para uint256

    /*
    Números negativos son permitidos para datos del tipo int.
    Como en uint, diferentes intervalos están disponibles desde int8 hasta int256
    
    int256 varia desde -2 ** 255 hasta 2 ** 255 - 1
    int128 varia desde -2 ** 127 hasta 2 ** 127 - 1
    */
    int8 public i8 = -1;
    int public i256 = 456;
    int public i = -123; // int es lo mismo que int256

    // mínimo y máximo de int
    int public minInt = type(int).min;
    int public maxInt = type(int).max;

    address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    // Valores por defecto
    // Variables sin una asignación inicial poseen un valor por defecto
    bool public defaultBoo; // false
    uint public defaultUint; // 0
    int public defaultInt; // 0
    address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
```
