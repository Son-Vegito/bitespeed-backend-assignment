
import express from 'express';
const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/identify', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log('App listening on PORT', PORT);
})