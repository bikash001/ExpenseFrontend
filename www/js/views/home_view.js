define(['underscore', 'backbone', 'jquery', 'lib/slideout', "lib/bootbox.min", "text!templates/home_template.html",
	"text!templates/dashboard.html", "css!../../css/homepage",
	"css!../../css/fontello", "lib/bootstrap.min",
	"css!../../css/firstpage"],
	function(_, Backbone, $, Slideout, bootbox, HomeTemplate, DashboardTemplate) {
		var HomeView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			tagName: "div",
			className: "col-xs-12",
			events: {
				"click #logout-btn": "logout",
				"click #home-btn": "home",
				//"click #history-btn": "history",
				// "click #group-btn": "group",
				"click #contact-btn": "contact",
				"click #unacked-btn": "unAcked",
				"click #setting-btn": "settings",
			},
			initialize: function() {
				this.already_logged = false;
				this.in_home = false;
				var user = localStorage.getItem("user-token");
				if (user !== null) {
					// console.log("user", user);
					this.already_logged = true;
				} else {
					console.log("user null", user);
				}
				this.render();
			},
			home: function() {
				if (!this.in_home) {
					var compiled_template = _.template(DashboardTemplate);
					$("#middle-section").empty();
					$("#middle-section").append(compiled_template());
					$(".nav-tabs a").click(function(){
				        $(this).tab('show');
				    });
				    $('#add-bill-float').on("click", {"that": this}, function(event){
				    	event.data.that.addBill();
				    });

				    $("#add-group-float").on('click', {"that": this}, function(event){
				    	event.data.that.addGroup();
				    });
				    this.in_home = true;
					this.getSummary();
				    this.groups();
				}
			},
			addBill: function() {
				var that = this;
				var dialog = bootbox.dialog({
					title: "Add Bill",
					size: "small",
					message: '<div><input style="margin:10px;" id="dialog-input-bname" type="text" placeholder="bill name"/></div>\
					<div><input style="margin:10px;" id="dialog-bill-amt" type="number" placeholder="total amount"/></div>\
					 <div><input style="margin:10px;" id="selected-option" list="group-list" name="group-dropdown" placeholder="select group"></div>\
					  <datalist id="group-list">\
					  </datalist><div id="list-input"></div>',
					buttons: {
						"add": function() {
							var val = $('#selected-option').val();
							if (val != null) {
								var els = $('#list-input').find('input');
								var dataObj = {"group": val, "name": $('#dialog-input-bname').val(),
									"amount": $('#dialog-bill-amt').val(), "category": 1, "comments": "",
									"pay_splits": [], "splits": []
								};
								console.log(dataObj);
								var elval;
								var total = 0.0;
								_.each(els, function(el, index) {
									elval = el.value || 0;
									total += elval;
									dataObj.pay_splits.push([el.name, elval]);
								});
								var per = total / dataObj.pay_splits.length;
								_.each(dataObj.pay_splits, function(el) {
									dataObj.splits.push([el[0], per]);
								});
								dialog.modal('hide');
								that.sendData("/bills/add", dataObj);	
							}
						}
					}
				});
				_.each(that.groups, function(gp) {
					$('#group-list').append("<option value='"+gp.name+"'>");
				});
				$('#selected-option').on("change", function() {
					var val = $('#selected-option').val();
					if (val != null) {
						var gp = _.find(that.groups, function(el) {
							return el.name == val;
						});
						$('#list-input').empty();
						_.each(gp.users, function(mnum) {
							$('#list-input').append("<div><span>"+mnum+"</span> <input style='margin:10px;' placeholder='share' type='number' name="+mnum+"></div>");
						});
					}
				});
			},
			addGroup: function() {
				// $("#float-btn").addClass("hide");
				// $('#custom-dialog-box').removeClass("hide");
				var that = this;
				var dialog = bootbox.dialog({
					title: "Add Group",
					size: "small",
					message: '<div style="text-transform: none">\
          <div style="margin: 10px;">\
            <input id="dialog-group-name" type="text" placeholder="group name"/>\
          </div>\
          <div style="margin: 10px;">\
            <input type="text" id="user-val" placeholder="username"><a ><i id="add-user-to-list" class="icon-plus"></i></a>\
          </div>\
          <div>\
            <ul id="user-list-added">\
            </ul></div>',
          			"buttons": { "create": function() {
          					var gobj = {"name":"", "users": []};
          					gobj['name'] = $('#dialog-group-name').val();
          					_.each($('#user-list-added').find('li'), function(el, i){
          						gobj['users'].push(el.innerHTML);
          					});
          					console.log(gobj);
          					dialog.modal("hide");
          					that.sendData("/groups/add", gobj);
          				}
          			}
				});
				var val = $("#user-val");
				
				$('#add-user-to-list').on("click", function(event) {
					$('#user-list-added').append('<li>'+ val.val() + '</li>')
					val.val("");
				});
			},
			sendData: function(endpoint, dataToSend) {
				var baseurl = "http://localhost:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-token"));
				$.ajax({
				  type: "POST",
				  url: baseurl + endpoint,
				  data: JSON.stringify(dataToSend),
				  dataType: "text",
				  beforeSend: function(xhr) {
				  	console.log(xhr);
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	console.log(dataVal);
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
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
				this.home();
			},
			insideBill: function(id) {

			},
			insideGroup: function(id) {
				/*	data format
					id : 1,
					name: "group name",
					created_on: "date time"
					users: [],
					"bills": []
				*/
				
			},
			getSummary: function() {
				/* data format
					{
							net_balance: 15,
							summary: {
								"username": "15",
								"username2": "-5"
							},
							name: "name",
							email: "email",
							mobile: "mobile"
					}
				*/
				var that = this;
				var baseurl = "http://localhost:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-token"));
				$.ajax({
				  type: "POST",
				  url: baseurl + "/user/summary",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	var userData = localStorage.getItem("user-local-data");// || {} ;
				  	console.log('userdata', userData);
				  	if (userData == undefined) {
				  		userData = {};
				  		userData["name"] = dataVal.name;
				  		userData["email"] = dataVal.email;
				  		userData["mobile"] = dataVal.mobile;
				  		console.log("writing localStorage");
				  		localStorage.setItem("user-local-data", JSON.stringify(userData));
				  		that.user_local_data = userData;
				  		$('#user-name').html(dataVal.name);
				  	} else {
				  		that.user_local_data = JSON.parse(localStorage.getItem("user-local-data"));
				  	}
				  	var summary = dataVal.summary;
				  	if (!_.isEmpty(summary)) {
				  		require(['text!templates/summary.html'], function(SumTemp){
				  			var compiled_temp = _.template(SumTemp);
				  			$('#summary').empty();
				  			$('#summary').append(compiled_temp({"summaryList": summary, "sumTotal": dataVal.net_balance }));
				  		});				  		
				  	}
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
			},
			insideUnacked: function() {
				var that = this;
				$('.unacked-bill').on('click', function() {
					console.log("id",this.id);
					$(this).addClass("hide");
					that.sendData("/bills/ack", {"id": this.id});
				});
			},
			contact: function() {
				this.home();
			},
			settings: function() {
				this.home();
			},
			unAcked: function() {
				/*
				"bills": [{id: "", "amount": "", splits: [["username","owes","getback"]]}]
				*/
				var that = this;
				var baseurl = "http://localhost:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-token"));
				$.ajax({
				  type: "POST",
				  url: baseurl + "/user/unacked",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	console.log(dataVal);
				  	require(["text!templates/notifications.html"], function(NotificationTemp){
				  		var compiled_template = _.template(NotificationTemp);
				  		dataVal["userName"] = that.user_local_data.mobile;
				  		console.log(dataVal['userName']);
				  		$('#middle-section').empty();
				  		$('#middle-section').append(compiled_template(dataVal));
				  		that.in_home = false;
				  		that.insideUnacked();
				  	});
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
			},
			history: function() {

			},
			groups: function() {
				/*	data format
					id : 1,
					name: "group name",
					created_on: "date time"
					users: [],
					"bills": []
				*/

				// var that = this;
				// that.in_home = false;
				// require(["text!templates/group"], function(GpTemplate) {
				// 	var compiled_template = _.template(GpTemplate);
				// 	that.$el.html(compiled_template());
				// });
				var that = this;
				var baseurl = "http://localhost:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-token"));
				$.ajax({
				  type: "POST",
				  url: baseurl + "/groups/data",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	
				  	if (!_.isEmpty(dataVal.groups)) {
				  		require(['text!templates/groups.html'], function(GpTemp){
				  			var compiled_temp = _.template(GpTemp);
				  			that.groups = dataVal.groups;
				  			console.log(dataVal);
				  			$('#menu1').empty();
				  			$('#menu1').append(compiled_temp({"groups": dataVal.groups, "user": JSON.parse(localStorage.getItem("user-local-data")).mobile}));
				  		});				  		
				  	}
				  },
				  error: function(val) {
				  	console.log("failure");
				  	console.log(val);
				  }
				});
			},
			logout: function() {
				var baseurl = "http://localhost:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-token"));
				$.ajax({
				  type: "POST",
				  url: baseurl + "/logout",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  	console.log(dataVal);
				  	localStorage.removeItem("user-local-data");
				  	localStorage.removeItem("user-token");
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