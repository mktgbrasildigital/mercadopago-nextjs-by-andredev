import { GET } from "../route";
import { Payment } from "mercadopago";

// Mock do módulo mercadopago
jest.mock("mercadopago", () => ({
  Payment: jest.fn(),
}));

// Mock do cliente do Mercado Pago
jest.mock("@/app/lib/mercado-pago", () => ({
  __esModule: true,
  default: {},
}));

describe("GET /api/mercado-pago/pending", () => {
  let mockPaymentGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPaymentGet = jest.fn();
    (Payment as jest.Mock).mockImplementation(() => ({
      get: mockPaymentGet,
    }));
  });

  it("deve redirecionar para sucesso quando pagamento for aprovado", async () => {
    const mockPaymentData = {
      id: "123456789",
      status: "approved",
      date_approved: "2025-11-07T10:00:00Z",
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?payment_id=123456789&external_reference=order-123"
    );

    const response = await GET(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/?status=sucesso"
    );
    expect(mockPaymentGet).toHaveBeenCalledWith({ id: "123456789" });
  });

  it("deve redirecionar para sucesso quando date_approved não for null", async () => {
    const mockPaymentData = {
      id: "987654321",
      status: "pending",
      date_approved: "2025-11-07T10:00:00Z",
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?payment_id=987654321&external_reference=order-456"
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/?status=sucesso"
    );
  });

  it("deve redirecionar para home quando pagamento estiver pendente", async () => {
    const mockPaymentData = {
      id: "111111111",
      status: "pending",
      date_approved: null,
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?payment_id=111111111&external_reference=order-789"
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("deve retornar erro 400 quando payment_id não for fornecido", async () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?external_reference=order-error"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Invalid request" });
    expect(mockPaymentGet).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando external_reference não for fornecido", async () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?payment_id=123456789"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Invalid request" });
    expect(mockPaymentGet).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando nenhum parâmetro for fornecido", async () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Invalid request" });
  });

  it("deve redirecionar para home quando pagamento for rejeitado", async () => {
    const mockPaymentData = {
      id: "222222222",
      status: "rejected",
      date_approved: null,
    };

    mockPaymentGet.mockResolvedValue(mockPaymentData);

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/pending?payment_id=222222222&external_reference=order-rejected"
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });
});
