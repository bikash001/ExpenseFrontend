require.config({
	baseUrl:'js',
	paths: {
		app: './app',
		lib: './lib',
		jquery: './lib/jquery-3.1.1',
		bootstrap: './lib/bootstrap.min',
		underscore: './lib/underscore',
		backbone: './lib/backbone',
		text: './lib/text'
	},
	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		bootstrap: {
			deps: ["jquery"]
		}
	}
});

require(['backbone', './main'],
	function(Backbone, Router) {
		$(function() {
			var router = new Router();
			// window.router = router;
			Backbone.history.start();
			// router.navigate("/");
		});
	}
);