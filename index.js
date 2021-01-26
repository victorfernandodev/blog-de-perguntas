const { response } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const PORT = 8081;
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Database
connection
    .authenticate().then(() => {
        console.log("Conexão feita com banco de dados.")
    })
    .catch((err) => {
        console.log("Não foi possivel conectar com o banco!" + err);
    })
//Estou dizendo para o express, que a view engine será 'ejs'.
//Esse será o renderizador do html
app.set('view engine', 'ejs');
//Pode colocar o nome que quiser nos arquivos estaticos.
app.use(express.static('public'));
//Body Parser - Usado para converter dados da requisição para vários formatos. Um deles o : Json.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[['id', 'DESC']]}).then((perguntas) => { // ASC - crescente, DESC - decrescente
        res.render("index", {
            perguntas: perguntas
        })
    })
})
    

app.get("/perguntar", (req, res) => {
    res.render("perguntas");
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
        console.log("Pergunta cadastrada!");
    }).catch((err) => {
        console.log("Erro: " + err);
    })
});

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then((respostas) => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                    
                });
            });
        } else {
            res.redirect("/");
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
        console.log("Pergunta cadastrada!");
    }).catch((err) => {
        console.log("Erro ao cadastrar a pergunta!" + err);
    })

})

app.listen(PORT, () => {
    console.log("App está rodando.");
})