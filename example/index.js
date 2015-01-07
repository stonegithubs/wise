/**
 * wise - index.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

var wise = require('../lib/application')(3000);

var mysql = require('sails-mysql');

var User = {
    identity: 'user',

    // Set schema true/false for adapters that support schemaless
    schema: true,
    connection: 'mysql',

    // Define attributes for this collection
    attributes: {

        firstName: {
            type: 'string',

            // also accepts any validations
            required: true
        },

        lastName: {
            type: 'string',
            required: true,
            maxLength: 20
        },

        age: {
            type: 'integer',
            required: true
        },

        // You can also define instance methods here
        fullName: function() {
            return this.firstName + ' ' + this.lastName
        }
    },

    /**
     * Lifecycle Callbacks
     *
     * Run before and after various stages:
     *
     * beforeValidate
     * afterValidate
     * beforeUpdate
     * afterUpdate
     * beforeCreate
     * afterCreate
     * beforeDestroy
     * afterDestroy
     */

    beforeCreate: function(values, cb) {
        console.log(values.age,'beforecreate');
        values.age += 1;
        cb();
    },
    afterCreate: function(values, cb){
        console.log(values.age, 'aftercreate');
        cb();
    },

    // Class Method
    doSomething: function(values) {
        // Do something here
        //console.log(values);
    }

}

wise.config({
    adapters: {
        mysql: mysql
    },
    connections: {
        mysql: {
            adapter: 'mysql',
            socketPath: '/tmp/mysql.sock',
            user     : 'root',
            password : '123456',
            database: 'waterline'
        }
    }
});

wise.load(User);

wise.run();

