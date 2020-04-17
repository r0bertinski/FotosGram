"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getJwtToken(payload) {
        // payload contiene datos del usuario
        // seed es una clave que NO se debe compartir y que junto al paypload forman parte del token encriptado.
        return jsonwebtoken_1.default.sign({
            user: payload
        }, this.seed, { expiresIn: this.valid_to });
    }
    static checkToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = 'this-is-my-secreet-app-seed';
Token.valid_to = '30d';
