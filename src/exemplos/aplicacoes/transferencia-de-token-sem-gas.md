# Transferência de token sem gás

Transferência de tokens ERC20 sem gás com transação Meta

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Permit {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract GaslessTokenTransfer {
    function send(
        address token,
        address sender,
        address receiver,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        // Assinatura da autorização
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // Autorização
        IERC20Permit(token).permit(
            sender,
            address(this),
            amount + fee,
            deadline,
            v,
            r,
            s
        );
        // Enviar o valor ao destinatário
        IERC20Permit(token).transferFrom(sender, receiver, amount);
        // Aceitar taxa - enviar taxa para msg.sender
        IERC20Permit(token).transferFrom(sender, msg.sender, fee);
    }
}
```

Exemplo de `ERC20` que implementa a autorização copiada do solmate

```solidity
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// @notice Modern and gas efficient ERC20 + EIP-2612 implementation.
/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol)
/// @author Modified from Uniswap (https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2ERC20.sol)
/// @dev Do not manually set balances without updating totalSupply, as the sum of all user balances must not exceed it.
abstract contract ERC20 {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event Approval(address indexed owner, address indexed spender, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                            METADATA STORAGE
    //////////////////////////////////////////////////////////////*/

    string public name;

    string public symbol;

    uint8 public immutable decimals;

    /*//////////////////////////////////////////////////////////////
                              ERC20 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    /*//////////////////////////////////////////////////////////////
                            EIP-2612 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    mapping(address => uint256) public nonces;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
    }

    /*//////////////////////////////////////////////////////////////
                               ERC20 LOGIC
    //////////////////////////////////////////////////////////////*/

    function approve(address spender, uint256 amount) public virtual returns (bool) {
        allowance[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function transfer(address to, uint256 amount) public virtual returns (bool) {
        balanceOf[msg.sender] -= amount;

        // Não pode ultrapassar o limite porque a soma de todos os usuários
        // Não pode exceder o valor máximo de uint256.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        uint256 allowed = allowance[from][msg.sender]; // Poupa gás para aprovações limitadas.

        if (allowed != type(uint256).max)
            allowance[from][msg.sender] = allowed - amount;

        balanceOf[from] -= amount;

       // Não pode ultrapassar o limite porque a soma de todos os usuários
       // Não pode exceder o valor máximo de uint256.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(from, to, amount);

        return true;
    }

    /*//////////////////////////////////////////////////////////////
                             EIP-2612 LOGIC
    //////////////////////////////////////////////////////////////*/

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        require(deadline >= block.timestamp, "PERMIT_DEADLINE_EXPIRED");

        // Unchecked because the only math done is incrementing
        // the owner's nonce which cannot realistically overflow.

        // Não verificado porque a única matemática feita é o incremento do
        // o nonce do proprietário, que não pode realisticamente ultrapassar.
        unchecked {
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                keccak256(
                                    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
                                ),
                                owner,
                                spender,
                                value,
                                nonces[owner]++,
                                deadline
                            )
                        )
                    )
                ),
                v,
                r,
                s
            );

            require(
                recoveredAddress != address(0) && recoveredAddress == owner,
                "INVALID_SIGNER"
            );

            allowance[recoveredAddress][spender] = value;
        }

        emit Approval(owner, spender, value);
    }

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return
            block.chainid == INITIAL_CHAIN_ID
                ? INITIAL_DOMAIN_SEPARATOR
                : computeDomainSeparator();
    }

    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256(
                        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                    ),
                    keccak256(bytes(name)),
                    keccak256("1"),
                    block.chainid,
                    address(this)
                )
            );
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/

    function _mint(address to, uint256 amount) internal virtual {
        totalSupply += amount;

        // Não pode ultrapassar o limite porque a soma de todos os usuários
        // Não pode exceder o valor máximo de uint256.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual {
        balanceOf[from] -= amount;

        // Cannot underflow because a user's balance
        // will never be larger than the total supply.

        // Não é possível underflow porque o saldo do usuário
        // nunca será maior do que o suprimento total.
        unchecked {
            totalSupply -= amount;
        }

        emit Transfer(from, address(0), amount);
    }
}

