// Utilidades para Lightning Network
export interface YadioResponse {
  BTC: {
    [currency: string]: number;
  };
}

export interface LNURLPayResponse {
  callback: string;
  maxSendable: number;
  minSendable: number;
  metadata: string;
  tag: string;
  commentAllowed?: number;
  verify?: string; // LUD-21: URL para verificar el estado del pago
}

export interface LNURLPayCallbackResponse {
  pr: string; // Lightning invoice
  verify?: string; // LUD-21: URL para verificar el estado del pago
  successAction?: {
    tag: string;
    message?: string;
    url?: string;
  };
  disposable?: boolean;
  routes?: any[];
}

export interface LNURLVerifyResponse {
  status: 'OK' | 'ERROR';
  settled: boolean;
  preimage?: string;
  pr: string;
}

// Convertir monto fiat a satoshis usando Yadio
export async function convertToSatoshis(amount: number, currency: string): Promise<number> {
  // Yadio API endpoint correcto
  const response = await fetch(`https://api.yadio.io/exrates/BTC`);
  if (!response.ok) {
    throw new Error(`Yadio API error: ${response.status}`);
  }

  const data: YadioResponse = await response.json();

  // Yadio devuelve BTC rates en diferentes monedas
  const btcPrice = data.BTC?.[currency.toUpperCase()];

  if (!btcPrice) {
    throw new Error(
      `Currency ${currency.toUpperCase()} not supported. Available currencies: ${Object.keys(data.BTC || {}).join(
        ', ',
      )}`,
    );
  }

  // Convertir a satoshis
  const satoshis = Math.round((amount / btcPrice) * 100000000);

  return satoshis;
}

// Obtener información LNURL-pay de una Lightning Address
export async function getLNURLPayInfo(
  lightningAddress: string,
): Promise<{ data?: any | null; ok: boolean; error?: string | null }> {
  const [username, domain] = lightningAddress.split('@');
  if (!username || !domain) {
    throw new Error('Invalid Lightning Address format');
  }

  const lnurlpUrl = `https://${domain}/.well-known/lnurlp/${username}`;

  try {
    const response = await fetch(lnurlpUrl, { headers: { Accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`LNURL-pay request failed: ${response.status}`);
    }

    const data: LNURLPayResponse = await response.json();
    if (data.tag !== 'payRequest' || !data.callback || !data.metadata) {
      throw new Error('Invalid LNURL-pay response');
    }

    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, error: 'Oops, something went wrong.' };
  }
}

// Generar factura Lightning usando LUD-16/LUD-21
export async function generateLightningInvoice(
  lightningAddress: string,
  amountSats: number,
  comment?: string,
): Promise<LNURLPayCallbackResponse> {
  // Primero obtener la información LNURL-pay
  const { data } = await getLNURLPayInfo(lightningAddress);

  // Convertir satoshis a millisatoshis (1 sat = 1000 millisats)
  const amountMillisats = amountSats * 1000;
  if (amountMillisats < data.minSendable || amountMillisats > data.maxSendable) {
    throw new Error(
      `Your wallet accepts a minimum of ${data.minSendable / 1000} and a maximum of ${data.maxSendable / 1000} SATs`,
    );
  }

  // Preparar parámetros para el callback
  const callbackUrl = new URL(data.callback);
  callbackUrl.searchParams.set('amount', amountMillisats.toString());
  if (comment && data.commentAllowed && comment.length <= data.commentAllowed) {
    callbackUrl.searchParams.set('comment', comment);
  }

  // Hacer la solicitud al callback para generar la factura
  const response = await fetch(callbackUrl.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Lightning invoice generation failed: ${response.status}`);
  }

  // Validar que tengamos una factura válida
  const invoiceData: LNURLPayCallbackResponse = await response.json();
  console.log('invoiceData.pr', invoiceData.pr);
  if (!invoiceData.pr) {
    throw new Error('No Lightning invoice received');
  }

  return invoiceData;
}
