/**
 * Module to push middlewares extensions to an Express application.
 * @module MiddlewareConfiguration
*/

const boolean = require("../utils/parse/boolean");
const build_in = require("./features/build_in");
// The locals, arent a middleware
const { locals } = require('./features/build_in/_locals');
const homebrew = require('./features/homebrew');


const router = require('../../services/router');


/**
 * Sets middleware extensions based on configuration options.
 * @param {Express instance} application 
 */
function setupPosibleExpressMiddlewares(application, middlewares = build_in) {
    // Incase that you need pass a specific middlewares additional by default
    if (boolean(process.env.BUILD_IN_FEATURES))
        middlewares = { ...build_in, ...middlewares };

    console.debug("[middlewares to load]", middlewares);
    for (const setting in middlewares) {
        if (middlewares[setting] == undefined)
            continue;
        console.debug('[loading middleware]', setting, middlewares[setting]);
        if (setting == "_static") {
            setupStaticFeature(application);
        }
        application.use(middlewares[setting]);
    }
    return application;
}


function setupStaticFeature(application) {
    if (!build_in._static)
        return;
    // policy at load _static feature
    // Custom path:
    let defaultPath = '/static/';
    let customPath = process.env?.STATIC_PATH || defaultPath;
    console.debug("[_static middleware path]", customPath);
    application.use(customPath, build_in._static);
}

/**
 * Function thats set locals variables in express application
 * @param {Express instance} application
 */
function setupExpressLocals(application) {
    if (boolean(process.env.LOCAL_VARS))
        application.locals = locals;
}

/**
 * Function thats dissable x-powered-by header
 * @param {Express instance} application
 * @returns 
 */
function setupExpressPoweredby(application) {
    // Disable 'x-powered-by' header for security, if you know that is 
    // Express you know that's machine.
    if (boolean(process.env.DISSABLE_POWERED_BY)) {
        application.disable('x-powered-by');
        return application;
    }

}

/**
 * Fuction thats set inspector middleware
 * @param {Express instance} application
 */
function setupInspector(application) {
    if (boolean(process.env.INSPECTOR))
        application.use(homebrew.middlewares.inspector);
    return application;
}

/**
 * Function thats setup Service Router into application
 * @param {Express instance} application
 */
function setupRouter(application) {
    application.use("/", router);
    return application;
}

/**
 * Function thats setup Http Error handling
 * @param {Express instance} application
 */
function setupErrorHanding(application) {
    if (boolean(process.env.ERRORS_HANDLERS)) {
        application.use(homebrew.middlewares.cannotGet);
        application.use(homebrew.middlewares.errorHandler);
    }
}



/**
 * @function setup
 * @description Builder of all settings to make express app
 * @param {Express instance} application
 * @param {Object} settings - Express middleware object collection as value
 * @returns {Object} The modified Express application with middleware extensions.
 */
function setup(application) {
    setupPosibleExpressMiddlewares(application);
    setupExpressLocals(application);
    setupExpressPoweredby(application);
    setupInspector(application);
    setupRouter(application);
    setupErrorHanding(application);
    return application;
}

module.exports = setup;