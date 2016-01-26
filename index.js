var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        idMember: 'idMember',
        username: 'username'
    },
    pickOutputs = {
        id: { key: 'data', fields: ['id'] },
        name: { key: 'data', fields: ['name'] },
        memberships: { key: 'data', fields: ['memberships'] },
        shortLink: { key: 'data', fields: ['shortLink'] },
        shortUrl: { key: 'data', fields: ['shortUrl'] },
        starred: { key: 'data', fields: ['starred'] },
        subscribed: { key: 'data', fields: ['subscribed'] },
        url: { key: 'data', fields: ['url'] }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('trello').credentials(),
            t = new trello(credentials.consumer_key, credentials.access_token),
            inputs = util.pickInputs(step, pickInputs),
            member = inputs.idMember? inputs.idMember : inputs.username;

        if (_.isEmpty(member))
            return this.fail('A [idMember] or [username] variables are required for this module');

        t.get("/1/members/" + member + "/boards", function(err, data) {
            if (!err) {
                this.complete(util.pickOutputs({data: data}, pickOutputs));
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
