const { Pool } = require("pg");
// const bcrypt = require("bcrypt"); // removido porque não vamos usar
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT_NUMBER,
});

// Insere um usuário no banco (sem criptografar a senha)
async function insertUser(user) {
  const senha = user.senha; // Senha exata do frontend

  const sql = `
    INSERT INTO usuarios 
    (nome, email, idioma, nacionalidade, senha) 
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    user.nome,
    user.email,
    user.idioma,
    user.nacionalidade,
    senha,
  ];

  const client = await pool.connect();
  try {
    await client.query(sql, values);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email já cadastrado");
    }
    throw error;
  } finally {
    client.release();
  }
}

// Busca usuário por e-mail e compara a senha (login) sem bcrypt
async function selectUser(email, senha) {
  const sql = "SELECT * FROM usuarios WHERE email = $1";
  const client = await pool.connect();

  try {
    const result = await client.query(sql, [email]);
    const usuario = result.rows[0];

    if (usuario && usuario.senha === senha) {
      // Remove a senha do objeto antes de retornar
      const { senha, ...userWithoutPassword } = usuario;
      return userWithoutPassword;
    }
    return null;
  } finally {
    client.release();
  }
}

module.exports = { insertUser, selectUser };
