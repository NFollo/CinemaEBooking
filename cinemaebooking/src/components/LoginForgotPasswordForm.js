import "./LoginForm.css";
import { Link} from 'react-router-dom';
import { useState, useEffect } from 'react';

function LoginForgotPassWordForm() {

    const [hasSent, setHasSent] = useState(0);
    const [PW1, setPW1] = useState("");
    const [PW2, setPW2] = useState("");
    const [isMatch, setIsMatch] = useState(false);

    //const navigate = useNavigate();
    const toRecovery = (e) => {
      e.preventDefault();
      setHasSent(0);
    }

    const toCode = (e) => {
      e.preventDefault();
      setHasSent(1);
    }

    const toNewPassword = (e) => {
      e.preventDefault();
      setHasSent(2);
    }

    const toFinish = (e) => {
      e.preventDefault();
      if (isMatch) {
        setHasSent(3);
      }
    }

    const checkMatch = (e) => { // ADD PASSWORD VALIDATION HERE (the red text can be changed to a state variable to indicate what is wrong with the password too)
      if (e.target.name === "PW1") {
        setPW1(e.target.value);
      } else if (e.target.name === "PW2") {
        setPW2(e.target.value);
      }
    }

    useEffect(() => {
      setIsMatch(PW1 === PW2);
    }, [PW1, PW2]);

    const recovery = <div>
        <div className="LoginFormTitle">
            Recover Password
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter your email address to receive a verification code
            <input type="text"></input>
          </div> 
          <input type="submit" value="Get Verification Code" onClick={toCode} className="LoginFormSubmit"></input>  
        </form>
    </div>;

    const code = <div>
        <div className="LoginFormTitle">
            Enter Recovery Code
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter the code sent to your email
            <input type="number"></input>
          </div> 
          <input type="submit" value="Enter Code" onClick={toNewPassword} className="LoginFormSubmit"></input>  
        </form>
    </div>;

    const newPassword = <div>
        <div className="LoginFormTitle">
            Enter New Password
        </div>   
        {isMatch ? "" : <div className="LoginFormRedText">Passwords must match</div> }   
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter a new password
            <input type="text" name="PW1" value={PW1} onChange={checkMatch}></input>
          </div> 
          <div className="LoginFormSection">
            Confirm Password
            <input type="text" name="PW2" value={PW2} onChange={checkMatch}></input>
          </div> 
          <input type="submit" value="Save Password" onClick={toFinish} className="LoginFormSubmit"></input> 
        </form>
    </div>;

    const finish = <div>
    <div className="LoginFormSubtitle">
        Your new password has been saved
    </div>    
    </div>;

    const backLink = <div className="LoginFormSignupLinkContainer">
      <button className="LoginFormSignupLink" onClick={toRecovery}>Resend email</button>
    </div>;

    return (
      <div className="LoginForm">
        {hasSent === 0 ? recovery : (hasSent === 1 ? code : (hasSent === 2 ? newPassword : finish))} 
        <Link to={'/login'} className="LoginFormSignupLinkContainer">
          <button className="LoginFormSignupLink">Back to Login</button>
        </Link>  
        {hasSent === 1 ? backLink : ""}
      </div>
    );
}
  
export default LoginForgotPassWordForm;