const express = require('express');
const cors = require('cors');

function start(){


    const app = express()
    const port = 3000
    app.use(cors());

    app.get('/', (req, res) => {
        console.log("got it");
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

    return app
}


module.exports = start;