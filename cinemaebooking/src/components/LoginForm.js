import "./LoginForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

function LoginForm() {

    const navigate = useNavigate();
    const onSubmit = () => {
      navigate("/loggedin");
    }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Get login to work, check if verified and not inactive, email and password is correct, otherwise, give alert

    const loginUser = async (e) => {
      e.preventDefault();
      try {
        if (!email) {
          alert("Please enter a valid Email");
          return; 
        }
        await axios.get('http://localhost:5000/user', { email, password });
        setHasSent(1); // Move to the "Enter Code" step

      } catch (error) {
        if (error.response.status == 404)  // user not found in db
          alert("No user found")
        else {
          console.error("Error sending verification code:", error);
          alert("An error occurred. Please try again.");
        }
      }
    }
    return (
      <div className="LoginForm">
        <div className="LoginFormTitle">
          Login
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Email:
            <input type="text"></input>
          </div>
          <div className="LoginFormSection">
            Password:
            <input type="text"></input>
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