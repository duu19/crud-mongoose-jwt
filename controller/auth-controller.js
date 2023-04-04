const express = require("express");
const UserModel =  require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const userService = require("../services/user-service");
const mongoose = require("mongoose");
const router = express.Router();

// gerar um token
const generateToken = (user = {}) => {
    return jwt.sign({
        id: user.id,
        name: user.name
    }, authConfig.secret, {
        expiresIn: 86400
    });
};

// usuario por ID - http://localhost:3010/auth/users/<ID>
router.get("/users/:id", async (req,res) => {
    try{
        const id = new mongoose.Types.ObjectId(req.params.id);
        let found = false;
        
        // pegar ID
        const User  = await userService.findByIdUser(id);
        
        if(User != null){
            found = true;
        }
    
        if(!found){
            return res.status(404).send({message: "Usuário não encontrado, tente outro ID."});
        }
    
        return res.status(200).send(User);
    
        }catch(err){
            console.log(`erro: ${err}`);
            return res.status(500).send("Erro no servidor, tente novamente mais tarde.");
        }
});

// todos usuarios - http://localhost:3010/auth/findAllUsers/
router.get("/findAllUsers", async (req,res) => {
    return res.status(200).send(await userService.findAllUser());
})

// editar usuario - http://localhost:3010/auth/update/<ID>
router.put("/update/:id", (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(UserModel => {
        res.send(UserModel);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send({message: "O ID não foi encontrado."});
      });
});

/* criar usuario  -  http://localhost:3010/auth/register
{
  "name": "teste",
  "email": "mail@mail.com",
  "password": "senha"
}

*/

router.post("/register", async (req, res) => {
    
    const { email } = req.body;
    if(await UserModel.findOne({email})) {
        return res.status(400).json({
            error: true,
            message: "Esse usuário já existe."
        })
    }
    const user = await UserModel.create(req.body);

    // não passar a senha
    user.password = undefined;

    return res.json({
        user,
        token: generateToken(user)
    });
});

// deletar usuario - http://localhost:3010/auth/delete/<ID>
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    return res.status(200).send(await userService.deleteUser(id));
});

/* verificar usuario (token) - http://localhost:3010/auth/authenticate

{
  "name": "register",
  "email": "register@mail.com",
  "password": "senha"
}

*/
router.post("/authenticate", async(req, res) => {

    const {email, password} = req.body;

    const user = await UserModel.findOne({email}).select("+password");
    if(!user) {
        return res.status(400).json({
            error: true,
            message: "Usuário não encontrado."
        })
    }

    // verificar se a senha está correta
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({
            error: true,
            message: "Senha inválida."
        })
    }

    user.password = undefined

    return res.json({
        user,
        token: generateToken(user)
    });
});

module.exports = router;