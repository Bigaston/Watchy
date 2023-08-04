module.exports = function (eleventyConfig) {
  console.log(process.env.URL_BASE_DOC)

  // Return your Object options:
  eleventyConfig.addPassthroughCopy("docs/public");

  // Configure eleventy to use njk for html templates


  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: "docs",
      output: "docs/_site",
      includes: "_includes",
    },
  };
};
