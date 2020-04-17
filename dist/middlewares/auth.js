"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verifyToken = (req, res, next) => {
    // Podemo recibir el token como argumento de url, los headers (lo mas comun)
    const userToken = req.get('x-token') || ''; // si no recibimos nada lo asigna a espacio vacio
    token_1.default.checkToken(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.user = decoded.user; // ?
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            message: 'Token is not valid'
        });
    });
};
