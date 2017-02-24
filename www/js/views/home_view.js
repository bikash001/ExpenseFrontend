define(['underscore', 'backbone', 'jquery', "text!templates/home_template.html"],
	function(_, Backbone, $, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			events: {
				"click #logout-btn": "logout"
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
			logout: function() {
				var baseurl = "http://192.168.1.100:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-local-data"));
				$.ajax({
				  type: "POST",
				  url: baseurl + "/logout",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	console.log(dataVal);
				  	localStorage.removeItem("user-local-data");
					Backbone.history.navigate("firstpage", {"trigger": true, "replace": true});
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
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