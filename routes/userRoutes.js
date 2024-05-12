const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rota para criar um novo usuário
router.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar um usuário existente
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para excluir um usuário existente
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

// Rota para autenticar um usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Dados recebidos no backend:', { username, password });
  try {
    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Verificar se a senha está correta (sem bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    res.json({ message: 'Login bem-sucedido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

