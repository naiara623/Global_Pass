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

// MINHAS ALTERAÇÕES ------------------------------------------------
// async function connectar() {
//   const pool = new Pool({
//   user: process.env.USER_NAME,
//   host: process.env.HOST_NAME,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.PORT_NUMBER,
// });

// const client = await pool.connectar();

// console.log("Conexão com o banco de dados estabelecida com sucesso!");
// }
// connectar();

// FIM DAS MINHAS ALTERAÇÕES ----------------------------------------



// Insere um usuário no banco (sem criptografar a senha)
async function insertUser(user) {
  const client = await pool.connect();


  const sql = `
    INSERT INTO usuarios 
    (nome, email, idioma, nacionalidade, senha, telefone) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    user.nome,
    user.email,
    user.idioma,
    user.nacionalidade,
    user.senha,
    user.telefone || null
  ];
  

  try {
    const result = await client.query(sql, values);
    return result.rows[0];
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
  const sql = "SELECT * FROM usuarios WHERE email = $1 AND senha = $2";
  const client = await pool.connect();

  try {
    const result = await client.query(sql, [email, senha]);
    if (result.rows.length > 0) {
      const { senha, ...userWithoutPassword } = result.rows[0];
      return userWithoutPassword;
    }
    return null;
  } finally {
    client.release();
  }
}

// Busca usuário apenas por e-mail
async function getUserProfileByEmail(email) {
  console.log("Buscando usuário por email=========>>>>>>>> :", email);

  const client = await pool.connect();
  const sql = "SELECT * FROM usuarios WHERE email = $1";


  try {
    const result = await client.query(sql, [email]);
    if (result.rows.length > 0) {
      const { senha, ...userWithoutPassword } = result.rows[0];
      return userWithoutPassword;
    }
    return null;
  } finally {
    client.release();
  }
}

// Atualiza os dados do usuário
async function updateUser(email, newData) {
  const sql = `
    UPDATE usuarios 
    SET 
      nome = COALESCE($1, nome),
      telefone = COALESCE($2, telefone),
      nacionalidade = COALESCE($3, nacionalidade),
      idioma = COALESCE($4, idioma)
    WHERE email = $5
    RETURNING *
  `;
  const values = [
    newData.nome,
    newData.telefone,
    newData.nacionalidade,
    newData.idioma,
    email
  ];

  const client = await pool.connect();
  try {
    const result = await client.query(sql, values);
    if (result.rows.length === 0) {
      throw new Error("Usuário não encontrado");
    }
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Remove um usuário do banco
async function deleteUser(email) {
  const sql = "DELETE FROM usuarios WHERE email = $1 RETURNING *";
  const client = await pool.connect();

  try {
    const result = await client.query(sql, [email]);
    if (result.rows.length === 0) {
      throw new Error("Usuário não encontrado");
    }
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getUserByEmail(email) {
  console.log("Buscando usuário por email=========>>>>>>>> :", email);


  const result = await pool.query(
    'SELECT id, nome, email, telefone, nacionalidade, idioma, profile_image as "profileImage" FROM usuarios WHERE email = $1',
    [email]
  );

  console.log("Buscando usuário por email=========>>>>>>>> :", result.rows);

  return result.rows[0] || null;
}

async function updateUser(email, newData) {
  const result = await pool.query(
    `UPDATE usuarios 
     SET 
       nome = COALESCE($1, nome),
       telefone = COALESCE($2, telefone),
       nacionalidade = COALESCE($3, nacionalidade),
       idioma = COALESCE($4, idioma)
     WHERE email = $5
     RETURNING id, nome, email, telefone, nacionalidade, idioma, profile_image as "profileImage"`,
    [
      newData.nome,
      newData.telefone,
      newData.nacionalidade,
      newData.idioma,
      email
    ]
  );
  return result.rows[0];
}

async function deleteUser(email) {
  await pool.query('DELETE FROM usuarios WHERE email = $1', [email]);
}

module.exports = {
  insertUser,
  selectUser,
  getUserByEmail,
  getUserProfileByEmail,
  updateUser,
  deleteUser
};