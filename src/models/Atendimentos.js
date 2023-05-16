const Sequelize = require('sequelize'); // Importando as funcionalizades do Sequelize
const sequelize = require('../database/db'); // Importando a conexão com o banco de dados

// Criando e definindo a tabela de atendimentos //
const Atendimento = sequelize.define('Atendimento', {
  paciente_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },

  data_atendimento: {
    type: Sequelize.STRING,
    allowNull: false
  },

  observacao: {
    type: Sequelize.STRING(300),
    allowNull: false
  },
});

module.exports = Atendimento;