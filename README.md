gulp-git-push
================

Pushes **all committed changes** to a remote repository.

It will push all committed changes (you can use [`git.commit`](https://github.com/stevelacy/gulp-git#gitcommitmessage-opt) from [`gulp-git`](https://www.npmjs.com/package/gulp-git) for that) to the specified repository.

> [Why use `gulp-git-push`?](https://medium.com/@ferreiratiago/its-been-a-while-since-we-started-to-move-our-build-system-from-grunt-to-gulp-7571a6a2991#.lp48nflml)

Usage
-----------------------

### Simple gulpfile
```js
var gulp = require('gulp');
var bump = require('gulp-bump');
var git  = require('gulp-git');
var push = require('gulp-git-push');

gulp.task('bump', function() {
  return gulp.src('./package.json')
        // bump package.json version
        .pipe(bump({type: 'patch'}))
        // save bumped file into filesystem
        .pipe(gulp.dest('./'))
        // commit changes
        .pipe(git.commit('bump version'))
        // push local changes to repository
        .pipe(push({                      
            repository: 'origin',
            refspec: 'HEAD'
        }));
});
```

### Complex gulpfile
```js
var gulp = require('gulp');
var bump = require('gulp-bump');
var git  = require('gulp-git');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var exec = require('child_process').exec;
var argv = require('yargs')
    .option('type', {
        alias: 't',
        choices: ['patch', 'minor', 'major']
    }).argv;
var tag = require('gulp-tag-version');
var push = require('gulp-git-push');

/**
 *  Bumping and tagging version, and pushing changes to repository.
 *
 *  You can use the following commands:
 *      gulp release --type=patch   # makes: v1.0.0 → v1.0.1
 *      gulp release --type=minor   # makes: v1.0.0 → v1.1.0
 *      gulp release --type=major   # makes: v1.0.0 → v2.0.0
 *
 *  Please read http://semver.org/ to understand which type to use.
 *
 *  The 'gulp release' task is an example of a release task for a NPM package.
 *  This task will run 'publish' as a dependent and 'bump'.
 **/

gulp.task('bump', function() {
  return gulp.src(['./package.json', './bower.json'])
        // bump package.json and bowser.json version
        .pipe(bump({
            type: argv.type || 'patch'
        }))
        // save the bumped files into filesystem
        .pipe(gulp.dest('./'))
        // commit the changed files
        .pipe(git.commit('bump version'))
        // filter one file
        .pipe(filter('package.json'))
        // create tag based on the filtered file
        .pipe(tag())
        // push changes into repository
        .pipe(push({                      
            repository: 'origin',
            refspec: 'HEAD'
        }))
});

gulp.task('publish', ['bump'], function (done) {
    // run npm publish terminal command
    exec('npm publish',
        function (error, stdout, stderr) {
            if (stderr) {
                gutil.log(gutil.colors.red(stderr));
            } else if (stdout) {
                gutil.log(gutil.colors.green(stdout));
            }
            // execute callback when its done
            if (done) {
                done();
            }
        }
    );
});

gulp.task('release', ['publish'], function () {});
```

Arguments
-----------------------
#### repository
**Type:** `String`

**Default:** `origin`

The 'remote' repository for push operation.

#### refspec
**Type:** `String`

**Default:** `HEAD`

Specify what destination ref to update with what source object.

#### options
**Type:** `object`

**Default:** `{ args: '--follow-tags' }`

[Gulp-git options](https://github.com/stevelacy/gulp-git#gitpushremote-branch-opt-cb).


Thanks :beer:
--------

* this gulp plugin is based on [gulp-tag-version](https://github.com/ikari-pl/gulp-tag-version) by [ikari-pl](https://github.com/ikari-pl)
* [@stevelacy](https://twitter.com/stevedelacy) by [gulp-bump](https://www.npmjs.com/package/gulp-bump) and [gulp-git](https://www.npmjs.com/package/gulp-git)
