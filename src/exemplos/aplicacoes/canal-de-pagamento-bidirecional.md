# Canal de Pagamento Bidirecional

Canais de pagamento bidirecional permite que os participantes `Alice` e `Bob` transfiram Ether off chain repetidamente.

Pagamentos podem ser feitos em ambas direções, `Alice` paga `Bob` e `Bob` paga `Alice`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Abrindo um canal
1. Alice e Bob depositam em uma carteira multi-sig
2. Endereço de canal de pagamento é pré-computado
3. Alice e Bob trocam assinaturas dos balanços iniciais
4. Alice e Bob criam uma transação que pode implementar um canal de pagamento da
carteira multi-sig
Atualizar saldos do canal
1. Repete os passos 1 - 3 da abertura do canal
2. Da carteira multi-sig cria uma transação que vai
   - apagar a transação que teria implementado o canal de pagamento antigo
   - e depois cria a transação que pode implementar um canal de pagamento
     com novos balanços

Fechando um canal quando Alice e Bob concordam com o saldo final
1. Da carteira multi-sig cria uma transação que vai
   - enviar pagamentos para Alice e Bob
   - e depois apagar a transação que teria criado o canal de pagamento

Fechando um canal quando Alice e Bob não concordam com os saldos finais
1. Implementa canal de pagamento da multi-sig
2. chama challengeExit()para iniciar o processo de fechamento do canal
3. Alice e Bob podem retirar fundos uma vez que o canal é extinto
*/

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/cryptography/ECDSA.sol";

