# 🧪 Página de Testes - Mercado Pago

## 📍 Acesso

Acesse a página de testes em:

```
http://localhost:3000/teste
```

---

## ✨ Funcionalidades

A página de testes oferece 3 botões para testar todas as funcionalidades:

### 1. 💳 **Pagamento Único** (R$ 9,99)

- Testa checkout com cartão de crédito ou Pix
- Pagamento avulso, não recorrente
- Até 12x sem juros

### 2. 📅 **Plano Mensal** (R$ 14,90/mês)

- Testa assinatura com renovação automática mensal
- Cobrança todo mês automaticamente

### 3. 🎉 **Plano Anual** (R$ 119,90/ano)

- Testa assinatura com renovação automática anual
- Economia de ~33% vs plano mensal

---

## 🚀 Como Usar

### **Passo 1: Configurar Credenciais**

Certifique-se de que seu arquivo `.env` está configurado:

```bash
# .env
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890-abcdef  # Use token de TESTE
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret
```

### **Passo 2: Iniciar o Servidor**

```bash
npm run dev
```

### **Passo 3: Acessar a Página**

Abra o navegador em:

```
http://localhost:3000/teste
```

### **Passo 4: Testar**

1. Clique em um dos botões (ex: "Testar Checkout")
2. Uma nova aba abrirá com o checkout do Mercado Pago
3. Use um cartão de teste para simular o pagamento
4. Após completar, você será redirecionado de volta

---

## 💳 Cartões de Teste

Use estes cartões para simular pagamentos no ambiente de teste:

### ✅ **Cartão Aprovado**

```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO (Aprovado)
```

### ❌ **Cartão Recusado**

```
Número: 5031 7557 3453 0604
CVV: 123
Validade: 11/25
Nome: OTHE (Recusado)
```

### 🔄 **Outros Cartões de Teste**

Consulte a [documentação oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/test-cards) para mais cartões.

---

## 🔍 O Que Acontece nos Bastidores?

### Quando você clica em "Testar Checkout":

1. ✅ Frontend faz POST para `/api/mercado-pago/create-checkout`
2. ✅ Backend cria uma preferência no Mercado Pago
3. ✅ Retorna `initPoint` (URL do checkout)
4. ✅ Nova aba abre com o checkout
5. ✅ Cliente paga (simulado com cartão de teste)
6. ✅ Mercado Pago redireciona de volta
7. ✅ Webhook é chamado automaticamente
8. ✅ Backend processa o pagamento

### Quando você clica em "Testar Mensal/Anual":

1. ✅ Frontend faz POST para `/api/mercado-pago/create-subscription`
2. ✅ Backend cria uma assinatura no Mercado Pago
3. ✅ Retorna `initPoint` (URL da assinatura)
4. ✅ Nova aba abre para cadastro de assinatura
5. ✅ Cliente autoriza a renovação automática
6. ✅ Webhook é chamado quando aprovado
7. ✅ Backend ativa a assinatura

---

## 📊 Verificando os Resultados

### **Console do Navegador**

Abra o DevTools (F12) para ver:

- Requisições feitas
- Respostas recebidas
- Erros (se houver)

### **Console do Servidor**

No terminal onde rodou `npm run dev`, você verá:

```
✅ Preferência criada: 123456789-abc...
🔔 Webhook recebido: payment
✅ Assinatura validada
```

### **Painel do Mercado Pago**

