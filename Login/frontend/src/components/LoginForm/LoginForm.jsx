import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiConstants";
import axios from "axios";

function LoginForm({ showError, updateTitle }) {
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        axios.post(`${API_BASE_URL}/login`, {
            email: state.email,
            password: state.password
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setState((prev) => ({
                        ...prev,
                        successMessage: "Login successful. Redirecting....",
                    }));

                    localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                    updateTitle("Home");
                    navigate("/home");
                    showError(null);
                } else {
                    showError("Invalid credentials");
                }
            })
            .catch(() => showError("Server error"));
    }

    const redirectToRegister = () => {
        updateTitle("Register");
        navigate("/register");
    };

    return (
        <div className="card col-12 col-lg-5 col-xl-4 login-card mt-4 shadow border-0 rounded-4">
            <div className="card-body p-4">
                <h5 className="card-title text-center mb-4">Login</h5>
                <form>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            value={state.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={state.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleSubmitClick}>
                        Sign in
                    </button>
                </form>
                {state.successMessage && (
                    <div className="alert alert-success mt-3 mb-0">{state.successMessage}</div>
                )}
                <div className="registerMessage text-center">
                    <span>Don’t have an account? </span>
                    <span className="loginText" onClick={redirectToRegister}>
                        Register
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;