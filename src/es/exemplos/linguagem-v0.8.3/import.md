# Import

Puedes importar archivos locales y externos en Solidity.

#### Local <a href="#local" id="local"></a>

Aquí está la estructura de nuestros archivos.

```solidity
├── Import.sol
└── Foo.sol
```

Foo.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Foo {
    string public name = "Foo";
}
```

Import.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// importa Foo.sol del directorio actual
import "./Foo.sol";

contract Import {
    // Inicializa Foo.sol
    Foo public foo = new Foo();

    // Prueba Foo.sol obteniendo su nombre.
    function getFooName() public view returns (string memory) {
        return foo.name();
    }
}
```

#### External <a href="#external" id="external"></a>

También puedes importar desde [GitHub](https://github.com) simplemente copiando la url

```
// https://github.com/owner/repo/blob/branch/path/to/Contract.sol
import "https://github.com/owner/repo/blob/branch/path/to/Contract.sol";

// Example import ECDSA.sol from openzeppelin-contract repo, release-v3.3 branch
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol";
```
