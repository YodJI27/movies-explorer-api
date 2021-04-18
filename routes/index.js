const routers = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');

routers.use(userRouter);
routers.use(moviesRouter);

module.exports = routers;
