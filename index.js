
// serve-handler serves static assets
const staticHandler = require('serve-handler');

// serve static files like index.html and favicon.ico from public/ directory
async function serveStatic(req, res) {
  await staticHandler(req, res, {
    public: './',
  });
}

module.exports = (req, res) => {
  serveStatic(req, res)
}
