# Enviando Ether (transferir, enviar, chamar)

#### Como enviar Ether? <a href="#how-to-send-ether" id="how-to-send-ether"></a>

Você pode enviar Ether para outros contratos por meio de

- `transfer` (2300 gás, lança erro)
- `send` (2300 gás, retorna um bool)
- `call` (encaminha todo o gás ou colocar gás, retorna um bool)

#### Como receber Ether? <a href="#how-to-receive-ether" id="how-to-receive-ether"></a>

Um contrato que recebe Ether deve ter pelo menos uma das funções abaixo

- `receive() external payable`
- `fallback() external payable`

`receive()` é chamada se `msg.data` estiver vazio, caso contrário `fallback()`é chamada.

#### Qual método você deve usar? <a href="#which-method-should-you-use" id="which-method-should-you-use"></a>

`call` em combinação com proteção de reentrada é o método recomendado para ser usado depois de dezembro de 2019.

Proteção contra reentrada

- fazendo todas as mudanças de estado antes de chamar outros contratos
- usando modificador de proteção de reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ReceiveEther {
    /*
    Qual função é chamada, fallback() ou receive()?

           envie Ether
               |
         msg.data está vazia?
              / \
            sim  não
            /     \
receive() existe?  fallback()
         /   \
        sim   não
        /      \
    receive()   fallback()
    */

    // Função para receber Ether. msg.data deve estar vazio
    receive() external payable {}

    // Função de fallback é chamada quando msg.data não está vazio
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract SendEther {
    function sendViaTransfer(address payable _to) public payable {
        // Esta função não é mais recomendada para enviar Ether.
        _to.transfer(msg.value);
    }

    function sendViaSend(address payable _to) public payable {
        // Send retorna um valor boolean indicando sucesso ou falha.
        // Esta função não é recomendada para enviar Ether.
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    function sendViaCall(address payable _to) public payable {
        // Call retorna um valor boolean indicando sucesso ou falha.
        // Esse é o método atual recomendado para ser usado.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
```

### Teste no Remix

- [EnviandoEther.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFJlY2VpdmVFdGhlciB7CiAgLyoKICAgICBRdWFsIGZ1bmNhbyBlIGNoYW1hZGEsIGZhbGxiYWNrKCkgb3UgcmVjZWl2ZSgpPwoKICAgICAgICAgICBlbnZpZSBFdGhlcgogICAgICAgICAgICAgICB8CiAgICAgICAgIG1zZy5kYXRhIGVzdGEgdmF6aWE/CiAgICAgICAgICAgICAgLyBcCiAgICAgICAgICAgIHNpbSAgbmFvCiAgICAgICAgICAgIC8gICAgIFwKcmVjZWl2ZSgpIGV4aXN0ZT8gIGZhbGxiYWNrKCkKICAgICAgICAgLyAgIFwKICAgICAgICBzaW0gICBuYW8KICAgICAgICAvICAgICAgXAogICAgcmVjZWl2ZSgpICAgZmFsbGJhY2soKQogICAgKi8KCgogICAgLy8gRnVuY2FvIHBhcmEgcmVjZWJlciBFdGhlci4gbXNnLmRhdGEgZGV2ZSBlc3RhciB2YXppbwogICAgcmVjZWl2ZSgpIGV4dGVybmFsIHBheWFibGUge30KCiAgICAvLyBGdW5jYW8gZGUgZmFsbGJhY2sgZSBjaGFtYWRhIHF1YW5kbyBtc2cuZGF0YSBuYW8gZXN0YSB2YXppbwogICAgZmFsbGJhY2soKSBleHRlcm5hbCBwYXlhYmxlIHt9CgogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gYWRkcmVzcyh0aGlzKS5iYWxhbmNlOwogICAgfQp9Cgpjb250cmFjdCBTZW5kRXRoZXIgewogICAgZnVuY3Rpb24gc2VuZFZpYVRyYW5zZmVyKGFkZHJlc3MgcGF5YWJsZSBfdG8pIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICAvLyBFc3RhIGZ1bmNhbyBuYW8gZSBtYWlzIHJlY29tZW5kYWRhIHBhcmEgZW52aWFyIEV0aGVyLgogICAgICAgIF90by50cmFuc2Zlcihtc2cudmFsdWUpOwogICAgfQoKICAgIGZ1bmN0aW9uIHNlbmRWaWFTZW5kKGFkZHJlc3MgcGF5YWJsZSBfdG8pIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICAvLyBTZW5kIHJldG9ybmEgdW0gdmFsb3IgYm9vbGVhbiBpbmRpY2FuZG8gc3VjZXNzbyBvdSBmYWxoYS4KICAgICAgICAvLyBFc3RhIGZ1bmNhbyBuYW8gZSByZWNvbWVuZGFkYSBwYXJhIGVudmlhciBFdGhlci4KICAgICAgICBib29sIHNlbnQgPSBfdG8uc2VuZChtc2cudmFsdWUpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CiAgICB9CgogICAgZnVuY3Rpb24gc2VuZFZpYUNhbGwoYWRkcmVzcyBwYXlhYmxlIF90bykgcHVibGljIHBheWFibGUgewogICAgICAgIC8vIENhbGwgcmV0b3JuYSB1bSB2YWxvciBib29sZWFuIGluZGljYW5kbyBzdWNlc3NvIG91IGZhbGhhLgogICAgICAgIC8vIEVzc2UgZSBvIG1ldG9kbyBhdHVhbCByZWNvbWVuZGFkbyBwYXJhIHNlciB1c2Fkby4KICAgICAgICAoYm9vbCBzZW50LCBieXRlcyBtZW1vcnkgZGF0YSkgPSBfdG8uY2FsbHt2YWx1ZTogbXNnLnZhbHVlfSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQ==)
