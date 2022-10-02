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
    // carrega variáveis de estado na memória - 48952 gas
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

## Experimente no Remix

- [GasGolf.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIGdhcyBnb2xmCmNvbnRyYWN0IEdhc0dvbGYgewogICAgLy8gaW5pY2lvIC0gNTA5MDggZ2FzCiAgICAvLyB1c2FuZG8gY2FsbGRhdGEgLSA0OTE2MyBnYXMKICAgIC8vIGNhcnJlZ2EgdmFyaWF2ZWlzIGRlIGVzdGFkbyBuYSBtZW1vcmlhIC0gNDg5NTIgZ2FzCiAgICAvLyBzaG9ydCBjaXJjdWl0IC0gNDg2MzQgZ2FzCiAgICAvLyBpbmNyZW1lbnRvcyBkZSBsb29wIC0gNDgyNDQgZ2FzCiAgICAvLyBncmF2YXIgdGFtYW5obyBkbyBhcnJheSAtIDQ4MjA5IGdhcwogICAgLy8gY2FycmVnYXIgZWxlbWVudG9zIGRvIGFycmF5IG5hIG1lbW9yaWEgLSA0ODA0NyBnYXMKICAgIC8vIHVuY2hlY2sgaSBvdmVyZmxvdy91bmRlcmZsb3cgLSA0NzMwOSBnYXMKCiAgICB1aW50IHB1YmxpYyB0b3RhbDsKCiAgICAvLyBpbmljaW8gLSBzZW0gb3RpbWl6YXIgY29uc3VtbyBkZSBnYXMgCiAgICAvLyBmdW5jdGlvbiBzdW1JZkV2ZW5BbmRMZXNzVGhhbjk5KHVpbnRbXSBtZW1vcnkgbnVtcykgZXh0ZXJuYWwgewogICAgLy8gICAgIGZvciAodWludCBpID0gMDsgaSA8IG51bXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIC8vICAgICAgICAgYm9vbCBpc0V2ZW4gPSBudW1zW2ldICUgMiA9PSAwOwogICAgLy8gICAgICAgICBib29sIGlzTGVzc1RoYW45OSA9IG51bXNbaV0gPCA5OTsKICAgIC8vICAgICAgICAgaWYgKGlzRXZlbiAmJiBpc0xlc3NUaGFuOTkpIHsKICAgIC8vICAgICAgICAgICAgIHRvdGFsICs9IG51bXNbaV07CiAgICAvLyAgICAgICAgIH0KICAgIC8vICAgICB9CiAgICAvLyB9CgogICAgLy8gb3RpbWl6YW5kbyBjb25zdW1vIGRlIGdhcwogICAgLy8gWzEsIDIsIDMsIDQsIDUsIDEwMF0KICAgIGZ1bmN0aW9uIHN1bUlmRXZlbkFuZExlc3NUaGFuOTkodWludFtdIGNhbGxkYXRhIG51bXMpIGV4dGVybmFsIHsKICAgICAgICB1aW50IF90b3RhbCA9IHRvdGFsOwogICAgICAgIHVpbnQgbGVuID0gbnVtcy5sZW5ndGg7CgogICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IGxlbjsgKSB7CiAgICAgICAgICAgIHVpbnQgbnVtID0gbnVtc1tpXTsKICAgICAgICAgICAgaWYgKG51bSAlIDIgPT0gMCAmJiBudW0gPCA5OSkgewogICAgICAgICAgICAgICAgX3RvdGFsICs9IG51bTsKICAgICAgICAgICAgfQogICAgICAgICAgICB1bmNoZWNrZWQgewogICAgICAgICAgICAgICAgKytpOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICB0b3RhbCA9IF90b3RhbDsKICAgIH0KfQ==)