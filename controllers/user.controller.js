const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

//const secret = 'yvgh#@#5523284vuhb3%&32483yvubiunnic9grhbiebk';

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            
            const user = new User({
                email: req.body.email,
                password: hash
            });
            
            user.save()
            .then((result) => {
                res.status(201).json({
                    message: "User created",
                    result: result
                });
            })
            .catch((err) => {
                res.status(500).json({                    
                    message: "User already exists!"                    
                });
            });
        
        });
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then((user) => {        
        if(!user) {
            return res.status(401).json({
                message: "Auth failed: User not found"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then((result) => {
        
        if(!result) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({
            token: token,
            expiresIn: 3600,   // 3600 seconds
            userId: fetchedUser._id
        });

    }).catch((err) => {
        return res.status(401).json({
            message: "Login failed: Invalid authentication credentials"
        });
    });
}
