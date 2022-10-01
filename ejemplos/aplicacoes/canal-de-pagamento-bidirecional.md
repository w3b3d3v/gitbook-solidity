# Canal de Pagamento Bidirecional

Canais de pagamento bidirecional permite que os participantes `Alice` e `Bob`  transfiram Ether off chain repetidamente.&#x20;

Pagamentos podem ser feitos em ambas direções, `Alice` paga `Bob` e `Bob` paga `Alice`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

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

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/math/SafeMath.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.3/contracts/cryptography/ECDSA.sol";

contract BiDirectionalPaymentChannel {
    using SafeMath for uint;
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
            address(this).balance >= _balances[0].add(_balances[1]),
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
        // Nota: copia a matriz de armazenamento para a memória
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
        expiresAt = block.timestamp.add(challengePeriod);

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
