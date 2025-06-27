
import express from 'express';
import { identifyContact } from './controllers/identifyController';

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/identify', identifyContact)

app.listen(PORT, () => {
    console.log('Server listening on PORT', PORT);
})