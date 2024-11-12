const conversionRateFromUSDtoEGP = 50;

const EGPtoUSD = (amountEGP) => {
  return EGP / conversionRateFromUSDtoEGP;
};

const USDtoEGP = (amountUSD) => {
  return amountUSD * conversionRateFromUSDtoEGP;
};

const convertFromDB = (price) => {
  const currency = localStorage.getItem("currency");
  if (currency == "USD") {
    return price;
  } else {
    return USDtoEGP(price);
  }
};

const convertToDB = (price) => {
  const currency = localStorage.getItem("currency");
  if (currency == "USD") {
    return price;
  } else {
    return EGPtoUSD(price);
  }
};

export default {
  convertFromDB,
  convertToDB,
};
