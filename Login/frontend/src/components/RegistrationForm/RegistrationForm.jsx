import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiConstants";
import { useState } from "react";
import axios from "axios";

function RegistrationForm({ showError, updateTitle }) {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        successMessage: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prev) => ({ ...prev, [id]: value }));
    };

    const redirectHome = () => {
        updateTitle("Home");
        navigate("/home");
    }

    const redirectLogin = () => {
        updateTitle("Login");
        navigate("/login");
    }

    const sendDetailsToServer = () => {
        if (state.email && state.password) {
            showError(null);
            const payload = {
                email: state.email,
                password: state.password,
            };

            axios.post(`${API_BASE_URL}/register`, payload)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        setState((prev) => ({
                            ...prev,
                            successMessage: "Registration successful. Redirecting...",
                        }));
                        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                        redirectHome();
                    } else {
                        showError("Some error occured");
                    }
                })
                .catch(() => showError("Server error"));
        } else {
            showError("Please enter valid details");
        }
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer();
        } else {
            showError("Password do not match");
        }
    };

    return (
        <div className="card col-12 col-lg-5 col-xl-4 login-card mt-4 shadow border-0 rounded-4">
            <div className="card-body p-4">
                <h5 className="card-title text-center mb-4">Create account</h5>
                <form>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            value={state.email}
                            onChange={handleChange}
                        ></input>
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

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={state.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" onClick={handleSubmitClick}>
                        Register
                    </button>
                </form>

                {state.successMessage && (
                    <div className="alert alert-success mt-3 mb-0">{state.successMessage}</div>
                )}

                <div className="mt-3 text-center">
                    <span>Already have an account? </span>
                    <span className="loginText" onClick={redirectLogin}>
                        Login here
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RegistrationForm;