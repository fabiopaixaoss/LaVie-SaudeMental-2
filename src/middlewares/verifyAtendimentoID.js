const Atendimento = require('../models/Atendimentos');


// Criando o middleware para verificar se consta o ID do atendimento no Banco de Dados.
const verifyAtendimentosID = async (req, res, next) => {
    const {id} = req.params; // O ID cadastrado virá para o params da requisição.

    try {
        const atendimentos = await Atendimento.findByPk(id) // Aqui vou pegar o ID e checar se consta na DB.
        if (!atendimentos) {
            return res.status(404).json({message: 'ID não encontrado!'})
        };
        req.atendimentos = atendimentos; // Atrelar o paciente à req da rota, assim ele estará salvo para consumir.
        // res.status(200).json({message: 'Paciente encontrado!', paciente});
        next()

        
    } catch (error) {
        console.log('ID não encontrado', error);
        res.status(404).json({message: 'ID não encontrado!'});
        
    };

};

module.exports = verifyAtendimentosID;