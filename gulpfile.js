var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag = require('gulp-tag-version');
var push = require('./index.js');

var argv = require('yargs')
    .option('type', {
        alias: 't',
        choices: ['patch', 'minor', 'major']
    }).argv;

var options = {
    dest: './',
    versionToBump: './package.json',
    versionToTag: 'package.json',
    bumpType: 'patch',
    commitMessage: 'bump package version'
}

/**
 * Bumping version number.
 * Please read http://semver.org/
 *
 * You can use the commands
 *     gulp release --type=patch    # makes v0.1.0 → v0.1.1
 *     gulp release --type=minor    # makes v0.1.1 → v0.2.0
 *     gulp release --type=major    # makes v0.2.1 → v1.0.0
 */
gulp.task('release', function () {
    return gulp.src(options.versionToBump)
        .pipe(bump({type: argv.type || options.bumpType}))
        .pipe(gulp.dest(options.dest))
        .pipe(git.commit(options.commitMessage))
        .pipe(filter(options.versionToTag))
        .pipe(tag())
        .pipe(push());
});