1. Acesse [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Vá em **Suas integrações** → **Testes**
3. Veja os pagamentos e assinaturas criados

---

## 🎨 Interface da Página

A página inclui:

- ✅ **3 Botões de Teste** (Checkout, Mensal, Anual)
- ✅ **Exibição de Resultados** (JSON da resposta)
- ✅ **Exibição de Erros** (caso algo dê errado)
- ✅ **Informações Úteis** (cartões de teste, status da integração)
- ✅ **Design Responsivo** (funciona em mobile)
- ✅ **Loading States** (feedback visual durante requisições)

---

## 🐛 Troubleshooting

### Erro: "Não foi possível criar preferência"

**Solução:**

1. ✅ Verifique se `MERCADO_PAGO_ACCESS_TOKEN` está configurado
2. ✅ Certifique-se de estar usando token de TESTE
3. ✅ Veja o console do servidor para mais detalhes

### Erro: "Network Error"

**Solução:**

1. ✅ Certifique-se de que o servidor está rodando (`npm run dev`)
2. ✅ Verifique se está acessando `http://localhost:3000/teste`

### Checkout não abre

**Solução:**

1. ✅ Verifique se o bloqueador de pop-ups está ativado
2. ✅ Permita pop-ups para localhost
3. ✅ Veja a resposta no console do navegador

### Webhook não é chamado

**Solução:**

1. ✅ Em ambiente local, o webhook NÃO será chamado (Mercado Pago precisa de URL pública)
2. ✅ Use [ngrok](https://ngrok.com/) para expor localhost:
   ```bash
   ngrok http 3000
   ```
3. ✅ Configure a URL do ngrok no painel do Mercado Pago

---

## 🔐 Segurança

### ⚠️ **IMPORTANTE:**

Esta página de testes:

- ✅ É segura em **desenvolvimento**
- ❌ **NÃO deve** ser exposta em produção
- ✅ Use apenas com credenciais de **TESTE**
- ✅ Remova ou proteja antes do deploy

### Para Produção:

```typescript
// Adicione verificação de ambiente
if (process.env.NODE_ENV === "production") {
  return <div>Página não disponível em produção</div>;
}
```

Ou simplesmente delete a pasta `/app/teste` antes do deploy.

---

## 📝 Customização

### Alterar Valores de Teste

Edite `/app/teste/page.tsx`:

```typescript
// Alterar email de teste
body: JSON.stringify({
  testeId: `order-${Date.now()}`,
  userEmail: "seu-email@teste.com", // ← Aqui
});

// Alterar userId
body: JSON.stringify({
  planType: "monthly",
  userEmail: "teste@email.com",
  userId: `user-customizado-123`, // ← Aqui
});
```

### Adicionar Mais Testes

```typescript
const testCustom = async () => {
  const response = await fetch("/api/sua-rota", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      /* seus dados */
    }),
  });
  // processar resposta
};
```

---

## 📚 Exemplos de Código

### Copiar para seu Frontend

```typescript
// Exemplo: Integrar no seu frontend real
async function criarCheckout() {
  try {
    const response = await fetch("/api/mercado-pago/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testeId: orderId, // ID do pedido no seu sistema
        userEmail: user.email, // Email do cliente
      }),
    });

    const { initPoint } = await response.json();

    // Opção 1: Redirecionar na mesma aba
    window.location.href = initPoint;

    // Opção 2: Abrir em nova aba
    window.open(initPoint, "_blank");

    // Opção 3: Usar em modal/iframe
    // (requer configuração adicional)
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
  }
}
```

---

## ✅ Checklist de Testes

Use esta página para validar:

- [ ] Checkout com cartão de crédito funciona
- [ ] Checkout com Pix funciona (em produção)
- [ ] Assinatura mensal é criada
- [ ] Assinatura anual é criada
- [ ] Redirecionamento após pagamento funciona
- [ ] Webhook é chamado (em produção com URL pública)
- [ ] Erros são tratados corretamente
- [ ] Loading states funcionam
- [ ] Respostas são exibidas corretamente

---

## 🎯 Conclusão

Esta página de testes facilita MUITO o desenvolvimento! Você pode:

- ✅ Testar rapidamente sem integrar frontend
- ✅ Validar se as APIs estão funcionando
- ✅ Ver respostas em tempo real
- ✅ Debugar problemas facilmente
- ✅ Demonstrar funcionalidades para o time

**É totalmente recomendado ter uma página assim durante o desenvolvimento!**

---

## 🔗 Links Úteis

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/test-cards)
- [Painel do Desenvolvedor](https://www.mercadopago.com.br/developers/panel)
- [Ngrok (para testar webhook localmente)](https://ngrok.com/)

---

**Data:** 07/11/2025  
**Rota:** `/teste`  
**Status:** ✅ Funcionando
