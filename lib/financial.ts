const GST_RATE = 0.18;
const GST_BASE = 100000;
const GST_SLAB = 1000000;
const BASE_GST_AMOUNT = 1000;
const ABOVE_SLAB_GST_AMOUNT = 5500;
const HANDLING_FEE_GST = 100;
const MINIMUM_GST = 145;

const TCS_RATE = 0.05;
const TCS_SLAB = 1000000;

export const getLiveRate = async (base: string, target: string) => {
  if (base === target) {
    return 1;
  }
  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${base}&to=${target}`
  );
  const data = await response.json();
  return data.rates[target];
};

export const calculateTcs = (amount: number, purpose?: string) => {
  if (purpose === "education") {
    return (amount * 0.005).toFixed(2).toString();
  } else {
    if (amount <= TCS_SLAB) {
      return "0";
    } else {
      return ((amount - TCS_SLAB) * TCS_RATE).toFixed(2).toString();
    }
  }
};

export const calculateGst = (amount: number) => {
  let calculatedGst: number;
  
  if (amount <= GST_BASE) {
    calculatedGst = amount * 0.01 * 0.18 + HANDLING_FEE_GST;
  } else if (amount <= GST_SLAB) {
    calculatedGst = (BASE_GST_AMOUNT + 0.005 * (amount - GST_BASE)) * GST_RATE + HANDLING_FEE_GST;
  } else {
    calculatedGst = (ABOVE_SLAB_GST_AMOUNT + 0.001 * (amount - GST_SLAB)) * GST_RATE + HANDLING_FEE_GST;
  }

  // Return the higher of calculated GST or minimum GST
  return Math.max(calculatedGst, MINIMUM_GST).toFixed(2).toString();
};

export const calculateTotalPayable = (amount: number, bankFee: number) => {
  return (
    amount +
    parseFloat(calculateTcs(amount)) +
    parseFloat(calculateGst(amount)) +
    bankFee
  ).toFixed(2);
};
