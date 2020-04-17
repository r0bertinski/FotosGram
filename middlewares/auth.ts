
import { Response, Request, NextFunction} from 'express';
import Token from '../classes/token';
import { User } from '../models/user.model';

export const verifyToken = ( req: any, res: Response, next: NextFunction) => {

    // Podemo recibir el token como argumento de url, los headers (lo mas comun)

    const userToken = req.get('x-token') || ''; // si no recibimos nada lo asigna a espacio vacio

    Token.checkToken( userToken )
         .then( (decoded: any) => {
             console.log('Decoded', decoded);
             req.user = decoded.user; // ?
             next();
         })
         .catch( err => {
            res.json( {
                ok: false,
                message: 'Token is not valid'
            });
         });
}