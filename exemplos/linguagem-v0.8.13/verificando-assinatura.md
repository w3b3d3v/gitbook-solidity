# Verificando Assinatura

Mensagens podem ser assinadas fora da rede e depois verificadas na rede usando contratos inteligentes.

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

[Assinatura.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qIFZlcmlmaWNhw6fDo28gZGEgYXNzaW5hdHVyYQoKQ29tbyBhc3NpbmFyIGUgdmVyaWZpY2FyCiMgQXNzaW5hbmRvCjEuIENyaWEgdW1hIG1lbnNhZ2VtIHBhcmEgYXNzaW5hcgoyLiBDcmlhIHVtIGhhc2ggZGEgbWVuc2FnZW0KMy4gQXNzaW5lIG8gaGFzaCAoZm9yYSBkYSByZWRlLCBtYW50ZW5oYSBzdWEgY2hhdmUgcHJpdmFkYSBlbSBzZWdyZWRvKQoKIyBWZXJpZmlxdWUKMS4gUmVjcmlhIHVtIGhhc2ggZGEgbWVuc2FnZW0gb3JpZ2luYWwKMi4gUmVjdXBlcmUgbyBzaWduYXTDoXJpbyBkYSBhc3NpbmF0dXJhIGUgZG8gaGFzaAozLiBDb21wYXJhIG8gc2lnbmF0w6FyaW8gcmVjdXBlcmFkbyBjb20gbyBzaWduYXTDoXJpbyByZWl2aW5kaWNhZG8KKi8KCmNvbnRyYWN0IFZlcmlmeVNpZ25hdHVyZSB7CiAgICAvKiAxLiBEZXNibG9xdWVpYSBhIGNvbnRhIE1ldGFNYXNrCiAgICBldGhlcmV1bS5lbmFibGUoKQogICAgKi8KCiAgICAvKiAyLiBSZWNlYmUgbWVuc2FnZW0gaGFzaCBwYXJhIGFzc2luYXIKICAgIGdldE1lc3NhZ2VIYXNoKAogICAgICAgIDB4MTQ3MjNBMDlBQ2ZmNkQyQTYwRGNkRjdhQTRBRmYzMDhGRERDMTYwQywKICAgICAgICAxMjMsCiAgICAgICAgImNvZmZlZSBhbmQgZG9udXRzIiwKICAgICAgICAxCiAgICApCgogICAgaGFzaCA9ICIweGNmMzZhYzRmOTdkYzEwZDkxZmMyY2JiMjBkNzE4ZTk0YThjYmZlMGY4MmVhZWRjNmE0YWEzODk0NmZiNzk3Y2QiCiAgICAqLwogICAgZnVuY3Rpb24gZ2V0TWVzc2FnZUhhc2goCiAgICAgICAgYWRkcmVzcyBfdG8sCiAgICAgICAgdWludCBfYW1vdW50LAogICAgICAgIHN0cmluZyBtZW1vcnkgX21lc3NhZ2UsCiAgICAgICAgdWludCBfbm9uY2UKICAgICkgcHVibGljIHB1cmUgcmV0dXJucyAoYnl0ZXMzMikgewogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfdG8sIF9hbW91bnQsIF9tZXNzYWdlLCBfbm9uY2UpKTsKICAgIH0KCiAgICAvKiAzLiBBc3NpbmEgbyBoYXNoIG1lbnNhZ2VtCiAgICAjIHVzYW5kbyBicm93c2VyCiAgICBhY2NvdW50ID0gImNvcGlhciBlIGNvbGFyIGEgY29udGEgZG8gc2lnbmF0w6FyaW8gYXF1aSIKICAgIGV0aGVyZXVtLnJlcXVlc3QoeyBtZXRob2Q6ICJwZXJzb25hbF9zaWduIiwgcGFyYW1zOiBbYWNjb3VudCwgaGFzaF19KS50aGVuKGNvbnNvbGUubG9nKQoKICAgICMgdXNhbmRvIHdlYjMKICAgIHdlYjMucGVyc29uYWwuc2lnbihoYXNoLCB3ZWIzLmV0aC5kZWZhdWx0QWNjb3VudCwgY29uc29sZS5sb2cpCgogICAgQXNzaW5hdHVyYSBzZXLDoSBkaWZlcmVudGUgcGFyYSBjb250YXMgZGlmZXJlbnRlcwogICAgMHg5OTNkYWIzZGQ5MWY1YzZkYzI4ZTE3NDM5YmU0NzU0NzhmNTYzNWM5MmE1NmUxN2U4MjM0OWQzZmIyZjE2NjE5NmY0NjZjMGI0ZTBjMTQ2ZjI4NTIwNGYwZGNiMTNlNWFlNjdiYzMzZjRiODg4ZWMzMmRmZTBhMDYzZThmM2Y3ODFiCiAgICAqLwogICAgZnVuY3Rpb24gZ2V0RXRoU2lnbmVkTWVzc2FnZUhhc2goYnl0ZXMzMiBfbWVzc2FnZUhhc2gpCiAgICAgICAgcHVibGljCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKGJ5dGVzMzIpCiAgICB7CiAgICAgICAgLyoKICAgICAgICBBIGFzc2luYXR1cmEgw6kgZ2VyYWRhIGFzc2luYW5kbyB1bSBoYXNoIGtlY2NhazI1NiBjb20gbyBzZWd1aW50ZSBmb3JtYXRvOgogICAgICAgICJceDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2VcbiIgKyBsZW4obXNnKSArIG1zZwogICAgICAgICovCiAgICAgICAgcmV0dXJuCiAgICAgICAgICAgIGtlY2NhazI1NigKICAgICAgICAgICAgICAgIGFiaS5lbmNvZGVQYWNrZWQoIlx4MTlFdGhlcmV1bSBTaWduZWQgTWVzc2FnZTpcbjMyIiwgX21lc3NhZ2VIYXNoKQogICAgICAgICAgICApOwogICAgfQoKICAgIC8qIDQuIFZlcmlmaXF1ZSBhIGFzc2luYXR1cmEKICAgIHNpZ25hdMOhcmlvID0gMHhCMjczMjE2QzA1QThjMEQ0RjBhNERkMGQ3QmFlMUQyRWZGRTYzNmRkCiAgICBwYXJhID0gMHgxNDcyM0EwOUFDZmY2RDJBNjBEY2RGN2FBNEFGZjMwOEZEREMxNjBDCiAgICBxdWFudGlhID0gMTIzCiAgICBtZW5zYWdlbSA9ICJjYWbDqSBlIGRvbnV0cyIKICAgIG5vbmNlID0gMQogICAgYXNzaW5hdHVyYSA9CiAgICAgICAgMHg5OTNkYWIzZGQ5MWY1YzZkYzI4ZTE3NDM5YmU0NzU0NzhmNTYzNWM5MmE1NmUxN2U4MjM0OWQzZmIyZjE2NjE5NmY0NjZjMGI0ZTBjMTQ2ZjI4NTIwNGYwZGNiMTNlNWFlNjdiYzMzZjRiODg4ZWMzMmRmZTBhMDYzZThmM2Y3ODFiCiAgICAqLwogICAgZnVuY3Rpb24gdmVyaWZ5KAogICAgICAgIGFkZHJlc3MgX3NpZ25lciwKICAgICAgICBhZGRyZXNzIF90bywKICAgICAgICB1aW50IF9hbW91bnQsCiAgICAgICAgc3RyaW5nIG1lbW9yeSBfbWVzc2FnZSwKICAgICAgICB1aW50IF9ub25jZSwKICAgICAgICBieXRlcyBtZW1vcnkgc2lnbmF0dXJlCiAgICApIHB1YmxpYyBwdXJlIHJldHVybnMgKGJvb2wpIHsKICAgICAgICBieXRlczMyIG1lc3NhZ2VIYXNoID0gZ2V0TWVzc2FnZUhhc2goX3RvLCBfYW1vdW50LCBfbWVzc2FnZSwgX25vbmNlKTsKICAgICAgICBieXRlczMyIGV0aFNpZ25lZE1lc3NhZ2VIYXNoID0gZ2V0RXRoU2lnbmVkTWVzc2FnZUhhc2gobWVzc2FnZUhhc2gpOwoKICAgICAgICByZXR1cm4gcmVjb3ZlclNpZ25lcihldGhTaWduZWRNZXNzYWdlSGFzaCwgc2lnbmF0dXJlKSA9PSBfc2lnbmVyOwogICAgfQoKICAgIGZ1bmN0aW9uIHJlY292ZXJTaWduZXIoYnl0ZXMzMiBfZXRoU2lnbmVkTWVzc2FnZUhhc2gsIGJ5dGVzIG1lbW9yeSBfc2lnbmF0dXJlKQogICAgICAgIHB1YmxpYwogICAgICAgIHB1cmUKICAgICAgICByZXR1cm5zIChhZGRyZXNzKQogICAgewogICAgICAgIChieXRlczMyIHIsIGJ5dGVzMzIgcywgdWludDggdikgPSBzcGxpdFNpZ25hdHVyZShfc2lnbmF0dXJlKTsKCiAgICAgICAgcmV0dXJuIGVjcmVjb3ZlcihfZXRoU2lnbmVkTWVzc2FnZUhhc2gsIHYsIHIsIHMpOwogICAgfQoKICAgIGZ1bmN0aW9uIHNwbGl0U2lnbmF0dXJlKGJ5dGVzIG1lbW9yeSBzaWcpCiAgICAgICAgcHVibGljCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKAogICAgICAgICAgICBieXRlczMyIHIsCiAgICAgICAgICAgIGJ5dGVzMzIgcywKICAgICAgICAgICAgdWludDggdgogICAgICAgICkKICAgIHsKICAgICAgICByZXF1aXJlKHNpZy5sZW5ndGggPT0gNjUsICJpbnZhbGlkIHNpZ25hdHVyZSBsZW5ndGgiKTsKCiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvKgogICAgICAgICAgICBPcyBwcmltZWlyb3MgMzIgYnl0ZXMgYXJtYXplbmEgbyBjb21wcmltZW50byBkYSBhc3NpbmF0dXJhCgogICAgICAgICAgICBhZGQoc2lnLCAzMikgPSBwb2ludGVyIG9mIHNpZyArIDMyCiAgICAgICAgICAgIGVmZXRpdmFtZW50ZSwgcHVsYSBvcyAzMiBwcmltZWlyb3MgYnl0ZXMgZGEgYXNzaW5hdHVyYQoKICAgICAgICAgICAgbWxvYWQocCkgY2FycmVnYSBvcyBwcsOzeGltb3MgMzIgYnl0ZXMgY29tZcOnYW5kbyBubyBlbmRlcmXDp28gZGUgbWVtw7NyaWEgcCBuYSBtZW3Ds3JpYQogICAgICAgICAgICAqLwoKICAgICAgICAgICAgLy8gcHJpbWVpcm9zIDMyIGJ5dGVzLCBkZXBvaXMgZG8gcHJlZml4byBkZSBjb21wcmltZW50bwogICAgICAgICAgICByIDo9IG1sb2FkKGFkZChzaWcsIDMyKSkKICAgICAgICAgICAgLy8gc2Vjb25kIDMyIGJ5dGVzCiAgICAgICAgICAgIHMgOj0gbWxvYWQoYWRkKHNpZywgNjQpKQogICAgICAgICAgICAvLyAgYnl0ZSBmaW5hbCAocHJpbWVpcm8gYnl0ZSBkb3MgcHLDs3hpbW9zIDMyIGJ5dGVzKQogICAgICAgICAgICB2IDo9IGJ5dGUoMCwgbWxvYWQoYWRkKHNpZywgOTYpKSkKICAgICAgICB9CgogICAgICAgIC8vIGltcGxpY2l0YW1lbnRlIHJldG9ybmEgKHIsIHMsIHYpCiAgICB9Cn0=)
