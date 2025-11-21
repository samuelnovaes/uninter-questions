# Uninter Questions

Banco de questões e simulados do curso de Análise e Desenvolvimento de Sistemas da Uninter.<br>

**[➡️ Acessar o site](https://samuelnovaes.github.io/uninter-questions)**

## 🏁 Rodando o Projeto Localmente

- Instale o [Node.js](https://nodejs.org/pt)
- Clone o repositório: `git clone https://github.com/samuelnovaes/uninter-questions.git`
- Acesse o diretório: `cd ./uninter-questions`
- Instale as dependências: `npm ci`
- Inicie em modo desenvolvimento: `npm start`

## Como contribuir

Mantenha o banco de questões (`public/repository.json`) atualizado.

### Atualizando o Banco de Questões

- Execute: `npm run crawler`
- Siga as instruções no terminal para adicionar novas questões.
- Após atualizar o arquivo, envie um Pull Request.

### Resolvendo Conflitos de Merge

Se houver conflitos no `repository.json`, execute:

```bash
npm run fix-conflicts
```

O script irá unir as questões e resolver os conflitos automaticamente.