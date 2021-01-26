const Sequelize = require('sequelize');
const connection = require('./database');

//Definição do model.
const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
//Criando a tabela no banco. E definindo o force: false, pq se existir uma tabela criada, não criar novamente.
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;