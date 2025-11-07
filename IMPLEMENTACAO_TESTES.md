# Backend Mercado Pago - Testes Automatizados

## ✅ O que foi implementado

### 1. **Configuração de Testes**

- ✅ Jest configurado com suporte a TypeScript e Next.js
- ✅ Ambiente de teste isolado com mocks
- ✅ Variáveis de ambiente mockadas para testes

### 2. **Testes Criados**

#### **API Routes**

- **`/api/mercado-pago/create-checkout`** (5 testes)

  - Criação de preferência com sucesso
  - Criação sem email do usuário
  - Validação quando não há preferenceId
  - Tratamento de erros da API
  - Verificação de back_urls corretas

- **`/api/mercado-pago/webhook`** (6 testes)

  - Processamento de pagamento aprovado (cartão)
  - Processamento de pagamento Pix aprovado
  - Não processamento de pagamentos pendentes
  - Tratamento de eventos não suportados
  - Tratamento de erros
  - Verificação de assinatura

- **`/api/mercado-pago/pending`** (7 testes)
  - Redirecionamento para sucesso (status approved)
  - Redirecionamento para sucesso (date_approved não null)
  - Redirecionamento para home (pagamento pendente)
  - Validação de parâmetros ausentes
  - Tratamento de pagamento rejeitado

#### **Utilitários**

- **`verifyMercadoPagoSignature`** (8 testes)
  - Validação de assinatura HMAC correta
  - Rejeição de assinatura inválida
  - Validação de headers obrigatórios
  - Formatos diversos de assinatura

### 3. **Scripts NPM**

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

### 4. **Pre-commit Hook**

- ✅ Husky configurado
- ✅ Testes executam automaticamente antes de cada commit
- ✅ Commits bloqueados se testes falharem

## 🚀 Como usar

### Executar testes

```bash
# Todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Fazer commit

```bash
git add .
git commit -m "sua mensagem"
# Os testes serão executados automaticamente!
```

### Se os testes falharem

- ❌ O commit será bloqueado
- ✅ Corrija os testes ou o código
- ✅ Tente fazer commit novamente

## 📊 Cobertura de Testes

Total de **26 testes** cobrindo:

- ✅ Todas as 3 rotas da API
- ✅ Função de verificação de assinatura
- ✅ Casos de sucesso e erro
- ✅ Validações de entrada
- ✅ Redirecionamentos corretos

## 📁 Arquivos Criados

```
/workspaces/mercadopago-nextjs-by-andredev/
├── jest.config.js                          # Configuração do Jest
├── jest.setup.js                           # Setup global dos testes
├── TESTING.md                              # Documentação completa
├── .env.example                            # Exemplo de variáveis
├── .husky/
│   ├── pre-commit                          # Hook pre-commit
│   └── _/
│       ├── husky.sh
│       └── .gitignore
└── app/
    ├── api/mercado-pago/
    │   ├── create-checkout/__tests__/route.test.ts
    │   ├── webhook/__tests__/route.test.ts
    │   └── pending/__tests__/route.test.ts
    └── lib/__tests__/mercado-pago.test.ts
```

## 🔒 Segurança

- ✅ Webhook protegido com verificação de assinatura HMAC
- ✅ Validação de headers obrigatórios
- ✅ Testes garantem que validações funcionam
- ✅ Variáveis sensíveis mockadas em testes

## 📚 Documentação

Consulte o arquivo `TESTING.md` para documentação completa sobre:

- Como adicionar novos testes
- Estrutura de testes
- Boas práticas
- Troubleshooting
- Métricas de qualidade

## 🎯 Próximos Passos

1. Execute `npm install` para instalar as dependências
2. Execute `npm test` para rodar os testes
3. Configure suas variáveis de ambiente reais no `.env`
4. Faça commits normalmente - os testes rodarão automaticamente!

## ⚠️ Importante

- Os testes usam **mocks** do Mercado Pago (não fazem chamadas reais à API)
- As variáveis de ambiente são **mockadas** para testes
- Configure o `.env` com suas credenciais reais para uso em produção
- Nunca commite o arquivo `.env` (já está no .gitignore)

---

**Tudo pronto!** 🎉 Agora você tem um backend com testes automatizados que verificam tudo antes de cada commit!
