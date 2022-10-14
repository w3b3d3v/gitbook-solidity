# Gravar em qualquer slot

O armazenamento de solidity é como um array de comprimento 2<sup>256</sup>. Cada slot no array pode armazenar 32 bytes.

As variáveis ​​de estado definem quais slots serão usados ​​para armazenar dados.

No entanto, usando assembly, você pode gravar em qualquer slot.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Storage {
    struct MyStruct {
        uint value;
    }

    // struct armazenado no slot 0
    MyStruct public s0 = MyStruct(123);
    // struct armazenado no slot 1
    MyStruct public s1 = MyStruct(456);
    // struct armazenado no slot 2
    MyStruct public s2 = MyStruct(789);

    function _get(uint i) internal pure returns (MyStruct storage s) {
        // obter struct armazenado no slot i
        assembly {
            s.slot := i
        }
    }

    /*
    get(0) returns 123
    get(1) returns 456
    get(2) returns 789
    */
    function get(uint i) external view returns (uint) {
        // obter valor dentro do MyStruct armazenado no slot i
        return _get(i).value;
    }

    /*
    Podemos salvar dados em qualquer slot, incluindo o slot 999, que normalmente é inacessível.

    set(999) = 888
    */
    function set(uint i, uint x) external {
        // defina o valor de MyStruct para x e armazene-o no slot i
        _get(i).value = x;
    }
}
```
## Teste no Remix

- [Slot.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFN0b3JhZ2UgewogICAgc3RydWN0IE15U3RydWN0IHsKICAgICAgICB1aW50IHZhbHVlOwogICAgfQoKICAgIC8vIHN0cnVjdCBhcm1hemVuYWRvIG5vIHNsb3QgMAogICAgTXlTdHJ1Y3QgcHVibGljIHMwID0gTXlTdHJ1Y3QoMTIzKTsKICAgIC8vIHN0cnVjdCBhcm1hemVuYWRvIG5vIHNsb3QgMQogICAgTXlTdHJ1Y3QgcHVibGljIHMxID0gTXlTdHJ1Y3QoNDU2KTsKICAgIC8vIHN0cnVjdCBhcm1hemVuYWRvIG5vIHNsb3QgMgogICAgTXlTdHJ1Y3QgcHVibGljIHMyID0gTXlTdHJ1Y3QoNzg5KTsKCiAgICBmdW5jdGlvbiBfZ2V0KHVpbnQgaSkgaW50ZXJuYWwgcHVyZSByZXR1cm5zIChNeVN0cnVjdCBzdG9yYWdlIHMpIHsKICAgICAgICAvLyBvYnRlciBzdHJ1Y3QgYXJtYXplbmFkbyBubyBzbG90IGkKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIHMuc2xvdCA6PSBpCiAgICAgICAgfQogICAgfQoKICAgIC8qCiAgICBnZXQoMCkgcmV0dXJucyAxMjMKICAgIGdldCgxKSByZXR1cm5zIDQ1NgogICAgZ2V0KDIpIHJldHVybnMgNzg5CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0KHVpbnQgaSkgZXh0ZXJuYWwgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgLy8gb2J0ZXIgdmFsb3IgZGVudHJvIGRvIE15U3RydWN0IGFybWF6ZW5hZG8gbm8gc2xvdCBpCiAgICAgICAgcmV0dXJuIF9nZXQoaSkudmFsdWU7CiAgICB9CgogICAgLyoKICAgIFBvZGVtb3Mgc2FsdmFyIGRhZG9zIGVtIHF1YWxxdWVyIHNsb3QsIGluY2x1aW5kbyBvIHNsb3QgOTk5LCBxdWUgbm9ybWFsbWVudGUgZSBpbmFjZXNzaXZlbC4KCiAgICBzZXQoOTk5KSA9IDg4OAogICAgKi8KICAgIGZ1bmN0aW9uIHNldCh1aW50IGksIHVpbnQgeCkgZXh0ZXJuYWwgewogICAgICAgIC8vIGRlZmluYSBvIHZhbG9yIGRlIE15U3RydWN0IHBhcmEgeCBlIGFybWF6ZW5lLW8gbm8gc2xvdCBpCiAgICAgICAgX2dldChpKS52YWx1ZSA9IHg7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)