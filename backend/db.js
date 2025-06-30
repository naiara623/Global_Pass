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
      console.log("Usuário encontrado=====>>>>>>> ", userWithoutPassword);
      
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

async function updateUser(email, dados) {
  const result = await pool.query(
    `UPDATE usuarios 
     SET 
       nome = COALESCE($1, nome),
       telefone = COALESCE($2, telefone),
       nacionalidade = COALESCE($3, nacionalidade),
       idioma = COALESCE($4, idioma)
     WHERE email = $5
     RETURNING id_usuarios as id, nome, email, telefone, nacionalidade, idioma, profile_image as "profileImage"`,
    [dados.nome, dados.telefone, dados.nacionalidade, dados.idioma, email]
  );
  return result.rows[0];
}

async function deleteUser(email) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Pega o ID do usuário
    const userResult = await client.query('SELECT id_usuarios FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      throw new Error("Usuário não encontrado");
    }
    const userId = userResult.rows[0].id_usuarios;

    // 2. Deleta os posts desse usuário
    await client.query('DELETE FROM posts WHERE id_usuarios = $1', [userId]);

    // 3. Deleta o usuário
    const deleteUserResult = await client.query('DELETE FROM usuarios WHERE email = $1 RETURNING *', [email]);

    await client.query('COMMIT');
    return deleteUserResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}


async function getUserByEmail(email) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id_usuarios, nome, email, telefone, nacionalidade, idioma, profile_image FROM usuarios WHERE email = $1',
      [email]
    );
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } finally {
    client.release();
  }
}

// async function getUserByEmail(email) {
//   const sql = "SELECT * FROM usuarios WHERE email = $1 AND senha = $2";
//   const client = await pool.connect();

//   try {
//     const result = await client.query(sql, [email]);
//     console.log("result ---------------->>>>>>>>>> ", result);
    
//     if (result.rows.length > 0) {
//       const resultado = result.rows[0];
//       console.log("Usuário encontrado=====>>>>>>> ", resultado);
      
//       return resultado;
//     }
//     return null;
//   } finally {
//     client.release();
//   }
// }

async function inserirComentario(id_usuarios, comentario) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO comentarios (comentario, id_usuarios)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [comentario, id_usuarios];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function listarComentarios() {
  const client = await pool.connect();
  const sql = `
    SELECT 
      c.idcomentarios AS id,
      u.nome AS user_name,
      c.comentario
    FROM comentarios c
    JOIN usuarios u ON c.id_usuarios = u.id_usuarios
    ORDER BY c.idcomentarios DESC
  `;
  try {
    const result = await client.query(sql);
    return result.rows;
  } finally {
    client.release();
  }
}




module.exports = {
   pool, // 👈 adicione isso
  insertUser,
  selectUser,
  getUserByEmail,
  getUserProfileByEmail,
  updateUser,
  deleteUser,
    inserirComentario,
  listarComentarios
};