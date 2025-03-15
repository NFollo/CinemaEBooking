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
    //const [address, setAddress] = useState(null);
    //const [card, setCard] = useState(null);

    // establish router
    const navigate = useNavigate();

    // handler for form submit button
    const onSubmit = async (event) => {
      event.preventDefault();

      // ensure all required fields are complete
      if (firstName === '' || lastName === '' || email === ''
            || password === '' || confirmPassword === '' || phoneNumber === ''
      ) alert('Please complete all required fields');

      // ensure passwords match
      else if (password !== confirmPassword)
          alert('Passwords do not match')

      /*
       * Validate phone-number
       */

      // create user object
      const newUser = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          phone_number: phoneNumber
      }

      try {
          // add user to database
          const response = await fetch("http://localhost:5000/signUp", {
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
          
          // send confirmation email and redirect user
          /* 
           * Send confirmation email
           */
          navigate("/confirmation");
      } catch (error) {
          alert("Error in Signup!");
      }
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

              <div className="SignupFormSection">
                  Country:
                  <input type="text"></input>
              </div>

              <div className="SignupFormSection">
                  State:
                  <input type="text"></input>
              </div>

              <div className="SignupFormSection">
                  City:
                  <input type="text"></input>
              </div>

              <div className="SignupFormSection">
                  Address:
                <input type="text"></input>
              </div>

              <div className="SignupFormSection">
                  Zip Code:
                  <input type="number"></input>
              </div>

              <input type="submit" value="Signup" onClick={onSubmit} 
                className="SignupFormSubmit"></input>  
          </form>
      </div>
    );
}
  
export default SignupForm;