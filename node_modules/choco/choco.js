/*!
 * @license choco.js Copyright(c) 2015 sasa+1
 * https://github.com/sasaplus1/choco.js
 * Released under the MIT license.
 */

/**
 * export to AMD/CommonJS/global.
 *
 * @param {Object} global global object.
 * @param {Function} factory factory method.
 */
(function(global, factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    global.choco = factory();
  }
}((this || 0).self || global, function(){
  'use strict';

  var MAX_SAFE_INTEGER = (!Number.MAX_SAFE_INTEGER) ?
         Math.pow(2, 53) - 1 : Number.MAX_SAFE_INTEGER;

  var successSuffix = '-success',
      failureSuffix = '-failure';

  var warn = (function(){
    if (typeof console !== 'undefined') {
      if (typeof console.warn === 'object') {
        // for IE8 and IE9.
        return function() {
          Function.prototype.apply.call(console.warn, console, arguments);
        };
      } else if (typeof Function.prototype.bind !== 'undefined') {
        // for modern browsers.
        // PhantomJS is not has `Function.prototype.bind`.
        return console.warn.bind(console);
      }
    }

    // for old browsers and others.
    return function() {};
  }());

  // fallback Object.keys for old browsers.
  var getKeys = (typeof Object.keys === 'function') ?
      function(obj) {
        return Object.keys(obj);
      } :
      function(obj) {
        var keys = [],
            key;

        if (obj === null || typeof obj !== 'object') {
          throw new TypeError('obj is not an Object');
        }

        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            keys.push(key);
          }
        }

        return keys;
      };

  /**
   * exclude key's value from object.
   *
   * @param {Object} target target object.
   * @param {String} excludeKey exclude key.
   * @return {Object} excluded object.
   */
  function exclude(target, excludeKey) {
    var keys = getKeys(target),
        result = {},
        i, len;

    for (i = 0, len = keys.length; i < len; ++i) {
      if (keys[i] === excludeKey) {
        continue;
      }

      result[keys[i]] = target[keys[i]];
    }

    return result;
  }

  /**
   * convert to Promise from EventEmitter.
   *
   * @param {EventEmitter} emitter emitter instance.
   * @param {String} event event name.
   * @param {Object} params argument object for emitter.
   * @return {Promise} promise.
   */
  function choco(emitter, event, params) {
    var paramsType = typeof params;

    if (paramsType !== 'undefined' && paramsType !== 'object') {
      throw new TypeError('params must be an Object');
    }

    if (paramsType === 'object' && typeof params[choco.id] !== 'undefined') {
      throw new Error(choco.id + ' is reserved');
    }

    return new Promise(function(resolve, reject) {
      var id = Math.floor(Math.random() * MAX_SAFE_INTEGER),
          successEvent = event + successSuffix,
          failureEvent = event + failureSuffix,
          onSuccess, onFailure;

      if (paramsType === 'undefined') {
        params = {};
      }
      params[choco.id] = id;

      emitter.on(successEvent, onSuccess = function(result) {
        if (typeof result !== 'object') {
          warn('result is not an Object', result);
          return;
        }
        if (typeof result[choco.id] !== 'number') {
          warn(choco.id + ' is not a Number', result);
          return;
        }

        if (result[choco.id] !== id) {
          return;
        }

        emitter.removeListener(successEvent, onSuccess);
        emitter.removeListener(failureEvent, onFailure);

        resolve(exclude(result, choco.id));
      });
      emitter.on(failureEvent, onFailure = function(result) {
        if (typeof result !== 'object') {
          warn('result is not an Object', result);
          return;
        }
        if (typeof result[choco.id] !== 'number') {
          warn(choco.id + ' is not a Number', result);
          return;
        }

        if (result[choco.id] !== id) {
          return;
        }

        emitter.removeListener(successEvent, onSuccess);
        emitter.removeListener(failureEvent, onFailure);

        reject(exclude(result, choco.id));
      });

      emitter[choco.trigger](event, params);
    });
  }

  // message id key name.
  choco.id = '__choco_id';

  // trigger method name.
  choco.trigger = 'emit';

  return choco;
}));
