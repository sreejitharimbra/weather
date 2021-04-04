const historyTable = document.querySelector('#historytable')
const message = document.querySelector('#message')

var token = localStorage.getItem('token')

fetch('/historyfetch?token=' + token).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            console.log('error')
            message.textContent = data.error
        } else{
            function manipulateData(){
                let row = document.createElement('tr')
                
                let location = document.createElement('td')
                location.textContent = 'location'
                row.appendChild(location)
                
                let temperature = document.createElement('td')
                row.appendChild(temperature)
                temperature.textContent = 'temperature'

                let weather = document.createElement('td')
                weather.textContent = 'weather'
                row.appendChild(weather)

                let date = document.createElement('td')
                date.textContent = 'date'
                row.appendChild(date)

                historyTable.appendChild(row)

                for(let i = 0; i<data.data.length; i++) {
                    console.log(data.data[i])
                    
                    row = document.createElement('tr')


                    location = document.createElement('td')
                    location.textContent = data.data[i].location
                    row.appendChild(location)


                    temperature = document.createElement('td')
                    temperature.textContent = data.data[i].temperature
                    row.appendChild(temperature)

                    weather = document.createElement('td')
                    weather.textContent = data.data[i].weather_result
                    row.appendChild(weather)

                    date = document.createElement('td')
                    let datevar = data.data[i].date.slice(0, 18).replace('T', " ")

                    date.textContent = datevar
                    row.appendChild(date)


                    historyTable.appendChild(row)
                }
            }
            manipulateData()
        }
    })
})