import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiConstants";
import axios from "axios";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/`, {
            headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
        })
            .then((res) => {
                if (res.status !== 200) navigate("/login");
            })
            .catch(() => navigate("/login"));
    }, []);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 text-center">
                            <h3 className="mb-2">Welcome to Home Page</h3>
                            <p className="text-muted mb-0">You are successfully logged in.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;