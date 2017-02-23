define(['underscore', 'backbone', 'jquery', "text!templates/register_template.html"],
	function(_, Backbone, $, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			events: {

			},
			initialize: function() {
				this.render();
			},
			render: function() {
				this.$el.html(this.template());
				$('#middle-section').empty();
				$('#middle-section').append(this.$el);
				return this;
			}
		});
		return HomeView;
	}
);