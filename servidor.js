const express = require('express')
const app = express()
const users = require('./data/agentes.js')

const jwt = require('jsonwebtoken')
const secretKey = 'Mi contraseña secreta'

app.use(express.static('public'))

app.get('/SignIn', (req, res) => {
    const { email, password } = req.query
    const user = users.find((u) => u.email == email && u.password == password)
    
    if(user) {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 120,
                data: user,
            },
            secretKey,
        )
        res.send(`
        <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>

        Bienvenido, ${email}

        <script>
        localStorage.setItem('token', JSON.stringify("${token}"))
        </script>
        `)
    } else {
        res.send('Usuario o contraseña incorrecta')
    }
    
})

app.get('/Dashboard', (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, decoded) => {
        err
            ? res.status(401).send({
                err: "401 Unauthorized",
                message: err.message,
            })
            : res.send(
                `Bienvenido al Dashboard ${decoded.data.email}`
            )
    })
})

app.listen(3000, () => {
    console.log('Server ON')
})