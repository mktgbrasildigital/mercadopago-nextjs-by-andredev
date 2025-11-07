import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            💳 Mercado Pago
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-2">
            Integração Next.js
          </h2>
          <p className="text-gray-500">Backend de pagamentos e assinaturas</p>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✅</span>
            <h3 className="font-semibold text-green-900">
              Sistema Pronto para Testes!
            </h3>
          </div>
          <p className="text-sm text-green-800">
            Todas as integrações estão funcionando e prontas para serem
            testadas.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <div className="text-2xl mb-2">💳</div>
            <h3 className="font-semibold mb-1">Pagamento Único</h3>
            <p className="text-sm text-gray-600">Cartão de crédito e Pix</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold mb-1">Assinaturas</h3>
            <p className="text-sm text-gray-600">
              Mensal e Anual com renovação automática
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-2xl mb-2">🔔</div>
            <h3 className="font-semibold mb-1">Webhooks</h3>
            <p className="text-sm text-gray-600">Notificações em tempo real</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-2xl mb-2">🧪</div>
            <h3 className="font-semibold mb-1">33 Testes</h3>
            <p className="text-sm text-gray-600">
              Cobertura completa automatizada
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            href="/teste"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 Acessar Página de Testes
          </Link>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Documentação disponível:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <code className="bg-gray-100 px-2 py-1 rounded">README.md</code>
              <code className="bg-gray-100 px-2 py-1 rounded">TESTING.md</code>
              <code className="bg-gray-100 px-2 py-1 rounded">
                PAGINA_TESTE.md
              </code>
              <code className="bg-gray-100 px-2 py-1 rounded">
                GUIA_ASSINATURAS.md
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            💡 Configure suas credenciais no arquivo{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">.env</code>
          </p>
        </div>
      </div>
    </div>
  );
}
