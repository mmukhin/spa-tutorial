//
var apiUrl = 'http://localhost:8080/api';

var NBAApp = {};
NBAApp.Views = {};
NBAApp.Models = {};
NBAApp.Collections = {};

NBAApp.Views.Main = Backbone.View.extend({
    initialize: function() {

    },
    render: function() {

    }
});

NBAApp.Models.Team = Backbone.Model.extend({
    url: apiUrl+'/teams/',
    defaults: function() {
        return {
            id: null,
            name: '',
            city: ''
        };
    },
    initialize: function() {

    }
});

NBAApp.Collections.Teams = Backbone.Collection.extend({
    url: apiUrl+'/teams/',
    model: NBAApp.Models.Team,
    initialize: function() {

    },
    comparator: function(a) {
        return a.get('name');
    }
});

NBAApp.Router = Backbone.Router.extend({
    routes: {
        'about':        'about',
        'league':       'league',
        '*catchAll':    'league'
    },
    initialize: function() {
        this.league = new LeagueView;
        this.about = new AboutView;
    },
    about: function() {
        this.league.hide();
        $('#league-link').removeClass('nolink');

        this.about.render();
        $('#about-link').addClass('nolink');
    },
    league: function() {
        this.league.render();
        $('#league-link').addClass('nolink');

        this.about.hide();
        $('#about-link').removeClass('nolink');
    }
});



// The DOM element for a todo item...
var TeamView = Backbone.View.extend({

    //... is a list tag.
    tagName:  'div',

    // Cache the template function for a single item.
    templateViewTeam: _.template($('#backbone-view-team').html()),
    templateEditTeam: _.template($('#backbone-edit-team').html()),

    // The DOM events specific to an item.
    events: {
        'click #backbone-team-delete'   : 'onTeamDelete',
        'click #backbone-team-edit'     : 'onTeamEdit',
        'click #backbone-team-save'     : 'onTeamSave',
        'click #backbone-team-cancel'   : 'onTeamCancel'
    },

    // The TeamView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TeamView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html(this.getViewTeamHtml());
        return this;
    },
    getViewTeamHtml: function() {
        return this.templateViewTeam(this.model.toJSON());
    },
    getEditTeamHtml: function() {
        return this.templateEditTeam(this.model.toJSON());
    },

    onTeamSave: function(e) {
        e.preventDefault();

        var city = this.$('#edit-team-city').val();
        var name = this.$('#edit-team-name').val();

        if (!name) {
            alert('Missing team name!');
            return;
        }
        if (!city) {
            alert('Missing team city!');
            return;
        }

        var team = {
            name: name,
            city: city
        };

        this.model.save(team);
        this.$el.html(this.viewTeamHtml);
    },

    onTeamCancel: function(e) {
        e.preventDefault();
        this.$el.html(this.getViewTeamHtml());
    },

    onTeamEdit: function(e) {
        e.preventDefault();
        this.$el.html(this.getEditTeamHtml());

        this.$('#edit-team-city').focus();
    },

    onTeamDelete: function(e) {
        e.preventDefault();

        if (confirm('Delete the ' + this.model.get('city') + ' ' + this.model.get('name') + '?')) {
            this.model.destroy();
        }
    }

});

var LeagueView = Backbone.View.extend({

    el: '#league',

    events: {
        'click #new-team-add': 'onTeamCreate',
        'keyup #backbone-search': 'keywordSearch'
    },

    initialize: function() {

        this.teams = new NBAApp.Collections.Teams;
        this.teams.fetch();

        //this.listenTo(this.teams, 'add', this.onCollectionAdd);
        this.listenTo(this.teams, 'sync', this.onCollectionSync);
        this.listenTo(this.teams, 'destroy', this.onCollectionModelDestroy);

        this.input = $('#new-team-add');
        this.keyword = $('#backbone-search');
    },

    /**
     * Override parent method, render HTML from template
     */
    render: function(optionalCollection) {

        var that = this;
        optionalCollection = optionalCollection || this.teams;

        if (optionalCollection.length > 0) {
            this.clear();
            _.each(optionalCollection.models, function(v) {
                that.onCollectionAdd(v);
            });
        }
        else {
            this.clear();
        }

        this.$el.show();

        this.updateTeamsCount();

        // enable chained calls
        return this;
    },

    clear: function() {
        this.$('#backbone-teams').html('');
    },

    updateTeamsCount: function() {
        this.$('#backbone-number-teams').html( this.teams.length );
    },

    onCollectionModelDestroy: function() {
        this.$('#backbone-number-teams').html( this.teams.length );
    },

    onCollectionSync: function() {
        var that = this;
        this.$('#backbone-number-teams').html( this.teams.length );
        this.render( this.teams );
    },

    onCollectionAdd: function(team) {
        var view = new TeamView({model: team});
        this.$('#backbone-teams').append(view.render().el);
    },

    keywordSearch: function() {
        var kw = this.keyword.val();
        if (kw.length > 0) {

            var filteredTeams = this.teams;

            filteredTeams = filteredTeams.filter(function(team) {
                return (
                        team.get('city').indexOf( kw ) != -1
                        || team.get('name').indexOf( kw ) != -1
                );
            });

            this.$('#backbone-search-info').html( filteredTeams.length + ' team(s) found! ');

            this.render( new Backbone.Collection(filteredTeams) );
        }
        else {
            this.$('#backbone-search-info').html(null);
            this.render( this.teams );
        }
    },

    onTeamCreate: function(e) {
        e.preventDefault();

        var name = $('#newTeam #new-team-name').val();
        var city = $('#newTeam #new-team-city').val();

        if (!name) {
            alert('Missing name!');
            return;
        }
        if (!city) {
            alert('Missing city!');
            return;
        }

        var team = {
            name: name,
            city: city
        };

        this.teams.create(team);

        $('#newTeam #new-team-name').val('');
        $('#newTeam #new-team-city').val('').focus();
    },
    hide: function() {
        this.$el.remove();
    }
});

var AboutView = Backbone.View.extend({
    el: '#about',
    initialize: function() {
    },
    render: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.remove();
    }
});

var appRouter = new NBAApp.Router();
Backbone.history.start({ pushState:true });