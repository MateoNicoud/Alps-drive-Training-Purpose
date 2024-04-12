import express from 'express';
import cors from 'cors';
import {promises as fs} from 'fs';
import os from 'os';
import path from 'path'

const app = express()
const port = 3000
app.use(cors());

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
            if(stats.isFile()){

                return {
                    name: file,
                    // si c'est un dossier alors ça sera vrai
                    isFolder: stats.isDirectory(),
                    size: stats.size
                };
            } else{
                return {
                    name: file,
                    // si c'est un dossier alors ça sera vrai
                    isFolder: stats.isDirectory(),
                };
            }
        }));
        //la réponse renvoie en json notre tableau d'objets
        res.json(formattedFiles)
    } catch (error){
        return res.status(404).send(`cannot read folder : ${error}`);
    }
})

app.get('/api/drive/:name', async (req, res) => {
    const fileName = req.params.name; // Récupère le nom du fichier/dossier depuis les paramètres de l'URL

    // Construit le chemin complet du répertoire
    const directoryPath = path.join(os.tmpdir(), fileName);

    try {
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
    } catch (error){
        // Gère les erreurs
        return res.status(404).send(`Cannot read folder: ${error}`);
    }
});



function startServer(){
    app.listen(port, () => {
    // api();
    })
    return app
}


export {startServer}