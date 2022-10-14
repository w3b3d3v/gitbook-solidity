# ERC20

Cualquier contrato que sigue el [ERC20 standard](https://eips.ethereum.org/EIPS/eip-20) es un token ERC20.

Los tokens ERC20 proveen funcionalidades de

* Transferencia de tokens
* Permitir que otros transfieran tokens a nombre del titular del token

Aquí está la interfaz para el ERC20.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/IERC20.sol
interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}
```

### Crea tu propio token ERC20 <a href="#create-your-own-erc20-token" id="create-your-own-erc20-token"></a>

Usando [Open Zeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) es realmente fácil crear tu propio token ERC20.

Aquí hay un ejemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Mint 100 tokens hacia msg.sender
        // Similar a como
        // 1 dólar = 100 centavos
        // 1 token = 1 * (10 ** decimales)
        _mint(msg.sender, 100 * 10**uint(decimals()));
    }
}
```

### Contrato para intercambiar tokens <a href="#contract-to-swap-tokens" id="contract-to-swap-tokens"></a>

Aquí hay un ejemplo de contrato, `TokenSwap`, para intercambiar un token ERC20 por otro.

Este contrato intercambiará tokens invocando

    transferFrom(address sender, address recipient, uint256 amount)

El cual transferirá la cantidad `amount` de token desde el emisor `sender` hacia el receptor `recipient`.

Para que `transferFrom` sea exitoso, el `sender` debe

* Tener más que `amount` de tokens en su saldo
* Permitir que `TokenSwap` retire un `amount` de tokens, invocando a `approve`

antes de que `TokenSwap` invoque `transferFrom`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/IERC20.sol";

/*
Cómo intercambiar los tokens

1. Alice tiene 100 tokens de AliceCoin, el cual es un token ERC20.
2. Bob tiene 100 tokens de BobCoin, el cual, también, es un token ERC20.
3. Alice y Bob quieren intercambiar 10 AliceCoin por 20 BobCoin.
4. Alice o Bob despliegan TokenSwap
5. Alice aprueba el TokenSwap para retirar 10 tokens de AliceCoin
6. Bob aprueba el TokenSwap para retirar 20 tokens de BobCoin
7. Alice o Bob llaman a TokenSwap.swap()
8. Alice y Bob intercambiaron los tokens exitosamente.
*/

contract TokenSwap {
    IERC20 public token1;
    address public owner1;
    uint public amount1;
    IERC20 public token2;
    address public owner2;
    uint public amount2;

    constructor(
        address _token1,
        address _owner1,
        uint _amount1,
        address _token2,
        address _owner2,
        uint _amount2
    ) {
        token1 = IERC20(_token1);
        owner1 = _owner1;
        amount1 = _amount1;
        token2 = IERC20(_token2);
        owner2 = _owner2;
        amount2 = _amount2;
    }

    function swap() public {
        require(msg.sender == owner1 || msg.sender == owner2, "Not authorized");
        require(
            token1.allowance(owner1, address(this)) >= amount1,
            "Token 1 allowance too low"
        );
        require(
            token2.allowance(owner2, address(this)) >= amount2,
            "Token 2 allowance too low"
        );

        _safeTransferFrom(token1, owner1, owner2, amount1);
        _safeTransferFrom(token2, owner2, owner1, amount2);
    }

    function _safeTransferFrom(
        IERC20 token,
        address sender,
        address recipient,
        uint amount
    ) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
}
```
