"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideset", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var Animations;

    UI.component('slideset', {

        defaults: {
            default: 1,
            animation: 'fade',
            duration: 200,
            filter: '',
            delay: false,
            controls: false,
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true
        },

        sets: [],

        boot: function boot() {

            // auto init
            UI.ready(function (context) {

                UI.$("[data-uk-slideset]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("slideset")) {
                        UI.slideset(ele, UI.Utils.options(ele.attr("data-uk-slideset")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.activeSet = false;
            this.list = this.element.find('.uk-slideset');
            this.nav = this.element.find('.uk-slideset-nav');
            this.controls = this.options.controls ? UI.$(this.options.controls) : this.element;

            UI.$win.on("resize load", UI.Utils.debounce(function () {
                $this.updateSets();
            }, 100));

            $this.list.addClass('uk-grid-width-1-' + $this.options.default);

            ['xlarge', 'large', 'medium', 'small'].forEach(function (bp) {

                if (!$this.options[bp]) {
                    return;
                }

                $this.list.addClass('uk-grid-width-' + bp + '-1-' + $this.options[bp]);
            });

            this.on("click.uk.slideset", '[data-uk-slideset-item]', function (e) {

                e.preventDefault();

                if ($this.animating) {
                    return;
                }

                var set = UI.$(this).attr('data-uk-slideset-item');

                if ($this.activeSet === set) return;

                switch (set) {
                    case 'next':
                    case 'previous':
                        $this[set == 'next' ? 'next' : 'previous']();
                        break;
                    default:
                        $this.show(parseInt(set, 10));
                }
            });

            this.controls.on('click.uk.slideset', '[data-uk-filter]', function (e) {

                var ele = UI.$(this);

                if (ele.parent().hasClass('uk-slideset')) {
                    return;
                }

                e.preventDefault();

                if ($this.animating || $this.currentFilter == ele.attr('data-uk-filter')) {
                    return;
                }

                $this.updateFilter(ele.attr('data-uk-filter'));

                $this._hide().then(function () {

                    $this.updateSets(true, true);
                });
            });

            this.on('swipeRight swipeLeft', function (e) {
                $this[e.type == 'swipeLeft' ? 'next' : 'previous']();
            });

            this.updateFilter(this.options.filter);
            this.updateSets();

            this.element.on({
                mouseenter: function mouseenter() {
                    if ($this.options.pauseOnHover) $this.hovering = true;
                },
                mouseleave: function mouseleave() {
                    $this.hovering = false;
                }
            });

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }
        },

        updateSets: function updateSets(animate, force) {

            var visible = this.visible,
                i;

            this.visible = this.getVisibleOnCurrenBreakpoint();

            if (visible == this.visible && !force) {
                return;
            }

            this.children = this.list.children().hide();
            this.items = this.getItems();
            this.sets = array_chunk(this.items, this.visible);

            for (i = 0; i < this.sets.length; i++) {
                this.sets[i].css({ 'display': 'none' });
            }

            // update nav
            if (this.nav.length && this.nav.empty()) {

                for (i = 0; i < this.sets.length; i++) {
                    this.nav.append('<li data-uk-slideset-item="' + i + '"><a></a></li>');
                }

                this.nav[this.nav.children().length == 1 ? 'addClass' : 'removeClass']('uk-invisible');
            }

            this.activeSet = false;
            this.show(0, !animate);
        },

        updateFilter: function updateFilter(currentfilter) {

            var $this = this,
                filter;

            this.currentFilter = currentfilter;

            this.controls.find('[data-uk-filter]').each(function () {

                filter = UI.$(this);

                if (!filter.parent().hasClass('uk-slideset')) {

                    if (filter.attr('data-uk-filter') == $this.currentFilter) {
                        filter.addClass('uk-active');
                    } else {
                        filter.removeClass('uk-active');
                    }
                }
            });
        },

        getVisibleOnCurrenBreakpoint: function getVisibleOnCurrenBreakpoint() {

            var breakpoint = null,
                tmp = UI.$('<div style="position:absolute;height:1px;top:-1000px;width:100px"><div></div></div>').appendTo('body'),
                testdiv = tmp.children().eq(0),
                breakpoints = this.options;

            ['xlarge', 'large', 'medium', 'small'].forEach(function (bp) {

                if (!breakpoints[bp] || breakpoint) {
                    return;
                }

                tmp.attr('class', 'uk-grid-width-' + bp + '-1-2').width();

                if (testdiv.width() == 50) {
                    breakpoint = bp;
                }
            });

            tmp.remove();

            return this.options[breakpoint] || this.options['default'];
        },

        getItems: function getItems() {

            var items = [],
                filter;

            if (this.currentFilter) {

                filter = this.currentFilter || [];

                if (typeof filter === 'string') {
                    filter = filter.split(/,/).map(function (item) {
                        return item.trim();
                    });
                }

                this.children.each(function (index) {

                    var ele = UI.$(this),
                        f = ele.attr('data-uk-filter'),
                        infilter = filter.length ? false : true;

                    if (f) {

                        f = f.split(/,/).map(function (item) {
                            return item.trim();
                        });

                        filter.forEach(function (item) {
                            if (f.indexOf(item) > -1) infilter = true;
                        });
                    }

                    if (infilter) items.push(ele[0]);
                });

                items = UI.$(items);
            } else {
                items = this.list.children();
            }

            return items;
        },

        show: function show(setIndex, noanimate, dir) {

            var $this = this;

            if (this.activeSet === setIndex || this.animating) {
                return;
            }

            dir = dir || (setIndex < this.activeSet ? -1 : 1);

            var current = this.sets[this.activeSet] || [],
                next = this.sets[setIndex],
                animation = this._getAnimation();

            if (noanimate || !UI.support.animation) {
                animation = Animations.none;
            }

            this.animating = true;

            if (this.nav.length) {
                this.nav.children().removeClass('uk-active').eq(setIndex).addClass('uk-active');
            }

            animation.apply($this, [current, next, dir]).then(function () {

                UI.Utils.checkDisplay(next, true);

                $this.children.hide().removeClass('uk-active');
                next.addClass('uk-active').css({ 'display': '', 'opacity': '' });

                $this.animating = false;
                $this.activeSet = setIndex;

                UI.Utils.checkDisplay(next, true);

                $this.trigger('show.uk.slideset', [next]);
            });
        },

        _getAnimation: function _getAnimation() {

            var animation = Animations[this.options.animation] || Animations.none;

            if (!UI.support.animation) {
                animation = Animations.none;
            }

            return animation;
        },

        _hide: function _hide() {

            var $this = this,
                current = this.sets[this.activeSet] || [],
                animation = this._getAnimation();

            this.animating = true;

            return animation.apply($this, [current, [], 1]).then(function () {
                $this.animating = false;
            });
        },

        next: function next() {
            this.show(this.sets[this.activeSet + 1] ? this.activeSet + 1 : 0, false, 1);
        },

        previous: function previous() {
            this.show(this.sets[this.activeSet - 1] ? this.activeSet - 1 : this.sets.length - 1, false, -1);
        },

        start: function start() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function () {
                if (!$this.hovering && !$this.animating) $this.next();
            }, this.options.autoplayInterval);
        },

        stop: function stop() {
            if (this.interval) clearInterval(this.interval);
        }
    });

    Animations = {

        'none': function none() {
            var d = UI.$.Deferred();
            d.resolve();
            return d.promise();
        },

        'fade': function fade(current, next) {
            return coreAnimation.apply(this, ['uk-animation-fade', current, next]);
        },

        'slide-bottom': function slideBottom(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-bottom', current, next]);
        },

        'slide-top': function slideTop(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-top', current, next]);
        },

        'slide-vertical': function slideVertical(current, next, dir) {

            var anim = ['uk-animation-slide-top', 'uk-animation-slide-bottom'];

            if (dir == -1) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-horizontal': function slideHorizontal(current, next, dir) {

            var anim = ['uk-animation-slide-right', 'uk-animation-slide-left'];

            if (dir == -1) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next, dir]);
        },

        'scale': function scale(current, next) {
            return coreAnimation.apply(this, ['uk-animation-scale-up', current, next]);
        }
    };

    UI.slideset.animations = Animations;

    // helpers

    function coreAnimation(cls, current, next, dir) {

        var d = UI.$.Deferred(),
            delay = this.options.delay === false ? Math.floor(this.options.duration / 2) : this.options.delay,
            $this = this,
            clsIn,
            clsOut,
            release,
            i;

        dir = dir || 1;

        this.element.css('min-height', this.element.height());

        if (next[0] === current[0]) {
            d.resolve();
            return d.promise();
        }

        if ((typeof cls === "undefined" ? "undefined" : _typeof(cls)) == 'object') {
            clsIn = cls[0];
            clsOut = cls[1] || cls[0];
        } else {
            clsIn = cls;
            clsOut = clsIn;
        }

        release = function release() {

            if (current && current.length) {
                current.hide().removeClass(clsOut + ' uk-animation-reverse').css({ 'opacity': '', 'animation-delay': '', 'animation': '' });
            }

            if (!next.length) {
                d.resolve();
                return;
            }

            for (i = 0; i < next.length; i++) {
                next.eq(dir == 1 ? i : next.length - i - 1).css('animation-delay', i * delay + 'ms');
            }

            var _finish = function finish() {
                next.removeClass('' + clsIn + '').css({ opacity: '', display: '', 'animation-delay': '', 'animation': '' });
                d.resolve();
                $this.element.css('min-height', '');
                _finish = false;
            };

            next.addClass(clsIn)[dir == 1 ? 'last' : 'first']().one(UI.support.animation.end, function () {
                if (_finish) _finish();
            }).end().css('display', '');

            // make sure everything resolves really
            setTimeout(function () {
                if (_finish) _finish();
            }, next.length * delay * 2);
        };

        if (next.length) {
            next.css('animation-duration', this.options.duration + 'ms');
        }

        if (current && current.length) {

            current.css('animation-duration', this.options.duration + 'ms')[dir == 1 ? 'last' : 'first']().one(UI.support.animation.end, function () {
                release();
            });

            for (i = 0; i < current.length; i++) {

                (function (index, ele) {

                    setTimeout(function () {

                        ele.css('display', 'none').css('display', '').css('opacity', 0).on(UI.support.animation.end, function () {
                            ele.removeClass(clsOut);
                        }).addClass(clsOut + ' uk-animation-reverse');
                    }.bind(this), i * delay);
                })(i, current.eq(dir == 1 ? i : current.length - i - 1));
            }
        } else {
            release();
        }

        return d.promise();
    }

    function array_chunk(input, size) {

        var x,
            i = 0,
            c = -1,
            l = input.length || 0,
            n = [];

        if (size < 1) return null;

        while (i < l) {

            x = i % size;

            if (x) {
                n[c][x] = input[i];
            } else {
                n[++c] = [input[i]];
            }

            i++;
        }

        i = 0;
        l = n.length;

        while (i < l) {
            n[i] = jQuery(n[i]);
            i++;
        }

        return n;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NsaWRlc2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8sZ0JBQVAsRUFBeUIsQ0FBQyxPQUFELENBQXpCLEVBQW9DLFlBQVU7QUFDMUMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBRUEsUUFBSSxVQUFKOztBQUVBLE9BQUcsU0FBSCxDQUFhLFVBQWIsRUFBeUI7O0FBRXJCLGtCQUFVO0FBQ04scUJBQW1CLENBRGI7QUFFTix1QkFBbUIsTUFGYjtBQUdOLHNCQUFtQixHQUhiO0FBSU4sb0JBQW1CLEVBSmI7QUFLTixtQkFBbUIsS0FMYjtBQU1OLHNCQUFtQixLQU5iO0FBT04sc0JBQW1CLEtBUGI7QUFRTiw4QkFBbUIsSUFSYjtBQVNOLDBCQUFtQjtBQVRiLFNBRlc7O0FBY3JCLGNBQU0sRUFkZTs7QUFnQnJCLGNBQU0sZ0JBQVc7OztBQUdiLGVBQUcsS0FBSCxDQUFTLFVBQVMsT0FBVCxFQUFrQjs7QUFFdkIsbUJBQUcsQ0FBSCxDQUFLLG9CQUFMLEVBQTJCLE9BQTNCLEVBQW9DLElBQXBDLENBQXlDLFlBQVU7O0FBRS9DLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFHLENBQUMsSUFBSSxJQUFKLENBQVMsVUFBVCxDQUFKLEVBQTBCO0FBQ3RCLDJCQUFHLFFBQUgsQ0FBWSxHQUFaLEVBQWlCLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FB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QUYsRUFBUDtBQUNIOztBQUVELGFBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQzs7QUFFOUIsWUFBSSxDQUFKO0FBQUEsWUFBTyxJQUFJLENBQVg7QUFBQSxZQUFjLElBQUksQ0FBQyxDQUFuQjtBQUFBLFlBQXNCLElBQUksTUFBTSxNQUFOLElBQWdCLENBQTFDO0FBQUEsWUFBNkMsSUFBSSxFQUFqRDs7QUFFQSxZQUFJLE9BQU8sQ0FBWCxFQUFjLE9BQU8sSUFBUDs7QUFFZCxlQUFPLElBQUksQ0FBWCxFQUFjOztBQUVWLGdCQUFJLElBQUksSUFBUjs7QUFFQSxnQkFBRyxDQUFILEVBQU07QUFDRixrQkFBRSxDQUFGLEVBQUssQ0FBTCxJQUFVLE1BQU0sQ0FBTixDQUFWO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsa0JBQUUsRUFBRSxDQUFKLElBQVMsQ0FBQyxNQUFNLENBQU4sQ0FBRCxDQUFUO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRCxZQUFJLENBQUo7QUFDQSxZQUFJLEVBQUUsTUFBTjs7QUFFQSxlQUFPLElBQUksQ0FBWCxFQUFjO0FBQ1YsY0FBRSxDQUFGLElBQU8sT0FBTyxFQUFFLENBQUYsQ0FBUCxDQUFQO0FBQ0E7QUFDSDs7QUFFRCxlQUFPLENBQVA7QUFDSDtBQUVKLENBaGdCRCIsImZpbGUiOiJzbGlkZXNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LXNsaWRlc2V0XCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQW5pbWF0aW9ucztcblxuICAgIFVJLmNvbXBvbmVudCgnc2xpZGVzZXQnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQgICAgICAgICAgOiAxLFxuICAgICAgICAgICAgYW5pbWF0aW9uICAgICAgICA6ICdmYWRlJyxcbiAgICAgICAgICAgIGR1cmF0aW9uICAgICAgICAgOiAyMDAsXG4gICAgICAgICAgICBmaWx0ZXIgICAgICAgICAgIDogJycsXG4gICAgICAgICAgICBkZWxheSAgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBjb250cm9scyAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBhdXRvcGxheSAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBhdXRvcGxheUludGVydmFsIDogNzAwMCxcbiAgICAgICAgICAgIHBhdXNlT25Ib3ZlciAgICAgOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0czogW10sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGF1dG8gaW5pdFxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLXNsaWRlc2V0XVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWVsZS5kYXRhKFwic2xpZGVzZXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLnNsaWRlc2V0KGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstc2xpZGVzZXRcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2V0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmxpc3QgICAgICA9IHRoaXMuZWxlbWVudC5maW5kKCcudWstc2xpZGVzZXQnKTtcbiAgICAgICAgICAgIHRoaXMubmF2ICAgICAgID0gdGhpcy5lbGVtZW50LmZpbmQoJy51ay1zbGlkZXNldC1uYXYnKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMgID0gdGhpcy5vcHRpb25zLmNvbnRyb2xzID8gVUkuJCh0aGlzLm9wdGlvbnMuY29udHJvbHMpIDogdGhpcy5lbGVtZW50O1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKFwicmVzaXplIGxvYWRcIiwgVUkuVXRpbHMuZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMudXBkYXRlU2V0cygpO1xuICAgICAgICAgICAgfSwgMTAwKSk7XG5cbiAgICAgICAgICAgICR0aGlzLmxpc3QuYWRkQ2xhc3MoJ3VrLWdyaWQtd2lkdGgtMS0nKyR0aGlzLm9wdGlvbnMuZGVmYXVsdCk7XG5cbiAgICAgICAgICAgIFsneGxhcmdlJywgJ2xhcmdlJywgJ21lZGl1bScsICdzbWFsbCddLmZvckVhY2goZnVuY3Rpb24oYnApIHtcblxuICAgICAgICAgICAgICAgIGlmICghJHRoaXMub3B0aW9uc1ticF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aGlzLmxpc3QuYWRkQ2xhc3MoJ3VrLWdyaWQtd2lkdGgtJyticCsnLTEtJyskdGhpcy5vcHRpb25zW2JwXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrLnVrLnNsaWRlc2V0XCIsICdbZGF0YS11ay1zbGlkZXNldC1pdGVtXScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzZXQgPSBVSS4kKHRoaXMpLmF0dHIoJ2RhdGEtdWstc2xpZGVzZXQtaXRlbScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmFjdGl2ZVNldCA9PT0gc2V0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2goc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1tzZXQ9PSduZXh0JyA/ICduZXh0JzoncHJldmlvdXMnXSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5zaG93KHBhcnNlSW50KHNldCwgMTApKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm9uKCdjbGljay51ay5zbGlkZXNldCcsICdbZGF0YS11ay1maWx0ZXJdJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlLnBhcmVudCgpLmhhc0NsYXNzKCd1ay1zbGlkZXNldCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuYW5pbWF0aW5nIHx8ICR0aGlzLmN1cnJlbnRGaWx0ZXIgPT0gZWxlLmF0dHIoJ2RhdGEtdWstZmlsdGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aGlzLnVwZGF0ZUZpbHRlcihlbGUuYXR0cignZGF0YS11ay1maWx0ZXInKSk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5faGlkZSgpLnRoZW4oZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy51cGRhdGVTZXRzKHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ3N3aXBlUmlnaHQgc3dpcGVMZWZ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICR0aGlzW2UudHlwZT09J3N3aXBlTGVmdCcgPyAnbmV4dCcgOiAncHJldmlvdXMnXSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsdGVyKHRoaXMub3B0aW9ucy5maWx0ZXIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZXRzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5vbih7XG4gICAgICAgICAgICAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24oKSB7IGlmICgkdGhpcy5vcHRpb25zLnBhdXNlT25Ib3ZlcikgJHRoaXMuaG92ZXJpbmcgPSB0cnVlOyAgfSxcbiAgICAgICAgICAgICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbigpIHsgJHRoaXMuaG92ZXJpbmcgPSBmYWxzZTsgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNldCBhdXRvcGxheVxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVTZXRzOiBmdW5jdGlvbihhbmltYXRlLCBmb3JjZSkge1xuXG4gICAgICAgICAgICB2YXIgdmlzaWJsZSA9IHRoaXMudmlzaWJsZSwgaTtcblxuICAgICAgICAgICAgdGhpcy52aXNpYmxlICA9IHRoaXMuZ2V0VmlzaWJsZU9uQ3VycmVuQnJlYWtwb2ludCgpO1xuXG4gICAgICAgICAgICBpZiAodmlzaWJsZSA9PSB0aGlzLnZpc2libGUgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5saXN0LmNoaWxkcmVuKCkuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5pdGVtcyAgICA9IHRoaXMuZ2V0SXRlbXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0cyAgICAgPSBhcnJheV9jaHVuayh0aGlzLml0ZW1zLCB0aGlzLnZpc2libGUpO1xuXG4gICAgICAgICAgICBmb3IgKGk9MDtpPHRoaXMuc2V0cy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRzW2ldLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdXBkYXRlIG5hdlxuICAgICAgICAgICAgaWYgKHRoaXMubmF2Lmxlbmd0aCAmJiB0aGlzLm5hdi5lbXB0eSgpKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGk9MDtpPHRoaXMuc2V0cy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2LmFwcGVuZCgnPGxpIGRhdGEtdWstc2xpZGVzZXQtaXRlbT1cIicraSsnXCI+PGE+PC9hPjwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZbdGhpcy5uYXYuY2hpbGRyZW4oKS5sZW5ndGg9PTEgPyAnYWRkQ2xhc3MnOidyZW1vdmVDbGFzcyddKCd1ay1pbnZpc2libGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2hvdygwLCAhYW5pbWF0ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlRmlsdGVyOiBmdW5jdGlvbihjdXJyZW50ZmlsdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIGZpbHRlcjtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50RmlsdGVyID0gY3VycmVudGZpbHRlcjtcblxuICAgICAgICAgICAgdGhpcy5jb250cm9scy5maW5kKCdbZGF0YS11ay1maWx0ZXJdJykuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICghZmlsdGVyLnBhcmVudCgpLmhhc0NsYXNzKCd1ay1zbGlkZXNldCcpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5hdHRyKCdkYXRhLXVrLWZpbHRlcicpID09ICR0aGlzLmN1cnJlbnRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5hZGRDbGFzcygndWstYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIucmVtb3ZlQ2xhc3MoJ3VrLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VmlzaWJsZU9uQ3VycmVuQnJlYWtwb2ludDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBicmVha3BvaW50ICA9IG51bGwsXG4gICAgICAgICAgICAgICAgdG1wICAgICAgICAgPSBVSS4kKCc8ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjFweDt0b3A6LTEwMDBweDt3aWR0aDoxMDBweFwiPjxkaXY+PC9kaXY+PC9kaXY+JykuYXBwZW5kVG8oJ2JvZHknKSxcbiAgICAgICAgICAgICAgICB0ZXN0ZGl2ICAgICA9IHRtcC5jaGlsZHJlbigpLmVxKDApLFxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgWyd4bGFyZ2UnLCAnbGFyZ2UnLCAnbWVkaXVtJywgJ3NtYWxsJ10uZm9yRWFjaChmdW5jdGlvbihicCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYnJlYWtwb2ludHNbYnBdIHx8IGJyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRtcC5hdHRyKCdjbGFzcycsICd1ay1ncmlkLXdpZHRoLScrYnArJy0xLTInKS53aWR0aCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ZGl2LndpZHRoKCkgPT0gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdG1wLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1ticmVha3BvaW50XSB8fCB0aGlzLm9wdGlvbnNbJ2RlZmF1bHQnXTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdLCBmaWx0ZXI7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRGaWx0ZXIpIHtcblxuICAgICAgICAgICAgICAgIGZpbHRlciA9IHRoaXMuY3VycmVudEZpbHRlciB8fCBbXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoZmlsdGVyKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnNwbGl0KC8sLykubWFwKGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS50cmltKCk7IH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZWFjaChmdW5jdGlvbihpbmRleCl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyksIGYgPSBlbGUuYXR0cignZGF0YS11ay1maWx0ZXInKSwgaW5maWx0ZXIgPSBmaWx0ZXIubGVuZ3RoID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmLnNwbGl0KC8sLykubWFwKGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS50cmltKCk7IH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5pbmRleE9mKGl0ZW0pID4gLTEpIGluZmlsdGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoaW5maWx0ZXIpIGl0ZW1zLnB1c2goZWxlWzBdKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGl0ZW1zID0gVUkuJChpdGVtcyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSB0aGlzLmxpc3QuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKHNldEluZGV4LCBub2FuaW1hdGUsIGRpcikge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVTZXQgPT09IHNldEluZGV4IHx8IHRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkaXIgPSBkaXIgfHwgKHNldEluZGV4IDwgdGhpcy5hY3RpdmVTZXQgPyAtMToxKTtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgICA9IHRoaXMuc2V0c1t0aGlzLmFjdGl2ZVNldF0gfHwgW10sXG4gICAgICAgICAgICAgICAgbmV4dCAgICAgID0gdGhpcy5zZXRzW3NldEluZGV4XSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSB0aGlzLl9nZXRBbmltYXRpb24oKTtcblxuICAgICAgICAgICAgaWYgKG5vYW5pbWF0ZSB8fCAhVUkuc3VwcG9ydC5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBBbmltYXRpb25zLm5vbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubmF2Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmF2LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ3VrLWFjdGl2ZScpLmVxKHNldEluZGV4KS5hZGRDbGFzcygndWstYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFuaW1hdGlvbi5hcHBseSgkdGhpcywgW2N1cnJlbnQsIG5leHQsIGRpcl0pLnRoZW4oZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheShuZXh0LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmNoaWxkcmVuLmhpZGUoKS5yZW1vdmVDbGFzcygndWstYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbmV4dC5hZGRDbGFzcygndWstYWN0aXZlJykuY3NzKHsnZGlzcGxheSc6ICcnLCAnb3BhY2l0eSc6Jyd9KTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICR0aGlzLmFjdGl2ZVNldCA9IHNldEluZGV4O1xuXG4gICAgICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KG5leHQsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignc2hvdy51ay5zbGlkZXNldCcsIFtuZXh0XSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIF9nZXRBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gQW5pbWF0aW9uc1t0aGlzLm9wdGlvbnMuYW5pbWF0aW9uXSB8fCBBbmltYXRpb25zLm5vbmU7XG5cbiAgICAgICAgICAgIGlmICghVUkuc3VwcG9ydC5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBBbmltYXRpb25zLm5vbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICAgID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjdXJyZW50ICAgPSB0aGlzLnNldHNbdGhpcy5hY3RpdmVTZXRdIHx8IFtdLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9IHRoaXMuX2dldEFuaW1hdGlvbigpO1xuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb24uYXBwbHkoJHRoaXMsIFtjdXJyZW50LCBbXSwgMV0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuc2V0c1t0aGlzLmFjdGl2ZVNldCArIDFdID8gKHRoaXMuYWN0aXZlU2V0ICsgMSkgOiAwLCBmYWxzZSwgMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJldmlvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuc2V0c1t0aGlzLmFjdGl2ZVNldCAtIDFdID8gKHRoaXMuYWN0aXZlU2V0IC0gMSkgOiAodGhpcy5zZXRzLmxlbmd0aCAtIDEpLCBmYWxzZSwgLTEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmhvdmVyaW5nICYmICEkdGhpcy5hbmltYXRpbmcpICR0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucy5hdXRvcGxheUludGVydmFsKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIEFuaW1hdGlvbnMgPSB7XG5cbiAgICAgICAgJ25vbmUnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkID0gVUkuJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZC5wcm9taXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2ZhZGUnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1mYWRlJywgY3VycmVudCwgbmV4dF0pO1xuICAgICAgICB9LFxuXG4gICAgICAgICdzbGlkZS1ib3R0b20nOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1zbGlkZS1ib3R0b20nLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWRlLXRvcCc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3JlQW5pbWF0aW9uLmFwcGx5KHRoaXMsIFsndWstYW5pbWF0aW9uLXNsaWRlLXRvcCcsIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2xpZGUtdmVydGljYWwnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSBbJ3VrLWFuaW1hdGlvbi1zbGlkZS10b3AnLCAndWstYW5pbWF0aW9uLXNsaWRlLWJvdHRvbSddO1xuXG4gICAgICAgICAgICBpZiAoZGlyID09IC0xKSB7XG4gICAgICAgICAgICAgICAgYW5pbS5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb3JlQW5pbWF0aW9uLmFwcGx5KHRoaXMsIFthbmltLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWRlLWhvcml6b250YWwnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSBbJ3VrLWFuaW1hdGlvbi1zbGlkZS1yaWdodCcsICd1ay1hbmltYXRpb24tc2xpZGUtbGVmdCddO1xuXG4gICAgICAgICAgICBpZiAoZGlyID09IC0xKSB7XG4gICAgICAgICAgICAgICAgYW5pbS5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb3JlQW5pbWF0aW9uLmFwcGx5KHRoaXMsIFthbmltLCBjdXJyZW50LCBuZXh0LCBkaXJdKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2NhbGUnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1zY2FsZS11cCcsIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBVSS5zbGlkZXNldC5hbmltYXRpb25zID0gQW5pbWF0aW9ucztcblxuICAgIC8vIGhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIGNvcmVBbmltYXRpb24oY2xzLCBjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICB2YXIgZCAgICAgPSBVSS4kLkRlZmVycmVkKCksXG4gICAgICAgICAgICBkZWxheSA9ICh0aGlzLm9wdGlvbnMuZGVsYXkgPT09IGZhbHNlKSA/IE1hdGguZmxvb3IodGhpcy5vcHRpb25zLmR1cmF0aW9uLzIpIDogdGhpcy5vcHRpb25zLmRlbGF5LFxuICAgICAgICAgICAgJHRoaXMgPSB0aGlzLCBjbHNJbiwgY2xzT3V0LCByZWxlYXNlLCBpO1xuXG4gICAgICAgIGRpciA9IGRpciB8fCAxO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ21pbi1oZWlnaHQnLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KCkpO1xuXG4gICAgICAgIGlmIChuZXh0WzBdPT09Y3VycmVudFswXSkge1xuICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZC5wcm9taXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mKGNscykgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNsc0luICA9IGNsc1swXTtcbiAgICAgICAgICAgIGNsc091dCA9IGNsc1sxXSB8fCBjbHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbHNJbiAgPSBjbHM7XG4gICAgICAgICAgICBjbHNPdXQgPSBjbHNJbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbGVhc2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50LmhpZGUoKS5yZW1vdmVDbGFzcyhjbHNPdXQrJyB1ay1hbmltYXRpb24tcmV2ZXJzZScpLmNzcyh7J29wYWNpdHknOicnLCAnYW5pbWF0aW9uLWRlbGF5JzogJycsICdhbmltYXRpb24nOicnfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaT0wO2k8bmV4dC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICAgICAgbmV4dC5lcShkaXIgPT0gMSA/IGk6KG5leHQubGVuZ3RoIC0gaSktMSkuY3NzKCdhbmltYXRpb24tZGVsYXknLCAoaSpkZWxheSkrJ21zJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXh0LnJlbW92ZUNsYXNzKCcnK2Nsc0luKycnKS5jc3Moe29wYWNpdHk6JycsIGRpc3BsYXk6JycsICdhbmltYXRpb24tZGVsYXknOicnLCAnYW5pbWF0aW9uJzonJ30pO1xuICAgICAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuY3NzKCdtaW4taGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIGZpbmlzaCA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbmV4dC5hZGRDbGFzcyhjbHNJbilbZGlyPT0xID8gJ2xhc3QnOidmaXJzdCddKCkub25lKFVJLnN1cHBvcnQuYW5pbWF0aW9uLmVuZCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZihmaW5pc2gpIGZpbmlzaCgpO1xuICAgICAgICAgICAgfSkuZW5kKCkuY3NzKCdkaXNwbGF5JywgJycpO1xuXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgZXZlcnl0aGluZyByZXNvbHZlcyByZWFsbHlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYoZmluaXNoKSBmaW5pc2goKTtcbiAgICAgICAgICAgIH0sICBuZXh0Lmxlbmd0aCAqIGRlbGF5ICogMik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKG5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXh0LmNzcygnYW5pbWF0aW9uLWR1cmF0aW9uJywgdGhpcy5vcHRpb25zLmR1cmF0aW9uKydtcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgY3VycmVudC5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsIHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMnKVtkaXI9PTEgPyAnbGFzdCc6J2ZpcnN0J10oKS5vbmUoVUkuc3VwcG9ydC5hbmltYXRpb24uZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZWxlYXNlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChpPTA7aTxjdXJyZW50Lmxlbmd0aDtpKyspIHtcblxuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoaW5kZXgsIGVsZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUuY3NzKCdkaXNwbGF5JywgJ25vbmUnKS5jc3MoJ2Rpc3BsYXknLCAnJykuY3NzKCdvcGFjaXR5JywgMCkub24oVUkuc3VwcG9ydC5hbmltYXRpb24uZW5kLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5yZW1vdmVDbGFzcyhjbHNPdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkQ2xhc3MoY2xzT3V0KycgdWstYW5pbWF0aW9uLXJldmVyc2UnKTtcblxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIGkgKiBkZWxheSk7XG5cbiAgICAgICAgICAgICAgICB9KShpLCBjdXJyZW50LmVxKGRpciA9PSAxID8gaTooY3VycmVudC5sZW5ndGggLSBpKS0xKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcnJheV9jaHVuayhpbnB1dCwgc2l6ZSkge1xuXG4gICAgICAgIHZhciB4LCBpID0gMCwgYyA9IC0xLCBsID0gaW5wdXQubGVuZ3RoIHx8IDAsIG4gPSBbXTtcblxuICAgICAgICBpZiAoc2l6ZSA8IDEpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHdoaWxlIChpIDwgbCkge1xuXG4gICAgICAgICAgICB4ID0gaSAlIHNpemU7XG5cbiAgICAgICAgICAgIGlmKHgpIHtcbiAgICAgICAgICAgICAgICBuW2NdW3hdID0gaW5wdXRbaV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5bKytjXSA9IFtpbnB1dFtpXV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGkgPSAwO1xuICAgICAgICBsID0gbi5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBsKSB7XG4gICAgICAgICAgICBuW2ldID0galF1ZXJ5KG5baV0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuXG59KTtcbiJdfQ==