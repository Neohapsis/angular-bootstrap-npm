/**
 * Created by jopitz on 12/15/2014.
 */

var gulp = require( 'gulp' ),
rimraf   = require( 'gulp-rimraf' ),
exec     = require( 'gulp-exec' ),
insert   = require( 'gulp-insert' ),
seq      = require( 'run-sequence' ),
rename   = require( 'gulp-rename' ),
argv     = require( 'yargs' ).argv,

_comma   = 'commafix: tired of the hassle of remembering to add/remove a comma for the last var'

///////////////////////
//	TASKS
///////////////////////

gulp.task( 'init', function()
{
	return gulp.src( [ './dist' ], { read: false } )
		.pipe( rimraf( { force: true } ) );
} )

gulp.task( 'build-bootstrap', function()
{
	var ver = argv.ver ? '#' + argv.ver : '';
	console.log( 'version: ', ver || 'latest' )

	return gulp.src( '' )
		.pipe( exec( 'napa angular-ui/bootstrap' + ver + ':_tmp && ' +  //use napa to pull from git and store into our app, we could bypass napa and just go git
					 'cd ./node_modules/_tmp && ' +
					 'npm install && ' + //install deps to build the distros
					 'grunt after-test' ) ) //skipping full test suite since we assume they don't publish broken builds (or do they DUH DUH DUHHHHHH)
} )

gulp.task( 'package', function()
{
	return gulp.src( [ './node_modules/_tmp/dist/ui-bootstrap-tpls-*.js' ] )
		.pipe( insert.append( 'module.exports = {};' ) ) //just making this compatible with common-js packages for use w/ browserify
		.pipe( gulp.dest( './tmp' ) )
} )

gulp.task( 'rename', function()
{
	gulp.src( './tmp/*.min.js' )
		.pipe( rename( 'angular-bootstrap.min.js' ) )
		.pipe( gulp.dest( './dist' ) )

	return gulp.src( [ './tmp/*.js', '!./tmp/*.min.js' ] )
		.pipe( rename( 'angular-bootstrap.js' ) )
		.pipe( gulp.dest( './dist' ) )
} )

gulp.task( 'clean', function()
{
	return gulp.src( [ './tmp', './node_modules/_tmp' ], { read: false } )
		.pipe( rimraf( { force: true } ) );
} )

///////////////////////
//	DEFAULT
///////////////////////

gulp.task( 'default', function() { seq( 'init', 'build-bootstrap', 'package', 'rename', 'clean' ); } )