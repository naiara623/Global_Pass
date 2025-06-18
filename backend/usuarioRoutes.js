const express = require('express');
const { 
  insertUser, 
  selectUser, 
  deleteUser, 
  updateUser, 
  getUserByEmail 
} = require('../db');
const router = express.Router();

// Rota de cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, idioma, nacionalidade, senha } = req.body;
  console.log("senha senha senha =====>>>> ", senha)

  try {
    await insertUser({ nome, email, idioma, nacionalidade, senha });
    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    if (error.message === 'Email já cadastrado') {
      res.status(409).json({ erro: 'Email já cadastrado' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await selectUser(email, senha);
    if (usuario) {
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

// Rota para obter usuário atual (via sessão)
router.get('/usuario-atual', async (req, res) => {
  try {
    // Verifique como você está armazenando o usuário na sessão
    if (!req.session.user || !req.session.user.email) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }

    const usuario = await getUserByEmail(req.session.user.email);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para atualizar usuário
router.put('/usuarios/:email', async (req, res) => {
  try {
    const result = await updateUser(req.params.email, req.body);
    res.json({ mensagem: 'Usuário atualizado com sucesso', usuario: result });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar usuário
router.delete('/usuarios/:email', async (req, res) => {
  try {
    await deleteUser(req.params.email);
    res.json({ mensagem: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir usuário" });
  }
});

module.exports = router;