import React, { useState } from "react";
import Navbar from "../../components/Navbar/NavBar.jsx";
import Password from "../../components/Input/Password.jsx";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosinstance.js";
import LeafNote from "./LeafNote.png";
const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      

      const response=await axiosInstance.post("https://notes-gcjt.onrender.com/create-account", {
        fullName,
        email,
        password,
        profileImageUrl:""
      });

      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (err) {
      if(err.response?.data?.message){
        setError(err.response.data.message);
      }
      else{
        setError("Something went wrong")
      }
    } finally {
      setIsLoading(false);
    }
  };

 return (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar />

    <div className="flex flex-grow overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16 bg-[#DCFCE7]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="text-center mb-8">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
                  Sign Up
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Create your account to get started
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-20 transition-all duration-200"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    aria-label="Full Name"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-20 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                </div>

                <div>
                  <Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                  </div>
              )}

              <button type="submit" disabled={isLoading} className="cursor-pointer w-full bg-[#16A34A] text-white py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#15803D] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-[1.01] flex items-center justify-center ">

                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account... 
                  </span>
                  ) : (
                    "Sign Up"
                  )}
              </button>

             <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer font-semibold text-[#16A34A] hover:text-[#15803D] transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Login here
                </Link>
              </p>
             </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
        src={LeafNote}
        alt="Login illustration"
        className="absolute inset-0 w-full h-full object-cover object-center"
        />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
      </div>
    </div>

  </div>
    );
  };

export default SignUp;
