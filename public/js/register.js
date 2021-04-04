// const loginClick = document.querySelector('#loginbtn')
const registerClick = document.querySelector('#registerform')
const errorMessage = document.querySelector('#message')

registerClick.addEventListener('submit', (e) => {
    e.preventDefault()
    var email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmpassword = document.getElementById('confirmpassword').value
    if(password === confirmpassword) {
        fetch('/registeruser?email=' + email + '&password=' + password).then((response) => {
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
    } else {
        errorMessage.textContent = "password missmatch"
    }
})

