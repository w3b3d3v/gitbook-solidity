# Structs

Você pode definir seu próprio tipo de dado criando um `struct`.

Elas são úteis para agrupar dados do mesmo tipo.

Os structs podem ser declarados fora de um contrato e importados em outro contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Afazeres {
    struct Afazer {
        string texto;
        bool concluida;
    }

    // Uma array de 'Afazer' structs
    Afazer[] public afazeres;

    function create(string memory _text) public {
        // 3 maneiras de inicializar uma struct

        // 1. Chamando como uma função
        afazeres.push(Afazer(_text, false));

        // 2. Mapping de chave-valor
        afazeres.push(Afazer({texto: _text, concluida: false}));

        // 3. Inicialize uma estrutura vazia e, em seguida, atualize-a
        Afazer memory afazer;
        afazer.texto = _text;

        // afazer.concluida é inicializado como false
        afazeres.push(afazer);
    }

    // Solidity automaticamente criou um getter para 'afazeres' então
    // você não precisa realmente dessa função.
    function get(uint _index) public view returns (string memory texto, bool concluida) {
        Afazer storage afazer = afazeres[_index];
        return (afazer.texto, afazer.concluida);
    }

    // atualizar texto
    function update(uint _index, string memory _text) public {
        Afazer storage afazer = afazeres[_index];
        afazer.texto = _text;
    }

    // atualização concluída
    function toggleCompleted(uint _index) public {
        Afazer storage afazer = afazeres[_index];
        afazer.concluida = !afazer.concluida;
    }
}
```

#### Declarando e Importando Struct <a href="#declaring-and-importing-struct" id="declaring-and-importing-struct"></a>

Arquivo no qual a struct é declarada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

struct Afazer {
    string texto;
    bool concluida;
}
```

Arquivo que importa a struct acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./StructDeclaration.sol";

contract Afazeres {
    // Um array de structs 'Afazer' 
    Afazer[] public afazeres;
}
```
- [StructDeclaration.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEFmYXplcmVzIHsKICAgIHN0cnVjdCBBZmF6ZXIgewogICAgICAgIHN0cmluZyB0ZXh0bzsKICAgICAgICBib29sIGNvbmNsdWlkYTsKICAgIH0KCiAgICAvLyBVbWEgYXJyYXkgZGUgXCdBZmF6ZXJcJyBzdHJ1Y3RzCiAgICBBZmF6ZXJbXSBwdWJsaWMgYWZhemVyZXM7CgogICAgZnVuY3Rpb24gY3JlYXRlKHN0cmluZyBtZW1vcnkgX3RleHQpIHB1YmxpYyB7CiAgICAgICAgLy8gMyBtYW5laXJhcyBkZSBpbmljaWFsaXphciB1bWEgc3RydWN0CgogICAgICAgIC8vIDEuIENoYW1hbmRvIGNvbW8gdW1hIGZ1bmNhbwogICAgICAgIGFmYXplcmVzLnB1c2goQWZhemVyKF90ZXh0LCBmYWxzZSkpOwoKICAgICAgICAvLyAyLiBNYXBwaW5nIGRlIGNoYXZlLXZhbG9yCiAgICAgICAgYWZhemVyZXMucHVzaChBZmF6ZXIoe3RleHRvOiBfdGV4dCwgY29uY2x1aWRhOiBmYWxzZX0pKTsKCiAgICAgICAgLy8gMy4gSW5pY2lhbGl6ZSB1bWEgZXN0cnV0dXJhIHZhemlhIGUsIGVtIHNlZ3VpZGEsIGF0dWFsaXplLWEKICAgICAgICBBZmF6ZXIgbWVtb3J5IGFmYXplcjsKICAgICAgICBhZmF6ZXIudGV4dG8gPSBfdGV4dDsKCiAgICAgICAgLy8gYWZhemVyLmNvbmNsdWlkYSBlIGluaWNpYWxpemFkbyBjb21vIGZhbHNlCiAgICAgICAgYWZhemVyZXMucHVzaChhZmF6ZXIpOwogICAgfQoKICAgIC8vIFNvbGlkaXR5IGF1dG9tYXRpY2FtZW50ZSBjcmlvdSB1bSBnZXR0ZXIgcGFyYSBcJ2FmYXplcmVzXCcgZW50YW8KICAgIC8vIHZvY2UgbmFvIHByZWNpc2EgcmVhbG1lbnRlIGRlc3NhIGZ1bmNhby4KICAgIGZ1bmN0aW9uIGdldCh1aW50IF9pbmRleCkgcHVibGljIHZpZXcgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSB0ZXh0bywgYm9vbCBjb25jbHVpZGEpIHsKICAgICAgICBBZmF6ZXIgc3RvcmFnZSBhZmF6ZXIgPSBhZmF6ZXJlc1tfaW5kZXhdOwogICAgICAgIHJldHVybiAoYWZhemVyLnRleHRvLCBhZmF6ZXIuY29uY2x1aWRhKTsKICAgIH0KCiAgICAvLyBhdHVhbGl6YXIgdGV4dG8KICAgIGZ1bmN0aW9uIHVwZGF0ZSh1aW50IF9pbmRleCwgc3RyaW5nIG1lbW9yeSBfdGV4dCkgcHVibGljIHsKICAgICAgICBBZmF6ZXIgc3RvcmFnZSBhZmF6ZXIgPSBhZmF6ZXJlc1tfaW5kZXhdOwogICAgICAgIGFmYXplci50ZXh0byA9IF90ZXh0OwogICAgfQoKICAgIC8vIGF0dWFsaXphY2FvIGNvbmNsdWlkYQogICAgZnVuY3Rpb24gdG9nZ2xlQ29tcGxldGVkKHVpbnQgX2luZGV4KSBwdWJsaWMgewogICAgICAgIEFmYXplciBzdG9yYWdlIGFmYXplciA9IGFmYXplcmVzW19pbmRleF07CiAgICAgICAgYWZhemVyLmNvbmNsdWlkYSA9ICFhZmF6ZXIuY29uY2x1aWRhOwogICAgfQp9)
- [StructImport.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCnN0cnVjdCBBZmF6ZXIgewogICAgc3RyaW5nIHRleHRvOwogICAgYm9vbCBjb25jbHVpZGE7Cn0=)
- [Structs.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCBcIi4vU3RydWN0RGVjbGFyYXRpb24uc29sXCI7Cgpjb250cmFjdCBBZmF6ZXJlcyB7CiAgICAvLyBVbSBhcnJheSBkZSBzdHJ1Y3RzIFwnQWZhemVyXCcgCiAgICBBZmF6ZXJbXSBwdWJsaWMgYWZhemVyZXM7Cn0=)