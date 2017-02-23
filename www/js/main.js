define(['underscore', 'backbone', 'jquery', 'app'],
    function(_, Backbone, $) {
        var Router = Backbone.Router.extend({
            routes: {
                '': 'home',
                '/': "home",
                'firstpage': "firstpage",
                'about': "about",
                'group': "group",
                
            },
            home: function() {
                var that = this;
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
        console.log("router");
        return Router;
    }
);