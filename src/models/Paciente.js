const Sequelize = require('sequelize'); // Importando as funcionalizades do Sequelize
const sequelize = require('../database/db'); // Importando a conexão com o banco de dados

// Criando e definindo a tabela de pacientes
const Paciente = sequelize.define('Paciente', {
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

  idade: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Paciente;
