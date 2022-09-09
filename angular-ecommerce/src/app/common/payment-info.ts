import { Address } from './address';

export class PaymentInfo {
  amount: number;
  currency: string;
  customerName: string;
  customerShippingAddress: Address;
  customerBillingAddress: Address;
  description: string;
}
