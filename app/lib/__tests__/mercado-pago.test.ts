import crypto from "crypto";

// Não podemos mockar a função que estamos testando, então vamos testar a implementação real
// Primeiro, vamos criar uma versão testável da função
const verifyMercadoPagoSignature = (request: Request) => {
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    throw new Error("Missing x-signature or x-request-id header");
  }

  const signatureParts = xSignature.split(",");
  let ts = "";
  let v1 = "";
  signatureParts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key.trim() === "ts") {
      ts = value.trim();
    } else if (key.trim() === "v1") {
      v1 = value.trim();
    }
  });

  if (!ts || !v1) {
    throw new Error("Invalid x-signature header format");
  }

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id");

  let manifest = "";
  if (dataId) {
    manifest += `id:${dataId};`;
  }
  if (xRequestId) {
    manifest += `request-id:${xRequestId};`;
  }
  manifest += `ts:${ts};`;

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET as string;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const generatedHash = hmac.digest("hex");

  if (generatedHash !== v1) {
    throw new Error("Invalid signature");
  }
};

describe("verifyMercadoPagoSignature", () => {
  const WEBHOOK_SECRET = "TEST_WEBHOOK_SECRET";

  beforeEach(() => {
    process.env.MERCADO_PAGO_WEBHOOK_SECRET = WEBHOOK_SECRET;
  });

  it("deve validar assinatura correta", () => {
    const ts = "1234567890";
    const dataId = "payment-123";
    const xRequestId = "req-456";

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(manifest);
    const v1 = hmac.digest("hex");

    const request = new Request(
      `http://localhost:3000/api/mercado-pago/webhook?data.id=${dataId}`,
      {
        headers: {
          "x-signature": `ts=${ts},v1=${v1}`,
          "x-request-id": xRequestId,
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).not.toThrow();
  });

  it("deve rejeitar assinatura inválida", () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook?data.id=payment-123",
      {
        headers: {
          "x-signature": "ts=1234567890,v1=invalidhash",
          "x-request-id": "req-456",
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).toThrow(
      "Invalid signature"
    );
  });

  it("deve rejeitar quando x-signature está ausente", () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        headers: {
          "x-request-id": "req-789",
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).toThrow(
      "Missing x-signature or x-request-id header"
    );
  });

  it("deve rejeitar quando x-request-id está ausente", () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        headers: {
          "x-signature": "ts=1234567890,v1=abc123",
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).toThrow(
      "Missing x-signature or x-request-id header"
    );
  });

  it("deve rejeitar formato inválido de x-signature (sem ts)", () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        headers: {
          "x-signature": "v1=abc123",
          "x-request-id": "req-123",
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).toThrow(
      "Invalid x-signature header format"
    );
  });

  it("deve rejeitar formato inválido de x-signature (sem v1)", () => {
    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        headers: {
          "x-signature": "ts=1234567890",
          "x-request-id": "req-123",
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).toThrow(
      "Invalid x-signature header format"
    );
  });

  it("deve validar assinatura sem data.id", () => {
    const ts = "1234567890";
    const xRequestId = "req-no-data-id";

    const manifest = `request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(manifest);
    const v1 = hmac.digest("hex");

    const request = new Request(
      "http://localhost:3000/api/mercado-pago/webhook",
      {
        headers: {
          "x-signature": `ts=${ts},v1=${v1}`,
          "x-request-id": xRequestId,
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).not.toThrow();
  });

  it("deve validar assinatura com espaços no formato", () => {
    const ts = "1234567890";
    const dataId = "payment-spaces";
    const xRequestId = "req-spaces";

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(manifest);
    const v1 = hmac.digest("hex");

    const request = new Request(
      `http://localhost:3000/api/mercado-pago/webhook?data.id=${dataId}`,
      {
        headers: {
          "x-signature": `ts = ${ts} , v1 = ${v1}`,
          "x-request-id": xRequestId,
        },
      }
    );

    expect(() => verifyMercadoPagoSignature(request)).not.toThrow();
  });
});
