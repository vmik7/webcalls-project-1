1. GULP_FONTER BUG:

node_modules/gulp-fonter/dist/index.js
replace: 
    newFont.path = source.dirname + '\\' + source.stem + '.' + type;
into: 
    newFont.path = source.dirname + '/' + source.stem + '.' + type;