const UserValidate = (value) => {
    const errors = {}
    
    // Use a regex constraint for the form patterns
    const firstName_pattern = /^[a-zA-Z]{2,}$/
    const lastName_pattern = /^[a-zA-Z]{2,}$/
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^[a-zA-Z0-9]{3,}$/

    if(value.firstname === ""){
        errors.firstname = "This field cannot be empty!"
    } else if(!firstName_pattern.test(value.firstname)){
        errors.firstname = "Input more than 2 characters with a capital letter";
    } else{
        errors.firstname = ""
    }
    if(value.lastname === ""){
        errors.lastname = "This field cannot be empty!"
    } else if(!lastName_pattern.test(value.lastname)){
        errors.lastname = "Input more than 2 characters with a capital letter"
    } else{
        errors.lastname = ""
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
        errors.password = "Password must be more than three characters!"
    } else{
        errors.password = ""
    }

    return errors;
}

export default UserValidate;