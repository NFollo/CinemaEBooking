import "./SignupForm.css";

function SignupForm() {
    return (
      <div className="SignupForm">
        <div className="SignupFormTitle">
          Signup
        </div>
        <form className="SignupFormForm">
          <div className="SignupFormSection">
            Email:
          <input type="text"></input>
          </div>
          <div className="SignupFormSection">
            Username:
          <input type="text"></input>
          </div>
          <div className="SignupFormSection">
            Password:
            <input type="text"></input>
          </div>  
          <div className="SignupFormSection">
            Phone Number:
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

          <input type="submit" value="Signup" className="SignupFormSubmit"></input>  
        </form>
      </div>
    );
}
  
export default SignupForm;