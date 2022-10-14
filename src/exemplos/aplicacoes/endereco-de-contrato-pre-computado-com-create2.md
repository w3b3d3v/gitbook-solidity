# Endereço de Contrato pré-computado com Create2

O endereço do contrato pode ser pré-calculado, antes que o contrato seja implantado, usando `create2`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Factory {
    // Retorna o endereço do contrato recém-implantado
    function deploy(
        address _owner,
        uint _foo,
        bytes32 _salt
    ) public payable returns (address) {
        // Esta sintaxe é uma nova maneira de invocar create2 sem assembly, você só precisa passar salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new TestContract{salt: _salt}(_owner, _foo));
    }
}

// Esta é a maneira mais antiga de fazer isso usando assembly
contract FactoryAssembly {
    event Deployed(address addr, uint salt);

    // 1. Obtenha o bytecode do contrato a ser implantado
    // NOTA: _owner e _foo são argumentos do constructor TestContract
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. Calcular o endereço do contrato a ser implantado
    // NOTA: _salt é um número aleatório usado para criar um endereço
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // NOTA: converta os últimos 20 bytes de hash para o endereço
        return address(uint160(uint(hash)));
    }

    // 3. Implanta o contrato
    // NOTA:
    // Verifique o log de eventos Deployed que contém o endereço do TestContract implantado.
    // O endereço no log deve ser igual ao endereço calculado acima.
    function deploy(bytes memory bytecode, uint _salt) public payable {
        address addr;

        /*
        NOTA: Como criar create2

        create2(v, p, n, s)
        cria um novo contrato com código na memória p para p + n
        e envia v wei
        e retorna o novo endereço
        onde novo endereço = primeiros 20 bytes de keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = valor big-endian 256-bit
        */
        assembly {
            addr := create2(
                callvalue(), // wei enviado com a chamada atual
                //O código real começa após pular os primeiros 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Carregar o tamanho do código contido nos primeiros 32 bytes
                _salt // Salt dos argumentos de função
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deployed(addr, _salt);
    }
}

contract TestContract {
    address public owner;
    uint public foo;

    constructor(address _owner, uint _foo) payable {
        owner = _owner;
        foo = _foo;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

## Teste no Remix

- [Create2.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEZhY3RvcnkgewogICAgLy8gUmV0b3JuYSBvIGVuZGVyZWNvIGRvIGNvbnRyYXRvIHJlY2VtLWltcGxhbnRhZG8KICAgIGZ1bmN0aW9uIGRlcGxveSgKICAgICAgICBhZGRyZXNzIF9vd25lciwKICAgICAgICB1aW50IF9mb28sCiAgICAgICAgYnl0ZXMzMiBfc2FsdAogICAgKSBwdWJsaWMgcGF5YWJsZSByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgLy8gRXN0YSBzaW50YXhlIGUgdW1hIG5vdmEgbWFuZWlyYSBkZSBpbnZvY2FyIGNyZWF0ZTIgc2VtIGFzc2VtYmx5LCB2b2NlIHNvIHByZWNpc2EgcGFzc2FyIHNhbHQKICAgICAgICAvLyBodHRwczovL2RvY3Muc29saWRpdHlsYW5nLm9yZy9lbi9sYXRlc3QvY29udHJvbC1zdHJ1Y3R1cmVzLmh0bWwjc2FsdGVkLWNvbnRyYWN0LWNyZWF0aW9ucy1jcmVhdGUyCiAgICAgICAgcmV0dXJuIGFkZHJlc3MobmV3IFRlc3RDb250cmFjdHtzYWx0OiBfc2FsdH0oX293bmVyLCBfZm9vKSk7CiAgICB9Cn0KCi8vIEVzdGEgZSBhIG1hbmVpcmEgbWFpcyBhbnRpZ2EgZGUgZmF6ZXIgaXNzbyB1c2FuZG8gYXNzZW1ibHkKY29udHJhY3QgRmFjdG9yeUFzc2VtYmx5IHsKICAgIGV2ZW50IERlcGxveWVkKGFkZHJlc3MgYWRkciwgdWludCBzYWx0KTsKCiAgICAvLyAxLiBPYnRlbmhhIG8gYnl0ZWNvZGUgZG8gY29udHJhdG8gYSBzZXIgaW1wbGFudGFkbyAKICAgIC8vIE5PVEE6IF9vd25lciBlIF9mb28gc2FvIGFyZ3VtZW50b3MgZG8gY29uc3RydWN0b3IgVGVzdENvbnRyYWN0CiAgICBmdW5jdGlvbiBnZXRCeXRlY29kZShhZGRyZXNzIF9vd25lciwgdWludCBfZm9vKSBwdWJsaWMgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICBieXRlcyBtZW1vcnkgYnl0ZWNvZGUgPSB0eXBlKFRlc3RDb250cmFjdCkuY3JlYXRpb25Db2RlOwoKICAgICAgICByZXR1cm4gYWJpLmVuY29kZVBhY2tlZChieXRlY29kZSwgYWJpLmVuY29kZShfb3duZXIsIF9mb28pKTsKICAgIH0KCiAgICAvLyAyLiBDYWxjdWxhciBvIGVuZGVyZWNvIGRvIGNvbnRyYXRvIGEgc2VyIGltcGxhbnRhZG8KICAgIC8vIE5PVEE6IF9zYWx0IGUgdW0gbnVtZXJvIGFsZWF0b3JpbyB1c2FkbyBwYXJhIGNyaWFyIHVtIGVuZGVyZWNvCiAgICBmdW5jdGlvbiBnZXRBZGRyZXNzKGJ5dGVzIG1lbW9yeSBieXRlY29kZSwgdWludCBfc2FsdCkKICAgICAgICBwdWJsaWMKICAgICAgICB2aWV3CiAgICAgICAgcmV0dXJucyAoYWRkcmVzcykKICAgIHsKICAgICAgICBieXRlczMyIGhhc2ggPSBrZWNjYWsyNTYoCiAgICAgICAgICAgIGFiaS5lbmNvZGVQYWNrZWQoYnl0ZXMxKDB4ZmYpLCBhZGRyZXNzKHRoaXMpLCBfc2FsdCwga2VjY2FrMjU2KGJ5dGVjb2RlKSkKICAgICAgICApOwoKICAgICAgICAvLyBOT1RBOiBjb252ZXJ0YSBvcyB1bHRpbW9zIDIwIGJ5dGVzIGRlIGhhc2ggcGFyYSBvIGVuZGVyZWNvCiAgICAgICAgcmV0dXJuIGFkZHJlc3ModWludDE2MCh1aW50KGhhc2gpKSk7CiAgICB9CgogICAgLy8gMy4gSW1wbGFudGEgbyBjb250cmF0bwogICAgLy8gTk9UQToKICAgIC8vIFZlcmlmaXF1ZSBvIGxvZyBkZSBldmVudG9zIERlcGxveWVkIHF1ZSBjb250ZW0gbyBlbmRlcmVjbyBkbyBUZXN0Q29udHJhY3QgaW1wbGFudGFkby4KICAgIC8vIE8gZW5kZXJlY28gbm8gbG9nIGRldmUgc2VyIGlndWFsIGFvIGVuZGVyZWNvIGNhbGN1bGFkbyBhY2ltYS4KICAgIGZ1bmN0aW9uIGRlcGxveShieXRlcyBtZW1vcnkgYnl0ZWNvZGUsIHVpbnQgX3NhbHQpIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICBhZGRyZXNzIGFkZHI7CgogICAgICAgIC8qCiAgICAgICAgTk9UQTogQ29tbyBjcmlhciBjcmVhdGUyCgogICAgICAgIGNyZWF0ZTIodiwgcCwgbiwgcykKICAgICAgICBjcmlhIHVtIG5vdm8gY29udHJhdG8gY29tIGNvZGlnbyBuYSBtZW1vcmlhIHAgcGFyYSBwICsgbgogICAgICAgIGUgZW52aWEgdiB3ZWkKICAgICAgICBlIHJldG9ybmEgbyBub3ZvIGVuZGVyZWNvCiAgICAgICAgb25kZSBub3ZvIGVuZGVyZWNvID0gcHJpbWVpcm9zIDIwIGJ5dGVzIGRlIGtlY2NhazI1NigweGZmICsgYWRkcmVzcyh0aGlzKSArIHMgKyBrZWNjYWsyNTYobWVtW3A/KHArbikpKQogICAgICAgICAgICAgIHMgPSB2YWxvciBiaWctZW5kaWFuIDI1Ni1iaXQKICAgICAgICAqLwogICAgICAgIGFzc2VtYmx5IHsKICAgICAgICAgICAgYWRkciA6PSBjcmVhdGUyKAogICAgICAgICAgICAgICAgY2FsbHZhbHVlKCksIC8vIHdlaSBlbnZpYWRvIGNvbSBhIGNoYW1hZGEgYXR1YWwKICAgICAgICAgICAgICAgIC8vTyBjb2RpZ28gcmVhbCBjb21lY2EgYXBvcyBwdWxhciBvcyBwcmltZWlyb3MgMzIgYnl0ZXMKICAgICAgICAgICAgICAgIGFkZChieXRlY29kZSwgMHgyMCksCiAgICAgICAgICAgICAgICBtbG9hZChieXRlY29kZSksIC8vIENhcnJlZ2FyIG8gdGFtYW5obyBkbyBjb2RpZ28gY29udGlkbyBub3MgcHJpbWVpcm9zIDMyIGJ5dGVzCiAgICAgICAgICAgICAgICBfc2FsdCAvLyBTYWx0IGRvcyBhcmd1bWVudG9zIGRlIGZ1bmNhbwogICAgICAgICAgICApCgogICAgICAgICAgICBpZiBpc3plcm8oZXh0Y29kZXNpemUoYWRkcikpIHsKICAgICAgICAgICAgICAgIHJldmVydCgwLCAwKQogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBlbWl0IERlcGxveWVkKGFkZHIsIF9zYWx0KTsKICAgIH0KfQoKY29udHJhY3QgVGVzdENvbnRyYWN0IHsKICAgIGFkZHJlc3MgcHVibGljIG93bmVyOwogICAgdWludCBwdWJsaWMgZm9vOwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX293bmVyLCB1aW50IF9mb28pIHBheWFibGUgewogICAgICAgIG93bmVyID0gX293bmVyOwogICAgICAgIGZvbyA9IF9mb287CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gYWRkcmVzcyh0aGlzKS5iYWxhbmNlOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
