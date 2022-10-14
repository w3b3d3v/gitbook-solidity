# Enum

Solidity suporta enumeráveis e eles são úteis para escolha do modelo e mantêm o controle do estado.

Enum podem ser declarados fora do contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Enum {
    // Enum representando status de envio
    enum Status {
        Pendente,
        Enviado,
        Aceitaram,
        Rejeitado,
        Cancelado
    }

    // Valor padrao e o primeiro elemento listado na
    // definicao do tipo, nesse caso \"Pendente\"
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

    // Atualiza status passando uint como parametro
    function set(Status _status) public {
        status = _status;
    }

    // Voce pode atualizar para um enum especifico
    function cancel() public {
        status = Status.Cancelado;
    }

    // delete reinicia o enum para seu primeiro valor, 0
    function reset() public {
        delete status;
    }
}
```

#### Declarando e Importando Enum <a href="#declaring-and-importing-enum" id="declaring-and-importing-enum"></a>

Arquivo no qual o `enum` é declarado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
// É salvo como 'EnumDeclaration.sol'

enum Status {
    Pendente,
    Enviado,
    Aceitaram,
    Rejeitado,
    Cancelado
}
```

Arquivo que importa o `enum` acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./EnumDeclaration.sol";

contract Enum {
    Status public status;
}
```

## Teste no Remix

- [Enum.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEVudW0gewogICAgLy8gRW51bSByZXByZXNlbnRhbmRvIHN0YXR1cyBkZSBlbnZpbwogICAgZW51bSBTdGF0dXMgewogICAgICAgIFBlbmRlbnRlLAogICAgICAgIEVudmlhZG8sCiAgICAgICAgQWNlaXRhcmFtLAogICAgICAgIFJlamVpdGFkbywKICAgICAgICBDYW5jZWxhZG8KICAgIH0KCiAgICAvLyBWYWxvciBwYWRyYW8gZSBvIHByaW1laXJvIGVsZW1lbnRvIGxpc3RhZG8gbmEKICAgIC8vIGRlZmluaWNhbyBkbyB0aXBvLCBuZXNzZSBjYXNvIFxcXCJQZW5kZW50ZVxcXCIKICAgIFN0YXR1cyBwdWJsaWMgc3RhdHVzOwoKICAgIC8vIFJldG9ybmEgdWludAogICAgLy8gUGVuZGVudGUgIC0gMAogICAgLy8gRW52aWFkbyAgLSAxCiAgICAvLyBBY2VpdG8gLSAyCiAgICAvLyBSZWN1c2FkbyAtIDMKICAgIC8vIENhbmNlbGFkbyAtIDQKICAgIGZ1bmN0aW9uIGdldCgpIHB1YmxpYyB2aWV3IHJldHVybnMgKFN0YXR1cykgewogICAgICAgIHJldHVybiBzdGF0dXM7CiAgICB9CgogICAgLy8gQXR1YWxpemEgc3RhdHVzIHBhc3NhbmRvIHVpbnQgY29tbyBwYXJhbWV0cm8KICAgIGZ1bmN0aW9uIHNldChTdGF0dXMgX3N0YXR1cykgcHVibGljIHsKICAgICAgICBzdGF0dXMgPSBfc3RhdHVzOwogICAgfQoKICAgIC8vIFZvY2UgcG9kZSBhdHVhbGl6YXIgcGFyYSB1bSBlbnVtIGVzcGVjaWZpY28KICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHB1YmxpYyB7CiAgICAgICAgc3RhdHVzID0gU3RhdHVzLkNhbmNlbGFkbzsKICAgIH0KCiAgICAvLyBkZWxldGUgcmVpbmljaWEgbyBlbnVtIHBhcmEgc2V1IHByaW1laXJvIHZhbG9yLCAwCiAgICBmdW5jdGlvbiByZXNldCgpIHB1YmxpYyB7CiAgICAgICAgZGVsZXRlIHN0YXR1czsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [EnumDeclaration.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKLy8gRSBzYWx2byBjb21vIFwnRW51bURlY2xhcmF0aW9uLnNvbFwnCgplbnVtIFN0YXR1cyB7CiAgICBQZW5kZW50ZSwKICAgIEVudmlhZG8sCiAgICBBY2VpdGFyYW0sCiAgICBSZWplaXRhZG8sCiAgICBDYW5jZWxhZG8KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [EnumImport.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCAiLi9FbnVtRGVjbGFyYXRpb24uc29sIjsKCmNvbnRyYWN0IEVudW0gewogICAgU3RhdHVzIHB1YmxpYyBzdGF0dXM7Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
