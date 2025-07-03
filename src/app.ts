import express from 'express';

const app = express()
const port = 3000;

app.use(express.json());
console.log()
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
    
});

app.get('/api/saudacao/:nome', (req, res) => {
    const nome = req.params.nome;
    res.json({mensagem: `Olá ${nome}!`
    });
});
console.log(`Servidor rodando em http://localhost:${port}`);