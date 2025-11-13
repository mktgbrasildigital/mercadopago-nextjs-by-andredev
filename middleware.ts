// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { monitoring } from "./app/lib/monitoring";

/**
 * Comparação segura de strings para evitar timing attacks
 * @param a Primeira string
 * @param b Segunda string
 * @returns true se as strings são iguais
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Obtém o IP real do cliente considerando proxies
 * @param request NextRequest
 * @returns IP do cliente
 */
function getClientIP(request: NextRequest): string {
  // Verificar headers de proxy em ordem de prioridade
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "unknown";
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // 🔐 AUTENTICAÇÃO PARA ROTAS DO MERCADO PAGO
  if (pathname.startsWith("/api/mercado-pago/")) {
    // Verificar se o cabeçalho X-API-Key está presente
    const apiKey = request.headers.get("X-API-Key");
    const backendApiKey = process.env.BACKEND_API_KEY;

    // Se não há API key na requisição
    if (!apiKey) {
      monitoring.recordError(
        "auth_error",
        "Missing X-API-Key header",
        pathname
      );
      return NextResponse.json(
        { error: "Acesso não autorizado - X-API-Key obrigatório" },
        { status: 401 }
      );
    }

    // Se não há chave configurada no backend
    if (!backendApiKey) {
      monitoring.recordError(
        "config_error",
        "BACKEND_API_KEY not configured",
        pathname
      );
      return NextResponse.json(
        { error: "Configuração do servidor inválida" },
        { status: 500 }
      );
    }

    // Comparação segura das chaves usando comparação constant-time
    if (!secureCompare(apiKey, backendApiKey)) {
      monitoring.recordError("auth_error", "Invalid X-API-Key", pathname);
      monitoring.incrementCounter("mercadopago_auth_failures", 1, {
        endpoint: pathname,
        method,
        ip: getClientIP(request),
      });

      return NextResponse.json(
        { error: "Acesso não autorizado - X-API-Key inválida" },
        { status: 401 }
      );
    }

    // Autenticação bem-sucedida - registrar métrica
    monitoring.incrementCounter("mercadopago_auth_success", 1, {
      endpoint: pathname,
      method,
    });
  }

  // Continuar com o processamento normal
  const response = NextResponse.next();

  // Adicionar headers de monitoramento
  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.set("X-Timestamp", startTime.toString());

  // Hook para capturar métricas após a resposta
  response.headers.set("X-Monitor-Hook", "true");

  // Executar de forma assíncrona para não bloquear a resposta
  Promise.resolve().then(() => {
    const duration = Date.now() - startTime;
    const status = response.status || 200;

    // Registrar métricas
    monitoring.recordResponseTime(`${method} ${pathname}`, duration, status);

    // Métricas específicas por endpoint
    if (pathname.startsWith("/api/mercado-pago/")) {
      monitoring.incrementCounter("mercadopago_api_requests", 1, {
        endpoint: pathname,
        method,
        status: status.toString(),
      });
    }

    // Registrar métricas de sistema periodicamente
    if (Math.random() < 0.1) {
      // 10% das requisições
      monitoring.recordSystemMetrics();
    }
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
