module.exports = function (eleventyConfig) {
  console.log(process.env.URL_BASE_DOC)

  // Return your Object options:
  eleventyConfig.addPassthroughCopy("docs/public");

  return {
    pathPrefix: "myprefix",
    dir: {
      input: "docs",
      output: "docs/_site",
      includes: "_includes",
    },
  };
};
