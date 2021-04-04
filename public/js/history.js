const historyTable = document.querySelector('#historytable')
const message = document.querySelector('#message')

var token = localStorage.getItem('token')

fetch('/historyfetch?token=' + token).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            message.textContent = data.error
        } else{
            console.log(data.data)
        }
    })
})