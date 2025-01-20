const jwt=require('jsonwebtoken');
require('dotenv').config();
const secretKey=process.env.JWT_SECRET;

function setUser(user){
    const payload = { _id:user._id, username: user.username };
    const options = { expiresIn: '1h' }; 
return jwt.sign(payload,secretKey,options);
}
function getUser(token){
    if(!token) return null
    return jwt.verify(token,secretKey)
}

module.exports={
    setUser,
    getUser
}