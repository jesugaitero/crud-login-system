const { Schema, model } = require('mongoose');

const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');



const UsuariosSchema = new Schema({

    username: { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, trim: true },
    hashed_password: { type: String, required: true },
    //about: { type: String, trim: true },
    salt: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    //historia: { type: Array, default: [] }

},
    {
        timestamps: true
    },
    { typeKey: '$type' }
);

UsuariosSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UsuariosSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};


module.exports = model('user', UsuariosSchema)