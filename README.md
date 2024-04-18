**Project Name: Alps drive (Training Purpose)**

---

### Description:
This project is an API for a fictitious storage service (drive), created for training purposes. It enables the management of folder creation, file download, file deletion, and retrieval of the file list within a specified folder. The core files are in the `src` folder.

---

### Installation:
1. Ensure Node.js is installed on your system.
2. Clone this repository to your machine.
3. Run `npm install` to install the necessary dependencies.

---

### Usage:
- Run `npm run dev` to start the server.
- The API will be accessible at `http://localhost:3000`.
- This API is intended to be used with a front-end server.
- You can use the following endpoints:

    - `GET /api/drive/:name(*)?`: Retrieves the list of files within a specified folder. If no folder name is provided, the list of files at the root of the drive is returned.
    - `POST /api/drive/:name(*)?`: Creates a new folder. You can specify the folder name to create in the URL parameters.
    - `DELETE /api/drive/:folder?/:name(*)`: Deletes a file or folder. You must provide the name of the file or folder to delete in the URL parameters.
    - `PUT /api/drive/:folder(*)?`: Uploads a file to a specified folder. You must provide the folder name where you want to upload the file in the URL parameters.

---

### Usage Examples:

#### Retrieve the list of files within a folder:
```
GET /api/drive/:name(*)?
```

#### Create a new folder:
```
POST /api/drive/:name(*)?name=NewFolderName
```

#### Delete a file or folder:
```
DELETE /api/drive/:folder?/:name(*)
```

#### Upload a file to a specified folder:
```
PUT /api/drive/:folder(*)?
```

---

### Developer:
This project was developed by Matéo NICOUD using TypeScript and JavaScript for training purposes. It does not have a target audience and is solely intended for practice.

---

### Libraries Used:
- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **Cors:** Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
- **Express-fileupload:** Simple Express middleware for uploading files.
- **fs:** The built-in Node.js file system module.
- **os:** The built-in Node.js operating system module.
- **path:** The built-in Node.js path module.

---

### License:
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
