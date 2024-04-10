const start = require('express')
const app = start()
const port = 3000

app.get('/', (req, res) => {
    console.log("got it");
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

