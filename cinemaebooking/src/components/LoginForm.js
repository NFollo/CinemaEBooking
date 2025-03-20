import "./LoginForm.css";
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {

    const navigate = useNavigate();
    const onSubmit = () => {
      navigate("/loggedin");
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