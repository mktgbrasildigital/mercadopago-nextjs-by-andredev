import "server-only";

export async function handleMercadoPagoSubscription(
  subscriptionData: any // Usando 'any' devido a limitações do tipo SDK do Mercado Pago
) {
  const externalReference = subscriptionData.external_reference;
  const userId = externalReference; // ID do usuário no seu sistema
  const subscriptionId = subscriptionData.id;
  const status = subscriptionData.status;
  const payerEmail = subscriptionData.payer_email;

  console.log("Processando assinatura:", {
    userId,
    subscriptionId,
    status,
    payerEmail,
  });

  // Aqui você implementa a lógica do seu negócio:

  if (status === "authorized") {
    // Assinatura foi autorizada - libere acesso ao usuário
    // Exemplo:
    // await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionId,
    //     subscriptionStatus: 'active',
    //     subscriptionStartDate: new Date(),
    //   }
    // });

    // Enviar email de boas-vindas
    // await sendWelcomeEmail(payerEmail);

    console.log(`✅ Assinatura ativada para usuário ${userId}`);
  } else if (status === "cancelled" || status === "paused") {
    // Assinatura foi cancelada ou pausada - remova acesso
    // await db.user.update({
    //   where: { id: userId },
    //   data: { subscriptionStatus: status }
    // });

    console.log(`❌ Assinatura ${status} para usuário ${userId}`);
  }

  return;
}
