# Pagável

Funções e endereços declarados `payable` podem receber `ether` nesse contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Payable {
    // Endereço pagável pode receber Ether
    address payable public owner;

    // Constructor pagável pode receber Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Função para depositar Ether neste contrato.
    // Chamar essa função junto com algum Ether.
    // O saldo desse contrato será automaticamente atualizado.
    function deposit() public payable {}

    // Chamar essa função junto com algum Ether.
    // A função vai lançar um erro já que ela não é pagável.
    function notPayable() public {}

    // Função para retirar todo Ether deste contrato.
    function withdraw() public {
        // pega a quantidade de Ether armazenado nesse contrato
        uint amount = address(this).balance;

        // envia todo Ether para o proprietário
        // Proprietário pode receber Ether já que o endereço dele é pagável
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Falha ao enviar Ether");
    }

    // Função para transferir Ether deste contrato para o endereço de entrada
    function transfer(address payable _para, uint _quantidade) public {
        // Note que "to" está declarada como pagável
        (bool success, ) = _para.call{value: _quantidade}("");
        require(success, "Falha ao enviar Ether");
    }
}
```

## Teste no Remix
- [Pagavel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFBhZ2F2ZWwgewogICAgLy8gRW5kZXJlY28gcGFnYXZlbCBwb2RlIHJlY2ViZXIgRXRoZXIKICAgIGFkZHJlc3MgcGF5YWJsZSBwdWJsaWMgb3duZXI7CgogICAgLy8gQ29uc3RydWN0b3IgcGFnYXZlbCBwb2RlIHJlY2ViZXIgRXRoZXIKICAgIGNvbnN0cnVjdG9yKCkgcGF5YWJsZSB7CiAgICAgICAgb3duZXIgPSBwYXlhYmxlKG1zZy5zZW5kZXIpOwogICAgfQoKICAgIC8vIEZ1bmNhbyBwYXJhIGRlcG9zaXRhciBFdGhlciBuZXN0ZSBjb250cmF0by4KICAgIC8vIENoYW1hciBlc3NhIGZ1bmNhbyBqdW50byBjb20gYWxndW0gRXRoZXIuCiAgICAvLyBPIHNhbGRvIGRlc3NlIGNvbnRyYXRvIHNlcmEgYXV0b21hdGljYW1lbnRlIGF0dWFsaXphZG8uCiAgICBmdW5jdGlvbiBkZXBvc2l0KCkgcHVibGljIHBheWFibGUge30KCiAgICAvLyBDaGFtYXIgZXNzYSBmdW5jYW8ganVudG8gY29tIGFsZ3VtIEV0aGVyLgogICAgLy8gQSBmdW5jYW8gdmFpIGxhbmNhciB1bSBlcnJvIGphIHF1ZSBlbGEgbmFvIGUgcGFnYXZlbC4KICAgIGZ1bmN0aW9uIG5vdFBheWFibGUoKSBwdWJsaWMge30KCiAgICAvLyBGdW5jYW8gcGFyYSByZXRpcmFyIHRvZG8gRXRoZXIgZGVzdGUgY29udHJhdG8uCiAgICBmdW5jdGlvbiB3aXRoZHJhdygpIHB1YmxpYyB7CiAgICAgICAgLy8gcGVnYSBhIHF1YW50aWRhZGUgZGUgRXRoZXIgYXJtYXplbmFkbyBuZXNzZSBjb250cmF0bwogICAgICAgIHVpbnQgYW1vdW50ID0gYWRkcmVzcyh0aGlzKS5iYWxhbmNlOwoKICAgICAgICAvLyBlbnZpYSB0b2RvIEV0aGVyIHBhcmEgbyBwcm9wcmlldGFyaW8KICAgICAgICAvLyBQcm9wcmlldGFyaW8gcG9kZSByZWNlYmVyIEV0aGVyIGphIHF1ZSBvIGVuZGVyZWNvIGRlbGUgZSBwYWdhdmVsCiAgICAgICAgKGJvb2wgc3VjY2VzcywgKSA9IG93bmVyLmNhbGx7dmFsdWU6IGFtb3VudH0oIiIpOwogICAgICAgIHJlcXVpcmUoc3VjY2VzcywgIkZhbGhhIGFvIGVudmlhciBFdGhlciIpOwogICAgfQoKICAgIC8vIEZ1bmNhbyBwYXJhIHRyYW5zZmVyaXIgRXRoZXIgZGVzdGUgY29udHJhdG8gcGFyYSBvIGVuZGVyZWNvIGRlIGVudHJhZGEKICAgIGZ1bmN0aW9uIHRyYW5zZmVyKGFkZHJlc3MgcGF5YWJsZSBfcGFyYSwgdWludCBfcXVhbnRpZGFkZSkgcHVibGljIHsKICAgICAgICAvLyBOb3RlIHF1ZSAidG8iIGVzdGEgZGVjbGFyYWRhIGNvbW8gcGFnYXZlbAogICAgICAgIChib29sIHN1Y2Nlc3MsICkgPSBfcGFyYS5jYWxse3ZhbHVlOiBfcXVhbnRpZGFkZX0oIiIpOwogICAgICAgIHJlcXVpcmUoc3VjY2VzcywgIkZhbGhhIGFvIGVudmlhciBFdGhlciIpOwogICAgfQp9)