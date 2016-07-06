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
    if(!Array.prototype.any) {
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
                            //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
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
    }
})();

(function (ncControl) {
    var _allowType=[String,jQuery]
    var _prefix="combo";
    var _template="<div></div>";
    var _comboArray=[];
    function isAllow(e) {
        return _allowType.any(function (p) {
            return e instanceof p;
        });
    }
    var BaseCombo=function (ele) {


    }
    function combo(jqObj ) {
        var $self=this;
        $self.id=Math.uuid();
        jqObj.attr("nc-id",this.id);
        $self._jqObj=jqObj;
        $self.setOptions=function (opt) {

        }
        $self.destroy=function () {
            $self._jqObj.remove();
        }
    }

    function setDefaults(opt) {
        return $.extend({

        },opt);
    }
    ncControl.combo=  function  (obj) {
        if (isAllow(obj)) {
            return null;
        }
        var comboJq = obj instanceof String ? $(obj) : obj;
        if (comboJq.length == 0) {
            return
        }
        var combo = _comboArray.findOne(function (p) {
            return p.id = comboJq.attr("nc-id");
        });
        if (combo) {
            return combo;
        }
        return new combo(combo[0]);
    }
})(jQuery.ncControl)