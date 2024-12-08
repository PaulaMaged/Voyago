import axios from "axios";

const getCheckoutUrl = async (
  type,
  successUrl,
  cancelUrl,
  itemList,
  extra = {}
) => {
  const touristId = localStorage.getItem("roleId");

  const res = await axios.post(
    "http://localhost:8000/api/stripe/create-checkout-session",
    {
      type: type,
      touristId: touristId,
      successUrl: successUrl,
      cancelUrl: cancelUrl,
      items: itemList,
      extra: extra,
    }
  );

  return res.data.url;
};

export default getCheckoutUrl;
