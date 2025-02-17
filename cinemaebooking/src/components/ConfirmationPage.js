import "./ConfirmationPage.css";
import { Link } from 'react-router-dom';
import LoginSignupCard from "./LoginSignupCard";
import ConfirmationForm from "./ConfirmationForm";

function ConfirmationPage() {
    return (
      <div className="ConfirmationPage">
        <Link to={'/'}>
          <button className="LoginPageHome">Home</button>
        </Link>  
      <LoginSignupCard form={<ConfirmationForm />} /> 
    </div>
    );
}
  
export default ConfirmationPage;