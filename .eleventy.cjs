module.exports = function (eleventyConfig) {
  // Return your Object options:
  eleventyConfig.addPassthroughCopy("docs/public");

  return {
    dir: {
      input: "docs",
      output: "docs/_site",
      includes: "_includes",
    },
    pathPrefix: process.env.URL_BASE_DOC || "",
  };
};
