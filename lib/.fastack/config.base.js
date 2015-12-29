System.config({
  defaultJSExtensions: true,
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
