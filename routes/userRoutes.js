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

// Get all users
router.get('/', async (req, res) => {
  try {
      const users = await User.find();
      console.log('Fetched users:', users);  // Log dos usuários
      res.json(users);
  } catch (err) {
      console.error('Error fetching users:', err);  // Log do erro
      res.status(500).json({ message: err.message });
  }
});

// Create a user
router.post('/', async (req, res) => {
  const user = new User({
      username: req.body.username,
      password: req.body.password
  });
  try {
      const newUser = await user.save();
      console.log('Created user:', newUser);  // Log do novo usuário
      res.status(201).json(newUser);
  } catch (err) {
      console.error('Error creating user:', err);  // Log do erro
      res.status(400).json({ message: err.message });
  }
});

// Update a user
router.patch('/users/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (req.body.username != null) user.username = req.body.username;
      if (req.body.password != null) user.password = req.body.password;

      const updatedUser = await user.save();
      console.log('Updated user:', updatedUser);  // Log do usuário atualizado
      res.json(updatedUser);
  } catch (err) {
      console.error('Error updating user:', err);  // Log do erro
      res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          console.error(`User not found with id: ${req.params.id}`);
          return res.status(404).json({ message: 'User not found' });
      }

      await User.deleteOne({ _id: req.params.id });
      console.log(`Deleted user with id: ${req.params.id}`);
      res.json({ message: 'User deleted' });
  } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;