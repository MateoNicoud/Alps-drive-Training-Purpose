const startServer = require('./server');

const app = startServer();

app.get('/api/drive', (req, res) => {
    console.log("got it");
    res.send('Hello World!')
})