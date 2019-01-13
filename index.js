const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
let CleanCSS_INSTANCE;
let _UglifyJS_Options;
const base = path.dirname(require.main.filename);

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        simplyMinify('dist');
    } else {
        let p = args[0];
        if (!path.isAbsolute(p)) {
            p = path.join(base, p);
        }
        if (args.length > 1) {
            console.log('WARNING: Options are ignored in CLI mode!');
        }
        simplyMinify(p);
    }
} else {
    module.exports = simplyMinify;
}

function simplyMinify(dir = 'dist', CleanCSS_Options = {}, UglifyJS_Options = {}) {
    CleanCSS_INSTANCE = new CleanCSS(CleanCSS_Options);
    _UglifyJS_Options = UglifyJS_Options;
    _UglifyJS_Options['warnings'] = true;
    let finalDir;
    if (dir === 'dist' || !path.isAbsolute(dir)) {
        finalDir = path.join(base, dir);
    } else {
        finalDir = dir;
    }
    if (fs.existsSync(finalDir)) {
        findFiles(finalDir);
    } else {
        console.log('ERROR: Directory not found!');
    }
}

function findFiles(dir) {
    fs.readdirSync(dir).forEach(function (name) {
        const item = path.join(dir, name);
        const stat = fs.statSync(item);
        if (stat.isFile()) {
            if (item.match(/\.min\./)) {
            } else if (item.match(/\.css/)) {
                compileFile(item, 'css');
            } else if (item.match(/\.js/)) {
                compileFile(item, 'js');
            }
        } else if (stat.isDirectory()) {
            findFiles(item);
        }
    })
}

function compileFile(input, type) {
    const regex = new RegExp('\.' + type + '$', '');
    const output = input.replace(regex, '.min.' + type);
    const uncompressed = fs.readFileSync(input, 'utf8');
    let compressed = null;
    let result;
    switch (type) {
        case 'css':
            result = CleanCSS_INSTANCE.minify(uncompressed);
            if (result.warnings.length > 0) {
                let message = '\n';
                result.warnings.forEach(function (warning) {
                    message = message + warning.replace(/(?:\r\n|\r|\n)/g, '').replace(/ +(?= )/g, '') + '\n';
                });
                console.log('WARNINGS <' + path.basename(input) + '> : ' + message);
            }
            if (result.errors.length > 0) {
                let message = '';
                result.errors.forEach(function (error) {
                    message = message + error.replace(/(?:\r\n|\r|\n)/g, '').replace(/ +(?= )/g, '') + '\n';
                });
                console.log('ERROR <' + path.basename(input) + '> : ' + message);
            } else {
                compressed = result.styles;
            }
            break;
        case 'js':
            result = UglifyJS.minify(uncompressed, _UglifyJS_Options);
            if (result.warnings !== undefined && result.warnings.length > 0) {
                let message = '\n';
                result.warnings.forEach(function (warning) {
                    message = message + warning.replace(/(?:\r\n|\r|\n)/g, '').replace(/ +(?= )/g, '') + '\n';
                });
                console.log('WARNINGS <' + path.basename(input) + '> : ' + message);
            }
            if (result.error) {
                console.log('ERROR <' + path.basename(input) + '> : ' + result.error.message.replace(/(?:\r\n|\r|\n)/g, '').replace(/ +(?= )/g, ''));
            } else {
                compressed = result.code;
            }
            break;
        default:
            return;
    }
    if (compressed !== null) {
        fs.writeFileSync(output, compressed);
        console.log('Minified: ', path.basename(input), '->', path.basename(output));
    }
}
