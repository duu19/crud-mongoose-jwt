// importar express
const express = require("express");
// controller
const AuthController = require("./controller/auth-controller");

// definido como express
const app = express();

// receber json
app.use(express.json());

// rotas
app.use("/auth", AuthController);

// port +1000
app.listen(3010, () => {
    console.log(`server on`)
});