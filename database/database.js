// conectar mongodb
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://du19:123321123@crudapi.xrpb6op.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao MongoDB!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB.", error);
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;

