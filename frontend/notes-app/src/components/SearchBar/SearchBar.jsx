import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-[#DCFCE7]/70 rounded-md shadow-sm border border-[#16A34A]/30 focus-within:border-[#16A34A] transition-all duration-200 hover:cursor-pointer">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-sm bg-transparent py-[11px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-lg text-[#B45309] hover:text-[#16A34A] cursor-pointer transition-colors duration-200"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="ml-2 text-[#16A34A] hover:text-[#B45309] cursor-pointer transition-colors duration-200"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;