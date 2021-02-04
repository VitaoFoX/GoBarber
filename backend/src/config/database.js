require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // Cria as colunas created_at e update_at
    underscored: true, // Parametrização de nomeclatura de
    underscoredAll: true,
  },
};
