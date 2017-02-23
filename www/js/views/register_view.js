define(['underscore', 'backbone', 'jquery', "text!templates/register_template.html"],
	function(_, Backbone, $, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			rawTemplate: _.template(HomeTemplate),
			initialize: function() {
				$('#middle-section').empty();
				$("#middle-section").append(this.rawTemplate());
			}
		});
		console.log("home");
		return HomeView;
	}
);