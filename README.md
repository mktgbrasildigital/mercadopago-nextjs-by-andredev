# Integração Mercado Pago com Next.js

Este repositório contém o código fonte do tutorial sobre como integrar a API do Mercado Pago em uma aplicação Next.js para receber pagamentos via cartão de crédito e PIX.

## 📺 Tutorial

Assista ao tutorial completo no meu canal:

- [Como Integrar Mercado Pago com Next.js - Receba Pagamentos por PIX e Cartão](https://youtu.be/og6OBnvOVBE)

## 🔗 Links

- [Canal Andre Dev no YouTube](https://www.youtube.com/@andreeliasdev)

## ✨ Funcionalidades

### Pagamentos Únicos

- Integração com API do Mercado Pago
- Pagamentos via:
  - Cartão de crédito (até 12x)
  - PIX
- Webhook para confirmação de pagamentos
- Tratamento de pagamentos pendentes

### Assinaturas Recorrentes 🆕

- **Plano Mensal**: R$ 14,90/mês
- **Plano Anual**: R$ 119,90/ano (economia de ~33%)
- Renovação automática
- Gerenciamento via webhook
- 📖 [Guia Completo de Assinaturas](./GUIA_ASSINATURAS.md)

### Segurança

- Verificação de assinatura HMAC do Mercado Pago
- Validação de webhooks
- Testes automatizados completos

## 🚀 Tecnologias

- Next.js 15+ (App Router)
- TypeScript
- SDK Mercado Pago
- TailwindCSS

## 🧪 Testes Automatizados

Este projeto conta com uma suite completa de testes automatizados para garantir a qualidade do código:

- ✅ **33 testes** cobrindo todas as rotas da API (incluindo assinaturas)
- ✅ **Jest** como framework de testes
- ✅ **Husky** para executar testes antes de commits
- ✅ Cobertura de código completa

### Comandos de Teste

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Documentação dos Testes

- 📖 [Guia Completo de Testes](./TESTING.md)
- 📋 [Checklist de Validação](./CHECKLIST_VALIDACAO.md)
- 📝 [Detalhes da Implementação](./IMPLEMENTACAO_TESTES.md)

### Pre-commit Hook

Os testes são executados automaticamente antes de cada commit. Se algum teste falhar, o commit será bloqueado, garantindo que apenas código testado entre no repositório.

## 📦 Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/mercadopago-nextjs-by-andredev.git
cd mercadopago-nextjs-by-andredev
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais do Mercado Pago
```

4. Execute os testes (opcional)

```bash
npm test
```

5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

6. Acesse a página de testes

```
http://localhost:3000/teste
```

📖 [Guia completo da página de testes](./PAGINA_TESTE.md)

---

⭐ Se este repositório te ajudou, não esqueça de deixar uma estrela!

Feito por [Andre Dev](https://www.youtube.com/@andreeliasdev)
