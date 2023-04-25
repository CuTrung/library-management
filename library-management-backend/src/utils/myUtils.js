const logData = (data) => {
    if (!Array.isArray(data)) {
        console.log(">>> Check data", data);
    } else {
        for (const item of data) {
            console.log(">>> Check item data", item);
        }
    }

    return;
}

const dateFormat = (dateObj) => {
    let newDate = new Date(dateObj).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).slice(0, 20).replace(" ", "").split(",");

    return {
        date: newDate[0],
        time: newDate[1]
    }
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '/');
}

const conditionForSequelize = (operator, dataOperator) => {
    operator = operator.toLowerCase();
    return {
        operator,
        dataOperator
    }
}

const upperCaseFirstChar = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.toLowerCase().slice(1) : str;
}

import nodemailer from "nodemailer";

const sendEmail = (toEmail, title, content, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USED_TO_RESET_PASSWORD,
            pass: process.env.PASSWORD_EMAIL_USED_TO_RESET_PASSWORD
        }
    });

    const mailOptions = {
        from: 'meo28092003@gmail.com',
        to: toEmail,
        subject: title,
        text: content,
        html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return getFormattedDate(result);
}


export {
    logData, dateFormat, getCurrentDate, conditionForSequelize, sendEmail,
    upperCaseFirstChar, addDays, getFormattedDate
}