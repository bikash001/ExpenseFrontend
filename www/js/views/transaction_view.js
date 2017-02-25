define(['jquery', 'underscore', 'backbone', "text!templates/home_template.html"],
	function($, _, Backbone, HomeTemplate) {
		var TransactionView = Backbone.View.extend({
			template: _.template(HomeTemplate),
			events: {
				'click #add-group' : "addGroup",
				'click #add-group-user' : "addGroupUser",
				'click #delete-group' : "deleteGroup",
				'click #add-bill' : "addBill",
				'click #delete-bill' : "deleteBill",
				'click #modify-bill' : "modifyBill"
			},
			initialize: function() {
				this.render();
			},
			addGroup: function() {
				var obj = {"name" : "", "users" : []};
				this.connect("/groups/add", obj);
			},
			addGroupUser: function() {
				var obj = {"name": "", "users": []};
				this.connect("/group/addUser", obj);
			},
			deleteGroup: function() {
				var obj = {"name": "", "id": ""};
				this.connect("/groups/delete", obj);
			},
			addBill: function() {
				/* category types
					1: 'Food & Drinks',
					2: 'Entertainment',
					3: 'Transportation',
					4: 'Others'

					pay_splits = [["user", "how much paid"]];
					splits = [["user", "how much owes"]];
				*/
				var obj = {"name": "", "group": "", "amount": "", "category": "",
							"pay_splits": [], "splits": []};
				this.connect("/bills/add", obj);
			},
			modifyBill: function() {
				var obj = {};
				this.connect("/bills/modify", obj);
			},
			deleteBill: function() {
				var obj = {"id": ""};
				this.connect("/bills/delete", obj);
			},
			ackBill: function() {
				var obj = {"id": ""};
				this.connect("/bills/ack", obj);
			},
			connect: function(endpoint, dataObj) {
				var baseurl = "http://192.168.1.100:8001";
				var dataObj = JSON.parse(localStorage.getItem("user-local-data"));
				$.ajax({
				  type: "POST",
				  url: baseurl + endpoint,
				  data: dataObj,
				  dataType: "json",
				  beforeSend: function(xhr) {
				  	xhr.setRequestHeader("Authorization", "token "+dataObj.token);
				  },
				  success: function(dataVal){
				  },
				  error: function(val) {
				  }
				});
			},
			render: function() {
				return this;
			},
			close: function() {

			}
		});
		return TransactionView;
	}
);