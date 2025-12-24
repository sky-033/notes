import React from "react";
import { getInitials } from "../../utils/helper.js";

const Profile = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-[#DCFCE7]">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-[#16A34A] font-semibold bg-[#DCFCE7]">
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium text-[#1E293B]">
          {userInfo?.fullName}
        </p>
        <button
          className="text-sm text-[#B45309] hover:underline hover:text-[#16A34A] transition-colors duration-200 cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;