# Errores

Un error deshará todos los cambios realizados al estado durante una transacción.

Puedes lanzar un error invocando `require`, `revert` o `assert`.

* `require` es usado para validar entradas y condiciones previas a una ejecución.
* `revert` es similar a `require`. Observa el código de abajo para mayor detalle.
* `assert` es usado para comprobar que el código nunca debe ser falso. La afirmación fallida probablemente significa que existe um bug.

Usa errores personalizados para ahorrar gas.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Error {
    function testRequire(uint _i) public pure {
        // Require debe ser usado para validar condiciones como:
        // - entradas
        // - condiciones previas a la ejecución
        // - valores devueltos de invocaciones a otras funciones
        require(_i > 10, "Input must be greater than 10");
    }

    function testRevert(uint _i) public pure {
        // Revert es útil cuando la condición a ser verificada es compleja.
        // Este código hace exactamente la misma cosa que el ejemplo de arriba
        if (_i <= 10) {
            revert("Input must be greater than 10");
        }
    }

    uint public num;

    function testAssert() public view {
        // Assert solamente debe ser usado para testear errores internos,
        // y para comprobar invariantes.

        // Aquí afirmamos que num es siempre igual a 0
        // ya que es imposible actualizar el valor de num
        assert(num == 0);
    }

    // error personalizado
    error InsufficientBalance(uint balance, uint withdrawAmount);

    function testCustomError(uint _withdrawAmount) public view {
        uint bal = address(this).balance;
        if (bal < _withdrawAmount) {
            revert InsufficientBalance({balance: bal, withdrawAmount: _withdrawAmount});
        }
    }
}
```

Aquí otro ejemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Account {
    uint public balance;
    uint public constant MAX_UINT = 2**256 - 1;

    function deposit(uint _amount) public {
        uint oldBalance = balance;
        uint newBalance = balance + _amount;

        // balance + _amount no causa overflow si balance + _amount >= balance
        require(newBalance >= oldBalance, "Overflow");

        balance = newBalance;

        assert(balance >= oldBalance);
    }

    function withdraw(uint _amount) public {
        uint oldBalance = balance;

        // balance - _amount no causa underflow si balance >= _amount
        require(balance >= _amount, "Underflow");

        if (balance < _amount) {
            revert("Underflow");
        }

        balance -= _amount;

        assert(balance <= oldBalance);
    }
}
```