import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Servr listing at PORT: ${PORT}`));
