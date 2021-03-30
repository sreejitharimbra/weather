const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')



var ctx = document.getElementById('chart');



const weeks = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
var result = []
var labels = []
var heat = []
//after submting 
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                
                messageOne.textContent = data.location
                messageTwo.textContent = 'Its ' + data.forecast.body.current.weather_descriptions[0] + ' here, Temperature is ' + data.forecast.body.current.temperature + ' degree celcius, and feels like ' + data.forecast.body.current.feelslike + ' degree celcius \n' + ''
                
                for (var i=0; i<7; i++) {
                    var d = new Date()
                    d.setDate(d.getDate() - i)//to get the current date
                    
                    heat.push(parseInt(Math.floor((Math.random() * 10) + 1)) + 25)
                    labels.push(weeks[d.getDay()])
                    result.push(d.getDate())
                }

                result.reverse()
                labels.reverse()
                heat.reverse()
                heat[6] = data.forecast.body.current.temperature
                
                
                
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Temperature',
                            data: heat,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(260, 130, 39, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(182, 28, 01, 1)'
                            ],
                            borderWidth: .25,
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

            }
        }).catch((e) => {
            messageOne.textContent = 'something went wrong'
        })
    })
})