const conversionRateFromUSDtoEGP = 50;

const getCurrencySymbol = (currency) => {
  switch (currency) {
    case 'EGP':
      return 'E£';
    case 'USD':
      return '$';
    default:
      return '$';
  }
};

const formatCurrency = (amount, currency) => {
  if (amount === null || amount === undefined) {
    return `${getCurrencySymbol(currency)}0.00`;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  }
};

const EGPtoUSD = (amountEGP) => {
  if (!amountEGP) return 0;
  return amountEGP / conversionRateFromUSDtoEGP;
};

const USDtoEGP = (amountUSD) => {
  if (!amountUSD) return 0;
  return amountUSD * conversionRateFromUSDtoEGP;
};

const convertFromDB = (price) => {
  if (!price) return 0;
  const currency = localStorage.getItem("currency") || "USD";
  if (currency === "USD") {
    return price;
  } else {
    return USDtoEGP(price);
  }
};

const convertToDB = (price) => {
  if (!price) return 0;
  const currency = localStorage.getItem("currency") || "USD";
  if (currency === "USD") {
    return price;
  } else {
    return EGPtoUSD(price);
  }
};

const formatPrice = (price) => {
  const currency = localStorage.getItem("currency") || "USD";
  const convertedPrice = convertFromDB(price);
  return formatCurrency(convertedPrice, currency);
};

export default {
  convertFromDB,
  convertToDB,
  formatPrice,
  formatCurrency,
  getCurrencySymbol
};
