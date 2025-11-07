# 🚀 Comandos Rápidos - Testes Automatizados

## 📦 Instalação

```bash
# Instalar todas as dependências
npm install

# Verificar instalação
npm list jest husky ts-jest
```

## 🧪 Executar Testes

```bash
# Todos os testes
npm test

# Apenas um arquivo
npm test create-checkout

# Modo watch (atualiza automaticamente)
npm run test:watch

# Com cobertura de código
npm run test:coverage

# Limpar cache do Jest
npx jest --clearCache
```

## 📊 Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Abrir relatório HTML
open coverage/lcov-report/index.html
# ou
xdg-open coverage/lcov-report/index.html  # Linux
```

## 🔍 Debugging

```bash
# Executar um teste específico
npm test -- -t "deve criar uma preferência com sucesso"

# Modo verbose (mais detalhes)
npm test -- --verbose

# Ver apenas testes que falharam
npm test -- --onlyFailures

# Executar com node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 🪝 Git Hooks

```bash
# Instalar hooks do Husky
npm run prepare

# Tornar pre-commit executável
chmod +x .husky/pre-commit

# Testar pre-commit manualmente
.husky/pre-commit

# Fazer commit (testes executam automaticamente)
git add .
git commit -m "feat: nova funcionalidade"

# Pular hook (NÃO RECOMENDADO)
git commit --no-verify -m "mensagem"
```

## 🔧 Manutenção

```bash
# Atualizar dependências de teste
npm update jest @jest/globals ts-jest

# Verificar versões
npm list --depth=0 | grep -E 'jest|husky'

# Reinstalar tudo
rm -rf node_modules package-lock.json
npm install
```

## 🏗️ Desenvolvimento

```bash
# Criar novo teste
# 1. Crie arquivo: app/api/nova-rota/__tests__/route.test.ts
# 2. Execute:
npm test nova-rota

# Verificar setup completo
chmod +x check-tests.sh
./check-tests.sh

# Rodar testes específicos
npm test webhook
npm test pending
npm test mercado-pago
```

## 🔄 CI/CD (Opcional)

```bash
# Copiar exemplo de workflow
mkdir -p .github/workflows
cp .github-workflows-example.yml .github/workflows/tests.yml

# Editar conforme necessário
nano .github/workflows/tests.yml
```

## 📝 Logs e Debug

```bash
# Ver saída completa dos testes
npm test -- --verbose --no-coverage

# Apenas testes que falharam na última execução
npm test -- --onlyFailures

# Executar sequencialmente (útil para debug)
npm test -- --runInBand

# Mostrar configuração do Jest
npx jest --showConfig
```

## 🎯 Comandos de Produção

```bash
# Verificar antes de deploy
npm run lint
npm test
npm run build

# Pipeline completo
npm install && npm test && npm run build

# Verificar se tudo está OK
npm run test:coverage && \
npm run lint && \
npm run build && \
echo "✅ Tudo OK para deploy!"
```

## 🧹 Limpeza

```bash
# Limpar coverage
rm -rf coverage

# Limpar cache do Jest
npx jest --clearCache

# Limpar tudo e reinstalar
rm -rf node_modules coverage .next package-lock.json
npm install
```

## 📊 Análise

```bash
# Ver resumo de testes
npm test -- --listTests

# Ver suítes de teste
npm test -- --verbose

# Estatísticas de cobertura
npm run test:coverage -- --coverageReporters=text

# Relatório JSON
npm run test:coverage -- --json --outputFile=test-results.json
```

## 🔐 Variáveis de Ambiente

```bash
# Criar .env a partir do exemplo
cp .env.example .env

# Editar variáveis
nano .env

# Verificar se variáveis estão carregadas (em testes)
npm test -- --verbose | grep "MERCADO_PAGO"
```

## 🚨 Troubleshooting

```bash
# Erro: Cannot find module
npm install
npx jest --clearCache

# Erro: Pre-commit não funciona
chmod +x .husky/pre-commit
npm run prepare

# Erro: TypeScript
npm install --save-dev @types/jest @types/node

# Erro: Testes lentos
npm test -- --runInBand
npm test -- --maxWorkers=2

# Ver todos os erros
npm test -- --verbose --no-coverage
```

## 📱 One-Liners Úteis

```bash
# Setup completo do zero
npm install && npm test && echo "✅ Setup OK!"

# Verificação rápida
npm test && npm run lint && echo "✅ Tudo OK!"

# Deploy-ready check
npm ci && npm test && npm run build && echo "🚀 Pronto para deploy!"

# Atualizar e testar
npm update && npm test

# Limpar e resetar
rm -rf node_modules package-lock.json && npm install && npm test
```

## 🎓 Exemplos de Uso

```bash
# Desenvolver nova feature
npm run test:watch  # Em um terminal
npm run dev         # Em outro terminal

# Antes de fazer PR
npm run lint
npm run test:coverage
git add .
git commit -m "feat: nova funcionalidade"

# Code review
npm test -- --coverage --verbose

# Deploy
npm ci
npm test
npm run build
npm start
```

## 💡 Dicas

```bash
# Alias úteis (adicione ao ~/.bashrc ou ~/.zshrc)
alias t='npm test'
alias tw='npm run test:watch'
alias tc='npm run test:coverage'

# Verificar antes de commit
alias pre='npm run lint && npm test'

# Pipeline completo
alias full='npm install && npm run lint && npm test && npm run build'
```

## 📚 Ajuda

```bash
# Ver ajuda do Jest
npx jest --help

# Ver configuração
npx jest --showConfig

# Ver versão
npx jest --version

# Documentação completa
cat TESTING.md
cat CHECKLIST_VALIDACAO.md
cat RESUMO_EXECUTIVO.md
```

---

💡 **Dica**: Adicione estes comandos aos seus favoritos ou crie aliases para agilizar seu workflow!
