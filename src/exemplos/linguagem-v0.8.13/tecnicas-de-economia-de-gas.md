# Técnicas de economia de gás

Algumas técnicas de economia de gás:

- Substituindo `memory` por `calldata`
- Carregar variável de estado na memória
- Substitua `i++` por `++i`
- Cache de elementos da matriz
- Short circuit

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// gas golf
contract GasGolf {
    // início - 50908 gas
    // usando calldata - 49163 gas
    // carregar variáveis de estado na memória - 48952 gas
    // short circuit - 48634 gas
    // incrementos de loop - 48244 gas
    // gravar tamanho do array - 48209 gas
    // carregar elementos do array na memoria - 48047 gas
    // uncheck i overflow/underflow - 47309 gas


    uint public total;

    // início - sem otimizar consumo de gas
    // function sumIfEvenAndLessThan99(uint[] memory nums) external {
    //     for (uint i = 0; i < nums.length; i += 1) {
    //         bool isEven = nums[i] % 2 == 0;
    //         bool isLessThan99 = nums[i] < 99;
    //         if (isEven && isLessThan99) {
    //             total += nums[i];
    //         }
    //     }
    // }

    // otimizando consumo de gas
    // [1, 2, 3, 4, 5, 100]
    function sumIfEvenAndLessThan99(uint[] calldata nums) external {
        uint _total = total;
        uint len = nums.length;

        for (uint i = 0; i < len; ) {
            uint num = nums[i];
            if (num % 2 == 0 && num < 99) {
                _total += num;
            }
            unchecked {
                ++i;
            }
        }

        total = _total;
    }
}
```

## Teste no Remix

- [GasGolf.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIGdhcyBnb2xmCmNvbnRyYWN0IEdhc0dvbGYgewogICAgLy8gaW5pY2lvIC0gNTA5MDggZ2FzCiAgICAvLyB1c2FuZG8gY2FsbGRhdGEgLSA0OTE2MyBnYXMKICAgIC8vIGNhcnJlZ2FyIHZhcmlhdmVpcyBkZSBlc3RhZG8gbmEgbWVtb3JpYSAtIDQ4OTUyIGdhcwogICAgLy8gc2hvcnQgY2lyY3VpdCAtIDQ4NjM0IGdhcwogICAgLy8gaW5jcmVtZW50b3MgZGUgbG9vcCAtIDQ4MjQ0IGdhcwogICAgLy8gZ3JhdmFyIHRhbWFuaG8gZG8gYXJyYXkgLSA0ODIwOSBnYXMKICAgIC8vIGNhcnJlZ2FyIGVsZW1lbnRvcyBkbyBhcnJheSBuYSBtZW1vcmlhIC0gNDgwNDcgZ2FzCiAgICAvLyB1bmNoZWNrIGkgb3ZlcmZsb3cvdW5kZXJmbG93IC0gNDczMDkgZ2FzCgoKICAgIHVpbnQgcHVibGljIHRvdGFsOwoKICAgIC8vIGluaWNpbyAtIHNlbSBvdGltaXphciBjb25zdW1vIGRlIGdhcwogICAgLy8gZnVuY3Rpb24gc3VtSWZFdmVuQW5kTGVzc1RoYW45OSh1aW50W10gbWVtb3J5IG51bXMpIGV4dGVybmFsIHsKICAgIC8vICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBudW1zLmxlbmd0aDsgaSArPSAxKSB7CiAgICAvLyAgICAgICAgIGJvb2wgaXNFdmVuID0gbnVtc1tpXSAlIDIgPT0gMDsKICAgIC8vICAgICAgICAgYm9vbCBpc0xlc3NUaGFuOTkgPSBudW1zW2ldIDwgOTk7CiAgICAvLyAgICAgICAgIGlmIChpc0V2ZW4gJiYgaXNMZXNzVGhhbjk5KSB7CiAgICAvLyAgICAgICAgICAgICB0b3RhbCArPSBudW1zW2ldOwogICAgLy8gICAgICAgICB9CiAgICAvLyAgICAgfQogICAgLy8gfQoKICAgIC8vIG90aW1pemFuZG8gY29uc3VtbyBkZSBnYXMKICAgIC8vIFsxLCAyLCAzLCA0LCA1LCAxMDBdCiAgICBmdW5jdGlvbiBzdW1JZkV2ZW5BbmRMZXNzVGhhbjk5KHVpbnRbXSBjYWxsZGF0YSBudW1zKSBleHRlcm5hbCB7CiAgICAgICAgdWludCBfdG90YWwgPSB0b3RhbDsKICAgICAgICB1aW50IGxlbiA9IG51bXMubGVuZ3RoOwoKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBsZW47ICkgewogICAgICAgICAgICB1aW50IG51bSA9IG51bXNbaV07CiAgICAgICAgICAgIGlmIChudW0gJSAyID09IDAgJiYgbnVtIDwgOTkpIHsKICAgICAgICAgICAgICAgIF90b3RhbCArPSBudW07CiAgICAgICAgICAgIH0KICAgICAgICAgICAgdW5jaGVja2VkIHsKICAgICAgICAgICAgICAgICsraTsKICAgICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgdG90YWwgPSBfdG90YWw7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
