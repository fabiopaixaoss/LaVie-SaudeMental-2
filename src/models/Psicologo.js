const Sequelize = require('sequelize'); // Importando as funcionalizades do Sequelize
const sequelize = require('../database/db'); // Importando a conexão com o banco de dados

// Criando e definindo a tabela de psicólogos
const Psicologo = sequelize.define('Psicologo', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },

  nome: {
    type: Sequelize.STRING(100),
    allowNull: false
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  salt: {
    type: Sequelize.STRING,
    allowNull: false
  },

  apresentacao: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Psicologo;