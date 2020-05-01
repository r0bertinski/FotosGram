"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    // public port: number = 3000;;
    constructor() {
        // inicializamos express.
        this.app = express_1.default();
    }
    start(callback) {
        this.app.listen(process.env.PORT || 3000, callback());
        // start the server listening for requests
        // this.app.listen(process.env.SERVER_PORT || 3000, () => console.log(`Server is running... in port ${process.env.SERVER_PORT}`));
        // this.app.listen( this.port, () => { console.log(`listen port ${this.port}`)});
    }
}
exports.default = Server;
