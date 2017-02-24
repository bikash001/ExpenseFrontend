define(['underscore', 'backbone', 'jquery', "text!templates/firstpage_template.html",
	"text!templates/login_template.html"],
	function(_, Backbone, $, FirstPageTemplate, LoginTemplate) {
		var FirstPageView = Backbone.View.extend({
			template: _.template(FirstPageTemplate),
			events: {
				'click #register-btn': 'register',
				'click #login-btn': 'login'
			},
			initialize: function() {
				this.render();
			},
			render: function() {
				this.$el.html(this.template());
				$('#middle-section').empty();
				$('#middle-section').append(this.el);
				return this;
			},
			register: function() {
				var compiled_template = _.template(LoginTemplate);
				this.$el.html(compiled_template({"data": {"login": false}}));
				$('#middle-section').empty();
				$('#middle-section').append(this.el);
				$('#submit-btn').on('click', {"that": this}, function(event) {
					event.data.that.validateForm(false);
				});
			},
			login: function() {
				var compiled_template = _.template(LoginTemplate);
				this.$el.html(compiled_template({"data": {"login": true}}));
				$('#middle-section').empty();
				$('#middle-section').append(this.el);
				$('#submit-btn').on('click', {"that": this}, function(event) {
					event.data.that.validateForm(true);
				});
			},
			sendData: function(dataObj, endpoint) {
				var baseurl = "http://192.168.1.100:8001";
				$.ajax({
				  type: "POST",
				  url: baseurl + endpoint,
				  data: dataObj,
				  dataType: "json",
				  success: function(dataVal){
				  	console.log("success");
				  	if (_.isEqual(endpoint, "/signup")) { 
				  		localStorage.setItem("user-local-data", JSON.stringify({"name": dataObj["name"],
						"email": dataObj["email"], "mobile": dataObj["mobile"]}));
				  	} else {
				  		localStorage.setItem("user-local-data", JSON.stringify({"token": dataVal.token}));
				  	}
				  	console.log(dataVal);
					Backbone.history.navigate("/", true);
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
			},
			validateForm: function(login) {
				var obj = {};
				var els = $("#form").find("input");
				if (login) {
					obj["username"] = els[0].value;
					obj["password"] = els[1].value;
					if (_.isEmpty(obj["username"] || _.isEmpty(obj["password"]))) {
						console.log("empty field");
					} else {
						this.sendData(obj, "/login/")
					}
				} else {
					obj["name"] = els[0].value;
					obj["email"] = els[1].value;
					obj["mobile"] = els[2].value;
					obj["username"] = els[2].value;
					obj["password"] = els[3].value;
					if (_.isEmpty(obj["name"])) {
						console.log("empty field");
						console.log(obj);
					} else if (!_.isEqual(els[3].value, els[4].value)) {
						console.log("password didn't match.")
					} else {
						this.sendData(obj, "/signup")
					}
				}
			},
			close: function() {

			}
		});
		return FirstPageView;
	}
);