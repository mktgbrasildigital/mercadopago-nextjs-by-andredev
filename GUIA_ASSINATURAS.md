# 💳 Guia de Assinaturas - Mercado Pago

## 📋 Visão Geral

Agora o sistema suporta **dois tipos de pagamento**:

1. **Pagamentos Únicos** (implementação original)

   - Rota: `/api/mercado-pago/create-checkout`
   - Use para: Compras avulsas, produtos individuais

2. **Assinaturas Recorrentes** (nova implementação)
   - Rota: `/api/mercado-pago/create-subscription`
   - Use para: Planos mensais e anuais

---

## 💰 Planos Disponíveis

### Plano Mensal

- **Valor**: R$ 14,90/mês
- **Renovação**: Automática a cada 1 mês
- **Código**: `monthly`

### Plano Anual

- **Valor**: R$ 119,90/ano
- **Renovação**: Automática a cada 12 meses
- **Economia**: ~33% vs mensal
- **Código**: `annual`

---

## 🚀 Como Usar

### 1. Criar Assinatura (Frontend)

```typescript
// Exemplo de chamada para criar assinatura
async function createSubscription(
  planType: "monthly" | "annual",
  userEmail: string
) {
  const response = await fetch("/api/mercado-pago/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planType: planType, // 'monthly' ou 'annual'
      userEmail: userEmail, // Email do usuário
      userId: "user-123", // ID do usuário no seu sistema
    }),
  });

  const data = await response.json();

  if (response.ok) {
    // Redirecionar para o checkout do Mercado Pago
    window.location.href = data.initPoint;
  } else {
    console.error("Erro ao criar assinatura:", data.error);
  }
}

// Exemplo de uso:
createSubscription("monthly", "usuario@email.com");
createSubscription("annual", "usuario@email.com");
```

### 2. Componente React de Exemplo

```tsx
"use client";

import { useState } from "react";

export default function SubscriptionPlans() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planType: "monthly" | "annual") => {
    setLoading(true);

    try {
      const response = await fetch("/api/mercado-pago/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType,
          userEmail: "usuario@email.com", // Pegar do contexto/sessão
          userId: "user-123", // Pegar do contexto/sessão
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.initPoint;
      } else {
        alert("Erro ao criar assinatura: " + data.error);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 p-8">
      {/* Plano Mensal */}
      <div className="border rounded-lg p-6 w-64">
        <h3 className="text-2xl font-bold mb-2">Plano Mensal</h3>
        <p className="text-gray-600 mb-4">Renovação mensal</p>
        <div className="text-3xl font-bold mb-6">
          R$ 14,90<span className="text-sm text-gray-500">/mês</span>
        </div>
        <button
          onClick={() => handleSubscribe("monthly")}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processando..." : "Assinar Mensal"}
        </button>
      </div>

      {/* Plano Anual */}
      <div className="border-2 border-blue-500 rounded-lg p-6 w-64 relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Melhor Oferta
        </div>
        <h3 className="text-2xl font-bold mb-2">Plano Anual</h3>
        <p className="text-gray-600 mb-4">Renovação anual</p>
        <div className="text-3xl font-bold mb-2">
          R$ 119,90<span className="text-sm text-gray-500">/ano</span>
        </div>
        <p className="text-sm text-green-600 mb-4">Economize 33% vs mensal</p>
        <button
          onClick={() => handleSubscribe("annual")}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processando..." : "Assinar Anual"}
        </button>
      </div>
    </div>
  );
}
```

---

## 🔔 Webhook - Eventos de Assinatura

O webhook agora processa os seguintes eventos:

### Eventos Suportados

1. **`subscription_preapproval`**

   - Disparado quando assinatura é criada/atualizada

2. **`subscription_authorized_payment`**
   - Disparado quando pagamento recorrente é autorizado

### Status de Assinatura

