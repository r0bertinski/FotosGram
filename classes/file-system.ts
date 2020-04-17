import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() { };

    // Returns a promisse
    saveTemporalImage( file: FileUpload, userId: string) {
        console.log('userId', userId);

        return new Promise( (resolve, reject) => {

                   // Crear carpetas
                //    const path = this.createUserFolder( userId );
    
                   // Nombre archivo
                //    const fileName = this.generateUniqName( file.name );
                   
                   // Mover el archivo del Temp a nuestra carpeta
                //    file.mv( `${ path }/${ fileName }`, ( err: any) => {
           
                //        if ( err ) {
                //            reject(err);
                //        } else {
                //            resolve();
                //        }
           
                //    });
            const path = this.createUserFolder( userId );
            // console.log('pathUserTemp', path);
        
            // File Name
            const fileName = this.generateUniqName( file.name );
            // console.log('fileName', fileName);
        
            // fs.chmodSync( path, 777);

            // Move file from temp to the final folder
            file.mv( `${ path }/${ fileName }`, (err: any) => {
                if ( err ) {
                    // cannot move file.
                    // console.log('cannot move file');
                    // console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
         });
    }

    private generateUniqName( originalName: string ) {

        const nameArr = originalName.split('.');

        const extension = nameArr[ nameArr.length - 1 ];
        // console.log('extension', extension);

        const uniqId = uniqid();

        return `${ uniqId }.${ extension }`;
    }

    private createUserFolder( userId: string ) {

   
        // const pathUser = this.getPath( userId, '../uploads/', '/');
        const pathUser = path.resolve(  __dirname, '../uploads/', userId);
        const pathUserTemp = `${pathUser}/temp`;
        
        console.log('pathUserTemp', pathUserTemp);;

        const existe = fs.existsSync( pathUser );

        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;
    }

    imagesFromTempToPost( userId: string) {
        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(  __dirname, '../uploads/', userId, 'posts');

        if( !fs.existsSync( pathTemp )) {
            return [];
        }

        if( !fs.existsSync( pathPost )) {
            fs.mkdirSync( pathPost );
        }

        const tempImages = this.getTempImages( userId );

        console.log('tempImages', tempImages);

        // Change images name, then it will change the path
        tempImages.forEach( img => {
            fs.renameSync( `${pathTemp}/${img}`, `${pathPost}/${img}`)
        });

        return tempImages;

    }



    private getTempImages( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync( pathTemp ) || [];

    }

    public getPhotoUrl( userId: string, img: string) {

        // Point to img
        const pathPhoto =  path.resolve(  __dirname, '../uploads/', userId, 'posts', img);

        // Check if image already exists
        const exists = fs.existsSync( pathPhoto ); 

        if( !exists ) { 
            return path.resolve(  __dirname, '../assets/', 'default_img.jpg');;
        }

        return pathPhoto;
    }
}