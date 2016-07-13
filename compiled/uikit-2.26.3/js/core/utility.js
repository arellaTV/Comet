'use strict';

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var stacks = [];

    UI.component('stackMargin', {

        defaults: {
            cls: 'uk-margin-small-top',
            rowfirst: false,
            observe: false
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-margin]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("stackMargin")) {
                        UI.stackMargin(ele, UI.Utils.options(ele.attr("data-uk-margin")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            UI.$win.on('resize orientationchange', function () {

                var fn = function fn() {
                    $this.process();
                };

                UI.$(function () {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 20);
            }());

            this.on("display.uk.check", function (e) {
                if (this.element.is(":visible")) this.process();
            }.bind(this));

            if (this.options.observe) {

                UI.domObserve(this.element, function (e) {
                    if ($this.element.is(":visible")) $this.process();
                });
            }

            stacks.push(this);
        },

        process: function process() {

            var $this = this,
                columns = this.element.children();

            UI.Utils.stackMargin(columns, this.options);

            if (!this.options.rowfirst || !columns.length) {
                return this;
            }

            // Mark first column elements
            var group = {},
                minleft = false;

            columns.removeClass(this.options.rowfirst).each(function (offset, $ele) {

                $ele = UI.$(this);

                if (this.style.display != 'none') {
                    offset = $ele.offset().left;
                    ((group[offset] = group[offset] || []) && group[offset]).push(this);
                    minleft = minleft === false ? offset : Math.min(minleft, offset);
                }
            });

            UI.$(group[minleft]).addClass(this.options.rowfirst);

            return this;
        }

    });

    // responsive element e.g. iframes

    (function () {

        var elements = [],
            check = function check(ele) {

            if (!ele.is(':visible')) return;

            var width = ele.parent().width(),
                iwidth = ele.data('width'),
                ratio = width / iwidth,
                height = Math.floor(ratio * ele.data('height'));

            ele.css({ 'height': width < iwidth ? height : ele.data('height') });
        };

        UI.component('responsiveElement', {

            defaults: {},

            boot: function boot() {

                // init code
                UI.ready(function (context) {

                    UI.$("iframe.uk-responsive-width, [data-uk-responsive]", context).each(function () {

                        var ele = UI.$(this),
                            obj;

                        if (!ele.data("responsiveElement")) {
                            obj = UI.responsiveElement(ele, {});
                        }
                    });
                });
            },

            init: function init() {

                var ele = this.element;

                if (ele.attr('width') && ele.attr('height')) {

                    ele.data({

                        'width': ele.attr('width'),
                        'height': ele.attr('height')

                    }).on('display.uk.check', function () {
                        check(ele);
                    });

                    check(ele);

                    elements.push(ele);
                }
            }
        });

        UI.$win.on('resize load', UI.Utils.debounce(function () {

            elements.forEach(function (ele) {
                check(ele);
            });
        }, 15));
    })();

    // helper

    UI.Utils.stackMargin = function (elements, options) {

        options = UI.$.extend({
            'cls': 'uk-margin-small-top'
        }, options);

        elements = UI.$(elements).removeClass(options.cls);

        var min = false;

        elements.each(function (offset, height, pos, $ele) {

            $ele = UI.$(this);

            if ($ele.css('display') != 'none') {

                offset = $ele.offset();
                height = $ele.outerHeight();
                pos = offset.top + height;

                $ele.data({
                    'ukMarginPos': pos,
                    'ukMarginTop': offset.top
                });

                if (min === false || offset.top < min.top) {

                    min = {
                        top: offset.top,
                        left: offset.left,
                        pos: pos
                    };
                }
            }
        }).each(function ($ele) {

            $ele = UI.$(this);

            if ($ele.css('display') != 'none' && $ele.data('ukMarginTop') > min.top && $ele.data('ukMarginPos') > min.pos) {
                $ele.addClass(options.cls);
            }
        });
    };

    UI.Utils.matchHeights = function (elements, options) {

        elements = UI.$(elements).css('min-height', '');
        options = UI.$.extend({ row: true }, options);

        var matchHeights = function matchHeights(group) {

            if (group.length < 2) return;

            var max = 0;

            group.each(function () {
                max = Math.max(max, UI.$(this).outerHeight());
            }).each(function () {

                var element = UI.$(this),
                    height = max - (element.css('box-sizing') == 'border-box' ? 0 : element.outerHeight() - element.height());

                element.css('min-height', height + 'px');
            });
        };

        if (options.row) {

            elements.first().width(); // force redraw

            setTimeout(function () {

                var lastoffset = false,
                    group = [];

                elements.each(function () {

                    var ele = UI.$(this),
                        offset = ele.offset().top;

                    if (offset != lastoffset && group.length) {

                        matchHeights(UI.$(group));
                        group = [];
                        offset = ele.offset().top;
                    }

                    group.push(ele);
                    lastoffset = offset;
                });

                if (group.length) {
                    matchHeights(UI.$(group));
                }
            }, 0);
        } else {
            matchHeights(elements);
        }
    };

    (function (cacheSvgs) {

        UI.Utils.inlineSvg = function (selector, root) {

            var images = UI.$(selector || 'img[src$=".svg"]', root || document).each(function () {

                var img = UI.$(this),
                    src = img.attr('src');

                if (!cacheSvgs[src]) {

                    var d = UI.$.Deferred();

                    UI.$.get(src, { nc: Math.random() }, function (data) {
                        d.resolve(UI.$(data).find('svg'));
                    });

                    cacheSvgs[src] = d.promise();
                }

                cacheSvgs[src].then(function (svg) {

                    var $svg = UI.$(svg).clone();

                    if (img.attr('id')) $svg.attr('id', img.attr('id'));
                    if (img.attr('class')) $svg.attr('class', img.attr('class'));
                    if (img.attr('style')) $svg.attr('style', img.attr('style'));

                    if (img.attr('width')) {
                        $svg.attr('width', img.attr('width'));
                        if (!img.attr('height')) $svg.removeAttr('height');
                    }

                    if (img.attr('height')) {
                        $svg.attr('height', img.attr('height'));
                        if (!img.attr('width')) $svg.removeAttr('width');
                    }

                    img.replaceWith($svg);
                });
            });
        };

        // init code
        UI.ready(function (context) {
            UI.Utils.inlineSvg('[data-uk-svg]', context);
        });
    })({});
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEVBQVQsRUFBYTs7QUFFVjs7QUFFQSxRQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFHLFNBQUgsQ0FBYSxhQUFiLEVBQTRCOztBQUV4QixrQkFBVTtBQUNOLGlCQUFLLHFCQURDO0FBRU4sc0JBQVUsS0FGSjtBQUdOLHFCQUFTO0FBSEgsU0FGYzs7QUFReEIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUssa0JBQUwsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBdUMsWUFBVzs7QUFFOUMsd0JBQUksTUFBTSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQVY7O0FBRUEsd0JBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxhQUFULENBQUwsRUFBOEI7QUFDMUIsMkJBQUcsV0FBSCxDQUFlLEdBQWYsRUFBb0IsR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixJQUFJLElBQUosQ0FBUyxnQkFBVCxDQUFqQixDQUFwQjtBQUNIO0FBQ0osaUJBUEQ7QUFRSCxhQVZEO0FBV0gsU0F0QnVCOztBQXdCeEIsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsZUFBRyxJQUFILENBQVEsRUFBUixDQUFXLDBCQUFYLEVBQXdDLFlBQVc7O0FBRS9DLG9CQUFJLEtBQUssU0FBTCxFQUFLLEdBQVc7QUFDaEIsMEJBQU0sT0FBTjtBQUNILGlCQUZEOztBQUlBLG1CQUFHLENBQUgsQ0FBSyxZQUFXO0FBQ1o7QUFDQSx1QkFBRyxJQUFILENBQVEsRUFBUixDQUFXLE1BQVgsRUFBbUIsRUFBbkI7QUFDSCxpQkFIRDs7QUFLQSx1QkFBTyxHQUFHLEtBQUgsQ0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLENBQVA7QUFDSCxhQVpzQyxFQUF2Qzs7QUFjQSxpQkFBSyxFQUFMLENBQVEsa0JBQVIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDcEMsb0JBQUksS0FBSyxPQUFMLENBQWEsRUFBYixDQUFnQixVQUFoQixDQUFKLEVBQWlDLEtBQUssT0FBTDtBQUNwQyxhQUYyQixDQUUxQixJQUYwQixDQUVyQixJQUZxQixDQUE1Qjs7QUFJQSxnQkFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFqQixFQUEwQjs7QUFFdEIsbUJBQUcsVUFBSCxDQUFjLEtBQUssT0FBbkIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDcEMsd0JBQUksTUFBTSxPQUFOLENBQWMsRUFBZCxDQUFpQixVQUFqQixDQUFKLEVBQWtDLE1BQU0sT0FBTjtBQUNyQyxpQkFGRDtBQUdIOztBQUVELG1CQUFPLElBQVAsQ0FBWSxJQUFaO0FBQ0gsU0F0RHVCOztBQXdEeEIsaUJBQVMsbUJBQVc7O0FBRWhCLGdCQUFJLFFBQVEsSUFBWjtBQUFBLGdCQUFrQixVQUFVLEtBQUssT0FBTCxDQUFhLFFBQWIsRUFBNUI7O0FBRUEsZUFBRyxLQUFILENBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QixLQUFLLE9BQW5DOztBQUVBLGdCQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsUUFBZCxJQUEwQixDQUFDLFFBQVEsTUFBdkMsRUFBK0M7QUFDM0MsdUJBQU8sSUFBUDtBQUNIOzs7QUFHRCxnQkFBSSxRQUFRLEVBQVo7QUFBQSxnQkFBZ0IsVUFBVSxLQUExQjs7QUFFQSxvQkFBUSxXQUFSLENBQW9CLEtBQUssT0FBTCxDQUFhLFFBQWpDLEVBQTJDLElBQTNDLENBQWdELFVBQVMsTUFBVCxFQUFpQixJQUFqQixFQUFzQjs7QUFFbEUsdUJBQU8sR0FBRyxDQUFILENBQUssSUFBTCxDQUFQOztBQUVBLG9CQUFJLEtBQUssS0FBTCxDQUFXLE9BQVgsSUFBc0IsTUFBMUIsRUFBa0M7QUFDOUIsNkJBQVMsS0FBSyxNQUFMLEdBQWMsSUFBdkI7QUFDQSxxQkFBQyxDQUFDLE1BQU0sTUFBTixJQUFnQixNQUFNLE1BQU4sS0FBaUIsRUFBbEMsS0FBeUMsTUFBTSxNQUFOLENBQTFDLEVBQXlELElBQXpELENBQThELElBQTlEO0FBQ0EsOEJBQVUsWUFBWSxLQUFaLEdBQW9CLE1BQXBCLEdBQTZCLEtBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsTUFBbEIsQ0FBdkM7QUFDSDtBQUNKLGFBVEQ7O0FBV0EsZUFBRyxDQUFILENBQUssTUFBTSxPQUFOLENBQUwsRUFBcUIsUUFBckIsQ0FBOEIsS0FBSyxPQUFMLENBQWEsUUFBM0M7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOztBQW5GdUIsS0FBNUI7Ozs7QUEwRkEsS0FBQyxZQUFVOztBQUVQLFlBQUksV0FBVyxFQUFmO0FBQUEsWUFBbUIsUUFBUSxTQUFSLEtBQVEsQ0FBUyxHQUFULEVBQWM7O0FBRXJDLGdCQUFJLENBQUMsSUFBSSxFQUFKLENBQU8sVUFBUCxDQUFMLEVBQXlCOztBQUV6QixnQkFBSSxRQUFTLElBQUksTUFBSixHQUFhLEtBQWIsRUFBYjtBQUFBLGdCQUNJLFNBQVMsSUFBSSxJQUFKLENBQVMsT0FBVCxDQURiO0FBQUEsZ0JBRUksUUFBVSxRQUFRLE1BRnRCO0FBQUEsZ0JBR0ksU0FBUyxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQUksSUFBSixDQUFTLFFBQVQsQ0FBbkIsQ0FIYjs7QUFLQSxnQkFBSSxHQUFKLENBQVEsRUFBQyxVQUFXLFFBQVEsTUFBVCxHQUFtQixNQUFuQixHQUE0QixJQUFJLElBQUosQ0FBUyxRQUFULENBQXZDLEVBQVI7QUFDSCxTQVZEOztBQVlBLFdBQUcsU0FBSCxDQUFhLG1CQUFiLEVBQWtDOztBQUU5QixzQkFBVSxFQUZvQjs7QUFJOUIsa0JBQU0sZ0JBQVc7OztBQUdiLG1CQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7O0FBRXZCLHVCQUFHLENBQUgsQ0FBSyxrREFBTCxFQUF5RCxPQUF6RCxFQUFrRSxJQUFsRSxDQUF1RSxZQUFXOztBQUU5RSw0QkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjtBQUFBLDRCQUFzQixHQUF0Qjs7QUFFQSw0QkFBSSxDQUFDLElBQUksSUFBSixDQUFTLG1CQUFULENBQUwsRUFBb0M7QUFDaEMsa0NBQU0sR0FBRyxpQkFBSCxDQUFxQixHQUFyQixFQUEwQixFQUExQixDQUFOO0FBQ0g7QUFDSixxQkFQRDtBQVFILGlCQVZEO0FBV0gsYUFsQjZCOztBQW9COUIsa0JBQU0sZ0JBQVc7O0FBRWIsb0JBQUksTUFBTSxLQUFLLE9BQWY7O0FBRUEsb0JBQUksSUFBSSxJQUFKLENBQVMsT0FBVCxLQUFxQixJQUFJLElBQUosQ0FBUyxRQUFULENBQXpCLEVBQTZDOztBQUV6Qyx3QkFBSSxJQUFKLENBQVM7O0FBRUwsaUNBQVUsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUZMO0FBR0wsa0NBQVUsSUFBSSxJQUFKLENBQVMsUUFBVDs7QUFITCxxQkFBVCxFQUtHLEVBTEgsQ0FLTSxrQkFMTixFQUswQixZQUFVO0FBQ2hDLDhCQUFNLEdBQU47QUFDSCxxQkFQRDs7QUFTQSwwQkFBTSxHQUFOOztBQUVBLDZCQUFTLElBQVQsQ0FBYyxHQUFkO0FBQ0g7QUFDSjtBQXZDNkIsU0FBbEM7O0FBMENBLFdBQUcsSUFBSCxDQUFRLEVBQVIsQ0FBVyxhQUFYLEVBQTBCLEdBQUcsS0FBSCxDQUFTLFFBQVQsQ0FBa0IsWUFBVTs7QUFFbEQscUJBQVMsT0FBVCxDQUFpQixVQUFTLEdBQVQsRUFBYTtBQUMxQixzQkFBTSxHQUFOO0FBQ0gsYUFGRDtBQUlILFNBTnlCLEVBTXZCLEVBTnVCLENBQTFCO0FBUUgsS0FoRUQ7Ozs7QUFzRUEsT0FBRyxLQUFILENBQVMsV0FBVCxHQUF1QixVQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEI7O0FBRS9DLGtCQUFVLEdBQUcsQ0FBSCxDQUFLLE1BQUwsQ0FBWTtBQUNsQixtQkFBTztBQURXLFNBQVosRUFFUCxPQUZPLENBQVY7O0FBSUEsbUJBQVcsR0FBRyxDQUFILENBQUssUUFBTCxFQUFlLFdBQWYsQ0FBMkIsUUFBUSxHQUFuQyxDQUFYOztBQUVBLFlBQUksTUFBTSxLQUFWOztBQUVBLGlCQUFTLElBQVQsQ0FBYyxVQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEIsSUFBOUIsRUFBbUM7O0FBRTdDLG1CQUFTLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVDs7QUFFQSxnQkFBSSxLQUFLLEdBQUwsQ0FBUyxTQUFULEtBQXVCLE1BQTNCLEVBQW1DOztBQUUvQix5QkFBUyxLQUFLLE1BQUwsRUFBVDtBQUNBLHlCQUFTLEtBQUssV0FBTCxFQUFUO0FBQ0Esc0JBQVMsT0FBTyxHQUFQLEdBQWEsTUFBdEI7O0FBRUEscUJBQUssSUFBTCxDQUFVO0FBQ04sbUNBQWUsR0FEVDtBQUVOLG1DQUFlLE9BQU87QUFGaEIsaUJBQVY7O0FBS0Esb0JBQUksUUFBUSxLQUFSLElBQWtCLE9BQU8sR0FBUCxHQUFhLElBQUksR0FBdkMsRUFBOEM7O0FBRTFDLDBCQUFNO0FBQ0YsNkJBQU8sT0FBTyxHQURaO0FBRUYsOEJBQU8sT0FBTyxJQUZaO0FBR0YsNkJBQU87QUFITCxxQkFBTjtBQUtIO0FBQ0o7QUFFSixTQXpCRCxFQXlCRyxJQXpCSCxDQXlCUSxVQUFTLElBQVQsRUFBZTs7QUFFbkIsbUJBQVMsR0FBRyxDQUFILENBQUssSUFBTCxDQUFUOztBQUVBLGdCQUFJLEtBQUssR0FBTCxDQUFTLFNBQVQsS0FBdUIsTUFBdkIsSUFBaUMsS0FBSyxJQUFMLENBQVUsYUFBVixJQUEyQixJQUFJLEdBQWhFLElBQXVFLEtBQUssSUFBTCxDQUFVLGFBQVYsSUFBMkIsSUFBSSxHQUExRyxFQUErRztBQUMzRyxxQkFBSyxRQUFMLENBQWMsUUFBUSxHQUF0QjtBQUNIO0FBQ0osU0FoQ0Q7QUFpQ0gsS0EzQ0Q7O0FBNkNBLE9BQUcsS0FBSCxDQUFTLFlBQVQsR0FBd0IsVUFBUyxRQUFULEVBQW1CLE9BQW5CLEVBQTRCOztBQUVoRCxtQkFBVyxHQUFHLENBQUgsQ0FBSyxRQUFMLEVBQWUsR0FBZixDQUFtQixZQUFuQixFQUFpQyxFQUFqQyxDQUFYO0FBQ0Esa0JBQVcsR0FBRyxDQUFILENBQUssTUFBTCxDQUFZLEVBQUUsS0FBTSxJQUFSLEVBQVosRUFBNEIsT0FBNUIsQ0FBWDs7QUFFQSxZQUFJLGVBQWUsU0FBZixZQUFlLENBQVMsS0FBVCxFQUFlOztBQUU5QixnQkFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQjs7QUFFdEIsZ0JBQUksTUFBTSxDQUFWOztBQUVBLGtCQUFNLElBQU4sQ0FBVyxZQUFXO0FBQ2xCLHNCQUFNLEtBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxHQUFHLENBQUgsQ0FBSyxJQUFMLEVBQVcsV0FBWCxFQUFkLENBQU47QUFDSCxhQUZELEVBRUcsSUFGSCxDQUVRLFlBQVc7O0FBRWYsb0JBQUksVUFBVSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQWQ7QUFBQSxvQkFDSSxTQUFVLE9BQU8sUUFBUSxHQUFSLENBQVksWUFBWixLQUE2QixZQUE3QixHQUE0QyxDQUE1QyxHQUFpRCxRQUFRLFdBQVIsS0FBd0IsUUFBUSxNQUFSLEVBQWhGLENBRGQ7O0FBR0Esd0JBQVEsR0FBUixDQUFZLFlBQVosRUFBMEIsU0FBUyxJQUFuQztBQUNILGFBUkQ7QUFTSCxTQWZEOztBQWlCQSxZQUFJLFFBQVEsR0FBWixFQUFpQjs7QUFFYixxQkFBUyxLQUFULEdBQWlCLEtBQWpCLEc7O0FBRUEsdUJBQVcsWUFBVTs7QUFFakIsb0JBQUksYUFBYSxLQUFqQjtBQUFBLG9CQUF3QixRQUFRLEVBQWhDOztBQUVBLHlCQUFTLElBQVQsQ0FBYyxZQUFXOztBQUVyQix3QkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjtBQUFBLHdCQUFzQixTQUFTLElBQUksTUFBSixHQUFhLEdBQTVDOztBQUVBLHdCQUFJLFVBQVUsVUFBVixJQUF3QixNQUFNLE1BQWxDLEVBQTBDOztBQUV0QyxxQ0FBYSxHQUFHLENBQUgsQ0FBSyxLQUFMLENBQWI7QUFDQSxnQ0FBUyxFQUFUO0FBQ0EsaUNBQVMsSUFBSSxNQUFKLEdBQWEsR0FBdEI7QUFDSDs7QUFFRCwwQkFBTSxJQUFOLENBQVcsR0FBWDtBQUNBLGlDQUFhLE1BQWI7QUFDSCxpQkFiRDs7QUFlQSxvQkFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDZCxpQ0FBYSxHQUFHLENBQUgsQ0FBSyxLQUFMLENBQWI7QUFDSDtBQUVKLGFBdkJELEVBdUJHLENBdkJIO0FBeUJILFNBN0JELE1BNkJPO0FBQ0gseUJBQWEsUUFBYjtBQUNIO0FBQ0osS0F0REQ7O0FBd0RBLEtBQUMsVUFBUyxTQUFULEVBQW1COztBQUVoQixXQUFHLEtBQUgsQ0FBUyxTQUFULEdBQXFCLFVBQVMsUUFBVCxFQUFtQixJQUFuQixFQUF5Qjs7QUFFMUMsZ0JBQUksU0FBUyxHQUFHLENBQUgsQ0FBSyxZQUFZLGtCQUFqQixFQUFxQyxRQUFRLFFBQTdDLEVBQXVELElBQXZELENBQTRELFlBQVU7O0FBRS9FLG9CQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWO0FBQUEsb0JBQ0ksTUFBTSxJQUFJLElBQUosQ0FBUyxLQUFULENBRFY7O0FBR0Esb0JBQUksQ0FBQyxVQUFVLEdBQVYsQ0FBTCxFQUFxQjs7QUFFakIsd0JBQUksSUFBSSxHQUFHLENBQUgsQ0FBSyxRQUFMLEVBQVI7O0FBRUEsdUJBQUcsQ0FBSCxDQUFLLEdBQUwsQ0FBUyxHQUFULEVBQWMsRUFBQyxJQUFJLEtBQUssTUFBTCxFQUFMLEVBQWQsRUFBbUMsVUFBUyxJQUFULEVBQWM7QUFDN0MsMEJBQUUsT0FBRixDQUFVLEdBQUcsQ0FBSCxDQUFLLElBQUwsRUFBVyxJQUFYLENBQWdCLEtBQWhCLENBQVY7QUFDSCxxQkFGRDs7QUFJQSw4QkFBVSxHQUFWLElBQWlCLEVBQUUsT0FBRixFQUFqQjtBQUNIOztBQUVELDBCQUFVLEdBQVYsRUFBZSxJQUFmLENBQW9CLFVBQVMsR0FBVCxFQUFjOztBQUU5Qix3QkFBSSxPQUFPLEdBQUcsQ0FBSCxDQUFLLEdBQUwsRUFBVSxLQUFWLEVBQVg7O0FBRUEsd0JBQUksSUFBSSxJQUFKLENBQVMsSUFBVCxDQUFKLEVBQW9CLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsSUFBSSxJQUFKLENBQVMsSUFBVCxDQUFoQjtBQUNwQix3QkFBSSxJQUFJLElBQUosQ0FBUyxPQUFULENBQUosRUFBdUIsS0FBSyxJQUFMLENBQVUsT0FBVixFQUFtQixJQUFJLElBQUosQ0FBUyxPQUFULENBQW5CO0FBQ3ZCLHdCQUFJLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBSixFQUF1QixLQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBbkI7O0FBRXZCLHdCQUFJLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBSixFQUF1QjtBQUNuQiw2QkFBSyxJQUFMLENBQVUsT0FBVixFQUFtQixJQUFJLElBQUosQ0FBUyxPQUFULENBQW5CO0FBQ0EsNEJBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxRQUFULENBQUwsRUFBMEIsS0FBSyxVQUFMLENBQWdCLFFBQWhCO0FBQzdCOztBQUVELHdCQUFJLElBQUksSUFBSixDQUFTLFFBQVQsQ0FBSixFQUF1QjtBQUNuQiw2QkFBSyxJQUFMLENBQVUsUUFBVixFQUFvQixJQUFJLElBQUosQ0FBUyxRQUFULENBQXBCO0FBQ0EsNEJBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxPQUFULENBQUwsRUFBd0IsS0FBSyxVQUFMLENBQWdCLE9BQWhCO0FBQzNCOztBQUVELHdCQUFJLFdBQUosQ0FBZ0IsSUFBaEI7QUFDSCxpQkFuQkQ7QUFvQkgsYUFwQ1ksQ0FBYjtBQXFDSCxTQXZDRDs7O0FBMENBLFdBQUcsS0FBSCxDQUFTLFVBQVMsT0FBVCxFQUFrQjtBQUN2QixlQUFHLEtBQUgsQ0FBUyxTQUFULENBQW1CLGVBQW5CLEVBQW9DLE9BQXBDO0FBQ0gsU0FGRDtBQUlILEtBaERELEVBZ0RHLEVBaERIO0FBa0RILENBN1RELEVBNlRHLEtBN1RIIiwiZmlsZSI6InV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oVUkpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHN0YWNrcyA9IFtdO1xuXG4gICAgVUkuY29tcG9uZW50KCdzdGFja01hcmdpbicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgY2xzOiAndWstbWFyZ2luLXNtYWxsLXRvcCcsXG4gICAgICAgICAgICByb3dmaXJzdDogZmFsc2UsXG4gICAgICAgICAgICBvYnNlcnZlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoXCJbZGF0YS11ay1tYXJnaW5dXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcInN0YWNrTWFyZ2luXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5zdGFja01hcmdpbihlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLW1hcmdpblwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgVUkuJHdpbi5vbigncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgVUkuJChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICAgICAgVUkuJHdpbi5vbihcImxvYWRcIiwgZm4pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVJLlV0aWxzLmRlYm91bmNlKGZuLCAyMCk7XG4gICAgICAgICAgICB9KSgpKTtcblxuICAgICAgICAgICAgdGhpcy5vbihcImRpc3BsYXkudWsuY2hlY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSkgdGhpcy5wcm9jZXNzKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9ic2VydmUpIHtcblxuICAgICAgICAgICAgICAgIFVJLmRvbU9ic2VydmUodGhpcy5lbGVtZW50LCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpICR0aGlzLnByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhY2tzLnB1c2godGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJvY2VzczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIGNvbHVtbnMgPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW4oKTtcblxuICAgICAgICAgICAgVUkuVXRpbHMuc3RhY2tNYXJnaW4oY29sdW1ucywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucm93Zmlyc3QgfHwgIWNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1hcmsgZmlyc3QgY29sdW1uIGVsZW1lbnRzXG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSB7fSwgbWlubGVmdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBjb2x1bW5zLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5yb3dmaXJzdCkuZWFjaChmdW5jdGlvbihvZmZzZXQsICRlbGUpe1xuXG4gICAgICAgICAgICAgICAgJGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdHlsZS5kaXNwbGF5ICE9ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAkZWxlLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICgoZ3JvdXBbb2Zmc2V0XSA9IGdyb3VwW29mZnNldF0gfHwgW10pICYmIGdyb3VwW29mZnNldF0pLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIG1pbmxlZnQgPSBtaW5sZWZ0ID09PSBmYWxzZSA/IG9mZnNldCA6IE1hdGgubWluKG1pbmxlZnQsIG9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFVJLiQoZ3JvdXBbbWlubGVmdF0pLmFkZENsYXNzKHRoaXMub3B0aW9ucy5yb3dmaXJzdCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG4gICAgLy8gcmVzcG9uc2l2ZSBlbGVtZW50IGUuZy4gaWZyYW1lc1xuXG4gICAgKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW10sIGNoZWNrID0gZnVuY3Rpb24oZWxlKSB7XG5cbiAgICAgICAgICAgIGlmICghZWxlLmlzKCc6dmlzaWJsZScpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCAgPSBlbGUucGFyZW50KCkud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBpd2lkdGggPSBlbGUuZGF0YSgnd2lkdGgnKSxcbiAgICAgICAgICAgICAgICByYXRpbyAgPSAod2lkdGggLyBpd2lkdGgpLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IE1hdGguZmxvb3IocmF0aW8gKiBlbGUuZGF0YSgnaGVpZ2h0JykpO1xuXG4gICAgICAgICAgICBlbGUuY3NzKHsnaGVpZ2h0JzogKHdpZHRoIDwgaXdpZHRoKSA/IGhlaWdodCA6IGVsZS5kYXRhKCdoZWlnaHQnKX0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFVJLmNvbXBvbmVudCgncmVzcG9uc2l2ZUVsZW1lbnQnLCB7XG5cbiAgICAgICAgICAgIGRlZmF1bHRzOiB7fSxcblxuICAgICAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgVUkuJChcImlmcmFtZS51ay1yZXNwb25zaXZlLXdpZHRoLCBbZGF0YS11ay1yZXNwb25zaXZlXVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKSwgb2JqO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwicmVzcG9uc2l2ZUVsZW1lbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmogPSBVSS5yZXNwb25zaXZlRWxlbWVudChlbGUsIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSB0aGlzLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlLmF0dHIoJ3dpZHRoJykgJiYgZWxlLmF0dHIoJ2hlaWdodCcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlLmRhdGEoe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnIDogZWxlLmF0dHIoJ3dpZHRoJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogZWxlLmF0dHIoJ2hlaWdodCcpXG5cbiAgICAgICAgICAgICAgICAgICAgfSkub24oJ2Rpc3BsYXkudWsuY2hlY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2soZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2hlY2soZWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBVSS4kd2luLm9uKCdyZXNpemUgbG9hZCcsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAgICAgICAgICAgICBjaGVjayhlbGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgMTUpKTtcblxuICAgIH0pKCk7XG5cblxuXG4gICAgLy8gaGVscGVyXG5cbiAgICBVSS5VdGlscy5zdGFja01hcmdpbiA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XG5cbiAgICAgICAgb3B0aW9ucyA9IFVJLiQuZXh0ZW5kKHtcbiAgICAgICAgICAgICdjbHMnOiAndWstbWFyZ2luLXNtYWxsLXRvcCdcbiAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgZWxlbWVudHMgPSBVSS4kKGVsZW1lbnRzKS5yZW1vdmVDbGFzcyhvcHRpb25zLmNscyk7XG5cbiAgICAgICAgdmFyIG1pbiA9IGZhbHNlO1xuXG4gICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24ob2Zmc2V0LCBoZWlnaHQsIHBvcywgJGVsZSl7XG5cbiAgICAgICAgICAgICRlbGUgICA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxlLmNzcygnZGlzcGxheScpICE9ICdub25lJykge1xuXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gJGVsZS5vZmZzZXQoKTtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSAkZWxlLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgcG9zICAgID0gb2Zmc2V0LnRvcCArIGhlaWdodDtcblxuICAgICAgICAgICAgICAgICRlbGUuZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICd1a01hcmdpblBvcyc6IHBvcyxcbiAgICAgICAgICAgICAgICAgICAgJ3VrTWFyZ2luVG9wJzogb2Zmc2V0LnRvcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gZmFsc2UgfHwgKG9mZnNldC50b3AgPCBtaW4udG9wKSApIHtcblxuICAgICAgICAgICAgICAgICAgICBtaW4gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgIDogb2Zmc2V0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiBvZmZzZXQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyAgOiBwb3NcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZWFjaChmdW5jdGlvbigkZWxlKSB7XG5cbiAgICAgICAgICAgICRlbGUgICA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxlLmNzcygnZGlzcGxheScpICE9ICdub25lJyAmJiAkZWxlLmRhdGEoJ3VrTWFyZ2luVG9wJykgPiBtaW4udG9wICYmICRlbGUuZGF0YSgndWtNYXJnaW5Qb3MnKSA+IG1pbi5wb3MpIHtcbiAgICAgICAgICAgICAgICAkZWxlLmFkZENsYXNzKG9wdGlvbnMuY2xzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFVJLlV0aWxzLm1hdGNoSGVpZ2h0cyA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBvcHRpb25zKSB7XG5cbiAgICAgICAgZWxlbWVudHMgPSBVSS4kKGVsZW1lbnRzKS5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XG4gICAgICAgIG9wdGlvbnMgID0gVUkuJC5leHRlbmQoeyByb3cgOiB0cnVlIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBtYXRjaEhlaWdodHMgPSBmdW5jdGlvbihncm91cCl7XG5cbiAgICAgICAgICAgIGlmIChncm91cC5sZW5ndGggPCAyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBtYXggPSAwO1xuXG4gICAgICAgICAgICBncm91cC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgVUkuJCh0aGlzKS5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICAgIH0pLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IFVJLiQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAgPSBtYXggLSAoZWxlbWVudC5jc3MoJ2JveC1zaXppbmcnKSA9PSAnYm9yZGVyLWJveCcgPyAwIDogKGVsZW1lbnQub3V0ZXJIZWlnaHQoKSAtIGVsZW1lbnQuaGVpZ2h0KCkpKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY3NzKCdtaW4taGVpZ2h0JywgaGVpZ2h0ICsgJ3B4Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAob3B0aW9ucy5yb3cpIHtcblxuICAgICAgICAgICAgZWxlbWVudHMuZmlyc3QoKS53aWR0aCgpOyAvLyBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RvZmZzZXQgPSBmYWxzZSwgZ3JvdXAgPSBbXTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyksIG9mZnNldCA9IGVsZS5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldCAhPSBsYXN0b2Zmc2V0ICYmIGdyb3VwLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEhlaWdodHMoVUkuJChncm91cCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBlbGUub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAucHVzaChlbGUpO1xuICAgICAgICAgICAgICAgICAgICBsYXN0b2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaEhlaWdodHMoVUkuJChncm91cCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGNoSGVpZ2h0cyhlbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgKGZ1bmN0aW9uKGNhY2hlU3Zncyl7XG5cbiAgICAgICAgVUkuVXRpbHMuaW5saW5lU3ZnID0gZnVuY3Rpb24oc2VsZWN0b3IsIHJvb3QpIHtcblxuICAgICAgICAgICAgdmFyIGltYWdlcyA9IFVJLiQoc2VsZWN0b3IgfHwgJ2ltZ1tzcmMkPVwiLnN2Z1wiXScsIHJvb3QgfHwgZG9jdW1lbnQpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIHZhciBpbWcgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBzcmMgPSBpbWcuYXR0cignc3JjJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlU3Znc1tzcmNdKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBVSS4kLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgVUkuJC5nZXQoc3JjLCB7bmM6IE1hdGgucmFuZG9tKCl9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVzb2x2ZShVSS4kKGRhdGEpLmZpbmQoJ3N2ZycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FjaGVTdmdzW3NyY10gPSBkLnByb21pc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjYWNoZVN2Z3Nbc3JjXS50aGVuKGZ1bmN0aW9uKHN2Zykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciAkc3ZnID0gVUkuJChzdmcpLmNsb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltZy5hdHRyKCdpZCcpKSAkc3ZnLmF0dHIoJ2lkJywgaW1nLmF0dHIoJ2lkJykpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nLmF0dHIoJ2NsYXNzJykpICRzdmcuYXR0cignY2xhc3MnLCBpbWcuYXR0cignY2xhc3MnKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWcuYXR0cignc3R5bGUnKSkgJHN2Zy5hdHRyKCdzdHlsZScsIGltZy5hdHRyKCdzdHlsZScpKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nLmF0dHIoJ3dpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdmcuYXR0cignd2lkdGgnLCBpbWcuYXR0cignd2lkdGgnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWltZy5hdHRyKCdoZWlnaHQnKSkgICRzdmcucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nLmF0dHIoJ2hlaWdodCcpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdmcuYXR0cignaGVpZ2h0JywgaW1nLmF0dHIoJ2hlaWdodCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW1nLmF0dHIoJ3dpZHRoJykpICRzdmcucmVtb3ZlQXR0cignd2lkdGgnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGltZy5yZXBsYWNlV2l0aCgkc3ZnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICBVSS5VdGlscy5pbmxpbmVTdmcoJ1tkYXRhLXVrLXN2Z10nLCBjb250ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9KSh7fSk7XG5cbn0pKFVJa2l0KTtcbiJdfQ==