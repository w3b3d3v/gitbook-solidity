# Verificando Assinatura

Mensagens podem ser assinadas fora da rede e depois verificadas na rede usando contrato inteligente.

[Exemplo usando ethers.js](https://github.com/t4sk/hello-erc20-permit/blob/main/test/verify-signature.js)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/* Verificação da assinatura

Como assinar e verificar
# Assinando
1. Cria uma mensagem para assinar
2. Cria um hash da mensagem
3. Assine o hash (fora da rede, mantenha sua chave privada em segredo)

# Verifique
1. Recria um hash da mensagem original
2. Recupere o signatário da assinatura e do hash
3. Compara o signatário recuperado com o signatário reivindicado
*/

contract VerifySignature {
    /* 1. Desbloqueia a conta MetaMask
    ethereum.enable()
    */

    /* 2. Recebe mensagem hash para assinar
    getMessageHash(
        0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C,
        123,
        "coffee and donuts",
        1
    )

    hash = "0xcf36ac4f97dc10d91fc2cbb20d718e94a8cbfe0f82eaedc6a4aa38946fb797cd"
    */
    function getMessageHash(
        address _to,
        uint _amount,
        string memory _message,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _amount, _message, _nonce));
    }

    /* 3. Assina o hash mensagem
    # usando browser
    account = "copiar e colar a conta do signatário aqui"
    ethereum.request({ method: "personal_sign", params: [account, hash]}).then(console.log)

    # usando web3
    web3.personal.sign(hash, web3.eth.defaultAccount, console.log)

    Assinatura será diferente para contas diferentes
    0x993dab3dd91f5c6dc28e17439be475478f5635c92a56e17e82349d3fb2f166196f466c0b4e0c146f285204f0dcb13e5ae67bc33f4b888ec32dfe0a063e8f3f781b
    */
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        A assinatura é gerada assinando um hash keccak256 com o seguinte formato:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    /* 4. Verifique a assinatura
    signatário = 0xB273216C05A8c0D4F0a4Dd0d7Bae1D2EfFE636dd
    para = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C
    quantia = 123
    mensagem = "café e donuts"
    nonce = 1
    assinatura =
        0x993dab3dd91f5c6dc28e17439be475478f5635c92a56e17e82349d3fb2f166196f466c0b4e0c146f285204f0dcb13e5ae67bc33f4b888ec32dfe0a063e8f3f781b
    */
    function verify(
        address _signer,
        address _to,
        uint _amount,
        string memory _message,
        uint _nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_to, _amount, _message, _nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            Os primeiros 32 bytes armazena o comprimento da assinatura

            add(sig, 32) = pointer of sig + 32
            efetivamente, pula os 32 primeiros bytes da assinatura

            mload(p) carrega os próximos 32 bytes começando no endereço de memória p na memória
            */

            // primeiros 32 bytes, depois do prefixo de comprimento
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            //  byte final (primeiro byte dos próximos 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitamente retorna (r, s, v)
    }
}
```

## Teste no Remix

[Assinatura.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qIFZlcmlmaWNhY2FvIGRhIGFzc2luYXR1cmEKCkNvbW8gYXNzaW5hciBlIHZlcmlmaWNhcgojIEFzc2luYW5kbwoxLiBDcmlhIHVtYSBtZW5zYWdlbSBwYXJhIGFzc2luYXIKMi4gQ3JpYSB1bSBoYXNoIGRhIG1lbnNhZ2VtCjMuIEFzc2luZSBvIGhhc2ggKGZvcmEgZGEgcmVkZSwgbWFudGVuaGEgc3VhIGNoYXZlIHByaXZhZGEgZW0gc2VncmVkbykKCiMgVmVyaWZpcXVlCjEuIFJlY3JpYSB1bSBoYXNoIGRhIG1lbnNhZ2VtIG9yaWdpbmFsCjIuIFJlY3VwZXJlIG8gc2lnbmF0YXJpbyBkYSBhc3NpbmF0dXJhIGUgZG8gaGFzaAozLiBDb21wYXJhIG8gc2lnbmF0YXJpbyByZWN1cGVyYWRvIGNvbSBvIHNpZ25hdGFyaW8gcmVpdmluZGljYWRvCiovCgpjb250cmFjdCBWZXJpZnlTaWduYXR1cmUgewogICAgLyogMS4gRGVzYmxvcXVlaWEgYSBjb250YSBNZXRhTWFzawogICAgZXRoZXJldW0uZW5hYmxlKCkKICAgICovCgogICAgLyogMi4gUmVjZWJlIG1lbnNhZ2VtIGhhc2ggcGFyYSBhc3NpbmFyCiAgICBnZXRNZXNzYWdlSGFzaCgKICAgICAgICAweDE0NzIzQTA5QUNmZjZEMkE2MERjZEY3YUE0QUZmMzA4RkREQzE2MEMsCiAgICAgICAgMTIzLAogICAgICAgICJjb2ZmZWUgYW5kIGRvbnV0cyIsCiAgICAgICAgMQogICAgKQoKICAgIGhhc2ggPSAiMHhjZjM2YWM0Zjk3ZGMxMGQ5MWZjMmNiYjIwZDcxOGU5NGE4Y2JmZTBmODJlYWVkYzZhNGFhMzg5NDZmYjc5N2NkIgogICAgKi8KICAgIGZ1bmN0aW9uIGdldE1lc3NhZ2VIYXNoKAogICAgICAgIGFkZHJlc3MgX3RvLAogICAgICAgIHVpbnQgX2Ftb3VudCwKICAgICAgICBzdHJpbmcgbWVtb3J5IF9tZXNzYWdlLAogICAgICAgIHVpbnQgX25vbmNlCiAgICApIHB1YmxpYyBwdXJlIHJldHVybnMgKGJ5dGVzMzIpIHsKICAgICAgICByZXR1cm4ga2VjY2FrMjU2KGFiaS5lbmNvZGVQYWNrZWQoX3RvLCBfYW1vdW50LCBfbWVzc2FnZSwgX25vbmNlKSk7CiAgICB9CgogICAgLyogMy4gQXNzaW5hIG8gaGFzaCBtZW5zYWdlbQogICAgIyB1c2FuZG8gYnJvd3NlcgogICAgYWNjb3VudCA9ICJjb3BpYXIgZSBjb2xhciBhIGNvbnRhIGRvIHNpZ25hdGFyaW8gYXF1aSIKICAgIGV0aGVyZXVtLnJlcXVlc3QoeyBtZXRob2Q6ICJwZXJzb25hbF9zaWduIiwgcGFyYW1zOiBbYWNjb3VudCwgaGFzaF19KS50aGVuKGNvbnNvbGUubG9nKQoKICAgICMgdXNhbmRvIHdlYjMKICAgIHdlYjMucGVyc29uYWwuc2lnbihoYXNoLCB3ZWIzLmV0aC5kZWZhdWx0QWNjb3VudCwgY29uc29sZS5sb2cpCgogICAgQXNzaW5hdHVyYSBzZXJhIGRpZmVyZW50ZSBwYXJhIGNvbnRhcyBkaWZlcmVudGVzCiAgICAweDk5M2RhYjNkZDkxZjVjNmRjMjhlMTc0MzliZTQ3NTQ3OGY1NjM1YzkyYTU2ZTE3ZTgyMzQ5ZDNmYjJmMTY2MTk2ZjQ2NmMwYjRlMGMxNDZmMjg1MjA0ZjBkY2IxM2U1YWU2N2JjMzNmNGI4ODhlYzMyZGZlMGEwNjNlOGYzZjc4MWIKICAgICovCiAgICBmdW5jdGlvbiBnZXRFdGhTaWduZWRNZXNzYWdlSGFzaChieXRlczMyIF9tZXNzYWdlSGFzaCkKICAgICAgICBwdWJsaWMKICAgICAgICBwdXJlCiAgICAgICAgcmV0dXJucyAoYnl0ZXMzMikKICAgIHsKICAgICAgICAvKgogICAgICAgIEEgYXNzaW5hdHVyYSBlIGdlcmFkYSBhc3NpbmFuZG8gdW0gaGFzaCBrZWNjYWsyNTYgY29tIG8gc2VndWludGUgZm9ybWF0bzoKICAgICAgICAieDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2UKIiArIGxlbihtc2cpICsgbXNnCiAgICAgICAgKi8KICAgICAgICByZXR1cm4KICAgICAgICAgICAga2VjY2FrMjU2KAogICAgICAgICAgICAgICAgYWJpLmVuY29kZVBhY2tlZCgieDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2U6CjMyIiwgX21lc3NhZ2VIYXNoKQogICAgICAgICAgICApOwogICAgfQoKICAgIC8qIDQuIFZlcmlmaXF1ZSBhIGFzc2luYXR1cmEKICAgIHNpZ25hdGFyaW8gPSAweEIyNzMyMTZDMDVBOGMwRDRGMGE0RGQwZDdCYWUxRDJFZkZFNjM2ZGQKICAgIHBhcmEgPSAweDE0NzIzQTA5QUNmZjZEMkE2MERjZEY3YUE0QUZmMzA4RkREQzE2MEMKICAgIHF1YW50aWEgPSAxMjMKICAgIG1lbnNhZ2VtID0gImNhZmUgZSBkb251dHMiCiAgICBub25jZSA9IDEKICAgIGFzc2luYXR1cmEgPQogICAgICAgIDB4OTkzZGFiM2RkOTFmNWM2ZGMyOGUxNzQzOWJlNDc1NDc4ZjU2MzVjOTJhNTZlMTdlODIzNDlkM2ZiMmYxNjYxOTZmNDY2YzBiNGUwYzE0NmYyODUyMDRmMGRjYjEzZTVhZTY3YmMzM2Y0Yjg4OGVjMzJkZmUwYTA2M2U4ZjNmNzgxYgogICAgKi8KICAgIGZ1bmN0aW9uIHZlcmlmeSgKICAgICAgICBhZGRyZXNzIF9zaWduZXIsCiAgICAgICAgYWRkcmVzcyBfdG8sCiAgICAgICAgdWludCBfYW1vdW50LAogICAgICAgIHN0cmluZyBtZW1vcnkgX21lc3NhZ2UsCiAgICAgICAgdWludCBfbm9uY2UsCiAgICAgICAgYnl0ZXMgbWVtb3J5IHNpZ25hdHVyZQogICAgKSBwdWJsaWMgcHVyZSByZXR1cm5zIChib29sKSB7CiAgICAgICAgYnl0ZXMzMiBtZXNzYWdlSGFzaCA9IGdldE1lc3NhZ2VIYXNoKF90bywgX2Ftb3VudCwgX21lc3NhZ2UsIF9ub25jZSk7CiAgICAgICAgYnl0ZXMzMiBldGhTaWduZWRNZXNzYWdlSGFzaCA9IGdldEV0aFNpZ25lZE1lc3NhZ2VIYXNoKG1lc3NhZ2VIYXNoKTsKCiAgICAgICAgcmV0dXJuIHJlY292ZXJTaWduZXIoZXRoU2lnbmVkTWVzc2FnZUhhc2gsIHNpZ25hdHVyZSkgPT0gX3NpZ25lcjsKICAgIH0KCiAgICBmdW5jdGlvbiByZWNvdmVyU2lnbmVyKGJ5dGVzMzIgX2V0aFNpZ25lZE1lc3NhZ2VIYXNoLCBieXRlcyBtZW1vcnkgX3NpZ25hdHVyZSkKICAgICAgICBwdWJsaWMKICAgICAgICBwdXJlCiAgICAgICAgcmV0dXJucyAoYWRkcmVzcykKICAgIHsKICAgICAgICAoYnl0ZXMzMiByLCBieXRlczMyIHMsIHVpbnQ4IHYpID0gc3BsaXRTaWduYXR1cmUoX3NpZ25hdHVyZSk7CgogICAgICAgIHJldHVybiBlY3JlY292ZXIoX2V0aFNpZ25lZE1lc3NhZ2VIYXNoLCB2LCByLCBzKTsKICAgIH0KCiAgICBmdW5jdGlvbiBzcGxpdFNpZ25hdHVyZShieXRlcyBtZW1vcnkgc2lnKQogICAgICAgIHB1YmxpYwogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgYnl0ZXMzMiByLAogICAgICAgICAgICBieXRlczMyIHMsCiAgICAgICAgICAgIHVpbnQ4IHYKICAgICAgICApCiAgICB7CiAgICAgICAgcmVxdWlyZShzaWcubGVuZ3RoID09IDY1LCAiaW52YWxpZCBzaWduYXR1cmUgbGVuZ3RoIik7CgogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgLyoKICAgICAgICAgICAgT3MgcHJpbWVpcm9zIDMyIGJ5dGVzIGFybWF6ZW5hIG8gY29tcHJpbWVudG8gZGEgYXNzaW5hdHVyYQoKICAgICAgICAgICAgYWRkKHNpZywgMzIpID0gcG9pbnRlciBvZiBzaWcgKyAzMgogICAgICAgICAgICBlZmV0aXZhbWVudGUsIHB1bGEgb3MgMzIgcHJpbWVpcm9zIGJ5dGVzIGRhIGFzc2luYXR1cmEKCiAgICAgICAgICAgIG1sb2FkKHApIGNhcnJlZ2Egb3MgcHJveGltb3MgMzIgYnl0ZXMgY29tZWNhbmRvIG5vIGVuZGVyZWNvIGRlIG1lbW9yaWEgcCBuYSBtZW1vcmlhCiAgICAgICAgICAgICovCgogICAgICAgICAgICAvLyBwcmltZWlyb3MgMzIgYnl0ZXMsIGRlcG9pcyBkbyBwcmVmaXhvIGRlIGNvbXByaW1lbnRvCiAgICAgICAgICAgIHIgOj0gbWxvYWQoYWRkKHNpZywgMzIpKQogICAgICAgICAgICAvLyBzZWNvbmQgMzIgYnl0ZXMKICAgICAgICAgICAgcyA6PSBtbG9hZChhZGQoc2lnLCA2NCkpCiAgICAgICAgICAgIC8vICBieXRlIGZpbmFsIChwcmltZWlybyBieXRlIGRvcyBwcm94aW1vcyAzMiBieXRlcykKICAgICAgICAgICAgdiA6PSBieXRlKDAsIG1sb2FkKGFkZChzaWcsIDk2KSkpCiAgICAgICAgfQoKICAgICAgICAvLyBpbXBsaWNpdGFtZW50ZSByZXRvcm5hIChyLCBzLCB2KQogICAgfQp9)
