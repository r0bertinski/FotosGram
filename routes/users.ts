import { Router } from 'express';
import { User } from '../models/user.model';

const userRoutes = Router();

// userRoutes.get('/prueba', ( req, res) => {
//     res.json({
//         ok: true,
//         message: 'Todo funciona bien!'
//     })
// });

userRoutes.post('/create', ( req, res) => {

    // Extraer info del posteo
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
    };

    // Store in db
    User.create( user ).then( userDB => {
        res.json({
            ok: true,
            user: userDB
        })
    }).catch( err => {
        res.json({
            ok: false,
            err
        })
    }); 
});

export default userRoutes;