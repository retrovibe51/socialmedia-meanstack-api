const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/post-routes");
const userRoutes = require("./routes/user-routes");


const app = express();

// MongoDB Atlas connection (MongoDB on cloud)
mongoose.connect("mongodb+srv://chuck:" + process.env.MONGO_ATLAS_PWD + "@cluster0.kqa4c.mongodb.net/socialMediaDatabase?retryWrites=true&w=majority",{ 
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.log('Connecttion to MongoDB failed');
    });

app.use(bodyParser.json()); // check the line of code missing after this line, as shown in course code
app.use("/imagesForStorage", express.static(path.join("imagesForStorage")));   // to grant access to (& applies only to) any request accessing "/imagesForStorage" path


// BOC - CORS MIDDLEWARE
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
})
// EOC - CORS MIDDLEWARE

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;