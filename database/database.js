//Criar conexão com sequelize
const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', '3158', {
    host: 'localhost',
    dialect: 'mysql'
});


module.exports = connection;