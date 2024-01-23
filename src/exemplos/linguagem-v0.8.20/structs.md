# Structs

Você pode definir seu próprio tipo de dado criando um `struct`.

Elas são úteis para agrupar dados do mesmo tipo.

Os structs podem ser declarados fora de um contrato e importados em outro contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Afazeres {
    struct Afazer {
        string texto;
        bool concluida;
    }

    // Uma array de 'Afazer' structs
    Afazer[] public afazeres;

    function create(string calldata _text) public {
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
    function update(uint _index, string calldata _text) public {
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
pragma solidity ^0.8.20;

struct Afazer {
    string texto;
    bool concluida;
}
```

Arquivo que importa a struct acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StructDeclaration.sol";

contract Afazeres {
    // Um array de structs 'Afazer'
    Afazer[] public afazeres;
}
```

- [StructDeclaration.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEFmYXplcmVzIHsKICAgIHN0cnVjdCBBZmF6ZXIgewogICAgICAgIHN0cmluZyB0ZXh0bzsKICAgICAgICBib29sIGNvbmNsdWlkYTsKICAgIH0KCiAgICAvLyBVbWEgYXJyYXkgZGUgJ0FmYXplcicgc3RydWN0cwogICAgQWZhemVyW10gcHVibGljIGFmYXplcmVzOwoKICAgIGZ1bmN0aW9uIGNyZWF0ZShzdHJpbmcgbWVtb3J5IF90ZXh0KSBwdWJsaWMgewogICAgICAgIC8vIDMgbWFuZWlyYXMgZGUgaW5pY2lhbGl6YXIgdW1hIHN0cnVjdAoKICAgICAgICAvLyAxLiBDaGFtYW5kbyBjb21vIHVtYSBmdW5jYW8KICAgICAgICBhZmF6ZXJlcy5wdXNoKEFmYXplcihfdGV4dCwgZmFsc2UpKTsKCiAgICAgICAgLy8gMi4gTWFwcGluZyBkZSBjaGF2ZS12YWxvcgogICAgICAgIGFmYXplcmVzLnB1c2goQWZhemVyKHt0ZXh0bzogX3RleHQsIGNvbmNsdWlkYTogZmFsc2V9KSk7CgogICAgICAgIC8vIDMuIEluaWNpYWxpemUgdW1hIGVzdHJ1dHVyYSB2YXppYSBlLCBlbSBzZWd1aWRhLCBhdHVhbGl6ZS1hCiAgICAgICAgQWZhemVyIG1lbW9yeSBhZmF6ZXI7CiAgICAgICAgYWZhemVyLnRleHRvID0gX3RleHQ7CgogICAgICAgIC8vIGFmYXplci5jb25jbHVpZGEgZSBpbmljaWFsaXphZG8gY29tbyBmYWxzZQogICAgICAgIGFmYXplcmVzLnB1c2goYWZhemVyKTsKICAgIH0KCiAgICAvLyBTb2xpZGl0eSBhdXRvbWF0aWNhbWVudGUgY3Jpb3UgdW0gZ2V0dGVyIHBhcmEgJ2FmYXplcmVzJyBlbnRhbwogICAgLy8gdm9jZSBuYW8gcHJlY2lzYSByZWFsbWVudGUgZGVzc2EgZnVuY2FvLgogICAgZnVuY3Rpb24gZ2V0KHVpbnQgX2luZGV4KSBwdWJsaWMgdmlldyByZXR1cm5zIChzdHJpbmcgbWVtb3J5IHRleHRvLCBib29sIGNvbmNsdWlkYSkgewogICAgICAgIEFmYXplciBzdG9yYWdlIGFmYXplciA9IGFmYXplcmVzW19pbmRleF07CiAgICAgICAgcmV0dXJuIChhZmF6ZXIudGV4dG8sIGFmYXplci5jb25jbHVpZGEpOwogICAgfQoKICAgIC8vIGF0dWFsaXphciB0ZXh0bwogICAgZnVuY3Rpb24gdXBkYXRlKHVpbnQgX2luZGV4LCBzdHJpbmcgbWVtb3J5IF90ZXh0KSBwdWJsaWMgewogICAgICAgIEFmYXplciBzdG9yYWdlIGFmYXplciA9IGFmYXplcmVzW19pbmRleF07CiAgICAgICAgYWZhemVyLnRleHRvID0gX3RleHQ7CiAgICB9CgogICAgLy8gYXR1YWxpemFjYW8gY29uY2x1aWRhCiAgICBmdW5jdGlvbiB0b2dnbGVDb21wbGV0ZWQodWludCBfaW5kZXgpIHB1YmxpYyB7CiAgICAgICAgQWZhemVyIHN0b3JhZ2UgYWZhemVyID0gYWZhemVyZXNbX2luZGV4XTsKICAgICAgICBhZmF6ZXIuY29uY2x1aWRhID0gIWFmYXplci5jb25jbHVpZGE7CiAgICB9Cn0=)
- [StructImport.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCnN0cnVjdCBBZmF6ZXIgewogICAgc3RyaW5nIHRleHRvOwogICAgYm9vbCBjb25jbHVpZGE7Cn0=)
- [Structs.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmltcG9ydCAiLi9TdHJ1Y3REZWNsYXJhdGlvbi5zb2wiOwoKY29udHJhY3QgQWZhemVyZXMgewogICAgLy8gVW0gYXJyYXkgZGUgc3RydWN0cyAnQWZhemVyJyAKICAgIEFmYXplcltdIHB1YmxpYyBhZmF6ZXJlczsKfQ==)
