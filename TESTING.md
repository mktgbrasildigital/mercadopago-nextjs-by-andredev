# Testes Automatizados - Backend Mercado Pago

Este projeto conta com testes automatizados para garantir a qualidade e funcionamento do backend de integração com o Mercado Pago.

## 🧪 Tecnologias de Teste

- **Jest**: Framework de testes
- **ts-jest**: Suporte a TypeScript
- **Husky**: Git hooks para executar testes antes de commits

## 📋 Cobertura de Testes

### Rotas API Testadas

1. **POST /api/mercado-pago/create-checkout**

   - ✅ Criação de preferência com sucesso
   - ✅ Criação sem email do usuário
   - ✅ Validação de erros
   - ✅ Verificação de back_urls corretas

2. **POST /api/mercado-pago/webhook**

   - ✅ Processamento de pagamento aprovado
   - ✅ Processamento de pagamento Pix
   - ✅ Rejeição de pagamentos pendentes
   - ✅ Verificação de assinatura
   - ✅ Tratamento de eventos não suportados

3. **GET /api/mercado-pago/pending**
   - ✅ Redirecionamento para sucesso
   - ✅ Redirecionamento para home
   - ✅ Validação de parâmetros
   - ✅ Tratamento de erros

### Utilitários Testados

- **verifyMercadoPagoSignature**
  - ✅ Validação de assinatura HMAC
  - ✅ Rejeição de assinaturas inválidas
  - ✅ Validação de headers obrigatórios
  - ✅ Tratamento de formatos diversos

## 🚀 Como Executar os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch (desenvolvimento)

```bash
npm run test:watch
```

### Gerar relatório de cobertura

```bash
npm run test:coverage
```

## 🔒 Pre-commit Hook

Os testes são executados automaticamente antes de cada commit através do Husky. Se algum teste falhar, o commit será bloqueado.

### Como funciona:

1. Você executa `git commit`
2. O Husky executa automaticamente `npm test`
3. Se os testes passarem ✅ → commit é realizado
4. Se os testes falharem ❌ → commit é bloqueado

### Pular o hook (não recomendado):

```bash
git commit --no-verify -m "sua mensagem"
```

## 📁 Estrutura de Testes

```
app/
├── api/
│   └── mercado-pago/
│       ├── create-checkout/
│       │   ├── route.ts
│       │   └── __tests__/
│       │       └── route.test.ts
│       ├── webhook/
│       │   ├── route.ts
│       │   └── __tests__/
│       │       └── route.test.ts
│       └── pending/
│           ├── route.ts
│           └── __tests__/
│               └── route.test.ts
└── lib/
    ├── mercado-pago.ts
    └── __tests__/
        └── mercado-pago.test.ts
```

## ⚙️ Configuração

### jest.config.js

Configuração principal do Jest com suporte a Next.js e TypeScript.

### jest.setup.js

Configuração global dos testes, incluindo variáveis de ambiente de teste.

### .husky/pre-commit

Hook do Git que executa os testes antes de cada commit.

## 🔧 Manutenção

### Adicionar novos testes:

1. Crie um arquivo `*.test.ts` dentro da pasta `__tests__`
2. Importe a função/rota a ser testada
3. Escreva os casos de teste usando `describe` e `it`
4. Execute `npm test` para verificar

### Atualizar mocks:

Os mocks do Mercado Pago estão configurados em cada arquivo de teste. Ao adicionar novas funcionalidades, atualize os mocks correspondentes.

## 📊 Métricas de Qualidade

- **Cobertura mínima esperada**: 80%
- **Todos os endpoints devem ter testes**
- **Casos de erro devem ser testados**
- **Validações de entrada devem ser verificadas**

## 🐛 Troubleshooting

### Erro: "Cannot find module"

Execute: `npm install`

### Testes falhando localmente

1. Verifique se as variáveis de ambiente estão configuradas em `jest.setup.js`
2. Limpe o cache do Jest: `npx jest --clearCache`
3. Execute novamente: `npm test`

### Pre-commit hook não está funcionando

1. Verifique se o Husky está instalado: `npm install`
2. Torne o script executável: `chmod +x .husky/pre-commit`
3. Reinicialize o Husky: `npm run prepare`

## 📝 Boas Práticas

- ✅ Sempre escreva testes para novas funcionalidades
- ✅ Mantenha os testes simples e focados
- ✅ Use nomes descritivos para os testes
- ✅ Teste casos de sucesso e de erro
- ✅ Mock apenas o necessário
- ✅ Execute os testes antes de fazer push

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:

1. Escreva os testes primeiro (TDD)
2. Implemente a funcionalidade
3. Verifique se todos os testes passam
4. Faça commit (os testes serão executados automaticamente)
