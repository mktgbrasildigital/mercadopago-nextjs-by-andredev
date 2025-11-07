"use client";

import { useState } from "react";

export default function TestePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Teste de Pagamento Único
  const testCheckout = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testeId: `order-${Date.now()}`,
          userEmail: "teste@email.com",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Redirecionar para o checkout do Mercado Pago
        if (data.initPoint) {
          window.open(data.initPoint, "_blank");
        }
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Teste de Assinatura Mensal
  const testSubscriptionMonthly = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/mercado-pago/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: "monthly",
          userEmail: "teste@email.com",
          userId: `user-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (data.initPoint) {
          window.open(data.initPoint, "_blank");
        }
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Teste de Assinatura Anual
  const testSubscriptionAnnual = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/mercado-pago/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: "annual",
          userEmail: "teste@email.com",
          userId: `user-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (data.initPoint) {
          window.open(data.initPoint, "_blank");
        }
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Página de Testes - Mercado Pago
          </h1>
          <p className="text-gray-600">
            Use os botões abaixo para testar as integrações do backend
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Atenção:</strong> Esta página é apenas para testes.
              Configure suas credenciais do Mercado Pago no arquivo{" "}
              <code className="bg-yellow-100 px-1 rounded">.env</code>
            </p>
          </div>
        </div>

        {/* Botões de Teste */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Testes Disponíveis</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Pagamento Único */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">💳 Pagamento Único</h3>
              <p className="text-sm text-gray-600 mb-4">
                Teste checkout com cartão ou Pix
                <br />
                <strong>Valor:</strong> R$ 9,99
              </p>
              <button
                onClick={testCheckout}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processando..." : "Testar Checkout"}
              </button>
            </div>

            {/* Assinatura Mensal */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">📅 Plano Mensal</h3>
              <p className="text-sm text-gray-600 mb-4">
                Teste assinatura mensal
                <br />
                <strong>Valor:</strong> R$ 14,90/mês
              </p>
              <button
                onClick={testSubscriptionMonthly}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processando..." : "Testar Mensal"}
              </button>
            </div>

            {/* Assinatura Anual */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow border-blue-300 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">🎉 Plano Anual</h3>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  Melhor Oferta
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Teste assinatura anual
                <br />
                <strong>Valor:</strong> R$ 119,90/ano
              </p>
              <button
                onClick={testSubscriptionAnnual}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processando..." : "Testar Anual"}
              </button>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              ✅ Sucesso!
            </h2>
            <div className="bg-gray-50 rounded p-4 overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              💡 Uma nova aba foi aberta com o checkout do Mercado Pago
            </p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">❌ Erro</h2>
            <div className="bg-red-50 rounded p-4 overflow-x-auto">
              <pre className="text-sm text-red-800">{error}</pre>
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ℹ️ Informações</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🔧 Como usar:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>
                  Configure suas credenciais do Mercado Pago no arquivo .env
                </li>
                <li>Clique em um dos botões acima</li>
                <li>Uma nova aba abrirá com o checkout do Mercado Pago</li>
                <li>
                  Use cartões de teste (veja documentação do Mercado Pago)
                </li>
                <li>
                  Após o pagamento, o webhook será chamado automaticamente
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">💳 Cartões de Teste:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Aprovado:</strong> 5031 4332 1540 6351 | CVV: 123 |
                  Validade: 11/25
                </p>
                <p>
                  <strong>Recusado:</strong> 5031 7557 3453 0604 | CVV: 123 |
                  Validade: 11/25
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📋 Status da Integração:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Backend: Pronto para testes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Webhook: Configurado com idempotência</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Segurança: Verificação HMAC implementada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Testes: 33 testes automatizados</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                💡 Esta página pode ser removida em produção. É apenas para
                facilitar os testes durante o desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
