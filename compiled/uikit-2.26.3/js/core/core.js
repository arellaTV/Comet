"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (core) {

    if (typeof define == "function" && define.amd) {
        // AMD

        define("uikit", function () {

            var uikit = window.UIkit || core(window, window.jQuery, window.document);

            uikit.load = function (res, req, onload, config) {

                var resources = res.split(','),
                    load = [],
                    i,
                    base = (config.config && config.config.uikit && config.config.uikit.base ? config.config.uikit.base : "").replace(/\/+$/g, "");

                if (!base) {
                    throw new Error("Please define base path to UIkit in the requirejs config.");
                }

                for (i = 0; i < resources.length; i += 1) {
                    var resource = resources[i].replace(/\./g, '/');
                    load.push(base + '/components/' + resource);
                }

                req(load, function () {
                    onload(uikit);
                });
            };

            return uikit;
        });
    }

    if (!window.jQuery) {
        throw new Error("UIkit requires jQuery");
    }

    if (window && window.jQuery) {
        core(window, window.jQuery, window.document);
    }
})(function (global, $, doc) {

    "use strict";

    var UI = {},
        _UI = global.UIkit ? Object.create(global.UIkit) : undefined;

    UI.version = '2.26.3';

    UI.noConflict = function () {
        // restore UIkit version
        if (_UI) {
            global.UIkit = _UI;
            $.UIkit = _UI;
            $.fn.uk = _UI.fn;
        }

        return UI;
    };

    UI.prefix = function (str) {
        return str;
    };

    // cache jQuery
    UI.$ = $;

    UI.$doc = UI.$(document);
    UI.$win = UI.$(window);
    UI.$html = UI.$('html');

    UI.support = {};
    UI.support.transition = function () {

        var transitionEnd = function () {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            },
                name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }();

        return transitionEnd && { end: transitionEnd };
    }();

    UI.support.animation = function () {

        var animationEnd = function () {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                WebkitAnimation: 'webkitAnimationEnd',
                MozAnimation: 'animationend',
                OAnimation: 'oAnimationEnd oanimationend',
                animation: 'animationend'
            },
                name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }();

        return animationEnd && { end: animationEnd };
    }();

    // requestAnimationFrame polyfill
    //https://github.com/darius/requestAnimationFrame
    (function () {

        Date.now = Date.now || function () {
            return new Date().getTime();
        };

        var vendors = ['webkit', 'moz'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function (callback) {
                var now = Date.now();
                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function () {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
        }
    })();

    UI.support.touch = 'ontouchstart' in document || global.DocumentTouch && document instanceof global.DocumentTouch || global.navigator.msPointerEnabled && global.navigator.msMaxTouchPoints > 0 || //IE 10
    global.navigator.pointerEnabled && global.navigator.maxTouchPoints > 0 || //IE >=11
    false;

    UI.support.mutationobserver = global.MutationObserver || global.WebKitMutationObserver || null;

    UI.Utils = {};

    UI.Utils.isFullscreen = function () {
        return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
    };

    UI.Utils.str2json = function (str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                // wrap keys without quote with valid double quote
                .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                    return '"' + $1 + '":';
                })
                // replacing single quote wrapped ones to double quote
                .replace(/'([^']+)'/g, function (_, $1) {
                    return '"' + $1 + '"';
                }));
            } else {
                return new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));")();
            }
        } catch (e) {
            return false;
        }
    };

    UI.Utils.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function later() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.Utils.throttle = function (func, limit) {
        var wait = false;
        return function () {
            if (!wait) {
                func.call();
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        };
    };

    UI.Utils.removeCssRules = function (selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if (!selectorRegEx) return;

        setTimeout(function () {
            try {
                _ref = document.styleSheets;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stylesheet = _ref[_i];
                    idxs = [];
                    stylesheet.cssRules = stylesheet.cssRules;
                    for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                        if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                            idxs.unshift(idx);
                        }
                    }
                    for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                        stylesheet.deleteRule(idxs[_k]);
                    }
                }
            } catch (_error) {}
        }, 0);
    };

    UI.Utils.isInView = function (element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = UI.$win.scrollLeft(),
            window_top = UI.$win.scrollTop(),
            offset = $element.offset(),
            left = offset.left,
            top = offset.top;

        options = $.extend({ topoffset: 0, leftoffset: 0 }, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + UI.$win.height() && left + $element.width() >= window_left && left - options.leftoffset <= window_left + UI.$win.width()) {
            return true;
        } else {
            return false;
        }
    };

    UI.Utils.checkDisplay = function (context, initanimation) {

        var elements = UI.$('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]', context || document),
            animated;

        if (context && !elements.length) {
            elements = $(context);
        }

        elements.trigger('display.uk.check');

        // fix firefox / IE animations
        if (initanimation) {

            if (typeof initanimation != 'string') {
                initanimation = '[class*="uk-animation-"]';
            }

            elements.find(initanimation).each(function () {

                var ele = UI.$(this),
                    cls = ele.attr('class'),
                    anim = cls.match(/uk\-animation\-(.+)/);

                ele.removeClass(anim[0]).width();

                ele.addClass(anim[0]);
            });
        }

        return elements;
    };

    UI.Utils.options = function (string) {

        if ($.type(string) != 'string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{' + string + '}';
        }

        var start = string ? string.indexOf("{") : -1,
            options = {};

        if (start != -1) {
            try {
                options = UI.Utils.str2json(string.substr(start));
            } catch (e) {}
        }

        return options;
    };

    UI.Utils.animate = function (element, cls) {

        var d = $.Deferred();

        element = UI.$(element);

        element.css('display', 'none').addClass(cls).one(UI.support.animation.end, function () {
            element.removeClass(cls);
            d.resolve();
        });

        element.css('display', '');

        return d.promise();
    };

    UI.Utils.uid = function (prefix) {
        return (prefix || 'id') + new Date().getTime() + "RAND" + Math.ceil(Math.random() * 100000);
    };

    UI.Utils.template = function (str, data) {

        var tokens = str.replace(/\n/g, '\\n').replace(/\{\{\{\s*(.+?)\s*\}\}\}/g, "{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),
            i = 0,
            toc,
            cmd,
            prop,
            val,
            fn,
            output = [],
            openblocks = 0;

        while (i < tokens.length) {

            toc = tokens[i];

            if (toc.match(/\{\{\s*(.+?)\s*\}\}/)) {
                i = i + 1;
                toc = tokens[i];
                cmd = toc[0];
                prop = toc.substring(toc.match(/^(\^|\#|\!|\~|\:)/) ? 1 : 0);

                switch (cmd) {
                    case '~':
                        output.push("for(var $i=0;$i<" + prop + ".length;$i++) { var $item = " + prop + "[$i];");
                        openblocks++;
                        break;
                    case ':':
                        output.push("for(var $key in " + prop + ") { var $val = " + prop + "[$key];");
                        openblocks++;
                        break;
                    case '#':
                        output.push("if(" + prop + ") {");
                        openblocks++;
                        break;
                    case '^':
                        output.push("if(!" + prop + ") {");
                        openblocks++;
                        break;
                    case '/':
                        output.push("}");
                        openblocks--;
                        break;
                    case '!':
                        output.push("__ret.push(" + prop + ");");
                        break;
                    default:
                        output.push("__ret.push(escape(" + prop + "));");
                        break;
                }
            } else {
                output.push("__ret.push('" + toc.replace(/\'/g, "\\'") + "');");
            }
            i = i + 1;
        }

        fn = new Function('$data', ['var __ret = [];', 'try {', 'with($data){', !openblocks ? output.join('') : '__ret = ["Not all blocks are closed correctly."]', '};', '}catch(e){__ret = [e.message];}', 'return __ret.join("").replace(/\\n\\n/g, "\\n");', "function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"].join("\n"));

        return data ? fn(data) : fn;
    };

    UI.Utils.events = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    global.UIkit = UI;

    // deprecated

    UI.fn = function (command, options) {

        var args = arguments,
            cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),
            component = cmd[1],
            method = cmd[2];

        if (!UI[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function () {
            var $this = $(this),
                data = $this.data(component);
            if (!data) $this.data(component, data = UI[component](this, method ? undefined : options));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

    $.UIkit = UI;
    $.fn.uk = UI.fn;

    UI.langdirection = UI.$html.attr("dir") == "rtl" ? "right" : "left";

    UI.components = {};

    UI.component = function (name, def) {

        var fn = function fn(element, options) {

            var $this = this;

            this.UIkit = UI;
            this.element = element ? UI.$(element) : null;
            this.options = $.extend(true, {}, this.defaults, options);
            this.plugins = {};

            if (this.element) {
                this.element.data(name, this);
            }

            this.init();

            (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function (plugin) {

                if (fn.plugins[plugin].init) {
                    fn.plugins[plugin].init($this);
                    $this.plugins[plugin] = true;
                }
            });

            this.trigger('init.uk.component', [name, this]);

            return this;
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults: { plugins: [] },

            boot: function boot() {},
            init: function init() {},

            on: function on(a1, a2, a3) {
                return UI.$(this.element || this).on(a1, a2, a3);
            },

            one: function one(a1, a2, a3) {
                return UI.$(this.element || this).one(a1, a2, a3);
            },

            off: function off(evt) {
                return UI.$(this.element || this).off(evt);
            },

            trigger: function trigger(evt, params) {
                return UI.$(this.element || this).trigger(evt, params);
            },

            find: function find(selector) {
                return UI.$(this.element ? this.element : []).find(selector);
            },

            proxy: function proxy(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function (method) {
                    if (!$this[method]) $this[method] = function () {
                        return obj[method].apply(obj, arguments);
                    };
                });
            },

            mixin: function mixin(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function (method) {
                    if (!$this[method]) $this[method] = obj[method].bind($this);
                });
            },

            option: function option() {

                if (arguments.length == 1) {
                    return this.options[arguments[0]] || undefined;
                } else if (arguments.length == 2) {
                    this.options[arguments[0]] = arguments[1];
                }
            }

        }, def);

        this.components[name] = fn;

        this[name] = function () {

            var element, options;

            if (arguments.length) {

                switch (arguments.length) {
                    case 1:

                        if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
                            element = $(arguments[0]);
                        } else {
                            options = arguments[0];
                        }

                        break;
                    case 2:

                        element = $(arguments[0]);
                        options = arguments[1];
                        break;
                }
            }

            if (element && element.data(name)) {
                return element.data(name);
            }

            return new UI.components[name](element, options);
        };

        if (UI.domready) {
            UI.component.boot(name);
        }

        return fn;
    };

    UI.plugin = function (component, name, def) {
        this.components[component].plugins[name] = def;
    };

    UI.component.boot = function (name) {

        if (UI.components[name].prototype && UI.components[name].prototype.boot && !UI.components[name].booted) {
            UI.components[name].prototype.boot.apply(UI, []);
            UI.components[name].booted = true;
        }
    };

    UI.component.bootComponents = function () {

        for (var component in UI.components) {
            UI.component.boot(component);
        }
    };

    // DOM mutation save ready helper function

    UI.domObservers = [];
    UI.domready = false;

    UI.ready = function (fn) {

        UI.domObservers.push(fn);

        if (UI.domready) {
            fn(document);
        }
    };

    UI.on = function (a1, a2, a3) {

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
        }

        return UI.$doc.on(a1, a2, a3);
    };

    UI.one = function (a1, a2, a3) {

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
            return UI.$doc;
        }

        return UI.$doc.one(a1, a2, a3);
    };

    UI.trigger = function (evt, params) {
        return UI.$doc.trigger(evt, params);
    };

    UI.domObserve = function (selector, fn) {

        if (!UI.support.mutationobserver) return;

        fn = fn || function () {};

        UI.$(selector).each(function () {

            var element = this,
                $element = UI.$(element);

            if ($element.data('observer')) {
                return;
            }

            try {

                var observer = new UI.support.mutationobserver(UI.Utils.debounce(function (mutations) {
                    fn.apply(element, []);
                    $element.trigger('changed.uk.dom');
                }, 50), { childList: true, subtree: true });

                // pass in the target node, as well as the observer options
                observer.observe(element, { childList: true, subtree: true });

                $element.data('observer', observer);
            } catch (e) {}
        });
    };

    UI.init = function (root) {

        root = root || document;

        UI.domObservers.forEach(function (fn) {
            fn(root);
        });
    };

    UI.on('domready.uk.dom', function () {

        UI.init();

        if (UI.domready) UI.Utils.checkDisplay();
    });

    document.addEventListener('DOMContentLoaded', function () {

        var domReady = function domReady() {

            UI.$body = UI.$('body');

            UI.trigger('beforeready.uk.dom');

            UI.component.bootComponents();

            // custom scroll observer
            requestAnimationFrame(function () {

                var memory = { dir: { x: 0, y: 0 }, x: window.pageXOffset, y: window.pageYOffset };

                var fn = function fn() {
                    // reading this (window.page[X|Y]Offset) causes a full page recalc of the layout in Chrome,
                    // so we only want to do this once
                    var wpxo = window.pageXOffset;
                    var wpyo = window.pageYOffset;

                    // Did the scroll position change since the last time we were here?
                    if (memory.x != wpxo || memory.y != wpyo) {

                        // Set the direction of the scroll and store the new position
                        if (wpxo != memory.x) {
                            memory.dir.x = wpxo > memory.x ? 1 : -1;
                        } else {
                            memory.dir.x = 0;
                        }
                        if (wpyo != memory.y) {
                            memory.dir.y = wpyo > memory.y ? 1 : -1;
                        } else {
                            memory.dir.y = 0;
                        }

                        memory.x = wpxo;
                        memory.y = wpyo;

                        // Trigger the scroll event, this could probably be sent using memory.clone() but this is
                        // more explicit and easier to see exactly what is being sent in the event.
                        UI.$doc.trigger('scrolling.uk.document', [{
                            "dir": { "x": memory.dir.x, "y": memory.dir.y }, "x": wpxo, "y": wpyo
                        }]);
                    }

                    requestAnimationFrame(fn);
                };

                if (UI.support.touch) {
                    UI.$html.on('touchmove touchend MSPointerMove MSPointerUp pointermove pointerup', fn);
                }

                if (memory.x || memory.y) fn();

                return fn;
            }());

            // run component init functions on dom
            UI.trigger('domready.uk.dom');

            if (UI.support.touch) {

                // remove css hover rules for touch devices
                // UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);

                // viewport unit fix for uk-height-viewport - should be fixed in iOS 8
                if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

                    UI.$win.on('load orientationchange resize', UI.Utils.debounce(function () {

                        var fn = function fn() {
                            $('.uk-height-viewport').css('height', window.innerHeight);
                            return fn;
                        };

                        return fn();
                    }(), 100));
                }
            }

            UI.trigger('afterready.uk.dom');

            // mark that domready is left behind
            UI.domready = true;

            // auto init js components
            if (UI.support.mutationobserver) {

                var initFn = UI.Utils.debounce(function () {
                    requestAnimationFrame(function () {
                        UI.init(document.body);
                    });
                }, 10);

                new UI.support.mutationobserver(function (mutations) {

                    var init = false;

                    mutations.every(function (mutation) {

                        if (mutation.type != 'childList') return true;

                        for (var i = 0, node; i < mutation.addedNodes.length; ++i) {

                            node = mutation.addedNodes[i];

                            if (node.outerHTML && node.outerHTML.indexOf('data-uk-') !== -1) {
                                return (init = true) && false;
                            }
                        }
                        return true;
                    });

                    if (init) initFn();
                }).observe(document.body, { childList: true, subtree: true });
            }
        };

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            setTimeout(domReady);
        }

        return domReady;
    }());

    // add touch identifier class
    UI.$html.addClass(UI.support.touch ? "uk-touch" : "uk-notouch");

    // add uk-hover class on tap to support overlays on touch devices
    if (UI.support.touch) {

        var hoverset = false,
            exclude,
            hovercls = 'uk-hover',
            selector = '.uk-overlay, .uk-overlay-hover, .uk-overlay-toggle, .uk-animation-hover, .uk-has-hover';

        UI.$html.on('mouseenter touchstart MSPointerDown pointerdown', selector, function () {

            if (hoverset) $('.' + hovercls).removeClass(hovercls);

            hoverset = $(this).addClass(hovercls);
        }).on('mouseleave touchend MSPointerUp pointerup', function (e) {

            exclude = $(e.target).parents(selector);

            if (hoverset) {
                hoverset.not(exclude).removeClass(hovercls);
            }
        });
    }

    return UI;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLElBQVQsRUFBZTs7QUFFWixRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDOzs7QUFFM0MsZUFBTyxPQUFQLEVBQWdCLFlBQVU7O0FBRXRCLGdCQUFJLFFBQVEsT0FBTyxLQUFQLElBQWdCLEtBQUssTUFBTCxFQUFhLE9BQU8sTUFBcEIsRUFBNEIsT0FBTyxRQUFuQyxDQUE1Qjs7QUFFQSxrQkFBTSxJQUFOLEdBQWEsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixNQUFuQixFQUEyQixNQUEzQixFQUFtQzs7QUFFNUMsb0JBQUksWUFBWSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQWhCO0FBQUEsb0JBQWdDLE9BQU8sRUFBdkM7QUFBQSxvQkFBMkMsQ0FBM0M7QUFBQSxvQkFBOEMsT0FBTyxDQUFDLE9BQU8sTUFBUCxJQUFpQixPQUFPLE1BQVAsQ0FBYyxLQUEvQixJQUF3QyxPQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLElBQTVELEdBQW1FLE9BQU8sTUFBUCxDQUFjLEtBQWQsQ0FBb0IsSUFBdkYsR0FBOEYsRUFBL0YsRUFBbUcsT0FBbkcsQ0FBMkcsT0FBM0csRUFBb0gsRUFBcEgsQ0FBckQ7O0FBRUEsb0JBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCwwQkFBTSxJQUFJLEtBQUosQ0FBVywyREFBWCxDQUFOO0FBQ0g7O0FBRUQscUJBQUssSUFBSSxDQUFULEVBQVksSUFBSSxVQUFVLE1BQTFCLEVBQWtDLEtBQUssQ0FBdkMsRUFBMEM7QUFDdEMsd0JBQUksV0FBVyxVQUFVLENBQVYsRUFBYSxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLEdBQTVCLENBQWY7QUFDQSx5QkFBSyxJQUFMLENBQVUsT0FBSyxjQUFMLEdBQW9CLFFBQTlCO0FBQ0g7O0FBRUQsb0JBQUksSUFBSixF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LFFBQVQsQ0FBa0IsR0FBRyxPQUFILENBQVcsS0FBWCxHQUFtQixVQUFuQixHQUFnQyxZQUFsRDs7O0FBR0EsUUFBSSxHQUFHLE9BQUgsQ0FBVyxLQUFmLEVBQXNCOztBQUVsQixZQUFJLFdBQVcsS0FBZjtBQUFBLFlBQ0ksT0FESjtBQUFBLFlBRUksV0FBVyxVQUZmO0FBQUEsWUFHSSxXQUFXLHdGQUhmOztBQUtBLFdBQUcsS0FBSCxDQUFTLEVBQVQsQ0FBWSxpREFBWixFQUErRCxRQUEvRCxFQUF5RSxZQUFXOztBQUVoRixnQkFBSSxRQUFKLEVBQWMsRUFBRSxNQUFJLFFBQU4sRUFBZ0IsV0FBaEIsQ0FBNEIsUUFBNUI7O0FBRWQsdUJBQVcsRUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixRQUFqQixDQUFYO0FBRUgsU0FORCxFQU1HLEVBTkgsQ0FNTSwyQ0FOTixFQU1tRCxVQUFTLENBQVQsRUFBWTs7QUFFM0Qsc0JBQVUsRUFBRSxFQUFFLE1BQUosRUFBWSxPQUFaLENBQW9CLFFBQXBCLENBQVY7O0FBRUEsZ0JBQUksUUFBSixFQUFjO0FBQ1YseUJBQVMsR0FBVCxDQUFhLE9BQWIsRUFBc0IsV0FBdEIsQ0FBa0MsUUFBbEM7QUFDSDtBQUNKLFNBYkQ7QUFjSDs7QUFFRCxXQUFPLEVBQVA7QUFDSCxDQS93QkQiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihjb3JlKSB7XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgeyAvLyBBTURcblxuICAgICAgICBkZWZpbmUoXCJ1aWtpdFwiLCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB2YXIgdWlraXQgPSB3aW5kb3cuVUlraXQgfHwgY29yZSh3aW5kb3csIHdpbmRvdy5qUXVlcnksIHdpbmRvdy5kb2N1bWVudCk7XG5cbiAgICAgICAgICAgIHVpa2l0LmxvYWQgPSBmdW5jdGlvbihyZXMsIHJlcSwgb25sb2FkLCBjb25maWcpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZXMgPSByZXMuc3BsaXQoJywnKSwgbG9hZCA9IFtdLCBpLCBiYXNlID0gKGNvbmZpZy5jb25maWcgJiYgY29uZmlnLmNvbmZpZy51aWtpdCAmJiBjb25maWcuY29uZmlnLnVpa2l0LmJhc2UgPyBjb25maWcuY29uZmlnLnVpa2l0LmJhc2UgOiBcIlwiKS5yZXBsYWNlKC9cXC8rJC9nLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghYmFzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiUGxlYXNlIGRlZmluZSBiYXNlIHBhdGggdG8gVUlraXQgaW4gdGhlIHJlcXVpcmVqcyBjb25maWcuXCIgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmVzb3VyY2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZSA9IHJlc291cmNlc1tpXS5yZXBsYWNlKC9cXC4vZywgJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZC5wdXNoKGJhc2UrJy9jb21wb25lbnRzLycrcmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlcShsb2FkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgb25sb2FkKHVpa2l0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB1aWtpdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cualF1ZXJ5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVSWtpdCByZXF1aXJlcyBqUXVlcnlcIiApO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cgJiYgd2luZG93LmpRdWVyeSkge1xuICAgICAgICBjb3JlKHdpbmRvdywgd2luZG93LmpRdWVyeSwgd2luZG93LmRvY3VtZW50KTtcbiAgICB9XG5cblxufSkoZnVuY3Rpb24oZ2xvYmFsLCAkLCBkb2MpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFVJID0ge30sIF9VSSA9IGdsb2JhbC5VSWtpdCA/IE9iamVjdC5jcmVhdGUoZ2xvYmFsLlVJa2l0KSA6IHVuZGVmaW5lZDtcblxuICAgIFVJLnZlcnNpb24gPSAnMi4yNi4zJztcblxuICAgIFVJLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gcmVzdG9yZSBVSWtpdCB2ZXJzaW9uXG4gICAgICAgIGlmIChfVUkpIHtcbiAgICAgICAgICAgIGdsb2JhbC5VSWtpdCA9IF9VSTtcbiAgICAgICAgICAgICQuVUlraXQgICAgICA9IF9VSTtcbiAgICAgICAgICAgICQuZm4udWsgICAgICA9IF9VSS5mbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBVSTtcbiAgICB9O1xuXG4gICAgVUkucHJlZml4ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfTtcblxuICAgIC8vIGNhY2hlIGpRdWVyeVxuICAgIFVJLiQgPSAkO1xuXG4gICAgVUkuJGRvYyAgPSBVSS4kKGRvY3VtZW50KTtcbiAgICBVSS4kd2luICA9IFVJLiQod2luZG93KTtcbiAgICBVSS4kaHRtbCA9IFVJLiQoJ2h0bWwnKTtcblxuICAgIFVJLnN1cHBvcnQgPSB7fTtcbiAgICBVSS5zdXBwb3J0LnRyYW5zaXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25FbmQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jLmJvZHkgfHwgZG9jLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE1velRyYW5zaXRpb24gICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25FbmQgJiYgeyBlbmQ6IHRyYW5zaXRpb25FbmQgfTtcbiAgICB9KSgpO1xuXG4gICAgVUkuc3VwcG9ydC5hbmltYXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2MuYm9keSB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgICAgIGFuaW1FbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb24gOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uICAgIDogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb24gICAgICA6ICdvQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gICAgICAgOiAnYW5pbWF0aW9uZW5kJ1xuICAgICAgICAgICAgICAgIH0sIG5hbWU7XG5cbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBhbmltRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiBhbmltRW5kRXZlbnROYW1lc1tuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSgpKTtcblxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uRW5kICYmIHsgZW5kOiBhbmltYXRpb25FbmQgfTtcbiAgICB9KSgpO1xuXG4gICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vZGFyaXVzL3JlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgIChmdW5jdGlvbigpIHtcblxuICAgICAgICBEYXRlLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgICAgICAgdmFyIHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gICAgICAgICAgICB2YXIgdnAgPSB2ZW5kb3JzW2ldO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2cCsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSAod2luZG93W3ZwKydDYW5jZWxBbmltYXRpb25GcmFtZSddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdnArJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSAvLyBpT1M2IGlzIGJ1Z2d5XG4gICAgICAgICAgICB8fCAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCAhd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRUaW1lID0gTWF0aC5tYXgobGFzdFRpbWUgKyAxNiwgbm93KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sobGFzdFRpbWUgPSBuZXh0VGltZSk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRpbWUgLSBub3cpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0oKSk7XG5cbiAgICBVSS5zdXBwb3J0LnRvdWNoID0gKFxuICAgICAgICAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQpIHx8XG4gICAgICAgIChnbG9iYWwuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIGdsb2JhbC5Eb2N1bWVudFRvdWNoKSAgfHxcbiAgICAgICAgKGdsb2JhbC5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCAmJiBnbG9iYWwubmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAvL0lFIDEwXG4gICAgICAgIChnbG9iYWwubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICYmIGdsb2JhbC5uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwKSB8fCAvL0lFID49MTFcbiAgICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgVUkuc3VwcG9ydC5tdXRhdGlvbm9ic2VydmVyID0gKGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyIHx8IG51bGwpO1xuXG4gICAgVUkuVXRpbHMgPSB7fTtcblxuICAgIFVJLlV0aWxzLmlzRnVsbHNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCB8fCBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBmYWxzZTtcbiAgICB9O1xuXG4gICAgVUkuVXRpbHMuc3RyMmpzb24gPSBmdW5jdGlvbihzdHIsIG5vdGV2aWwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChub3RldmlsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdyYXAga2V5cyB3aXRob3V0IHF1b3RlIHdpdGggdmFsaWQgZG91YmxlIHF1b3RlXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oW1xcJFxcd10rKVxccyo6L2csIGZ1bmN0aW9uKF8sICQxKXtyZXR1cm4gJ1wiJyskMSsnXCI6Jzt9KVxuICAgICAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmcgc2luZ2xlIHF1b3RlIHdyYXBwZWQgb25lcyB0byBkb3VibGUgcXVvdGVcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycoW14nXSspJy9nLCBmdW5jdGlvbihfLCAkMSl7cmV0dXJuICdcIicrJDErJ1wiJzt9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAobmV3IEZ1bmN0aW9uKFwiXCIsIFwidmFyIGpzb24gPSBcIiArIHN0ciArIFwiOyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShqc29uKSk7XCIpKSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHZhciB0aW1lb3V0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBVSS5VdGlscy50aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCBsaW1pdCkge1xuICAgICAgICB2YXIgd2FpdCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF3YWl0KSB7XG4gICAgICAgICAgICAgICAgZnVuYy5jYWxsKCk7XG4gICAgICAgICAgICAgICAgd2FpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LCBsaW1pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVUkuVXRpbHMucmVtb3ZlQ3NzUnVsZXMgPSBmdW5jdGlvbihzZWxlY3RvclJlZ0V4KSB7XG4gICAgICAgIHZhciBpZHgsIGlkeHMsIHN0eWxlc2hlZXQsIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZjtcblxuICAgICAgICBpZighc2VsZWN0b3JSZWdFeCkgcmV0dXJuO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIF9yZWYgPSBkb2N1bWVudC5zdHlsZVNoZWV0cztcbiAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldCA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgICAgIGlkeHMgPSBbXTtcbiAgICAgICAgICAgICAgICBzdHlsZXNoZWV0LmNzc1J1bGVzID0gc3R5bGVzaGVldC5jc3NSdWxlcztcbiAgICAgICAgICAgICAgICBmb3IgKGlkeCA9IF9qID0gMCwgX2xlbjEgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgaWR4ID0gKytfaikge1xuICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlc2hlZXQuY3NzUnVsZXNbaWR4XS50eXBlID09PSBDU1NSdWxlLlNUWUxFX1JVTEUgJiYgc2VsZWN0b3JSZWdFeC50ZXN0KHN0eWxlc2hlZXQuY3NzUnVsZXNbaWR4XS5zZWxlY3RvclRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkeHMudW5zaGlmdChpZHgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBpZHhzLmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGlkeHNbX2tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgICAgfSwgMCk7XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLmlzSW5WaWV3ID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCEkZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdpbmRvd19sZWZ0ID0gVUkuJHdpbi5zY3JvbGxMZWZ0KCksIHdpbmRvd190b3AgPSBVSS4kd2luLnNjcm9sbFRvcCgpLCBvZmZzZXQgPSAkZWxlbWVudC5vZmZzZXQoKSwgbGVmdCA9IG9mZnNldC5sZWZ0LCB0b3AgPSBvZmZzZXQudG9wO1xuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7dG9wb2Zmc2V0OjAsIGxlZnRvZmZzZXQ6MH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICh0b3AgKyAkZWxlbWVudC5oZWlnaHQoKSA+PSB3aW5kb3dfdG9wICYmIHRvcCAtIG9wdGlvbnMudG9wb2Zmc2V0IDw9IHdpbmRvd190b3AgKyBVSS4kd2luLmhlaWdodCgpICYmXG4gICAgICAgICAgICBsZWZ0ICsgJGVsZW1lbnQud2lkdGgoKSA+PSB3aW5kb3dfbGVmdCAmJiBsZWZ0IC0gb3B0aW9ucy5sZWZ0b2Zmc2V0IDw9IHdpbmRvd19sZWZ0ICsgVUkuJHdpbi53aWR0aCgpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSA9IGZ1bmN0aW9uKGNvbnRleHQsIGluaXRhbmltYXRpb24pIHtcblxuICAgICAgICB2YXIgZWxlbWVudHMgPSBVSS4kKCdbZGF0YS11ay1tYXJnaW5dLCBbZGF0YS11ay1ncmlkLW1hdGNoXSwgW2RhdGEtdWstZ3JpZC1tYXJnaW5dLCBbZGF0YS11ay1jaGVjay1kaXNwbGF5XScsIGNvbnRleHQgfHwgZG9jdW1lbnQpLCBhbmltYXRlZDtcblxuICAgICAgICBpZiAoY29udGV4dCAmJiAhZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtZW50cyA9ICQoY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50cy50cmlnZ2VyKCdkaXNwbGF5LnVrLmNoZWNrJyk7XG5cbiAgICAgICAgLy8gZml4IGZpcmVmb3ggLyBJRSBhbmltYXRpb25zXG4gICAgICAgIGlmIChpbml0YW5pbWF0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoaW5pdGFuaW1hdGlvbikhPSdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5pdGFuaW1hdGlvbiA9ICdbY2xhc3MqPVwidWstYW5pbWF0aW9uLVwiXSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLmZpbmQoaW5pdGFuaW1hdGlvbikuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZSAgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBjbHMgID0gZWxlLmF0dHIoJ2NsYXNzJyksXG4gICAgICAgICAgICAgICAgICAgIGFuaW0gPSBjbHMubWF0Y2goL3VrXFwtYW5pbWF0aW9uXFwtKC4rKS8pO1xuXG4gICAgICAgICAgICAgICAgZWxlLnJlbW92ZUNsYXNzKGFuaW1bMF0pLndpZHRoKCk7XG5cbiAgICAgICAgICAgICAgICBlbGUuYWRkQ2xhc3MoYW5pbVswXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9O1xuXG4gICAgVUkuVXRpbHMub3B0aW9ucyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXG4gICAgICAgIGlmICgkLnR5cGUoc3RyaW5nKSE9J3N0cmluZycpIHJldHVybiBzdHJpbmc7XG5cbiAgICAgICAgaWYgKHN0cmluZy5pbmRleE9mKCc6JykgIT0gLTEgJiYgc3RyaW5nLnRyaW0oKS5zdWJzdHIoLTEpICE9ICd9Jykge1xuICAgICAgICAgICAgc3RyaW5nID0gJ3snK3N0cmluZysnfSc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhcnQgPSAoc3RyaW5nID8gc3RyaW5nLmluZGV4T2YoXCJ7XCIpIDogLTEpLCBvcHRpb25zID0ge307XG5cbiAgICAgICAgaWYgKHN0YXJ0ICE9IC0xKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBVSS5VdGlscy5zdHIyanNvbihzdHJpbmcuc3Vic3RyKHN0YXJ0KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLmFuaW1hdGUgPSBmdW5jdGlvbihlbGVtZW50LCBjbHMpIHtcblxuICAgICAgICB2YXIgZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBlbGVtZW50ID0gVUkuJChlbGVtZW50KTtcblxuICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICdub25lJykuYWRkQ2xhc3MoY2xzKS5vbmUoVUkuc3VwcG9ydC5hbmltYXRpb24uZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2xzKTtcbiAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICcnKTtcblxuICAgICAgICByZXR1cm4gZC5wcm9taXNlKCk7XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLnVpZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgICByZXR1cm4gKHByZWZpeCB8fCAnaWQnKSArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSkrXCJSQU5EXCIrKE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogMTAwMDAwKSk7XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLnRlbXBsYXRlID0gZnVuY3Rpb24oc3RyLCBkYXRhKSB7XG5cbiAgICAgICAgdmFyIHRva2VucyA9IHN0ci5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJykucmVwbGFjZSgvXFx7XFx7XFx7XFxzKiguKz8pXFxzKlxcfVxcfVxcfS9nLCBcInt7ISQxfX1cIikuc3BsaXQoLyhcXHtcXHtcXHMqKC4rPylcXHMqXFx9XFx9KS9nKSxcbiAgICAgICAgICAgIGk9MCwgdG9jLCBjbWQsIHByb3AsIHZhbCwgZm4sIG91dHB1dCA9IFtdLCBvcGVuYmxvY2tzID0gMDtcblxuICAgICAgICB3aGlsZShpIDwgdG9rZW5zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICB0b2MgPSB0b2tlbnNbaV07XG5cbiAgICAgICAgICAgIGlmKHRvYy5tYXRjaCgvXFx7XFx7XFxzKiguKz8pXFxzKlxcfVxcfS8pKSB7XG4gICAgICAgICAgICAgICAgaSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgIHRvYyAgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgY21kICA9IHRvY1swXTtcbiAgICAgICAgICAgICAgICBwcm9wID0gdG9jLnN1YnN0cmluZyh0b2MubWF0Y2goL14oXFxefFxcI3xcXCF8XFx+fFxcOikvKSA/IDE6MCk7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2goY21kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJmb3IodmFyICRpPTA7JGk8XCIrcHJvcCtcIi5sZW5ndGg7JGkrKykgeyB2YXIgJGl0ZW0gPSBcIitwcm9wK1wiWyRpXTtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuYmxvY2tzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnOic6XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChcImZvcih2YXIgJGtleSBpbiBcIitwcm9wK1wiKSB7IHZhciAkdmFsID0gXCIrcHJvcCtcIlska2V5XTtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuYmxvY2tzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChcImlmKFwiK3Byb3ArXCIpIHtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuYmxvY2tzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChcImlmKCFcIitwcm9wK1wiKSB7XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmJsb2NrcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJ9XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmJsb2Nrcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJfX3JldC5wdXNoKFwiK3Byb3ArXCIpO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJfX3JldC5wdXNoKGVzY2FwZShcIitwcm9wK1wiKSk7XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChcIl9fcmV0LnB1c2goJ1wiK3RvYy5yZXBsYWNlKC9cXCcvZywgXCJcXFxcJ1wiKStcIicpO1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgPSBpICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuICA9IG5ldyBGdW5jdGlvbignJGRhdGEnLCBbXG4gICAgICAgICAgICAndmFyIF9fcmV0ID0gW107JyxcbiAgICAgICAgICAgICd0cnkgeycsXG4gICAgICAgICAgICAnd2l0aCgkZGF0YSl7JywgKCFvcGVuYmxvY2tzID8gb3V0cHV0LmpvaW4oJycpIDogJ19fcmV0ID0gW1wiTm90IGFsbCBibG9ja3MgYXJlIGNsb3NlZCBjb3JyZWN0bHkuXCJdJyksICd9OycsXG4gICAgICAgICAgICAnfWNhdGNoKGUpe19fcmV0ID0gW2UubWVzc2FnZV07fScsXG4gICAgICAgICAgICAncmV0dXJuIF9fcmV0LmpvaW4oXCJcIikucmVwbGFjZSgvXFxcXG5cXFxcbi9nLCBcIlxcXFxuXCIpOycsXG4gICAgICAgICAgICBcImZ1bmN0aW9uIGVzY2FwZShodG1sKSB7IHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC9cXFwiL2csICcmcXVvdDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO31cIlxuICAgICAgICBdLmpvaW4oXCJcXG5cIikpO1xuXG4gICAgICAgIHJldHVybiBkYXRhID8gZm4oZGF0YSkgOiBmbjtcbiAgICB9O1xuXG4gICAgVUkuVXRpbHMuZXZlbnRzICAgICAgID0ge307XG4gICAgVUkuVXRpbHMuZXZlbnRzLmNsaWNrID0gVUkuc3VwcG9ydC50b3VjaCA/ICd0YXAnIDogJ2NsaWNrJztcblxuICAgIGdsb2JhbC5VSWtpdCA9IFVJO1xuXG4gICAgLy8gZGVwcmVjYXRlZFxuXG4gICAgVUkuZm4gPSBmdW5jdGlvbihjb21tYW5kLCBvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsIGNtZCA9IGNvbW1hbmQubWF0Y2goL14oW2EtelxcLV0rKSg/OlxcLihbYS16XSspKT8vaSksIGNvbXBvbmVudCA9IGNtZFsxXSwgbWV0aG9kID0gY21kWzJdO1xuXG4gICAgICAgIGlmICghVUlbY29tcG9uZW50XSkge1xuICAgICAgICAgICAgJC5lcnJvcihcIlVJa2l0IGNvbXBvbmVudCBbXCIgKyBjb21wb25lbnQgKyBcIl0gZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSwgZGF0YSA9ICR0aGlzLmRhdGEoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YShjb21wb25lbnQsIChkYXRhID0gVUlbY29tcG9uZW50XSh0aGlzLCBtZXRob2QgPyB1bmRlZmluZWQgOiBvcHRpb25zKSkpO1xuICAgICAgICAgICAgaWYgKG1ldGhvZCkgZGF0YVttZXRob2RdLmFwcGx5KGRhdGEsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuVUlraXQgICAgICAgICAgPSBVSTtcbiAgICAkLmZuLnVrICAgICAgICAgID0gVUkuZm47XG5cbiAgICBVSS5sYW5nZGlyZWN0aW9uID0gVUkuJGh0bWwuYXR0cihcImRpclwiKSA9PSBcInJ0bFwiID8gXCJyaWdodFwiIDogXCJsZWZ0XCI7XG5cbiAgICBVSS5jb21wb25lbnRzICAgID0ge307XG5cbiAgICBVSS5jb21wb25lbnQgPSBmdW5jdGlvbihuYW1lLCBkZWYpIHtcblxuICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuVUlraXQgICA9IFVJO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudCA/IFVJLiQoZWxlbWVudCkgOiBudWxsO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW5zID0ge307XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YShuYW1lLCB0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgICAgICh0aGlzLm9wdGlvbnMucGx1Z2lucy5sZW5ndGggPyB0aGlzLm9wdGlvbnMucGx1Z2lucyA6IE9iamVjdC5rZXlzKGZuLnBsdWdpbnMpKS5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGZuLnBsdWdpbnNbcGx1Z2luXS5pbml0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZuLnBsdWdpbnNbcGx1Z2luXS5pbml0KCR0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucGx1Z2luc1twbHVnaW5dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2luaXQudWsuY29tcG9uZW50JywgW25hbWUsIHRoaXNdKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm4ucGx1Z2lucyA9IHt9O1xuXG4gICAgICAgICQuZXh0ZW5kKHRydWUsIGZuLnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICBkZWZhdWx0cyA6IHtwbHVnaW5zOiBbXX0sXG5cbiAgICAgICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7fSxcblxuICAgICAgICAgICAgb246IGZ1bmN0aW9uKGExLGEyLGEzKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gVUkuJCh0aGlzLmVsZW1lbnQgfHwgdGhpcykub24oYTEsYTIsYTMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25lOiBmdW5jdGlvbihhMSxhMixhMyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVJLiQodGhpcy5lbGVtZW50IHx8IHRoaXMpLm9uZShhMSxhMixhMyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvZmY6IGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVJLiQodGhpcy5lbGVtZW50IHx8IHRoaXMpLm9mZihldnQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oZXZ0LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVUkuJCh0aGlzLmVsZW1lbnQgfHwgdGhpcykudHJpZ2dlcihldnQsIHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmaW5kOiBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBVSS4kKHRoaXMuZWxlbWVudCA/IHRoaXMuZWxlbWVudDogW10pLmZpbmQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcHJveHk6IGZ1bmN0aW9uKG9iaiwgbWV0aG9kcykge1xuXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIG1ldGhvZHMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISR0aGlzW21ldGhvZF0pICR0aGlzW21ldGhvZF0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIG9ialttZXRob2RdLmFwcGx5KG9iaiwgYXJndW1lbnRzKTsgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG1peGluOiBmdW5jdGlvbihvYmosIG1ldGhvZHMpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICBtZXRob2RzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkdGhpc1ttZXRob2RdKSAkdGhpc1ttZXRob2RdID0gb2JqW21ldGhvZF0uYmluZCgkdGhpcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvcHRpb246IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW2FyZ3VtZW50c1swXV0gfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1thcmd1bWVudHNbMF1dID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBkZWYpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50c1tuYW1lXSA9IGZuO1xuXG4gICAgICAgIHRoaXNbbmFtZV0gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQsIG9wdGlvbnM7XG5cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcInN0cmluZ1wiIHx8IGFyZ3VtZW50c1swXS5ub2RlVHlwZSB8fCBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gJChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gJChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5kYXRhKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZGF0YShuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChuZXcgVUkuY29tcG9uZW50c1tuYW1lXShlbGVtZW50LCBvcHRpb25zKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFVJLmRvbXJlYWR5KSB7XG4gICAgICAgICAgICBVSS5jb21wb25lbnQuYm9vdChuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9O1xuXG4gICAgVUkucGx1Z2luID0gZnVuY3Rpb24oY29tcG9uZW50LCBuYW1lLCBkZWYpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudF0ucGx1Z2luc1tuYW1lXSA9IGRlZjtcbiAgICB9O1xuXG4gICAgVUkuY29tcG9uZW50LmJvb3QgPSBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgICAgaWYgKFVJLmNvbXBvbmVudHNbbmFtZV0ucHJvdG90eXBlICYmIFVJLmNvbXBvbmVudHNbbmFtZV0ucHJvdG90eXBlLmJvb3QgJiYgIVVJLmNvbXBvbmVudHNbbmFtZV0uYm9vdGVkKSB7XG4gICAgICAgICAgICBVSS5jb21wb25lbnRzW25hbWVdLnByb3RvdHlwZS5ib290LmFwcGx5KFVJLCBbXSk7XG4gICAgICAgICAgICBVSS5jb21wb25lbnRzW25hbWVdLmJvb3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVUkuY29tcG9uZW50LmJvb3RDb21wb25lbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgZm9yICh2YXIgY29tcG9uZW50IGluIFVJLmNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIFVJLmNvbXBvbmVudC5ib290KGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyBET00gbXV0YXRpb24gc2F2ZSByZWFkeSBoZWxwZXIgZnVuY3Rpb25cblxuICAgIFVJLmRvbU9ic2VydmVycyA9IFtdO1xuICAgIFVJLmRvbXJlYWR5ICAgICA9IGZhbHNlO1xuXG4gICAgVUkucmVhZHkgPSBmdW5jdGlvbihmbikge1xuXG4gICAgICAgIFVJLmRvbU9ic2VydmVycy5wdXNoKGZuKTtcblxuICAgICAgICBpZiAoVUkuZG9tcmVhZHkpIHtcbiAgICAgICAgICAgIGZuKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBVSS5vbiA9IGZ1bmN0aW9uKGExLGEyLGEzKXtcblxuICAgICAgICBpZiAoYTEgJiYgYTEuaW5kZXhPZigncmVhZHkudWsuZG9tJykgPiAtMSAmJiBVSS5kb21yZWFkeSkge1xuICAgICAgICAgICAgYTIuYXBwbHkoVUkuJGRvYyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVUkuJGRvYy5vbihhMSxhMixhMyk7XG4gICAgfTtcblxuICAgIFVJLm9uZSA9IGZ1bmN0aW9uKGExLGEyLGEzKXtcblxuICAgICAgICBpZiAoYTEgJiYgYTEuaW5kZXhPZigncmVhZHkudWsuZG9tJykgPiAtMSAmJiBVSS5kb21yZWFkeSkge1xuICAgICAgICAgICAgYTIuYXBwbHkoVUkuJGRvYyk7XG4gICAgICAgICAgICByZXR1cm4gVUkuJGRvYztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBVSS4kZG9jLm9uZShhMSxhMixhMyk7XG4gICAgfTtcblxuICAgIFVJLnRyaWdnZXIgPSBmdW5jdGlvbihldnQsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gVUkuJGRvYy50cmlnZ2VyKGV2dCwgcGFyYW1zKTtcbiAgICB9O1xuXG4gICAgVUkuZG9tT2JzZXJ2ZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBmbikge1xuXG4gICAgICAgIGlmKCFVSS5zdXBwb3J0Lm11dGF0aW9ub2JzZXJ2ZXIpIHJldHVybjtcblxuICAgICAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgVUkuJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgID0gdGhpcyxcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9IFVJLiQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmICgkZWxlbWVudC5kYXRhKCdvYnNlcnZlcicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IFVJLnN1cHBvcnQubXV0YXRpb25vYnNlcnZlcihVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm4uYXBwbHkoZWxlbWVudCwgW10pO1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2VkLnVrLmRvbScpO1xuICAgICAgICAgICAgICAgIH0sIDUwKSwge2NoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZX0pO1xuXG4gICAgICAgICAgICAgICAgLy8gcGFzcyBpbiB0aGUgdGFyZ2V0IG5vZGUsIGFzIHdlbGwgYXMgdGhlIG9ic2VydmVyIG9wdGlvbnNcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuZGF0YSgnb2JzZXJ2ZXInLCBvYnNlcnZlcik7XG5cbiAgICAgICAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFVJLmluaXQgPSBmdW5jdGlvbihyb290KSB7XG5cbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgZG9jdW1lbnQ7XG5cbiAgICAgICAgVUkuZG9tT2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24oZm4pe1xuICAgICAgICAgICAgZm4ocm9vdCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBVSS5vbignZG9tcmVhZHkudWsuZG9tJywgZnVuY3Rpb24oKXtcblxuICAgICAgICBVSS5pbml0KCk7XG5cbiAgICAgICAgaWYgKFVJLmRvbXJlYWR5KSBVSS5VdGlscy5jaGVja0Rpc3BsYXkoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBVSS4kYm9keSA9IFVJLiQoJ2JvZHknKTtcblxuICAgICAgICAgICAgVUkudHJpZ2dlcignYmVmb3JlcmVhZHkudWsuZG9tJyk7XG5cbiAgICAgICAgICAgIFVJLmNvbXBvbmVudC5ib290Q29tcG9uZW50cygpO1xuXG4gICAgICAgICAgICAvLyBjdXN0b20gc2Nyb2xsIG9ic2VydmVyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbWVtb3J5ID0ge2Rpcjoge3g6MCwgeTowfSwgeDogd2luZG93LnBhZ2VYT2Zmc2V0LCB5OndpbmRvdy5wYWdlWU9mZnNldH07XG5cbiAgICAgICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvLyByZWFkaW5nIHRoaXMgKHdpbmRvdy5wYWdlW1h8WV1PZmZzZXQpIGNhdXNlcyBhIGZ1bGwgcGFnZSByZWNhbGMgb2YgdGhlIGxheW91dCBpbiBDaHJvbWUsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIHdlIG9ubHkgd2FudCB0byBkbyB0aGlzIG9uY2VcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdweG8gPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cHlvID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERpZCB0aGUgc2Nyb2xsIHBvc2l0aW9uIGNoYW5nZSBzaW5jZSB0aGUgbGFzdCB0aW1lIHdlIHdlcmUgaGVyZT9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbW9yeS54ICE9IHdweG8gfHwgbWVtb3J5LnkgIT0gd3B5bykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGRpcmVjdGlvbiBvZiB0aGUgc2Nyb2xsIGFuZCBzdG9yZSB0aGUgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3B4byAhPSBtZW1vcnkueCkge21lbW9yeS5kaXIueCA9IHdweG8gPiBtZW1vcnkueCA/IDE6LTE7IH0gZWxzZSB7IG1lbW9yeS5kaXIueCA9IDA7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3cHlvICE9IG1lbW9yeS55KSB7bWVtb3J5LmRpci55ID0gd3B5byA+IG1lbW9yeS55ID8gMTotMTsgfSBlbHNlIHsgbWVtb3J5LmRpci55ID0gMDsgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkueCA9IHdweG87XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkueSA9IHdweW87XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIHNjcm9sbCBldmVudCwgdGhpcyBjb3VsZCBwcm9iYWJseSBiZSBzZW50IHVzaW5nIG1lbW9yeS5jbG9uZSgpIGJ1dCB0aGlzIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtb3JlIGV4cGxpY2l0IGFuZCBlYXNpZXIgdG8gc2VlIGV4YWN0bHkgd2hhdCBpcyBiZWluZyBzZW50IGluIHRoZSBldmVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLiRkb2MudHJpZ2dlcignc2Nyb2xsaW5nLnVrLmRvY3VtZW50JywgW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpclwiOiB7XCJ4XCI6IG1lbW9yeS5kaXIueCwgXCJ5XCI6IG1lbW9yeS5kaXIueX0sIFwieFwiOiB3cHhvLCBcInlcIjogd3B5b1xuICAgICAgICAgICAgICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZuKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKFVJLnN1cHBvcnQudG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgVUkuJGh0bWwub24oJ3RvdWNobW92ZSB0b3VjaGVuZCBNU1BvaW50ZXJNb3ZlIE1TUG9pbnRlclVwIHBvaW50ZXJtb3ZlIHBvaW50ZXJ1cCcsIGZuKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWVtb3J5LnggfHwgbWVtb3J5LnkpIGZuKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZm47XG5cbiAgICAgICAgICAgIH0pKCkpO1xuXG4gICAgICAgICAgICAvLyBydW4gY29tcG9uZW50IGluaXQgZnVuY3Rpb25zIG9uIGRvbVxuICAgICAgICAgICAgVUkudHJpZ2dlcignZG9tcmVhZHkudWsuZG9tJyk7XG5cbiAgICAgICAgICAgIGlmIChVSS5zdXBwb3J0LnRvdWNoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgY3NzIGhvdmVyIHJ1bGVzIGZvciB0b3VjaCBkZXZpY2VzXG4gICAgICAgICAgICAgICAgLy8gVUkuVXRpbHMucmVtb3ZlQ3NzUnVsZXMoL1xcLnVrLSg/IW5hdmJhcikuKjpob3Zlci8pO1xuXG4gICAgICAgICAgICAgICAgLy8gdmlld3BvcnQgdW5pdCBmaXggZm9yIHVrLWhlaWdodC12aWV3cG9ydCAtIHNob3VsZCBiZSBmaXhlZCBpbiBpT1MgOFxuICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBhZHxpUGhvbmV8aVBvZCkvZykpIHtcblxuICAgICAgICAgICAgICAgICAgICBVSS4kd2luLm9uKCdsb2FkIG9yaWVudGF0aW9uY2hhbmdlIHJlc2l6ZScsIFVJLlV0aWxzLmRlYm91bmNlKChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcudWstaGVpZ2h0LXZpZXdwb3J0JykuY3NzKCdoZWlnaHQnLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pKCksIDEwMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVUkudHJpZ2dlcignYWZ0ZXJyZWFkeS51ay5kb20nKTtcblxuICAgICAgICAgICAgLy8gbWFyayB0aGF0IGRvbXJlYWR5IGlzIGxlZnQgYmVoaW5kXG4gICAgICAgICAgICBVSS5kb21yZWFkeSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIGF1dG8gaW5pdCBqcyBjb21wb25lbnRzXG4gICAgICAgICAgICBpZiAoVUkuc3VwcG9ydC5tdXRhdGlvbm9ic2VydmVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5pdEZuID0gVUkuVXRpbHMuZGVib3VuY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7IFVJLmluaXQoZG9jdW1lbnQuYm9keSk7fSk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuXG4gICAgICAgICAgICAgICAgKG5ldyBVSS5zdXBwb3J0Lm11dGF0aW9ub2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbnMuZXZlcnkoZnVuY3Rpb24obXV0YXRpb24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSAhPSAnY2hpbGRMaXN0JykgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBub2RlOyBpIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5vdXRlckhUTUwgJiYgbm9kZS5vdXRlckhUTUwuaW5kZXhPZignZGF0YS11ay0nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpbml0ID0gdHJ1ZSkgJiYgZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0KSBpbml0Rm4oKTtcblxuICAgICAgICAgICAgICAgIH0pKS5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgICAgICAgc2V0VGltZW91dChkb21SZWFkeSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZG9tUmVhZHk7XG5cbiAgICB9KCkpO1xuXG4gICAgLy8gYWRkIHRvdWNoIGlkZW50aWZpZXIgY2xhc3NcbiAgICBVSS4kaHRtbC5hZGRDbGFzcyhVSS5zdXBwb3J0LnRvdWNoID8gXCJ1ay10b3VjaFwiIDogXCJ1ay1ub3RvdWNoXCIpO1xuXG4gICAgLy8gYWRkIHVrLWhvdmVyIGNsYXNzIG9uIHRhcCB0byBzdXBwb3J0IG92ZXJsYXlzIG9uIHRvdWNoIGRldmljZXNcbiAgICBpZiAoVUkuc3VwcG9ydC50b3VjaCkge1xuXG4gICAgICAgIHZhciBob3ZlcnNldCA9IGZhbHNlLFxuICAgICAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgICAgIGhvdmVyY2xzID0gJ3VrLWhvdmVyJyxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gJy51ay1vdmVybGF5LCAudWstb3ZlcmxheS1ob3ZlciwgLnVrLW92ZXJsYXktdG9nZ2xlLCAudWstYW5pbWF0aW9uLWhvdmVyLCAudWstaGFzLWhvdmVyJztcblxuICAgICAgICBVSS4kaHRtbC5vbignbW91c2VlbnRlciB0b3VjaHN0YXJ0IE1TUG9pbnRlckRvd24gcG9pbnRlcmRvd24nLCBzZWxlY3RvciwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmIChob3ZlcnNldCkgJCgnLicraG92ZXJjbHMpLnJlbW92ZUNsYXNzKGhvdmVyY2xzKTtcblxuICAgICAgICAgICAgaG92ZXJzZXQgPSAkKHRoaXMpLmFkZENsYXNzKGhvdmVyY2xzKTtcblxuICAgICAgICB9KS5vbignbW91c2VsZWF2ZSB0b3VjaGVuZCBNU1BvaW50ZXJVcCBwb2ludGVydXAnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGV4Y2x1ZGUgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKHNlbGVjdG9yKTtcblxuICAgICAgICAgICAgaWYgKGhvdmVyc2V0KSB7XG4gICAgICAgICAgICAgICAgaG92ZXJzZXQubm90KGV4Y2x1ZGUpLnJlbW92ZUNsYXNzKGhvdmVyY2xzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVJO1xufSk7XG4iXX0=