# Import

Você pode importar arquivos locais e externos no Solidity.

#### Local <a href="#local" id="local"></a>

Aqui está nossa estrutura da pasta.

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

// importa Foo.sol do diretório atual
import "./Foo.sol";

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

```
// https://github.com/owner/repo/blob/branch/path/to/Contract.sol
import "https://github.com/owner/repo/blob/branch/path/to/Contract.sol";

// Example import ECDSA.sol from openzeppelin-contract repo, release-v3.3 branch
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol";
```
