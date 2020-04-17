"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const userRoutes = express_1.Router();
// userRoutes.get('/prueba', ( req, res) => {
//     res.json({
//         ok: true,
//         message: 'Todo funciona bien!'
//     })
// });
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User or password is not valid'
            });
        }
        if (userDB.checkPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                message: 'User or password is not valid ***'
            });
        }
    });
});
userRoutes.post('/create', (req, res) => {
    // Extraer info del posteo
    const user = {
        name: req.body.name,
        email: req.body.email,
        // Revisar decrypt
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    // Store in db
    user_model_1.User.create(user).then(userDB => {
        console.log('userDB', userDB.email);
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
            // user: userDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// I set a middleware who will executed before the update endpoint.
userRoutes.post('/update', auth_1.verifyToken, (req, res) => {
    // More than one middleware
    // userRoutes.post('/update', [verifyToken, middleware2], ( req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar,
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User does not exsits in the Db'
            });
        }
        // Si se actualizo todo, por ello hay q generar un nuevo token ya que algo de lo que forma el token se cambio (el payload)
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
            // user: userDB
        });
    });
});
// Get user info from the token
userRoutes.get('/', [auth_1.verifyToken], (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});
exports.default = userRoutes;
