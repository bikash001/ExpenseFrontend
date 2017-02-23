define(['underscore', 'backbone', 'jquery', 'app'],
    function(_, Backbone, $) {
        var Router = Backbone.Router.extend({
            routes: {
                '': 'home',
                '/': "home",
                'register': "register",
                'login': "login",
                'about': "about",
                'group': "group",
                
            },
            home: function() {
                require(['views/home_view'],
                    function(HomeView) {
                        new HomeView();
                    });
            }
        });
        console.log("router");
        return Router;
    }
);