"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.port = 3000;
        // inicializamos express.
        this.app = express_1.default();
    }
    start(callback) {
        this.app.listen(this.port, callback);
        // this.app.listen( this.port, function() { console.log('hessllo')});
    }
}
exports.default = Server;
