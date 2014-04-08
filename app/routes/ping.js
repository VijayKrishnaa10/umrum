/* global require, module, console */
var api = require('../ext/redis');

module.exports = function(app){
    app.get('/ping', function(req, res) {
        var hostId = req.query.hostId;
        var active_user = {
            'uid': req.query.uid,
            'hostId': hostId,
            'url': req.query.url
        };
        if (!active_user.hostId) {
            var err_msg = 'Ping without hostID';
            console.error(err_msg, active_user, req.query);
            return res.json({error: err_msg});
        }

        console.log('/ping', active_user, req.query);
        var server = require('../../server');
        var io = server.io;

        api.registerPageView(active_user);

        api.getHostInfo(hostId, function(err, info){
            io.sockets.emit(hostId, info);
        });

        res.json(active_user);
    });
};
