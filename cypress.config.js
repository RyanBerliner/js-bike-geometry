const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
