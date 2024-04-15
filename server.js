import express from 'express';
import cors from 'cors';
import {promises as fs} from 'fs';
import os from 'os';
import fss from 'fs'
import path from 'path'
import busboy from 'busboy';
// const busboy = require('busboy');

const app = express()
const port = 3000
app.use(cors());
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/drive', async (req, res) => {
    // on récupère le chemin du fichier tmp en fonction de son os
    const tempDir = os.tmpdir();
    // On lit tous les fichiers et répertoires contenus dans le répertoire temporaire
    const files = await fs.readdir(tempDir)
    // On crée notre tableau d'objet, on attend que toutes les promesses soient exécuté avant de la commencer
    try {
        const formattedFiles = await Promise.all(files.map(async function (file) {
            // on récupère l'Uri des fichiers à l'intérieur de tmp
            const filePath = path.join(tempDir, file);
            // on récupère les status des fichiers, soit leur type et tout le reste
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {

                return {
                    name: file,
                    // si c'est un dossier alors ça sera vrai
                    isFolder: stats.isDirectory(),
                    size: stats.size
                };
            } else {
                return {
                    name: file,
                    // si c'est un dossier alors ça sera vrai
                    isFolder: stats.isDirectory(),
                };
            }

        }));
        //la réponse renvoie en json notre tableau d'objets
        return res.json(formattedFiles)
    } catch (error) {
        return res.status(404).send(`cannot read folder : ${error}`);
    }
})
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/api/drive', async (req, res) => {
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
app.get('/api/drive/:name', async (req, res) => {
    const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL

    // Construit le chemin complet du répertoire
    const directoryPath = path.join(os.tmpdir(), fileName);
    try {
        const stats = await fs.stat(directoryPath); // Récupère les informations sur le fichier/dossier

        if (stats.isFile()) {
            const fileContent = fss.readFileSync(directoryPath);
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename=${fileName}`);
            res.send(fileContent);

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

app.post('/api/drive/:name', async (req, res) => {
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
app.delete('/api/drive/:folder/:name', async (req, res) => {
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
app.delete('/api/drive/:name', async (req, res) => {
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


app.put('/api/drive', (req, res) => {
    const busboyInstance = new busboy({headers: req.headers});

    busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, filename);

        const writeStream = fss.createWriteStream(filePath);
        file.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log(`File ${filename} uploaded successfully.`);
            res.status(201).send("File uploaded successfully.");
        });
    });

    req.pipe(busboyInstance);
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
app.put('/api/drive/:folder', (req, res) => {
    const folder = req.params.folder;

    // Vérifie si le dossier existe
    const folderPath = path.join(os.tmpdir(), folder);
    fss.access(folderPath, fss.constants.F_OK, async (err) => {
        if (err) {
            // Le dossier n'existe pas, retourne une erreur 404
            return res.status(404).send(`Folder ${folder} does not exist.`);
        }

        const busboyInstance = new busboy({ headers: req.headers });

        let hasFile = false; // Variable pour vérifier si un fichier est présent dans la requête

        // Écoute l'événement 'file' de Busboy
        busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
            hasFile = true;

            const filePath = path.join(folderPath, filename);

            // Crée un flux d'écriture pour écrire le fichier sur le disque
            const writeStream = fss.createWriteStream(filePath);

            // Pipe le contenu du fichier vers le flux d'écriture
            file.pipe(writeStream);

            // Événement 'finish' une fois que l'écriture du fichier est terminée
            writeStream.on('finish', () => {
                console.log(`File ${filename} uploaded successfully.`);
            });
        });

        // Événement 'finish' une fois que tous les fichiers ont été traités
        busboyInstance.on('finish', () => {
            if (!hasFile) {
                // Aucun fichier n'a été trouvé dans la requête, retourne une erreur 400
                return res.status(400).send('No files were uploaded.');
            }

            // Tous les fichiers ont été téléchargés avec succès, renvoie une réponse 201
            res.status(201).send('File uploaded successfully.');
        });

        // Pipe la requête entrante vers l'instance de Busboy
        req.pipe(busboyInstance);
    });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
function startServer() {
    app.listen(port, () => {
        // api();
    })
    return app
}


export {startServer}