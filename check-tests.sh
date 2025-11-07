#!/bin/bash

# Script de verificação rápida dos testes
# Execute: chmod +x check-tests.sh && ./check-tests.sh

echo "🧪 Verificando setup de testes..."
echo ""

# Verifica se o Jest está instalado
if ! npm list jest > /dev/null 2>&1; then
    echo "❌ Jest não está instalado. Execute: npm install"
    exit 1
else
    echo "✅ Jest instalado"
fi

# Verifica se o Husky está instalado
if ! npm list husky > /dev/null 2>&1; then
    echo "❌ Husky não está instalado. Execute: npm install"
    exit 1
else
    echo "✅ Husky instalado"
fi

# Verifica se o arquivo de configuração existe
if [ ! -f "jest.config.js" ]; then
    echo "❌ jest.config.js não encontrado"
    exit 1
else
    echo "✅ jest.config.js configurado"
fi

# Verifica se o pre-commit hook existe
if [ ! -f ".husky/pre-commit" ]; then
    echo "❌ Pre-commit hook não encontrado"
    exit 1
else
    echo "✅ Pre-commit hook configurado"
fi

echo ""
echo "📊 Executando testes..."
echo ""

# Executa os testes
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Todos os testes passaram!"
    echo ""
    echo "🎉 Setup completo e funcionando!"
    echo ""
    echo "Comandos disponíveis:"
    echo "  npm test              - Executa todos os testes"
    echo "  npm run test:watch    - Modo watch para desenvolvimento"
    echo "  npm run test:coverage - Relatório de cobertura"
    echo ""
else
    echo ""
    echo "❌ Alguns testes falharam. Verifique os erros acima."
    exit 1
fi
