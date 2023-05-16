const express = require('express'); // Importando o Express.
const bodyParser = require('body-parser'); // Importando o body-parser.
const { v4: uuidv4 } = require('uuid'); // Importando a biblioteca do UUID.
const sequelize = require('./database/db'); // Importando o sequelize.
const jwt = require('jsonwebtoken'); // Importando a biblioteca JWT.
const crypto = require('crypto'); // Importando a biblioteca CRYPTO.
const Psicologo = require('./models/Psicologo'); // Importando a models dos Psicólogos.
const Paciente = require('../src/models/Paciente'); // Importando a models dos Pacientes.
const Atendimentos = require('../src/models/Atendimentos'); // Importando a models de Atendimentos.
const verifyPsicologo = require('./middlewares/verificarPsicoID'); // Importando o middleware verificarPsicoID.
const verifyPaciente = require('../src/middlewares/verificarPacienteID') // Importando o middleware verifyPaciente.
const verifyAtendimentosID = require('./middlewares/verifyAtendimentoID'); // Importando o middleware verifyUserID.
const { UUID } = require('sequelize');
require('dotenv').config()

const app = express(); // Atribuindo as funcionalidade do Express para a const app.
const port = 3333; // Definindo a porta do nosso localhost que vai ser rodado.

app.use(bodyParser.json()) // Configurando o middleware body-parser para a aplicação.

// Sincronizando com o banco de dados
sequelize.sync()
.then(() => console.log('Sincronizado com o banco de dados!'))
.catch((error) => console.log('Não foi possível sincronizar com o banco de dados!', error));


// Início das rotas de Psicólogos //
// Criando a rota de GET que lista todos os Psicólogos (exceto a senha).
const getPsicologos = async function (req, res) {
  try {
    const psicologos = await Psicologo.findAll({
      attributes: { exclude: ['senha'] }
    });
    res.status(200).json({ message: 'Profissionais cadastrados: ', psicologos });
  } catch (error) {
    res.status(500).json({ error });
  }
};
app.get('/psicologos', getPsicologos);

// Criando rota de GET que lista os dados do psicólogo pelo ID.
const getPsicologoById = function (req, res) {
  const { psicoID } = req.params;
  res.status(200).json({ message: `Psicólogo encontrado com sucesso!`, psicologoId: psicoID });
};
app.get('/psicologos/:id', verifyPsicologo, getPsicologoById);

// Criando rota de POST para cadastrar Psicólogo na database, com validação de email e senha, incluindo criptografia.
app.post('/psicologos', async (req, res) => {
  const { nome, email, senha, apresentacao } = req.body;

  // Valida o email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Email inválido!' });
  }

  // Valida a senha
  if (!senha || senha.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
  }

  // Gera um salt único para a criptografia da senha
  const salt = crypto.randomBytes(16).toString('hex');

  // Cria o hash da senha usando o salt
  const senhaHash = crypto
    .createHash('sha256')
    .update(senha + salt)
    .digest('hex');

  try {
    // Cria o psicólogo no banco de dados
    const psicologo = await Psicologo.create({
      id: uuidv4(),
      nome,
      email,
      senha: senhaHash,
      salt,
      apresentacao,
    });

    res.status(201).json({ message: 'Psicólogo criado com sucesso!', psicologo });
  } catch (error) {
    console.log('Erro ao criar psicólogo', error);
    res.status(500).json({ message: 'Não foi possível criar o psicólogo' });
  }
});

// Criando uma rota de PUT para atualizar os dados do Psicólogo no banco de dados.
const updatePsicologo = async function(req, res) {
  const { id } = req.params;
  const { nome, email, senha, apresentacao } = req.body;
  
  // 

  try {
    const psicologo = await Psicologo.findByPk(id);
    if (!psicologo) {
      return res.status(404).json({ message: "Psicólogo não encontrado!" });
    }

    psicologo.nome = nome || psicologo.nome;
    psicologo.email = email || psicologo.email;
    psicologo.senha = senha || psicologo.senha;
    psicologo.apresentacao = apresentacao || psicologo.apresentacao;

    await psicologo.save();

    res.status(200).json({ message: "Dados do psicólogo atualizados com sucesso!", psicologo });
  } catch (error) {
    res.status(400).json({ message: `Ocorreu um erro na requisição! ${error}` });
  }
};
app.put('/psicologos/:id', updatePsicologo);

