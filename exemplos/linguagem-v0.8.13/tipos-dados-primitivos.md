# Tipos de Dados Primitivos

Aqui são apresentados alguns tipos de dados primitivos disponíveis no Solidity.

- `boolean`
- `uint`
- `int`
- `address`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Primitivos {
    bool public boo = true;

    /*
    uint representa um número inteiro sem sinal, significando que
    números inteiros não negativos tamanhos diferentes estão disponíveis
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
    Assim como no uint, diferentes intervalos estão disponíveis de
    int8 a int256

    int256 varia de -2 ** 255 a 2 ** 255 - 1
    int128 vária de -2 ** 127 a 2 ** 127 - 1
    */
    int8 public i8 = -1;
    int public i256 = 456;
    int public i = -123; // int é o mesmo que int256

    // mínimo e máximo de int
    int public minInt = type(int).min;
    int public maxInt = type(int).max;

    address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    /*
        No Solidity, o tipo de dado byte representa uma sequência de bytes.
        Solidity apresenta dois tipos de bytes:

        - arrays de bytes de tamanho fixo
        - arrays de bytes dimensionadas dinamicamente

        O termo bytes no Solidity representa um array dinâmico de bytes.
        byte[] é um atalho para isso.
    */
    bytes1 a = 0xb5; //  [10110101]
    bytes1 b = 0x56; //  [01010110]

    // Valores padrões
    // Variáveis não atribuídas têm um valor padrão
    bool public defaultBoo; // false
    uint public defaultUint; // 0
    int public defaultInt; // 0
    address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
```

## Teste no Remix

- [Primitivos.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFByaW1pdGl2b3MgewogICAgYm9vbCBwdWJsaWMgYm9vID0gdHJ1ZTsKCiAgICAvKgogICAgdWludCByZXByZXNlbnRhIHVtIG51bWVybyBpbnRlaXJvIHNlbSBzaW5hbCwgc2lnbmlmaWNhbmRvIHF1ZQogICAgbnVtZXJvcyBpbnRlaXJvcyBuYW8gbmVnYXRpdm9zIHRhbWFuaG9zIGRpZmVyZW50ZXMgZXN0YW8gZGlzcG9uaXZlaXMKICAgICAgICB1aW50OCAgIHZhcmlhIGRlIDAgYSAyICoqIDggLSAxCiAgICAgICAgdWludDE2ICB2YXJpYSBkZSAwIGEgMiAqKiAxNiAtIDEKICAgICAgICAuLi4KICAgICAgICB1aW50MjU2IHZhcmlhIGRlIDAgYSAyICoqIDI1NiAtIDEKICAgICovCiAgICB1aW50OCBwdWJsaWMgdTggPSAxOwogICAgdWludCBwdWJsaWMgdTI1NiA9IDQ1NjsKICAgIHVpbnQgcHVibGljIHUgPSAxMjM7IC8vIHVpbnQgZSB1bSBhcGVsaWRvIHBhcmEgdWludDI1NgoKICAgIC8qCiAgICBOdW1lcm9zIG5lZ2F0aXZvcyBzYW8gcGVybWl0aWRvcyBwYXJhIGRhZG9zIGRvIHRpcG8gaW50LgogICAgQXNzaW0gY29tbyBubyB1aW50LCBkaWZlcmVudGVzIGludGVydmFsb3MgZXN0YW8gZGlzcG9uaXZlaXMgZGUKICAgIGludDggYSBpbnQyNTYKCiAgICBpbnQyNTYgdmFyaWEgZGUgLTIgKiogMjU1IGEgMiAqKiAyNTUgLSAxCiAgICBpbnQxMjggdmFyaWEgZGUgLTIgKiogMTI3IGEgMiAqKiAxMjcgLSAxCiAgICAqLwogICAgaW50OCBwdWJsaWMgaTggPSAtMTsKICAgIGludCBwdWJsaWMgaTI1NiA9IDQ1NjsKICAgIGludCBwdWJsaWMgaSA9IC0xMjM7IC8vIGludCBlIG8gbWVzbW8gcXVlIGludDI1NgoKICAgIC8vIG1pbmltbyBlIG1heGltbyBkZSBpbnQKICAgIGludCBwdWJsaWMgbWluSW50ID0gdHlwZShpbnQpLm1pbjsKICAgIGludCBwdWJsaWMgbWF4SW50ID0gdHlwZShpbnQpLm1heDsKCiAgICBhZGRyZXNzIHB1YmxpYyBhZGRyID0gMHhDQTM1YjdkOTE1NDU4RUY1NDBhRGU2MDY4ZEZlMkY0NEU4ZmE3MzNjOwoKICAgIC8qCiAgICAgICAgTm8gU29saWRpdHksIG8gdGlwbyBkZSBkYWRvIGJ5dGUgcmVwcmVzZW50YSB1bWEgc2VxdWVuY2lhIGRlIGJ5dGVzLgogICAgICAgIFNvbGlkaXR5IGFwcmVzZW50YSBkb2lzIHRpcG9zIGRlIGJ5dGVzOgoKICAgICAgICAtIGFycmF5cyBkZSBieXRlcyBkZSB0YW1hbmhvIGZpeG8KICAgICAgICAtIGFycmF5cyBkZSBieXRlcyBkaW1lbnNpb25hZGFzIGRpbmFtaWNhbWVudGUKCiAgICAgICAgTyB0ZXJtbyBieXRlcyBubyBTb2xpZGl0eSByZXByZXNlbnRhIHVtIGFycmF5IGRpbmFtaWNvIGRlIGJ5dGVzLgogICAgICAgIGJ5dGVbXSBlIHVtIGF0YWxobyBwYXJhIGlzc28uCiAgICAqLwogICAgYnl0ZXMxIGEgPSAweGI1OyAvLyAgWzEwMTEwMTAxXQogICAgYnl0ZXMxIGIgPSAweDU2OyAvLyAgWzAxMDEwMTEwXQoKICAgIC8vIFZhbG9yZXMgcGFkcm9lcwogICAgLy8gVmFyaWF2ZWlzIG5hbyBhdHJpYnVpZGFzIHRlbSB1bSB2YWxvciBwYWRyYW8KICAgIGJvb2wgcHVibGljIGRlZmF1bHRCb287IC8vIGZhbHNlCiAgICB1aW50IHB1YmxpYyBkZWZhdWx0VWludDsgLy8gMAogICAgaW50IHB1YmxpYyBkZWZhdWx0SW50OyAvLyAwCiAgICBhZGRyZXNzIHB1YmxpYyBkZWZhdWx0QWRkcjsgLy8gMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwCn0=)
