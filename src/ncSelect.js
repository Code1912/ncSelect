/**
 * Created by Code1912 on 2016/7/6.
 */
(function () {
    if(!Array.prototype.findOne) {
        Array.prototype.findOne = function (fn) {
            for (var i = 0; i < this.length; i++) {
                if (fn(this[i])) {
                    return this[i];
                }
            }
            return null;
        }
    }
    if(!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn) {
            for (var i = 0; i < this.length; i++) {
                fn(this[i]);
            }
        }
    }
    if(!Array.prototype.findAll) {
        Array.prototype.findAll = function (fn) {
            var array=[];
            for (var i = 0; i < this.length; i++) {
                if (fn(this[i])) {
                    array.push(this[i]);
                }
            }
            return array;
        }
    }
    if(!Array.prototype.remove){
        Array.prototype.remove=function (item) {
            var index=this.indexOf(item);
            if(index>-1){
                this.splice(index,1);
            }
        }
    }
    if(!Array.prototype.any) {
        Array.prototype.any = function (fn) {
            if (this.length == 0) {
                return false;
            }

            for (var i = 0; i < this.length; i++) {
                if (fn(this[i])) {
                    return true;
                }
            }
            return false;
        }
    }
    if(!Array.prototype.all) {
        Array.prototype.all = function (fn) {
            if (this.length == 0) {
                return false;
            }
            for (var i = 0; i < this.length; i++) {
                if (!fn(this[i])) {
                    return false;
                }
            }
            return true;
        }
    }
    if(!String.prototype.format){
        String.prototype.format = function(args) {
            var result = this;
            if (arguments.length > 0) {
                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {
                        if(args[key]!=undefined){
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] != undefined) {
                            //var reg = new RegExp("({[" + i + "]})", "g");
                            var reg= new RegExp("({)" + i + "(})", "g");
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
            return result;
        }
    }

    if(!Math.uuid)
    {
        Math.uuid = function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        }
    }

    if(!jQuery.ncControl)
    {
        jQuery.ncControl={
            combo:null,
        };
    }
    if(!jQuery.ncUtils) {
        var Utils={};
        jQuery.ncUtils=Utils;
        Utils.Extend = function (ChildClass, SuperClass) {
            var __hasProp = {}.hasOwnProperty;

            function BaseConstructor () {
                this.constructor = ChildClass;
            }

            for (var key in SuperClass) {
                if (__hasProp.call(SuperClass, key)) {
                    ChildClass[key] = SuperClass[key];
                }
            }

            BaseConstructor.prototype = SuperClass.prototype;
            ChildClass.prototype = new BaseConstructor();
            ChildClass.__super__ = SuperClass.prototype;

            return ChildClass;
        };
        var Observable = function () {
            this.listeners = {};
        };
        Observable.prototype.on = function (event, callback) {
            this.listeners = this.listeners || {};

            if (event in this.listeners) {
                this.listeners[event].push(callback);
            } else {
                this.listeners[event] = [callback];
            }
        };

        Observable.prototype.trigger = function (event) {
            var slice = Array.prototype.slice;

            this.listeners = this.listeners || {};

            if (event in this.listeners) {
                this.invoke(this.listeners[event], slice.call(arguments, 1));
            }

            if ('*' in this.listeners) {
                this.invoke(this.listeners['*'], arguments);
            }
        };

        Observable.prototype.invoke = function (listeners, params) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].apply(this, params);
            }
        };
        jQuery.ncUtils.observable=Observable;
    }
})();

