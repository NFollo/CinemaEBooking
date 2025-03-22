import "./SignupForm.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isValidRequiredForm, isValidAddressForm, isValidPaymentCardForm, 
    createAddress, createUser, createPaymentCard } 
    from '../applicationLogic/SignupHandlers';


function SignupForm() {
    // for input fields
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const years = [];
    for (let i = 0; i < 20; i++) {years.push(2025 + i);}

    // state variable for changing from form to verification code
    const [isForm, setIsForm] = useState(true);

    // state variables for required user fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [receivePromotions, setReceivePromotions] = useState(true)

    // state variables to determine if a password is valid
    const [isMatch, setIsMatch] = useState(false);
    const [isPasswordLength, setIsPasswordLength] = useState(false);

    //state variables for payment card
    const [cardType, setCardType] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [cvc, setCVC] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingZipCode, setBillingZipCode] = useState('');

    // state variables for address
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    // state variables for displaying payment card and address input fields
    const [displayCardInput, setDisplayCardInput] = useState(false);
    const [displayAddressInput, setDisplayAddressInput] = useState(false);

    // establish router
    const navigate = useNavigate();
    
    // only allow numbers
    const disallowNonNumericInput = (evt) => {
        if (evt.ctrlKey) return;
        if (evt.key.length > 1) return;
        if (/[0-9]/.test(evt.key)) return;
        evt.preventDefault();
    };

    // format phone number
    const formatToPhone = (evt) => {
        const digits = evt.target.value.replace(/\D/g, '').substring(0, 10);
        const areaCode = digits.substring(0, 3);
        const prefix = digits.substring(3, 6);
        const suffix = digits.substring(6, 10);

        let formattedPhone = '';
        if (digits.length > 6) {
            formattedPhone = `${areaCode}-${prefix}-${suffix}`;
        } else if (digits.length > 3) {
            formattedPhone = `${areaCode}-${prefix}`;
        } else if (digits.length > 0) {
            formattedPhone = `${areaCode}`;
        }
        setPhoneNumber(formattedPhone);
    };

    // format phone number
    const formatToCardNumber = (evt) => {
        const digits = evt.target.value.replace(/\D/g, '').substring(0, 16);
        const part1 = digits.substring(0, 4);
        const part2 = digits.substring(4, 8);
        const part3 = digits.substring(8, 12);
        const part4 = digits.substring(12, 16);
    
        let formattedCard = '';
        if (digits.length > 12) {
            formattedCard = `${part1}-${part2}-${part3}-${part4}`;
        } else if (digits.length > 8) {
            formattedCard = `${part1}-${part2}-${part3}`;
        } else if (digits.length > 4) {
            formattedCard = `${part1}-${part2}`;
        } else {
            formattedCard = part1;
        }
    
        setCardNumber(formattedCard);
    }

    useEffect(() => { // check password
        setIsMatch(password === confirmPassword);
        setIsPasswordLength(password.length >= 8 && confirmPassword >= 8)
      }, [password, confirmPassword]);

    const clearInputs = () => {
        // reset user fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');

        // reset payment card fields
        setCardType('');
        setNameOnCard('');
        setCardNumber('');
        setExpirationMonth('');
        setExpirationYear('');
        setCVC('');
        setBillingAddress('');
        setBillingCity('');
        setBillingState('');
        setBillingZipCode('');

        // reset home address fields
        setStreetAddress('');
        setCity('');
        setState('');
        setZipCode('');
    }
    
    // handler for form submit button
    const onSubmit = async (event) => {
        // prevent default action
        event.preventDefault();

        // TEMPORARY CHANGE, REMOVE THIS LATER
        // this is just to test the verification code page
        //setIsForm(false);
    
        // ensure all required fields are complete 
        const isValidRequired = isValidRequiredForm(firstName, lastName, email, password,
            confirmPassword, phoneNumber);

        // ensure address is either empty or fullly complete
        const isValidHomeAddress = isValidAddressForm(streetAddress, city, state, zipCode);

        // ensure payment card is either empty or fully complete with proper formatting
        const isValidPaymentCard = isValidPaymentCardForm(cardType, nameOnCard, cardNumber, 
            expirationMonth, expirationYear, cvc, billingAddress, billingCity, billingState, 
            billingZipCode);

        // do not continue if form is invalid; alerts provided in respective validations
        if (!isValidRequired || !isValidHomeAddress || !isValidPaymentCard)
            return;

        // handle home address document creation (if specified) and exit upon error
        let homeAddressId = 0;
        if (displayAddressInput) {
            homeAddressId = await createAddress('home', streetAddress, city, state, zipCode);
            if (homeAddressId === -1)
                return;
        }

        // handle user document creation and exit upon error
        const userId = await createUser(firstName, lastName, email, password, phoneNumber, receivePromotions, homeAddressId);
        if (userId === -1)
            return;

        // handle payment card document creation and exit upon error
        if (displayCardInput) {
            const paymentCardId = await createPaymentCard(cardType, nameOnCard, cardNumber, expirationMonth, 
                expirationYear, cvc, billingAddress, billingCity, billingState, billingZipCode, userId)
            if (paymentCardId === -1)
                return;
        }  

        // clear inputs, send confirmation email, and redirect user
        clearInputs();
        // sendConfirmationEmail();
        navigate("/confirmation");
        
        // State change to enter code
        setIsForm(false);
    } // onSubmit

    // On Verification Code submission
    const onSubmitCode = (e) => { // enter logic for checking the code here
        e.preventDefault();
    }

    // Send back to signup form
    const onGoBackLink = (e) => {
        e.preventDefault();
        setIsForm(true);
    }

    const SignupFormAll = <div>
    <div className="SignupFormTitle">Signup</div>

    <Link to={'/login'} className="SignupFormLoginLinkContainer">
      <button className="SignupFormLoginLink">Already have an account? Login here</button>
    </Link>  

    <form className="SignupFormForm">
        <div className="SignupFormSection">
            <div>First Name:<span>*</span></div>
            <input name="firstName"
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                required></input>
        </div>

        <div className="SignupFormSection">
            <div>Last Name:<span>*</span></div>
            <input name="lastName"
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                required></input>
        </div>

        <div className="SignupFormSection">
            <div>Email:<span>*</span></div>
            <input name="email"
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required></input>
        </div>

        <div className="SignupFormSection">
            {isMatch ? "" : <div className="LoginFormRedText" style={{ fontSize: '16px' }}>Passwords must match </div> }
            {isPasswordLength ? "" : <div className="LoginFormRedText" style={{ fontSize: '16px' }}>Password must be equal or greater than 8 characters</div> }   

            <div>Password:<span>*</span></div>
            <input name="password"
                type="passwored"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required></input>
        </div> 

        <div className="SignupFormSection">
            <div>Confirm Password:<span>*</span></div>
            <input name="confirmPassword"
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                required></input>
        </div> 
          
        <div className="SignupFormSection">
            <div>Phone Number:<span>*</span></div>
            <input name="phoneNumber"
                type="tel"
                value={phoneNumber}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="123-456-7890"
                maxLength="12"
                onKeyDown={disallowNonNumericInput}
                onKeyUp={formatToPhone}
                ></input>
        </div>

        {!displayCardInput ? 
            <button className="SignupFormSubmit" onClick={() => {setDisplayCardInput(true)}}>
                Enter Payment Card (optional)
            </button>
          : <>
            <div className="SignupFormSubtitle">
            Payment Information (optional):
            </div>
                
            <div className="SignupFormSection">Card Type:
                <select name="cardType"
                    type="text" 
                    value={cardType} 
                    onChange={(e) => setCardType(e.target.value)}
                >
                    <option value="none"></option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>
            </div>

            <div className="SignupFormSection"> 
                Name (as appears on card):
                <input name="nameOnCard"
                    type="text" 
                    value={nameOnCard} 
                    onChange={(e) => setNameOnCard(e.target.value)}></input>
            </div>  

            <div className="SignupFormSection">
                Card Number:
                <input name="cardNumber"
                    type="text" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1111-2222-3333-4444"
                    maxlength="19"
                    onKeyDown={disallowNonNumericInput}
                    onKeyUp={formatToCardNumber}
                ></input>
            </div>

            <div className="SignupFormSection">
                Expiration Month:
                <select name="expirationMonth"
                    type="text" 
                    value={expirationMonth} 
                    onChange={(e) => setExpirationMonth(e.target.value)}>
                    <option value="none"></option>
                    {months.map((month) => <option value={month}>
                        {month}
                    </option>
                    )}
                </select>
            </div>

            <div className="SignupFormSection">
                Expiration Year:
                <select name="expirationYear"
                    type="text" 
                    value={expirationYear} 
                    onChange={(e) => setExpirationYear(e.target.value)}>
                    <option value="none"></option>
                    {years.map((year) => <option value={year}>
                        {year}
                    </option>
                    )}
                </select>
            </div>
            
            <div className="SignupFormSection">
                CVC:
                <input name="cvc"
                    type="password" 
                    value={cvc} 
                    maxLength={4}
                    onChange={(e) => setCVC(e.target.value)}></input>
            </div>
            
            <div className="SignupFormSection">
                Billing Address:
                <input name="billingAddress"
                    type="text" 
                    value={billingAddress} 
                    onChange={(e) => setBillingAddress(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                City:
                <input name="billingCity"
                    type="text" 
                    value={billingCity} 
                    onChange={(e) => setBillingCity(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                State:
                <input name="billingState"
                    type="text" 
                    value={billingState} 
                    onChange={(e) => setBillingState(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                Zip Code:
                <input name="billingZipCode"
                    type="text" 
                    value={billingZipCode} 
                    onChange={(e) => setBillingZipCode(e.target.value)}></input>
            </div>
          </>
          }

          {!displayAddressInput ?
            <button className="SignupFormSubmit" onClick={() => {setDisplayAddressInput(true)}}>
                Enter Home Address (optional)
            </button>
          : <>
            <div className="SignupFormSubtitle">
                Home Address (optional):
            </div>

            <div className="SignupFormSection">
                Street Address:
                <input name="streetAddress"
                    type="text" 
                    value={streetAddress} 
                    onChange={(e) => setStreetAddress(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                City:
                <input name="city"
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                State:
                <input name="state"
                    type="text" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}></input>
            </div>

            <div className="SignupFormSection">
                Zip Code:
                <input name="zipCode"
                    type="text" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}></input>
            </div>
          </>
          }

        <div className="SignupFormSplit">
            Receive promotions:
            <input id="receivePromotions"
                type="checkbox" 
                name="receivePromotions"
                checked={receivePromotions}
                onChange={(e) => {
                    setReceivePromotions(e.target.checked);
                }}>
            </input>
        </div>
          
          <input type="submit" value="Signup" onClick={onSubmit} 
            className="SignupFormSubmit"></input>  
      </form>
      </div>;

    const VerificationFormAll = 
        <div>
            <div className="SignupFormTitle">Verification Email Sent</div>  
            <div className="SignupFormForm">Please check your email and enter the verification code</div>          
            <br></br>
            <form className="SignupFormForm">
                <div className="SignupFormSection">
                    <input name="firstName"
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        required></input>
                </div>
                <input type="submit" value="Submit Code" onClick={onSubmitCode} 
            className="SignupFormSubmit"></input>  
            </form>

            <Link className="SignupFormLoginLinkContainer">
                <button className="SignupFormLoginLink" onClick={onGoBackLink}>Back to Signup Page</button>
            </Link>  
        </div>;

    return (
      <div className="SignupForm">
        {isForm ? SignupFormAll : VerificationFormAll}
      </div>
    );
}
  
export default SignupForm;