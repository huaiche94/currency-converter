const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Sample currency conversion rates
const currencyRates = {
  "TWD": {
    "TWD": 1,
    "JPY": 3.669,
    "USD": 0.03281
  },
  "JPY": {
    "TWD": 0.26956,
    "JPY": 1,
    "USD": 0.00885
  },
  "USD": {
    "TWD": 30.444,
    "JPY": 111.801,
    "USD": 1
  }
};

app.use(bodyParser.json());

app.get('/convert', (req, res) => {
  const { source, target, amount } = req.query;
  
  if (!currencyRates[source]) {
    return res.status(400).json({ msg: "Invalid source" });
  }
  if ( !currencyRates[source][target]) {
    return res.status(400).json({ msg: "Invalid target" });
  }
  const amountPattern = /^\$([1-9]\d{0,2}(,\d{3})*|0)(\.\d{2})?$/;
  if (!amount.match(amountPattern)) {
    return res.status(400).json({ msg: "Invalid amount format. Amount should start with $ and use comma as thousands separator" });
  }
  
  const rate = currencyRates[source][target];
  const amountWithoutComma = amount.toString().replace(/[$,]/g, '');
  const amountInCents = Math.round(parseFloat(amountWithoutComma) * 100);
  const convertedAmountInCents = Math.round(amountInCents * rate);
  const convertedAmount = (convertedAmountInCents / 100).toFixed(2);

  res.json({ msg: "success", amount: `$${convertedAmount}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;