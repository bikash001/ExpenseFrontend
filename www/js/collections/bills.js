define(["backbone","underscore", "js/models/Bill"], 
	function(Backbone, _, Bill) {
		var Bills = Backbone.Collection.extend({
			model: Bill,
			initialize: function() {

			}
		});
		return Bills;
	}
);