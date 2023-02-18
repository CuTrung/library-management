import jwt, { TokenExpiredError } from 'jsonwebtoken';

const createToken = (data, expiresIn) => {
    let token;
    try {
        token = jwt.sign(data, process.env.SECRET_KEY, { noTimestamp: true, expiresIn });
    } catch (error) {
        console.log(error)
    }
    return token;
}

const verifyToken = (token) => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.log(error)
        if (error instanceof TokenExpiredError) {
            decoded = error
        }
    }
    return decoded;
}


export default {
    createToken, verifyToken,
}