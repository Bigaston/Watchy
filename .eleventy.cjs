module.exports = function (eleventyConfig) {
  // Return your Object options:
  eleventyConfig.addPassthroughCopy("docs/public");

  eleventyConfig.addPlugin(UrlPlugin, { base: process.env.URL_BASE_DOC || "" });

  return {
    dir: {
      input: "docs",
      output: "docs/_site",
      includes: "_includes",
    },
  };
};

function UrlPlugin(eleventyConfig = {}, pluginConfig = {}) {
  eleventyConfig.addFilter(
    "absoluteUrl",
    function (url = "", base = pluginConfig.base) {
      try {
        return base + url;
      } catch (err) {
        console.error(err);
        return url;
      }
    }
  );
}
