import express, {Application} from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload'
const app : Application = express();
app.use(fileUpload());
const port : number = 3000;
import {
    getFiles,
    createFolder,
    deleteFolder,
    uploadFile

} from './server';
const router = express.Router();
app.use(cors());
router.get('/api/drive/:name(*)?', getFiles);
router.post('/api/drive/:name(*)?', createFolder);
router.delete('/api/drive/:folder?/:name(*)', deleteFolder);
router.put('/api/drive/:folder(*)?', uploadFile);
app.use(router);

function startServer() : Application {
    app.listen(port);
    return app
}




export {router,startServer};