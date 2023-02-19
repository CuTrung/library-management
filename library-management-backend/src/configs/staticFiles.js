import express from 'express';

const staticFiles = (app) => {
    app.use(express.static('public'));
}

export default staticFiles;