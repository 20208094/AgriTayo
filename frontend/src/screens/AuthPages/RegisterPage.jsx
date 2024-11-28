import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        birthday: '',
        phone_number: '',
        secondary_phone_number: '',
        password: '',
        confirm_password: '',
        user_type_id: 1, // Default user type ID
        verified: false
    });

    console.log("console.log", formData)

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    const [phoneNumbersList, setPhoneNumbersList] = useState([]);
    const [phoneSecondaryNumbersList, setSecondaryPhoneNumbersList] = useState(
        []
    );

    useEffect(() => {
        const fetchPhoneNumbers = async () => {
          try {
            const response = await fetch(`/api/users`, {
              headers: { "x-api-key": API_KEY },
            });
            if (response.ok) {
              const data = await response.json();
              const numbers = data.map((user) => user.phone_number);
              setPhoneNumbersList(numbers);
            } else {
              console.error("Failed to fetch phone numbers");
            }
          } catch (error) {
            console.error("Error fetching phone numbers:", error);
          }
        };
    
        fetchPhoneNumbers();
      }, []);
    
      useEffect(() => {
        const fetchSecondaryPhoneNumbers = async () => {
          try {
            const response = await fetch(`/api/users`, {
              headers: { "x-api-key": API_KEY },
            });
            if (response.ok) {
              const data = await response.json();
              const numbers = data.map((user) => user.secondary_phone_number);
              setSecondaryPhoneNumbersList(numbers);
            } else {
              console.error("Failed to fetch phone numbers");
            }
          } catch (error) {
            console.error("Error fetching phone numbers:", error);
          }
        };
    
        fetchSecondaryPhoneNumbers();
      }, []);

    // Regular expressions for validation
    const regex = {
        firstname: /^[A-Za-z\s]{2,}$/,
        middlename: /^[A-Za-z\s]{2,}$/,
        lastname: /^[A-Za-z\s]{2,}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/,
        phone: /^(?:\+63|0)?9\d{9}$/
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when input is empty
        if (value === '') {
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }

        // Real-time validation
        switch (name) {
            case 'firstname':
                if (!regex.firstname.test(value)) {
                    setErrors((prev) => ({ ...prev, firstname: "Invalid First Name. Please enter at least 2 letters." }));
                } else {
                    setErrors((prev) => ({ ...prev, firstname: "" }));
                }
                break;
            case 'middlename':
                if (value && !regex.middlename.test(value)) {
                    setErrors((prev) => ({ ...prev, middlename: "Invalid Middle Name. Please enter at least 2 letters." }));
                } else {
                    setErrors((prev) => ({ ...prev, middlename: "" }));
                }
                break;
            case 'lastname':
                if (!regex.lastname.test(value)) {
                    setErrors((prev) => ({ ...prev, lastname: "Invalid Last Name. Please enter at least 2 letters." }));
                } else {
                    setErrors((prev) => ({ ...prev, lastname: "" }));
                }
                break;
            case 'phone_number':
                if (!regex.phone.test(value)) {
                    setErrors((prev) => ({ ...prev, phone_number: "Invalid phone number. Format should start with 09 and have 11 digits." }));
                } else {
                    setErrors((prev) => ({ ...prev, phone_number: "" }));
                }
                break;
            case 'secondary_phone_number':
                if (value && !regex.phone.test(value)) {
                    setErrors((prev) => ({ ...prev, secondary_phone_number: "Invalid alternative phone number format." }));
                } else {
                    setErrors((prev) => ({ ...prev, secondary_phone_number: "" }));
                }
                break;
            case 'password':
                if (!regex.password.test(value)) {
                    setErrors((prev) => ({ ...prev, password: "Password must contain 8-30 characters, including letters and numbers." }));
                } else {
                    setErrors((prev) => ({ ...prev, password: "" }));
                }
                // Check confirm password match
                if (formData.confirm_password && value !== formData.confirm_password) {
                    setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match." }));
                } else {
                    setErrors((prev) => ({ ...prev, confirm_password: "" }));
                }
                break;
            case 'confirm_password':
                if (value !== formData.password) {
                    setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match." }));
                } else {
                    setErrors((prev) => ({ ...prev, confirm_password: "" }));
                }
                break;
            case 'birthday':
                const selectedDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - selectedDate.getFullYear();
                const monthDiff = today.getMonth() - selectedDate.getMonth();
                
                if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                    setErrors((prev) => ({ ...prev, birthday: "You must be at least 18 years old" }));
                } else {
                    setErrors((prev) => ({ ...prev, birthday: "" }));
                }
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check required fields and set errors if any
        let hasError = false;
        const requiredFields = ['firstname', 'lastname', 'birthday', 'phone_number', 'password', 'confirm_password'];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                setErrors((prev) => ({ ...prev, [field]: `${field.replace("_", " ")} is required.` }));
                hasError = true;
            }
        });

        if (formData.password !== formData.confirm_password) {
            setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match." }));
            hasError = true;
        }

        if (hasError) return;

        if (
            formData.phone_number &&
            formData.secondary_phone_number &&
            (phoneNumbersList.includes(formData.phone_number) ||
              phoneSecondaryNumbersList.includes(formData.phone_number)) &&
            (phoneNumbersList.includes(formData.secondary_phone_number) ||
              phoneSecondaryNumbersList.includes(formData.secondary_phone_number))
          ) {
            alert(
              "Both Phone and Alternative Number are Already Registered"
            );
            return;
          }
      
          if (
            formData.phone_number &&
            (phoneNumbersList.includes(formData.phone_number) ||
              phoneSecondaryNumbersList.includes(formData.phone_number))
          ) {
            alert("Phone Number is Already Registered");
            return;
          }
      
          if (
            formData.secondary_phone_number &&
            (phoneSecondaryNumbersList.includes(formData.secondary_phone_number) ||
              phoneNumbersList.includes( formData.secondary_phone_number))
          ) {
            alert("Alternative Phone Number is Already Registered");
            return;
          }

        if (formData.secondary_phone_number) {
            navigate('/otpPhones', { state: { formData } });
        } else {
            navigate('/otp', { state: { formData } });
        }
        console.log('FormData:', formData)

        // try {
        //     const response = await fetch('/api/register', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'x-api-key': API_KEY // Include the API key in the request headers
        //         },
        //         body: JSON.stringify(formData)
        //     });
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         setSubmitError(errorData.error + ": " + errorData.details);
        //         return;
        //     }
        //     // Redirect to login page after successful registration
        //     navigate('/login'); // Adjust the path as needed
        // } catch (error) {
        //     console.error('Error during registration:', error);
        //     setSubmitError('An error occurred. Please try again.');
        // }
    };

    // Add this function to calculate max date (18 years ago from today)
    const calculateMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );
        return maxDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-image">
                    <img src="/AgriTayo_Logo.svg" alt="AgriTayo Logo" />
                </div>
                <div className="register-form-container">
                    <h1 className="register-title">Register</h1>
                    {submitError && <p className="register-error">{submitError}</p>}
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="grid-container">
                            <div className="form-group">
                                <label>
                                    First Name
                                    {errors.firstname && <span className="validation-message">{errors.firstname}</span>}
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Middle Name
                                    {errors.middlename && <span className="validation-message">{errors.middlename}</span>}
                                </label>
                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Last Name
                                    {errors.lastname && <span className="validation-message">{errors.lastname}</span>}
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Birthday
                                    {errors.birthday && <span className="validation-message">{errors.birthday}</span>}
                                </label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                    max={calculateMaxDate()}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Phone Number
                                    {errors.phone_number && <span className="validation-message">{errors.phone_number}</span>}
                                </label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Alternative Phone Number
                                    {errors.secondary_phone_number && <span className="validation-message">{errors.secondary_phone_number}</span>}
                                </label>
                                <input
                                    type="text"
                                    name="secondary_phone_number"
                                    value={formData.secondary_phone_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Password
                                    {errors.password && <span className="validation-message">{errors.password}</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Confirm Password
                                    {errors.confirm_password && <span className="validation-message">{errors.confirm_password}</span>}
                                </label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="register-button">Register</button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
