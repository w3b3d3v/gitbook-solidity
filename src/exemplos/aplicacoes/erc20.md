# ERC20

`Todo contrato que segue o` [ERC20 standard](https://eips.ethereum.org/EIPS/eip-20) é um token ERC20.

Tokens ERC20 fornecem funcionalidades para

* transferir tokens
* permitir que outros transfiram tokens em nome do titular do token

Eis aqui a interface para ERC20.

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

### Crie seu próprio token ERC20 <a href="#create-your-own-erc20-token" id="create-your-own-erc20-token"></a>

Usando [Open Zeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) é muito fácil criar seu próprio token ERC20.

Eis aqui um exemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Mint 100 tokens para msg.sender
        // Semelhante a como
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, 100 * 10**uint(decimals()));
    }
}
```

### Contrato para trocar tokens <a href="#contract-to-swap-tokens" id="contract-to-swap-tokens"></a>

Eis um exemplo de contrato, `TokenSwap`, para negociar token ERC20 por outro.

Este contrato negociará tokens chamando

transferFrom(address sender, address recipient, uint256 amount)

que irá transferir uma quantidade de token do remetente para o destinatário.

Para `transferFrom` suceder, o remetente deve

* ter mais que o `amount` de tokens no seu saldo
* permitir `TokenSwap` para retirar o`amount` de tokens chamando `approve`

antes do `TokenSwap`chamar `transferFrom`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/IERC20.sol";

/*
Como trocar tokens

1. Alice tem 100 tokens de AliceCoin, que é um token ERC20.
2. Bob tem 100 tokens de BobCoin, que também é um token ERC20.
3. Alice e Bob querem negociar 10 AliceCoin por 20 BobCoin.
4. Alice ou Bob implantam TokenSwap
5. Alice aprova TokenSwap para retirar 10 tokens de AliceCoin
6. Bob aprova TokenSwap para retirar 20 tokens de BobCoin
7. Alice ou Bob chamam TokenSwap.swap()
8. Alice e Bob negociaram tokens com sucesso.
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
