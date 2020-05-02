import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import  bcrypt  from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/auth';

const userRoutes = Router();

// Login endpoint
userRoutes.post('/login', (req: Request, res: Response) => {
 const body = req.body;

 User.findOne( { email: body.email }, ( err, userDB ) => {

    if ( err ) throw err;

    // The user was not found in the Db.
    if ( !userDB ) {
        return res.json( {
            ok: false,
            message: 'User or password is not valid'
        })
    }

    // Check password.
    if( userDB.checkPassword( body.password )) {

        // Generate a valid user token.
        const tokenUser = Token.getJwtToken( {
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json( {
            ok: true,
            token: tokenUser
        });
    } else {
        return res.json( {
            ok: false,
            message: 'User or password is not valid'
        })
    }
 })
});

// Create a new user.
userRoutes.post('/create', ( req: Request, res: Response) => {

    // Extraer info del posteo
    const user = {
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    // Store in db
    User.create( user ).then( userDB => {

        // Generate a valid user token.
        const tokenUser = Token.getJwtToken( {
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json( {
            ok: true,
            token: tokenUser
        });

    
    }).catch( err => {
        res.json({
            ok: false,
            err
        })
    }); 
});

// I set a middleware who will executed before the update endpoint.
userRoutes.post('/update', verifyToken, ( req: any, res: Response) => {

    // Can user more than one middleware like this:
    // userRoutes.post('/update', [verifyToken, middleware2], ( req, res) => {

    const user = {
        name: req.body.name     || req.user.name, // If any data is retrieved, then it keeps the old one.
        email: req.body.email   || req.user.email,
        avatar: req.body.avatar || req.user.avatar,
    }

    User.findByIdAndUpdate( req.user._id, user, { new: true }, ( err, userDB: any ) => {

        if( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                message: 'User does not exsits in the Db'
            });
        }

        // Si se actualizo todo, por ello hay q generar un nuevo token ya que algo de lo que forma el token se cambio (el payload)
        const tokenUser = Token.getJwtToken( {
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json( {
            ok: true,
            token: tokenUser
            // user: userDB
        });
    });
    
});

// Get user info from the token
userRoutes.get('/', [ verifyToken ], ( req: any, res: Response) => {

    const user = req.user;

    res.json({
        ok: true,
        user
    });
    
});

export default userRoutes;