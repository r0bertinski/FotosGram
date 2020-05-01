import express from 'express';  


export default class Server {
    public app: express.Application;

    // public port: number = 3000;;

    constructor() {
        // inicializamos express.
        this.app = express();
    }

    start( callback: Function ) { 

    this.app.listen( process.env.PORT || 3000, callback());
    // start the server listening for requests
    // this.app.listen(process.env.SERVER_PORT || 3000, () => console.log(`Server is running... in port ${process.env.SERVER_PORT}`));

        // this.app.listen( this.port, () => { console.log(`listen port ${this.port}`)});
    }

}