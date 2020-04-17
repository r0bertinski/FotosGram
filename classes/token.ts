
import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = 'this-is-my-secreet-app-seed';
    private static valid_to: string = '30d';

    constructor() {}

    static getJwtToken( payload: any ):string {

        // payload contiene datos del usuario
        // seed es una clave que NO se debe compartir y que junto al paypload forman parte del token encriptado.
        return jwt.sign( {
            user: payload
        }, this.seed, { expiresIn: this.valid_to})
    }

    static checkToken( userToken: string ) {

        return new Promise( (resolve, reject) => {

            jwt.verify( userToken, this.seed, ( err, decoded) => {
                if ( err ){
                    reject();
                } else {
                    resolve( decoded );
                }
            });
        });
      
    }
}