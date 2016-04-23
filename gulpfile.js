var gulp = require('gulp');
var initGulpTasks = require('react-component-gulp-tasks');

/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */
gulp.task('apply-prod-environment', function() {
	process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
	process.env.NODE_ENV = 'production';
	if (process.env.NODE_ENV != 'production') {
		throw new Error("Failed to set NODE_ENV to production!!!!");
	} else {
		process.stdout.write("Successfully set NODE_ENV to production" + "\n");
		console.log('NODE_ENV : ' + process.env.NODE_ENV);
	}
});

var taskConfig = {

	component: {
		name: 'Designer',
		dependencies: [
			'classnames',
			'react',
			'react-dom'
		],
		lib: 'lib'
	},

	example: {
		src: 'example/src',
		dist: 'example/dist',
		port: 8400,
		files: [
			'index.html',
			'.gitignore'
		],
		scripts: [
			'example.js'
		],
		less: [
			'example.less'
		]
	}

};

initGulpTasks(gulp, taskConfig);
