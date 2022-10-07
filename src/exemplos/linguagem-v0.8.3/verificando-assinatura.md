# Verificando Assinatura

Mensagens podem ser assinadas fora da rede e depois verificadas na rede usando contrato inteligente.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/* Verificação da assinatura

Como assinar e verificar
# Assinando
1. Cria uma mensagem para assinar
2. Cria um hash da mensagem
3. Assina o hash (fora da rede, mantenha sua chave privada em segredo)

# Verifique
1. Recria um hash da mensagem original
2. Recupera o signatário da assinatura e do hash
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

    /* 3. Assina mensagem hash
    # usando browser
    account = "copy paste account of signer here"
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

    /* 4. Verifica a assinatura
    signatário = 0xB273216C05A8c0D4F0a4Dd0d7Bae1D2EfFE636dd
    para = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C
    quantia = 123
    mensagem = "coffee and donuts"
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
            32 primeiros bytes armazena o comprimento da assinatura

            add(sig, 32) = pointer of sig + 32
            efetivamente, pula os 32 primeiros bytes da assinatura

            mload(p) carrega os próximos 32 bytes começando no endereço de memória p na memória
            */

            // primeiros bytes 32 bytes, depois do prefixo de comprimento
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
