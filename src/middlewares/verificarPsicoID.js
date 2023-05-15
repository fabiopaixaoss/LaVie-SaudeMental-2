const Psicologo = require('../models/Psicologo'); // Importando models do Psicólogo

// Criando o middleware para verificar se consta o ID do Psicólogo no Banco de Dados.
const verifyPsicologo = async (req, res, next) => {
    const { id } = req.params; // O ID cadastrado virá para o params da requisição.

    try {
        const psicologo = await Psicologo.findByPk(id) // Aqui vou pegar o ID e checar se consta na DB.
        if (!psicologo) {
            return res.status(404).json({message: 'ID não encontrado!'})
        };
        req.psicologo = psicologo; // Atrelar o psicólogo à req da rota, assim ele estará salvo para consumir.
        res.status(200).json({message: 'Profissional encontrado!', psicologo});
        next()
        
    } catch (error) {
        console.log('ID não encontrado', error);
        res.status(404).json({message: 'ID não encontrado!'});
        
    };

};
module.exports = verifyPsicologo;