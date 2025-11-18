const express = require('express');
const cors = require('cors');

const app = express();

const ALLOWED_ORIGIN = 'https://culinaria-kappa.vercel.app';

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'mercadopago-server', time: new Date().toISOString() });
});

app.post('/api/mercado-pago/create-subscription', (req, res) => {
  const { plan, email } = req.body || {};
  if (!plan || !email) {
    return res.status(400).json({ success: false, error: 'Campos obrigatórios: plan e email' });
  }
  const subscription = {
    id: 'sub_' + Date.now(),
    plan_id: plan,
    customer_email: email,
    status: 'pending',
    created_at: new Date().toISOString(),
    init_point: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=example'
  };
  res.json({ success: true, data: subscription });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ success: false, error: 'Erro interno do servidor', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT} com CORS para ${ALLOWED_ORIGIN}`);
});
