import "./SignupForm.css";
import { Link, useNavigate } from 'react-router-dom';

function SignupForm() {

    const navigate = useNavigate();
    const onSubmit = () => {
      navigate("/confirmation");
    }

    return (
      <div className="SignupForm">
        <div className="SignupFormTitle">
          Signup
        </div>
        <Link to={'/login'} className="SignupFormLoginLinkContainer">
          <button className="SignupFormLoginLink">Already have an account? Login here</button>
        </Link>  
        <form className="SignupFormForm">
          <div className="SignupFormSection">
            <div>Email:<span>*</span></div>
          <input type="text"></input>
          </div>
          <div className="SignupFormSection">
            <div>Username:<span>*</span></div>
          <input type="text"></input>
          </div>
          <div className="SignupFormSection">
            <div>Password:<span>*</span></div>
            <input type="text"></input>
          </div>  
          <div className="SignupFormSection">
            <div>Phone Number:<span>*</span></div>
          <input type="number"></input>
          </div>

          <div className="SignupFormSubtitle">Payment Information (optional):</div>

          <div className="SignupFormSection">
            Card Type:
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

          <input type="submit" value="Signup" onClick={onSubmit} className="SignupFormSubmit"></input>  
        </form>
      </div>
    );
}
  
export default SignupForm;