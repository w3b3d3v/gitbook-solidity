# Structs

Você pode definir seu próprio tipo de dado criando uma `struct`.

Elas são úteis para agrupar dados do mesmo tipo.

Structs podem ser declaradas fora do contrato e importadas para outro contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    // Uma matriz de 'Todo' structs
    Todo[] public todos;

    function create(string memory _text) public {
        // 3 formas de inicializar uma struct
        // - chamando como uma função
        todos.push(Todo(_text, false));

        // mapeamento do valor principal
        todos.push(Todo({text: _text, completed: false}));

        // inicializa uma struct vazia e depois atualiza
        Todo memory todo;
        todo.text = _text;
        // todo.completed initialized to false

        todos.push(todo);
    }

    // Solidity automaticamente criou um getter para 'todos' então
    // você não precisa realmente dessa função.
    function get(uint _index) public view returns (string memory text, bool completed) {
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }

    // atualiza texto
    function update(uint _index, string memory _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // atualização concluída
    function toggleCompleted(uint _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
}
```

#### Declarando e Importando Struct <a href="#declaring-and-importing-struct" id="declaring-and-importing-struct"></a>

Arquivo no qual a struct é declarada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

struct Todo {
    string text;
    bool completed;
}
```

Arquivo que importa a struct acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./StructDeclaration.sol";

contract Todos {
    // Uma matriz de structs 'Todo' 
    Todo[] public todos;
}
```
