const validate = (value) => {
    const error = {}

    // create a constraint for incorrect details using regex
    const email_login = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_login = /^[a-zA-Z0-9]{3,}$/

    if(value.email === "") {
        error.email = 'email is required'
    } else if(!email_login.test(value.email)) {
        error.email = 'incorrect email'
    } else {
        error.email = ''
    }
    if(value.password === ""){
        error.password = 'password is required'
    } else if(!password_login.test(value.password)) {
        error.password = 'incorrect password'
    } else {
        error.password = ""
    }
    
    return error;
}

export default validate;