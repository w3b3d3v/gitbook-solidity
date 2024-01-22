# Interface

Você pode interagir com outros contratos declarando uma `Interface`.

Interface

- não pode ter nenhuma função implementada
- pode herdar de outras interfaces
- todas as funções declaradas devem ser externas
- não pode declarar um constructor
- não pode declarar variáveis de estado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public count;

    function increment() external {
        count += 1;
    }
}

interface ICounter {
    function count() external view returns (uint);

    function increment() external;
}

contract MyContract {
    function incrementCounter(address _counter) external {
        ICounter(_counter).increment();
    }

    function getCount(address _counter) external view returns (uint) {
        return ICounter(_counter).count();
    }
}

// Uniswap example
interface UniswapV2Factory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

interface UniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );
}

contract UniswapExample {
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function getTokenReserves() external view returns (uint, uint) {
        address pair = UniswapV2Factory(factory).getPair(dai, weth);
        (uint reserve0, uint reserve1, ) = UniswapV2Pair(pair).getReserves();
        return (reserve0, reserve1);
    }
}
```

## Teste no Remix

- [Interface.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IENvdW50ZXIgewogICAgdWludCBwdWJsaWMgY291bnQ7CgogICAgZnVuY3Rpb24gaW5jcmVtZW50KCkgZXh0ZXJuYWwgewogICAgICAgIGNvdW50ICs9IDE7CiAgICB9Cn0KCmludGVyZmFjZSBJQ291bnRlciB7CiAgICBmdW5jdGlvbiBjb3VudCgpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludCk7CgogICAgZnVuY3Rpb24gaW5jcmVtZW50KCkgZXh0ZXJuYWw7Cn0KCmNvbnRyYWN0IE15Q29udHJhY3QgewogICAgZnVuY3Rpb24gaW5jcmVtZW50Q291bnRlcihhZGRyZXNzIF9jb3VudGVyKSBleHRlcm5hbCB7CiAgICAgICAgSUNvdW50ZXIoX2NvdW50ZXIpLmluY3JlbWVudCgpOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldENvdW50KGFkZHJlc3MgX2NvdW50ZXIpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBJQ291bnRlcihfY291bnRlcikuY291bnQoKTsKICAgIH0KfQoKLy8gVW5pc3dhcCBleGFtcGxlCmludGVyZmFjZSBVbmlzd2FwVjJGYWN0b3J5IHsKICAgIGZ1bmN0aW9uIGdldFBhaXIoYWRkcmVzcyB0b2tlbkEsIGFkZHJlc3MgdG9rZW5CKQogICAgICAgIGV4dGVybmFsCiAgICAgICAgdmlldwogICAgICAgIHJldHVybnMgKGFkZHJlc3MgcGFpcik7Cn0KCmludGVyZmFjZSBVbmlzd2FwVjJQYWlyIHsKICAgIGZ1bmN0aW9uIGdldFJlc2VydmVzKCkKICAgICAgICBleHRlcm5hbAogICAgICAgIHZpZXcKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgdWludDExMiByZXNlcnZlMCwKICAgICAgICAgICAgdWludDExMiByZXNlcnZlMSwKICAgICAgICAgICAgdWludDMyIGJsb2NrVGltZXN0YW1wTGFzdAogICAgICAgICk7Cn0KCmNvbnRyYWN0IFVuaXN3YXBFeGFtcGxlIHsKICAgIGFkZHJlc3MgcHJpdmF0ZSBmYWN0b3J5ID0gMHg1QzY5YkVlNzAxZWY4MTRhMkI2YTNFREQ0QjE2NTJDQjljYzVhQTZmOwogICAgYWRkcmVzcyBwcml2YXRlIGRhaSA9IDB4NkIxNzU0NzRFODkwOTRDNDREYTk4Yjk1NEVlZGVBQzQ5NTI3MWQwRjsKICAgIGFkZHJlc3MgcHJpdmF0ZSB3ZXRoID0gMHhDMDJhYUEzOWIyMjNGRThEMEEwZTVDNEYyN2VBRDkwODNDNzU2Q2MyOwoKICAgIGZ1bmN0aW9uIGdldFRva2VuUmVzZXJ2ZXMoKSBleHRlcm5hbCB2aWV3IHJldHVybnMgKHVpbnQsIHVpbnQpIHsKICAgICAgICBhZGRyZXNzIHBhaXIgPSBVbmlzd2FwVjJGYWN0b3J5KGZhY3RvcnkpLmdldFBhaXIoZGFpLCB3ZXRoKTsKICAgICAgICAodWludCByZXNlcnZlMCwgdWludCByZXNlcnZlMSwgKSA9IFVuaXN3YXBWMlBhaXIocGFpcikuZ2V0UmVzZXJ2ZXMoKTsKICAgICAgICByZXR1cm4gKHJlc2VydmUwLCByZXNlcnZlMSk7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
