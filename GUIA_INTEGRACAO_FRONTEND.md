# 🚀 Guia de Integração Frontend React/TypeScript (.tsx)

## 📋 **Para IA do AI Studio - Google**

Este guia contém instruções completas para integrar um frontend React/TypeScript (.tsx) com o backend MercadoPago NextJS Enterprise que foi desenvolvido.

---

## 🏗️ **Arquitetura do Backend Disponível**

### **Base URL da API:**

```
http://localhost:3000  (desenvolvimento)
https://sua-api.com    (produção)
```

### **Autenticação:**

- **Método:** API Key no header
- **Header:** `X-API-Key: sua-chave-aqui`
- **Tipo:** Bearer token não necessário

### **Rate Limits:**

- Checkout: 100 req/min
- Subscription: 50 req/min
- Webhook: 1000 req/min
- Transactions: 200 req/min

---

## 🔑 **Endpoints Disponíveis**

### **1. Criar Checkout (Pagamento Único)**

```
POST /api/mercado-pago/v2/create-checkout
Headers: X-API-Key: sua-chave
Body: {
  "produto": "Nome do Produto",
  "preco": 99.90,
  "email": "cliente@email.com",
  "order_id": "order-123"
}
Response: {
  "id": "12345678",
  "init_point": "https://mercadopago.com/checkout/...",
  "api_version": "v2",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### **2. Criar Assinatura Recorrente**

```
POST /api/mercado-pago/create-subscription
Headers: X-API-Key: sua-chave
Body: {
  "planType": "monthly" | "annual",
  "userEmail": "usuario@email.com",
  "userId": "user-123"
}
Response: {
  "id": "sub-98765432",
  "init_point": "https://mercadopago.com/subscription/...",
  "status": "pending",
  "plan_type": "monthly"
}
```

### **3. Listar Transações**

```
GET /api/mercado-pago/transactions?startDate=2024-01-01&endDate=2024-12-31&limit=20
Headers: X-API-Key: sua-chave
Response: {
  "transactions": [...],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### **4. Status de Pagamento**

```
GET /api/mercado-pago/payment/{paymentId}
Headers: X-API-Key: sua-chave
Response: {
  "id": "12345678",
  "status": "approved",
  "amount": 99.90,
  "payment_method": {...}
}
```

### **5. Cancelar Assinatura**

```
POST /api/mercado-pago/subscription/{subscriptionId}/cancel
Headers: X-API-Key: sua-chave
Response: {
  "status": "cancelled",
  "message": "Assinatura cancelada com sucesso"
}
```

### **6. Health Check**

```
GET /api/monitoring/health
Response: {
  "status": "healthy" | "warning" | "critical",
  "checks": {...},
  "metrics": {...}
}
```

---

## 🛠️ **SDK JavaScript Disponível (Recomendado)**

### **Instalação:**

```bash
npm install @mercadopago-nextjs/sdk
```

### **Uso Básico:**

```typescript
import { MercadoPagoClient } from "@mercadopago-nextjs/sdk";

const client = new MercadoPagoClient({
  apiKey: "sua-api-key",
  baseUrl: "http://localhost:3000",
});

// Criar checkout
const checkout = await client.createCheckout({
  produto: "Produto Premium",
  preco: 99.9,
  order_id: "order-123",
});

// Criar assinatura
const subscription = await client.createSubscription({
  planType: "monthly",
  userEmail: "user@email.com",
});
```

---

## 📱 **Exemplos de Integração Frontend React/TypeScript**

### **1. Hook Personalizado para MercadoPago**

```typescript
// hooks/useMercadoPago.ts
import { useState } from "react";

interface CheckoutData {
  produto: string;
  preco: number;
  email?: string;
  order_id: string;
}

interface CheckoutResponse {
  id: string;
  init_point: string;
  api_version: string;
  created_at: string;
}

export const useMercadoPago = (apiKey: string, baseUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = async (
    data: CheckoutData
  ): Promise<CheckoutResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/api/mercado-pago/v2/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar checkout");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (
    planType: "monthly" | "annual",
    userEmail: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/api/mercado-pago/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ planType, userEmail }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar assinatura");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    createSubscription,
    loading,
    error,
  };
};
```

### **2. Componente de Checkout**

```typescript
// components/CheckoutForm.tsx
import React, { useState } from "react";
import { useMercadoPago } from "../hooks/useMercadoPago";

interface CheckoutFormProps {
  apiKey: string;
  baseUrl: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  apiKey,
  baseUrl,
}) => {
  const [formData, setFormData] = useState({
    produto: "",
    preco: 0,
    email: "",
    order_id: "",
  });

  const { createCheckout, loading, error } = useMercadoPago(apiKey, baseUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `order-${Date.now()}`;
    const checkoutData = {
      ...formData,
      order_id: orderId,
      preco: Number(formData.preco),
    };

    const result = await createCheckout(checkoutData);

    if (result) {
      // Redirecionar para o checkout do MercadoPago
      window.location.href = result.init_point;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Criar Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Produto
          </label>
          <input
            type="text"
            value={formData.produto}
            onChange={(e) =>
              setFormData({ ...formData, produto: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) =>
              setFormData({ ...formData, preco: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email (opcional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Checkout"}
        </button>
      </form>
    </div>
  );
};
```

### **3. Componente de Assinatura**

```typescript
// components/SubscriptionForm.tsx
import React, { useState } from "react";
import { useMercadoPago } from "../hooks/useMercadoPago";

interface SubscriptionFormProps {
  apiKey: string;
  baseUrl: string;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  apiKey,
  baseUrl,
}) => {
  const [email, setEmail] = useState("");
  const [planType, setPlanType] = useState<"monthly" | "annual">("monthly");

  const { createSubscription, loading, error } = useMercadoPago(
    apiKey,
    baseUrl
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createSubscription(planType, email);

    if (result) {
      window.location.href = result.init_point;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Criar Assinatura</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Plano
          </label>
          <select
            value={planType}
            onChange={(e) =>
              setPlanType(e.target.value as "monthly" | "annual")
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="monthly">Mensal</option>
            <option value="annual">Anual</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Assinatura"}
        </button>
      </form>
    </div>
  );
};
```

### **4. Context Provider para Configuração**

```typescript
// context/MercadoPagoContext.tsx
import React, { createContext, useContext, ReactNode } from "react";

interface MercadoPagoContextType {
  apiKey: string;
  baseUrl: string;
}

const MercadoPagoContext = createContext<MercadoPagoContextType | undefined>(
  undefined
);

interface MercadoPagoProviderProps {
  children: ReactNode;
  apiKey: string;
  baseUrl: string;
}

export const MercadoPagoProvider: React.FC<MercadoPagoProviderProps> = ({
  children,
  apiKey,
  baseUrl,
}) => {
  return (
    <MercadoPagoContext.Provider value={{ apiKey, baseUrl }}>
      {children}
    </MercadoPagoContext.Provider>
  );
};

export const useMercadoPagoContext = () => {
  const context = useContext(MercadoPagoContext);
  if (!context) {
    throw new Error(
      "useMercadoPagoContext must be used within MercadoPagoProvider"
    );
  }
  return context;
};
```

### **5. Componente Principal da Aplicação**

```typescript
// App.tsx
import React from "react";
import { MercadoPagoProvider } from "./context/MercadoPagoContext";
import { CheckoutForm } from "./components/CheckoutForm";
import { SubscriptionForm } from "./components/SubscriptionForm";

const App: React.FC = () => {
  const apiKey = process.env.REACT_APP_MERCADOPAGO_API_KEY || "sua-api-key";
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

  return (
    <MercadoPagoProvider apiKey={apiKey} baseUrl={baseUrl}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            MercadoPago Integration
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <CheckoutForm apiKey={apiKey} baseUrl={baseUrl} />
            <SubscriptionForm apiKey={apiKey} baseUrl={baseUrl} />
          </div>
        </div>
      </div>
    </MercadoPagoProvider>
  );
};

export default App;
```

---

## 🔧 **Configuração do Frontend**

### **Variáveis de Ambiente (.env)**

```env
REACT_APP_MERCADOPAGO_API_KEY=sua-api-key-aqui
REACT_APP_API_BASE_URL=http://localhost:3000
```

### **Dependências Necessárias**

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

---

## 🚀 **Fluxo de Integração Recomendado**

### **1. Setup Inicial**

```bash
# Instalar dependências
npm install @mercadopago-nextjs/sdk

# Configurar variáveis de ambiente
echo "REACT_APP_MERCADOPAGO_API_KEY=sua-chave" > .env
echo "REACT_APP_API_BASE_URL=http://localhost:3000" >> .env
```

### **2. Implementar Componentes**

1. Copiar os hooks e componentes fornecidos
2. Adaptar estilos conforme sua UI library (Tailwind, Material-UI, etc.)
3. Adicionar validações de formulário
4. Implementar loading states e error handling

### **3. Fluxo de Pagamento**

1. **Frontend:** Usuário preenche formulário
2. **Frontend → Backend:** Enviar dados para criar checkout
3. **Backend → MercadoPago:** Criar preferência de pagamento
4. **Frontend:** Redirecionar para `init_point` do MercadoPago
5. **MercadoPago:** Usuário realiza pagamento
6. **MercadoPago → Backend:** Webhook notifica status
7. **Frontend:** Receber confirmação via polling ou websocket

---

## 🛡️ **Tratamento de Erros**

### **Tipos de Erro Comuns:**

```typescript
interface ApiError {
  error: string;
  details?: string;
  code?: string;
  timestamp?: string;
}

// Rate limit exceeded
{
  "error": "Rate limit exceeded",
  "details": "Limite de 100 requisições por minuto excedido",
  "code": "RATE_LIMIT_ERROR"
}

// Validation error
{
  "error": "Validation failed",
  "details": "O campo 'produto' é obrigatório",
  "code": "VALIDATION_ERROR"
}

// Authentication error
{
  "error": "Unauthorized",
  "details": "Chave de API inválida ou ausente",
  "code": "AUTH_ERROR"
}
```

---

## 📊 **Monitoramento e Debug**

### **Health Check Component:**

```typescript
const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/monitoring/health")
      .then((res) => res.json())
      .then(setHealth);
  }, []);

  return (
    <div
      className={`p-4 rounded ${
        health?.status === "healthy" ? "bg-green-100" : "bg-red-100"
      }`}
    >
      Status: {health?.status || "loading..."}
    </div>
  );
};
```

### **Console Debug:**

```typescript
// Adicionar logs para debug
console.log("Criando checkout:", checkoutData);
console.log("Resposta da API:", response);
```

---

## 🎯 **Próximas Funcionalidades**

Para expandir a integração, considere implementar:

1. **Listagem de Transações**
2. **Status de Pagamentos em Tempo Real**
3. **Cancelamento de Assinaturas**
4. **Dashboard de Métricas**
5. **Notificações Push**
6. **Integração com WebSockets**

---

## 📞 **Suporte**

- **Documentação da API:** `/docs` (Swagger UI)
- **Health Check:** `/api/monitoring/health`
- **Dashboard:** `/dashboard`

---

**🎉 Este guia fornece tudo que você precisa para integrar o frontend React/TypeScript com o backend MercadoPago Enterprise!**
