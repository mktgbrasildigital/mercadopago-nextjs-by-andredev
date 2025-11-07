import { POST } from "../route";
import { NextRequest } from "next/server";
import { Payment } from "mercadopago";
import crypto from "crypto";

// Mock do módulo mercadopago
jest.mock("mercadopago", () => ({
  Payment: jest.fn(),
}));

// Mock do cliente do Mercado Pago
jest.mock("@/app/lib/mercado-pago", () => ({
  __esModule: true,
  default: {},
  verifyMercadoPagoSignature: jest.fn(),
}));

// Mock do handler de pagamento
jest.mock("@/app/server/mercado-pago/handle-payment", () => ({
  handleMercadoPagoPayment: jest.fn(),
}));

import { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

describe("POST /api/mercado-pago/webhook", () => {
  let mockPaymentGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPaymentGet = jest.fn();
    (Payment as jest.Mock).mockImplementation(() => ({
      get: mockPaymentGet,
    }));

    // Mock da verificação de assinatura (sucesso por padrão)
    (verifyMercadoPagoSignature as jest.Mock).mockReturnValue(undefined);
  });

  it("deve processar webhook de pagamento aprovado", async () => {
    const mockPaymentData = {
      id: "123456789",
      status: "approved",
      date_approved: "2025-11-07T10:00:00Z",
      metadata: {
        teste_id: "order-123",
        user_email: "teste@example.com",
      },
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const requestBody = {
      type: "payment",
      data: {
        id: "123456789",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=123456789",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-123",
        },
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ received: true });
    expect(verifyMercadoPagoSignature).toHaveBeenCalledWith(request);
    expect(mockPaymentGet).toHaveBeenCalledWith({ id: "123456789" });
    expect(handleMercadoPagoPayment).toHaveBeenCalledWith(mockPaymentData);
  });

  it("deve processar webhook de pagamento Pix aprovado", async () => {
    const mockPaymentData = {
      id: "987654321",
      status: "approved",
      date_approved: "2025-11-07T10:00:00Z",
      metadata: {
        teste_id: "order-456",
      },
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const requestBody = {
      type: "payment",
      data: {
        id: "987654321",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=987654321",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-456",
        },
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(handleMercadoPagoPayment).toHaveBeenCalledWith(mockPaymentData);
  });

  it("não deve processar pagamento pendente", async () => {
    const mockPaymentData = {
      id: "111111111",
      status: "pending",
      date_approved: null,
      metadata: {
        teste_id: "order-789",
      },
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const requestBody = {
      type: "payment",
      data: {
        id: "111111111",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=111111111",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-789",
        },
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(handleMercadoPagoPayment).not.toHaveBeenCalled();
  });

  it("deve ignorar eventos não tratados", async () => {
    const requestBody = {
      type: "subscription_preapproval",
      data: {
        id: "sub-123",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-sub",
        },
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ received: true });
    expect(mockPaymentGet).not.toHaveBeenCalled();
    expect(handleMercadoPagoPayment).not.toHaveBeenCalled();
  });

  it("deve retornar erro 500 quando houver falha no processamento", async () => {
    mockPaymentGet.mockRejectedValue(new Error("Payment API Error"));

    const requestBody = {
      type: "payment",
      data: {
        id: "error-id",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=error-id",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-error",
        },
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Webhook handler failed" });
  });

  it("deve verificar assinatura antes de processar", async () => {
    const mockPaymentData = {
      id: "123",
      status: "approved",
      date_approved: "2025-11-07T10:00:00Z",
      metadata: {
        teste_id: "order-123",
      },
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const requestBody = {
      type: "payment",
      data: {
        id: "123",
      },
    };

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=123",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          "x-signature": "ts=1234567890,v1=abc123",
          "x-request-id": "req-verify",
        },
      }
    );

    await POST(request);

    expect(verifyMercadoPagoSignature).toHaveBeenCalledTimes(1);
    expect(verifyMercadoPagoSignature).toHaveBeenCalledWith(request);
  });
});
