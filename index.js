var map = require('map-stream');
var gutil = require('gulp-util');
var git = require('gulp-git');
var objectAssign = require('object-assign');

/**
 * @param options {object} Module options
 * @param options.repository {string?} The 'remote' repository for push operation, default: 'origin'
 * @param options.refspec {string?} Specify what destination ref to update with what source object, default: 'HEAD'
 * @param options.options {object?} Gulp-git options, default: '{ args: '--follow-tags' }'
 */
module.exports = function (options) {
    'use strict';
    var opt = {
        repository: 'origin',
        refspec: 'HEAD',
        options: { args: '--follow-tags' }
    };

    objectAssign(opt, options);

    function modifyContents(file, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new Error('Streams not supported'), file);
        }

        git.push(opt.repository, opt.refspec, opt.options, function endHandler(error) {
            if (error) {
                return cb(new Error(error), file);
            }
            gutil.log(gutil.colors.green('Changes pushed to remote'));

            return cb(null, file);
        });
    }

    return map(modifyContents);
};
