import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const Tag = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-full shadow-sm"
            >
              #{tag}
              <button
                className="hover:text-[#B45309] transition-colors"
                onClick={() => handleRemoveTag(tag)}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm border border-[#16A34A]/40 px-3 py-2 rounded outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/30 transition-all duration-200 bg-[#FFFFFF] placeholder:text-[#94A3B8]"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-[#16A34A] hover:bg-[#16A34A] group transition-all duration-200 shadow-sm"
          onClick={() => addNewTag()}
        >
          <MdAdd className="cursor-pointer text-2xl text-[#16A34A] hover:text-white transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
 
};

export default Tag;