contract BiDirectionalPaymentChannel {
    using ECDSA for bytes32;

    event ChallengeExit(address indexed sender, uint nonce);
    event Withdraw(address indexed to, uint amount);

    address payable[2] public users;
    mapping(address => bool) public isUser;

    mapping(address => uint) public balances;

    uint public challengePeriod;
    uint public expiresAt;
    uint public nonce;

    modifier checkBalances(uint[2] memory _balances) {
        require(
            address(this).balance >= _balances[0] + _balances[1],
            "balance of contract must be >= to the total balance of users"
        );
        _;
    }

    // NOTA: depositar de uma carteira multi-sig
    constructor(
        address payable[2] memory _users,
        uint[2] memory _balances,
        uint _expiresAt,
        uint _challengePeriod
    ) payable checkBalances(_balances) {
        require(_expiresAt > block.timestamp, "Expiration must be > now");
        require(_challengePeriod > 0, "Challenge period must be > 0");

        for (uint i = 0; i < _users.length; i++) {
            address payable user = _users[i];

            require(!isUser[user], "user must be unique");
            users[i] = user;
            isUser[user] = true;

            balances[user] = _balances[i];
        }

        expiresAt = _expiresAt;
        challengePeriod = _challengePeriod;
    }

    function verify(
        bytes[2] memory _signatures,
        address _contract,
        address[2] memory _signers,
        uint[2] memory _balances,
        uint _nonce
    ) public pure returns (bool) {
        for (uint i = 0; i < _signatures.length; i++) {
            /*
            NOTA: assina com endereço desse contrato para proteger
                  contra ataque de repetição em outros contratos
            */
            bool valid = _signers[i] ==
                keccak256(abi.encodePacked(_contract, _balances, _nonce))
                .toEthSignedMessageHash()
                .recover(_signatures[i]);

            if (!valid) {
                return false;
            }
        }

        return true;
    }

    modifier checkSignatures(
        bytes[2] memory _signatures,
        uint[2] memory _balances,
        uint _nonce
    ) {
        // Note: copy storage array to memory
        address[2] memory signers;
        for (uint i = 0; i < users.length; i++) {
            signers[i] = users[i];
        }

        require(
            verify(_signatures, address(this), signers, _balances, _nonce),
            "Invalid signature"
        );

        _;
    }

    modifier onlyUser() {
        require(isUser[msg.sender], "Not user");
        _;
    }

    function challengeExit(
        uint[2] memory _balances,
        uint _nonce,
        bytes[2] memory _signatures
    )
        public
        onlyUser
        checkSignatures(_signatures, _balances, _nonce)
        checkBalances(_balances)
    {
        require(block.timestamp < expiresAt, "Expired challenge period");
        require(_nonce > nonce, "Nonce must be greater than the current nonce");

        for (uint i = 0; i < _balances.length; i++) {
            balances[users[i]] = _balances[i];
        }

        nonce = _nonce;
        expiresAt = block.timestamp + challengePeriod;

        emit ChallengeExit(msg.sender, nonce);
    }

    function withdraw() public onlyUser {
        require(block.timestamp >= expiresAt, "Challenge period has not expired yet");

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(msg.sender, amount);
    }
}
```

## Teste no Remix

-[BiDirectionalPaymentChannel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkFicmluZG8gdW0gY2FuYWwKMS4gQWxpY2UgZSBCb2IgZGVwb3NpdGFtIGVtIHVtYSBjYXJ0ZWlyYSBtdWx0aS1zaWcKMi4gRW5kZXJlY28gZGUgY2FuYWwgZGUgcGFnYW1lbnRvIGUgcHJlLWNvbXB1dGFkbwozLiBBbGljZSBlIEJvYiB0cm9jYW0gYXNzaW5hdHVyYXMgZG9zIGJhbGFuY29zIGluaWNpYWlzCjQuIEFsaWNlIGUgQm9iIGNyaWFtIHVtYSB0cmFuc2FjYW8gcXVlIHBvZGUgaW1wbGVtZW50YXIgdW0gY2FuYWwgZGUgcGFnYW1lbnRvIGRhCmNhcnRlaXJhIG11bHRpLXNpZwpBdHVhbGl6YXIgc2FsZG9zIGRvIGNhbmFsCjEuIFJlcGV0ZSBvcyBwYXNzb3MgMSAtIDMgZGEgYWJlcnR1cmEgZG8gY2FuYWwKMi4gRGEgY2FydGVpcmEgbXVsdGktc2lnIGNyaWEgdW1hIHRyYW5zYWNhbyBxdWUgdmFpCiAgIC0gYXBhZ2FyIGEgdHJhbnNhY2FvIHF1ZSB0ZXJpYSBpbXBsZW1lbnRhZG8gbyBjYW5hbCBkZSBwYWdhbWVudG8gYW50aWdvCiAgIC0gZSBkZXBvaXMgY3JpYSBhIHRyYW5zYWNhbyBxdWUgcG9kZSBpbXBsZW1lbnRhciB1bSBjYW5hbCBkZSBwYWdhbWVudG8gCiAgICAgY29tIG5vdm9zIGJhbGFuY29zCgpGZWNoYW5kbyB1bSBjYW5hbCBxdWFuZG8gQWxpY2UgZSBCb2IgY29uY29yZGFtIGNvbSBvIHNhbGRvIGZpbmFsCjEuIERhIGNhcnRlaXJhIG11bHRpLXNpZyBjcmlhIHVtYSB0cmFuc2FjYW8gcXVlIHZhaQogICAtIGVudmlhciBwYWdhbWVudG9zIHBhcmEgQWxpY2UgZSBCb2IKICAgLSBlIGRlcG9pcyBhcGFnYXIgYSB0cmFuc2FjYW8gcXVlIHRlcmlhIGNyaWFkbyBvIGNhbmFsIGRlIHBhZ2FtZW50bwoKRmVjaGFuZG8gdW0gY2FuYWwgcXVhbmRvIEFsaWNlIGUgQm9iIG5hbyBjb25jb3JkYW0gY29tIG9zIHNhbGRvcyBmaW5haXMKMS4gSW1wbGVtZW50YSBjYW5hbCBkZSBwYWdhbWVudG8gZGEgbXVsdGktc2lnCjIuIGNoYW1hIGNoYWxsZW5nZUV4aXQoKXBhcmEgaW5pY2lhciBvIHByb2Nlc3NvIGRlIGZlY2hhbWVudG8gZG8gY2FuYWwKMy4gQWxpY2UgZSBCb2IgcG9kZW0gcmV0aXJhciBmdW5kb3MgdW1hIHZleiBxdWUgbyBjYW5hbCBlIGV4dGludG8KKi8KCmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvdXRpbHMvY3J5cHRvZ3JhcGh5L0VDRFNBLnNvbCI7Cgpjb250cmFjdCBCaURpcmVjdGlvbmFsUGF5bWVudENoYW5uZWwgewogICAgdXNpbmcgRUNEU0EgZm9yIGJ5dGVzMzI7CgogICAgZXZlbnQgQ2hhbGxlbmdlRXhpdChhZGRyZXNzIGluZGV4ZWQgc2VuZGVyLCB1aW50IG5vbmNlKTsKICAgIGV2ZW50IFdpdGhkcmF3KGFkZHJlc3MgaW5kZXhlZCB0bywgdWludCBhbW91bnQpOwoKICAgIGFkZHJlc3MgcGF5YWJsZVsyXSBwdWJsaWMgdXNlcnM7CiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gYm9vbCkgcHVibGljIGlzVXNlcjsKCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludCkgcHVibGljIGJhbGFuY2VzOwoKICAgIHVpbnQgcHVibGljIGNoYWxsZW5nZVBlcmlvZDsKICAgIHVpbnQgcHVibGljIGV4cGlyZXNBdDsKICAgIHVpbnQgcHVibGljIG5vbmNlOwoKICAgIG1vZGlmaWVyIGNoZWNrQmFsYW5jZXModWludFsyXSBtZW1vcnkgX2JhbGFuY2VzKSB7CiAgICAgICAgcmVxdWlyZSgKICAgICAgICAgICAgYWRkcmVzcyh0aGlzKS5iYWxhbmNlID49IF9iYWxhbmNlc1swXSArIF9iYWxhbmNlc1sxXSwKICAgICAgICAgICAgImJhbGFuY2Ugb2YgY29udHJhY3QgbXVzdCBiZSA+PSB0byB0aGUgdG90YWwgYmFsYW5jZSBvZiB1c2VycyIKICAgICAgICApOwogICAgICAgIF87CiAgICB9CgogICAgLy8gTk9UQTogZGVwb3NpdGFyIGRlIHVtYSBjYXJ0ZWlyYSBtdWx0aS1zaWcKICAgIGNvbnN0cnVjdG9yKAogICAgICAgIGFkZHJlc3MgcGF5YWJsZVsyXSBtZW1vcnkgX3VzZXJzLAogICAgICAgIHVpbnRbMl0gbWVtb3J5IF9iYWxhbmNlcywKICAgICAgICB1aW50IF9leHBpcmVzQXQsCiAgICAgICAgdWludCBfY2hhbGxlbmdlUGVyaW9kCiAgICApIHBheWFibGUgY2hlY2tCYWxhbmNlcyhfYmFsYW5jZXMpIHsKICAgICAgICByZXF1aXJlKF9leHBpcmVzQXQgPiBibG9jay50aW1lc3RhbXAsICJFeHBpcmF0aW9uIG11c3QgYmUgPiBub3ciKTsKICAgICAgICByZXF1aXJlKF9jaGFsbGVuZ2VQZXJpb2QgPiAwLCAiQ2hhbGxlbmdlIHBlcmlvZCBtdXN0IGJlID4gMCIpOwoKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBfdXNlcnMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgYWRkcmVzcyBwYXlhYmxlIHVzZXIgPSBfdXNlcnNbaV07CgogICAgICAgICAgICByZXF1aXJlKCFpc1VzZXJbdXNlcl0sICJ1c2VyIG11c3QgYmUgdW5pcXVlIik7CiAgICAgICAgICAgIHVzZXJzW2ldID0gdXNlcjsKICAgICAgICAgICAgaXNVc2VyW3VzZXJdID0gdHJ1ZTsKCiAgICAgICAgICAgIGJhbGFuY2VzW3VzZXJdID0gX2JhbGFuY2VzW2ldOwogICAgICAgIH0KCiAgICAgICAgZXhwaXJlc0F0ID0gX2V4cGlyZXNBdDsKICAgICAgICBjaGFsbGVuZ2VQZXJpb2QgPSBfY2hhbGxlbmdlUGVyaW9kOwogICAgfQoKICAgIGZ1bmN0aW9uIHZlcmlmeSgKICAgICAgICBieXRlc1syXSBtZW1vcnkgX3NpZ25hdHVyZXMsCiAgICAgICAgYWRkcmVzcyBfY29udHJhY3QsCiAgICAgICAgYWRkcmVzc1syXSBtZW1vcnkgX3NpZ25lcnMsCiAgICAgICAgdWludFsyXSBtZW1vcnkgX2JhbGFuY2VzLAogICAgICAgIHVpbnQgX25vbmNlCiAgICApIHB1YmxpYyBwdXJlIHJldHVybnMgKGJvb2wpIHsKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBfc2lnbmF0dXJlcy5sZW5ndGg7IGkrKykgewogICAgICAgICAgICAvKgogICAgICAgICAgICBOT1RBOiBhc3NpbmEgY29tIGVuZGVyZWNvIGRlc3NlIGNvbnRyYXRvIHBhcmEgcHJvdGVnZXIKICAgICAgICAgICAgICAgICAgY29udHJhIGF0YXF1ZSBkZSByZXBldGljYW8gZW0gb3V0cm9zIGNvbnRyYXRvcwogICAgICAgICAgICAqLwogICAgICAgICAgICBib29sIHZhbGlkID0gX3NpZ25lcnNbaV0gPT0KICAgICAgICAgICAgICAgIGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKF9jb250cmFjdCwgX2JhbGFuY2VzLCBfbm9uY2UpKQogICAgICAgICAgICAgICAgLnRvRXRoU2lnbmVkTWVzc2FnZUhhc2goKQogICAgICAgICAgICAgICAgLnJlY292ZXIoX3NpZ25hdHVyZXNbaV0pOwoKICAgICAgICAgICAgaWYgKCF2YWxpZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBtb2RpZmllciBjaGVja1NpZ25hdHVyZXMoCiAgICAgICAgYnl0ZXNbMl0gbWVtb3J5IF9zaWduYXR1cmVzLAogICAgICAgIHVpbnRbMl0gbWVtb3J5IF9iYWxhbmNlcywKICAgICAgICB1aW50IF9ub25jZQogICAgKSB7CiAgICAgICAgLy8gTm90ZTogY29weSBzdG9yYWdlIGFycmF5IHRvIG1lbW9yeQogICAgICAgIGFkZHJlc3NbMl0gbWVtb3J5IHNpZ25lcnM7CiAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgc2lnbmVyc1tpXSA9IHVzZXJzW2ldOwogICAgICAgIH0KCiAgICAgICAgcmVxdWlyZSgKICAgICAgICAgICAgdmVyaWZ5KF9zaWduYXR1cmVzLCBhZGRyZXNzKHRoaXMpLCBzaWduZXJzLCBfYmFsYW5jZXMsIF9ub25jZSksCiAgICAgICAgICAgICJJbnZhbGlkIHNpZ25hdHVyZSIKICAgICAgICApOwoKICAgICAgICBfOwogICAgfQoKICAgIG1vZGlmaWVyIG9ubHlVc2VyKCkgewogICAgICAgIHJlcXVpcmUoaXNVc2VyW21zZy5zZW5kZXJdLCAiTm90IHVzZXIiKTsKICAgICAgICBfOwogICAgfQoKICAgIGZ1bmN0aW9uIGNoYWxsZW5nZUV4aXQoCiAgICAgICAgdWludFsyXSBtZW1vcnkgX2JhbGFuY2VzLAogICAgICAgIHVpbnQgX25vbmNlLAogICAgICAgIGJ5dGVzWzJdIG1lbW9yeSBfc2lnbmF0dXJlcwogICAgKQogICAgICAgIHB1YmxpYwogICAgICAgIG9ubHlVc2VyCiAgICAgICAgY2hlY2tTaWduYXR1cmVzKF9zaWduYXR1cmVzLCBfYmFsYW5jZXMsIF9ub25jZSkKICAgICAgICBjaGVja0JhbGFuY2VzKF9iYWxhbmNlcykKICAgIHsKICAgICAgICByZXF1aXJlKGJsb2NrLnRpbWVzdGFtcCA8IGV4cGlyZXNBdCwgIkV4cGlyZWQgY2hhbGxlbmdlIHBlcmlvZCIpOwogICAgICAgIHJlcXVpcmUoX25vbmNlID4gbm9uY2UsICJOb25jZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB0aGUgY3VycmVudCBub25jZSIpOwoKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBfYmFsYW5jZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgYmFsYW5jZXNbdXNlcnNbaV1dID0gX2JhbGFuY2VzW2ldOwogICAgICAgIH0KCiAgICAgICAgbm9uY2UgPSBfbm9uY2U7CiAgICAgICAgZXhwaXJlc0F0ID0gYmxvY2sudGltZXN0YW1wICsgY2hhbGxlbmdlUGVyaW9kOwoKICAgICAgICBlbWl0IENoYWxsZW5nZUV4aXQobXNnLnNlbmRlciwgbm9uY2UpOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KCkgcHVibGljIG9ubHlVc2VyIHsKICAgICAgICByZXF1aXJlKGJsb2NrLnRpbWVzdGFtcCA+PSBleHBpcmVzQXQsICJDaGFsbGVuZ2UgcGVyaW9kIGhhcyBub3QgZXhwaXJlZCB5ZXQiKTsKCiAgICAgICAgdWludCBhbW91bnQgPSBiYWxhbmNlc1ttc2cuc2VuZGVyXTsKICAgICAgICBiYWxhbmNlc1ttc2cuc2VuZGVyXSA9IDA7CgogICAgICAgIChib29sIHNlbnQsICkgPSBtc2cuc2VuZGVyLmNhbGx7dmFsdWU6IGFtb3VudH0oIiIpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CgogICAgICAgIGVtaXQgV2l0aGRyYXcobXNnLnNlbmRlciwgYW1vdW50KTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
