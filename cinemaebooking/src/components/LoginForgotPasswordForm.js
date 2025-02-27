import "./LoginForm.css";
import { Link} from 'react-router-dom';
import { useState } from 'react';

function LoginForgotPassWordForm() {

    const [hasSent, setHasSent] = useState(false);

    //const navigate = useNavigate();
    const onSubmit = (e) => {
      e.preventDefault();
      setHasSent(!hasSent);
    }

    const notSentForm = <div>
        <div className="LoginFormTitle">
            Recover Password
        </div>        
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Enter your email address to receive a verification code
            <input type="text"></input>
          </div> 
          <input type="submit" value="Get Verification Code" onClick={onSubmit} className="LoginFormSubmit"></input>  
        </form>
    </div>;

    const sentForm = <div>
    <div className="LoginFormTitle">
        Recovery Email Sent
    </div>        
    <form className="LoginFormForm">
    <div className="LoginFormSection">
        Please check your email for the recovery code and instructions
    </div> 
    </form>
    </div>;

    return (
      <div className="LoginForm">
        {hasSent ? sentForm : notSentForm} 
        <Link to={'/login'} className="LoginFormSignupLinkContainer">
          <button className="LoginFormSignupLink">Back to Login</button>
        </Link>  
      </div>
    );
}
  
export default LoginForgotPassWordForm;