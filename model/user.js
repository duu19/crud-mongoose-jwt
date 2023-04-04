const mongoose = require("../database/database");

// jwt - criptografar
const bcryptjs = require("bcryptjs");

// model do usuario
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// criptografar senha antes que o usuario seja criado
UserSchema.pre("save", async function(next) {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
})

// receber padrões(nome, email, senha e quando foi criado) do schema
const User = mongoose.model("user", UserSchema);

module.exports = User;