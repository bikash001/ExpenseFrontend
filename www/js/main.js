define(['underscore', 'backbone', 'jquery', 'app'],
    function(_, Backbone, $, NavHome) {
        var Router = Backbone.Router.extend({
            routes: {
                'home': "home",
                'firstpage': "firstpage",
                'about': "about",
                'group': "group",
                
            },
            home: function() {
                var that = this;
                console.log("routing");
                require(['views/home_view'],
                    function(HomeView) {
                       this.view = new HomeView();
                    });
            },
            firstpage: function() {
                var that = this;
                require(['views/firstpage_view'],
                    function(FirstPageView) {
                        that.view = new FirstPageView();
                    });
            }
        });
        return Router;
    }
);