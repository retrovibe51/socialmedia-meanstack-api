const jwt = require("jsonwebtoken");

//const secret = 'yvgh#@#5523284vuhb3%&32483yvubiunnic9grhbiebk';

module.exports = (req, res, next) => {
    try {
        // Below, authorization is the header we are setting in frontend (it is case-insensitive hence lowercase a here)
        const token = req.headers.authorization.split(" ")[1];  // if authorization header is absent, split will give error which will be caught in the catch block
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) // thows error if verification fails, which will be caught in catch block
        
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };  // adding to the request object
        
        next();
    }
    catch (error) {
        res.status(401).json({ message: "You are not authenticated!" });
    }
};