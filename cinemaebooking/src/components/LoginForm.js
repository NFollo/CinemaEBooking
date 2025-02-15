import "./LoginForm.css";

function LoginForm() {
    return (
      <div className="LoginForm">
        <div className="LoginFormTitle">
          Login
        </div>
        <form className="LoginFormForm">
          <div className="LoginFormSection">
            Username:
            <input type="text"></input>
          </div>
          <div className="LoginFormSection">
            Password:
            <input type="text"></input>
          </div>  
          <input type="submit" value="Login" className="LoginFormSubmit"></input>  
        </form>
      </div>
    );
}
  
export default LoginForm;