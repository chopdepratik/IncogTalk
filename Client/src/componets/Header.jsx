import "../componets/Header.css"
import logo from "../assets/images/logo.jpeg";

function Header() {
    return (
        <header className="main-header">
            <nav className="nav-bar">
                <img src={logo} alt="IncogTalk Logo" className="logo" />
                <h3 className="site-name">IncogTalk</h3>
            </nav>
        </header>
    );
}

export default Header;
