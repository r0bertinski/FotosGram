"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
// import { User } from '../models/user.model';
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Get posts paginated
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    // Get the user data
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        ok: true,
        posts: posts,
        page: page
    });
}));
// Create a post.
postRoutes.post('/', [auth_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    // Get images already uploaded in a previous step to the temp user folder.
    const images = fileSystem.imagesFromTempToPost(req.user._id);
    body.imgs = images;
    // Record post in the Db
    post_model_1.Post.create(body).then((postDb) => __awaiter(void 0, void 0, void 0, function* () {
        // Get the user data
        yield postDb.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            data: postDb
        });
    })).catch(err => {
        res.json(err);
    });
});
// Upload imagest a temp folder named as the userid
postRoutes.post('/upload', [auth_1.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Return an error message if any file is uploaded.
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'None file was uploaded'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: 'Any image was uploaded'
        });
    }
    // Check the file mimetype, if is not an image it returns an error.
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            message: 'Any image was uploaded, or mimetype is wrong'
        });
    }
    // Sae the image(s) in a temporal folder named as the userId name.
    yield fileSystem.saveTemporalImage(file, req.user._id)
        .then(console.log)
        .catch(console.error);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
// Get user image, the path is the userId and the imgName stored in the psot db table. 
postRoutes.get('/image/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathPhoto = fileSystem.getPhotoUrl(userId, img);
    res.sendFile(pathPhoto);
});
exports.default = postRoutes;
