define(['underscore', 'backbone', 'jquery', 'lib/slideout', "text!templates/home_template.html", "css!../../css/homepage",
	"css!../../css/fontello"],
	function(_, Backbone, $, Slideout, HomeTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			tagName: "div",
			className: "col-xs-12",
			events: {
				"click #logout-btn": "logout",
				"click #home-btn": "home",
				"click #history-btn": "history",
				"click #group-btn": "group",
				"click #history-btn": "history",
				"click #contact-btn": "contact",
				"click #unacked-btn": "unAcked"
			},
			initialize: function() {
				this.already_logged = false;
				var user = localStorage.getItem("user-local-data");
				if (user !== null) {
					// console.log("user", user);
					this.already_logged = true;
				} else {
					console.log("user null", user);
				}
				this.render();
			},
			home: function() {
				$('#middle-section').empty();
			},
			initDrawer: function() {
				var slideout = new Slideout({
				    'panel': $('#panel').get(0),
				    'menu': $('#menu').get(0),
				    'padding': 256,
				    'tolerance': 70
				 });
				$('.toggle-button').on('click', function() {
					slideout.toggle();
				});
			},
			unAcked: function() {

			},
			history: function() {

			},
			groups: function() {

			},
			logout: function() {
				var baseurl = "http://localhost:8001";
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
					$('#main-container').empty();
					$("#main-container").append(this.el);
					this.initDrawer();
					console.log('hell inside');
					this.initDrawer();
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