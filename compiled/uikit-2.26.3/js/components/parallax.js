"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-parallax", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var parallaxes = [],
        supports3d = false,
        scrolltop = 0,
        wh = window.innerHeight,
        checkParallaxes = function checkParallaxes() {

        scrolltop = UI.$win.scrollTop();

        window.requestAnimationFrame(function () {
            for (var i = 0; i < parallaxes.length; i++) {
                parallaxes[i].process();
            }
        });
    };

    UI.component('parallax', {

        defaults: {
            velocity: 0.5,
            target: false,
            viewport: false,
            media: false
        },

        boot: function boot() {

            supports3d = function () {

                var el = document.createElement('div'),
                    has3d,
                    transforms = {
                    'WebkitTransform': '-webkit-transform',
                    'MSTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'Transform': 'transform'
                };

                // Add it to the body to get the computed style.
                document.body.insertBefore(el, null);

                for (var t in transforms) {
                    if (el.style[t] !== undefined) {
                        el.style[t] = "translate3d(1px,1px,1px)";
                        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }

                document.body.removeChild(el);

                return has3d !== undefined && has3d.length > 0 && has3d !== "none";
            }();

            // listen to scroll and resize
            UI.$doc.on("scrolling.uk.document", checkParallaxes);
            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function () {
                wh = window.innerHeight;
                checkParallaxes();
            }, 50));

            // init code
            UI.ready(function (context) {

                UI.$('[data-uk-parallax]', context).each(function () {

                    var parallax = UI.$(this);

                    if (!parallax.data("parallax")) {
                        UI.parallax(parallax, UI.Utils.options(parallax.attr("data-uk-parallax")));
                    }
                });
            });
        },

        init: function init() {

            this.base = this.options.target ? UI.$(this.options.target) : this.element;
            this.props = {};
            this.velocity = this.options.velocity || 1;

            var reserved = ['target', 'velocity', 'viewport', 'plugins', 'media'];

            Object.keys(this.options).forEach(function (prop) {

                if (reserved.indexOf(prop) !== -1) {
                    return;
                }

                var start,
                    end,
                    dir,
                    diff,
                    startend = String(this.options[prop]).split(',');

                if (prop.match(/color/i)) {
                    start = startend[1] ? startend[0] : this._getStartValue(prop), end = startend[1] ? startend[1] : startend[0];

                    if (!start) {
                        start = 'rgba(255,255,255,0)';
                    }
                } else {
                    start = parseFloat(startend[1] ? startend[0] : this._getStartValue(prop)), end = parseFloat(startend[1] ? startend[1] : startend[0]);
                    diff = start < end ? end - start : start - end;
                    dir = start < end ? 1 : -1;
                }

                this.props[prop] = { 'start': start, 'end': end, 'dir': dir, 'diff': diff };
            }.bind(this));

            parallaxes.push(this);
        },

        process: function process() {

            if (this.options.media) {

                switch (_typeof(this.options.media)) {
                    case 'number':
                        if (window.innerWidth < this.options.media) {
                            return false;
                        }
                        break;
                    case 'string':
                        if (window.matchMedia && !window.matchMedia(this.options.media).matches) {
                            return false;
                        }
                        break;
                }
            }

            var percent = this.percentageInViewport();

            if (this.options.viewport !== false) {
                percent = this.options.viewport === 0 ? 1 : percent / this.options.viewport;
            }

            this.update(percent);
        },

        percentageInViewport: function percentageInViewport() {

            var top = this.base.offset().top,
                height = this.base.outerHeight(),
                distance,
                percentage,
                percent;

            if (top > scrolltop + wh) {
                percent = 0;
            } else if (top + height < scrolltop) {
                percent = 1;
            } else {

                if (top + height < wh) {

                    percent = (scrolltop < wh ? scrolltop : scrolltop - wh) / (top + height);
                } else {

                    distance = scrolltop + wh - top;
                    percentage = Math.round(distance / ((wh + height) / 100));
                    percent = percentage / 100;
                }
            }

            return percent;
        },

        update: function update(percent) {

            var $this = this,
                css = { transform: '', filter: '' },
                compercent = percent * (1 - (this.velocity - this.velocity * percent)),
                opts,
                val;

            if (compercent < 0) compercent = 0;
            if (compercent > 1) compercent = 1;

            if (this._percent !== undefined && this._percent == compercent) {
                return;
            }

            Object.keys(this.props).forEach(function (prop) {

                opts = this.props[prop];

                if (percent === 0) {
                    val = opts.start;
                } else if (percent === 1) {
                    val = opts.end;
                } else if (opts.diff !== undefined) {
                    val = opts.start + opts.diff * compercent * opts.dir;
                }

                if ((prop == 'bg' || prop == 'bgp') && !this._bgcover) {
                    this._bgcover = initBgImageParallax(this, prop, opts);
                }

                switch (prop) {

                    // transforms
                    case 'x':
                        css.transform += supports3d ? ' translate3d(' + val + 'px, 0, 0)' : ' translateX(' + val + 'px)';
                        break;
                    case 'xp':
                        css.transform += supports3d ? ' translate3d(' + val + '%, 0, 0)' : ' translateX(' + val + '%)';
                        break;
                    case 'y':
                        css.transform += supports3d ? ' translate3d(0, ' + val + 'px, 0)' : ' translateY(' + val + 'px)';
                        break;
                    case 'yp':
                        css.transform += supports3d ? ' translate3d(0, ' + val + '%, 0)' : ' translateY(' + val + '%)';
                        break;
                    case 'rotate':
                        css.transform += ' rotate(' + val + 'deg)';
                        break;
                    case 'scale':
                        css.transform += ' scale(' + val + ')';
                        break;

                    // bg image
                    case 'bg':

                        // don't move if image height is too small
                        // if ($this.element.data('bgsize') && ($this.element.data('bgsize').h + val - window.innerHeight) < 0) {
                        //     break;
                        // }

                        css['background-position'] = '50% ' + val + 'px';
                        break;
                    case 'bgp':
                        css['background-position'] = '50% ' + val + '%';
                        break;

                    // color
                    case 'color':
                    case 'background-color':
                    case 'border-color':
                        css[prop] = calcColor(opts.start, opts.end, compercent);
                        break;

                    // CSS Filter
                    case 'blur':
                        css.filter += ' blur(' + val + 'px)';
                        break;
                    case 'hue':
                        css.filter += ' hue-rotate(' + val + 'deg)';
                        break;
                    case 'grayscale':
                        css.filter += ' grayscale(' + val + '%)';
                        break;
                    case 'invert':
                        css.filter += ' invert(' + val + '%)';
                        break;
                    case 'fopacity':
                        css.filter += ' opacity(' + val + '%)';
                        break;
                    case 'saturate':
                        css.filter += ' saturate(' + val + '%)';
                        break;
                    case 'sepia':
                        css.filter += ' sepia(' + val + '%)';
                        break;

                    default:
                        css[prop] = val;
                        break;
                }
            }.bind(this));

            if (css.filter) {
                css['-webkit-filter'] = css.filter;
            }

            this.element.css(css);

            this._percent = compercent;
        },

        _getStartValue: function _getStartValue(prop) {

            var value = 0;

            switch (prop) {
                case 'scale':
                    value = 1;
                    break;
                default:
                    value = this.element.css(prop);
            }

            return value || 0;
        }

    });

    // helper

    function initBgImageParallax(obj, prop, opts) {

        var img = new Image(),
            url,
            element,
            size,
            check,
            ratio,
            width,
            height;

        element = obj.element.css({ 'background-size': 'cover', 'background-repeat': 'no-repeat' });
        url = element.css('background-image').replace(/^url\(/g, '').replace(/\)$/g, '').replace(/("|')/g, '');
        check = function check() {

            var w = element.innerWidth(),
                h = element.innerHeight(),
                extra = prop == 'bg' ? opts.diff : opts.diff / 100 * h;

            h += extra;
            w += Math.ceil(extra * ratio);

            if (w - extra < size.w && h < size.h) {
                return obj.element.css({ 'background-size': 'auto' });
            }

            // if element height < parent height (gap underneath)
            if (w / ratio < h) {

                width = Math.ceil(h * ratio);
                height = h;

                if (h > window.innerHeight) {
                    width = width * 1.2;
                    height = height * 1.2;
                }

                // element width < parent width (gap to right)
            } else {

                width = w;
                height = Math.ceil(w / ratio);
            }

            element.css({ 'background-size': width + 'px ' + height + 'px' }).data('bgsize', { w: width, h: height });
        };

        img.onerror = function () {
            // image url doesn't exist
        };

        img.onload = function () {
            size = { w: img.width, h: img.height };
            ratio = img.width / img.height;

            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function () {
                check();
            }, 50));

            check();
        };

        img.src = url;

        return true;
    }

    // Some named colors to work with, added by Bradley Ayers
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/
    var colors = {
        'black': [0, 0, 0, 1],
        'blue': [0, 0, 255, 1],
        'brown': [165, 42, 42, 1],
        'cyan': [0, 255, 255, 1],
        'fuchsia': [255, 0, 255, 1],
        'gold': [255, 215, 0, 1],
        'green': [0, 128, 0, 1],
        'indigo': [75, 0, 130, 1],
        'khaki': [240, 230, 140, 1],
        'lime': [0, 255, 0, 1],
        'magenta': [255, 0, 255, 1],
        'maroon': [128, 0, 0, 1],
        'navy': [0, 0, 128, 1],
        'olive': [128, 128, 0, 1],
        'orange': [255, 165, 0, 1],
        'pink': [255, 192, 203, 1],
        'purple': [128, 0, 128, 1],
        'violet': [128, 0, 128, 1],
        'red': [255, 0, 0, 1],
        'silver': [192, 192, 192, 1],
        'white': [255, 255, 255, 1],
        'yellow': [255, 255, 0, 1],
        'transparent': [255, 255, 255, 0]
    };

    function calcColor(start, end, pos) {

        start = parseColor(start);
        end = parseColor(end);
        pos = pos || 0;

        return calculateColor(start, end, pos);
    }

    /**!
     * @preserve Color animation 1.6.0
     * http://www.bitstorm.org/jquery/color-animation/
     * Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
     * Released under the MIT and GPL licenses.
     */

    // Calculate an in-between color. Returns "#aabbcc"-like string.
    function calculateColor(begin, end, pos) {
        var color = 'rgba(' + parseInt(begin[0] + pos * (end[0] - begin[0]), 10) + ',' + parseInt(begin[1] + pos * (end[1] - begin[1]), 10) + ',' + parseInt(begin[2] + pos * (end[2] - begin[2]), 10) + ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);

        color += ')';
        return color;
    }

    // Parse an CSS-syntax color. Outputs an array [r, g, b]
    function parseColor(color) {

        var match, quadruplet;

        // Match #aabbcc
        if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
            quadruplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

            // Match #abc
        } else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
            quadruplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

            // Match rgb(n, n, n)
        } else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
            quadruplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];
        } else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
            quadruplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match[4])];

            // No browser returns rgb(n%, n%, n%), so little reason to support this format.
        } else {
            quadruplet = colors[color] || [255, 255, 255, 0];
        }
        return quadruplet;
    }

    return UI.parallax;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3BhcmFsbGF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8sZ0JBQVAsRUFBeUIsQ0FBQyxPQUFELENBQXpCLEVBQW9DLFlBQVU7QUFDMUMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBRUEsUUFBSSxhQUFrQixFQUF0QjtBQUFBLFFBQ0ksYUFBa0IsS0FEdEI7QUFBQSxRQUVJLFlBQWtCLENBRnRCO0FBQUEsUUFHSSxLQUFrQixPQUFPLFdBSDdCO0FBQUEsUUFJSSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBVzs7QUFFekIsb0JBQVksR0FBRyxJQUFILENBQVEsU0FBUixFQUFaOztBQUVBLGVBQU8scUJBQVAsQ0FBNkIsWUFBVTtBQUNuQyxpQkFBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUksV0FBVyxNQUE3QixFQUFxQyxHQUFyQyxFQUEwQztBQUN0QywyQkFBVyxDQUFYLEVBQWMsT0FBZDtBQUNIO0FBQ0osU0FKRDtBQUtILEtBYkw7O0FBZ0JBLE9BQUcsU0FBSCxDQUFhLFVBQWIsRUFBeUI7O0FBRXJCLGtCQUFVO0FBQ04sc0JBQVcsR0FETDtBQUVOLG9CQUFXLEtBRkw7QUFHTixzQkFBVyxLQUhMO0FBSU4sbUJBQVc7QUFKTCxTQUZXOztBQVNyQixjQUFNLGdCQUFXOztBQUViLHlCQUFjLFlBQVU7O0FBRXBCLG9CQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENB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QU4sQ0FBVCxFQUFtQixFQUFuQixJQUF5QixFQUExQixFQUE4QixTQUFTLE1BQU0sQ0FBTixDQUFULEVBQW1CLEVBQW5CLElBQXlCLEVBQXZELEVBQTJELFNBQVMsTUFBTSxDQUFOLENBQVQsRUFBbUIsRUFBbkIsSUFBeUIsRUFBcEYsRUFBd0YsQ0FBeEYsQ0FBYjs7O0FBR0gsU0FKTSxNQUlBLElBQUksUUFBUSxrRUFBa0UsSUFBbEUsQ0FBdUUsS0FBdkUsQ0FBWixFQUEyRjtBQUM5Rix5QkFBYSxDQUFDLFNBQVMsTUFBTSxDQUFOLENBQVQsQ0FBRCxFQUFxQixTQUFTLE1BQU0sQ0FBTixDQUFULENBQXJCLEVBQXlDLFNBQVMsTUFBTSxDQUFOLENBQVQsQ0FBekMsRUFBNkQsQ0FBN0QsQ0FBYjtBQUVILFNBSE0sTUFHQSxJQUFJLFFBQVEsb0ZBQW9GLElBQXBGLENBQXlGLEtBQXpGLENBQVosRUFBNkc7QUFDaEgseUJBQWEsQ0FBQyxTQUFTLE1BQU0sQ0FBTixDQUFULEVBQW1CLEVBQW5CLENBQUQsRUFBeUIsU0FBUyxNQUFNLENBQU4sQ0FBVCxFQUFtQixFQUFuQixDQUF6QixFQUFpRCxTQUFTLE1BQU0sQ0FBTixDQUFULEVBQW1CLEVBQW5CLENBQWpELEVBQXdFLFdBQVcsTUFBTSxDQUFOLENBQVgsQ0FBeEUsQ0FBYjs7O0FBR0gsU0FKTSxNQUlBO0FBQ0gseUJBQWEsT0FBTyxLQUFQLEtBQWlCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxHQUFULEVBQWEsQ0FBYixDQUE5QjtBQUNIO0FBQ0QsZUFBTyxVQUFQO0FBQ0g7O0FBRUQsV0FBTyxHQUFHLFFBQVY7QUFDSCxDQTVjRCIsImZpbGUiOiJwYXJhbGxheC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LXBhcmFsbGF4XCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgcGFyYWxsYXhlcyAgICAgID0gW10sXG4gICAgICAgIHN1cHBvcnRzM2QgICAgICA9IGZhbHNlLFxuICAgICAgICBzY3JvbGx0b3AgICAgICAgPSAwLFxuICAgICAgICB3aCAgICAgICAgICAgICAgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgIGNoZWNrUGFyYWxsYXhlcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBzY3JvbGx0b3AgPSBVSS4kd2luLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcGFyYWxsYXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbGxheGVzW2ldLnByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG4gICAgVUkuY29tcG9uZW50KCdwYXJhbGxheCcsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgdmVsb2NpdHkgOiAwLjUsXG4gICAgICAgICAgICB0YXJnZXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdmlld3BvcnQgOiBmYWxzZSxcbiAgICAgICAgICAgIG1lZGlhICAgIDogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgc3VwcG9ydHMzZCA9IChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICAgICAgICAgIGhhczNkLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1dlYmtpdFRyYW5zZm9ybSc6Jy13ZWJraXQtdHJhbnNmb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdNU1RyYW5zZm9ybSc6Jy1tcy10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ01velRyYW5zZm9ybSc6Jy1tb3otdHJhbnNmb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdUcmFuc2Zvcm0nOid0cmFuc2Zvcm0nXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgaXQgdG8gdGhlIGJvZHkgdG8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZS5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0IGluIHRyYW5zZm9ybXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlW3RdID0gXCJ0cmFuc2xhdGUzZCgxcHgsMXB4LDFweClcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhczNkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUodHJhbnNmb3Jtc1t0XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoaGFzM2QgIT09IHVuZGVmaW5lZCAmJiBoYXMzZC5sZW5ndGggPiAwICYmIGhhczNkICE9PSBcIm5vbmVcIik7XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAvLyBsaXN0ZW4gdG8gc2Nyb2xsIGFuZCByZXNpemVcbiAgICAgICAgICAgIFVJLiRkb2Mub24oXCJzY3JvbGxpbmcudWsuZG9jdW1lbnRcIiwgY2hlY2tQYXJhbGxheGVzKTtcbiAgICAgICAgICAgIFVJLiR3aW4ub24oXCJsb2FkIHJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZVwiLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHdoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNoZWNrUGFyYWxsYXhlcygpO1xuICAgICAgICAgICAgfSwgNTApKTtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKCdbZGF0YS11ay1wYXJhbGxheF0nLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbGxheCA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJhbGxheC5kYXRhKFwicGFyYWxsYXhcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLnBhcmFsbGF4KHBhcmFsbGF4LCBVSS5VdGlscy5vcHRpb25zKHBhcmFsbGF4LmF0dHIoXCJkYXRhLXVrLXBhcmFsbGF4XCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmJhc2UgICAgID0gdGhpcy5vcHRpb25zLnRhcmdldCA/IFVJLiQodGhpcy5vcHRpb25zLnRhcmdldCkgOiB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLnByb3BzICAgID0ge307XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gKHRoaXMub3B0aW9ucy52ZWxvY2l0eSB8fCAxKTtcblxuICAgICAgICAgICAgdmFyIHJlc2VydmVkICA9IFsndGFyZ2V0JywndmVsb2NpdHknLCd2aWV3cG9ydCcsJ3BsdWdpbnMnLCdtZWRpYSddO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzZXJ2ZWQuaW5kZXhPZihwcm9wKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdGFydCwgZW5kLCBkaXIsIGRpZmYsIHN0YXJ0ZW5kID0gU3RyaW5nKHRoaXMub3B0aW9uc1twcm9wXSkuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wLm1hdGNoKC9jb2xvci9pKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHN0YXJ0ZW5kWzFdID8gc3RhcnRlbmRbMF0gOiB0aGlzLl9nZXRTdGFydFZhbHVlKHByb3ApLFxuICAgICAgICAgICAgICAgICAgICBlbmQgICA9IHN0YXJ0ZW5kWzFdID8gc3RhcnRlbmRbMV0gOiBzdGFydGVuZFswXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9ICdyZ2JhKDI1NSwyNTUsMjU1LDApJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUZsb2F0KHN0YXJ0ZW5kWzFdID8gc3RhcnRlbmRbMF0gOiB0aGlzLl9nZXRTdGFydFZhbHVlKHByb3ApKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kICAgPSBwYXJzZUZsb2F0KHN0YXJ0ZW5kWzFdID8gc3RhcnRlbmRbMV0gOiBzdGFydGVuZFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgID0gKHN0YXJ0IDwgZW5kID8gKGVuZC1zdGFydCk6KHN0YXJ0LWVuZCkpO1xuICAgICAgICAgICAgICAgICAgICBkaXIgICA9IChzdGFydCA8IGVuZCA/IDE6LTEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHNbcHJvcF0gPSB7ICdzdGFydCc6IHN0YXJ0LCAnZW5kJzogZW5kLCAnZGlyJzogZGlyLCAnZGlmZic6IGRpZmYgfTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgcGFyYWxsYXhlcy5wdXNoKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1lZGlhKSB7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2godHlwZW9mKHRoaXMub3B0aW9ucy5tZWRpYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IHRoaXMub3B0aW9ucy5tZWRpYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhICYmICF3aW5kb3cubWF0Y2hNZWRpYSh0aGlzLm9wdGlvbnMubWVkaWEpLm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gdGhpcy5wZXJjZW50YWdlSW5WaWV3cG9ydCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnZpZXdwb3J0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAodGhpcy5vcHRpb25zLnZpZXdwb3J0ID09PSAwKSA/IDEgOiBwZXJjZW50IC8gdGhpcy5vcHRpb25zLnZpZXdwb3J0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShwZXJjZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBwZXJjZW50YWdlSW5WaWV3cG9ydDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciB0b3AgICAgID0gdGhpcy5iYXNlLm9mZnNldCgpLnRvcCxcbiAgICAgICAgICAgICAgICBoZWlnaHQgID0gdGhpcy5iYXNlLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UsIHBlcmNlbnRhZ2UsIHBlcmNlbnQ7XG5cbiAgICAgICAgICAgIGlmICh0b3AgPiAoc2Nyb2xsdG9wICsgd2gpKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCh0b3AgKyBoZWlnaHQpIDwgc2Nyb2xsdG9wKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKCh0b3AgKyBoZWlnaHQpIDwgd2gpIHtcblxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gKHNjcm9sbHRvcCA8IHdoID8gc2Nyb2xsdG9wIDogc2Nyb2xsdG9wIC0gd2gpIC8gKHRvcCtoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSAgID0gKHNjcm9sbHRvcCArIHdoKSAtIHRvcDtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoZGlzdGFuY2UgLyAoKHdoICsgaGVpZ2h0KSAvIDEwMCkpO1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ICAgID0gcGVyY2VudGFnZS8xMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGVyY2VudDtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKHBlcmNlbnQpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzICAgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGNzcyAgICAgICAgPSB7dHJhbnNmb3JtOicnLCBmaWx0ZXI6Jyd9LFxuICAgICAgICAgICAgICAgIGNvbXBlcmNlbnQgPSBwZXJjZW50ICogKDEgLSAodGhpcy52ZWxvY2l0eSAtICh0aGlzLnZlbG9jaXR5ICogcGVyY2VudCkpKSxcbiAgICAgICAgICAgICAgICBvcHRzLCB2YWw7XG5cbiAgICAgICAgICAgIGlmIChjb21wZXJjZW50IDwgMCkgY29tcGVyY2VudCA9IDA7XG4gICAgICAgICAgICBpZiAoY29tcGVyY2VudCA+IDEpIGNvbXBlcmNlbnQgPSAxO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fcGVyY2VudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3BlcmNlbnQgPT0gY29tcGVyY2VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5wcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cbiAgICAgICAgICAgICAgICBvcHRzID0gdGhpcy5wcm9wc1twcm9wXTtcblxuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IG9wdHMuc3RhcnQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gb3B0cy5lbmQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKG9wdHMuZGlmZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IG9wdHMuc3RhcnQgKyAob3B0cy5kaWZmICogY29tcGVyY2VudCAqIG9wdHMuZGlyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoKHByb3AgPT0gJ2JnJyB8fCBwcm9wID09ICdiZ3AnKSAmJiAhdGhpcy5fYmdjb3Zlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iZ2NvdmVyID0gaW5pdEJnSW1hZ2VQYXJhbGxheCh0aGlzLCBwcm9wLCBvcHRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2gocHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRyYW5zZm9ybXNcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MudHJhbnNmb3JtICs9IHN1cHBvcnRzM2QgPyAnIHRyYW5zbGF0ZTNkKCcrdmFsKydweCwgMCwgMCknOicgdHJhbnNsYXRlWCgnK3ZhbCsncHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd4cCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MudHJhbnNmb3JtICs9IHN1cHBvcnRzM2QgPyAnIHRyYW5zbGF0ZTNkKCcrdmFsKyclLCAwLCAwKSc6JyB0cmFuc2xhdGVYKCcrdmFsKyclKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MudHJhbnNmb3JtICs9IHN1cHBvcnRzM2QgPyAnIHRyYW5zbGF0ZTNkKDAsICcrdmFsKydweCwgMCknOicgdHJhbnNsYXRlWSgnK3ZhbCsncHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd5cCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MudHJhbnNmb3JtICs9IHN1cHBvcnRzM2QgPyAnIHRyYW5zbGF0ZTNkKDAsICcrdmFsKyclLCAwKSc6JyB0cmFuc2xhdGVZKCcrdmFsKyclKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcy50cmFuc2Zvcm0gKz0gJyByb3RhdGUoJyt2YWwrJ2RlZyknO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcy50cmFuc2Zvcm0gKz0gJyBzY2FsZSgnK3ZhbCsnKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBiZyBpbWFnZVxuICAgICAgICAgICAgICAgICAgICBjYXNlICdiZyc6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IG1vdmUgaWYgaW1hZ2UgaGVpZ2h0IGlzIHRvbyBzbWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKCR0aGlzLmVsZW1lbnQuZGF0YSgnYmdzaXplJykgJiYgKCR0aGlzLmVsZW1lbnQuZGF0YSgnYmdzaXplJykuaCArIHZhbCAtIHdpbmRvdy5pbm5lckhlaWdodCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc1snYmFja2dyb3VuZC1wb3NpdGlvbiddID0gJzUwJSAnK3ZhbCsncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JncCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NbJ2JhY2tncm91bmQtcG9zaXRpb24nXSA9ICc1MCUgJyt2YWwrJyUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29sb3JcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdiYWNrZ3JvdW5kLWNvbG9yJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm9yZGVyLWNvbG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc1twcm9wXSA9IGNhbGNDb2xvcihvcHRzLnN0YXJ0LCBvcHRzLmVuZCwgY29tcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBDU1MgRmlsdGVyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JsdXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzLmZpbHRlciArPSAnIGJsdXIoJyt2YWwrJ3B4KSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaHVlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcy5maWx0ZXIgKz0gJyBodWUtcm90YXRlKCcrdmFsKydkZWcpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdncmF5c2NhbGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzLmZpbHRlciArPSAnIGdyYXlzY2FsZSgnK3ZhbCsnJSknO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ludmVydCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MuZmlsdGVyICs9ICcgaW52ZXJ0KCcrdmFsKyclKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZm9wYWNpdHknOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzLmZpbHRlciArPSAnIG9wYWNpdHkoJyt2YWwrJyUpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzYXR1cmF0ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MuZmlsdGVyICs9ICcgc2F0dXJhdGUoJyt2YWwrJyUpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZXBpYSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3MuZmlsdGVyICs9ICcgc2VwaWEoJyt2YWwrJyUpJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NbcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChjc3MuZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgY3NzWyctd2Via2l0LWZpbHRlciddID0gY3NzLmZpbHRlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhjc3MpO1xuXG4gICAgICAgICAgICB0aGlzLl9wZXJjZW50ID0gY29tcGVyY2VudDtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0U3RhcnRWYWx1ZTogZnVuY3Rpb24ocHJvcCkge1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAwO1xuXG4gICAgICAgICAgICBzd2l0Y2gocHJvcCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZWxlbWVudC5jc3MocHJvcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAodmFsdWUgfHwgMCk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICAvLyBoZWxwZXJcblxuICAgIGZ1bmN0aW9uIGluaXRCZ0ltYWdlUGFyYWxsYXgob2JqLCBwcm9wLCBvcHRzKSB7XG5cbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpLCB1cmwsIGVsZW1lbnQsIHNpemUsIGNoZWNrLCByYXRpbywgd2lkdGgsIGhlaWdodDtcblxuICAgICAgICBlbGVtZW50ID0gb2JqLmVsZW1lbnQuY3NzKHsnYmFja2dyb3VuZC1zaXplJzogJ2NvdmVyJywgICdiYWNrZ3JvdW5kLXJlcGVhdCc6ICduby1yZXBlYXQnfSk7XG4gICAgICAgIHVybCAgICAgPSBlbGVtZW50LmNzcygnYmFja2dyb3VuZC1pbWFnZScpLnJlcGxhY2UoL151cmxcXCgvZywgJycpLnJlcGxhY2UoL1xcKSQvZywgJycpLnJlcGxhY2UoLyhcInwnKS9nLCAnJyk7XG4gICAgICAgIGNoZWNrICAgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIHcgPSBlbGVtZW50LmlubmVyV2lkdGgoKSwgaCA9IGVsZW1lbnQuaW5uZXJIZWlnaHQoKSwgZXh0cmEgPSAocHJvcD09J2JnJykgPyBvcHRzLmRpZmYgOiAob3B0cy5kaWZmLzEwMCkgKiBoO1xuXG4gICAgICAgICAgICBoICs9IGV4dHJhO1xuICAgICAgICAgICAgdyArPSBNYXRoLmNlaWwoZXh0cmEgKiByYXRpbyk7XG5cbiAgICAgICAgICAgIGlmICh3LWV4dHJhIDwgc2l6ZS53ICYmIGggPCBzaXplLmgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLmVsZW1lbnQuY3NzKHsnYmFja2dyb3VuZC1zaXplJzogJ2F1dG8nfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgaGVpZ2h0IDwgcGFyZW50IGhlaWdodCAoZ2FwIHVuZGVybmVhdGgpXG4gICAgICAgICAgICBpZiAoKHcgLyByYXRpbykgPCBoKSB7XG5cbiAgICAgICAgICAgICAgICB3aWR0aCAgPSBNYXRoLmNlaWwoaCAqIHJhdGlvKTtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGggPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggID0gd2lkdGggKiAxLjI7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCAqIDEuMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2lkdGggPCBwYXJlbnQgd2lkdGggKGdhcCB0byByaWdodClcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB3aWR0aCAgPSB3O1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IE1hdGguY2VpbCh3IC8gcmF0aW8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7J2JhY2tncm91bmQtc2l6ZSc6ICh3aWR0aCsncHggJytoZWlnaHQrJ3B4Jyl9KS5kYXRhKCdiZ3NpemUnLCB7dzp3aWR0aCxoOmhlaWdodH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vIGltYWdlIHVybCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIH07XG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzaXplICA9IHt3OmltZy53aWR0aCwgaDppbWcuaGVpZ2h0fTtcbiAgICAgICAgICAgIHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcblxuICAgICAgICAgICAgVUkuJHdpbi5vbihcImxvYWQgcmVzaXplIG9yaWVudGF0aW9uY2hhbmdlXCIsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY2hlY2soKTtcbiAgICAgICAgICAgIH0sIDUwKSk7XG5cbiAgICAgICAgICAgIGNoZWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaW1nLnNyYyA9IHVybDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cblxuICAgIC8vIFNvbWUgbmFtZWQgY29sb3JzIHRvIHdvcmsgd2l0aCwgYWRkZWQgYnkgQnJhZGxleSBBeWVyc1xuICAgIC8vIEZyb20gSW50ZXJmYWNlIGJ5IFN0ZWZhbiBQZXRyZVxuICAgIC8vIGh0dHA6Ly9pbnRlcmZhY2UuZXllY29uLnJvL1xuICAgIHZhciBjb2xvcnMgPSB7XG4gICAgICAgICdibGFjayc6IFswLDAsMCwxXSxcbiAgICAgICAgJ2JsdWUnOiBbMCwwLDI1NSwxXSxcbiAgICAgICAgJ2Jyb3duJzogWzE2NSw0Miw0MiwxXSxcbiAgICAgICAgJ2N5YW4nOiBbMCwyNTUsMjU1LDFdLFxuICAgICAgICAnZnVjaHNpYSc6IFsyNTUsMCwyNTUsMV0sXG4gICAgICAgICdnb2xkJzogWzI1NSwyMTUsMCwxXSxcbiAgICAgICAgJ2dyZWVuJzogWzAsMTI4LDAsMV0sXG4gICAgICAgICdpbmRpZ28nOiBbNzUsMCwxMzAsMV0sXG4gICAgICAgICdraGFraSc6IFsyNDAsMjMwLDE0MCwxXSxcbiAgICAgICAgJ2xpbWUnOiBbMCwyNTUsMCwxXSxcbiAgICAgICAgJ21hZ2VudGEnOiBbMjU1LDAsMjU1LDFdLFxuICAgICAgICAnbWFyb29uJzogWzEyOCwwLDAsMV0sXG4gICAgICAgICduYXZ5JzogWzAsMCwxMjgsMV0sXG4gICAgICAgICdvbGl2ZSc6IFsxMjgsMTI4LDAsMV0sXG4gICAgICAgICdvcmFuZ2UnOiBbMjU1LDE2NSwwLDFdLFxuICAgICAgICAncGluayc6IFsyNTUsMTkyLDIwMywxXSxcbiAgICAgICAgJ3B1cnBsZSc6IFsxMjgsMCwxMjgsMV0sXG4gICAgICAgICd2aW9sZXQnOiBbMTI4LDAsMTI4LDFdLFxuICAgICAgICAncmVkJzogWzI1NSwwLDAsMV0sXG4gICAgICAgICdzaWx2ZXInOiBbMTkyLDE5MiwxOTIsMV0sXG4gICAgICAgICd3aGl0ZSc6IFsyNTUsMjU1LDI1NSwxXSxcbiAgICAgICAgJ3llbGxvdyc6IFsyNTUsMjU1LDAsMV0sXG4gICAgICAgICd0cmFuc3BhcmVudCc6IFsyNTUsMjU1LDI1NSwwXVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjYWxjQ29sb3Ioc3RhcnQsIGVuZCwgcG9zKSB7XG5cbiAgICAgICAgc3RhcnQgPSBwYXJzZUNvbG9yKHN0YXJ0KTtcbiAgICAgICAgZW5kICAgPSBwYXJzZUNvbG9yKGVuZCk7XG4gICAgICAgIHBvcyAgID0gcG9zIHx8IDA7XG5cbiAgICAgICAgcmV0dXJuIGNhbGN1bGF0ZUNvbG9yKHN0YXJ0LCBlbmQsIHBvcyk7XG4gICAgfVxuXG4gICAgLyoqIVxuICAgICAqIEBwcmVzZXJ2ZSBDb2xvciBhbmltYXRpb24gMS42LjBcbiAgICAgKiBodHRwOi8vd3d3LmJpdHN0b3JtLm9yZy9qcXVlcnkvY29sb3ItYW5pbWF0aW9uL1xuICAgICAqIENvcHlyaWdodCAyMDExLCAyMDEzIEVkd2luIE1hcnRpbiA8ZWR3aW5AYml0c3Rvcm0ub3JnPlxuICAgICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbiAgICAgKi9cblxuICAgIC8vIENhbGN1bGF0ZSBhbiBpbi1iZXR3ZWVuIGNvbG9yLiBSZXR1cm5zIFwiI2FhYmJjY1wiLWxpa2Ugc3RyaW5nLlxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUNvbG9yKGJlZ2luLCBlbmQsIHBvcykge1xuICAgICAgICB2YXIgY29sb3IgPSAncmdiYSgnXG4gICAgICAgICAgICAgICAgKyBwYXJzZUludCgoYmVnaW5bMF0gKyBwb3MgKiAoZW5kWzBdIC0gYmVnaW5bMF0pKSwgMTApICsgJywnXG4gICAgICAgICAgICAgICAgKyBwYXJzZUludCgoYmVnaW5bMV0gKyBwb3MgKiAoZW5kWzFdIC0gYmVnaW5bMV0pKSwgMTApICsgJywnXG4gICAgICAgICAgICAgICAgKyBwYXJzZUludCgoYmVnaW5bMl0gKyBwb3MgKiAoZW5kWzJdIC0gYmVnaW5bMl0pKSwgMTApICsgJywnXG4gICAgICAgICAgICAgICAgKyAoYmVnaW4gJiYgZW5kID8gcGFyc2VGbG9hdChiZWdpblszXSArIHBvcyAqIChlbmRbM10gLSBiZWdpblszXSkpIDogMSk7XG5cbiAgICAgICAgY29sb3IgKz0gJyknO1xuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgYW4gQ1NTLXN5bnRheCBjb2xvci4gT3V0cHV0cyBhbiBhcnJheSBbciwgZywgYl1cbiAgICBmdW5jdGlvbiBwYXJzZUNvbG9yKGNvbG9yKSB7XG5cbiAgICAgICAgdmFyIG1hdGNoLCBxdWFkcnVwbGV0O1xuXG4gICAgICAgIC8vIE1hdGNoICNhYWJiY2NcbiAgICAgICAgaWYgKG1hdGNoID0gLyMoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkvLmV4ZWMoY29sb3IpKSB7XG4gICAgICAgICAgICBxdWFkcnVwbGV0ID0gW3BhcnNlSW50KG1hdGNoWzFdLCAxNiksIHBhcnNlSW50KG1hdGNoWzJdLCAxNiksIHBhcnNlSW50KG1hdGNoWzNdLCAxNiksIDFdO1xuXG4gICAgICAgICAgICAvLyBNYXRjaCAjYWJjXG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSAvIyhbMC05YS1mQS1GXSkoWzAtOWEtZkEtRl0pKFswLTlhLWZBLUZdKS8uZXhlYyhjb2xvcikpIHtcbiAgICAgICAgICAgIHF1YWRydXBsZXQgPSBbcGFyc2VJbnQobWF0Y2hbMV0sIDE2KSAqIDE3LCBwYXJzZUludChtYXRjaFsyXSwgMTYpICogMTcsIHBhcnNlSW50KG1hdGNoWzNdLCAxNikgKiAxNywgMV07XG5cbiAgICAgICAgICAgIC8vIE1hdGNoIHJnYihuLCBuLCBuKVxuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gL3JnYlxcKFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqXFwpLy5leGVjKGNvbG9yKSkge1xuICAgICAgICAgICAgcXVhZHJ1cGxldCA9IFtwYXJzZUludChtYXRjaFsxXSksIHBhcnNlSW50KG1hdGNoWzJdKSwgcGFyc2VJbnQobWF0Y2hbM10pLCAxXTtcblxuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gL3JnYmFcXChcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTlcXC5dKilcXHMqXFwpLy5leGVjKGNvbG9yKSkge1xuICAgICAgICAgICAgcXVhZHJ1cGxldCA9IFtwYXJzZUludChtYXRjaFsxXSwgMTApLCBwYXJzZUludChtYXRjaFsyXSwgMTApLCBwYXJzZUludChtYXRjaFszXSwgMTApLHBhcnNlRmxvYXQobWF0Y2hbNF0pXTtcblxuICAgICAgICAgICAgLy8gTm8gYnJvd3NlciByZXR1cm5zIHJnYihuJSwgbiUsIG4lKSwgc28gbGl0dGxlIHJlYXNvbiB0byBzdXBwb3J0IHRoaXMgZm9ybWF0LlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVhZHJ1cGxldCA9IGNvbG9yc1tjb2xvcl0gfHwgWzI1NSwyNTUsMjU1LDBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWFkcnVwbGV0O1xuICAgIH1cblxuICAgIHJldHVybiBVSS5wYXJhbGxheDtcbn0pO1xuIl19