const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const validator = require("validator");

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
         required: true, 
         unique: true,
         trim: true,
    }, 
    email: {
        type: String,
        required: true, 
        unique: true,
        trim: true, 
    },
    password: {
        type: String, 
        required: true,
        unique: true,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
              throw new Error(
                "Password must contain at least one letter and one number"
              );
            }
          },
    },
    cart: [
        {
            productId: String,
            quantity: Number
        }
    ]
}, {timestamps: true})

AuthSchema.methods.isPasswordMatch = async function (enteredPassword){
    let checkPassword = await bcrypt.compare(enteredPassword, this.password);
    return checkPassword;
};

module.exports = mongoose.model('AuthUser', AuthSchema)