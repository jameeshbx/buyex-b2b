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
  
  try {
    const response = await fetch(`/api/currency?base=${target}&target=${base}`);
    
    if (!response.ok) {
      throw new Error(`Currency API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    // Add 0.03 to the live rate before returning
    return data.rate + 0.03;
  } catch (error) {
    console.error("Error fetching live rate:", error);
    throw error;
  }
};

export const calculateTcs = (amount: number, educationLoan?: boolean) => {
  if (educationLoan) {
    return "0";
  }
  if (amount <= TCS_SLAB) {
    return "0";
  } else {
    return ((amount - TCS_SLAB) * TCS_RATE).toFixed(2).toString();
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

export const calculateTotalPayable = (amount: number, bankFee: number, educationLoan?: boolean) => {
  const tcs = parseFloat(calculateTcs(amount, educationLoan));
  const gst = parseFloat(calculateGst(amount));
  const total = amount + tcs + gst + bankFee;
  //console.log('calculateTotalPayable:', { amount, bankFee, educationLoan, tcs, gst, total });
  return Math.ceil(total);
};
