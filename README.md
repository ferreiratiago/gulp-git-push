gulp-git-push
================

Pushes **local changes** to remote repository.

Usage
-----------------------
```js
var gulp = require('gulp');
var tag  = require('gulp-tag-version');
var push = require('gulp-git-push');

gulp.task('push', function() {
  return gulp.src('./package.json')
      .pipe(tag())   // changes package.json version
      .pipe(push({   // pushes changes (i.e. package.json)
            repository: 'origin',
            refspec: 'HEAD',
            options: { args: '--follow-tags' }
      }));  
});
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
