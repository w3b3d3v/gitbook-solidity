# Honeypot

Um honeypot é uma armadilha para caçadores de hackers.

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Combinando duas explorações, reentrada e ocultação de código malicioso, podemos construir um contrato que consiga pegar usuários maliciosos.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

## Teste no Remix

-[HoneyPot.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkJhbmsgZSB1bSBjb250cmF0byBxdWUgY2hhbWEgTG9nZ2VyIHBhcmEgZW52ZW50b3MgbG9nLgpCYW5rLndpdGhkcmF3KCkgZSB2dWxuZXJhdmVsIGEgYXRhcXVlIGRlIHJlZW50cmFkYS4KRW50YW8gdW0gaGFja2VyIHRlbnRhIGRyZW5hciBFdGhlciBkbyBCYW5rLgpNYXMgbmEgdmVyZGFkZSBvIGV4cGxvaXQgZGUgcmVlbnRyYWRhIGUgdW1hIGlzY2EgcGFyYSBoYWNrZXJzLgpJbXBsZW1lbnRhbmRvIEJhbmsgY29tIEhvbmV5UG90IG5vIGx1Z2FyIGRvIExvZ2dlciwgZXNzZSBjb250cmF0byBzZSB0b3JuYQp1bWEgYXJtYWRpbGhhIHBhcmEgaGFja2Vycy4gVmVqYW1vcyBjb21vLgoKMS4gQWxpY2UgaW1wbGFudGEgSG9uZXlQb3QKMi4gQWxpY2UgaW1wbGFudGEgQmFuayBjb20gZW5kZXJlY28gZG8gSG9uZXlQb3QKMy4gQWxpY2UgZGVwb3NpdGEgMSBFdGhlciBubyBCYW5rLgo0LiBFdmUgZGVzY29icmUgYSBleHBsb2l0IGRlIHJlZW50cmFkYSBlbSBCYW5rLndpdGhkcmF3IGUgZGVjaWRlIGhhY2tlYXIuCjUuIEV2ZSBpbXBsYW50YSBBdHRhY2sgY29tIGVuZGVyZWNvIGRvIEJhbmsKNi4gRXZlIGNoYW1hIEF0dGFjay5hdHRhY2soKSBjb20gMSBFdGhlciBtYXMgYSB0cmFuc2FjYW8gZmFsaGEuCgpPIHF1ZSBhY29udGVjZXU/CkV2ZSBjaGFtYSBBdHRhY2suYXR0YWNrKCkgZSBlbGEgY29tZWNhIGEgcmV0aXJhciBFdGhlciBkbyBCYW5rLgpRdWFuZG8gbyB1bHRpbW8gQmFuay53aXRoZHJhdygpIGVzdGEgcHJlc3RlcyBhIGFjb250ZWNlciwgZWxlIGNoYW1hIGxvZ2dlci5sb2coKS4KTG9nZ2VyLmxvZygpIGNoYW1hIEhvbmV5UG90LmxvZygpIGUgcmV2ZXJ0ZS4gQSB0cmFuc2FjYW8gZmFsaGEuCiovCgpjb250cmFjdCBCYW5rIHsKICAgIG1hcHBpbmcoYWRkcmVzcyA9PiB1aW50KSBwdWJsaWMgYmFsYW5jZXM7CiAgICBMb2dnZXIgbG9nZ2VyOwoKICAgIGNvbnN0cnVjdG9yKExvZ2dlciBfbG9nZ2VyKSB7CiAgICAgICAgbG9nZ2VyID0gTG9nZ2VyKF9sb2dnZXIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlcG9zaXQoKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgYmFsYW5jZXNbbXNnLnNlbmRlcl0gKz0gbXNnLnZhbHVlOwogICAgICAgIGxvZ2dlci5sb2cobXNnLnNlbmRlciwgbXNnLnZhbHVlLCAiRGVwb3NpdCIpOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQgX2Ftb3VudCkgcHVibGljIHsKICAgICAgICByZXF1aXJlKF9hbW91bnQgPD0gYmFsYW5jZXNbbXNnLnNlbmRlcl0sICJJbnN1ZmZpY2llbnQgZnVuZHMiKTsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IG1zZy5zZW5kZXIuY2FsbHt2YWx1ZTogX2Ftb3VudH0oIiIpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CgogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdIC09IF9hbW91bnQ7CgogICAgICAgIGxvZ2dlci5sb2cobXNnLnNlbmRlciwgX2Ftb3VudCwgIldpdGhkcmF3Iik7CiAgICB9Cn0KCmNvbnRyYWN0IExvZ2dlciB7CiAgICBldmVudCBMb2coYWRkcmVzcyBjYWxsZXIsIHVpbnQgYW1vdW50LCBzdHJpbmcgYWN0aW9uKTsKCiAgICBmdW5jdGlvbiBsb2coCiAgICAgICAgYWRkcmVzcyBfY2FsbGVyLAogICAgICAgIHVpbnQgX2Ftb3VudCwKICAgICAgICBzdHJpbmcgbWVtb3J5IF9hY3Rpb24KICAgICkgcHVibGljIHsKICAgICAgICBlbWl0IExvZyhfY2FsbGVyLCBfYW1vdW50LCBfYWN0aW9uKTsKICAgIH0KfQoKLy8gSGFja2VyIHRlbnRhIGRyZW5hciBFdGhlcnMgYXJtYXplbmFkb3Mgbm8gQmFuayBwb3IgcmVlbnRyYWRhLgpjb250cmFjdCBBdHRhY2sgewogICAgQmFuayBiYW5rOwoKICAgIGNvbnN0cnVjdG9yKEJhbmsgX2JhbmspIHsKICAgICAgICBiYW5rID0gQmFuayhfYmFuayk7CiAgICB9CgogICAgZmFsbGJhY2soKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBpZiAoYWRkcmVzcyhiYW5rKS5iYWxhbmNlID49IDEgZXRoZXIpIHsKICAgICAgICAgICAgYmFuay53aXRoZHJhdygxIGV0aGVyKTsKICAgICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gYXR0YWNrKCkgcHVibGljIHBheWFibGUgewogICAgICAgIGJhbmsuZGVwb3NpdHt2YWx1ZTogMSBldGhlcn0oKTsKICAgICAgICBiYW5rLndpdGhkcmF3KDEgZXRoZXIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldEJhbGFuY2UoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIGFkZHJlc3ModGhpcykuYmFsYW5jZTsKICAgIH0KfQoKLy8gRGlnYW1vcyBxdWUgZXNzZSBjb2RpZ28gZXN0ZWphIGVtIGFycXVpdm8gc2VwYXJhZG8gZGUgZm9ybWEgcXVlIG91dHJvcyBuYW8gcG9zc2FtIGxlci4KY29udHJhY3QgSG9uZXlQb3QgewogICAgZnVuY3Rpb24gbG9nKAogICAgICAgIGFkZHJlc3MgX2NhbGxlciwKICAgICAgICB1aW50IF9hbW91bnQsCiAgICAgICAgc3RyaW5nIG1lbW9yeSBfYWN0aW9uCiAgICApIHB1YmxpYyB7CiAgICAgICAgaWYgKGVxdWFsKF9hY3Rpb24sICJXaXRoZHJhdyIpKSB7CiAgICAgICAgICAgIHJldmVydCgiSXQncyBhIHRyYXAiKTsKICAgICAgICB9CiAgICB9CgogICAgLy8gRnVuY2FvIHBhcmEgY29tcGFyYXIgc3RyaW5ncyB1c2FuZG8ga2VjY2FrMjU2CiAgICBmdW5jdGlvbiBlcXVhbChzdHJpbmcgbWVtb3J5IF9hLCBzdHJpbmcgbWVtb3J5IF9iKSBwdWJsaWMgcHVyZSByZXR1cm5zIChib29sKSB7CiAgICAgICAgcmV0dXJuIGtlY2NhazI1NihhYmkuZW5jb2RlKF9hKSkgPT0ga2VjY2FrMjU2KGFiaS5lbmNvZGUoX2IpKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
