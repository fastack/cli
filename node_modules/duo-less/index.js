// dependencies
var debug = require("debug")("duo-less");
var extend = require("extend");
var less = require("less");
var util = require("util");


/**
 * Returns a duo plugin function to preprocess LESS files
 *
 * @param {Object} [opts]
 * @returns {Function}
 */
module.exports = function (opts) {
    return function duoless(file, duo, done) {
        if (file.type !== "less") return done();

        debug("compiling %s to css", file.id);

        var options = extend({ filename: file.path }, opts);

        less.render(file.src, options, function (err, css) {
            if (err) {
                debug("error: %s", consoleError(err));
                done(duoError(err));
            } else {
                file.src = css;
                file.type = "css";

                done(null, file);
            }
        });
    };
};

/**
 * Generates an error to be rendered to the console
 *
 * @param {Error} err
 * @returns {String}
 */
function consoleError(err) {
    var msg = err.message;
    if (err.extract && err.extract.length) {
        msg += "\n" + err.extract.map(function (line, x) {
            return util.format("%s: %s", x, line);
        }).join("\n");
    }
    return msg;
}

/**
 * Modifies the Error object before passing back to Duo
 *
 * @param {Error} err
 * @returns {Error}
 */
function duoError(err) {
    err.message = util.format("%s :: %s", err.message, err.filename);
    return err;
}
