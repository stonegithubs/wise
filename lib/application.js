/**
 * wise - lib/application.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('wise:application');
var sio = require('socket.io');
var Waterline = require('waterline');
var merge = require('merge');

var orm = new Waterline();

function Application(options) {
    if (!(this instanceof Application)) return new Application(options);
    this.models = [];
    this.orm = orm;
    this.configs = {};
    this.io = sio(options);
}


var app = Application.prototype;

app.load = function (collection) {
    if (!collection || (collection && typeof collection.identity !== 'string')) {
        return;
    }
    var identity = collection.identity;
    var _this = this;
    collection.afterUpdate = function (values, cb) {
        _this.emit(identity + '.changed', values);
        cb();
    };
    collection.afterCreate = function (values, cb) {
        _this.emit(identity + '.added', values);
        cb();
    };
    collection.afterDestroy = function (values, cb) {
        _this.emit(identity + '.removed', values);
        cb();
    };
    this.orm.loadCollection(Waterline.Collection.extend(collection));
};
app.adapter = function () {
    this.io.adapter(arguments);
};
app.config = function (config) {
    this.configs = merge(this.configs, config);
};
app.run = function () {
    var _this = this;
    this.orm.initialize(this.configs, function (err, models) {
        if (err) throw err;
        _this.models = models;
        _this.io.sockets.on('connection', function (socket) {
            debug(socket.id, 'connected');
            socket.on('join', function (room) {
                debug(socket.id + ' joined room %s', room);
                socket.join(room);
            })
        });
    });
};
app.emit = function (room, values) {
    debug(room, 'emit');
    this.io.to(room).emit('data', values);
};
/**
 * Module exports.
 */
module.exports = Application;
