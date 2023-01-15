const cors = require('cors');
const express = require('express');

const stripeObj = require("stripe")(process.env.REACT_APP_BACK_KEY);
const uuid = require('uuid').v4();
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());


// routes
app.get("/", (req, res) => {
  res.send("This is stripe fundamentals with react codes ");
});

app.post('/payments', (req, res) => {
	const { product, token } = req.body;
	console.log("PRODUCT", product);
	console.log("PRICE", product.price);
	
  // to charge the customer only one time if network issue occur
  const idempotencyKey = uuid()

	return stripeObj.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then((customer) => {	stripeObj.charges.create({
      amount: product.price * 100,
      currency: 'INR',
      customer: customer.id,
      receipt_email: token.email,
      description: `purchase of ${product.name}`,
      shipping: {
        name: token.card.name,
        address: {
          country: token.card.address_country
        }
      }
    }, { idempotencyKey });})	
		.then(result => res.status(200).json(result))
    .catch(err => console.log(err));
})


// listen

app.listen(8282, () => console.log("Listening to port 8282"));

