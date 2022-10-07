# Endereço de Contrato pré-computado com Create2

`Endereço de contrato pode ser pré-computado`, antes do contrato ser implantado usando `create2`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Factory {
    event Deployed(address addr, uint salt);

    // 1. Pega o código de bytes do contrato a ser implantado
    // NOTA: _owner e _foo são argumentos do constructor TestContract's
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. Computa o endereço do contrato a ser implantado
    // NOTA: _salt é um número aleatório usado para criar um endereço
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // NOTA: lança os últimos 20 bytes do hash para o endereço
        return address(uint160(uint(hash)));
    }

    // 3. Implanta o contrato
    // NOTA:
    // Verifica o evento log Deployed que contém o endereço do TestContract implantado.
    // O endereço no log deve ser equivalente ao endereço computado de cima.
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
                // O código real começa depois de saltar os primeiros 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Carrega o tamanho do código contido nos primeiros 32 bytes
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
