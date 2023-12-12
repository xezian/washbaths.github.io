import { Client, Environment } from "square";
import Ajv from "ajv/dist/jtd.js";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const paymentSchema = {
  properties: {
    locationId: { type: "string" },
    idempotencyKey: { type: "string" },
    sourceId: { type: "string" },
    amount: { type: "string" },
    verificationToken: { type: "string" }
  },
  optionalProperties: {
    customerId: { type: "string" },
  },
};

export const handler = async (event) => {
  const client = new Client({
    // environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
  });

  const returns = await createPayment(event.body, client);
  console.log(returns);
  return returns;
};

const createPayment = async (req, client) => {
  const payload = JSON.parse(req);
  console.log(payload);
  // We validate the payload for specific fields. You may disable this feature
  // if you would prefer to handle payload validation on your own.
  const validatePaymentPayload = ajv.compile(paymentSchema);
  if (!validatePaymentPayload(payload)) {
    console.log(validatePaymentPayload.errors);
    throw new Error("bad request");
  }
  try {
    console.log("Creating payment");

    const payment = {
      idempotencyKey: payload.idempotencyKey,
      locationId: payload.locationId,
      sourceId: payload.sourceId,
      amountMoney: {
        amount: parseInt(payload.amount),
        currency: "USD",
      },
    };

    console.log(payment);

    const { result, statusCode } = await client.paymentsApi.createPayment(
      payment
    );

    console.log("Payment succeeded!", { result, statusCode });

    const body = {
      success: true,
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        receiptUrl: result.payment.receiptUrl,
        orderId: result.payment.orderId,
      },
    };

    return JSON.stringify(body);
  } catch (ex) {
    console.log(`Error creating payment: ${ex}`);
    throw ex; // to attempt retry
  }
};
