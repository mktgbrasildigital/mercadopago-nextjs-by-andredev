const express = require('express');
const cors = require('cors');

const app = express();

// Configuração de CORS manual
const corsOptions = {
  origin: 'https://culinaria-kappa.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Aplicar CORS em todas as rotas
app.use(cors(corsOptions));

// Middleware para parsing de JSON
app.use(express.json());

// Tratamento manual do preflight OPTIONS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://culinaria-kappa.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Rota: Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor rodando com sucesso',
    timestamp: new Date().toISOString()
  });
});

// Rota: POST /api/mercado-pago/create-subscription
app.post('/api/mercado-pago/create-subscription', async (req, res) => {
  try {
    const { plan, email, customer } = req.body;

    // Validação básica
    if (!plan || !email) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: plan e email'
      });
    }

    // Aqui você implementaria a lógica real de criação de assinatura no Mercado Pago
    // Exemplo de resposta
    const subscription = {
      id: 'sub_' + Date.now(),
      plan_id: plan,
      customer_email: email,
      status: 'pending',
      created_at: new Date().toISOString(),
      init_point: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=example'
    };

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao processar assinatura',
      message: error.message
    });
  }
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌍 CORS configurado para: https://culinaria-kappa.vercel.app`);
  console.log(`📅 Iniciado em: ${new Date().toISOString()}`);
});

module.exports = app;
