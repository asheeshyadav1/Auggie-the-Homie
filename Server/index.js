const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 8000; // Use lowercase 'port' for consistency

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("API_KEY");

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js server!');
});

app.post('/gemini', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({
      history: req.body.history,
    });
    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong on the server');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
