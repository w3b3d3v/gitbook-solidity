# Front Running

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

As transações levam algum tempo antes de serem extraídas. Um invasor pode observar o pool de transações e enviar uma transação, incluindo-a em um bloco antes da transação original. Esse mecanismo pode ser usado para reordenar transações em benefício do invasor.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Alice cria um jogo de advinhação.
Você ganha 10 ether se você encontrar o string correto que bata com o hash alvo
Vejamos como esse contrato é vulnerável para front running.
*/

/*
1. Alice implanta FindThisHash com 10 Ether.
2. Bob encontra o string correto que bate com o hash alvo. ("Ethereum")
3. Bob chama solve("Ethereum") com o preço de gás estabelecido em 15 gwei.
4. Eve está observando o pool das transações para submeter uma resposta.
5. Eve vê a resposta de Bob e chama solve("Ethereum") com um preço de gás mais
   alto do que o de Bob (100 gwei).
6. A transação de Eve foi minerada antes da transação de Bob.
   Eve ganha a recompensa de 10 ether.

O que aconteceu?
Transações levam algum tempo antes de serem mineradas.
Transações que ainda não foram mineradas são colocadas no pool de transações.
Transações com preço de gás mais alto são tipicamente mineradas primeiro.
Um invasor obtém a resposta de pool de transações, envia uma transação com um
preço de gás mais alto, de forma que sua transação será incluída num bloco
antes do original.
*/

