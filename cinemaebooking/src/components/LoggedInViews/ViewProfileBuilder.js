
let m_userInfo = "";
let m_address = <div>No Address Saved</div>;
let m_card1 = "";
let m_card2 = "";
let m_card3 = "";
let m_promotions = "No";

export function userInfo(userInfo) {
    m_userInfo = 
        <div>
            <div>Email: <span>{userInfo.email}</span></div>
            <div>First Name: <span>{userInfo.firstName}</span></div>
            <div>Last Name: <span>{userInfo.lastName}</span></div>
            <div>Phone Number: <span>{userInfo.phoneNumber}</span></div>            
            <div>Password: <span>********</span></div>
        </div>
} // userInfo

export function receivePromotions(toggle) {
    if (toggle === true)
        m_promotions = "Yes";
    else 
        m_promotions = "No";
}

export function address(homeAddress) {
    m_address =
        <div>
            <div>Address: <span>{homeAddress.street}</span></div>
            <div>City: <span>{homeAddress.city}</span></div>
            <div>State: <span>{homeAddress.state}</span></div>
            <div>Country: <span>{homeAddress.country}</span></div>
            <div>ZIP Code: <span>{homeAddress.zipCode}</span></div>
        </div>;
} // address

export function card1(card1) {
    m_card1 = 
        <div>
            <div className="ViewProfileSubtitle">Card 1 Information</div>
            <div>Card Type: <span>{card1.type}</span></div>
            <div>Name on Card: <span>{card1.nameOnCard}</span></div>
            <div>Card Number: <span>**** **** **** {card1.lastFour}</span></div>
            <div>Expiration Date: <span>{card1.expirationMonth + " " +  card1.expirationYear}</span></div>
            <div>CVC: <span>***</span></div>
            <div className="ViewProfileSubtitle">Card 1 Billing Address</div>
            <div>Address: <span>{card1.address.street}</span></div>
            <div>City: <span>{card1.address.city}</span></div>
            <div>State: <span>{card1.address.state}</span></div>
            <div>Country: <span>{card1.address.country}</span></div>
            <div>ZIP Code: <span>{card1.address.zipCode}</span></div>
        </div>;
} // card1

export function card2(card2) {
    m_card2 = 
        <div>
            <div className="ViewProfileSubtitle">Card 2 Information</div>
            <div>Card Type: <span>{card2.type}</span></div>
            <div>Name on Card: <span>{card2.nameOnCard}</span></div>
            <div>Card Number: <span>**** **** **** {card2.lastFour}</span></div>
            <div>Expiration Date: <span>{card2.expirationMonth + " " +  card2.expirationYear}</span></div>
            <div>CVC: <span>***</span></div>
            <div className="ViewProfileSubtitle">Card 2 Billing Address</div>
            <div>Address: <span>{card2.address.street}</span></div>
            <div>City: <span>{card2.address.city}</span></div>
            <div>State: <span>{card2.address.state}</span></div>
            <div>Country: <span>{card2.address.country}</span></div>
            <div>ZIP Code: <span>{card2.address.zipCode}</span></div>
        </div>;
} // card2

export function card3(card3) {
    m_card3 =
        <div>
            <div className="ViewProfileSubtitle">Card 3 Information</div>
            <div>Card Type: <span>{card3.type}</span></div>
            <div>Name on Card: <span>{card3.nameOnCard}</span></div>
            <div>Card Number: <span>**** **** **** {card3.lastFour}</span></div>
            <div>Expiration Date: <span>{card3.expirationMonth + " " +  card3.expirationYear}</span></div>
            <div>CVC: <span>***</span></div>
            <div className="ViewProfileSubtitle">Card 3 Billing Address</div>
            <div>Address: <span>{card3.address.street}</span></div>
            <div>City: <span>{card3.address.city}</span></div>
            <div>State: <span>{card3.address.state}</span></div>
            <div>Country: <span>{card3.address.country}</span></div>
            <div>ZIP Code: <span>{card3.address.zipCode}</span></div>
        </div>;
} // card3

export function build() {
    return <>
        <div className="ViewProfileSubtitle">General Information</div>
        {m_userInfo}

        <div className="ViewProfileSubtitle">Home Address</div>
        {m_address} 
        
        {m_card1} 
        
        {m_card2} 
        
        {m_card3}

        <div className="ViewProfileSubtitle">Receive Promotions: {m_promotions}</div>
        </>
} // build