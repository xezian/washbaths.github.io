import { Client, Environment } from "square";
import Ajv from "ajv/dist/jtd.js";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

import { nanoid } from "nanoid";

const paymentSchema = {
  properties: {
    locationId: { type: "string" },
    amount: { type: "uint32" },
  },
  optionalProperties: {
    idempotencyKey: { type: "string" },
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
    console.log("Creating payment link");

    const idempotencyKey = payload.idempotencyKey || nanoid();
    const payment = {
      idempotencyKey,
      quickPay: {
        name: "- CUSTOM AMOUNT - Please note that gift cards are physical only. We do not offer digital gift cards. Please specify a recipient. All gift cards will be held at the front desk unless a mailing address is provided in the notes.",
        priceMoney: {
          amount: parseInt(payload.amount),
          currency: "USD",
        },
        locationId: payload.locationId,
      },
      checkoutOptions: {
        customFields: [
          {
            title: "Specify Recipient Here ✌️",
          },
        ],
        askForShippingAddress: true,
      },
    };

    console.log(payment);

    const { result, statusCode } = await client.checkoutApi.createPaymentLink(
      payment
    );

    console.log("Link create succeeded!", { result, statusCode });

    const body = {
      id: result.paymentLink.id,
      orderId: result.paymentLink.orderId,
      url: result.paymentLink.url,
    };

    return JSON.stringify(body);
  } catch (ex) {
    console.log(`Error creating payment: ${ex}`);
    throw ex; // to attempt retry
  }
};
