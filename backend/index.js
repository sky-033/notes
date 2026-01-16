import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import connectDB from './database/db.js';
import User from './models/user.model.js';
import Note from './models/notes.model.js';
import authenticateToken from './utilities.js';
dotenv.config();

const app=express();

//middlewares
app.use(express.json());

const allowedOrigins=["http://localhost:5173","https://notes-jmulnyunx-sujals-projects-5583469b.vercel.app"];
app.use(
    cors({
        origin:allowedOrigins,
        credentials:true
    })
);
//database


//Home route
app.get("/",(req,res)=>{
    res.send({data:"hello"});
});

app.post("/create-account",async(req,res)=>{
    const{fullName,email,password}=req.body

    if(!fullName || !email || ! password){
        return res.status(400).json({errors:true,message:"All fields are required"});

    }
    try {
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });
        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user =new User({
            fullName,
            email:email.toLowerCase().trim(),
            password: hashedPassword,
        });
        await user.save();

        const accessToken = jwt.sign(
            { userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600m" }
        );

        res.status(201).json({
            error: false,
            message: "Account created successfully",
            accessToken,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Email and password are required",
        });
    }

    try {
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: "Invalid email or password",
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600m" }
        );

        res.json({
            error: false,
            message: "Login successful",
            accessToken,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});

app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);


        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized",
            });
        }

        
        return res.json({
            user:{
                fullName:user.fullName,
                email:user.email,
                _id:user._id,
                createdOn:user.createdOn,
            },
            message:"",
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content,tags } = req.body;
    const userId=req.user.userId;
    if (!title || !content) {
        return res.status(400).json({
            error: true,
            message: "Title and content are required",
        });
    }

    try {
        const note = new Note({
            title,
            content,
            tags : tags||[],
            userId
        });
        await note.save();

        res.status(201).json({
            error: false,
            message: "Note added successfully",
            note,
        });
    } catch (error) {
        console.error("ADD NOTE ERROR:", error);
        res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned } = req.body;
    const noteId = req.params.noteId;   // ✅ FIXED
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId,
        });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found",
            });
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (typeof isPinned === "boolean") note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});


app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId })

            .sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message:"All notes retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});


app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId
;
    const userId=req.user.userId;
    try {
        const note = await Note.findOneAndDelete({
            _id: noteId,
            userId
        });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found",
            });
        }

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const  noteId  = req.params.noteId;
    const { isPinned } = req.body;
    const userId=req.user.userId;


    try {
        const note = await Note.findOne(
            { _id: noteId, userId},
        );

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found",
            });
        }
        note.isPinned=!!isPinned;
        await note.save();
        return res.json({
            error: false,
            message: "Note pin status updated",
            note,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const userId=req.user.userId;
    if (!query ) {
        return res.status(400).json({
            error: true,
            message: "Search query is required",
        });
    }

    try {
        const notes = await Note.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } },   // case-insensitive search
                { content: { $regex: query, $options: "i" } }
            ]
        });

        return res.json({
            error: false,
            notes,
            message:"Matching notes found"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
});


//start server
const PORT=process.env.PORT || 8000;
connectDB().then(()=>{
    app.listen(PORT,()=> console.log(`Server is running on http://localhost:${PORT}`));

})

export default app;
