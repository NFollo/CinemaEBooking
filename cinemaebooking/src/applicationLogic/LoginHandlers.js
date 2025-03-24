
/**
 * Returns true if input user password matches password stored in databse.
 * Returns false otherwise.
 */
export async function checkPasswordMatch(email, password) {
    const cipherPassword = await getStoredPassword(email);
    console.log("first call: " + cipherPassword)
    if (cipherPassword === -1) {
        return -1;
    }

    const match = await checkEncryptedMatch(password, cipherPassword);
    console.log("second call: " + match)
    return match;
} // getStoredPassword

/**
 * Returns encrypted password stored in database, or -1 upon error.
 */ 
async function getStoredPassword(email) {
    let cipherPassword;
    await fetch("http://localhost:5000/getPassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email}),
    })
    .then((res) => res.json())                                    // parse JSON response
    .then((data) => {cipherPassword = data.encrypted_password;
        if (cipherPassword === undefined) {
            alert("User not found. Are you sure you have an account?")
            cipherPassword = -1;
        }
    })  // assign return value
    .catch((error) => {
        console.error("Error retrieving password: ", error);
        alert("Error validating password");
        cipherPassword = -1;
    });

    return cipherPassword;
} // getStoredPassword

/**
 * Returns true if plaintext matches ciphertext.
 * Returns false upon mismatch.
 * Returns -1 upon error.
 */
async function checkEncryptedMatch(plaintext, ciphertext) {
    let result;
    await fetch("http://localhost:5000/compareEncrypted", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({plaintext: plaintext, ciphertext: ciphertext}),
    })
    .then((res) => res.json())                       // parse JSON response
    .then((data) => {result = data.result})  // assign return value
    .catch((error) => {
        console.error("Error validating password match: ", error);
        alert("Error validating password");
        result = -1;
    });

    return result;
}

/**
 * Returns privilege of user.
 */
export async function getUserPrivilege(email) {
    let privilege;
    await fetch("http://localhost:5000/getPrivilege", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email}),
    })
    .then((res) => res.json())                       // parse JSON response
    .then((data) => {privilege = data.privilege})  // assign return value
    .catch((error) => {
        console.error("Error retrieving user privilege: ", error);
        alert("Error validating password");
        return -1;
    });
    return privilege;
}