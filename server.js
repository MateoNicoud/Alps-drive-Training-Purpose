const express = require('express')

function start(){


    const app = express()
    const port = 3000

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