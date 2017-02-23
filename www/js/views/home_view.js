define(['underscore', 'backbone', 'jquery', "text!templates/home_template.html"],
	function(_, Backbone, $, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			events: {

			},
			initialize: function() {
				this.already_logged = false;
				var user = localStorage.getItem("user-local-data");
				if (user !== null) {
					console.log("user", user);
					this.already_logged = true;
				} else {
					console.log("user null", user);
				}
				this.render();
			},
			render: function() {
				if (this.already_logged) {
					this.$el.html(this.template());
					$('#middle-section').empty();
					$("#middle-section").append(this.el);
					console.log('hell inside');
				} else {
					Backbone.history.navigate("firstpage",true);
				}
				return this;
			},
			close: function() {

			}
		});
		console.log("home");
		return HomeView;
	}
);