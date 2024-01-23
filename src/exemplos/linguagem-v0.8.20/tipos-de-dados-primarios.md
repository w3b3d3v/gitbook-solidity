# Tipos de Dados Primários

Aqui são apresentados alguns tipos de dados primários disponíveis no Solidity.

* `boolean`
* `uint`
* `int`
* `address`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

## Teste no Remix

- [Primitives.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFByaW1pdGl2ZXMgewogICAgYm9vbCBwdWJsaWMgYm9vID0gdHJ1ZTsKCiAgICAvKgogICAgdWludCByZXByZXNlbnRhIHVtIG51bWVybyBpbnRlaXJvIHNlbSBzaW5hbCwgc2lnbmlmaWNhbmRvIHF1ZSAgCiAgICBudW1lcm9zIGludGVpcm9zIG5hbyBuZWdhdGl2b3MgZGlmZXJlbnRlcyBlc3RhbyBkaXNwb25pdmVpcwogICAgICAgIHVpbnQ4ICAgdmFyaWEgZGUgMCBhIDIgKiogOCAtIDEKICAgICAgICB1aW50MTYgIHZhcmlhIGRlIDAgYSAyICoqIDE2IC0gMQogICAgICAgIC4uLgogICAgICAgIHVpbnQyNTYgdmFyaWEgZGUgMCBhIDIgKiogMjU2IC0gMQogICAgKi8KICAgIHVpbnQ4IHB1YmxpYyB1OCA9IDE7CiAgICB1aW50IHB1YmxpYyB1MjU2ID0gNDU2OwogICAgdWludCBwdWJsaWMgdSA9IDEyMzsgLy8gdWludCBlIHVtIGFwZWxpZG8gcGFyYSB1aW50MjU2CgogICAgLyoKICAgIE51bWVyb3MgbmVnYXRpdm9zIHNhbyBwZXJtaXRpZG9zIHBhcmEgZGFkb3MgZG8gdGlwbyBpbnQuCiAgICBBc3NpbSBjb21vIG5vIHVpbnQsIGludGVydmFsb3MgZGlmZXJlbnRlcyBlc3RhbyBkaXNwb25pdmVpcyBkZSAKICAgIGludDggYSBpbnQyNTYKICAgIAogICAgaW50MjU2IHZhcmlhIGRlIC0yICoqIDI1NSBhIDIgKiogMjU1IC0gMQogICAgaW50MTI4IHZhcmlhIGRlIC0yICoqIDEyNyBhIDIgKiogMTI3IC0gMQogICAgKi8KICAgIGludDggcHVibGljIGk4ID0gLTE7CiAgICBpbnQgcHVibGljIGkyNTYgPSA0NTY7CiAgICBpbnQgcHVibGljIGkgPSAtMTIzOyAvLyBpbnQgZSBvIG1lc21vIHF1ZSBpbnQyNTYKCiAgICAvLyBtaW5pbW8gZSBtYXhpbW8gZGUgaW50CiAgICBpbnQgcHVibGljIG1pbkludCA9IHR5cGUoaW50KS5taW47CiAgICBpbnQgcHVibGljIG1heEludCA9IHR5cGUoaW50KS5tYXg7CgogICAgYWRkcmVzcyBwdWJsaWMgYWRkciA9IDB4Q0EzNWI3ZDkxNTQ1OEVGNTQwYURlNjA2OGRGZTJGNDRFOGZhNzMzYzsKCiAgICAvLyBWYWxvcmVzIHBhZHJhbwogICAgLy8gVmFyaWF2ZWlzIHNlbSBzaW5hbCBwb3NzdWVtIHVtIHZhbG9yIHBhZHJhbwogICAgYm9vbCBwdWJsaWMgZGVmYXVsdEJvbzsgLy8gZmFsc2UKICAgIHVpbnQgcHVibGljIGRlZmF1bHRVaW50OyAvLyAwCiAgICBpbnQgcHVibGljIGRlZmF1bHRJbnQ7IC8vIDAKICAgIGFkZHJlc3MgcHVibGljIGRlZmF1bHRBZGRyOyAvLyAweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAKfQ=&version=soljson-v0.8.20+commit.a1b79de6.js)
