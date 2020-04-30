import express from 'express';  


export default class Server {
    public app: express.Application;

    public port: number = 3000;;

    constructor() {
        // inicializamos express.
        this.app = express();
    }

    start( callback: Function ) { 
        this.app.listen( this.port, callback());
        // this.app.listen( this.port, () => { console.log(`listen port ${this.port}`)});
    }

}