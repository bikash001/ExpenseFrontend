define(['underscore', 'backbone', 'jquery', 'lib/bootbox.min',
	"text!templates/login_template.html", "text!templates/forgot_template.html", "lib/bootstrap.min",
	"css!../../css/firstpage"],
	function(_, Backbone, $, Bootbox, LoginTemplate, ForgotTemplate) {
		var FirstPageView = Backbone.View.extend({
			tagName: "div",
			className: "col-xs-12",
			template: _.template(LoginTemplate),
			events: {
				
			},
			initialize: function() {
				this.render();
			},
			render: function() {
				this.login();
				return this;
			},
			register: function() {
				this.$el.html(this.template({"data": {"login": false}}));
				$('#main-container').empty();
				$('#main-container').append(this.el);
				$('#signin-btn').on('click', {"that": this}, function(event) {
					event.data.that.validateForm(false);
				});
			},
			forgot: function() {
				console.log("inside forgot");
				var compiled_template = _.template(ForgotTemplate);
				this.$el.html(compiled_template());
				$("#main-container").empty();
				$("#main-container").append(this.el);
			},
			login: function() {
				this.$el.html(this.template({"data": {"login": true}}));
				$('#main-container').empty();
				$('#main-container').append(this.el);
				$('#login-btn').on('click', {"that": this}, function(event) {
					event.data.that.validateForm(true);
				});
				$('#signin-btn').on('click', {"that": this}, function(event) {
					event.data.that.register();
				});
				$('#forgot-btn').on('click', {"that": this}, function(event) {
					console.log("forgot");
					event.data.that.forgot();
				});
			},
			removeLoginHandler: function() {
				$("#login-btn").off("click");
				$("#signin-btn").off("click");
				$("#forgot-btn").off("click");
			},
			sendData: function(dataObj, endpoint) {
				var that = this;
				var baseurl = "http://localhost:8001";
				$.ajax({
				  type: "POST",
				  url: baseurl + endpoint,
				  data: dataObj,
				  dataType: "json",
				  success: function(dataVal){
				  	console.log("success");
				  	if (_.isEqual(endpoint, "/signup")) { 
				  // 		localStorage.setItem("user-local-data", JSON.stringify({"name": dataObj["name"],
						// "email": dataObj["email"], "mobile": dataObj["mobile"]}));
						that.removeLoginHandler();
						that.login();
				  	} else {
				  		$("#signin-btn").off("click");
				  		localStorage.setItem("user-token", JSON.stringify({"token": dataVal.token}));
				  		Backbone.history.navigate("home",{"trigger": true, "replace": true});
				  	}
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
			},
			alert: function(ttl, msg) {
				Bootbox.alert({
					size: "small",
					  title: ttl,
					  className: "small-text",
					  message: msg
				});
			},
			validateForm: function(login) {
				var obj = {};
				var els = $("#form-data").find("input");
				if (login) {
					obj["username"] = els[0].value;
					obj["password"] = els[1].value;
					if (_.isEmpty(obj["username"])) {
						this.alert("Login Error", "mobile can't be empty");
					} else if (_.isEmpty(obj["password"])) {
						this.alert("Login Error", "password can't be empty");
					} else {
						this.sendData(obj, "/login/");
					}
				} else {
					obj["name"] = els[0].value;
					obj["email"] = els[1].value;
					obj["mobile"] = els[2].value;
					obj["username"] = els[2].value;
					obj["password"] = els[3].value;
					if (_.isEmpty(obj["name"])) {
						this.alert("Sign-in Error", "name can't be empty");
					} else if (_.isEmpty(obj["email"])) {
						this.alert("Sign-in Error", "email can't be empty");
					} else if (_.isEmpty(obj["mobile"])) {
						this.alert("Sign-in Error", "mobile can't be empty");
					} else if (!_.isEqual(els[3].value, els[4].value)) {
						this.alert("Sign-in Error", "both password didn't match")
					} else {
						this.sendData(obj, "/signup");
					}
				}
			},
			close: function() {

			}
		});
		return FirstPageView;
	}
);