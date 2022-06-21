const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app =express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//MySQL
const pool = mysql.createPool({
    connectionLimit: 50,
    host           : 'localhost',
    user           : 'root',
    password       : '',
    database       : 'nodejs_mysql_crud'
})

//Get all beers
app.get('/beers', (req, res) => {

    pool.getConnection((err, connection) => {

        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from beers', (err, rows) => {

            connection.release()// return the connection pool

            if(!err){
                res.send(rows)
            } else {
                console.log(err)
            }

        })

    })

})


//Get beer by id
app.get('/beers/:id', (req, res) => {

    pool.getConnection((err, connection) => {

        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from beers WHERE id =?', [req.params.id], (err, rows) => {

            connection.release()// return the connection pool

            if(!err){
                res.send(rows)
            } else {
                console.log(err)
            }

        })

    })

})


//Delete beer by id
app.delete('/beers/:id', (req, res) => {

    pool.getConnection((err, connection) => {

        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from beers WHERE id =?', [req.params.id], (err, rows) => {

            connection.release()// return the connection pool

            if(!err){
                res.send(`Beer with ID: ${[req.params.id]} has been deleted`)
            } else {
                console.log(err)
            }

        })

    })

})


//Add new beer to database
app.post('/beers/new', (req, res) => {

    pool.getConnection((err, connection) => {

        if(err) throw err

        console.log(`connected as id ${connection.threadId}`)

        const rec = req.body

        connection.query('INSERT INTO beers SET ?', rec, (err, rows) => {

            connection.release()// return the connection pool

            if(!err){
                res.send(`Beer with Name: ${[rec.name]} has been created`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })

})

//Update beer details in database
app.put('/beers/update', (req, res) => {

    pool.getConnection((err, connection) => {

        if(err) throw err

        console.log(`connected as id ${connection.threadId}`)


        const {id, name, tagline, description, image} = req.body

        connection.query('UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id  ], (err, rows) => {

            connection.release()// return the connection pool

            if(!err){
                res.send(`Beer ${name} has been updated`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })

})


//Listen on environment port or 5000
app.listen(port, () => console.log(`server running on port ${port}`))
