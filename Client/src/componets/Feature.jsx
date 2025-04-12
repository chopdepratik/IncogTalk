// Create Features.jsx
import "../componets/Feature.css";
import chatIcon from "../assets/images/card1.png"; // use an icon or illustration
import lockIcon from "../assets/images/card2.png"; // security icon
import fastIcon from "../assets/images/card3.png"; // speed icon
import logo from "../assets/images/logo.jpeg";

function Feature() {
  return (
    <div className="features-wrapper">
      <h2>Why Choose IncogTalk?</h2>
      <div className="features">
        <div className="feature-box">
          <img src={chatIcon} alt="Chat Icon" />
          <h4>Real-Time Chat</h4>
          <p>Instant messaging with your friends in private rooms.</p>
        </div>
        <div className="feature-box">
          <img src={lockIcon} alt="Security Icon" />
          <h4>Anonymous & Secure</h4>
          <p>No login, no tracking — your conversations are private.</p>
        </div>
        <div className="feature-box">
          <img src={fastIcon} alt="Speed Icon" />
          <h4>Lightning Fast</h4>
          <p>Socket-powered chat for a seamless experience.</p>
        </div>
      </div>
    </div>
  );
}

export default Feature;
