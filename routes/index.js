// const passport = require('passport');
const express = require('express')
const authRouter = require('./auth');
const monitorRouter = require('./monitor');
const profileRouter = require('./profile');
const phoneRouter = require('./phone_verification');

module.exports = function(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/phone_verify', phoneRouter);
  app.use('/assets/portfolio', express.static(__dirname + '/../assets/portfolio'));
  // TODO -- use this middleware for authentication
  // passport.authenticate('jwt', { session: false })
};
