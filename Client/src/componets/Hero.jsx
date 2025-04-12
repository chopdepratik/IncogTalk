import "../componets/Hero.css"; // also fix spelling if it's "components"
import heroImage1 from "../assets/images/image.png";
import { Link, useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate(); // ✅ correct place to call it

    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1>IncogTalk</h1>
                <h3>Speak Freely, Stay Hidden</h3>
                <p>
                    <strong>Welcome to IncogTalk</strong> — your private, secure, and real-time space for anonymous conversations.
                    Create your room, invite friends, and talk freely — no sign-ups, no trace, just connection.
                </p>
                {/* OPTION 1: Use Link (simpler) */}
                {/* <Link to="/room">
                    <button className="hero-button">Get Started</button>
                </Link> */}

                {/* OPTION 2: Use navigate with button click */}
                <button
                    className="hero-button"
                    onClick={() => navigate("/room")}
                >
                    Get Started
                </button>
            </div>
            <div className="hero-image">
                <img src={heroImage1} alt="Chat illustration" />
            </div>
        </div>
    );
}

export default Hero;
