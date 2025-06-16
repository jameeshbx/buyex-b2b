import { orderReceivedTemplate } from './email-templates.js';

const html = orderReceivedTemplate({
  orderDate: 'April 28th, 2025',
  orderId: 'ORD038',
  senderName: 'NEETHHOL',
  phone: '7736654323',
  email: 'neethumolchandy234@gmail.com',
  purpose: 'University Fee Transfer',
  receiverName: 'Flywire Payments Corporation',
  foreignCurrency: 'GBP',
  product: 'Send Money Abroad',
  orderType: 'Buy',
  quantity: 2777.5,
  rate: 111.96,
  tentativeAmount: 310968.9,
  forexConversionTax: 469.87,
  bankFee: 1500,
  tcs: 0,
  totalPayableAmount: 312939,
  residentStatus: 'Resident',
  motherName: '',
  relationshipWithReceiver: 'Self',
  senderAddressLine1: 'KANJIRAKATTUKUNNEL,MARIYAPURAM PO,IDUKKI',
  senderAddressLine2: 'PIN:685602,KERALA,INDIA',
  funding: 'Self',
  senderAccountNo: '7736654323',
  ifsc: '',
  bankName: '',
  branchName: 'University Fee Transfer',
  agent: '#AGT002 - Sample agent',
  supportEmail: 'support@buyexchange.in',
  supportPhone: '+91 90722 43243',
});

// eslint-disable-next-line no-console
console.log(html); 