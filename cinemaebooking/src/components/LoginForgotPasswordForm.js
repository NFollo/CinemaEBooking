import "./LoginForm.css";
import { Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function LoginForgotPassWordForm() {

    const [hasSent, setHasSent] = useState(0);
    const [PW1, setPW1] = useState("");
    const [PW2, setPW2] = useState("");
    const [isMatch, setIsMatch] = useState(false);
    const [isPasswordLength, setIsPasswordLength] = useState(false);


    const [email, setEmail] = useState("");
    const [recoveryCode, setRecoveryCode] = useState("");
    
    //const navigate = useNavigate();
    const toRecovery = (e) => {
      e.preventDefault();
      setHasSent(0);
    }


    const sendVerificationCode = async (e) => {
      e.preventDefault();
      try {
        if (!email) {
          alert("Please enter a valid Email");
          return; 
        }
        await axios.post('http://localhost:5000/forgotPassword', { email });
        setHasSent(1); // Move to the "Enter Code" step

      } catch (error) {
        if (error.response.status === 404)  // user not found in db
          alert("No user found")
        else {
          console.error("Error sending verification code:", error);
          alert("An error occurred. Please try again.");
        }
      }
    }

    const verifyCode = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/verifyCode', { email, code: recoveryCode });
        setHasSent(2)
      } catch (error) {
        if (error.response.status === 400)
          alert('Invalid or expired code');
        else 
          alert('Error verifying code');
      }
    };

    const resetPassword = async (e) => {
      e.preventDefault();
      if (!isMatch) 
      {
        alert("Passwords do not match!")
        return
      }
      else if (!isPasswordLength)
      {
        alert("Password must be equal or greater than 8 characters")
        return
      }
      try {
        await axios.post('http://localhost:5000/resetPassword', { email, new_password: PW1 });
        setHasSent(3)
      } catch (error) {
        if (error.response.status === 404)
          alert('User not found');
        else 
          alert('Error resetting password') 
      }
    }

    useEffect(() => {
      setIsMatch(PW1 === PW2);
      setIsPasswordLength(PW1.length >= 8 && PW2.length >=8)
    }, [PW1, PW2]);

    const recovery = <div>
        <div className="LoginFormTitle">
            Recover Password
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter your email address to receive a verification code
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div> 
          <input type="submit" 
            value="Get Verification Code" 
            className="LoginFormSubmit"
            onClick={sendVerificationCode}
          ></input>  
        </form>
    </div>;

    const verifyCodeFormat = <div>
        <div className="LoginFormTitle">
            Enter Recovery Code
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter the code sent to your email
            <input 
              type="text"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              maxLength={6}
              pattern="\d*" // number only
              required
            ></input>
          </div> 
          <input 
            type="submit" 
            value="Enter Code" 
            onClick={verifyCode}
            className="LoginFormSubmit"
          ></input>  
        </form>
    </div>;

    const newPassword = <div>
        <div className="LoginFormTitle">
            Enter New Password
        </div>   
        {isMatch ? "" : <div className="LoginFormRedText">Passwords must match</div> }
        {isPasswordLength ? "" : <div className="LoginFormRedText">Password must be equal or greater than 8 characters</div> }      
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter a new password
            <input 
            type="text" 
            name="PW1" 
            minLength={8}
            value={PW1} 
            onChange={(e) => setPW1(e.target.value)}>
            </input>
          </div> 
          <div className="LoginFormSection">
            Confirm Password
            <input 
            type="text" 
            name="PW2" 
            minLength={8}
            value={PW2} 
            onChange={(e) => setPW2(e.target.value)}
            ></input>
          </div> 
          <input 
            type="submit" 
            value="Save Password" 
            onClick={resetPassword} 
            className="LoginFormSubmit">
          </input> 
        </form>
    </div>;

    const finish = 
    <div>
      <div className="LoginFormSubtitle">
          Your password has successfully been reset!
      </div>    
    </div>;

    const backLink = <div className="LoginFormSignupLinkContainer">
      <button className="LoginFormSignupLink" onClick={toRecovery}>Resend email</button>
    </div>;

   return (
  <div className="LoginForm">
    {hasSent === 0 ? (
      <div key={0}>{recovery}</div> // Add a unique key to force re-render when transitioning
    ) : hasSent === 1 ? (
      <div key={1}>{verifyCodeFormat}</div>
    ) : hasSent === 2 ? (
      <div key={2}>{newPassword}</div>
    ) : (
      <div key={3}>{finish}</div>
    )}
    
    <Link to={'/login'} className="LoginFormSignupLinkContainer">
      <button className="LoginFormSignupLink">Back to Login</button>
    </Link>  
    
    {hasSent === 1 ? backLink : ""}
  </div>
);
}
  
export default LoginForgotPassWordForm;