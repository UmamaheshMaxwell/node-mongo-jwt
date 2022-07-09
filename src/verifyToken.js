import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY
    const token = req.headers.authorization
    if (!token) {
        res.status(401).send({authentication: "failed", message: "No Token Provided"}) // Access Denied
    }
    jwt.verify(req.headers.authorization, jwtSecretKey, (err, isVerified) => {
        if(err) {
             res.status(500).send({ 
                authentication: "failed", 
                message: 'Failed to authenticate token.' });
        }

        req.user = isVerified
        next()
    });
}
