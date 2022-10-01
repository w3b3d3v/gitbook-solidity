# Import

Você pode importar arquivos locais e externos no Solidity.

#### Local <a href="#local" id="local"></a>

Aqui está nossa estrutura da pasta.

```
├── Import.sol
└── Foo.sol
```

Foo.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

struct Point {
    uint x;
    uint y;
}

error Unauthorized(address caller);

function add(uint x, uint y) pure returns (uint) {
    return x + y;
}

contract Foo {
    string public name = "Foo";
}
```

Import.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// importa Foo.sol do diretório atual
import "./Foo.sol";

// import {symbol1 as alias, symbol2} from "filename";
import {Unauthorized, add as func, Point} from "./Foo.sol";

contract Import {
    // Inicializa Foo.sol
    Foo public foo = new Foo();

    // Testa Foo.sol obtendo seu nome.
    function getFooName() public view returns (string memory) {
        return foo.name();
    }
}
```

#### External <a href="#external" id="external"></a>

Você também pode importar de [GitHub](https://github.com) simplesmente copiando o url

```solidity
// https://github.com/owner/repo/blob/branch/path/to/Contract.sol
import "https://github.com/owner/repo/blob/branch/path/to/Contract.sol";

// Example import ECDSA.sol from openzeppelin-contract repo, release-v3.3 branch
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol";
```
## Experimente no Remix

- [Foo.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCnN0cnVjdCBQb2ludCB7CiAgICB1aW50IHg7CiAgICB1aW50IHk7Cn0KCmVycm9yIFVuYXV0aG9yaXplZChhZGRyZXNzIGNhbGxlcik7CgpmdW5jdGlvbiBhZGQodWludCB4LCB1aW50IHkpIHB1cmUgcmV0dXJucyAodWludCkgewogICAgcmV0dXJuIHggKyB5Owp9Cgpjb250cmFjdCBGb28gewogICAgc3RyaW5nIHB1YmxpYyBuYW1lID0gIkZvbyI7Cn0=)
- [Import.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8vIGltcG9ydGEgRm9vLnNvbCBkbyBkaXJldG9yaW8gYXR1YWwKaW1wb3J0ICIuL0Zvby5zb2wiOwoKLy8gaW1wb3J0IHtzeW1ib2wxIGFzIGFsaWFzLCBzeW1ib2wyfSBmcm9tICJmaWxlbmFtZSI7CmltcG9ydCB7VW5hdXRob3JpemVkLCBhZGQgYXMgZnVuYywgUG9pbnR9IGZyb20gIi4vRm9vLnNvbCI7Cgpjb250cmFjdCBJbXBvcnQgewogICAgLy8gSW5pY2lhbGl6YSBGb28uc29sCiAgICBGb28gcHVibGljIGZvbyA9IG5ldyBGb28oKTsKCiAgICAvLyBUZXN0YSBGb28uc29sIG9idGVuZG8gc2V1IG5vbWUuCiAgICBmdW5jdGlvbiBnZXRGb29OYW1lKCkgcHVibGljIHZpZXcgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBmb28ubmFtZSgpOwogICAgfQp9)