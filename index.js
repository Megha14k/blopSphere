const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "apnacollege",
        content: "I love coding",
        
    },
    {
        id: uuidv4(),
        username: "Megha kaundal",
        content: "Hard work is important to achieve success",
        
    },
    {
        id: uuidv4(),
        username: "Rahul kumar",
        content: "I got selected for my 1st internship",
     
    }
];

// Show all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

// Show form to create a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Handle new post with image upload
app.post("/posts", upload.single("image"), (req, res) => {
    let { username,topic , content } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : "default.png";
    let newPost = { id: uuidv4(), username, content, image };
    posts.push(newPost);
    res.redirect("/posts");
});

// Show individual post
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("show.ejs", { post });
});

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("edit.ejs", { post });
});

// Update post content
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => p.id === id);
    if (post) {
        post.content = newContent;
    }
    res.redirect("/posts");
});

// Delete post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/posts");
});

app.get("/posts/:id/upload", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("upload.ejs", { post });
});

app.post("/posts/:id/upload", upload.single("image"), (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    // Save the new image URL
    post.image = `/uploads/${req.file.filename}`;
    console.log("Updated post:", post);

    res.redirect("/posts");
});


app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
