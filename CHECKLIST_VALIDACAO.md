# ✅ Checklist de Validação - Testes Automatizados

Use este checklist para garantir que tudo está funcionando corretamente.

## 📦 Instalação

- [ ] Executar `npm install`
- [ ] Verificar se todas as dependências foram instaladas
- [ ] Confirmar que não há erros de instalação

## ⚙️ Configuração

- [ ] Arquivo `jest.config.js` criado
- [ ] Arquivo `jest.setup.js` criado
- [ ] Pasta `.husky` criada com pre-commit hook
- [ ] Arquivo `.env.example` criado
- [ ] Scripts de teste adicionados ao `package.json`

## 🧪 Testes

- [ ] Executar `npm test` pela primeira vez
- [ ] Todos os testes devem passar (26 testes)
- [ ] Verificar saída do Jest sem erros

### Testes por Módulo

**Create Checkout** (5 testes)

- [ ] ✅ Criação com sucesso
- [ ] ✅ Criação sem email
- [ ] ✅ Erro sem preferenceId
- [ ] ✅ Erro na API
- [ ] ✅ Back URLs corretas

**Webhook** (6 testes)

- [ ] ✅ Pagamento aprovado
- [ ] ✅ Pagamento Pix
- [ ] ✅ Pagamento pendente (não processa)
- [ ] ✅ Eventos não tratados
- [ ] ✅ Erro no processamento
- [ ] ✅ Verificação de assinatura

**Pending** (7 testes)

- [ ] ✅ Redirect sucesso (approved)
- [ ] ✅ Redirect sucesso (date_approved)
- [ ] ✅ Redirect home (pending)
- [ ] ✅ Erro sem payment_id
- [ ] ✅ Erro sem external_reference
- [ ] ✅ Erro sem parâmetros
- [ ] ✅ Redirect home (rejected)

**Mercado Pago Utils** (8 testes)

- [ ] ✅ Assinatura válida
- [ ] ✅ Assinatura inválida
- [ ] ✅ Sem x-signature
- [ ] ✅ Sem x-request-id
- [ ] ✅ Sem ts
- [ ] ✅ Sem v1
- [ ] ✅ Sem data.id
- [ ] ✅ Com espaços

## 🔄 Comandos de Teste

- [ ] `npm test` - Executa sem erros
- [ ] `npm run test:watch` - Inicia modo watch
- [ ] `npm run test:coverage` - Gera relatório de cobertura

## 🪝 Pre-commit Hook

- [ ] Fazer um teste de commit: `git add .` e `git commit -m "test"`
- [ ] Verificar se os testes são executados automaticamente
- [ ] Confirmar que commit é bloqueado se testes falharem
- [ ] Confirmar que commit passa se testes passarem

### Teste do Pre-commit

```bash
# 1. Fazer uma mudança que quebra um teste (opcional)
# 2. Tentar fazer commit
git add .
git commit -m "test commit"

# Resultado esperado:
# - Testes são executados
# - Se passar: commit é feito
# - Se falhar: commit é bloqueado
```

## 📊 Cobertura de Código

- [ ] Executar `npm run test:coverage`
- [ ] Verificar que cobertura é gerada em `/coverage`
- [ ] Revisar relatório de cobertura
- [ ] Confirmar que principais arquivos têm boa cobertura

### Arquivos que devem ter cobertura:

- [ ] `app/api/mercado-pago/create-checkout/route.ts`
- [ ] `app/api/mercado-pago/webhook/route.ts`
- [ ] `app/api/mercado-pago/pending/route.ts`
- [ ] `app/lib/mercado-pago.ts`

## 📝 Documentação

- [ ] Ler `TESTING.md` completo
- [ ] Ler `IMPLEMENTACAO_TESTES.md`
- [ ] Entender estrutura de testes
- [ ] Conhecer comandos disponíveis

## 🔒 Segurança

- [ ] Variáveis de ambiente mockadas em testes
- [ ] `.env` está no `.gitignore`
- [ ] `.env.example` criado sem credenciais reais
- [ ] Verificação de assinatura testada

## 🚀 Próximos Passos

- [ ] Configurar `.env` com credenciais reais (não commitar!)
- [ ] Testar integração real em ambiente de desenvolvimento
- [ ] Adicionar novos testes para novas funcionalidades
- [ ] Manter cobertura de testes acima de 80%

## 🐛 Troubleshooting

Se algo não funcionar:

1. **Testes não encontrados**

   ```bash
   npm install
   npx jest --clearCache
   ```

2. **Pre-commit não funciona**

   ```bash
   chmod +x .husky/pre-commit
   npm run prepare
   ```

3. **Erros de TypeScript**

   ```bash
   npm install --save-dev @types/jest
   ```

4. **Cobertura não gera**
   ```bash
   rm -rf coverage
   npm run test:coverage
   ```

## ✨ Validação Final

Execute este comando para validação completa:

```bash
chmod +x check-tests.sh && ./check-tests.sh
```

Ou manualmente:

```bash
# 1. Instalar dependências
npm install

# 2. Executar testes
npm test

# 3. Verificar cobertura
npm run test:coverage

# 4. Testar pre-commit
git add .
git commit -m "test: validação de testes"
```

## 🎯 Critérios de Sucesso

- ✅ Todos os 26 testes passando
- ✅ Pre-commit hook funcionando
- ✅ Cobertura de código > 80%
- ✅ Sem erros no console
- ✅ Documentação completa disponível

---

**Status**: [ ] Não validado | [ ] Em validação | [ ] ✅ Validado

**Data da validação**: **_/_**/**\_**

**Responsável**: ********\_********
