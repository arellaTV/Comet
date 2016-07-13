"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-grid", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('grid', {

        defaults: {
            colwidth: 'auto',
            animation: true,
            duration: 300,
            gutter: 0,
            controls: false,
            filter: false
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$('[data-uk-grid]', context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("grid")) {
                        UI.grid(ele, UI.Utils.options(ele.attr('data-uk-grid')));
                    }
                });
            });
        },

        init: function init() {

            var $this = this,
                gutter = String(this.options.gutter).trim().split(' ');

            this.gutterv = parseInt(gutter[0], 10);
            this.gutterh = parseInt(gutter[1] || gutter[0], 10);

            // make sure parent element has the right position property
            this.element.css({ 'position': 'relative' });

            this.controls = null;

            if (this.options.controls) {

                this.controls = UI.$(this.options.controls);

                // filter
                this.controls.on('click', '[data-uk-filter]', function (e) {
                    e.preventDefault();
                    $this.filter(UI.$(this).attr('data-uk-filter'));
                });

                // sort
                this.controls.on('click', '[data-uk-sort]', function (e) {
                    e.preventDefault();
                    var cmd = UI.$(this).attr('data-uk-sort').split(':');
                    $this.sort(cmd[0], cmd[1]);
                });
            }

            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function () {

                if ($this.currentfilter) {
                    $this.filter($this.currentfilter);
                } else {
                    this.updateLayout();
                }
            }.bind(this), 100));

            this.on('display.uk.check', function () {
                if ($this.element.is(":visible")) $this.updateLayout();
            });

            UI.domObserve(this.element, function (e) {
                $this.updateLayout();
            });

            if (this.options.filter !== false) {
                this.filter(this.options.filter);
            } else {
                this.updateLayout();
            }
        },

        _prepareElements: function _prepareElements() {

            var children = this.element.children(':not([data-grid-prepared])'),
                css;

            // exit if no already prepared elements found
            if (!children.length) {
                return;
            }

            css = {
                'position': 'absolute',
                'box-sizing': 'border-box',
                'width': this.options.colwidth == 'auto' ? '' : this.options.colwidth
            };

            if (this.options.gutter) {

                css['padding-left'] = this.gutterh;
                css['padding-bottom'] = this.gutterv;

                this.element.css('margin-left', this.gutterh * -1);
            }

            children.attr('data-grid-prepared', 'true').css(css);
        },

        updateLayout: function updateLayout(elements) {

            this._prepareElements();

            elements = elements || this.element.children(':visible');

            var children = elements,
                maxwidth = this.element.width() + 2 * this.gutterh + 2,
                left = 0,
                top = 0,
                positions = [],
                item,
                width,
                height,
                pos,
                i,
                z,
                max,
                size;

            this.trigger('beforeupdate.uk.grid', [children]);

            children.each(function (index) {

                size = getElementSize(this);

                item = UI.$(this);
                width = size.outerWidth;
                height = size.outerHeight;
                left = 0;
                top = 0;

                for (i = 0, max = positions.length; i < max; i++) {

                    pos = positions[i];

                    if (left <= pos.aX) {
                        left = pos.aX;
                    }
                    if (maxwidth < left + width) {
                        left = 0;
                    }
                    if (top <= pos.aY) {
                        top = pos.aY;
                    }
                }

                positions.push({
                    "ele": item,
                    "top": top,
                    "left": left,
                    "width": width,
                    "height": height,
                    "aY": top + height,
                    "aX": left + width
                });
            });

            var posPrev,
                maxHeight = 0;

            // fix top
            for (i = 0, max = positions.length; i < max; i++) {

                pos = positions[i];
                top = 0;

                for (z = 0; z < i; z++) {

                    posPrev = positions[z];

                    // (posPrev.left + 1) fixex 1px bug when using % based widths
                    if (pos.left < posPrev.aX && posPrev.left + 1 < pos.aX) {
                        top = posPrev.aY;
                    }
                }

                pos.top = top;
                pos.aY = top + pos.height;

                maxHeight = Math.max(maxHeight, pos.aY);
            }

            maxHeight = maxHeight - this.gutterv;

            if (this.options.animation) {

                this.element.stop().animate({ 'height': maxHeight }, 100);

                positions.forEach(function (pos) {
                    pos.ele.stop().animate({ "top": pos.top, "left": pos.left, opacity: 1 }, this.options.duration);
                }.bind(this));
            } else {

                this.element.css('height', maxHeight);

                positions.forEach(function (pos) {
                    pos.ele.css({ "top": pos.top, "left": pos.left, opacity: 1 });
                }.bind(this));
            }

            // make sure to trigger possible scrollpies etc.
            setTimeout(function () {
                UI.$doc.trigger('scrolling.uk.document');
            }, 2 * this.options.duration * (this.options.animation ? 1 : 0));

            this.trigger('afterupdate.uk.grid', [children]);
        },

        filter: function filter(_filter) {

            this.currentfilter = _filter;

            _filter = _filter || [];

            if (typeof _filter === 'number') {
                _filter = _filter.toString();
            }

            if (typeof _filter === 'string') {
                _filter = _filter.split(/,/).map(function (item) {
                    return item.trim();
                });
            }

            var $this = this,
                children = this.element.children(),
                elements = { "visible": [], "hidden": [] },
                visible,
                hidden;

            children.each(function (index) {

                var ele = UI.$(this),
                    f = ele.attr('data-uk-filter'),
                    infilter = _filter.length ? false : true;

                if (f) {

                    f = f.split(/,/).map(function (item) {
                        return item.trim();
                    });

                    _filter.forEach(function (item) {
                        if (f.indexOf(item) > -1) infilter = true;
                    });
                }

                elements[infilter ? "visible" : "hidden"].push(ele);
            });

            // convert to jQuery collections
            elements.hidden = UI.$(elements.hidden).map(function () {
                return this[0];
            });
            elements.visible = UI.$(elements.visible).map(function () {
                return this[0];
            });

            elements.hidden.attr('aria-hidden', 'true').filter(':visible').fadeOut(this.options.duration);
            elements.visible.attr('aria-hidden', 'false').filter(':hidden').css('opacity', 0).show();

            $this.updateLayout(elements.visible);

            if (this.controls && this.controls.length) {
                this.controls.find('[data-uk-filter]').removeClass('uk-active').filter('[data-uk-filter="' + _filter + '"]').addClass('uk-active');
            }
        },

        sort: function sort(by, order) {

            order = order || 1;

            // covert from string (asc|desc) to number
            if (typeof order === 'string') {
                order = order.toLowerCase() == 'desc' ? -1 : 1;
            }

            var elements = this.element.children();

            elements.sort(function (a, b) {

                a = UI.$(a);
                b = UI.$(b);

                return (b.data(by) || '') < (a.data(by) || '') ? order : order * -1;
            }).appendTo(this.element);

            this.updateLayout(elements.filter(':visible'));

            if (this.controls && this.controls.length) {
                this.controls.find('[data-uk-sort]').removeClass('uk-active').filter('[data-uk-sort="' + by + ':' + (order == -1 ? 'desc' : 'asc') + '"]').addClass('uk-active');
            }
        }
    });

    /*!
    * getSize v1.2.2
    * measure size of elements
    * MIT license
    * https://github.com/desandro/get-size
    */
    var _getSize = function () {

        var prefixes = 'Webkit Moz ms Ms O'.split(' ');
        var docElemStyle = document.documentElement.style;

        function getStyleProperty(propName) {
            if (!propName) {
                return;
            }

            // test standard property first
            if (typeof docElemStyle[propName] === 'string') {
                return propName;
            }

            // capitalize
            propName = propName.charAt(0).toUpperCase() + propName.slice(1);

            // test vendor specific properties
            var prefixed;
            for (var i = 0, len = prefixes.length; i < len; i++) {
                prefixed = prefixes[i] + propName;
                if (typeof docElemStyle[prefixed] === 'string') {
                    return prefixed;
                }
            }
        }

        // -------------------------- helpers -------------------------- //

        // get a number from a string, not a percentage
        function getStyleSize(value) {
            var num = parseFloat(value);
            // not a percent like '100%', and a number
            var isValid = value.indexOf('%') === -1 && !isNaN(num);
            return isValid && num;
        }

        function noop() {}

        var logError = typeof console === 'undefined' ? noop : function (message) {
            console.error(message);
        };

        // -------------------------- measurements -------------------------- //

        var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];

        function getZeroSize() {
            var size = {
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0,
                outerWidth: 0,
                outerHeight: 0
            };
            for (var i = 0, len = measurements.length; i < len; i++) {
                var measurement = measurements[i];
                size[measurement] = 0;
            }
            return size;
        }

        // -------------------------- setup -------------------------- //

        var isSetup = false;
        var getStyle, boxSizingProp, isBoxSizeOuter;

        /**
        * setup vars and functions
        * do it on initial getSize(), rather than on script load
        * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
        */
        function setup() {
            // setup once
            if (isSetup) {
                return;
            }
            isSetup = true;

            var getComputedStyle = window.getComputedStyle;
            getStyle = function () {
                var getStyleFn = getComputedStyle ? function (elem) {
                    return getComputedStyle(elem, null);
                } : function (elem) {
                    return elem.currentStyle;
                };

                return function getStyle(elem) {
                    var style = getStyleFn(elem);
                    if (!style) {
                        logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1');
                    }
                    return style;
                };
            }();

            // -------------------------- box sizing -------------------------- //

            boxSizingProp = getStyleProperty('boxSizing');

            /**
            * WebKit measures the outer-width on style.width on border-box elems
            * IE & Firefox measures the inner-width
            */
            if (boxSizingProp) {
                var div = document.createElement('div');
                div.style.width = '200px';
                div.style.padding = '1px 2px 3px 4px';
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '1px 2px 3px 4px';
                div.style[boxSizingProp] = 'border-box';

                var body = document.body || document.documentElement;
                body.appendChild(div);
                var style = getStyle(div);

                isBoxSizeOuter = getStyleSize(style.width) === 200;
                body.removeChild(div);
            }
        }

        // -------------------------- getSize -------------------------- //

        function getSize(elem) {
            setup();

            // use querySeletor if elem is string
            if (typeof elem === 'string') {
                elem = document.querySelector(elem);
            }

            // do not proceed on non-objects
            if (!elem || (typeof elem === "undefined" ? "undefined" : _typeof(elem)) !== 'object' || !elem.nodeType) {
                return;
            }

            var style = getStyle(elem);

            // if hidden, everything is 0
            if (style.display === 'none') {
                return getZeroSize();
            }

            var size = {};
            size.width = elem.offsetWidth;
            size.height = elem.offsetHeight;

            var isBorderBox = size.isBorderBox = !!(boxSizingProp && style[boxSizingProp] && style[boxSizingProp] === 'border-box');

            // get all measurements
            for (var i = 0, len = measurements.length; i < len; i++) {
                var measurement = measurements[i];
                var value = style[measurement];

                var num = parseFloat(value);
                // any 'auto', 'medium' value will be 0
                size[measurement] = !isNaN(num) ? num : 0;
            }

            var paddingWidth = size.paddingLeft + size.paddingRight;
            var paddingHeight = size.paddingTop + size.paddingBottom;
            var marginWidth = size.marginLeft + size.marginRight;
            var marginHeight = size.marginTop + size.marginBottom;
            var borderWidth = size.borderLeftWidth + size.borderRightWidth;
            var borderHeight = size.borderTopWidth + size.borderBottomWidth;

            var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

            // overwrite width and height if we can get it from style
            var styleWidth = getStyleSize(style.width);
            if (styleWidth !== false) {
                size.width = styleWidth + (
                // add padding and border unless it's already including it
                isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
            }

            var styleHeight = getStyleSize(style.height);
            if (styleHeight !== false) {
                size.height = styleHeight + (
                // add padding and border unless it's already including it
                isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
            }

            size.innerWidth = size.width - (paddingWidth + borderWidth);
            size.innerHeight = size.height - (paddingHeight + borderHeight);

            size.outerWidth = size.width + marginWidth;
            size.outerHeight = size.height + marginHeight;

            return size;
        }

        return getSize;
    }();

    function getElementSize(ele) {
        return _getSize(ele);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2dyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxZQUFQLEVBQXFCLENBQUMsT0FBRCxDQUFyQixFQUFnQyxZQUFVO0FBQ3RDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLE9BQUcsU0FBSCxDQUFhLE1BQWIsRUFBcUI7O0FBRWpCLGtCQUFVO0FBQ04sc0JBQVksTUFETjtBQUVOLHVCQUFZLElBRk47QUFHTixzQkFBWSxHQUhOO0FBSU4sb0JBQVksQ0FKTjtBQUtOLHNCQUFZLEtBTE47QUFNTixvQkFBWTtBQU5OLFNBRk87O0FBV2pCLGNBQU8sZ0JBQVc7OztBQUdkLGVBQUcsS0FBSCxDQUFTLFVBQVMsT0FBVCxFQUFrQjs7QUFFdkIsbUJBQUcsQ0FBSCxDQUFLLGdCQUFMLEVBQXVCLE9BQXZCLEVBQWdDLElBQWhDLENBQXFDLFlBQVU7O0FBRTNDLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFHLENBQUMsSUFBSSxJQUFKLENBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCLDJCQUFHLElBQUgsQ0FBUSxHQUFSLEVBQWEsR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixJQUFJLElBQUosQ0FBUyxjQUFULENBQWpCLENBQWI7QUFDSDtBQUNKLGlCQVBEO0FBUUgsYUFWRDtBQVdILFNBekJnQjs7QUEyQmpCLGNBQU0sZ0JBQVc7O0FBRWIs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aWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1ncmlkXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBVSS5jb21wb25lbnQoJ2dyaWQnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIGNvbHdpZHRoICA6ICdhdXRvJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbiA6IHRydWUsXG4gICAgICAgICAgICBkdXJhdGlvbiAgOiAzMDAsXG4gICAgICAgICAgICBndXR0ZXIgICAgOiAwLFxuICAgICAgICAgICAgY29udHJvbHMgIDogZmFsc2UsXG4gICAgICAgICAgICBmaWx0ZXIgICAgOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6ICBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKCdbZGF0YS11ay1ncmlkXScsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZighZWxlLmRhdGEoXCJncmlkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5ncmlkKGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cignZGF0YS11ay1ncmlkJykpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIGd1dHRlciA9IFN0cmluZyh0aGlzLm9wdGlvbnMuZ3V0dGVyKS50cmltKCkuc3BsaXQoJyAnKTtcblxuICAgICAgICAgICAgdGhpcy5ndXR0ZXJ2ICA9IHBhcnNlSW50KGd1dHRlclswXSwgMTApO1xuICAgICAgICAgICAgdGhpcy5ndXR0ZXJoICA9IHBhcnNlSW50KChndXR0ZXJbMV0gfHwgZ3V0dGVyWzBdKSwgMTApO1xuXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgcGFyZW50IGVsZW1lbnQgaGFzIHRoZSByaWdodCBwb3NpdGlvbiBwcm9wZXJ0eVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ30pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250cm9scykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scyA9IFVJLiQodGhpcy5vcHRpb25zLmNvbnRyb2xzKTtcblxuICAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMub24oJ2NsaWNrJywgJ1tkYXRhLXVrLWZpbHRlcl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maWx0ZXIoVUkuJCh0aGlzKS5hdHRyKCdkYXRhLXVrLWZpbHRlcicpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIHNvcnRcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm9uKCdjbGljaycsICdbZGF0YS11ay1zb3J0XScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbWQgPSBVSS4kKHRoaXMpLmF0dHIoJ2RhdGEtdWstc29ydCcpLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnNvcnQoY21kWzBdLCBjbWRbMV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdsb2FkIHJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuY3VycmVudGZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maWx0ZXIoJHRoaXMuY3VycmVudGZpbHRlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTAwKSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2Rpc3BsYXkudWsuY2hlY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpICAkdGhpcy51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBVSS5kb21PYnNlcnZlKHRoaXMuZWxlbWVudCwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICR0aGlzLnVwZGF0ZUxheW91dCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyKHRoaXMub3B0aW9ucy5maWx0ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9wcmVwYXJlRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW4oJzpub3QoW2RhdGEtZ3JpZC1wcmVwYXJlZF0pJyksIGNzcztcblxuICAgICAgICAgICAgLy8gZXhpdCBpZiBubyBhbHJlYWR5IHByZXBhcmVkIGVsZW1lbnRzIGZvdW5kXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3NzID0ge1xuICAgICAgICAgICAgICAgICdwb3NpdGlvbicgICA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgJ2JveC1zaXppbmcnIDogJ2JvcmRlci1ib3gnLFxuICAgICAgICAgICAgICAgICd3aWR0aCcgICAgICA6IHRoaXMub3B0aW9ucy5jb2x3aWR0aCA9PSAnYXV0bycgPyAnJyA6IHRoaXMub3B0aW9ucy5jb2x3aWR0aFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ndXR0ZXIpIHtcblxuICAgICAgICAgICAgICAgIGNzc1sncGFkZGluZy1sZWZ0J10gICA9IHRoaXMuZ3V0dGVyaDtcbiAgICAgICAgICAgICAgICBjc3NbJ3BhZGRpbmctYm90dG9tJ10gPSB0aGlzLmd1dHRlcnY7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKCdtYXJnaW4tbGVmdCcsIHRoaXMuZ3V0dGVyaCAqIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hpbGRyZW4uYXR0cignZGF0YS1ncmlkLXByZXBhcmVkJywgJ3RydWUnKS5jc3MoY3NzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVMYXlvdXQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVFbGVtZW50cygpO1xuXG4gICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzIHx8IHRoaXMuZWxlbWVudC5jaGlsZHJlbignOnZpc2libGUnKTtcblxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuICA9IGVsZW1lbnRzLFxuICAgICAgICAgICAgICAgIG1heHdpZHRoICA9IHRoaXMuZWxlbWVudC53aWR0aCgpICsgKDIqdGhpcy5ndXR0ZXJoKSArIDIsXG4gICAgICAgICAgICAgICAgbGVmdCAgICAgID0gMCxcbiAgICAgICAgICAgICAgICB0b3AgICAgICAgPSAwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucyA9IFtdLFxuXG4gICAgICAgICAgICAgICAgaXRlbSwgd2lkdGgsIGhlaWdodCwgcG9zLCBpLCB6LCBtYXgsIHNpemU7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignYmVmb3JldXBkYXRlLnVrLmdyaWQnLCBbY2hpbGRyZW5dKTtcblxuICAgICAgICAgICAgY2hpbGRyZW4uZWFjaChmdW5jdGlvbihpbmRleCl7XG5cbiAgICAgICAgICAgICAgICBzaXplICAgPSBnZXRFbGVtZW50U2l6ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0gICA9IFVJLiQodGhpcyk7XG4gICAgICAgICAgICAgICAgd2lkdGggID0gc2l6ZS5vdXRlcldpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHNpemUub3V0ZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGVmdCAgID0gMDtcbiAgICAgICAgICAgICAgICB0b3AgICAgPSAwO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpPTAsbWF4PXBvc2l0aW9ucy5sZW5ndGg7aTxtYXg7aSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zaXRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWZ0IDw9IHBvcy5hWCkgeyBsZWZ0ID0gcG9zLmFYOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXh3aWR0aCA8IChsZWZ0ICsgd2lkdGgpKSB7IGxlZnQgPSAwOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3AgPD0gcG9zLmFZKSB7IHRvcCA9IHBvcy5hWTsgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJlbGVcIiAgICA6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIFwidG9wXCIgICAgOiB0b3AsXG4gICAgICAgICAgICAgICAgICAgIFwibGVmdFwiICAgOiBsZWZ0LFxuICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCIgIDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCIgOiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFwiYVlcIiAgICAgOiAodG9wICArIGhlaWdodCksXG4gICAgICAgICAgICAgICAgICAgIFwiYVhcIiAgICAgOiAobGVmdCArIHdpZHRoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwb3NQcmV2LCBtYXhIZWlnaHQgPSAwO1xuXG4gICAgICAgICAgICAvLyBmaXggdG9wXG4gICAgICAgICAgICBmb3IgKGk9MCxtYXg9cG9zaXRpb25zLmxlbmd0aDtpPG1heDtpKyspIHtcblxuICAgICAgICAgICAgICAgIHBvcyA9IHBvc2l0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICB0b3AgPSAwO1xuXG4gICAgICAgICAgICAgICAgZm9yICh6PTA7ejxpO3orKykge1xuXG4gICAgICAgICAgICAgICAgICAgIHBvc1ByZXYgPSBwb3NpdGlvbnNbel07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gKHBvc1ByZXYubGVmdCArIDEpIGZpeGV4IDFweCBidWcgd2hlbiB1c2luZyAlIGJhc2VkIHdpZHRoc1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zLmxlZnQgPCBwb3NQcmV2LmFYICYmIChwb3NQcmV2LmxlZnQgKzEpIDwgcG9zLmFYKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgPSBwb3NQcmV2LmFZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcG9zLnRvcCA9IHRvcDtcbiAgICAgICAgICAgICAgICBwb3MuYVkgID0gdG9wICsgcG9zLmhlaWdodDtcblxuICAgICAgICAgICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgcG9zLmFZKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gbWF4SGVpZ2h0IC0gdGhpcy5ndXR0ZXJ2O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0b3AoKS5hbmltYXRlKHsnaGVpZ2h0JzogbWF4SGVpZ2h0fSwgMTAwKTtcblxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHBvcyl7XG4gICAgICAgICAgICAgICAgICAgIHBvcy5lbGUuc3RvcCgpLmFuaW1hdGUoe1widG9wXCI6IHBvcy50b3AsIFwibGVmdFwiOiBwb3MubGVmdCwgb3BhY2l0eTogMX0sIHRoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2hlaWdodCcsIG1heEhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMuZm9yRWFjaChmdW5jdGlvbihwb3Mpe1xuICAgICAgICAgICAgICAgICAgICBwb3MuZWxlLmNzcyh7XCJ0b3BcIjogcG9zLnRvcCwgXCJsZWZ0XCI6IHBvcy5sZWZ0LCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRvIHRyaWdnZXIgcG9zc2libGUgc2Nyb2xscGllcyBldGMuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFVJLiRkb2MudHJpZ2dlcignc2Nyb2xsaW5nLnVrLmRvY3VtZW50Jyk7XG4gICAgICAgICAgICB9LCAyICogdGhpcy5vcHRpb25zLmR1cmF0aW9uICogKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPyAxOjApKTtcblxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdhZnRlcnVwZGF0ZS51ay5ncmlkJywgW2NoaWxkcmVuXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlsdGVyOiBmdW5jdGlvbihmaWx0ZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ZmlsdGVyID0gZmlsdGVyO1xuXG4gICAgICAgICAgICBmaWx0ZXIgPSBmaWx0ZXIgfHwgW107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoZmlsdGVyKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBmaWx0ZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZihmaWx0ZXIpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5zcGxpdCgvLC8pLm1hcChmdW5jdGlvbihpdGVtKXsgcmV0dXJuIGl0ZW0udHJpbSgpOyB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW4oKSwgZWxlbWVudHMgPSB7XCJ2aXNpYmxlXCI6IFtdLCBcImhpZGRlblwiOiBbXX0sIHZpc2libGUsIGhpZGRlbjtcblxuICAgICAgICAgICAgY2hpbGRyZW4uZWFjaChmdW5jdGlvbihpbmRleCl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKSwgZiA9IGVsZS5hdHRyKCdkYXRhLXVrLWZpbHRlcicpLCBpbmZpbHRlciA9IGZpbHRlci5sZW5ndGggPyBmYWxzZSA6IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZikge1xuXG4gICAgICAgICAgICAgICAgICAgIGYgPSBmLnNwbGl0KC8sLykubWFwKGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS50cmltKCk7IH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYuaW5kZXhPZihpdGVtKSA+IC0xKSBpbmZpbHRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzW2luZmlsdGVyID8gXCJ2aXNpYmxlXCI6XCJoaWRkZW5cIl0ucHVzaChlbGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8galF1ZXJ5IGNvbGxlY3Rpb25zXG4gICAgICAgICAgICBlbGVtZW50cy5oaWRkZW4gID0gVUkuJChlbGVtZW50cy5oaWRkZW4pLm1hcChmdW5jdGlvbiAoKSB7cmV0dXJuIHRoaXNbMF07fSk7XG4gICAgICAgICAgICBlbGVtZW50cy52aXNpYmxlID0gVUkuJChlbGVtZW50cy52aXNpYmxlKS5tYXAoZnVuY3Rpb24gKCkge3JldHVybiB0aGlzWzBdO30pO1xuXG4gICAgICAgICAgICBlbGVtZW50cy5oaWRkZW4uYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpLmZpbHRlcignOnZpc2libGUnKS5mYWRlT3V0KHRoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgICAgICAgICBlbGVtZW50cy52aXNpYmxlLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJykuZmlsdGVyKCc6aGlkZGVuJykuY3NzKCdvcGFjaXR5JywgMCkuc2hvdygpO1xuXG4gICAgICAgICAgICAkdGhpcy51cGRhdGVMYXlvdXQoZWxlbWVudHMudmlzaWJsZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzICYmIHRoaXMuY29udHJvbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5maW5kKCdbZGF0YS11ay1maWx0ZXJdJykucmVtb3ZlQ2xhc3MoJ3VrLWFjdGl2ZScpLmZpbHRlcignW2RhdGEtdWstZmlsdGVyPVwiJytmaWx0ZXIrJ1wiXScpLmFkZENsYXNzKCd1ay1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzb3J0OiBmdW5jdGlvbihieSwgb3JkZXIpe1xuXG4gICAgICAgICAgICBvcmRlciA9IG9yZGVyIHx8IDE7XG5cbiAgICAgICAgICAgIC8vIGNvdmVydCBmcm9tIHN0cmluZyAoYXNjfGRlc2MpIHRvIG51bWJlclxuICAgICAgICAgICAgaWYgKHR5cGVvZihvcmRlcikgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3JkZXIgPSBvcmRlci50b0xvd2VyQ2FzZSgpID09ICdkZXNjJyA/IC0xIDogMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50LmNoaWxkcmVuKCk7XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLnNvcnQoZnVuY3Rpb24oYSwgYil7XG5cbiAgICAgICAgICAgICAgICBhID0gVUkuJChhKTtcbiAgICAgICAgICAgICAgICBiID0gVUkuJChiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoYi5kYXRhKGJ5KSB8fCAnJykgPCAoYS5kYXRhKGJ5KSB8fCAnJykgPyBvcmRlciA6IChvcmRlciotMSk7XG5cbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGF5b3V0KGVsZW1lbnRzLmZpbHRlcignOnZpc2libGUnKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzICYmIHRoaXMuY29udHJvbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5maW5kKCdbZGF0YS11ay1zb3J0XScpLnJlbW92ZUNsYXNzKCd1ay1hY3RpdmUnKS5maWx0ZXIoJ1tkYXRhLXVrLXNvcnQ9XCInK2J5Kyc6Jysob3JkZXIgPT0gLTEgPyAnZGVzYyc6J2FzYycpKydcIl0nKS5hZGRDbGFzcygndWstYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLyohXG4gICAgKiBnZXRTaXplIHYxLjIuMlxuICAgICogbWVhc3VyZSBzaXplIG9mIGVsZW1lbnRzXG4gICAgKiBNSVQgbGljZW5zZVxuICAgICogaHR0cHM6Ly9naXRodWIuY29tL2Rlc2FuZHJvL2dldC1zaXplXG4gICAgKi9cbiAgICB2YXIgX2dldFNpemUgPSAoZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgcHJlZml4ZXMgPSAnV2Via2l0IE1veiBtcyBNcyBPJy5zcGxpdCgnICcpO1xuICAgICAgICB2YXIgZG9jRWxlbVN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFN0eWxlUHJvcGVydHkoIHByb3BOYW1lICkge1xuICAgICAgICAgICAgaWYgKCAhcHJvcE5hbWUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0ZXN0IHN0YW5kYXJkIHByb3BlcnR5IGZpcnN0XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBkb2NFbGVtU3R5bGVbIHByb3BOYW1lIF0gPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FwaXRhbGl6ZVxuICAgICAgICAgICAgcHJvcE5hbWUgPSBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgICAvLyB0ZXN0IHZlbmRvciBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YXIgcHJlZml4ZWQ7XG4gICAgICAgICAgICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBwcmVmaXhlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgICAgICAgICAgICBwcmVmaXhlZCA9IHByZWZpeGVzW2ldICsgcHJvcE5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgZG9jRWxlbVN0eWxlWyBwcmVmaXhlZCBdID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICAgICAvLyBnZXQgYSBudW1iZXIgZnJvbSBhIHN0cmluZywgbm90IGEgcGVyY2VudGFnZVxuICAgICAgICBmdW5jdGlvbiBnZXRTdHlsZVNpemUoIHZhbHVlICkge1xuICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG4gICAgICAgICAgICAvLyBub3QgYSBwZXJjZW50IGxpa2UgJzEwMCUnLCBhbmQgYSBudW1iZXJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gdmFsdWUuaW5kZXhPZignJScpID09PSAtMSAmJiAhaXNOYU4oIG51bSApO1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQgJiYgbnVtO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbm9vcCgpIHt9XG5cbiAgICAgICAgdmFyIGxvZ0Vycm9yID0gdHlwZW9mIGNvbnNvbGUgPT09ICd1bmRlZmluZWQnID8gbm9vcCA6IGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggbWVzc2FnZSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1lYXN1cmVtZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgICAgIHZhciBtZWFzdXJlbWVudHMgPSBbXG4gICAgICAgICAgICAncGFkZGluZ0xlZnQnLFxuICAgICAgICAgICAgJ3BhZGRpbmdSaWdodCcsXG4gICAgICAgICAgICAncGFkZGluZ1RvcCcsXG4gICAgICAgICAgICAncGFkZGluZ0JvdHRvbScsXG4gICAgICAgICAgICAnbWFyZ2luTGVmdCcsXG4gICAgICAgICAgICAnbWFyZ2luUmlnaHQnLFxuICAgICAgICAgICAgJ21hcmdpblRvcCcsXG4gICAgICAgICAgICAnbWFyZ2luQm90dG9tJyxcbiAgICAgICAgICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJCb3R0b21XaWR0aCdcbiAgICAgICAgXTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRaZXJvU2l6ZSgpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICBpbm5lcldpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGlubmVySGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIG91dGVyV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgb3V0ZXJIZWlnaHQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBtZWFzdXJlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIHNpemVbIG1lYXN1cmVtZW50IF0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHNldHVwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgICAgICAgdmFyIGlzU2V0dXAgPSBmYWxzZTtcbiAgICAgICAgdmFyIGdldFN0eWxlLCBib3hTaXppbmdQcm9wLCBpc0JveFNpemVPdXRlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgKiBzZXR1cCB2YXJzIGFuZCBmdW5jdGlvbnNcbiAgICAgICAgKiBkbyBpdCBvbiBpbml0aWFsIGdldFNpemUoKSwgcmF0aGVyIHRoYW4gb24gc2NyaXB0IGxvYWRcbiAgICAgICAgKiBGb3IgRmlyZWZveCBidWcgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgICAgICAgLy8gc2V0dXAgb25jZVxuICAgICAgICAgICAgaWYgKCBpc1NldHVwICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzU2V0dXAgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xuICAgICAgICAgICAgZ2V0U3R5bGUgPSAoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBnZXRTdHlsZUZuID0gZ2V0Q29tcHV0ZWRTdHlsZSA/XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKCBlbGVtLCBudWxsICk7XG4gICAgICAgICAgICAgICAgfSA6XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLmN1cnJlbnRTdHlsZTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdldFN0eWxlKCBlbGVtICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBnZXRTdHlsZUZuKCBlbGVtICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0eWxlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoICdTdHlsZSByZXR1cm5lZCAnICsgc3R5bGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJy4gQXJlIHlvdSBydW5uaW5nIHRoaXMgY29kZSBpbiBhIGhpZGRlbiBpZnJhbWUgb24gRmlyZWZveD8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9iaXQubHkvZ2V0c2l6ZWJ1ZzEnICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBib3ggc2l6aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgICAgICAgICAgIGJveFNpemluZ1Byb3AgPSBnZXRTdHlsZVByb3BlcnR5KCdib3hTaXppbmcnKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIFdlYktpdCBtZWFzdXJlcyB0aGUgb3V0ZXItd2lkdGggb24gc3R5bGUud2lkdGggb24gYm9yZGVyLWJveCBlbGVtc1xuICAgICAgICAgICAgKiBJRSAmIEZpcmVmb3ggbWVhc3VyZXMgdGhlIGlubmVyLXdpZHRoXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBib3hTaXppbmdQcm9wICkge1xuICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUud2lkdGggPSAnMjAwcHgnO1xuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5wYWRkaW5nID0gJzFweCAycHggM3B4IDRweCc7XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLmJvcmRlclN0eWxlID0gJ3NvbGlkJztcbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUuYm9yZGVyV2lkdGggPSAnMXB4IDJweCAzcHggNHB4JztcbiAgICAgICAgICAgICAgICBkaXYuc3R5bGVbIGJveFNpemluZ1Byb3AgXSA9ICdib3JkZXItYm94JztcblxuICAgICAgICAgICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgYm9keS5hcHBlbmRDaGlsZCggZGl2ICk7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gZ2V0U3R5bGUoIGRpdiApO1xuXG4gICAgICAgICAgICAgICAgaXNCb3hTaXplT3V0ZXIgPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICkgPT09IDIwMDtcbiAgICAgICAgICAgICAgICBib2R5LnJlbW92ZUNoaWxkKCBkaXYgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZ2V0U2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNpemUoIGVsZW0gKSB7XG4gICAgICAgICAgICBzZXR1cCgpO1xuXG4gICAgICAgICAgICAvLyB1c2UgcXVlcnlTZWxldG9yIGlmIGVsZW0gaXMgc3RyaW5nXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggZWxlbSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkbyBub3QgcHJvY2VlZCBvbiBub24tb2JqZWN0c1xuICAgICAgICAgICAgaWYgKCAhZWxlbSB8fCB0eXBlb2YgZWxlbSAhPT0gJ29iamVjdCcgfHwgIWVsZW0ubm9kZVR5cGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBnZXRTdHlsZSggZWxlbSApO1xuXG4gICAgICAgICAgICAvLyBpZiBoaWRkZW4sIGV2ZXJ5dGhpbmcgaXMgMFxuICAgICAgICAgICAgaWYgKCBzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFplcm9TaXplKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzaXplID0ge307XG4gICAgICAgICAgICBzaXplLndpZHRoID0gZWxlbS5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHNpemUuaGVpZ2h0ID0gZWxlbS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciBpc0JvcmRlckJveCA9IHNpemUuaXNCb3JkZXJCb3ggPSAhISggYm94U2l6aW5nUHJvcCAmJlxuICAgICAgICAgICAgICAgIHN0eWxlWyBib3hTaXppbmdQcm9wIF0gJiYgc3R5bGVbIGJveFNpemluZ1Byb3AgXSA9PT0gJ2JvcmRlci1ib3gnICk7XG5cbiAgICAgICAgICAgIC8vIGdldCBhbGwgbWVhc3VyZW1lbnRzXG4gICAgICAgICAgICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBtZWFzdXJlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHN0eWxlWyBtZWFzdXJlbWVudCBdO1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgLy8gYW55ICdhdXRvJywgJ21lZGl1bScgdmFsdWUgd2lsbCBiZSAwXG4gICAgICAgICAgICAgICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9ICFpc05hTiggbnVtICkgPyBudW0gOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFkZGluZ1dpZHRoID0gc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUucGFkZGluZ1JpZ2h0O1xuICAgICAgICAgICAgdmFyIHBhZGRpbmdIZWlnaHQgPSBzaXplLnBhZGRpbmdUb3AgKyBzaXplLnBhZGRpbmdCb3R0b207XG4gICAgICAgICAgICB2YXIgbWFyZ2luV2lkdGggPSBzaXplLm1hcmdpbkxlZnQgKyBzaXplLm1hcmdpblJpZ2h0O1xuICAgICAgICAgICAgdmFyIG1hcmdpbkhlaWdodCA9IHNpemUubWFyZ2luVG9wICsgc2l6ZS5tYXJnaW5Cb3R0b207XG4gICAgICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgICAgICAgICAgIHZhciBib3JkZXJIZWlnaHQgPSBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcblxuICAgICAgICAgICAgdmFyIGlzQm9yZGVyQm94U2l6ZU91dGVyID0gaXNCb3JkZXJCb3ggJiYgaXNCb3hTaXplT3V0ZXI7XG5cbiAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB3aWR0aCBhbmQgaGVpZ2h0IGlmIHdlIGNhbiBnZXQgaXQgZnJvbSBzdHlsZVxuICAgICAgICAgICAgdmFyIHN0eWxlV2lkdGggPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICk7XG4gICAgICAgICAgICBpZiAoIHN0eWxlV2lkdGggIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIHNpemUud2lkdGggPSBzdHlsZVdpZHRoICtcbiAgICAgICAgICAgICAgICAvLyBhZGQgcGFkZGluZyBhbmQgYm9yZGVyIHVubGVzcyBpdCdzIGFscmVhZHkgaW5jbHVkaW5nIGl0XG4gICAgICAgICAgICAgICAgKCBpc0JvcmRlckJveFNpemVPdXRlciA/IDAgOiBwYWRkaW5nV2lkdGggKyBib3JkZXJXaWR0aCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3R5bGVIZWlnaHQgPSBnZXRTdHlsZVNpemUoIHN0eWxlLmhlaWdodCApO1xuICAgICAgICAgICAgaWYgKCBzdHlsZUhlaWdodCAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgc2l6ZS5oZWlnaHQgPSBzdHlsZUhlaWdodCArXG4gICAgICAgICAgICAgICAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB1bmxlc3MgaXQncyBhbHJlYWR5IGluY2x1ZGluZyBpdFxuICAgICAgICAgICAgICAgICggaXNCb3JkZXJCb3hTaXplT3V0ZXIgPyAwIDogcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaXplLmlubmVyV2lkdGggPSBzaXplLndpZHRoIC0gKCBwYWRkaW5nV2lkdGggKyBib3JkZXJXaWR0aCApO1xuICAgICAgICAgICAgc2l6ZS5pbm5lckhlaWdodCA9IHNpemUuaGVpZ2h0IC0gKCBwYWRkaW5nSGVpZ2h0ICsgYm9yZGVySGVpZ2h0ICk7XG5cbiAgICAgICAgICAgIHNpemUub3V0ZXJXaWR0aCA9IHNpemUud2lkdGggKyBtYXJnaW5XaWR0aDtcbiAgICAgICAgICAgIHNpemUub3V0ZXJIZWlnaHQgPSBzaXplLmhlaWdodCArIG1hcmdpbkhlaWdodDtcblxuICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2V0U2l6ZTtcblxuICAgIH0pKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50U2l6ZShlbGUpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRTaXplKGVsZSk7XG4gICAgfVxufSk7XG4iXX0=