- **`authorized`**: Assinatura ativa ✅
- **`paused`**: Assinatura pausada ⏸️
- **`cancelled`**: Assinatura cancelada ❌
- **`pending`**: Aguardando pagamento ⏳

### Handler de Assinatura

O arquivo `/app/server/mercado-pago/handle-subscription.ts` processa os eventos:

```typescript
// Exemplo de implementação
if (status === "authorized") {
  // Liberar acesso ao usuário
  // Atualizar banco de dados
  // Enviar email de boas-vindas
}

if (status === "cancelled") {
  // Remover acesso
  // Enviar email de cancelamento
}
```

---

## 🔧 Configuração no Mercado Pago

### 1. Ativar Assinaturas

1. Acesse o [Painel do Mercado Pago](https://www.mercadopago.com.br/developers)
2. Vá em **Suas integrações** → **Configurar**
3. Ative **Assinaturas (Preapproval)**

### 2. Configurar Webhook

URL do Webhook (mesma que antes):

```
https://seu-dominio.com/api/mercado-pago/webhook
```

Eventos a habilitar:

- ✅ `payment`
- ✅ `subscription_preapproval`
- ✅ `subscription_authorized_payment`

---

## 📊 Diferenças: Pagamento Único vs Assinatura

| Característica | Pagamento Único    | Assinatura             |
| -------------- | ------------------ | ---------------------- |
| Rota API       | `/create-checkout` | `/create-subscription` |
| Renovação      | Não                | Automática             |
| Evento Webhook | `payment`          | `subscription_*`       |
| Cancelamento   | N/A                | Usuário pode cancelar  |
| Gestão         | Uma vez só         | Painel de assinaturas  |

---

## 💡 Dicas Importantes

### Gestão de Assinaturas

1. **Armazene o `subscriptionId`** no seu banco de dados
2. **Monitore o status** através dos webhooks
3. **Permita cancelamento** pelo usuário
4. **Envie lembretes** antes da renovação

### Segurança

```typescript
// Sempre valide no backend
if (!userEmail || !planType) {
  return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
}

// Verifique se usuário está autenticado
// Use o userId da sessão, não do frontend
```

### Tratamento de Erros

```typescript
try {
  const response = await fetch("/api/mercado-pago/create-subscription", {
    // ...
  });

  if (!response.ok) {
    const error = await response.json();
    // Mostrar mensagem de erro amigável
    alert(error.error || "Erro ao processar assinatura");
  }
} catch (error) {
  // Erro de rede
  alert("Erro de conexão. Tente novamente.");
}
```

---

## 🧪 Testar Assinaturas

### Modo Sandbox (Teste)

1. Use credenciais de **teste** do Mercado Pago
2. Cartões de teste: [Lista oficial](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/test-cards)
3. As assinaturas criadas são simuladas

### Validação

```bash
# Criar assinatura de teste
curl -X POST http://localhost:3000/api/mercado-pago/create-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "planType": "monthly",
    "userEmail": "teste@email.com",
    "userId": "user-test-123"
  }'
```

---

## 📚 Próximos Passos

1. ✅ Integrar com seu sistema de autenticação
2. ✅ Criar página de gerenciamento de assinatura
3. ✅ Implementar cancelamento de assinatura
4. ✅ Adicionar página de sucesso após assinatura
5. ✅ Enviar emails transacionais
6. ✅ Adicionar analytics/tracking

---

## 🆘 Suporte

### Documentação Oficial

- [Assinaturas Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/subscriptions)
- [API PreApproval](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/additional-content/notifications)

### Troubleshooting

**Erro: "Tipo de plano inválido"**

- Certifique-se de usar `'monthly'` ou `'annual'`

**Webhook não recebe eventos de assinatura**

- Verifique se habilitou eventos de `subscription_*` no painel

**Assinatura não renova automaticamente**

- Verifique se o cartão do usuário está válido
- Confira configuração de renovação automática

---

**Pronto! Agora você tem um sistema completo de assinaturas mensais e anuais! 🎉**
