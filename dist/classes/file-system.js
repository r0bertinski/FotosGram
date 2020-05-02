"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    // Returns a promisse
    saveTemporalImage(file, userId) {
        console.log('userId', userId);
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.createUserFolder(userId);
            // File Name
            const fileName = this.generateUniqName(file.name);
            // Move file from temp to the final folder
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    // cannot move file.
                    // console.log('cannot move file');
                    // console.log(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generateUniqName(originalName) {
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];
        // console.log('extension', extension);
        const uniqId = uniqid_1.default();
        return `${uniqId}.${extension}`;
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = `${pathUser}/temp`;
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagesFromTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const tempImages = this.getTempImages(userId);
        // console.log('tempImages', tempImages);
        // Change images name, then it will change the path
        tempImages.forEach(img => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
        });
        return tempImages;
    }
    getTempImages(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getPhotoUrl(userId, img) {
        // Point to img
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', img);
        // Check if image already exists
        const exists = fs_1.default.existsSync(pathPhoto);
        if (!exists) {
            return path_1.default.resolve(__dirname, '../assets/', 'default_img.jpg');
            ;
        }
        return pathPhoto;
    }
}
exports.default = FileSystem;