// Criando a rota DELETE para excluir dados do Psicólogo do Banco de Dados
const deletePsicologoFunction = async function(req, res) {
  const id = req.params.id;
  try {
    const psicologo = await Psicologo.findOne({ where: { id } });
    if (!psicologo) {
      return res.status(404).json({ message: 'Psicólogo não encontrado!' });
    }
    await psicologo.destroy();
    res.status(200).json({ message: 'Psicólogo deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
app.delete('/psicologos/:id', deletePsicologoFunction);
// Fim das rotas de Psicólogos //


// Início das rotas de Pacientes //
// Criando a rota de GET que lista todos os Pacientes.
const getPacientes = async function (req, res) {
  try {
    const pacientes = await Paciente.findAll();
    res.status(200).json({ message: 'Pacientes cadastrados: ', pacientes });
  } catch (error) {
    res.status(500).json({ error });
  }
};
app.get('/pacientes', getPacientes);

// // Exibir dados do Paciente pelo ID.
const getPacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    res.status(200).json({ message: 'Paciente encontrado', paciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar paciente' });
  }
};
app.get('/pacientes/:id', verifyPaciente, getPacienteById);

// Criando rota de POST para cadastrar Pacientes
app.post('/pacientes', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Corpo da requisição inválido!" });
  }

  const { nome, email, idade } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Email inválido!" });
  }

  try {
    const paciente = await Paciente.create({
      id: uuidv4(),
      nome,
      email,
      idade
    });

    res.status(200).json({ message: 'Paciente cadastrado com sucesso!', paciente });
  } catch (error) {
    res.status(400).json({ message: `Ocorreu um erro na requisição! ${error}` });
  }
});

// Criando rota de PUT para atualizar dados dos Pacientes
const updatePaciente = async function(req, res) {
  const { id } = req.params;
  const { nome, email, idade } = req.body;
  
  // 

  try {
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente não encontrado!" });
    }

    paciente.nome = nome || paciente.nome;
    paciente.email = email || paciente.email;
    paciente.idade = idade || paciente.idade;

    await paciente.save();

    res.status(200).json({ message: "Dados do paciente atualizados com sucesso!", paciente });
  } catch (error) {
    res.status(400).json({ message: `Ocorreu um erro na requisição! ${error}` });
  }
};
app.put('/pacientes/:id', updatePaciente);

// Criando rota de DELETE para excluir dados de um Paciente
const deletePaciente = async function(req, res) {
  const id = req.params.id;
  try {
    const paciente = await Paciente.findOne({ where: { id } });
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado!' });
    }
    await paciente.destroy();
    res.status(200).json({ message: 'Paciente deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
app.delete('/pacientes/:id', deletePaciente);
// Fim das rotas de Pacientes //


// Início das rotas dos Atendimentos //
// Criando rota de GET para listar todos os atendimentos da database.
const getAtendimentos = async function (req, res) {
  try {
    const atendimentos = await Atendimentos.findAll();
    res.status(200).json({ message: 'Atendimentos cadastrados: ', atendimentos });
  } catch (error) {
    res.status(500).json({ error });
  }
};
app.get('/atendimentos', getAtendimentos);

// Criando rota de GET para exibir Atendimento pelo ID.
const getAtendimentosID = async (req, res) => {
  try {
    const { id } = req.params;
    const atendimento = await Atendimentos.findByPk(id); // Corrigido para usar o modelo Atendimento
    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento não encontrado' });
    }
    res.status(200).json({ message: 'Atendimento encontrado', atendimento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar atendimentos' });
  }
};

app.get('/atendimentos/:id', verifyAtendimentosID, getAtendimentosID);


// Criando rota de POST para cadastrar Atendimentos na database.
const cadastrarAtendimento = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Corpo da requisição inválido!" });
  }

  const { data_atendimento, observacao } = req.body;

  try {
    const id = uuidv4(); // Gerar um novo ID usando UUID

    const paciente = await Atendimentos.create({
      paciente_id: uuidv4(),
      data_atendimento,
      observacao
    });

    res.status(200).json({ message: 'Atendimento cadastrado com sucesso!', paciente });
  } catch (error) {
    res.status(400).json({ message: `Ocorreu um erro na requisição! ${error}` });
  }
};

app.post('/atendimentos', cadastrarAtendimento);

// Fim das rotas dos Atendimentos. //


// Início da rota de Login. //
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Procura o usuário pelo email no banco de dados (model Psicólgos)
  const loginPsico = await Psicologo.findOne({ where: { email } });

  if (!loginPsico) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Gera o hash da senha informada usando o salt armazenado na model do psicólogo
  const senhaHash = crypto
    .createHash('sha256')
    .update(senha + loginPsico.salt)
    .digest('hex');

  // Verifica se o hash da senha corresponde ao hash armazenado do psicólogo
  if (senhaHash !== loginPsico.senha) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Gera o Token
  const token = jwt.sign({ id: loginPsico.id }, `${process.env.JWT_SECRET}`);

  res.json({ token });
});
// Fim da rota de Login. //


// Colocar o app numa porta do nosso localhost.
app.listen(port, () => console.log(`Server online em ${port}`));