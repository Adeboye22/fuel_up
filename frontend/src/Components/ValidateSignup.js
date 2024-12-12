const UserValidate = (value) => {
    const errors = {}
    
    // Use a regex constraint for the form patterns
    const firstName_pattern = /^[a-zA-Z]{2,}$/
    const lastName_pattern = /^[a-zA-Z]{2,}$/
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@!$%*?&]{8,}$/;

    if(value.firstName === ""){
        errors.firstName = "This field cannot be empty!"
    } else if(!firstName_pattern.test(value.firstName)){
        errors.firstName = "Input more than 2 characters with a capital letter";
    } else{
        errors.firstName = ""
    }
    if(value.lastName === ""){
        errors.lastName = "This field cannot be empty!"
    } else if(!lastName_pattern.test(value.lastName)){
        errors.lastName = "Input more than 2 characters with a capital letter"
    } else{
        errors.lastName = ""
    }
    if(value.email === ""){
        errors.email = "This field cannot be empty!"
    } else if(!email_pattern.test(value.email)){
        errors.email = "The mail you entered is incorrect!"
    } else{
        errors.email = ""
    }
    if(value.password === ""){
        errors.password = "This field cannot be empty!"
    } else if(!password_pattern.test(value.password)){
        errors.password = "Password must be more than eight characters, has an uppercase, lowercase and a special character."
    } else{
        errors.password = ""
    }

    return errors;
}

export default UserValidate;