(function (ncControl) {
    var _allowType=[String]
    var _prefix='combo';
    var _layerTemplate='<div class="nc-combo-layer"  >\
                    <div  class="nc-combo-container">\
                        <ul>\
                         <li> <input class="nc-combo-input" type="text"/></li>\
                        </ul>\
                    </div>\
                    <div   class="nc-combo-options-container" >\
                        <ul> \
                        </ul>\
                    </div>\
                </div>';
    var _selectedItemTemplate='<li class="selected">\
                             {text}\
                             <span class="nc-combo-selected-remove">&times; </span>\
                            </li>';
    var _optionItemTemplate='<li> {text}</li>';
    var _comboDic={};
    function isAllow(e) {
        return _allowType.any(function (p) {
            return e instanceof p;
        });
    }
    var MultiCombo=function (id) {
        this.id=id;
        this.__selectedItems=[];
        this.__tempDataSource=[];
        this.__dataSrouce=[];
        this.init();
    };
    MultiCombo.prototype.init=function () {
        this.initDom();
        this.initEvent();
    };
    MultiCombo.prototype.initDom=function () {
        this.original=$("#".concat(this.id));
        this.layer=$(_layerTemplate);
        this.selectedContainer=this.layer.find(".nc-combo-container ul");
        this.searchInput=this.layer.find(".nc-combo-container ul li input");
        this.optionsContainer=this.layer.find(".nc-combo-options-container ul");

        this.original.hide();
        this.layer.insertAfter(this.original);
    };
    MultiCombo.prototype.initEvent=function () {
        var that=this;
        that.searchInput.on("focus click",function (e) {
            that.optionsContainer.parent().show();
            e.stopPropagation();
        });
        that.searchInput.on("keyup",function (e) {
            var searchText = $.trim(that.searchInput.val());
            console.log(searchText)
            var needBindDataSource=[];
            if(searchText!==""){
                needBindDataSource=  that.__dataSrouce.findAll(function (p) {
                    return (p.text||"").toString().indexOf(searchText)>-1;
                })
            }
            else
            {
                needBindDataSource= that.__dataSrouce;
            }
            that.__tempDataSource.forEach(function (p) {
                p.dom.remove();
            });
            that.__tempDataSource=[].concat(needBindDataSource);
            that.__tempDataSource.forEach(function (p) {
                p.initEvent();
                that.optionsContainer.append(p.dom);
                if(that.__selectedItems.any(function (n) {
                      return n.value==p.value;
                    })){
                    p.check();
                }else {
                    p.unCheck();
                }
            })

        });
        $(document).on("click",function (e) {
            that.optionsContainer.parent().hide();
        })

    }; 
    MultiCombo.prototype.setOptions=function (opts) {
        var options=$.extend({
            schema:{text:"text",value:"value"},
            dataSource:[],
            selectedItems:[]
        },opts);
        var schema=options.schema; 
        var that=this;
        that.schema=schema;
        that.__tempDataSource=[];
        that.__selectedItems=[];
        options.dataSource.forEach(function (p) {
            var item=new OptionItem(p[schema.text],p[schema.value],p);
            item.clickEvent=function (e,data) {
                if(data.isChecked)
                {
                    that.addSelectedItem(data.text,data.value,data.data)
                }
                else {
                   that.removeSelectedItem(data.value);
                }
            };
            that.optionsContainer.append(item.dom);
            that.__tempDataSource.push(item);
            that.__dataSrouce.push(item);
        });
        options.selectedItems.forEach(function (p) {
            that.addSelectedItem(p[schema.text],p[schema.value],p);
        })
    };
    MultiCombo.prototype.addSelectedItem=function (text, value, originalData) {
        var that=this;
        if(that.__selectedItems.any(function (n) {
                return n.value===value;
            })){
            return;
        };
        var optionItem= that.__tempDataSource.findOne(function (n) {
            return n.value===value;
        });
        if(optionItem)
        {
            optionItem.check();
        }
        var item=new SelectedItem(text,value,originalData);
        item.removeEvent=function (e,data) {
            that.removeSelectedItem(data.value);
        };
        item.dom.insertBefore(that.searchInput.parent());
        that.__selectedItems.push(item);
    };
    MultiCombo.prototype.removeSelectedItem=function (value) {
        var that=this;
        var item=this.__selectedItems.findOne(function (n) {
            return n.value===value;
        });
        if(item){
            that.__selectedItems.remove(item);
            item.dom.remove();
            var optionItem= that.__tempDataSource.findOne(function (n) {
                return n.value===value;
            });
            if(optionItem)
            {
                optionItem.unCheck();
            }
        }
    };
    MultiCombo.prototype.getSelected=function () {
        var array=[];
        this.__selectedItems.forEach(function (res) {
            array.push(res.data)
        });
        return array;
    };
    MultiCombo.prototype.setSelected=function (data) {
         if(data.constructor !== Array){
             return
         };
        var that=this;
        this.__selectedItems.forEach(function (p) {
            p.dom.remove();
        });
        this.__selectedItems=[];
        this.__tempDataSource.forEach(function (p) {
            p.unCheck();
        });
        data.forEach(function (p) {
            var findItem=that.__tempDataSource.findOne(function (n) {
              return  n.value==p[that.schema.value];
            });
            if(!findItem)
            {
                return;
            }
            that.addSelectedItem(p[that.schema.text],p[that.schema.value],p);
        });
    };
    MultiCombo.prototype.getSelected=function () {
        var array=[];
        this.__selectedItems.forEach(function (res) {
            array.push(res.data)
        });
        return array;
    };
    var OptionItem=function (text,value,originalData) {
        this.text=text;
        this.value=value;
        this.clickEvent=null;
        this.isChecked=false;
        this.data=originalData;
        this.init();
    };
    OptionItem.prototype.init=function () {
        this.initDom();
        this.initEvent();
    };
    OptionItem.prototype.initDom=function () {
        this.dom=$(_optionItemTemplate.replace(/\{text}/g,this.text));
    };
    OptionItem.prototype.initEvent=function () {
        var that=this;
        this.dom.on("click",function (e) {
            if(that.isChecked)
            {
                that.unCheck();
            }
            else
            {
                that.check();
            }
            if(that.clickEvent)
            {
                that.clickEvent(e,that);
            }
            e.stopPropagation();
        });
    };
    OptionItem.prototype.check=function () {
        this.isChecked=true;
        this.dom.addClass("selected");
    };
    OptionItem.prototype.unCheck=function () {
        this.isChecked=false;
        this.dom.removeClass();
    };

    var SelectedItem=function (text, value,originalData) {
        this.text=text;
        this.value=value;
        this.data=originalData;
        this.removeEvent=null;
        this.init();
    };
    SelectedItem.prototype.init=function () {
        this.initDom();
        this.initEvent();
    }
    SelectedItem.prototype.initDom=function () {
        this.dom=$(_selectedItemTemplate.replace(/\{text}/g,this.text));
        this.removeDom=this.dom.find(".nc-combo-selected-remove");
    };

    SelectedItem.prototype.initEvent=function () {
        var that=this;
        this.removeDom.on("click",function (e) {

            if(that.removeEvent)
            {
                that.removeEvent(e,that);
            }
            e.stopPropagation();
        });
    };

    ncControl.multiCombo=  function  (id) {
        var item = _comboDic[id];
        if (item) {
            return item;
        }

        var combo = new MultiCombo(id);
        _comboDic[id] = combo;
        return combo;
    }
})(jQuery.ncControl)