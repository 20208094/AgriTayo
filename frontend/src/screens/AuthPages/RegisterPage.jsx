import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                setErrors((prev) => ({ ...prev, middlename: "" }));
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
        <div className="fixed inset-0" style={{ background: 'linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147))' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full lg:h-auto lg:max-w-6xl lg:mx-4 bg-white lg:rounded-2xl shadow-xl flex flex-col lg:flex-row">
                    {/* Logo Section */}
                    <div className="lg:w-1/2 bg-orange-100 hidden lg:flex lg:items-center lg:justify-center lg:rounded-l-2xl">
                        <img 
                            src="/AgriTayo_Logo.svg" 
                            alt="AgriTayo Logo" 
                            className="max-w-md w-full object-contain p-8"
                        />
                    </div>

                    {/* Form Section */}
                    <div className="lg:w-1/2 p-6 lg:p-8 h-full lg:h-[800px] overflow-y-auto">
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-bold text-green-700">Register Account</h1>
                            <p className="text-gray-600 mt-2">Join our farming community today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="firstname"
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                                                errors.firstname ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                            value={formData.firstname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.firstname && (
                                        <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>
                                    )}
                                </div>

                                {/* Middle Name */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Middle Name (Optional)
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="middlename"
                                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                            value={formData.middlename}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.middlename && (
                                        <p className="mt-1 text-sm text-red-500">{errors.middlename}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="lastname"
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                                                errors.lastname ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.lastname && (
                                        <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>
                                    )}
                                </div>

                                {/* Birthday */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Birthday
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="date"
                                            name="birthday"
                                            max={calculateMaxDate()}
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                                                errors.birthday ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.birthday}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.birthday && (
                                        <p className="mt-1 text-sm text-red-500">{errors.birthday}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="phone_number"
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                                                errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.phone_number && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
                                    )}
                                </div>

                                {/* Secondary Phone Number */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Alternative Phone Number
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="secondary_phone_number"
                                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                                                errors.secondary_phone_number ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.secondary_phone_number}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.secondary_phone_number && (
                                        <p className="mt-1 text-sm text-red-500">{errors.secondary_phone_number}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="relative col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="relative col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm_password"
                                            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                                                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-green-500`}
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirm_password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium
                                        hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                                        focus:ring-offset-2 transform transition-all duration-200 
                                        hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Register'
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium
                                        hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 
                                        focus:ring-offset-2 transform transition-all duration-200 
                                        hover:scale-[1.02]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
