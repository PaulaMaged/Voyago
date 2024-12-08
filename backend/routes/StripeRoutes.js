import express from "express";
const router = express.Router();

import Stripe from "stripe";
import TouristController from "../controllers/TouristController.js";
import OrderController from "../controllers/OrderController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let itemIds = [];

let metadata = {
  type: "",
  touristId: "",
  list: "",
  extra: "",
};

const createProduct = (type, item) => {
  console.log(item);
  let itemId;
  let product_data;
  let price_data;
  switch (type) {
    case "activity":
      itemId = item._id;
      product_data = {
        name: item.title,
        description: item.description,
      };

      price_data = {
        currency: "usd",
        product_data: product_data,
        unit_amount: item.price ? item.price * 100 : 0, //convert to cents
      };
      break;
    case "itinerary":
      itemId = item._id;
      product_data = {
        name: item.name,
        description: item.description,
      };

      price_data = {
        currency: "usd",
        product_data: product_data,
        unit_amount: item.price ? item.price * 100 : 0, //convert to cents
      };
      break;
    case "product":
      itemId = item;
      product_data = {
        name: item.product.name,
        description: item.product.description,
      };

      price_data = {
        currency: "usd",
        product_data: product_data,
        unit_amount: item.product.price ? item.product.price * 100 : 0,
      };
      break;
    default:
      console.log("Item type is unsupported");
  }

  itemIds.push(itemId);
  console.log(price_data);
  return price_data;
};

router.post("/create-checkout-session", async (req, res) => {
  const data = req.body;
  metadata.touristId = data.touristId;
  metadata.type = data.type;
  //   metadata.extra = data.extra.toString();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: data.items.map((item) => {
      const product = createProduct(data.type, item);
      metadata.list = itemIds.toString();
      return {
        price_data: product,
        quantity: item.quantity ? item.quantity : 1,
      };
    }),
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: req.body.successUrl,
    cancel_url: req.body.cancelUrl,
    metadata: metadata,
    // automatic_tax: { enabled: true }
  });
  return res.json({ url: session.url });
});

router.post("/webhook", async (req, res) => {
  let event;

  event = req.body;

  if (event.type === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);

    fulfillment_method(event.data.object.id);
  }
});

const fulfillment_method = async (sessionId) => {
  console.log("fulfillment session id: " + sessionId);
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  itemIds = [];
  const data = checkoutSession.metadata;
  const touristId = data.touristId;
  console.log(data);
  switch (data.type) {
    case "activity":
      const activityId = data.list;
      TouristController.bookActivityStripe(touristId, activityId);
      break;
    case "itinerary":
      const itineraryId = data.list;
      TouristController.bookItineraryStripe(touristId, itineraryId);
      break;
    case "product":
      console.log(data.extra);
      OrderController.checkoutOrderStripe(touristId, data.extra?.addressId);
      break;
    default:
      console.log("product Type not supported");
  }
};

export default router;
