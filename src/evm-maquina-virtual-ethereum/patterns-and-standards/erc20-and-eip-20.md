---
title: ERC20 & EIP-20
---
::: tip
  EIP são padrões de implementação com consenso da comunidade e mineradores para
  implementar alterações de comportamento na Máquina Virtual Ethereum. Já o ERC
  se referem mais à padrões de smart contract.
:::

A proposta [EIP-20](https://eips.ethereum.org/EIPS/eip-20) foi criada por Vitalik Buterin e Vogelsteller em novembro de 2015 e se refere à padrões de desenvolvimento para implementar tokens fungíveis.

Sabe-se que o primeiro token no formato ERC-20 que foi criado baseando-se nesse "padrão de desenvolvimento" foi o [FirstBlood Token](https://etherscan.io/address/0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7#code) implementado no bloco [**2320114**](https://etherscan.io/block/2320114)**.**

#### **Nesse artigo você verá referências aos padrões sugeridos pelos desenvolvedores do Ethereum e** [**OpenZeppelin**](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20)**.**

## **Tokens ERC-20**

Possuem 6 funções _**obrigatórias**_ e outras _**opcionais** e dispara 2_ **Eventos obrigatórios**.

### **Funções Obrigatórias:**

#### totalSupply: Retorna a quantidade de tokens disponíveis

```
function totalSupply() public view returns (uint256)
```

#### balanceOF: retorna o saldo de um endereço passado como \_owner

```
function balanceOf(address _owner) public view returns (uint256 balance)
```

#### transfer: Transfere uma quantidade \_value de tokens da para a conta \_to

```
function transfer(address _to, uint256 _value) public returns (bool success)
```

#### transferFrom: Permite que endereços autorizados façam transferências "em seu nome" (Função usada pelas DEX para fazer compra e venda)

```
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```

#### approve: Dá autorização para que um endereço \_spender possa sacar até o valor passado em \_value

```
function approve(address _spender, uint256 _value) public returns (bool success)
```

#### Retorna o valor que o \_spender ainda está autorizado a sacar

```
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```

### **Funções Opcionais:**

**name: Retorna o nome do Token**

```
function name() public view returns (string)
```

#### symbol: Retorna o símbolo do Token

```
function symbol() public view returns (string)
```

#### decimals: Retorna a quantidade de casas decimais que o Token possui

```
function decimals() public view returns (uint8)
```

## Eventos

#### event Approval: Sempre que um endereço autorizar que outros endereços movimentem seu saldo

```
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

#### event Transfer: Sempre que houver uma transferência ou queima de tokens

```
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```

## Extensões

#### `ERC20Mintable:`  Permite que endereços autorizados criem novos tokens

```
modifier onlyMinter()

mint(account, amount) onlyMinter() {}
```

#### `ERC20Burnable:` Irá queimar tokens do endereço que chamar essa função <a href="#erc20burnable" id="erc20burnable"></a>

```
burn(amount)

burnFrom(account, amount)
```

#### `ERC20Pausable:` Permite que as operações de compra e venda sejam pausadas <a href="#erc20pausable" id="erc20pausable"></a>

```
Modifiers:
onlyPauser()
whenNotPaused()
whenPaused()
```

#### `ERC20Capped:` Há um limite de tokens que podem ser criados <a href="#erc20capped" id="erc20capped"></a>

```
constructor(cap) {}

require(totalSupply().add(amount) <= _cap); //inserir na função mint
```
