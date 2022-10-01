# Enviando Ether (transferir, enviar, chamar)

#### Como enviar Ether? <a href="#how-to-send-ether" id="how-to-send-ether"></a>

Você pode enviar Ether para outros contratos por meio de

* `transfer` (2300 gás, lança erro)
* `send` (2300 gás, retorna um bool)
* `call` (encaminha todo o gás ou coloca gás, retorna um bool)

#### Como receber Ether? <a href="#how-to-receive-ether" id="how-to-receive-ether"></a>

Um contrato que recebe Ether deve ter pelo menos uma das funções abaixo

* `receive() external payable`
* `fallback() external payable`

`receive()` é chamada se `msg.data` estiver vazio, caso contrário `fallback()`é chamada.

#### Qual método você deve usar? <a href="#which-method-should-you-use" id="which-method-should-you-use"></a>

`call` em combinação com proteção de reentrada é o método recomendado para ser usado depois de dezembro de 2019.

Proteção contra reentrada&#x20;

* fazendo todas as mudanças de estado antes de chamar outros contratos
* usando modificador de proteção de reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
### Experimente no Remix
- [EnviandoEther.sol](https://remix.ethereum.org/#code=https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwoKY29udHJhY3QgUmVjZWl2ZUV0aGVyIHsKICAgIC8qCiAgICBRdWFsIGZ1bsOnw6NvIMOpIGNoYW1hZGEsIGZhbGxiYWNrKCkgb3UgcmVjZWl2ZSgpPwoKICAgICAgICAgICBlbnZpZSBFdGhlcgogICAgICAgICAgICAgICB8CiAgICAgICAgIG1zZy5kYXRhIGVzdMOhIHZhemlhPwogICAgICAgICAgICAgIC8gXAogICAgICAgICAgICBzaW0gIG7Do28KICAgICAgICAgICAgLyAgICAgXApyZWNlaXZlKCkgZXhpc3RlPyAgZmFsbGJhY2soKQogICAgICAgICAvICAgXAogICAgICAgIHNpbSAgIG7Do28KICAgICAgICAvICAgICAgXAogICAgcmVjZWl2ZSgpICAgZmFsbGJhY2soKQogICAgKi8KCiAgICAvLyBGdW5jYW8gcGFyYSByZWNlYmVyIEV0aGVyLiBtc2cuZGF0YSBkZXZlIGVzdGFyIHZhemlvCiAgICByZWNlaXZlKCkgZXh0ZXJuYWwgcGF5YWJsZSB7fQoKICAgIC8vIEZ1bmNhbyBkZSBmYWxsYmFjayBlIGNoYW1hZGEgcXVhbmRvIG1zZy5kYXRhIG5hbyBlc3RhIHZhemlvCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUge30KCiAgICBmdW5jdGlvbiBnZXRCYWxhbmNlKCkgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBhZGRyZXNzKHRoaXMpLmJhbGFuY2U7CiAgICB9Cn0KCmNvbnRyYWN0IFNlbmRFdGhlciB7CiAgICBmdW5jdGlvbiBzZW5kVmlhVHJhbnNmZXIoYWRkcmVzcyBwYXlhYmxlIF90bykgcHVibGljIHBheWFibGUgewogICAgICAgIC8vIEVzdGEgZnVuY2FvIG5hbyBlIG1haXMgcmVjb21lbmRhZGEgcGFyYSBlbnZpYXIgRXRoZXIuCiAgICAgICAgX3RvLnRyYW5zZmVyKG1zZy52YWx1ZSk7CiAgICB9CgogICAgZnVuY3Rpb24gc2VuZFZpYVNlbmQoYWRkcmVzcyBwYXlhYmxlIF90bykgcHVibGljIHBheWFibGUgewogICAgICAgIC8vIFNlbmQgcmV0b3JuYSB1bSB2YWxvciBib29sZWFuIGluZGljYW5kbyBzdWNlc3NvIG91IGZhbGhhLgogICAgICAgIC8vIEVzdGEgZnVuY2FvIG5hbyBlIHJlY29tZW5kYWRhIHBhcmEgZW52aWFyIEV0aGVyLgogICAgICAgIGJvb2wgc2VudCA9IF90by5zZW5kKG1zZy52YWx1ZSk7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KCiAgICBmdW5jdGlvbiBzZW5kVmlhQ2FsbChhZGRyZXNzIHBheWFibGUgX3RvKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgLy8gQ2FsbCByZXRvcm5hIHVtIHZhbG9yIGJvb2xlYW4gaW5kaWNhbmRvIHN1Y2Vzc28gb3UgZmFsaGEuCiAgICAgICAgLy8gRXNzZSBlIG8gbWV0b2RvIGF0dWFsIHJlY29tZW5kYWRvIHBhcmEgc2VyIHVzYWRvLgogICAgICAgIChib29sIHNlbnQsIGJ5dGVzIG1lbW9yeSBkYXRhKSA9IF90by5jYWxse3ZhbHVlOiBtc2cudmFsdWV9KCIiKTsKICAgICAgICByZXF1aXJlKHNlbnQsICJGYWlsZWQgdG8gc2VuZCBFdGhlciIpOwogICAgfQp9)