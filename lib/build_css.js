'use strict'

const join = require('path').join
const readFileSync = require('fs').readFileSync
const dirname = require('path').dirname

/*
 * Builds the CSS files.
 *
 * - `compress` (Boolean) - compresses if true
 */

module.exports = function buildCss (options, done) {
  buildSass(join(__dirname, '../css/docpress.scss'), options, done)
}

function buildSass (filepath, options, done) {
  try {
    const sass = require('node-sass')
    const globImporter = require('node-sass-glob-importer');

    const postcss = require('postcss')
    const autoprefixer = require('autoprefixer')({})
    const inline = require('postcss-import');
    const csso = require('postcss-csso');

    let result = sass.renderSync({
      importer: globImporter(),
      file: filepath
    });

    let postcss_plugins = [inline, autoprefixer];
    if (options && options.compress) {
      postcss_plugins.push(csso);
    }

    postcss(postcss_plugins)
      .process(result.css, {
        from: 'assets/style.css'
      })                                                      
      .then(function (result) {
        done(null, result.css);
      }).catch(function (err) {
        done(err);
      });
  } catch (err) {
    done(err)
  }
}