contract FindThisHash {
    bytes32 public constant hash =
        0x564ccaf7594d66b1eaaea24fe01f0585bf52ee70852af4eac0cc4b04711cd0e2;

    constructor() payable {}

    function solve(string memory solution) public {
        require(hash == keccak256(abi.encodePacked(solution)), "Incorrect answer");

        (bool sent, ) = msg.sender.call{value: 10 ether}("");
        require(sent, "Failed to send Ether");
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- use o esquema commit-reveal ( https://medium.com/swlh/exploring-commit-reveal-schemes-on-ethereum-c4ff5a777db8 )
- use o envio submarino ( https://libsubmarine.org/ )

</h4><a href="#commit-reveal-schemes" id="commit-reveal-schemes">Commit-Reveal Schemes</a></h4>

Um commitment scheme é um algoritmo criptográfico usado para permitir que alguém se comprometa com um valor, mantendo-o oculto de outras pessoas com a capacidade de revelá-lo mais tarde. Os valores em um commitment scheme são obrigatórios, o que significa que ninguém pode alterá-los depois de confirmado. O esquema tem duas fases: uma fase de confirmação na qual um valor é escolhido e especificado e uma fase de revelação na qual o valor é revelado e verificado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/Strings.sol";


/*
   Agora vamos ver como se proteger do front running usando o esquema de revelação de commit.
*/

/*
1. Alice implanta SecuredFindThisHash com 10 Ether.
2. Bob encontra a string correta que fará o hash para o hash de destino. ("Ethereum").
3. Bob então encontra o keccak256(Endereço em letras minúsculas + Solução + Segredo).
   Endereço é o endereço da carteira dele em letras minúsculas, a solução é "Ethereum", Secret é como uma senha ("mysecret")
   que apenas Bob sabe qual Bob usa para confirmar e revelar a solução.
   keccak2566("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266Ethereummysecret") = '0xf95b1dd61edc3bd962cdea3987c6f55bcb714a02a2c3eb73bd960d6b4387fc36'
3. Bob então chama commitSolution("0xf95b1dd61edc3bd962cdea3987c6f55bcb714a02a2c3eb73bd960d6b4387fc36"),
   onde ele confirma o hash da solução calculada com o preço do gás definido para 15 gwei.
4. Eve está observando o pool de transações para que a resposta seja enviada.
5. Eve vê a resposta de Bob e ele também chama commitSolution("0xf95b1dd61edc3bd962cdea3987c6f55bcb714a02a2c3eb73bd960d6b4387fc36")
   com um preço de gás mais alto do que Bob (100 gwei).
6. A transação de Eve foi extraída antes da transação de Bob, mas Eve ainda não recebeu a recompensa.
   Ele precisa chamar revelaSolution() com o segredo e a solução exatos, então digamos que ele está observando o pool de transações
   para liderar Bob como ele fez anteriormente
7. Em seguida, Bob chama a revelaçãoSolution("Ethereum", "mysecret") com o preço do gás definido para 15 gwei;
8. Vamos considerar que Eve está observando o pool de transações, encontra a transação da solução de revelação de Bob e ele também chama
   revelarSolution("Ethereum", "mysecret") com preço de gás mais alto que Bob (100 gwei)
9. Vamos considerar que desta vez também a transação de revelação de Eve foi extraída antes da transação de Bob, mas Eve será
   revertido com o erro "Hash não corresponde". Como a função revelaSolution() verifica o hash usando
   keccak256(msg.sender + solução + segredo). Portanto, desta vez, a véspera não consegue ganhar a recompensa.
10.Mas Bob's revelaSolution("Ethereum", "mysecret") passa na verificação de hash e recebe a recompensa de 10 ether.
*/


contract SecuredFindThisHash {

    // Struct é usado para armazenar os detalhes do commit
    struct Commit {
        bytes32 solutionHash;
        uint commitTime;
        bool revealed;
    }

    // O hash que é necessário para ser resolvido
    bytes32 public hash = 0x564ccaf7594d66b1eaaea24fe01f0585bf52ee70852af4eac0cc4b04711cd0e2;

    // Endereço do vencedor
    address public winner;

    // Preço a ser recompensado
    uint public reward;

    // Status do jogo
    bool public ended;

    // Mapping para armazenar os detalhes do commit com endereço
    mapping(address => Commit) commits;

    // Modifier para verificar se o jogo está ativo
    modifier gameActive {
        require(!ended, "Already ended");
        _;
    }

    constructor() payable {
        reward = msg.value;
    }

    /*
      Função de confirmação para armazenar o hash calculado usando keccak256 (endereço em minúsculas + solução + segredo).
        Os usuários só podem se comprometer uma vez e se o jogo estiver ativo.
    */
    function commitSolution(bytes32 _solutionHash) public gameActive {
        Commit storage commit = commits[msg.sender];
        require(commit.commitTime == 0, "Already committed");
        commit.solutionHash = _solutionHash;
        commit.commitTime = block.timestamp;
        commit.revealed = false;
    }

    /*
        Função para obter os detalhes do commit. Ele retorna uma tupla de (solutionHash, commitTime, revelaStatus);
            Os usuários podem obter a solução somente se o jogo estiver ativo e eles confirmaram um solutionHash

    */
    function getMySolution() public view gameActive returns(bytes32, uint, bool) {
        Commit storage commit = commits[msg.sender];
        require(commit.commitTime != 0, "Not committed yet");
        return (commit.solutionHash, commit.commitTime, commit.revealed);
    }

    /*
        Função para revelar o commit e receber a recompensa.
        Os usuários podem obter a solução de revelação somente se o jogo estiver ativo e eles confirmaram um solutionHash e ainda não foram revelados.
        Ele gera um keccak256(msg.sender + solução + segredo) e o verifica com o hash confirmado anteriormente.
        Os que estão na frente não poderão passar nesta verificação, pois o msg.sender é diferente.
        Em seguida, a solução real é verificada usando keccak256(solution), se a solução corresponder, o vencedor é declarado,
        o jogo termina e o valor da recompensa é enviado ao vencedor.
    */
    function revealSolution (string memory _solution, string memory _secret) public gameActive {
        Commit storage commit = commits[msg.sender];
        require(commit.commitTime != 0, "Not committed yet");
        require(!commit.revealed, "Already commited and revealed");

        bytes32 solutionHash = keccak256(abi.encodePacked(Strings.toHexString(msg.sender), _solution, _secret));
        require(solutionHash == commit.solutionHash, "Hash doesn't match");

        require(keccak256(abi.encodePacked(_solution)) != hash, "Incorrect answer");

        winner = msg.sender;
        ended = true;

        (bool sent,) = payable(msg.sender).call{value: reward}("");
        if(!sent){
            winner = address(0);
            ended = false;
            revert("Failed to send ether.");
        }
    }
}
```

## Teste no Remix

- [FrontRunning.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkFsaWNlIGNyaWEgdW0gam9nbyBkZSBhZHZpbmhhY2FvLgpWb2NlIGdhbmhhIDEwIGV0aGVyIHNlIHZvY2UgZW5jb250cmFyIG8gc3RyaW5nIGNvcnJldG8gcXVlIGJhdGEgY29tIG8gaGFzaCBhbHZvClZlamFtb3MgY29tbyBlc3NlIGNvbnRyYXRvIGUgdnVsbmVyYXZlbCBwYXJhIGZyb250IHJ1bm5pbmcuCiovCgovKgoxLiBBbGljZSBpbXBsYW50YSBGaW5kVGhpc0hhc2ggY29tIDEwIEV0aGVyLgoyLiBCb2IgZW5jb250cmEgbyBzdHJpbmcgY29ycmV0byBxdWUgYmF0ZSBjb20gbyBoYXNoIGFsdm8uICgiRXRoZXJldW0iKQozLiBCb2IgY2hhbWEgc29sdmUoIkV0aGVyZXVtIikgY29tIG8gcHJlY28gZGUgZ2FzIGVzdGFiZWxlY2lkbyBlbSAxNSBnd2VpLgo0LiBFdmUgZXN0YSBvYnNlcnZhbmRvIG8gcG9vbCBkYXMgdHJhbnNhY29lcyBwYXJhIHN1Ym1ldGVyIHVtYSByZXNwb3N0YS4KNS4gRXZlIHZlIGEgcmVzcG9zdGEgZGUgQm9iIGUgY2hhbWEgc29sdmUoIkV0aGVyZXVtIikgY29tIHVtIHByZWNvIGRlIGdhcyBtYWlzCiAgIGFsdG8gZG8gcXVlIG8gZGUgQm9iICgxMDAgZ3dlaSkuCjYuIEEgdHJhbnNhY2FvIGRlIEV2ZSBmb2kgbWluZXJhZGEgYW50ZXMgZGEgdHJhbnNhY2FvIGRlIEJvYi4KICAgRXZlIGdhbmhhIGEgcmVjb21wZW5zYSBkZSAxMCBldGhlci4KCk8gcXVlIGFjb250ZWNldT8KVHJhbnNhY29lcyBsZXZhbSBhbGd1bSB0ZW1wbyBhbnRlcyBkZSBzZXJlbSBtaW5lcmFkYXMuClRyYW5zYWNvZXMgcXVlIGFpbmRhIG5hbyBmb3JhbSBtaW5lcmFkYXMgc2FvIGNvbG9jYWRhcyBubyBwb29sIGRlIHRyYW5zYWNvZXMuClRyYW5zYWNvZXMgY29tIHByZWNvIGRlIGdhcyBtYWlzIGFsdG8gc2FvIHRpcGljYW1lbnRlIG1pbmVyYWRhcyBwcmltZWlyby4KVW0gaW52YXNvciBvYnRlbSBhIHJlc3Bvc3RhIGRlIHBvb2wgZGUgdHJhbnNhY29lcywgZW52aWEgdW1hIHRyYW5zYWNhbyBjb20gdW0KcHJlY28gZGUgZ2FzIG1haXMgYWx0bywgZGUgZm9ybWEgcXVlIHN1YSB0cmFuc2FjYW8gc2VyYSBpbmNsdWlkYSBudW0gYmxvY28KYW50ZXMgZG8gb3JpZ2luYWwuCiovCgpjb250cmFjdCBGaW5kVGhpc0hhc2ggewogICAgYnl0ZXMzMiBwdWJsaWMgY29uc3RhbnQgaGFzaCA9CiAgICAgICAgMHg1NjRjY2FmNzU5NGQ2NmIxZWFhZWEyNGZlMDFmMDU4NWJmNTJlZTcwODUyYWY0ZWFjMGNjNGIwNDcxMWNkMGUyOwoKICAgIGNvbnN0cnVjdG9yKCkgcGF5YWJsZSB7fQoKICAgIGZ1bmN0aW9uIHNvbHZlKHN0cmluZyBtZW1vcnkgc29sdXRpb24pIHB1YmxpYyB7CiAgICAgICAgcmVxdWlyZShoYXNoID09IGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKHNvbHV0aW9uKSksICJJbmNvcnJlY3QgYW5zd2VyIik7CgogICAgICAgIChib29sIHNlbnQsICkgPSBtc2cuc2VuZGVyLmNhbGx7dmFsdWU6IDEwIGV0aGVyfSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [PreventFrontRunning.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvdXRpbHMvU3RyaW5ncy5zb2wiOwoKCi8qCiAgIEFnb3JhIHZhbW9zIHZlciBjb21vIHNlIHByb3RlZ2VyIGRvIGZyb250IHJ1bm5pbmcgdXNhbmRvIG8gZXNxdWVtYSBkZSByZXZlbGFjYW8gZGUgY29tbWl0LgoqLwoKLyoKMS4gQWxpY2UgaW1wbGFudGEgU2VjdXJlZEZpbmRUaGlzSGFzaCBjb20gMTAgRXRoZXIuCjIuIEJvYiBlbmNvbnRyYSBhIHN0cmluZyBjb3JyZXRhIHF1ZSBmYXJhIG8gaGFzaCBwYXJhIG8gaGFzaCBkZSBkZXN0aW5vLiAoIkV0aGVyZXVtIikuCjMuIEJvYiBlbnRhbyBlbmNvbnRyYSBvIGtlY2NhazI1NihFbmRlcmVjbyBlbSBsZXRyYXMgbWludXNjdWxhcyArIFNvbHVjYW8gKyBTZWdyZWRvKS4KICAgRW5kZXJlY28gZSBvIGVuZGVyZWNvIGRhIGNhcnRlaXJhIGRlbGUgZW0gbGV0cmFzIG1pbnVzY3VsYXMsIGEgc29sdWNhbyBlICJFdGhlcmV1bSIsIFNlY3JldCBlIGNvbW8gdW1hIHNlbmhhICgibXlzZWNyZXQiKQogICBxdWUgYXBlbmFzIEJvYiBzYWJlIHF1YWwgQm9iIHVzYSBwYXJhIGNvbmZpcm1hciBlIHJldmVsYXIgYSBzb2x1Y2FvLgogICBrZWNjYWsyNTY2KCIweGYzOUZkNmU1MWFhZDg4RjZGNGNlNmFCODgyNzI3OWNmZkZiOTIyNjZFdGhlcmV1bW15c2VjcmV0IikgPSAnMHhmOTViMWRkNjFlZGMzYmQ5NjJjZGVhMzk4N2M2ZjU1YmNiNzE0YTAyYTJjM2ViNzNiZDk2MGQ2YjQzODdmYzM2JwozLiBCb2IgZW50YW8gY2hhbWEgY29tbWl0U29sdXRpb24oIjB4Zjk1YjFkZDYxZWRjM2JkOTYyY2RlYTM5ODdjNmY1NWJjYjcxNGEwMmEyYzNlYjczYmQ5NjBkNmI0Mzg3ZmMzNiIpLAogICBvbmRlIGVsZSBjb25maXJtYSBvIGhhc2ggZGEgc29sdWNhbyBjYWxjdWxhZGEgY29tIG8gcHJlY28gZG8gZ2FzIGRlZmluaWRvIHBhcmEgMTUgZ3dlaS4KNC4gRXZlIGVzdGEgb2JzZXJ2YW5kbyBvIHBvb2wgZGUgdHJhbnNhY29lcyBwYXJhIHF1ZSBhIHJlc3Bvc3RhIHNlamEgZW52aWFkYS4KNS4gRXZlIHZlIGEgcmVzcG9zdGEgZGUgQm9iIGUgZWxlIHRhbWJlbSBjaGFtYSBjb21taXRTb2x1dGlvbigiMHhmOTViMWRkNjFlZGMzYmQ5NjJjZGVhMzk4N2M2ZjU1YmNiNzE0YTAyYTJjM2ViNzNiZDk2MGQ2YjQzODdmYzM2IikKICAgY29tIHVtIHByZWNvIGRlIGdhcyBtYWlzIGFsdG8gZG8gcXVlIEJvYiAoMTAwIGd3ZWkpLgo2LiBBIHRyYW5zYWNhbyBkZSBFdmUgZm9pIGV4dHJhaWRhIGFudGVzIGRhIHRyYW5zYWNhbyBkZSBCb2IsIG1hcyBFdmUgYWluZGEgbmFvIHJlY2ViZXUgYSByZWNvbXBlbnNhLgogICBFbGUgcHJlY2lzYSBjaGFtYXIgcmV2ZWxhU29sdXRpb24oKSBjb20gbyBzZWdyZWRvIGUgYSBzb2x1Y2FvIGV4YXRvcywgZW50YW8gZGlnYW1vcyBxdWUgZWxlIGVzdGEgb2JzZXJ2YW5kbyBvIHBvb2wgZGUgdHJhbnNhY29lcwogICBwYXJhIGxpZGVyYXIgQm9iIGNvbW8gZWxlIGZleiBhbnRlcmlvcm1lbnRlCjcuIEVtIHNlZ3VpZGEsIEJvYiBjaGFtYSBhIHJldmVsYWNhb1NvbHV0aW9uKCJFdGhlcmV1bSIsICJteXNlY3JldCIpIGNvbSBvIHByZWNvIGRvIGdhcyBkZWZpbmlkbyBwYXJhIDE1IGd3ZWk7CjguIFZhbW9zIGNvbnNpZGVyYXIgcXVlIEV2ZSBlc3RhIG9ic2VydmFuZG8gbyBwb29sIGRlIHRyYW5zYWNvZXMsIGVuY29udHJhIGEgdHJhbnNhY2FvIGRhIHNvbHVjYW8gZGUgcmV2ZWxhY2FvIGRlIEJvYiBlIGVsZSB0YW1iZW0gY2hhbWEKICAgcmV2ZWxhclNvbHV0aW9uKCJFdGhlcmV1bSIsICJteXNlY3JldCIpIGNvbSBwcmVjbyBkZSBnYXMgbWFpcyBhbHRvIHF1ZSBCb2IgKDEwMCBnd2VpKQo5LiBWYW1vcyBjb25zaWRlcmFyIHF1ZSBkZXN0YSB2ZXogdGFtYmVtIGEgdHJhbnNhY2FvIGRlIHJldmVsYWNhbyBkZSBFdmUgZm9pIGV4dHJhaWRhIGFudGVzIGRhIHRyYW5zYWNhbyBkZSBCb2IsIG1hcyBFdmUgc2VyYQogICByZXZlcnRpZG8gY29tIG8gZXJybyAiSGFzaCBuYW8gY29ycmVzcG9uZGUiLiBDb21vIGEgZnVuY2FvIHJldmVsYVNvbHV0aW9uKCkgdmVyaWZpY2EgbyBoYXNoIHVzYW5kbwogICBrZWNjYWsyNTYobXNnLnNlbmRlciArIHNvbHVjYW8gKyBzZWdyZWRvKS4gUG9ydGFudG8sIGRlc3RhIHZleiwgYSB2ZXNwZXJhIG5hbyBjb25zZWd1ZSBnYW5oYXIgYSByZWNvbXBlbnNhLgoxMC5NYXMgQm9iJ3MgcmV2ZWxhU29sdXRpb24oIkV0aGVyZXVtIiwgIm15c2VjcmV0IikgcGFzc2EgbmEgdmVyaWZpY2FjYW8gZGUgaGFzaCBlIHJlY2ViZSBhIHJlY29tcGVuc2EgZGUgMTAgZXRoZXIuCiovCgoKY29udHJhY3QgU2VjdXJlZEZpbmRUaGlzSGFzaCB7CgogICAgLy8gU3RydWN0IGUgdXNhZG8gcGFyYSBhcm1hemVuYXIgb3MgZGV0YWxoZXMgZG8gY29tbWl0CiAgICBzdHJ1Y3QgQ29tbWl0IHsKICAgICAgICBieXRlczMyIHNvbHV0aW9uSGFzaDsKICAgICAgICB1aW50IGNvbW1pdFRpbWU7CiAgICAgICAgYm9vbCByZXZlYWxlZDsKICAgIH0KCiAgICAvLyBPIGhhc2ggcXVlIGUgbmVjZXNzYXJpbyBwYXJhIHNlciByZXNvbHZpZG8KICAgIGJ5dGVzMzIgcHVibGljIGhhc2ggPSAweDU2NGNjYWY3NTk0ZDY2YjFlYWFlYTI0ZmUwMWYwNTg1YmY1MmVlNzA4NTJhZjRlYWMwY2M0YjA0NzExY2QwZTI7CgogICAgLy8gRW5kZXJlY28gZG8gdmVuY2Vkb3IKICAgIGFkZHJlc3MgcHVibGljIHdpbm5lcjsKCiAgICAvLyBQcmVjbyBhIHNlciByZWNvbXBlbnNhZG8KICAgIHVpbnQgcHVibGljIHJld2FyZDsKCiAgICAvLyBTdGF0dXMgZG8gam9nbwogICAgYm9vbCBwdWJsaWMgZW5kZWQ7CgogICAgLy8gTWFwcGluZyBwYXJhIGFybWF6ZW5hciBvcyBkZXRhbGhlcyBkbyBjb21taXQgY29tIGVuZGVyZWNvCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gQ29tbWl0KSBjb21taXRzOwoKICAgIC8vIE1vZGlmaWVyIHBhcmEgdmVyaWZpY2FyIHNlIG8gam9nbyBlc3RhIGF0aXZvCiAgICBtb2RpZmllciBnYW1lQWN0aXZlIHsKICAgICAgICByZXF1aXJlKCFlbmRlZCwgIkFscmVhZHkgZW5kZWQiKTsKICAgICAgICBfOwogICAgfQoKICAgIGNvbnN0cnVjdG9yKCkgcGF5YWJsZSB7CiAgICAgICAgcmV3YXJkID0gbXNnLnZhbHVlOwogICAgfQoKICAgIC8qCiAgICAgIEZ1bmNhbyBkZSBjb25maXJtYWNhbyBwYXJhIGFybWF6ZW5hciBvIGhhc2ggY2FsY3VsYWRvIHVzYW5kbyBrZWNjYWsyNTYgKGVuZGVyZWNvIGVtIG1pbnVzY3VsYXMgKyBzb2x1Y2FvICsgc2VncmVkbykuCiAgICAgICAgT3MgdXN1YXJpb3Mgc28gcG9kZW0gc2UgY29tcHJvbWV0ZXIgdW1hIHZleiBlIHNlIG8gam9nbyBlc3RpdmVyIGF0aXZvLgogICAgKi8KICAgIGZ1bmN0aW9uIGNvbW1pdFNvbHV0aW9uKGJ5dGVzMzIgX3NvbHV0aW9uSGFzaCkgcHVibGljIGdhbWVBY3RpdmUgewogICAgICAgIENvbW1pdCBzdG9yYWdlIGNvbW1pdCA9IGNvbW1pdHNbbXNnLnNlbmRlcl07CiAgICAgICAgcmVxdWlyZShjb21taXQuY29tbWl0VGltZSA9PSAwLCAiQWxyZWFkeSBjb21taXR0ZWQiKTsKICAgICAgICBjb21taXQuc29sdXRpb25IYXNoID0gX3NvbHV0aW9uSGFzaDsKICAgICAgICBjb21taXQuY29tbWl0VGltZSA9IGJsb2NrLnRpbWVzdGFtcDsKICAgICAgICBjb21taXQucmV2ZWFsZWQgPSBmYWxzZTsKICAgIH0KCiAgICAvKgogICAgICAgIEZ1bmNhbyBwYXJhIG9idGVyIG9zIGRldGFsaGVzIGRvIGNvbW1pdC4gRWxlIHJldG9ybmEgdW1hIHR1cGxhIGRlIChzb2x1dGlvbkhhc2gsIGNvbW1pdFRpbWUsIHJldmVsYVN0YXR1cyk7CiAgICAgICAgICAgIE9zIHVzdWFyaW9zIHBvZGVtIG9idGVyIGEgc29sdWNhbyBzb21lbnRlIHNlIG8gam9nbyBlc3RpdmVyIGF0aXZvIGUgZWxlcyBjb25maXJtYXJhbSB1bSBzb2x1dGlvbkhhc2gKCiAgICAqLwogICAgZnVuY3Rpb24gZ2V0TXlTb2x1dGlvbigpIHB1YmxpYyB2aWV3IGdhbWVBY3RpdmUgcmV0dXJucyhieXRlczMyLCB1aW50LCBib29sKSB7CiAgICAgICAgQ29tbWl0IHN0b3JhZ2UgY29tbWl0ID0gY29tbWl0c1ttc2cuc2VuZGVyXTsKICAgICAgICByZXF1aXJlKGNvbW1pdC5jb21taXRUaW1lICE9IDAsICJOb3QgY29tbWl0dGVkIHlldCIpOwogICAgICAgIHJldHVybiAoY29tbWl0LnNvbHV0aW9uSGFzaCwgY29tbWl0LmNvbW1pdFRpbWUsIGNvbW1pdC5yZXZlYWxlZCk7CiAgICB9CgogICAgLyoKICAgICAgICBGdW5jYW8gcGFyYSByZXZlbGFyIG8gY29tbWl0IGUgcmVjZWJlciBhIHJlY29tcGVuc2EuCiAgICAgICAgT3MgdXN1YXJpb3MgcG9kZW0gb2J0ZXIgYSBzb2x1Y2FvIGRlIHJldmVsYWNhbyBzb21lbnRlIHNlIG8gam9nbyBlc3RpdmVyIGF0aXZvIGUgZWxlcyBjb25maXJtYXJhbSB1bSBzb2x1dGlvbkhhc2ggZSBhaW5kYSBuYW8gZm9yYW0gcmV2ZWxhZG9zLgogICAgICAgIEVsZSBnZXJhIHVtIGtlY2NhazI1Nihtc2cuc2VuZGVyICsgc29sdWNhbyArIHNlZ3JlZG8pIGUgbyB2ZXJpZmljYSBjb20gbyBoYXNoIGNvbmZpcm1hZG8gYW50ZXJpb3JtZW50ZS4KICAgICAgICBPcyBxdWUgZXN0YW8gbmEgZnJlbnRlIG5hbyBwb2RlcmFvIHBhc3NhciBuZXN0YSB2ZXJpZmljYWNhbywgcG9pcyBvIG1zZy5zZW5kZXIgZSBkaWZlcmVudGUuCiAgICAgICAgRW0gc2VndWlkYSwgYSBzb2x1Y2FvIHJlYWwgZSB2ZXJpZmljYWRhIHVzYW5kbyBrZWNjYWsyNTYoc29sdXRpb24pLCBzZSBhIHNvbHVjYW8gY29ycmVzcG9uZGVyLCBvIHZlbmNlZG9yIGUgZGVjbGFyYWRvLAogICAgICAgIG8gam9nbyB0ZXJtaW5hIGUgbyB2YWxvciBkYSByZWNvbXBlbnNhIGUgZW52aWFkbyBhbyB2ZW5jZWRvci4KICAgICovCiAgICBmdW5jdGlvbiByZXZlYWxTb2x1dGlvbiAoc3RyaW5nIG1lbW9yeSBfc29sdXRpb24sIHN0cmluZyBtZW1vcnkgX3NlY3JldCkgcHVibGljIGdhbWVBY3RpdmUgewogICAgICAgIENvbW1pdCBzdG9yYWdlIGNvbW1pdCA9IGNvbW1pdHNbbXNnLnNlbmRlcl07CiAgICAgICAgcmVxdWlyZShjb21taXQuY29tbWl0VGltZSAhPSAwLCAiTm90IGNvbW1pdHRlZCB5ZXQiKTsKICAgICAgICByZXF1aXJlKCFjb21taXQucmV2ZWFsZWQsICJBbHJlYWR5IGNvbW1pdGVkIGFuZCByZXZlYWxlZCIpOwoKICAgICAgICBieXRlczMyIHNvbHV0aW9uSGFzaCA9IGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKFN0cmluZ3MudG9IZXhTdHJpbmcobXNnLnNlbmRlciksIF9zb2x1dGlvbiwgX3NlY3JldCkpOwogICAgICAgIHJlcXVpcmUoc29sdXRpb25IYXNoID09IGNvbW1pdC5zb2x1dGlvbkhhc2gsICJIYXNoIGRvZXNuJ3QgbWF0Y2giKTsKCiAgICAgICAgcmVxdWlyZShrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfc29sdXRpb24pKSAhPSBoYXNoLCAiSW5jb3JyZWN0IGFuc3dlciIpOwoKICAgICAgICB3aW5uZXIgPSBtc2cuc2VuZGVyOwogICAgICAgIGVuZGVkID0gdHJ1ZTsKCiAgICAgICAgKGJvb2wgc2VudCwpID0gcGF5YWJsZShtc2cuc2VuZGVyKS5jYWxse3ZhbHVlOiByZXdhcmR9KCIiKTsKICAgICAgICBpZighc2VudCl7CiAgICAgICAgICAgIHdpbm5lciA9IGFkZHJlc3MoMCk7CiAgICAgICAgICAgIGVuZGVkID0gZmFsc2U7CiAgICAgICAgICAgIHJldmVydCgiRmFpbGVkIHRvIHNlbmQgZXRoZXIuIik7CiAgICAgICAgfQogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
