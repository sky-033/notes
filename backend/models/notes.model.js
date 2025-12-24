import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],        // ✅ FIX
            default: [],
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // ✅ FIX
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // ✅ replaces createdOn
    }
);

export default mongoose.model("Note", noteSchema);
