# Tipos de Dados Primários

Aqui são apresentados alguns tipos de dados primários disponíveis no Solidity.

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
    uint representa um número inteiro sem sinal, significando que  
    números inteiros não negativos diferentes estão disponíveis
        uint8   varia de 0 a 2 ** 8 - 1
        uint16  varia de 0 a 2 ** 16 - 1
        ...
        uint256 varia de 0 a 2 ** 256 - 1
    */
    uint8 public u8 = 1;
    uint public u256 = 456;
    uint public u = 123; // uint é um apelido para uint256

    /*
    Números negativos são permitidos para dados do tipo int.
    Assim como no uint, intervalos diferentes estão disponíveis de 
    int8 a int256
    
    int256 varia de -2 ** 255 a 2 ** 255 - 1
    int128 varia de -2 ** 127 a 2 ** 127 - 1
    */
    int8 public i8 = -1;
    int public i256 = 456;
    int public i = -123; // int é o mesmo que int256

    // mínimo e máximo de int
    int public minInt = type(int).min;
    int public maxInt = type(int).max;

    address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    // Valores padrão
    // Variáveis sem sinal possuem um valor padrão
    bool public defaultBoo; // false
    uint public defaultUint; // 0
    int public defaultInt; // 0
    address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
```
