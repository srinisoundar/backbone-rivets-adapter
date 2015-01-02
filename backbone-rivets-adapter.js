(function(){
  
  function factory(Backbone,rivets) {

    //assign the default callbacks to be used for javascript objects
    var adapter = rivets.adapters['.'],
        defaultObserve = adapter.observe,
        defaultUnobserve = adapter.unobserve;

   //subscribe for backbone model & collection, javascript objets 
    adapter.observe = function (obj, keypath, callback) {
        if (obj === undefined || obj === null) {//undefined if the elements are not ready
            return;
        } else if (obj && keypath && obj[keypath] instanceof Backbone.Collection) {
            obj[keypath].on('add remove reset sort', function () {
                callback(obj[keypath]);
            });
        } else if (obj instanceof Backbone.Model) {
            obj.on('change:' + keypath, function (model, value) {
                callback(value);
            });
        } else {
            defaultObserve.apply(this, arguments);
        }
    };

    //unsubscribe for the objects
    adapter.unobserve = function (obj, keypath, callback) {
        if (obj === undefined || obj === null) {
            return;
        } else if (obj && keypath && obj[keypath]  instanceof Backbone.Collection) {
            obj[keypath].off('add remove reset sort', function () {
                callback(obj[keypath]);
            });
        } else if (obj instanceof Backbone.Model) {
            obj.off('change:' + keypath, function (model, value) {
                callback(value);
            });
        } else {
            defaultUnobserve.apply(this, arguments);
        }
    };

    //reterive the values from backbone objects
    adapter.get = function (obj, keypath) {
        if (obj === null || obj === undefined) {
            return;
        } else if (obj instanceof Backbone.Model) {
            return obj.get(keypath);
        } else {
            var result = obj[keypath];
            if (result instanceof Backbone.Collection) {
                return result.models;
            } else {
                return result;
            }
        }
    };

   //set the values to backbone objects
    adapter.set = function (obj, keypath, value) {
        if (obj instanceof Backbone.Collection) {
            obj.models = value;
        } else if (obj instanceof Backbone.Model) {
            obj.set(keypath, value);
        } else {
            obj[keypath] = value;
        }
    };

    return rivets;
}
  
  
  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = factory(require('backbone'),require('rivets'));
  } else if (typeof define === 'function' && define.amd) {
    define(['backbone','rivets'], function(Backbone,rivets) {
      return factory(Backbone,rivets);
    });
  } else {
    this.rivets = factory(this.backbone,this.rivets);
  }
    
}).call(this);

