# Biblioteca

Bibliotecas são semelhantes a contratos, mas você não pode declarar nenhuma variável de estado e não pode enviar ether.

Uma biblioteca é incorporada a um contrato se todas as funções da biblioteca são internas.

Caso contrário, a biblioteca deve ser implementada e então vinculada antes do contrato ser implantado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint) {
        uint z = x + y;
        require(z >= x, "uint overflow");

        return z;
    }
}

library Math {
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // else z = 0 (valor padrão)
    }
}

contract TestSafeMath {
    using SafeMath for uint;

    uint public MAX_UINT = 2**256 - 1;

    function testAdd(uint x, uint y) public pure returns (uint) {
        return x.add(y);
    }

    function testSquareRoot(uint x) public pure returns (uint) {
        return Math.sqrt(x);
    }
}

// Função Array para apagar o elemento no index e reorganizar a o array
// de forma que não haja espaços entre os elementos.
library Array {
    function remove(uint[] storage arr, uint index) public {
        // Move o último elemento para o lugar onde será apagado
        require(arr.length > 0, "Can't remove from empty array");
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
}

contract TestArray {
    using Array for uint[];

    uint[] public arr;

    function testArrayRemove() public {
        for (uint i = 0; i < 3; i++) {
            arr.push(i);
        }

        arr.remove(1);

        assert(arr.length == 2);
        assert(arr[0] == 0);
        assert(arr[1] == 2);
    }
}
```

## Teste no Remix

- [Biblioteca.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmxpYnJhcnkgU2FmZU1hdGggewogICAgZnVuY3Rpb24gYWRkKHVpbnQgeCwgdWludCB5KSBpbnRlcm5hbCBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICB1aW50IHogPSB4ICsgeTsKICAgICAgICByZXF1aXJlKHogPj0geCwgInVpbnQgb3ZlcmZsb3ciKTsKCiAgICAgICAgcmV0dXJuIHo7CiAgICB9Cn0KCmxpYnJhcnkgTWF0aCB7CiAgICBmdW5jdGlvbiBzcXJ0KHVpbnQgeSkgaW50ZXJuYWwgcHVyZSByZXR1cm5zICh1aW50IHopIHsKICAgICAgICBpZiAoeSA+IDMpIHsKICAgICAgICAgICAgeiA9IHk7CiAgICAgICAgICAgIHVpbnQgeCA9IHkgLyAyICsgMTsKICAgICAgICAgICAgd2hpbGUgKHggPCB6KSB7CiAgICAgICAgICAgICAgICB6ID0geDsKICAgICAgICAgICAgICAgIHggPSAoeSAvIHggKyB4KSAvIDI7CiAgICAgICAgICAgIH0KICAgICAgICB9IGVsc2UgaWYgKHkgIT0gMCkgewogICAgICAgICAgICB6ID0gMTsKICAgICAgICB9CiAgICAgICAgLy8gZWxzZSB6ID0gMCAodmFsb3IgcGFkcmFvKQogICAgfQp9Cgpjb250cmFjdCBUZXN0U2FmZU1hdGggewogICAgdXNpbmcgU2FmZU1hdGggZm9yIHVpbnQ7CgogICAgdWludCBwdWJsaWMgTUFYX1VJTlQgPSAyKioyNTYgLSAxOwoKICAgIGZ1bmN0aW9uIHRlc3RBZGQodWludCB4LCB1aW50IHkpIHB1YmxpYyBwdXJlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4geC5hZGQoeSk7CiAgICB9CgogICAgZnVuY3Rpb24gdGVzdFNxdWFyZVJvb3QodWludCB4KSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KTsKICAgIH0KfQoKLy8gRnVuY2FvIEFycmF5IHBhcmEgYXBhZ2FyIG8gZWxlbWVudG8gbm8gaW5kZXggZSByZW9yZ2FuaXphciBhIG8gYXJyYXkKLy8gZGUgZm9ybWEgcXVlIG5hbyBoYWphIGVzcGFjb3MgZW50cmUgb3MgZWxlbWVudG9zLgpsaWJyYXJ5IEFycmF5IHsKICAgIGZ1bmN0aW9uIHJlbW92ZSh1aW50W10gc3RvcmFnZSBhcnIsIHVpbnQgaW5kZXgpIHB1YmxpYyB7CiAgICAgICAgLy8gTW92ZSBvIHVsdGltbyBlbGVtZW50byBwYXJhIG8gbHVnYXIgb25kZSBzZXJhIGFwYWdhZG8KICAgICAgICByZXF1aXJlKGFyci5sZW5ndGggPiAwLCAiQ2FuJ3QgcmVtb3ZlIGZyb20gZW1wdHkgYXJyYXkiKTsKICAgICAgICBhcnJbaW5kZXhdID0gYXJyW2Fyci5sZW5ndGggLSAxXTsKICAgICAgICBhcnIucG9wKCk7CiAgICB9Cn0KCmNvbnRyYWN0IFRlc3RBcnJheSB7CiAgICB1c2luZyBBcnJheSBmb3IgdWludFtdOwoKICAgIHVpbnRbXSBwdWJsaWMgYXJyOwoKICAgIGZ1bmN0aW9uIHRlc3RBcnJheVJlbW92ZSgpIHB1YmxpYyB7CiAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgMzsgaSsrKSB7CiAgICAgICAgICAgIGFyci5wdXNoKGkpOwogICAgICAgIH0KCiAgICAgICAgYXJyLnJlbW92ZSgxKTsKCiAgICAgICAgYXNzZXJ0KGFyci5sZW5ndGggPT0gMik7CiAgICAgICAgYXNzZXJ0KGFyclswXSA9PSAwKTsKICAgICAgICBhc3NlcnQoYXJyWzFdID09IDIpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
