import "./LoginForm.css";
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {

    const navigate = useNavigate();
    const onSubmit = () => {
      navigate("/");
    }

    return (
      <div className="LoginForm">
        <div className="LoginFormTitle">
          Login
        </div>
        <Link to={'/signup'} className="LoginFormSignupLinkContainer">
          <button className="LoginFormSignupLink">Don't have an account? Signup here</button>
        </Link>  
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Username:
            <input type="text"></input>
          </div>
          <div className="LoginFormSection">
            Password:
            <input type="text"></input>
          </div>  
          <input type="submit" value="Login" onClick={onSubmit} className="LoginFormSubmit"></input>  
        </form>
      </div>
    );
}
  
export default LoginForm;