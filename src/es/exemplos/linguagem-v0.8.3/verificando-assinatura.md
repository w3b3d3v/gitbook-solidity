# Verificación de firma

Los mensajes pueden ser firmados off chain y luego ser verificados on chain usando un contrato inteligente.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/* Verificación de firma

Cómo firmar y verificar
# Firmando
1. Crea un mensaje a firmar
2. Crea el hash del mensaje
3. Firma el hash (off chain, mantén secreta tu llave privada)

# Verifica
1. Recrea el hash del mensaje original
2. Recupera el firmante de la firma y del hash
3. Compara la firma recuperada con el firmante solicitado
*/

contract VerifySignature {
    /* 1. Desbloquea la cuenta MetaMask
    ethereum.enable()
    */

    /* 2. Obtiene el hash del mensaje a firmar
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

    /* 3. Firma el hash del mensaje
    # usando browser
    account = "copy paste account of signer here"
    ethereum.request({ method: "personal_sign", params: [account, hash]}).then(console.log)

    # usando web3
    web3.personal.sign(hash, web3.eth.defaultAccount, console.log)

    La firma será diferente para cuentas diferentes
    0x993dab3dd91f5c6dc28e17439be475478f5635c92a56e17e82349d3fb2f166196f466c0b4e0c146f285204f0dcb13e5ae67bc33f4b888ec32dfe0a063e8f3f781b
    */
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        La firma se produce firmando un hash keccak256 con el siguiente formato:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    /* 4. Verifica la firma
    signer = 0xB273216C05A8c0D4F0a4Dd0d7Bae1D2EfFE636dd
    to = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C
    amount = 123
    message = "coffee and donuts"
    nonce = 1
    signature =
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
            Los primeros 32 bytes almacenan la longitud de la firma
    
            add(sig, 32) = pointer of sig + 32
            efectivamente, salta los primeros bytesde la firma
    
            mload(p) carga los próximos 32 bytes comenzando por la dirección de la dirección p dentro de la memoria
            */

            // primeros 32 bytes, después del prefijo de la longitud
            r := mload(add(sig, 32))
            // segundos 32 bytes
            s := mload(add(sig, 64))
            // byte final (el primer byte de los próximos 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implícitamente retorna (r, s, v)
    }
}
```
