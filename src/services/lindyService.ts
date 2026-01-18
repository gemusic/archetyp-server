/**
 * LINDY SERVICE - LITE VERSION
 * Webhooks vers Lindy (sans stockage en DB)
 * WEBHOOKS RÉELS CONFIGURÉS
 */

const LINDY_WEBHOOKS = {
  tracking: {
    url: 'https://public.lindy.ai/api/v1/webhooks/lindy/b452d511-a278-4eef-beec-06f135f9816e',
    key: 'fdaf6daecca9c7516b17e0c8dbacc7ff0b192746acbfd3fbebade8c2e2b457c6',
  },
  chat: {
    url: 'https://public.lindy.ai/api/v1/webhooks/lindy/97060b86-1166-4d31-9e12-608df75a1a83',
    key: 'af1638c6bb2aa72019d8ec08e3380b9cb6a3f761d6d6ecb70601391ee9da5bcb',
  },
  conversion: {
    url: 'https://public.lindy.ai/api/v1/webhooks/lindy/312ccebd-1581-4780-be90-436fad2493af',
    key: '47122b931c32d77e1a7aa1559f32894c87683e3caefa02da20de13a927f02958',
  },
  product: {
    url: 'https://public.lindy.ai/api/v1/webhooks/lindy/85f5c903-25cf-4242-b938-1ca69bab9051',
    key: 'ba39555503a0512859679caedeae5b968e56a9869f34d978f9979a588252808d',
  },
};

/**
 * Envoyer un webhook de tracking à Lindy
 */
export async function sendTrackingWebhook(payload: any): Promise<void> {
  try {
    const response = await fetch(LINDY_WEBHOOKS.tracking.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINDY_WEBHOOKS.tracking.key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[lindyService] Tracking webhook failed:', response.status);
    } else {
      console.log('[lindyService] ✅ Tracking webhook sent');
    }
  } catch (error) {
    console.error('[lindyService] sendTrackingWebhook error:', error);
  }
}

/**
 * Envoyer un webhook de chat à Lindy
 */
export async function sendChatWebhook(payload: any): Promise<void> {
  try {
    const response = await fetch(LINDY_WEBHOOKS.chat.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINDY_WEBHOOKS.chat.key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[lindyService] Chat webhook failed:', response.status);
    } else {
      console.log('[lindyService] ✅ Chat webhook sent');
    }
  } catch (error) {
    console.error('[lindyService] sendChatWebhook error:', error);
  }
}

/**
 * Envoyer un webhook de conversion à Lindy
 */
export async function sendConversionWebhook(payload: any): Promise<void> {
  try {
    const response = await fetch(LINDY_WEBHOOKS.conversion.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINDY_WEBHOOKS.conversion.key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[lindyService] Conversion webhook failed:', response.status);
    } else {
      console.log('[lindyService] ✅ Conversion webhook sent');
    }
  } catch (error) {
    console.error('[lindyService] sendConversionWebhook error:', error);
  }
}

/**
 * Envoyer un webhook de produit à Lindy
 */
export async function sendProductWebhook(payload: any): Promise<void> {
  try {
    const response = await fetch(LINDY_WEBHOOKS.product.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINDY_WEBHOOKS.product.key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[lindyService] Product webhook failed:', response.status);
    } else {
      console.log('[lindyService] ✅ Product webhook sent');
    }
  } catch (error) {
    console.error('[lindyService] sendProductWebhook error:', error);
  }
}
