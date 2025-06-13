const GST_RATE = 0.18;
const GST_BASE = 100000;
const GST_SLAB = 1000000;
const BASE_GST_AMOUNT = 1000;
const ABOVE_SLAB_GST_AMOUNT = 5500;

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
  if (amount <= GST_BASE) {
    return (amount * 0.01 * 0.18).toFixed(2).toString();
  } else if (amount <= GST_SLAB) {
    return (( 0.05 * (amount - GST_BASE) + BASE_GST_AMOUNT ) * GST_RATE)
      .toFixed(2)
      .toString();
  } else {
    return (( 0.01 * (amount - GST_SLAB) + ABOVE_SLAB_GST_AMOUNT) * GST_RATE)
      .toFixed(2)
      .toString();
  }
};

export const calculateTotalPayable = (amount: number, bankFee: number) => {
  return (
    amount +
    parseFloat(calculateTcs(amount)) +
    parseFloat(calculateGst(amount)) +
    bankFee
  ).toFixed(2);
};
