import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Password = ({ value, onChange, placeholder = "Password" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center border border-[#16A34A]/40 px-4 py-2 rounded-md focus-within:border-[#16A34A] transition-all duration-200 mb-3 bg-[#FFFFFF] shadow-sm">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="ml-2 focus:outline-none"
        aria-label={isShowPassword ? "Hide password" : "Show password"}
      >
        {isShowPassword ? (
          <FaRegEye
            className="text-[#B45309] hover:text-[#16A34A] transition-colors duration-200 cursor-pointer"
            size={20}
          />
        ) : (
          <FaRegEyeSlash
            className="text-[#16A34A] hover:text-[#B45309] transition-colors duration-200"
            size={20}
          />
        )}
      </button>
    </div>
  );
};

export default Password;