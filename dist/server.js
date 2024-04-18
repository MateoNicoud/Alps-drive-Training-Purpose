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
exports.uploadFile = exports.deleteFolder = exports.createFolder = exports.getFiles = exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const fs_2 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
const getFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.name) {
        const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL
        // Construit le chemin complet du répertoire
        const directoryPath = path_1.default.join(os_1.default.tmpdir(), fileName);
        try {
            const stats = yield fs_1.promises.stat(directoryPath); // Récupère les informations sur le fichier/dossier
            if (stats.isFile()) {
                const fileContent = fs_2.default.readFileSync(directoryPath);
                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=${fileName}`);
                res.status(200).send(fileContent);
            }
            else {
                // Récupère la liste des fichiers/dossiers dans le répertoire spécifié
                const files = yield fs_1.promises.readdir(directoryPath);
                // Formate les informations sur chaque fichier/dossier
                const formattedFiles = yield Promise.all(files.map(function (file) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const filePath = path_1.default.join(directoryPath, file);
                        const stats = yield fs_1.promises.stat(filePath);
                        return {
                            name: file,
                            isFolder: stats.isDirectory(),
                            size: stats.size
                        };
                    });
                }));
                // Renvoie la liste formatée des fichiers/dossiers en tant que réponse JSON
                res.json(formattedFiles);
            }
        }
        catch (error) {
            {
                // Gère les erreurs
                return res.status(404).send(`Cannot read folder: ${error}`);
            }
        }
    }
    else {
        const tempDir = os_1.default.tmpdir();
        try {
            const files = yield fs_1.promises.readdir(tempDir);
            const formattedFiles = yield Promise.all(files.map(function (file) {
                return __awaiter(this, void 0, void 0, function* () {
                    const filePath = path_1.default.join(tempDir, file);
                    const stats = yield fs_1.promises.stat(filePath);
                    if (stats.isFile()) {
                        return {
                            name: file,
                            isFolder: stats.isDirectory(),
                            size: stats.size
                        };
                    }
                    else {
                        return {
                            name: file,
                            isFolder: stats.isDirectory(),
                        };
                    }
                });
            }));
            return res.json(formattedFiles);
        }
        catch (error) {
            return res.status(404).send(`cannot read folder : ${error}`);
        }
    }
});
exports.getFiles = getFiles;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
const createFolder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.name) {
        const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL
        const folderName = req.query.name; // Récupère le nom du dossier depuis les paramètres de l'URL
        if (!(/^[a-zA-Z0-9]+$/.test(folderName))) {
            res.status(400).send(`  ${folderName} N'est pas alphanumeric`);
        }
        else if (!fileName) {
            res.status(404).send(`  ${fileName} N'existe pas`);
        }
        else {
            const tempDir = os_1.default.tmpdir();
            try {
                // Construit le chemin complet du nouveau dossier
                const folderPath = path_1.default.join(tempDir, fileName, folderName);
                // Crée le nouveau dossier
                yield fs_1.promises.mkdir(folderPath);
                res.status(201).send(`Folder ${folderName} created successfully.`);
            }
            catch (error) {
                // Gère les erreurs
                return res.status(500).send(`Error creating folder: ${error}`);
            }
        }
    }
    else {
        const folderName = req.query.name; // Récupère le nom du dossier depuis les paramètres de l'URL
        if (!(/^[a-zA-Z0-9]+$/.test(folderName))) {
            res.status(400).send(`  ${folderName} N'est pas alphanumeric`);
        }
        else {
            const tempDir = os_1.default.tmpdir();
            try {
                // Construit le chemin complet du nouveau dossier
                const folderPath = path_1.default.join(tempDir, folderName);
                // Crée le nouveau dossier
                yield fs_1.promises.mkdir(folderPath);
                res.status(201).send(`Folder ${folderName} created successfully.`);
            }
            catch (error) {
                // Gère les erreurs
                return res.status(500).send(`Error creating folder: ${error}`);
            }
        }
    }
});
exports.createFolder = createFolder;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
const deleteFolder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.folder) {
        const name = req.params.name;
        const filePath = path_1.default.join(os_1.default.tmpdir(), name);
        const stats = yield fs_1.promises.stat(filePath); // Récupère les informations sur le fichier/dossier
        try {
            if (stats.isFile()) {
                yield fs_1.promises.unlink(filePath); // Supprime le fichier
                console.log("Delete file successfuly");
                res.status(200).send("File deleted successfully.");
            }
            else if (stats.isDirectory()) {
                yield fs_1.promises.rmdir(filePath); // Supprime le fichier
                console.log("Delete directory successfuly");
                res.status(200).send("Directory deleted successfully.");
            }
        }
        catch (error) {
            console.log("Can't delete this file", error);
            res.status(400).send("Unable to delete file.");
        }
    }
    else {
        const name = req.params.name;
        const folder = req.params.folder;
        const filePath = path_1.default.join(os_1.default.tmpdir(), folder, name);
        const stats = yield fs_1.promises.stat(filePath); // Récupère les informations sur le fichier/dossier
        try {
            if (stats.isFile()) {
                yield fs_1.promises.unlink(filePath); // Supprime le fichier
                console.log("Delete file successfuly");
                res.status(200).send("File deleted successfully.");
            }
            else if (stats.isDirectory()) {
                yield fs_1.promises.rmdir(filePath); // Supprime le fichier
                console.log("Delete directory successfuly");
                res.status(200).send("Directory deleted successfully.");
            }
        }
        catch (error) {
            console.log("Can't delete this file", error);
            res.status(400).send("Unable to delete file.");
        }
    }
});
exports.deleteFolder = deleteFolder;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//
const uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.folder) {
        // Vérifier si un fichier est présent dans la requête
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }
        const tempDir = os_1.default.tmpdir();
        const file = req.files.file;
        if (Array.isArray(file)) {
            // `file` est un tableau d'objets `UploadedFile`
            for (const singleFile of file) {
                const fileName = singleFile.name;
                const filePath = path_1.default.join(tempDir, fileName);
                try {
                    yield singleFile.mv(filePath);
                    console.log("File created successfully");
                }
                catch (error) {
                    console.log("Can't create this file", error);
                    res.status(500).send("Unable to create file.");
                }
            }
        }
        else {
            // `file` est un objet `UploadedFile`
            const fileName = file.name;
            const filePath = path_1.default.join(tempDir, fileName);
            try {
                yield file.mv(filePath);
                console.log("File created successfully");
            }
            catch (error) {
                console.log("Can't create this file", error);
                res.status(500).send("Unable to create file.");
            }
        }
    }
    else {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }
        const folder = req.params.folder;
        const tempDir = os_1.default.tmpdir();
        const file = req.files.file;
        if (Array.isArray(file)) {
            // `file` est un tableau d'objets `UploadedFile`
            for (const singleFile of file) {
                const fileName = singleFile.name;
                const filePath = path_1.default.join(tempDir, folder, fileName);
                try {
                    yield singleFile.mv(filePath);
                    console.log("File created successfully");
                }
                catch (error) {
                    console.log("Can't create this file", error);
                    res.status(500).send("Unable to create file.");
                }
            }
        }
        else {
            // `file` est un objet `UploadedFile`
            const fileName = file.name;
            const filePath = path_1.default.join(tempDir, folder, fileName);
            try {
                yield file.mv(filePath);
                console.log("File created successfully");
            }
            catch (error) {
                console.log("Can't create this file", error);
                res.status(500).send("Unable to create file.");
            }
        }
    }
});
exports.uploadFile = uploadFile;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
function startServer() {
    app.listen(port);
    return app;
}
exports.startServer = startServer;
