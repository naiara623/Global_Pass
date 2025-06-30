const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const session = require('express-session');
require("dotenv").config();
const db = require("./db");
const { insertUser, selectUser, updateUser, deleteUser, getUserByEmail, inserirComentario,
  listarComentarios } = require("./db");

const app = express();
const port = 3001;

let posts = []; // Simulação temporária para armazenamento em memória

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use('/uploads/posts', express.static('uploads/posts'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/api/cadastro', async (req, res) => {
  const { nome, email, idioma, nacionalidade, senha } = req.body;
  try {
    await insertUser({ nome, email, idioma, nacionalidade, senha });
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

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await selectUser(email, senha);
    if (usuario) {
      req.session.user = { email: usuario.email };
      console.log("req.session.user =======>>>>>> ", req.session.user);
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

app.get('/api/usuario-atual', async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  const email = req.session.user.email;
  try {
    const usuario = await getUserByEmail(email);
    if (usuario) {
      res.json({
        id: usuario.id_usuarios,
        nome: usuario.nome,
        email: usuario.email,
        idioma: usuario.idioma,
        nacionalidade: usuario.nacionalidade,
        telefone: usuario.telefone,
        profile_image: usuario.profile_image,
        followers: 245,
        following: 178
      });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});

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

app.delete('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;
  console.log('Tentando deletar usuário com email:', email);
  try {
    await deleteUser(email);
    req.session.destroy();
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ erro: error.message });
  }
});


app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ sucesso: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const storagePostImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPostImage = multer({ storage: storagePostImages });

app.post('/api/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ erro: 'Não autenticado' });
  if (!req.file) return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
  try {
    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    await db.pool.query(
      'UPDATE usuarios SET profile_image = $1 WHERE email = $2',
      [imageUrl, req.session.user.email]
    );
    res.json({ imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ erro: 'Erro ao fazer upload da imagem' });
  }
});

app.get('/api/posts-do-usuario', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ erro: 'Email não fornecido' });
  try {
    const resultado = await db.pool.query(
      'SELECT id, caption, image_url AS "imageUrl" FROM posts WHERE id_usuarios = (SELECT id_usuarios FROM usuarios WHERE email = $1)',
      [email]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ erro: 'Erro ao buscar posts' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ erro: 'Não autenticado' });
  const { id } = req.params;
  try {
    const checkResult = await db.pool.query(
      'SELECT * FROM posts WHERE id = $1 AND id_usuarios = (SELECT id_usuarios FROM usuarios WHERE email = $2)',
      [id, req.session.user.email]
    );
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ erro: 'Post não encontrado ou não pertence ao usuário' });
    }
    await db.pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ erro: 'Erro ao deletar post' });
  }
});

app.post('/api/posts', uploadPostImage.single('image'), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ erro: 'Não autenticado' });
  if (!req.file) return res.status(400).json({ erro: 'Imagem não enviada' });
  const { caption } = req.body;
  const imageUrl = `/uploads/posts/${req.file.filename}`;
  try {
    const user = await getUserByEmail(req.session.user.email);
    await db.pool.query(
      'INSERT INTO posts (id_usuarios, image_url, caption, data_criacao) VALUES ($1, $2, $3, NOW())',
      [user.id_usuarios, imageUrl, caption]
    );
    res.status(201).json({ sucesso: true, imageUrl, caption });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ erro: 'Erro ao criar post' });
  }
});

app.get('/api/posts-todos', async (req, res) => {
  const result = await db.pool.query(`
    SELECT 
      p.id, 
      p.image_url as "imageUrl", 
      p.caption, 
      u.email as username, 
  u.profile_image as userImage
    FROM posts p
    JOIN usuarios u ON p.id_usuarios = u.id_usuarios
    ORDER BY p.data_criacao DESC
  `);
  res.json(result.rows);
});

app.post('/api/comentarios', async (req, res) => {
  if (!req.session?.user?.email) 
    return res.status(401).json({ erro: 'Não autenticado' });

  const { comentario } = req.body;

  try {
    const usuario = await getUserByEmail(req.session.user.email);
    const novoComentario = await inserirComentario(usuario.id_usuarios, comentario);
    
    res.status(201).json({
      id: novoComentario.idcomentarios,
      user_name: usuario.nome,
      comentario: novoComentario.comentario
    });
  } catch (err) {
    console.error('Erro ao inserir comentário:', err);
    res.status(500).json({ erro: 'Erro ao salvar comentário' });
  }
});

app.get('/api/comentarios', async (req, res) => {
  try {
    const comentarios = await listarComentarios(); // função que busca do banco
    res.json(comentarios);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ error: 'Erro ao carregar comentários' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
