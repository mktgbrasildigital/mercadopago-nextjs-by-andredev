# PROMPT PARA AI STUDIO - GOOGLE

## CONTEXTO:
Preciso integrar um frontend React/TypeScript (.tsx) com um backend MercadoPago NextJS Enterprise já desenvolvido.

## BACKEND DISPONÍVEL:

### Endpoints Principais:
1. **POST** `/api/mercado-pago/v2/create-checkout` - Criar pagamento único
2. **POST** `/api/mercado-pago/create-subscription` - Criar assinatura recorrente  
3. **GET** `/api/mercado-pago/transactions` - Listar transações
4. **GET** `/api/mercado-pago/payment/{id}` - Status de pagamento
5. **POST** `/api/mercado-pago/subscription/{id}/cancel` - Cancelar assinatura

### Autenticação:
- Header: `X-API-Key: sua-chave-aqui`
- Base URL: `http://localhost:3000` (dev) ou `https://sua-api.com` (prod)

### Payloads de Exemplo:

**Checkout:**
```json
{
  "produto": "Produto Premium",
  "preco": 99.90,
  "email": "cliente@email.com", 
  "order_id": "order-123"
}
```

**Subscription:**
```json
{
  "planType": "monthly",
  "userEmail": "usuario@email.com",
  "userId": "user-123"
}
```

### Responses:
**Checkout Response:**
```json
{
  "id": "12345678",
  "init_point": "https://mercadopago.com/checkout/...",
  "api_version": "v2",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## TASK:
Por favor, gere um frontend React/TypeScript (.tsx) completo que:

1. **Crie componentes funcionais** para:
   - Formulário de checkout (pagamento único)
   - Formulário de assinatura (recorrente)
   - Listagem de transações
   - Status de pagamentos

2. **Implemente um hook customizado** `useMercadoPago` que:
   - Faça as chamadas HTTP para os endpoints
   - Gerencie loading states
   - Trate erros da API
   - Use TypeScript com tipagem completa

3. **Crie interfaces TypeScript** para:
   - Dados de checkout
   - Dados de assinatura  
   - Respostas da API
   - Estados de erro

4. **Adicione funcionalidades**:
   - Validação de formulários
   - Loading states visuais
   - Error handling com mensagens user-friendly
   - Redirecionamento para MercadoPago após criação
   - Componentes responsivos com Tailwind CSS

5. **Estruture o projeto** com:
   - Hooks customizados em `hooks/`
   - Componentes em `components/`
   - Types em `types/`
   - Context provider para configuração global

## REQUISITOS TÉCNICOS:
- React 18+ com Hooks
- TypeScript com tipagem estrita
- Tailwind CSS para styling
- Fetch API nativo (sem axios)
- Error boundaries
- Componentes funcionais only
- Props drilling ou Context API

## EXEMPLO DE USO ESPERADO:
```tsx
<MercadoPagoProvider apiKey="key" baseUrl="url">
  <CheckoutForm />
  <SubscriptionForm />
  <TransactionsList />
</MercadoPagoProvider>
```

## ESTRUTURA DE ARQUIVOS DESEJADA:
```
src/
├── components/
│   ├── CheckoutForm.tsx
│   ├── SubscriptionForm.tsx
│   └── TransactionsList.tsx
├── hooks/
│   └── useMercadoPago.ts
├── types/
│   └── mercadopago.ts
├── context/
│   └── MercadoPagoContext.tsx
└── App.tsx
```

Por favor, gere o código completo para cada arquivo mencionado com implementação funcional, tipagem TypeScript correta e boas práticas de React.