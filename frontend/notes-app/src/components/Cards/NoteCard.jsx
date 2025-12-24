import React, { useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import {
  MdOutlinePushPin,
  MdCreate,
  MdDelete,
  MdCalendarToday,
} from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags = [],
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  onDateChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    background: "#FFFFFF",
    primary: "#16A34A",
    accent: "#DCFCE7",
    highlight: "#B45309",
    text: "#1E293B",
  };

  const getFormattedDate = (dateValue) => {
  if (!dateValue) return "No Date";

  let momentObj;

  if (moment.isMoment(dateValue)) {
    momentObj = dateValue;
  } else if (typeof dateValue === "number" || !isNaN(Number(dateValue))) {
    const numValue = Number(dateValue);
    momentObj =
      numValue.toString().length > 10
        ? moment(numValue)
        : moment.unix(numValue);
  } else {
    momentObj = moment(dateValue, moment.ISO_8601, true).local();
  }

  if (momentObj && momentObj.isValid()) {
    momentObj = momentObj.local();
    return momentObj.format("Do MMM YYYY, h:mm A");
  }

  return "No Date";
};

const formattedDate = getFormattedDate(date);

const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  hover: {
    y: -5,
    boxShadow: "0 8px 20px rgba(22,163,74,0.15)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.98 },
};
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.15, transition: { type: "spring", stiffness: 400 } },
};

const truncateContent = (text, maxLength = 100) =>
  text?.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

return (
  <motion.div
    className="rounded-2xl overflow-hidden border shadow-sm"
    style={{
      background: colors.background,
      borderLeft: `5px solid ${colors.primary}`,
      color: colors.text,
    }}
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    whileTap="tap"
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    layout
  >
  <div className="p-4">
  <div className="flex items-start justify-between">
    <div>
      <h6 className="text-lg font-bold" style={{ color: colors.primary }}>
        {title}
      </h6>

      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
        <MdCalendarToday className="text-sm text-gray-400" />
        {formattedDate}
      </div>
    </div>

    <motion.button
      className={`p-2 rounded-full cursor-pointer ${
        isPinned
          ? "bg-green-100 text-green-600"
          : "text-gray-400 hover:text-green-600"
      }`}
      onClick={onPinNote}
      variants={buttonVariants}
      whileHover="hover"
    >
      <MdOutlinePushPin className="text-lg" />
    </motion.button>
  </div>

      <div className="my-3">
        <p className="text-sm leading-relaxed text-gray-700">
          {truncateContent(content, 100)}
        </p>
      </div>

      {/* Tags and Action Buttons Footer */}
      <div className="cursor-pointer flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                background: colors.accent,
                color: colors.primary,
                border: `1px solid ${colors.primary}20`, // 20 adds transparency to the hex code
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
<motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          <motion.button
            className="cursor-pointer p-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
            onClick={onEdit}
            variants={buttonVariants}
            whileHover="hover"
          >
            <MdCreate className="text-lg" />
          </motion.button>

          <motion.button
            className="cursor-pointer p-2 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
            onClick={onDelete}
            variants={buttonVariants}
            whileHover="hover"
          >
            <MdDelete className="text-lg" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  </motion.div>
);
};
       

export default NoteCard;