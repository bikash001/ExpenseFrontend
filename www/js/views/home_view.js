define(['underscore', 'backbone', 'jquery', "text!templates/home_template.html"],
	function(_, Backbone, $, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			events: {

			},
			initialize: function() {
				this.already_logged = true;
				this.render();
			},
			render: function() {
				// if (this.already_logged) {
					this.$el.html(this.template());
					$('#middle-section').empty();
					$("#middle-section").append(this.$el);
					console.log('hell inside');
				// } else {
				// 	window.Router.route()
				// }
				return this;
			}
		});
		console.log("home");
		return HomeView;
	}
);