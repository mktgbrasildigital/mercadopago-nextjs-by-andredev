import { POST } from "../route";
import { NextRequest } from "next/server";
import { Preference } from "mercadopago";

// Mock do módulo mercadopago
jest.mock("mercadopago", () => ({
  Preference: jest.fn(),
}));

// Mock do cliente do Mercado Pago
jest.mock("@/app/lib/mercado-pago", () => ({
  __esModule: true,
  default: {},
}));

describe("POST /api/mercado-pago/create-checkout", () => {
  let mockPreferenceCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPreferenceCreate = jest.fn();
    (Preference as jest.Mock).mockImplementation(() => ({
      create: mockPreferenceCreate,
    }));
  });

  it("deve criar uma preferência com sucesso", async () => {
    const mockPreferenceId = "test-preference-id-123";
    const mockInitPoint =
      "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=test-preference-id-123";

    mockPreferenceCreate.mockResolvedValue({
      id: mockPreferenceId,
      init_point: mockInitPoint,
    });

    const requestBody = {
      testeId: "order-123",
      userEmail: "teste@example.com",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/mercado-pago/create-checkout",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      preferenceId: mockPreferenceId,
      initPoint: mockInitPoint,
    });

    expect(mockPreferenceCreate).toHaveBeenCalledWith({
      body: expect.objectContaining({
        external_reference: "order-123",
        metadata: expect.objectContaining({
          testeId: "order-123",
        }),
        payer: {
          email: "teste@example.com",
        },
        items: expect.arrayContaining([
          expect.objectContaining({
            title: "Nome do produto",
            quantity: 1,
            unit_price: 9.99,
          }),
        ]),
      }),
    });
  });

  it("deve criar preferência sem email quando não fornecido", async () => {
    const mockPreferenceId = "test-preference-id-456";
    const mockInitPoint =
      "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=test-preference-id-456";

    mockPreferenceCreate.mockResolvedValue({
      id: mockPreferenceId,
      init_point: mockInitPoint,
    });

    const requestBody = {
      testeId: "order-456",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/mercado-pago/create-checkout",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.preferenceId).toBe(mockPreferenceId);

    const createCall = mockPreferenceCreate.mock.calls[0][0];
    expect(createCall.body.payer).toBeUndefined();
  });

  it("deve retornar erro quando não houver preferenceId", async () => {
    mockPreferenceCreate.mockResolvedValue({
      id: null,
      init_point: null,
    });

    const requestBody = {
      testeId: "order-789",
      userEmail: "teste@example.com",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/mercado-pago/create-checkout",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it("deve retornar erro quando a criação falhar", async () => {
    mockPreferenceCreate.mockRejectedValue(new Error("Mercado Pago API Error"));

    const requestBody = {
      testeId: "order-error",
      userEmail: "teste@example.com",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/mercado-pago/create-checkout",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it("deve incluir back_urls corretas baseadas no origin", async () => {
    const mockPreferenceId = "test-preference-id-999";
    const mockInitPoint =
      "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=test-preference-id-999";

    mockPreferenceCreate.mockResolvedValue({
      id: mockPreferenceId,
      init_point: mockInitPoint,
    });

    const requestBody = {
      testeId: "order-999",
    };

    const request = new NextRequest(
      "http://localhost:3000/api/mercado-pago/create-checkout",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
      }
    );

    await POST(request);

    const createCall = mockPreferenceCreate.mock.calls[0][0];
    expect(createCall.body.back_urls).toEqual({
      success: "http://localhost:3000/?status=sucesso",
      failure: "http://localhost:3000/?status=falha",
      pending: "http://localhost:3000/api/mercado-pago/pending",
    });
  });
});
