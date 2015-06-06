var assert = require("assert");
var Duo = require("duo");
var less = require("../");
var path = require("path");
var read = require("fs").readFileSync;

var fixture = path.join.bind(path, __dirname, "fixtures");

describe("duo-less", function () {
    it("should be a function", function () {
        assert.equal(typeof less, "function");
    });

    it("should return a function", function () {
        assert.equal(typeof less(), "function");
    });

    it("should render LESS into CSS", function (done) {
        var root = fixture();

        var duo = new Duo(root)
            .entry("example.less")
            .use(less());

        duo.run(function (err, file) {
            if (err) return done(err);
            assert.equal(file, read(fixture("example.css"), "utf8"));
            done();
        });
    });

    it("should ignore any file that's not .less", function (done) {
        var root = fixture();

        var duo = new Duo(root)
            .entry("example.css")
            .use(less());

        duo.run(function (err, file) {
            if (err) return done(err);
            assert.equal(file, read(fixture("example.css"), "utf8"));
            done();
        });
    });
});
