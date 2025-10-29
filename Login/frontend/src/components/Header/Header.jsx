import { useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../../constants/apiConstants";

function Header({title}){
    const location = useLocation();
    const navigate = useNavigate();

    const capitalize = (s) => (typeof s !== "string" ? "" : s.charAt(0).toUpperCase() + s.slice(1));

    let headerTitle = title || capitalize(location.pathname.substring(1));
    if(location.pathname === "/") headerTitle = "Welcome";

    const handleLogout = () =>{
        localStorage.removeItem(ACCESS_TOKEN_NAME);
        navigate("/login");
    };

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <span className="navbar-brand mb-0 h3">{headerTitle}</span>
                {location.pathname === "/home" && (
                    <div className="ms-auto">
                        <button className="btn btn-outline-light" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Header;