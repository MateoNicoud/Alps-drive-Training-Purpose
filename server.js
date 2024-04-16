import express from 'express';
import cors from 'cors';
import {promises as fs} from 'fs';
import os from 'os';
import fss from 'fs'
import path from 'path'

import fileUpload from 'express-fileupload'

const app = express()
const port = 3000
app.use(cors());
app.use(fileUpload());
// const driveRouter = express.Router();
// let itemRouter = express.Router({mergeParams:true});
// driveRouter.use('/api/drive', itemRouteur);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/drive/', async (req, res) => {
    const tempDir = os.tmpdir();
    try {
        const files = await fs.readdir(tempDir)
        const formattedFiles = await Promise.all(files.map(async function (file) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
                return {
                    name: file,
                    isFolder: stats.isDirectory(),
                    size: stats.size
                };
            } else {
                return {
                    name: file,
                    isFolder: stats.isDirectory(),
                };
            }
        }));
        return res.json(formattedFiles)
    } catch (error) {
        return res.status(404).send(`cannot read folder : ${error}`);
    }
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/api/drive/', async (req, res) => {
    const folderName = req.query.name; // Récupère le nom du dossier depuis les paramètres de l'URL

    if (!(/^[a-zA-Z0-9]+$/.test(folderName))) {
        res.status(400).send(`  ${folderName} N'est pas alphanumeric`)
    } else {


        const tempDir = os.tmpdir();

        try {
            // Construit le chemin complet du nouveau dossier
            const folderPath = path.join(tempDir, folderName);

            // Crée le nouveau dossier
            await fs.mkdir(folderPath);

            res.status(201).send(`Folder ${folderName} created successfully.`);
        } catch (error) {
            // Gère les erreurs
            return res.status(500).send(`Error creating folder: ${error}`);
        }
    }
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/drive/:name(*)', async (req, res) => {
    const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL

    // Construit le chemin complet du répertoire
    const directoryPath = path.join(os.tmpdir(), fileName);
    try {
        const stats = await fs.stat(directoryPath); // Récupère les informations sur le fichier/dossier

        if (stats.isFile()) {
            const fileContent = fss.readFileSync(directoryPath);
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename=${fileName}`);
            res.status(200).send(fileContent);

        } else {


            // Récupère la liste des fichiers/dossiers dans le répertoire spécifié
            const files = await fs.readdir(directoryPath);

            // Formate les informations sur chaque fichier/dossier
            const formattedFiles = await Promise.all(files.map(async function (file) {
                const filePath = path.join(directoryPath, file);
                const stats = await fs.stat(filePath);
                return {
                    name: file,
                    isFolder: stats.isDirectory(),
                    size: stats.size
                };
            }));

            // Renvoie la liste formatée des fichiers/dossiers en tant que réponse JSON
            res.json(formattedFiles);
        }
    } catch {
        (error)
        {
            // Gère les erreurs
            return res.status(404).send(`Cannot read folder: ${error}`);
        }
    }
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/api/drive/:name(*)', async (req, res) => {
    const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL

    const folderName = req.query.name; // Récupère le nom du dossier depuis les paramètres de l'URL

    if (!(/^[a-zA-Z0-9]+$/.test(folderName))) {
        res.status(400).send(`  ${folderName} N'est pas alphanumeric`)
    } else if (!fileName) {
        res.status(404).send(`  ${fileName} N'existe pas`)
    } else {


        const tempDir = os.tmpdir();

        try {
            // Construit le chemin complet du nouveau dossier
            const folderPath = path.join(tempDir, fileName, folderName);

            // Crée le nouveau dossier
            await fs.mkdir(folderPath);

            res.status(201).send(`Folder ${folderName} created successfully.`);
        } catch (error) {
            // Gère les erreurs
            return res.status(500).send(`Error creating folder: ${error}`);
        }
    }
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete('/api/drive/:folder/:name(*)', async (req, res) => {
    const name = req.params.name;
    const folder = req.params.folder;
    const filePath = path.join(os.tmpdir(), folder, name);
    const stats = await fs.stat(filePath); // Récupère les informations sur le fichier/dossier

    try {
        if (stats.isFile()) {
            await fs.unlink(filePath); // Supprime le fichier

            console.log("Delete file successfuly");
            res.status(200).send("File deleted successfully.")
        } else if (stats.isDirectory()) {
            await fs.rmdir(filePath); // Supprime le fichier

            console.log("Delete directory successfuly");
            res.status(200).send("Directory deleted successfully.")
        }
    } catch (error) {
        console.log("Can't delete this file", error);
        res.status(400).send("Unable to delete file.");
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete('/api/drive/:name(*)', async (req, res) => {
    const name = req.params.name;
    const filePath = path.join(os.tmpdir(), name);
    const stats = await fs.stat(filePath); // Récupère les informations sur le fichier/dossier

    try {
        if (stats.isFile()) {
            await fs.unlink(filePath); // Supprime le fichier

            console.log("Delete file successfuly");
            res.status(200).send("File deleted successfully.")
        } else if (stats.isDirectory()) {
            await fs.rmdir(filePath); // Supprime le fichier

            console.log("Delete directory successfuly");
            res.status(200).send("Directory deleted successfully.")
        }
    } catch (error) {
        console.log("Can't delete this file", error);
        res.status(400).send("Unable to delete file.");
    }
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------


app.put('/api/drive', async (req, res) => {
    // Vérifier si un fichier est présent dans la requête
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const tempDir = os.tmpdir();
    const file = req.files.file;
    const fileName = file.name;
    const filePath = path.join(tempDir, fileName);

    try {
        // Écrire le contenu du fichier dans le fichier système
        await file.mv(filePath);

        console.log("File created successfully");
        res.status(201).send("File created successfully.");
    } catch (error) {
        console.log("Can't create this file", error);
        res.status(500).send("Unable to create file.");
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/api/drive/:folder(*)', async (req, res) => {
    // Vérifier si un fichier est présent dans la requête
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const folder = req.params.folder;

    const tempDir = os.tmpdir();
    const file = req.files.file;
    const fileName = file.name;
    const filePath = path.join(tempDir,folder, fileName);

    try {
        await file.mv(filePath);

        console.log("File created successfully");
        res.status(201).send("File created successfully.");
    } catch (error) {
        console.log("Can't create this file", error);
        res.status(500).send("Unable to create file.");
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
function startServer() {
    app.listen(port);
    return app
}


export {startServer}