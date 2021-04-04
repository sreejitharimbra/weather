const path = require('path')
const express = require('express')
const ejs = require('ejs')
const axios = require('axios')
var mysql = require('mysql');
var validator = require("email-validator");
var jwt = require('jsonwebtoken');


const app = express()
const port = process.env.PORT || 3000


const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//to set hbs as view engine(set ups handle bar engine and views location)
app.set('view engine', 'ejs')
app.set('views', viewsPath)


app.use(express.static(publicDirectoryPath))

//   connection.query('SELECT * FROM weather_history', (error, results, fields) => {
//     if (error) throw error;
//     console.log('The solution is: ', results);
//   })


app.get('', (req, res) => {
    res.render('login', {
        title: 'Login',
        name: 'Sreejith arimbra'
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        name: 'Sreejith arimbra'
    })
})

app.get('/registeruser', (req, res) => {
    if(validator.validate(req.query.email)) {
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '9061199170',
            database : 'weather'
          });
           
          connection.connect();
          var tokenjwt = jwt.sign({ email: req.query.email }, 'weather');
            connection.query("INSERT INTO weather.user_registration (password, email, token) VALUES ('" + req.query.password +"','" + req.query.email +"','" + tokenjwt + "');", (error, results, fields) => {
                connection.end();
                if (error) {
                    if(!error.errno || ( error.errno && error.errno !== 1062)) {
                        console.log(error)
                        return res.send({error: "something went wrong"})
                    } if(error.errno === 1062) {
                        return res.send({error: 'user already exists'})
                    }
                } else {
                    return res.send({status: 'success', token: tokenjwt, email: req.query.email})
                }
            })
        } else{
            return res.send({error: "check your email"})
        }
})

app.get('/loginuser', (req, res) => {
    if(validator.validate(req.query.email)) {
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '9061199170',
            database : 'weather'
          });
           
          connection.connect();
            connection.query("SELECT * FROM weather.user_registration WHERE email = '" + req.query.email + "';", (error, results, fields) => {
                connection.end()
                if(results && results.length !== 0) {
                    if(results[0].email === req.query.email && results[0].password === req.query.password) {
                        return res.send({status: "success", token: results[0].token, email: results[0].email})
                    } else {
                        return res.send({error: "check your password"})
                    }
                } else {
                    return res.send({error: "user doesn't exists"})
                }
        })
    } else{
        return res.send({error: "check your email"})
    }
})

app.get('/historyfetch', (req, res) => {
    jwt.verify(req.query.token, 'weather', (err, decoded) => {
        if (err) {
            res.send({error: 'something went wrong'})
        } else {
            console.log(decoded)
            var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : '9061199170',
                database : 'weather'
              });
               
              connection.connect();
              connection.query('SELECT * FROM weather.weather_history WHERE email="'+ decoded.email +'";', (error, results, fields) => {
                  connection.end()
                  if (error) {
                      res.send({error: 'something went wrong'})
                  } else {
                      res.send({data: results})
                      res.render('history', {
                        title: 'History',
                        name: 'Sreejith arimbra'
                      })
                  }
              })
        }
    })
})

app.get('/home', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sreejith arimbra'
    })
})

app.get('/history', (req, res) => {
    res.render('history', {
        title: 'History',
        name: 'Sreejith arimbra'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Sreejith arimbra'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'here to help you',
        title: 'Help',
        name: 'Sreejith arimbra'
    })
})

app.get("/weather", (req,res)=>{
            if(!req.query.address){
                return res.send({error:"you must provide an address"})
            }
            //to get cordinates of the location
            axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(req.query.address) + '.json?access_token=pk.eyJ1Ijoic3JlZWppdGhhcmltYnJhIiwiYSI6ImNrbWhicGIxZjA1cTcyb256aTEzYndpdTUifQ.U1L-UqVHUq0qyeNpVq3YEg').then((response)=>{
                if (!response.data.features || !response.data.features[0]) {
                    return res.send({
                        error: 'enter a valid location'
                    })
                }
                //to know the weather
                axios.get('http://api.weatherstack.com/current?access_key=f3879c5cd1d7a7702927846d04c1c797&query=' + response.data.features[0].center[1] + ',' + response.data.features[0].center[0] + '&units=m').then((weatherData)=>{
                    var connection = mysql.createConnection({
                        host     : 'localhost',
                        user     : 'root',
                        password : '9061199170',
                        database : 'weather'
                      });
                       
                      connection.connect();
                    let date_ob = new Date();
                    let datetime = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)) + "-" + ("0" + date_ob.getDate()) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds()
                      connection.query("INSERT INTO weather.weather_history (location, temperature, weather_result, date, email) VALUES ('" + weatherData.data.location.name + "','" + weatherData.data.current.temperature + "','" + weatherData.data.current.weather_descriptions[0] + "','" + datetime + "','" + req.query.email + "');", (error, results, fields) => {
                        connection.end();
                      })
                      

                    res.send({
                        address: weatherData.data.location.name,
                        forecast: {
                            body: {
                                current: weatherData.data.current,
                                location: weatherData.data.location,
                                request: weatherData.data.request
                            }
                        },
                        location: weatherData.data.location.name + " " +weatherData.data.location.region + " " + weatherData.data.location.country
                    })
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((er)=>{
                console.log(er)
            })
     
})



app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sreejith arimbra',
        errorMessage: 'Healp article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sreejith arimbra',
        errorMessage: 'Page not found.'
    })
})

//to listen to port
app.listen(port, () => {
    console.log('Server is up in port ' + port)
})