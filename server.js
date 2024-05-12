const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000; // Define a porta do servidor

// Middleware para lidar com dados JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb+srv://raulkmkz87:Chess0010@cluster0.0x7fy7r.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexão com o MongoDB estabelecida com sucesso'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configurar o Express para servir arquivos estáticos
app.use(express.static('public'));


// Rotas
app.get('/', (req, res) => {
  res.send('API em execução...');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const userRoutes = require('./routes/userRoutes');

// Usar as rotas da API do usuário
app.use('/api', userRoutes);
