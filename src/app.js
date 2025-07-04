"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/saudacao/:nome', (req, res) => {
    const nome = req.params.nome;
    res.json({ mensagem: `Olá ${nome}!`
    });
});
console.log(`Servidor rodando em http://localhost:${port}`);
