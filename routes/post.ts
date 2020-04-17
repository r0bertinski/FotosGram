import { Router, Response, Request } from 'express';
import { verifyToken } from '../middlewares/auth';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import { User } from '../models/user.model';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Get posts paginated
postRoutes.get('/', async (req: any, res: Response) => {

    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;

    // Get the user data
    const posts = await Post.find()
                            .sort( {_id: -1} )
                            .skip( skip )
                            .limit(10)
                            .populate('user','-password')
                            .exec();

    // for(let i = 0; i < posts.length; i++){
    //     await posts[i].populate('user','-password').execPopulate();
    // }

    res.json({
        ok: true,
        posts: posts,
        page: page
    })
});

// Create a post.
postRoutes.post('/', [ verifyToken ], (req: any, res: Response) => {

    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.imagesFromTempToPost( req.user._id );

    body.imgs = images;

    // Record post in the Db
    Post.create( body ).then( async postDb => {

        // Get the user data
        await postDb.populate('user','-password').execPopulate();
        res.json({
            ok: true,
            data: postDb
    
        });
    }).catch( err => {
        res.json( err );
    });

});

postRoutes.post('/upload', [ verifyToken ],  async (req: any, res: Response) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json( {
            ok: false,
            message: 'None file was uploaded'
        })
      }

    const file: FileUpload = req.files.image;

    if ( !file ) {
        return res.status(400).json({
            ok: false,
            message: 'Any image was uploaded'
        });
    }

    if ( !file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            message: 'Any image was uploaded, or mimetype is wrong'
        });
    }

    // await fileSystem.saveTemporalImage( file, req.user._id );

    await fileSystem.saveTemporalImage( file, req.user._id )
                    .then(console.log)
                    .catch(console.error);
 
    res.json({
        ok: true,
        file: file.mimetype
    });
 
});


postRoutes.get('/image/:userid/:img', [ verifyToken ], (req: any, res: Response) => {

    const userId= req.params.userid;
    const img = req.params.img;

    const pathPhoto = fileSystem.getPhotoUrl( userId, img );

    res.sendFile( pathPhoto );
    // res.json({
    //     pathPhoto
        
    // });
 
});




export default postRoutes;