contract ERC20Permit is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) ERC20(_name, _symbol, _decimals) {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

## Teste no Remix

- [ERC20Permit.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmludGVyZmFjZSBJRVJDMjBQZXJtaXQgewogICAgZnVuY3Rpb24gdG90YWxTdXBwbHkoKSBleHRlcm5hbCB2aWV3IHJldHVybnMgKHVpbnQyNTYpOwoKICAgIGZ1bmN0aW9uIGJhbGFuY2VPZihhZGRyZXNzIGFjY291bnQpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludDI1Nik7CgogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcyByZWNpcGllbnQsIHVpbnQyNTYgYW1vdW50KSBleHRlcm5hbCByZXR1cm5zIChib29sKTsKCiAgICBmdW5jdGlvbiBhbGxvd2FuY2UoYWRkcmVzcyBvd25lciwgYWRkcmVzcyBzcGVuZGVyKSBleHRlcm5hbCB2aWV3IHJldHVybnMgKHVpbnQyNTYpOwoKICAgIGZ1bmN0aW9uIGFwcHJvdmUoYWRkcmVzcyBzcGVuZGVyLCB1aW50MjU2IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CgogICAgZnVuY3Rpb24gdHJhbnNmZXJGcm9tKAogICAgICAgIGFkZHJlc3Mgc2VuZGVyLAogICAgICAgIGFkZHJlc3MgcmVjaXBpZW50LAogICAgICAgIHVpbnQyNTYgYW1vdW50CiAgICApIGV4dGVybmFsIHJldHVybnMgKGJvb2wpOwoKICAgIGZ1bmN0aW9uIHBlcm1pdCgKICAgICAgICBhZGRyZXNzIG93bmVyLAogICAgICAgIGFkZHJlc3Mgc3BlbmRlciwKICAgICAgICB1aW50MjU2IHZhbHVlLAogICAgICAgIHVpbnQyNTYgZGVhZGxpbmUsCiAgICAgICAgdWludDggdiwKICAgICAgICBieXRlczMyIHIsCiAgICAgICAgYnl0ZXMzMiBzCiAgICApIGV4dGVybmFsOwoKICAgIGV2ZW50IFRyYW5zZmVyKGFkZHJlc3MgaW5kZXhlZCBmcm9tLCBhZGRyZXNzIGluZGV4ZWQgdG8sIHVpbnQyNTYgdmFsdWUpOwogICAgZXZlbnQgQXBwcm92YWwoYWRkcmVzcyBpbmRleGVkIG93bmVyLCBhZGRyZXNzIGluZGV4ZWQgc3BlbmRlciwgdWludDI1NiB2YWx1ZSk7Cn0KCmNvbnRyYWN0IEdhc2xlc3NUb2tlblRyYW5zZmVyIHsKICAgIGZ1bmN0aW9uIHNlbmQoCiAgICAgICAgYWRkcmVzcyB0b2tlbiwKICAgICAgICBhZGRyZXNzIHNlbmRlciwKICAgICAgICBhZGRyZXNzIHJlY2VpdmVyLAogICAgICAgIHVpbnQyNTYgYW1vdW50LAogICAgICAgIHVpbnQyNTYgZmVlLAogICAgICAgIHVpbnQyNTYgZGVhZGxpbmUsCiAgICAgICAgLy8gQXNzaW5hdHVyYSBkYSBhdXRvcml6YWNhbwogICAgICAgIHVpbnQ4IHYsCiAgICAgICAgYnl0ZXMzMiByLAogICAgICAgIGJ5dGVzMzIgcwogICAgKSBleHRlcm5hbCB7CiAgICAgICAgLy8gQXV0b3JpemFjYW8KICAgICAgICBJRVJDMjBQZXJtaXQodG9rZW4pLnBlcm1pdCgKICAgICAgICAgICAgc2VuZGVyLAogICAgICAgICAgICBhZGRyZXNzKHRoaXMpLAogICAgICAgICAgICBhbW91bnQgKyBmZWUsCiAgICAgICAgICAgIGRlYWRsaW5lLAogICAgICAgICAgICB2LAogICAgICAgICAgICByLAogICAgICAgICAgICBzCiAgICAgICAgKTsKICAgICAgICAvLyBFbnZpYXIgbyB2YWxvciBhbyBkZXN0aW5hdGFyaW8KICAgICAgICBJRVJDMjBQZXJtaXQodG9rZW4pLnRyYW5zZmVyRnJvbShzZW5kZXIsIHJlY2VpdmVyLCBhbW91bnQpOwogICAgICAgIC8vIEFjZWl0YXIgdGF4YSAtIGVudmlhciB0YXhhIHBhcmEgbXNnLnNlbmRlcgogICAgICAgIElFUkMyMFBlcm1pdCh0b2tlbikudHJhbnNmZXJGcm9tKHNlbmRlciwgbXNnLnNlbmRlciwgZmVlKTsKICAgIH0KfQ=&version=soljson-v0.8.20+commit.a1b79de6.js)

- [GaslessTokenTransfer.sol](https://remix.ethereum.org/#codeLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHkKcHJhZ21hIHNvbGlkaXR5ID49MC44LjA7CgovLy8gQG5vdGljZSBNb2Rlcm4gYW5kIGdhcyBlZmZpY2llbnQgRVJDMjAgKyBFSVAtMjYxMiBpbXBsZW1lbnRhdGlvbi4KLy8vIEBhdXRob3IgU29sbWF0ZSAoaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbWlzc2lvbnMxMS9zb2xtYXRlL2Jsb2IvbWFpbi9zcmMvdG9rZW5zL0VSQzIwLnNvbCkKLy8vIEBhdXRob3IgTW9kaWZpZWQgZnJvbSBVbmlzd2FwIChodHRwczovL2dpdGh1Yi5jb20vVW5pc3dhcC91bmlzd2FwLXYyLWNvcmUvYmxvYi9tYXN0ZXIvY29udHJhY3RzL1VuaXN3YXBWMkVSQzIwLnNvbCkKLy8vIEBkZXYgRG8gbm90IG1hbnVhbGx5IHNldCBiYWxhbmNlcyB3aXRob3V0IHVwZGF0aW5nIHRvdGFsU3VwcGx5LCBhcyB0aGUgc3VtIG9mIGFsbCB1c2VyIGJhbGFuY2VzIG11c3Qgbm90IGV4Y2VlZCBpdC4KYWJzdHJhY3QgY29udHJhY3QgRVJDMjAgewogICAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFVkVOVFMKICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi8KCiAgICBldmVudCBUcmFuc2ZlcihhZGRyZXNzIGluZGV4ZWQgZnJvbSwgYWRkcmVzcyBpbmRleGVkIHRvLCB1aW50MjU2IGFtb3VudCk7CgogICAgZXZlbnQgQXBwcm92YWwoYWRkcmVzcyBpbmRleGVkIG93bmVyLCBhZGRyZXNzIGluZGV4ZWQgc3BlbmRlciwgdWludDI1NiBhbW91bnQpOwoKICAgIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8KICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1FVEFEQVRBIFNUT1JBR0UKICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi8KCiAgICBzdHJpbmcgcHVibGljIG5hbWU7CgogICAgc3RyaW5nIHB1YmxpYyBzeW1ib2w7CgogICAgdWludDggcHVibGljIGltbXV0YWJsZSBkZWNpbWFsczsKCiAgICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVSQzIwIFNUT1JBR0UKICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi8KCiAgICB1aW50MjU2IHB1YmxpYyB0b3RhbFN1cHBseTsKCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludDI1NikgcHVibGljIGJhbGFuY2VPZjsKCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpKSBwdWJsaWMgYWxsb3dhbmNlOwoKICAgIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8KICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVJUC0yNjEyIFNUT1JBR0UKICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi8KCiAgICB1aW50MjU2IGludGVybmFsIGltbXV0YWJsZSBJTklUSUFMX0NIQUlOX0lEOwoKICAgIGJ5dGVzMzIgaW50ZXJuYWwgaW1tdXRhYmxlIElOSVRJQUxfRE9NQUlOX1NFUEFSQVRPUjsKCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludDI1NikgcHVibGljIG5vbmNlczsKCiAgICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDT05TVFJVQ1RPUgogICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qLwoKICAgIGNvbnN0cnVjdG9yKHN0cmluZyBtZW1vcnkgX25hbWUsIHN0cmluZyBtZW1vcnkgX3N5bWJvbCwgdWludDggX2RlY2ltYWxzKSB7CiAgICAgICAgbmFtZSA9IF9uYW1lOwogICAgICAgIHN5bWJvbCA9IF9zeW1ib2w7CiAgICAgICAgZGVjaW1hbHMgPSBfZGVjaW1hbHM7CgogICAgICAgIElOSVRJQUxfQ0hBSU5fSUQgPSBibG9jay5jaGFpbmlkOwogICAgICAgIElOSVRJQUxfRE9NQUlOX1NFUEFSQVRPUiA9IGNvbXB1dGVEb21haW5TZXBhcmF0b3IoKTsKICAgIH0KCiAgICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFUkMyMCBMT0dJQwogICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qLwoKICAgIGZ1bmN0aW9uIGFwcHJvdmUoYWRkcmVzcyBzcGVuZGVyLCB1aW50MjU2IGFtb3VudCkgcHVibGljIHZpcnR1YWwgcmV0dXJucyAoYm9vbCkgewogICAgICAgIGFsbG93YW5jZVttc2cuc2VuZGVyXVtzcGVuZGVyXSA9IGFtb3VudDsKCiAgICAgICAgZW1pdCBBcHByb3ZhbChtc2cuc2VuZGVyLCBzcGVuZGVyLCBhbW91bnQpOwoKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiB0cmFuc2ZlcihhZGRyZXNzIHRvLCB1aW50MjU2IGFtb3VudCkgcHVibGljIHZpcnR1YWwgcmV0dXJucyAoYm9vbCkgewogICAgICAgIGJhbGFuY2VPZlttc2cuc2VuZGVyXSAtPSBhbW91bnQ7CgogICAgICAgIC8vIE7Do28gcG9kZSB1bHRyYXBhc3NhciBvIGxpbWl0ZSBwb3JxdWUgYSBzb21hIGRlIHRvZG9zIG9zIHVzdcOhcmlvcwogICAgICAgIC8vIE7Do28gcG9kZSBleGNlZGVyIG8gdmFsb3IgbcOheGltbyBkZSB1aW50MjU2LgogICAgICAgIHVuY2hlY2tlZCB7CiAgICAgICAgICAgIGJhbGFuY2VPZlt0b10gKz0gYW1vdW50OwogICAgICAgIH0KCiAgICAgICAgZW1pdCBUcmFuc2Zlcihtc2cuc2VuZGVyLCB0bywgYW1vdW50KTsKCiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgZnVuY3Rpb24gdHJhbnNmZXJGcm9tKAogICAgICAgIGFkZHJlc3MgZnJvbSwKICAgICAgICBhZGRyZXNzIHRvLAogICAgICAgIHVpbnQyNTYgYW1vdW50CiAgICApIHB1YmxpYyB2aXJ0dWFsIHJldHVybnMgKGJvb2wpIHsKICAgICAgICB1aW50MjU2IGFsbG93ZWQgPSBhbGxvd2FuY2VbZnJvbV1bbXNnLnNlbmRlcl07IC8vIFBvdXBhIGfDoXMgcGFyYSBhcHJvdmHDp8O1ZXMgbGltaXRhZGFzLgoKICAgICAgICBpZiAoYWxsb3dlZCAhPSB0eXBlKHVpbnQyNTYpLm1heCkKICAgICAgICAgICAgYWxsb3dhbmNlW2Zyb21dW21zZy5zZW5kZXJdID0gYWxsb3dlZCAtIGFtb3VudDsKCiAgICAgICAgYmFsYW5jZU9mW2Zyb21dIC09IGFtb3VudDsKCiAgICAgICAvLyBOw6NvIHBvZGUgdWx0cmFwYXNzYXIgbyBsaW1pdGUgcG9ycXVlIGEgc29tYSBkZSB0b2RvcyBvcyB1c3XDoXJpb3MKICAgICAgIC8vIE7Do28gcG9kZSBleGNlZGVyIG8gdmFsb3IgbcOheGltbyBkZSB1aW50MjU2LgogICAgICAgIHVuY2hlY2tlZCB7CiAgICAgICAgICAgIGJhbGFuY2VPZlt0b10gKz0gYW1vdW50OwogICAgICAgIH0KCiAgICAgICAgZW1pdCBUcmFuc2Zlcihmcm9tLCB0bywgYW1vdW50KTsKCiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwogICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVJUC0yNjEyIExPR0lDCiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovCgogICAgZnVuY3Rpb24gcGVybWl0KAogICAgICAgIGFkZHJlc3Mgb3duZXIsCiAgICAgICAgYWRkcmVzcyBzcGVuZGVyLAogICAgICAgIHVpbnQyNTYgdmFsdWUsCiAgICAgICAgdWludDI1NiBkZWFkbGluZSwKICAgICAgICB1aW50OCB2LAogICAgICAgIGJ5dGVzMzIgciwKICAgICAgICBieXRlczMyIHMKICAgICkgcHVibGljIHZpcnR1YWwgewogICAgICAgIHJlcXVpcmUoZGVhZGxpbmUgPj0gYmxvY2sudGltZXN0YW1wLCAiUEVSTUlUX0RFQURMSU5FX0VYUElSRUQiKTsKCiAgICAgICAgLy8gVW5jaGVja2VkIGJlY2F1c2UgdGhlIG9ubHkgbWF0aCBkb25lIGlzIGluY3JlbWVudGluZwogICAgICAgIC8vIHRoZSBvd25lcidzIG5vbmNlIHdoaWNoIGNhbm5vdCByZWFsaXN0aWNhbGx5IG92ZXJmbG93LgoKICAgICAgICAvLyBOw6NvIHZlcmlmaWNhZG8gcG9ycXVlIGEgw7puaWNhIG1hdGVtw6F0aWNhIGZlaXRhIMOpIG8gaW5jcmVtZW50byBkbwogICAgICAgIC8vIG8gbm9uY2UgZG8gcHJvcHJpZXTDoXJpbywgcXVlIG7Do28gcG9kZSByZWFsaXN0aWNhbWVudGUgdWx0cmFwYXNzYXIuCiAgICAgICAgdW5jaGVja2VkIHsKICAgICAgICAgICAgYWRkcmVzcyByZWNvdmVyZWRBZGRyZXNzID0gZWNyZWNvdmVyKAogICAgICAgICAgICAgICAga2VjY2FrMjU2KAogICAgICAgICAgICAgICAgICAgIGFiaS5lbmNvZGVQYWNrZWQoCiAgICAgICAgICAgICAgICAgICAgICAgICJceDE5XHgwMSIsCiAgICAgICAgICAgICAgICAgICAgICAgIERPTUFJTl9TRVBBUkFUT1IoKSwKICAgICAgICAgICAgICAgICAgICAgICAga2VjY2FrMjU2KAogICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJpLmVuY29kZSgKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWNjYWsyNTYoCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQZXJtaXQoYWRkcmVzcyBvd25lcixhZGRyZXNzIHNwZW5kZXIsdWludDI1NiB2YWx1ZSx1aW50MjU2IG5vbmNlLHVpbnQyNTYgZGVhZGxpbmUpIgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlbmRlciwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub25jZXNbb3duZXJdKyssCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZGxpbmUKICAgICAgICAgICAgICAgICAgICAgICAgICAgICkKICAgICAgICAgICAgICAgICAgICAgICAgKQogICAgICAgICAgICAgICAgICAgICkKICAgICAgICAgICAgICAgICksCiAgICAgICAgICAgICAgICB2LAogICAgICAgICAgICAgICAgciwKICAgICAgICAgICAgICAgIHMKICAgICAgICAgICAgKTsKCiAgICAgICAgICAgIHJlcXVpcmUoCiAgICAgICAgICAgICAgICByZWNvdmVyZWRBZGRyZXNzICE9IGFkZHJlc3MoMCkgJiYgcmVjb3ZlcmVkQWRkcmVzcyA9PSBvd25lciwKICAgICAgICAgICAgICAgICJJTlZBTElEX1NJR05FUiIKICAgICAgICAgICAgKTsKCiAgICAgICAgICAgIGFsbG93YW5jZVtyZWNvdmVyZWRBZGRyZXNzXVtzcGVuZGVyXSA9IHZhbHVlOwogICAgICAgIH0KCiAgICAgICAgZW1pdCBBcHByb3ZhbChvd25lciwgc3BlbmRlciwgdmFsdWUpOwogICAgfQoKICAgIGZ1bmN0aW9uIERPTUFJTl9TRVBBUkFUT1IoKSBwdWJsaWMgdmlldyB2aXJ0dWFsIHJldHVybnMgKGJ5dGVzMzIpIHsKICAgICAgICByZXR1cm4KICAgICAgICAgICAgYmxvY2suY2hhaW5pZCA9PSBJTklUSUFMX0NIQUlOX0lECiAgICAgICAgICAgICAgICA/IElOSVRJQUxfRE9NQUlOX1NFUEFSQVRPUgogICAgICAgICAgICAgICAgOiBjb21wdXRlRG9tYWluU2VwYXJhdG9yKCk7CiAgICB9CgogICAgZnVuY3Rpb24gY29tcHV0ZURvbWFpblNlcGFyYXRvcigpIGludGVybmFsIHZpZXcgdmlydHVhbCByZXR1cm5zIChieXRlczMyKSB7CiAgICAgICAgcmV0dXJuCiAgICAgICAgICAgIGtlY2NhazI1NigKICAgICAgICAgICAgICAgIGFiaS5lbmNvZGUoCiAgICAgICAgICAgICAgICAgICAga2VjY2FrMjU2KAogICAgICAgICAgICAgICAgICAgICAgICAiRUlQNzEyRG9tYWluKHN0cmluZyBuYW1lLHN0cmluZyB2ZXJzaW9uLHVpbnQyNTYgY2hhaW5JZCxhZGRyZXNzIHZlcmlmeWluZ0NvbnRyYWN0KSIKICAgICAgICAgICAgICAgICAgICApLAogICAgICAgICAgICAgICAgICAgIGtlY2NhazI1NihieXRlcyhuYW1lKSksCiAgICAgICAgICAgICAgICAgICAga2VjY2FrMjU2KCIxIiksCiAgICAgICAgICAgICAgICAgICAgYmxvY2suY2hhaW5pZCwKICAgICAgICAgICAgICAgICAgICBhZGRyZXNzKHRoaXMpCiAgICAgICAgICAgICAgICApCiAgICAgICAgICAgICk7CiAgICB9CgogICAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwogICAgICAgICAgICAgICAgICAgICAgICBJTlRFUk5BTCBNSU5UL0JVUk4gTE9HSUMKICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi8KCiAgICBmdW5jdGlvbiBfbWludChhZGRyZXNzIHRvLCB1aW50MjU2IGFtb3VudCkgaW50ZXJuYWwgdmlydHVhbCB7CiAgICAgICAgdG90YWxTdXBwbHkgKz0gYW1vdW50OwoKICAgICAgICAvLyBOw6NvIHBvZGUgdWx0cmFwYXNzYXIgbyBsaW1pdGUgcG9ycXVlIGEgc29tYSBkZSB0b2RvcyBvcyB1c3XDoXJpb3MKICAgICAgICAvLyBOw6NvIHBvZGUgZXhjZWRlciBvIHZhbG9yIG3DoXhpbW8gZGUgdWludDI1Ni4KICAgICAgICB1bmNoZWNrZWQgewogICAgICAgICAgICBiYWxhbmNlT2ZbdG9dICs9IGFtb3VudDsKICAgICAgICB9CgogICAgICAgIGVtaXQgVHJhbnNmZXIoYWRkcmVzcygwKSwgdG8sIGFtb3VudCk7CiAgICB9CgogICAgZnVuY3Rpb24gX2J1cm4oYWRkcmVzcyBmcm9tLCB1aW50MjU2IGFtb3VudCkgaW50ZXJuYWwgdmlydHVhbCB7CiAgICAgICAgYmFsYW5jZU9mW2Zyb21dIC09IGFtb3VudDsKCiAgICAgICAgLy8gQ2Fubm90IHVuZGVyZmxvdyBiZWNhdXNlIGEgdXNlcidzIGJhbGFuY2UKICAgICAgICAvLyB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSB0b3RhbCBzdXBwbHkuCgogICAgICAgIC8vIE7Do28gw6kgcG9zc8OtdmVsIHVuZGVyZmxvdyBwb3JxdWUgbyBzYWxkbyBkbyB1c3XDoXJpbwogICAgICAgIC8vIG51bmNhIHNlcsOhIG1haW9yIGRvIHF1ZSBvIHN1cHJpbWVudG8gdG90YWwuCiAgICAgICAgdW5jaGVja2VkIHsKICAgICAgICAgICAgdG90YWxTdXBwbHkgLT0gYW1vdW50OwogICAgICAgIH0KCiAgICAgICAgZW1pdCBUcmFuc2Zlcihmcm9tLCBhZGRyZXNzKDApLCBhbW91bnQpOwogICAgfQp9Cgpjb250cmFjdCBFUkMyMFBlcm1pdCBpcyBFUkMyMCB7CiAgICBjb25zdHJ1Y3RvcigKICAgICAgICBzdHJpbmcgbWVtb3J5IF9uYW1lLAogICAgICAgIHN0cmluZyBtZW1vcnkgX3N5bWJvbCwKICAgICAgICB1aW50OCBfZGVjaW1hbHMKICAgICkgRVJDMjAoX25hbWUsIF9zeW1ib2wsIF9kZWNpbWFscykge30KCiAgICBmdW5jdGlvbiBtaW50KGFkZHJlc3MgdG8sIHVpbnQyNTYgYW1vdW50KSBwdWJsaWMgewogICAgICAgIF9taW50KHRvLCBhbW91bnQpOwogICAgfQp9=&version=soljson-v0.8.20+commit.a1b79de6.js)
