var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        idMember: 'idMember',
        username: 'username'
    },
    pickOutputs = {
        '-': {
            keyName: 'data',
            fields: {
                id: 'id',
                name: 'name',
                memberships: 'memberships',
                shortLink: 'shortLink',
                shortUrl: 'shortUrl',
                starred: 'starred',
                subscribed: 'subscribed',
                url: 'url'
            }
        }
    };

module.exports = {
    authOptions: function (dexter) {
        if (!dexter.environment('trello_api_key') || !dexter.environment('trello_token')) {
            this.fail('A [trello_api_key] or [trello_token] environment variables are required for this module');
            return false;
        } else {
            return {
                api_key: dexter.environment('trello_api_key'),
                token: dexter.environment('trello_token')
            }
        }
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(dexter);
        if (!auth) return;
        var t = new trello(auth.api_key, auth.token);
        var inputs = util.pickStringInputs(step, pickInputs);
        var member = inputs.idMember? inputs.idMember : inputs.username;
        if (_.isEmpty(member))
            return this.fail('A [idMember] or [username] variables are required for this module');

        t.get("/1/members/" + member + "/boards", function(err, data) {
            if (!err) {
                this.complete(util.pickResult({data: data}, pickOutputs));
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
