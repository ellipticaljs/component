(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(request('elliptical-utils','observable-component'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','observable-component'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.elliptical.utils,root.elliptical.observable);
    }
}(this, function (utils,observable) {

    var cache=observable.cache;
    cache._initCacheElement=function(){
        var $cache=this.$cache();
        this._data.set('$cache',$cache);
    };

    var pubSub=observable.pubsub;

    var scope=observable.scope;
    var scopeOptions={
        scopeBind: true,
        objectAssign:false
    };

    scope=Object.assign({},scope,scopeOptions);

    var template=observable.template;


    //define component prototype
    var prototype={
        options:{
            scope:null  //prop of context to bind
        },

        /**
         * $.component setup on $.element's init event
         * @private
         */
        _initElement:function(){
            this._initCacheElement();
            this._initScopeElement();
            this._initTemplateElement();
            this._beforeInitComponent();
            this._initComponentElement();
        },

        _beforeInitComponent: $.noop,

        _initComponentElement:function(){
            this.$viewBag=this._viewBag();
            this.__setScope();
            this._initComponent();
            this._bindPublicComponentMethods();
            this._bindSubscriptions();
            this.__subscriber();
            this.__publisher();
        },

        /**
         * sets public property $scope from the ViewData context and the scope public attribute
         * @private
         */
        __setScope: function(){
            var data=this.options.data;
            if(data) return;
            var context=this._viewBag();
            var scope=this.options.scope;
            if(scope){
                if(this.options.objectAssign) this.$scope=context[scope];
                else{
                    this.$scope[scope]=context[scope];
                }
            }
        },

        /**
         * $.component init event
         */
        _initComponent: $.noop,


        /**
         * sets up pre-defined subscribe events on a defined channel
         * @private
         */
        __subscriber:function(){
            var self=this;
            var channel=this.options.channel;
            var event=this.options.event;
            this._data.set('_synced',false);
            if(channel){
                if(event==='sync'){
                    this._subscribe(channel +'.sync',function(data){
                        if(!self._data.get('_synced')){
                            self._data.set('_synced',true);
                            self._dispose();
                            self.$scope=data;
                            self._rebind();
                            self._onSyncSubscribe();
                        }
                    });
                }
            }
        },

        /**
         * if a channel has been declared, publish the $scope to channel.sync
         * this allows different $.components and custom elements to share the same $scope
         * @private
         */
        __publisher:function(){
            var channel=this.options.channel;
            var event =this.options.event;
            var self=this;
            var MAX=6;
            var count=0;
            if(channel && !event){
                if(this._data.get('scopeObserver')){
                    this._publish(channel + '.sync',this.$scope);
                }else{
                    var timeoutId=setInterval(function(){
                        if(self._data.get('scopeObserver')){
                            clearInterval(timeoutId);
                            self._publish(channel + '.sync',self.$scope);
                        }else{
                            if(count<MAX) count++;
                            else clearInterval(timeoutId);
                        }
                    },300);
                }
            }
        },


        /**
         * returns the elliptical viewBag
         * @returns {*}
         * @private
         */
        _viewBag:function(){
            if(!window.__viewData) window.__viewData={};
            return window.__viewData;
        },



        /**
         * handler for channel.sync, subscription
         * @param data {Object}
         * @private
         */
        _onSyncSubscribe: $.noop,


        /**
         * returns the scope property of the ViewData context
         * @returns {Object}
         * @private
         */
        _scopedContextModel:function(){
            var context=this._viewBag();
            scope=this.options.scope;

            return (scope) ? context[scope] : undefined;
        },

        __onTemplateVisibility:function(){
            var node=this.element[0];
            if(node.hasAttribute('ui-preload')) node.removeAttribute('ui-preload');
            this._onTemplateVisibility();
        },

        _onTemplateVisibility:function(){},

        _bindPublicComponentMethods:function(){
            var self=this;
            var node=this.element[0];
            node.onScopeChange=function(callback){
                self.__notify=function(result){
                    if(callback) callback(result);
                }
            };

            node.$rebind=function(){
                self.$rebind();
            };

            node.changeReport=function(o,n){
                return self.changeReport(o,n);
            };
        },

        runInit:function(){
            this._initComponent();
        }


    };


    //mixin prototypes
    prototype=Object.assign(cache,pubSub,scope,template,prototype);

    //define base component
    $.element('elliptical.component',prototype);


    /**
     * define the component factory
     * @param ElementProto {Object} <optional>, only should be supplied if the element not derived from HTMLElement
     * @param name {String}
     * @param tagName {String} <optional>
     * @param base {Object} <optional>
     * @param prototype {Object}
     */
    $.component= $.elementFactory($.elliptical.component);

    /* copy props of element to component */
    for(var key in $.element){
        $.component[key]= $.element[key];
    }


    return $;

}));