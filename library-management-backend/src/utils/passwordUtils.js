import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const hashPassword = (password) => {
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    return `${hashPassword}${SECRET_KEY}${password}`
}


const checkHashPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}


export default {
    hashPassword, checkHashPassword
}