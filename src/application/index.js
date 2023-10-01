/**
 * Module for starting up and configuring the application.
 * @module ApplicationStartup
 */
const application = require('./app');
const middlewares = require('./middlewares');
const router = require('../services/router');

/**
 * Configures and starts up the application.
 * @param {string} env - The environment in which the application is running.
 * @returns {Object} The configured Express application instance.
 */
function startUp(env=process.env.NODE_ENV) {
    console.debug('[Environment]', env);
    const app = application;
    
    // Global Middlewares
    app.use(middlewares.inspector);
    app.use("/", router);
    app.use(middlewares.cannotGet);
    app.use(middlewares.errorHandler);
    return app;
}
/**
 * Exports the function for configuring and starting up the application.
 * @type {Object}
 */
module.exports = {
    startUp
};
