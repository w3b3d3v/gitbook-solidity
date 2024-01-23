# ERC20

Todo contrato que segue o [ERC20 standard](https://eips.ethereum.org/EIPS/eip-20) é um token ERC20.

Tokens ERC20 fornecem funcionalidades para

- transferir tokens
- permitir que outros transfiram tokens em nome do titular do token

Eis aqui a interface para ERC20.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/IERC20.sol
interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address remetente,
        address destinatario,
        uint quantidade
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}
```

Exemplo de um contrato de token ERC20.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "Solidity by Example";
    string public symbol = "SOLBYEX";
    uint8 public decimals = 18;

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address remetente,
        address destinatario,
        uint quantidade
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
```

### Crie seu próprio token ERC20 <a href="#create-your-own-erc20-token" id="create-your-own-erc20-token"></a>

Usando [Open Zeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) é muito fácil criar seu próprio token ERC20.

Eis aqui um exemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Mint 100 tokens para msg.sender
        // Semelhante a como
        // 1 real = 100 centavos
        // 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, 100 * 10**uint(decimals()));
    }
}
```

### Contrato para trocar tokens <a href="#contract-to-swap-tokens" id="contract-to-swap-tokens"></a>

Aqui está um exemplo de contrato, `TokenSwap`, para trocar um token ERC20 por outro.

Este contrato negociará tokens chamando

```solidity
transferFrom(address remetente, address destinatario, uint256 quantidade)
```

que irá transferir uma `quantidade` de token do `remetente` para o `destinatario`.

Para `transferFrom` ter sucesso, o remetente deve

- A `quantidade` de tokens no seu saldo deve ser maior do que está enviando
- permitir `TokenSwap` para retirar uma `quantidade` de tokens chamando `approve`

antes do `TokenSwap` chamar `transferFrom`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

## Teste no Remix

- [IERC20.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3YzLjAuMC9jb250cmFjdHMvdG9rZW4vRVJDMjAvSUVSQzIwLnNvbAppbnRlcmZhY2UgSUVSQzIwIHsKICAgIGZ1bmN0aW9uIHRvdGFsU3VwcGx5KCkgZXh0ZXJuYWwgdmlldyByZXR1cm5zICh1aW50KTsKCiAgICBmdW5jdGlvbiBiYWxhbmNlT2YoYWRkcmVzcyBhY2NvdW50KSBleHRlcm5hbCB2aWV3IHJldHVybnMgKHVpbnQpOwoKICAgIGZ1bmN0aW9uIHRyYW5zZmVyKGFkZHJlc3MgcmVjaXBpZW50LCB1aW50IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CgogICAgZnVuY3Rpb24gYWxsb3dhbmNlKGFkZHJlc3Mgb3duZXIsIGFkZHJlc3Mgc3BlbmRlcikgZXh0ZXJuYWwgdmlldyByZXR1cm5zICh1aW50KTsKCiAgICBmdW5jdGlvbiBhcHByb3ZlKGFkZHJlc3Mgc3BlbmRlciwgdWludCBhbW91bnQpIGV4dGVybmFsIHJldHVybnMgKGJvb2wpOwoKICAgIGZ1bmN0aW9uIHRyYW5zZmVyRnJvbSgKICAgICAgICBhZGRyZXNzIHJlbWV0ZW50ZSwKICAgICAgICBhZGRyZXNzIGRlc3RpbmF0YXJpbywKICAgICAgICB1aW50IHF1YW50aWRhZGUKICAgICkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CgogICAgZXZlbnQgVHJhbnNmZXIoYWRkcmVzcyBpbmRleGVkIGZyb20sIGFkZHJlc3MgaW5kZXhlZCB0bywgdWludCB2YWx1ZSk7CiAgICBldmVudCBBcHByb3ZhbChhZGRyZXNzIGluZGV4ZWQgb3duZXIsIGFkZHJlc3MgaW5kZXhlZCBzcGVuZGVyLCB1aW50IHZhbHVlKTsKfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
- [ERC20.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmltcG9ydCAiLi9JRVJDMjAuc29sIjsKCmNvbnRyYWN0IEVSQzIwIGlzIElFUkMyMCB7CiAgICB1aW50IHB1YmxpYyB0b3RhbFN1cHBseTsKICAgIG1hcHBpbmcoYWRkcmVzcyA9PiB1aW50KSBwdWJsaWMgYmFsYW5jZU9mOwogICAgbWFwcGluZyhhZGRyZXNzID0+IG1hcHBpbmcoYWRkcmVzcyA9PiB1aW50KSkgcHVibGljIGFsbG93YW5jZTsKICAgIHN0cmluZyBwdWJsaWMgbmFtZSA9ICJTb2xpZGl0eSBieSBFeGFtcGxlIjsKICAgIHN0cmluZyBwdWJsaWMgc3ltYm9sID0gIlNPTEJZRVgiOwogICAgdWludDggcHVibGljIGRlY2ltYWxzID0gMTg7CgogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcyByZWNpcGllbnQsIHVpbnQgYW1vdW50KSBleHRlcm5hbCByZXR1cm5zIChib29sKSB7CiAgICAgICAgYmFsYW5jZU9mW21zZy5zZW5kZXJdIC09IGFtb3VudDsKICAgICAgICBiYWxhbmNlT2ZbcmVjaXBpZW50XSArPSBhbW91bnQ7CiAgICAgICAgZW1pdCBUcmFuc2Zlcihtc2cuc2VuZGVyLCByZWNpcGllbnQsIGFtb3VudCk7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgZnVuY3Rpb24gYXBwcm92ZShhZGRyZXNzIHNwZW5kZXIsIHVpbnQgYW1vdW50KSBleHRlcm5hbCByZXR1cm5zIChib29sKSB7CiAgICAgICAgYWxsb3dhbmNlW21zZy5zZW5kZXJdW3NwZW5kZXJdID0gYW1vdW50OwogICAgICAgIGVtaXQgQXBwcm92YWwobXNnLnNlbmRlciwgc3BlbmRlciwgYW1vdW50KTsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiB0cmFuc2ZlckZyb20oCiAgICAgICAgYWRkcmVzcyByZW1ldGVudGUsCiAgICAgICAgYWRkcmVzcyBkZXN0aW5hdGFyaW8sCiAgICAgICAgdWludCBxdWFudGlkYWRlCiAgICApIGV4dGVybmFsIHJldHVybnMgKGJvb2wpIHsKICAgICAgICBhbGxvd2FuY2Vbc2VuZGVyXVttc2cuc2VuZGVyXSAtPSBhbW91bnQ7CiAgICAgICAgYmFsYW5jZU9mW3NlbmRlcl0gLT0gYW1vdW50OwogICAgICAgIGJhbGFuY2VPZltyZWNpcGllbnRdICs9IGFtb3VudDsKICAgICAgICBlbWl0IFRyYW5zZmVyKHNlbmRlciwgcmVjaXBpZW50LCBhbW91bnQpOwogICAgICAgIHJldHVybiB0cnVlOwogICAgfQoKICAgIGZ1bmN0aW9uIG1pbnQodWludCBhbW91bnQpIGV4dGVybmFsIHsKICAgICAgICBiYWxhbmNlT2ZbbXNnLnNlbmRlcl0gKz0gYW1vdW50OwogICAgICAgIHRvdGFsU3VwcGx5ICs9IGFtb3VudDsKICAgICAgICBlbWl0IFRyYW5zZmVyKGFkZHJlc3MoMCksIG1zZy5zZW5kZXIsIGFtb3VudCk7CiAgICB9CgogICAgZnVuY3Rpb24gYnVybih1aW50IGFtb3VudCkgZXh0ZXJuYWwgewogICAgICAgIGJhbGFuY2VPZlttc2cuc2VuZGVyXSAtPSBhbW91bnQ7CiAgICAgICAgdG90YWxTdXBwbHkgLT0gYW1vdW50OwogICAgICAgIGVtaXQgVHJhbnNmZXIobXNnLnNlbmRlciwgYWRkcmVzcygwKSwgYW1vdW50KTsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
- [MyToken.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmltcG9ydCAiaHR0cHM6Ly9naXRodWIuY29tL09wZW5aZXBwZWxpbi9vcGVuemVwcGVsaW4tY29udHJhY3RzL2Jsb2IvdjQuMC4wL2NvbnRyYWN0cy90b2tlbi9FUkMyMC9FUkMyMC5zb2wiOwoKY29udHJhY3QgTXlUb2tlbiBpcyBFUkMyMCB7CiAgICBjb25zdHJ1Y3RvcihzdHJpbmcgbWVtb3J5IG5hbWUsIHN0cmluZyBtZW1vcnkgc3ltYm9sKSBFUkMyMChuYW1lLCBzeW1ib2wpIHsKICAgICAgICAvLyBNaW50IDEwMCB0b2tlbnMgcGFyYSBtc2cuc2VuZGVyCiAgICAgICAgLy8gU2VtZWxoYW50ZSBhIGNvbW8KICAgICAgICAvLyAxIHJlYWwgPSAxMDAgY2VudGF2b3MKICAgICAgICAvLyAxIHRva2VuID0gMSAqICgxMCAqKiBkZWNpbWFscykKICAgICAgICBfbWludChtc2cuc2VuZGVyLCAxMDAgKiAxMCoqdWludChkZWNpbWFscygpKSk7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
- [TokenSwap.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmltcG9ydCAiaHR0cHM6Ly9naXRodWIuY29tL09wZW5aZXBwZWxpbi9vcGVuemVwcGVsaW4tY29udHJhY3RzL2Jsb2IvdjQuMC4wL2NvbnRyYWN0cy90b2tlbi9FUkMyMC9JRVJDMjAuc29sIjsKCi8qCkNvbW8gdHJvY2FyIHRva2VucwoKMS4gQWxpY2UgdGVtIDEwMCB0b2tlbnMgZGUgQWxpY2VDb2luLCBxdWUgZSB1bSB0b2tlbiBFUkMyMC4KMi4gQm9iIHRlbSAxMDAgdG9rZW5zIGRlIEJvYkNvaW4sIHF1ZSB0YW1iZW0gZSB1bSB0b2tlbiBFUkMyMC4KMy4gQWxpY2UgZSBCb2IgcXVlcmVtIG5lZ29jaWFyIDEwIEFsaWNlQ29pbiBwb3IgMjAgQm9iQ29pbi4KNC4gQWxpY2Ugb3UgQm9iIGltcGxhbnRhbSBUb2tlblN3YXAKNS4gQWxpY2UgYXByb3ZhIFRva2VuU3dhcCBwYXJhIHJldGlyYXIgMTAgdG9rZW5zIGRlIEFsaWNlQ29pbgo2LiBCb2IgYXByb3ZhIFRva2VuU3dhcCBwYXJhIHJldGlyYXIgMjAgdG9rZW5zIGRlIEJvYkNvaW4KNy4gQWxpY2Ugb3UgQm9iIGNoYW1hbSBUb2tlblN3YXAuc3dhcCgpCjguIEFsaWNlIGUgQm9iIG5lZ29jaWFyYW0gdG9rZW5zIGNvbSBzdWNlc3NvLgoqLwoKY29udHJhY3QgVG9rZW5Td2FwIHsKICAgIElFUkMyMCBwdWJsaWMgdG9rZW4xOwogICAgYWRkcmVzcyBwdWJsaWMgb3duZXIxOwogICAgdWludCBwdWJsaWMgYW1vdW50MTsKICAgIElFUkMyMCBwdWJsaWMgdG9rZW4yOwogICAgYWRkcmVzcyBwdWJsaWMgb3duZXIyOwogICAgdWludCBwdWJsaWMgYW1vdW50MjsKCiAgICBjb25zdHJ1Y3RvcigKICAgICAgICBhZGRyZXNzIF90b2tlbjEsCiAgICAgICAgYWRkcmVzcyBfb3duZXIxLAogICAgICAgIHVpbnQgX2Ftb3VudDEsCiAgICAgICAgYWRkcmVzcyBfdG9rZW4yLAogICAgICAgIGFkZHJlc3MgX293bmVyMiwKICAgICAgICB1aW50IF9hbW91bnQyCiAgICApIHsKICAgICAgICB0b2tlbjEgPSBJRVJDMjAoX3Rva2VuMSk7CiAgICAgICAgb3duZXIxID0gX293bmVyMTsKICAgICAgICBhbW91bnQxID0gX2Ftb3VudDE7CiAgICAgICAgdG9rZW4yID0gSUVSQzIwKF90b2tlbjIpOwogICAgICAgIG93bmVyMiA9IF9vd25lcjI7CiAgICAgICAgYW1vdW50MiA9IF9hbW91bnQyOwogICAgfQoKICAgIGZ1bmN0aW9uIHN3YXAoKSBwdWJsaWMgewogICAgICAgIHJlcXVpcmUobXNnLnNlbmRlciA9PSBvd25lcjEgfHwgbXNnLnNlbmRlciA9PSBvd25lcjIsICJOb3QgYXV0aG9yaXplZCIpOwogICAgICAgIHJlcXVpcmUoCiAgICAgICAgICAgIHRva2VuMS5hbGxvd2FuY2Uob3duZXIxLCBhZGRyZXNzKHRoaXMpKSA+PSBhbW91bnQxLAogICAgICAgICAgICAiVG9rZW4gMSBhbGxvd2FuY2UgdG9vIGxvdyIKICAgICAgICApOwogICAgICAgIHJlcXVpcmUoCiAgICAgICAgICAgIHRva2VuMi5hbGxvd2FuY2Uob3duZXIyLCBhZGRyZXNzKHRoaXMpKSA+PSBhbW91bnQyLAogICAgICAgICAgICAiVG9rZW4gMiBhbGxvd2FuY2UgdG9vIGxvdyIKICAgICAgICApOwoKICAgICAgICBfc2FmZVRyYW5zZmVyRnJvbSh0b2tlbjEsIG93bmVyMSwgb3duZXIyLCBhbW91bnQxKTsKICAgICAgICBfc2FmZVRyYW5zZmVyRnJvbSh0b2tlbjIsIG93bmVyMiwgb3duZXIxLCBhbW91bnQyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBfc2FmZVRyYW5zZmVyRnJvbSgKICAgICAgICBJRVJDMjAgdG9rZW4sCiAgICAgICAgYWRkcmVzcyBzZW5kZXIsCiAgICAgICAgYWRkcmVzcyByZWNpcGllbnQsCiAgICAgICAgdWludCBhbW91bnQKICAgICkgcHJpdmF0ZSB7CiAgICAgICAgYm9vbCBzZW50ID0gdG9rZW4udHJhbnNmZXJGcm9tKHNlbmRlciwgcmVjaXBpZW50LCBhbW91bnQpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIlRva2VuIHRyYW5zZmVyIGZhaWxlZCIpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
