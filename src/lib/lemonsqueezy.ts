const BASE = "https://api.lemonsqueezy.com/v1";

function headers() {
  return {
    Accept:        "application/vnd.api+json",
    "Content-Type":"application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_PAYMENT_API_KEY}`,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LemonSqueezy ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface CheckoutResponse {
  data: {
    attributes: {
      url: string;
    };
  };
}

export async function createCheckout(params: {
  variantId:   string;
  email:       string;
  userId:      string;
  redirectUrl: string;
}): Promise<string> {
  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          embed:           false,
          media:           false,
          logo:            true,
        },
        checkout_data: {
          email:  params.email,
          custom: { user_id: params.userId },
        },
        product_options: {
          redirect_url:         params.redirectUrl,
          receipt_link_url:     params.redirectUrl,
          receipt_thank_you_note: "You're now on Edge.Log Pro. Welcome.",
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
        },
        variant: {
          data: { type: "variants", id: params.variantId },
        },
      },
    },
  };

  const res = await request<CheckoutResponse>("/checkouts", {
    method: "POST",
    body:   JSON.stringify(body),
  });

  return res.data.attributes.url;
}

export async function getCustomerPortalUrl(customerId: string): Promise<string> {
  const res = await request<{ data: { attributes: { urls: { customer_portal: string } } } }>(
    `/customers/${customerId}`,
  );
  return res.data.attributes.urls.customer_portal;
}