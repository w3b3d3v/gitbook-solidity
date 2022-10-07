# Structs

Puedes definir tu propio tipo de dato creando un `struct`.

Estos son útiles para agrupar datos que se relacionan.

Structs pueden ser declarados fuera del contrato e importados en otro contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    // Un arreglo de 'Todo' structs
    Todo[] public todos;

    function create(string memory _text) public {
        // 3 formas de inicializar un struct
        // - invocándolo como una función
        todos.push(Todo(_text, false));

        // - asignación llave, valor
        todos.push(Todo({text: _text, completed: false}));

        // - inicializa un struct vacío y después lo actualiza
        Todo memory todo;
        todo.text = _text;
        // todo.completed initialized to false

        todos.push(todo);
    }

    // Solidity automáticamente creó un getter para 'todos' por lo cual
    // realmente no se necesita esta función.
    function get(uint _index) public view returns (string memory text, bool completed) {
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }

    // actualiza 'text'
    function update(uint _index, string memory _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // actualiza 'completed'
    function toggleCompleted(uint _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
    
}
```

#### Declarando e Importando Struct <a href="#declaring-and-importing-struct" id="declaring-and-importing-struct"></a>

Archivo en el cual un struct es declarado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

struct Todo {
    string text;
    bool completed;
}
```

Archivo que importa el struct de arriba

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./StructDeclaration.sol";

contract Todos {
    // Un arreglo de structs 'Todo'
    Todo[] public todos;
}
```
