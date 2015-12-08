window.Elliptical = function (fn) {
    document.addEventListener('WebComponentsReady', function () {
        if(fn.__executed===undefined){
            fn.call(this);
            fn.__executed=true;
        }
    });
};

Elliptical.viewData={
    get:function(){
        if(!window.__viewData){
            window.__viewData={};
        }
        return window.__viewData;
    },
    set:function(prop,val){
        var context=this.get();
        context[prop]=val;
    },
    clear:function(){
        window.__viewData={};
    }
};