import "./ConfirmationForm.css";
import { Link } from 'react-router-dom';

function ConfirmationForm() {
    return (
      <div className="ConfirmationForm">
        <div className="ConfirmationFormTitle">
          A Verification Email Was Sent
        </div>  
        <div className="ConfirmationFormSubtitle">
          to youremailhere@domainname.com
        </div>  
        <br></br>
        <br></br>
        <div className="ConfirmationFormSubtitle">
          After confirming your email you will be brought to the login page
        </div>
        <br></br>
        <Link to={'/login'} className="ConfirmationFormLinkContainer">
          <button className="ConfirmationFormLink">Go to Login</button>
        </Link>  
        <Link to={'/'} className="ConfirmationFormLinkContainer">
          <button className="ConfirmationFormLink">Back to Home Page</button>
        </Link>  
      </div>
    );
}
  
export default ConfirmationForm;