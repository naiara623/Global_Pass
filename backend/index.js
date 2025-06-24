const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { insertUser, selectUser, updateUser, deleteUser, getUserByEmail, getUserProfileByEmail } = require("./db");
const session = require('express-session');
const multer = require('multer');
const path = require('path');
require("dotenv").config();
//aaaaaaaaaaa
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Para desenvolvimento com HTTP
}));

// Rota de cadastro
app.post('/api/cadastro', async (req, res) => {
  const {
    nome,
    email,
    idioma,
    nacionalidade,
    senha,
  } = req.body;

  console.log('Senha recebida:', senha); // 👈 Adicione isso para testar

  try {
    await insertUser({
      nome,
      email,
      idioma,
      nacionalidade,
      senha,
    });

    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro no cadastro:', error.message);
    if (error.message === 'Email já cadastrado') {
      res.status(409).json({ erro: 'Email já cadastrado' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  }
});




// Rota de login
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await selectUser(email, senha);
    if (usuario) {
       req.session.user = { email: usuario.email }; // Armazena email na sessão
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

app.get('/api/cadastro', (req, res) => {
  res.send('Rota GET funcionando!'); 
});

// Rota para obter usuário pelo email
app.get('/api/e_so_um_exemplo', async (req, res) => { // Mudar depois

  try {
    const usuario = await getUserProfileByEmail(req.session.user.email);
    // console.log('Usuário encontrado=======>>>>>>>>>', usuario);

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});



// Rota para obter usuário atual (baseado na sessão)
app.get('/api/usuario-atual', async (req, res) => {
  console.dir('Sessão atual======>>>>>>>>:', req.session);

  
  // if (!req.session.user) {
  //   return res.status(401).json({ erro: 'Não autenticado' });
  // }

  try {
    const usuario = await getUserByEmail(req.session.user.email);
    // console.log('Usuário encontrado=======>>>>>>>>>', usuario);

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});

// Rota para atualizar usuário
app.put('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;
  const { nome, telefone, nacionalidade, idioma } = req.body;

  try {
    const updatedUser = await updateUser(email, { nome, telefone, nacionalidade, idioma });
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});
// Rota para deletar usuário
app.delete('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;

  try {
    await deleteUser(email);
    req.session.destroy(); // Encerra a sessão
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ erro: 'Erro ao deletar usuário' });
  }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ sucesso: true });
});

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rotas de Postagens
app.get('/api/posts-do-usuario', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE usuario_email = $1 ORDER BY data_criacao DESC',
      [req.session.user.email]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ erro: 'Erro ao buscar posts' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  const { id } = req.params;

  try {
    // Verifica se o post pertence ao usuário antes de deletar
    const checkResult = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND usuario_email = $2',
      [id, req.session.user.email]
    );

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ erro: 'Post não encontrado ou não pertence ao usuário' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ erro: 'Erro ao deletar post' });
  }
});

// Rota de Upload de Imagem de Perfil
app.post('/api/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
  }

  try {
    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    
    // Atualiza a imagem no banco de dados
    await pool.query(
      'UPDATE usuarios SET profile_image = $1 WHERE email = $2',
      [imageUrl, req.session.user.email]
    );

    res.json({ imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ erro: 'Erro ao fazer upload da imagem' });
  }
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});