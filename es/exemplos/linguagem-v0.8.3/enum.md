# Enum

Solidity suporta enumeráveis e eles são úteis para escolha do modelo e  mantêm o controle do estado.

Enums podem ser declarados fora do contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Enum {
    // Enum representando status de envio
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }

    // Valor padrão é o primeiro elemento listado na 
    // definição do tipo, nesse caso "Pendente"
    Status public status;

    // Retorna uint
    // Pendente  - 0
    // Enviado  - 1
    // Aceito - 2
    // Recusado - 3
    // Cancelado - 4
    function get() public view returns (Status) {
        return status;
    }

    // Atualiza status passando uint para input
    function set(Status _status) public {
        status = _status;
    }

    // Você pode atualizar para um enum específico como este
    function cancel() public {
        status = Status.Canceled;
    }

    // delete reinicia o enum para seu primeiro valor, 0
    function reset() public {
        delete status;
    }
}
```

#### Declarando e Importando Enum <a href="#declaring-and-importing-enum" id="declaring-and-importing-enum"></a>

Arquivo no qual o enum é declarado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
// É salvo como 'EnumDeclaration.sol'

enum Status {
    Pending,
    Shipped,
    Accepted,
    Rejected,
    Canceled
}
```

Arquivo que importa o enum acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./EnumDeclaration.sol";

contract Enum {
    Status public status;
}
```
