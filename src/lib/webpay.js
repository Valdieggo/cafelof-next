import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

const commerceCode = IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = IntegrationApiKeys.WEBPAY;
const environment = Environment.Integration;

export const tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));

export const createTransaction = async (orderId, sessionId, amount) => {
  const buyOrder = orderId; // Usar el order_id como buyOrder
  const url = process.env.NEXT_PUBLIC_URL;
  const returnUrl = `${url}/paymentResult`;

  try {
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    return response;
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    throw error;
  }
};

export const commitTransaction = async (token) => {
  try {
    const response = await tx.commit(token);
    return response;
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    throw error;
  }
};
