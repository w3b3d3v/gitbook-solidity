# Pre-computar la dirección del contrato con Create2

`La dirección del contrato puede ser pre-computado`, antes que el contrato sea desplegado, usando `create2`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Factory {
    event Deployed(address addr, uint salt);

    // 1. Obtén el bytecode del contrato que será desplegado
    // NOTA: _owner y _foo son argumentos del constructor TestContract
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. Computa la dirección del contrato que será desplegado
    // NOTA: _salt es un número al azar, usado para crear una dirección
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // NOTA: envía los últimos 20 bytes del hash a la dirección
        return address(uint160(uint(hash)));
    }

    // 3. Despliege del contrato
    // NOTA:
    // Revisa el log del evento Deployed, el cual contiene la dirección de TestContract que se desplegó.
    // La dirección del log debe ser igual a la dirección computada arriba.
    function deploy(bytes memory bytecode, uint _salt) public payable {
        address addr;

        /*
        NOTA: Como invocar create2

        create2(v, p, n, s)
        Crea un nuevo contrato con el código en memoria desde p hacia p + n
        Envía v wei
        Devuelve la nueva dirección
        Donde la nueva dirección = primeros 20 bytes de keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian valor 256-bit 
        */
        assembly {
            addr := create2(
                callvalue(), // wei enviado por la invocación actual 
                // El código actual comienza luego de saltarse los primeros 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Carga el tamaño del código contenido en los primeros 32 bytes
                _salt // Salt de los argumentos de función
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
