import "./SignupForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignupForm() {
    // establish state variables and setters for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    //const [card, setCard] = useState(null);

    //const [address, setAddress] = useState(null);
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    // establish router
    const navigate = useNavigate();

    // is phone number of the form ###-###-####?
    const isValidPhoneNumber = (phoneNumber.length === 12  // proper length 
        && !isNaN(phoneNumber.slice(0,3))                  // first three digits is a number
        && phoneNumber[3] === "-"                          // 4th char is a hyphen
        && !isNaN(phoneNumber.slice(4,7))                  // second three digits is a number
        && phoneNumber[7] === "-"                          // 8th char is a hyphen
        && !isNaN(phoneNumber.slice(8,12)))                 // last four digits is a number

    // what is the state of address field?
    const isCompleteAddress = (streetAddress !== "" && city !== ""
        && state !== "" && zipCode !== "")
    const isEmptyAddress = (streetAddress === "" && city === ""
        && state === "" && zipCode === "")
    
    // handler for form submit button
    const onSubmit = async (event) => {
      event.preventDefault();

      // ensure all required fields are complete
      if (firstName === '' || lastName === '' || email === ''
            || password === '' || confirmPassword === '' || phoneNumber === ''
      ) {
            alert("Please complete all required fields");
            return;
      }

      // ensure passwords match
      else if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
      }

      // validate phone number is of form ###-###-####
      else if (!isValidPhoneNumber) {
            alert("Invalid phone number format");
            return;
      }

      // address is partially complete
      else if (!isEmptyAddress && !isCompleteAddress) {
            alert("Please fully complete the address field, or leave blank");
            return;
      }

    
      let newAddress = {
          street: streetAddress,
          city: city,
          state: state,
          zip_code: zipCode
      }

      // create user object
      let newUser = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          phone_number: phoneNumber,
          address: null
      }
      
      try {
          let response;
          let address_id = null;
          
          // if address input, create in database
          if (isCompleteAddress) {
              response = await fetch("http://localhost:5000/createAddress", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newAddress),
              })
              .then((res) => res.json()) // Parse JSON response
              .then((data) => {
                address_id = data.address_id;
                console.log('address_id ' + '(' + typeof(address_id) + ') ' + address_id);
              })
              .catch((error) => console.error("Error creating address:", error));   
          } // if

          // create user in database
          newUser.address = address_id;
          response = await fetch("http://localhost:5000/createUser", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(newUser),
          });

          // error handling
          if (response.status === 409) {
              alert("User already exists");
              return;
          } else if (response.status !== 201)
              throw new Error("Network response was not ok");

          // reset fields
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setPhoneNumber('');

          setStreetAddress('');
          setCity('');
          setState('');
          setZipCode('');
          
          // send confirmation email and redirect user
          /* 
           * Send confirmation email
           */
          navigate("/confirmation");
      } catch (error) {
          alert("Error in Signup!");
          console.error(error);
      } // try- catch
    } // onSubmit

    return (
      <div className="SignupForm">
        <div className="SignupFormTitle">Signup</div>

        <Link to={'/login'} className="SignupFormLoginLinkContainer">
          <button className="SignupFormLoginLink">Already have an account? Login here</button>
        </Link>  

        <form className="SignupFormForm">
            <div className="SignupFormSection">
                <div>First Name:<span>*</span></div>
                <input name="firstName"
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required></input>
            </div>

            <div className="SignupFormSection">
                <div>Last Name:<span>*</span></div>
                <input name="lastName"
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required></input>
            </div>

            <div className="SignupFormSection">
                <div>Email:<span>*</span></div>
                <input name="email"
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required></input>
            </div>

            <div className="SignupFormSection">
                <div>Password:<span>*</span></div>
                <input name="password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required></input>
            </div> 

            <div className="SignupFormSection">
                <div>Confirm Password:<span>*</span></div>
                <input name="confirmPassword"
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required></input>
            </div> 
              
            <div className="SignupFormSection">
                <div>Phone Number:<span>*</span></div>
                <small>Format: 123-456-7890</small>
                <input name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required></input>
            </div>

            <div className="SignupFormSubtitle">
              Payment Information (optional):
            </div>
                
            <div className="SignupFormSection">Card Type:
                <select name="cardtype">
                    <option value="none"></option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>
              </div>

              <div className="SignupFormSection"> 
                  Name (as appears on card):
                  <input type="text"></input>
              </div>  

              <div className="SignupFormSection">
                  Card Number:
                  <input type="number"></input>
              </div>

              <div className="SignupFormSection">
                  Expiration Date:
                  <input type="date"></input>
              </div>
              
              <div className="SignupFormSection">
                  CVC:
                  <input type="number"></input>
              </div>

              <div className="SignupFormSubtitle">
                  Home Address (optional):
              </div>

              <div className="SignupFormSection">
                  Street Address:
                  <input name="streetAddress"
                    type="text" 
                    value={streetAddress} 
                    onChange={(e) => setStreetAddress(e.target.value)}></input>
              </div>

              <div className="SignupFormSection">
                  City:
                  <input name="city"
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}></input>
              </div>

              <div className="SignupFormSection">
                  State:
                  <input name="state"
                    type="text" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}></input>
              </div>

              <div className="SignupFormSection">
                  Zip Code:
                  <input name="zipCode"
                    type="text" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}></input>
              </div>

              <input type="submit" value="Signup" onClick={onSubmit} 
                className="SignupFormSubmit"></input>  
          </form>
      </div>
    );
}
  
export default SignupForm;