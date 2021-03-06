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
// Login endpoint
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        // The user was not found in the Db.
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User or password is not valid'
            });
        }
        // Check password.
        if (userDB.checkPassword(body.password)) {
            // Generate a valid user token.
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
                message: 'User or password is not valid'
            });
        }
    });
});
// Create a new user.
userRoutes.post('/create', (req, res) => {
    // Extraer info del posteo
    const user = {
        email: req.body.email,
        name: req.body.name,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    // Store in db
    user_model_1.User.create(user).then(userDB => {
        // Generate a valid user token.
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
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// I set a middleware who will executed before the update endpoint.
userRoutes.post('/update', auth_1.verifyToken, (req, res) => {
    // Can user more than one middleware like this:
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
