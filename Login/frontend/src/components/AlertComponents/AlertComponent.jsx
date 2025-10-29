import { useEffect, useState } from "react";
import "./AlertComponent.css";

function AlertComponent({ errorMessage, hideError }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(!!errorMessage);
    }, [errorMessage]);

    if (!visible) return null;

    return (
        <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
            <div className="d-flex align-items-center justify-content-between w-100">
                <span>{errorMessage}</span>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => hideError(null)}></button>
            </div>
        </div>
    )
}

export default AlertComponent;