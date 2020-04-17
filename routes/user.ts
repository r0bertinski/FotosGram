import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import  bcrypt  from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/auth';

const userRoutes = Router();

// userRoutes.get('/prueba', ( req, res) => {
//     res.json({
//         ok: true,
//         message: 'Todo funciona bien!'
//     })
// });

userRoutes.post('/login', (req: Request, res: Response) => {
 const body = req.body;

 User.findOne( { email: body.email }, ( err, userDB ) => {

    if ( err ) throw err;

    if ( !userDB ) {
        return res.json( {
            ok: false,
            message: 'User or password is not valid'
        })
    }

    if( userDB.checkPassword( body.password)) {

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
            message: 'User or password is not valid ***'
        })
    }
 })
});

userRoutes.post('/create', ( req: Request, res: Response) => {

    // Extraer info del posteo
    const user = {
        name: req.body.name,
        email: req.body.email,
        // Revisar decrypt
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    // Store in db
    User.create( user ).then( userDB => {

        console.log('userDB', userDB.email);
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

    
    }).catch( err => {
        res.json({
            ok: false,
            err
        })
    }); 
});

// I set a middleware who will executed before the update endpoint.
userRoutes.post('/update', verifyToken, ( req: any, res: Response) => {

    // More than one middleware
    // userRoutes.post('/update', [verifyToken, middleware2], ( req, res) => {

    const user = {
        name: req.body.name     || req.user.name, // Si no se actualiza el data, se usa el antiguo.
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