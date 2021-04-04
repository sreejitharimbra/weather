// const loginClick = document.querySelector('#loginbtn')
const loginClick = document.querySelector('#loginform')
const errorMessage = document.querySelector('#message')

if(localStorage.getItem('token')){
    window.location.replace('/home')
}

loginClick.addEventListener('submit', (e) => {
    e.preventDefault()
    var email = document.getElementById('email').value
    const password = document.getElementById('password').value
    fetch('/loginuser?email=' + email + '&password=' + password).then((response) => {
        response.json().then((data) => {
            if(data.error) {
               errorMessage.textContent = data.error 
            } else if(data.status === 'success'){
                localStorage.setItem('token', data.token)
                localStorage.setItem('email', data.email)
                window.location.replace('/home');
            }
        })
    })
})

