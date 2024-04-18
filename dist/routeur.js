"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use((0, express_fileupload_1.default)());
const port = 3000;
const server_1 = require("./server");
const router = express_1.default.Router();
exports.router = router;
app.use((0, cors_1.default)());
router.get('/api/drive/:name(*)?', server_1.getFiles);
router.post('/api/drive/:name(*)?', server_1.createFolder);
router.delete('/api/drive/:folder?/:name(*)', server_1.deleteFolder);
router.put('/api/drive/:folder(*)?', server_1.uploadFile);
app.use(router);
function startServer() {
    app.listen(port);
    return app;
}
exports.startServer = startServer;
