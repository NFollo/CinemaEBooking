import "./LoginForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { checkPasswordMatch, getUserPrivilege } from "../applicationLogic/LoginHandlers"
import Cookies from "js-cookie";

function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // handler for login button
    const onSubmit = async (event) => {
      event.preventDefault();

      // validate email and password
      if (email === "" || password === "") {
        alert("Please enter a valid email and password");
        return; 
      }
       
      const passwordsMatch = await checkPasswordMatch(email, password);
      console.log("main form: " + passwordsMatch)

      // error handling
      if (passwordsMatch === -1) {
        return;
      }

      // passwords match
      else if (passwordsMatch) {
        // change cookie value
        const privilege = await getUserPrivilege(email);
        Cookies.set("authorization", privilege, { expires: 1, path: "/" });
        props.setAuthorization(privilege);
        Cookies.set("email", email, { expires: 1, path: "/" });
        navigate("/");
      }

      // passwords do not match
      else {
        alert("Invalid password. Try again");
      }
    }

  // TODO: Get login to work, check if verified and not inactive, email and password is correct, otherwise, give alert
    /*
    const loginUser = async (e) => {
      e.preventDefault();
      try {
        
        //await axios.get('http://localhost:5000/user', { email, password });
        //setHasSent(1); // Move to the "Enter Code" step

      } catch (error) {
        if (error.response.status === 404)  // user not found in db
          alert("No user found")
        else {
          console.error("Error sending verification code:", error);
          alert("An error occurred. Please try again.");
        }
      }
    }
    */
    return (
      <div className="LoginForm">
        <div className="LoginFormTitle">
          Login
        </div>      

        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Email:
            <input name="email"
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required></input>
          </div>
          <div className="LoginFormSection">
            Password:
            <input name="password"
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required></input>
          </div>  
          <input type="submit" value="Login" onClick={onSubmit} className="LoginFormSubmit"></input>  
        </form>

        <Link to={'/signup'} className="LoginFormSignupLinkContainer">
          <button className="LoginFormSignupLink">Don't have an account? Signup here</button>
        </Link>  

        <Link to={'/forgotpassword'} className="LoginFormSignupLinkContainer">
          <button className="LoginFormSignupLink">Forgot Password?</button>
        </Link>  

      </div>
    );
}
  
export default LoginForm;