const path = require('path')
const express = require('express')
const hbs = require('hbs')
const axios = require('axios')


const app = express()
const port = process.env.PORT || 3000


const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//to set hbs as view engine(set ups handle bar engine and views location)
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
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