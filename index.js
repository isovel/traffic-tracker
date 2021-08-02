const express = require('express');
const Database = require("@replit/database")

const app = express();
const db = new Database();
const port = process.env['PORT'] | 80;

const exists = async (value) => {
  let temp = await db.list(value);
  temp = temp[0];
  return (typeof(temp) === 'string' && temp === value);
};

app.get('/', async (req, res) => {
  res.status(200).end(`Use the standard url scheme of:\n\n${req.protocol}://${req.hostname}/<user>/<repo|project>[/page]`);
});

app.get('*', async (req, res) => {
  let key = req.path.slice(1).replace(/\//g, '-');
  let keyExists = await exists(key);
  !keyExists && await db.set(key, 1);
  keyExists && await db.set(key, (await db.get(key)) + 1);
  console.log(key);
  res.status('200').end((await db.get(key)).toString());
});

app.listen(port, () => console.log(`[INFO] Listening on port ${port}.`));