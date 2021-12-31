# Erro

Um erro desfaz todas as mudanças feitas no estado durante uma transação.

Você pode lançar um erro chamando `require`, `revert` or `assert`.

* `require` é usado para validar entradas e condições antes da execução.
* `revert` é semelhante  a `require`. Veja o código abaixo para detalhes.
* `assert` é usado para checar se existe código que nunca deve ser falso. Afirmação falha provavelmente significa que existe um bug.

Use erro personalizado para economizar gás.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Error {
    function testRequire(uint _i) public pure {
        // Require deve ser usado para validar condições como:
        // - entradas
        // - condições anteriores à execução
        // - valores retornados de chamadas para outras funções
        require(_i > 10, "Input must be greater than 10");
    }

    function testRevert(uint _i) public pure {
        // Revert é útil quando a condição a ser verificada é complexa.
        // Esse código faz exatamente a mesma coisa que o exemplo acima
        if (_i <= 10) {
            revert("Input must be greater than 10");
        }
    }

    uint public num;

    function testAssert() public view {
        // Assert somente deve ser usada para testar erros internos,
        // e para checar invariantes.

        // Aqui nós afirmamos que num é sempre igual a 0
        // já que é impossível atualizar o valor de num
        assert(num == 0);
    }

    // erro personalizado
    error InsufficientBalance(uint balance, uint withdrawAmount);

    function testCustomError(uint _withdrawAmount) public view {
        uint bal = address(this).balance;
        if (bal < _withdrawAmount) {
            revert InsufficientBalance({balance: bal, withdrawAmount: _withdrawAmount});
        }
    }
}
```

Aqui está outro exemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Account {
    uint public balance;
    uint public constant MAX_UINT = 2**256 - 1;

    function deposit(uint _amount) public {
        uint oldBalance = balance;
        uint newBalance = balance + _amount;

        // balance + _amount não entra em condição de overflow se balance + _amount >= balance
        require(newBalance >= oldBalance, "Overflow");

        balance = newBalance;

        assert(balance >= oldBalance);
    }

    function withdraw(uint _amount) public {
        uint oldBalance = balance;

        // balance - _amount não entra em condição de underflow se balance >= _amount
        require(balance >= _amount, "Underflow");

        if (balance < _amount) {
            revert("Underflow");
        }

        balance -= _amount;

        assert(balance <= oldBalance);
    }
}
```
