System.config({
  defaultJSExtensions: false,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": ".fastack/jspm_packages/github/*",
    "npm:*": ".fastack/jspm_packages/npm/*"
  }
});
