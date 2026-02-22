require('dotenv').config();

const express = require('express');
const webhookRouter = require('./webhook');

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'srborem-chatbot' });
});

app.use('/webhook', webhookRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`[chatbot] rodando na porta ${port}`);
});
