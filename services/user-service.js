const User = require("../model/user");

// procurar usuario especifico
const findByIdUser = (id) => {
    return User.findById(id);
}

// todos usuarios
const findAllUser = () => {
    return User.find();
}

// editar usuario
const updateUser = (id, user) => {
    return User.findByIdAndUpdate(id, user, {returnDocument: "after"});
}

// apagar usuario
const deleteUser = (id) => {
    return User.findByIdAndRemove(id);
}

module.exports = {
    findByIdUser,
    findAllUser,
    updateUser,
    deleteUser
};