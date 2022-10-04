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
    Qual fubção é chamada, fallback() ou receive()?

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
