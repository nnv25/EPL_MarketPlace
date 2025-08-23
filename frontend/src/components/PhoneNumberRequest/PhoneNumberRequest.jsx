import React, { useState } from "react";
import axios from "axios";
import OTPPasswordReset from "../OTPPasswordReset/OTPPasswordReset";
import NewPassword from "../NewPassword/NewPassword";
import './PhoneNumberRequest.css';

const PhoneNumberRequest = ({ onClose }) => {
    const [data, setData] = useState({
        phone: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    /*const [isModalOpen, setIsModalOpen] = useState(true);*/

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    const formatPhoneNumber = (phone) => {
        const digits = phone.replace(/\D/g, ""); 
        return `+7${digits.slice(-10)}`;
    };

    const PasswordRequestNumber = async (event) => {
        event.preventDefault();
        
        const formattedPhone = formatPhoneNumber(data.phone);

        try {
            const response = await axios.post("http://localhost:4000/api/user/request-password-reset", {
                phone: formattedPhone
            });
            
            if (response.data.success) {
                setMessage("OTP отправлен на ваш номер телефона.");
                setError("");
                setPhoneSubmitted(true);
            } else {
                setMessage("");
                setError(response.data.message || "Ошибка при отправке OTP.");
            }
        } catch (error) {
            console.error("Error during request:", error);
            setMessage("");
            setError("Произошла ошибка при отправке запроса.");
        }
    };

    /*const handleClose = () => {
        setIsModalOpen(false); // Закрывает модальное окно
    };*/

    return (
        /*isModalOpen && (*/
            <div className="modal-overlay1">
                <div className="modal-content1">
                    <button className="close-btn1" onClick={onClose}>×</button>
                    <h2>Восстановление пароля</h2>

                    {otpVerified ? (
                        <NewPassword phone={data.phone} onClose={onClose} />
                    ) : phoneSubmitted ? (
                        <OTPPasswordReset
                            phone={data.phone}
                            onOTPSuccess={() => setOtpVerified(true)}
                            onClose={onClose}
                        />
                    ) : (
                        <form onSubmit={PasswordRequestNumber}>
                            <label className="modal-label" htmlFor="phone">Номер телефона</label>
                            <input
                                className="modal-input"
                                type="text"
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={onChangeHandler}
                                placeholder="+7 (XXX) XXX-XX-XX"
                                required
                            />
                            <button type="submit">Отправить код</button>
                        </form>
                    )}

                    {message && <p className="success-message1">{message}</p>}
                    {error && <p className="error-message1">{error}</p>}
                </div>
            </div>
        )
    /*);*/
};

export default PhoneNumberRequest;