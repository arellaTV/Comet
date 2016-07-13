"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var Animations;

    UI.component('switcher', {

        defaults: {
            connect: false,
            toggle: ">*",
            active: 0,
            animation: false,
            duration: 200,
            swiping: true
        },

        animating: false,

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-switcher]", context).each(function () {
                    var switcher = UI.$(this);

                    if (!switcher.data("switcher")) {
                        var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.on("click.uk.switcher", this.options.toggle, function (e) {
                e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = UI.$(this.options.connect);

                this.connect.children().removeClass("uk-active");

                // delegate switch commands within container content
                if (this.connect.length) {

                    // Init ARIA for connect
                    this.connect.children().attr('aria-hidden', 'true');

                    this.connect.on("click", '[data-uk-switcher-item]', function (e) {

                        e.preventDefault();

                        var item = UI.$(this).attr('data-uk-switcher-item');

                        if ($this.index == item) return;

                        switch (item) {
                            case 'next':
                            case 'previous':
                                $this.show($this.index + (item == 'next' ? 1 : -1));
                                break;
                            default:
                                $this.show(parseInt(item, 10));
                        }
                    });

                    if (this.options.swiping) {

                        this.connect.on('swipeRight swipeLeft', function (e) {
                            e.preventDefault();
                            if (!window.getSelection().toString()) {
                                $this.show($this.index + (e.type == 'swipeLeft' ? 1 : -1));
                            }
                        });
                    }
                }

                var toggles = this.find(this.options.toggle),
                    active = toggles.filter(".uk-active");

                if (active.length) {
                    this.show(active, false);
                } else {

                    if (this.options.active === false) return;

                    active = toggles.eq(this.options.active);
                    this.show(active.length ? active : toggles.eq(0), false);
                }

                // Init ARIA for toggles
                toggles.not(active).attr('aria-expanded', 'false');
                active.attr('aria-expanded', 'true');
            }
        },

        show: function show(tab, animate) {

            if (this.animating) {
                return;
            }

            if (isNaN(tab)) {
                tab = UI.$(tab);
            } else {

                var toggles = this.find(this.options.toggle);

                tab = tab < 0 ? toggles.length - 1 : tab;
                tab = toggles.eq(toggles[tab] ? tab : 0);
            }

            var $this = this,
                toggles = this.find(this.options.toggle),
                active = UI.$(tab),
                animation = Animations[this.options.animation] || function (current, next) {

                if (!$this.options.animation) {
                    return Animations.none.apply($this);
                }

                var anim = $this.options.animation.split(',');

                if (anim.length == 1) {
                    anim[1] = anim[0];
                }

                anim[0] = anim[0].trim();
                anim[1] = anim[1].trim();

                return coreAnimation.apply($this, [anim, current, next]);
            };

            if (animate === false || !UI.support.animation) {
                animation = Animations.none;
            }

            if (active.hasClass("uk-disabled")) return;

            // Update ARIA for Toggles
            toggles.attr('aria-expanded', 'false');
            active.attr('aria-expanded', 'true');

            toggles.filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                this.index = this.find(this.options.toggle).index(active);

                if (this.index == -1) {
                    this.index = 0;
                }

                this.connect.each(function () {

                    var container = UI.$(this),
                        children = UI.$(container.children()),
                        current = UI.$(children.filter('.uk-active')),
                        next = UI.$(children.eq($this.index));

                    $this.animating = true;

                    animation.apply($this, [current, next]).then(function () {

                        current.removeClass("uk-active");
                        next.addClass("uk-active");

                        // Update ARIA for connect
                        current.attr('aria-hidden', 'true');
                        next.attr('aria-hidden', 'false');

                        UI.Utils.checkDisplay(next, true);

                        $this.animating = false;
                    });
                });
            }

            this.trigger("show.uk.switcher", [active]);
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

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-left': function slideLeft(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-left', current, next]);
        },

        'slide-right': function slideRight(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-right', current, next]);
        },

        'slide-horizontal': function slideHorizontal(current, next, dir) {

            var anim = ['uk-animation-slide-right', 'uk-animation-slide-left'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'scale': function scale(current, next) {
            return coreAnimation.apply(this, ['uk-animation-scale-up', current, next]);
        }
    };

    UI.switcher.animations = Animations;

    // helpers

    function coreAnimation(cls, current, next) {

        var d = UI.$.Deferred(),
            clsIn = cls,
            clsOut = cls,
            release;

        if (next[0] === current[0]) {
            d.resolve();
            return d.promise();
        }

        if ((typeof cls === "undefined" ? "undefined" : _typeof(cls)) == 'object') {
            clsIn = cls[0];
            clsOut = cls[1] || cls[0];
        }

        UI.$body.css('overflow-x', 'hidden'); // fix scroll jumping in iOS

        release = function release() {

            if (current) current.hide().removeClass('uk-active ' + clsOut + ' uk-animation-reverse');

            next.addClass(clsIn).one(UI.support.animation.end, function () {

                next.removeClass('' + clsIn + '').css({ opacity: '', display: '' });

                d.resolve();

                UI.$body.css('overflow-x', '');

                if (current) current.css({ opacity: '', display: '' });
            }.bind(this)).show();
        };

        next.css('animation-duration', this.options.duration + 'ms');

        if (current && current.length) {

            current.css('animation-duration', this.options.duration + 'ms');

            current.css('display', 'none').addClass(clsOut + ' uk-animation-reverse').one(UI.support.animation.end, function () {
                release();
            }.bind(this)).css('display', '');
        } else {
            next.addClass('uk-active');
            release();
        }

        return d.promise();
    }
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3N3aXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsQ0FBQyxVQUFTLEVBQVQsRUFBYTs7QUFFVjs7QUFFQSxRQUFJLFVBQUo7O0FBRUEsT0FBRyxTQUFILENBQWEsVUFBYixFQUF5Qjs7QUFFckIsa0JBQVU7QUFDTixxQkFBWSxLQUROO0FBRU4sb0JBQVksSUFGTjtBQUdOLG9CQUFZLENBSE47QUFJTix1QkFBWSxLQUpOO0FBS04sc0JBQVksR0FMTjtBQU1OLHFCQUFZO0FBTk4sU0FGVzs7QUFXckIsbUJBQVcsS0FYVTs7QUFhckIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUssb0JBQUwsRUFBMkIsT0FBM0IsRUFBb0MsSUFBcEMsQ0FBeUMsWUFBVztBQUNoRCx3QkFBSSxXQUFXLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBZjs7QUFFQSx3QkFBSSxDQUFDLFNBQVMsSUFBVCxDQUFjLFVBQWQsQ0FBTCxFQUFnQztBQUM1Qiw0QkFBSSxNQUFNLEdBQUcsUUFBSCxDQUFZLFFBQVosRUFBc0IsR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixTQUFTLElBQVQsQ0FBYyxrQkFBZCxDQUFqQixDQUF0QixDQUFWO0FBQ0g7QUFDSixpQkFORDtBQU9ILGFBVEQ7QUFVSCxTQTFCb0I7O0FBNEJyQixjQUFNLGdCQUFXOztBQUViLGdCQUFJLFFBQVEsSUFBWjs7QUFFQSxpQkFBSyxFQUFMLENBQVEsbUJBQVIsRUFBNkIsS0FBSyxPQUFMLENBQWEsTUFBMUMsRUFBa0QsVUFBUyxDQUFULEVBQVk7QUFDMUQsa0JBQUUsY0FBRjtBQUNBLHNCQUFNLElBQU4sQ0FBVyxJQUFYO0FBQ0gsYUFIRDs7QUFLQSxnQkFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFqQixFQUEwQjs7QUFFdEIscUJBQUssT0FBTCxHQUFlLEdB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RyxFQUFzRyxZQUFXO0FBQzdHO0FBQ0gsYUFGcUcsQ0FFcEcsSUFGb0csQ0FFL0YsSUFGK0YsQ0FBdEcsRUFFYyxHQUZkLENBRWtCLFNBRmxCLEVBRTZCLEVBRjdCO0FBSUgsU0FSRCxNQVFPO0FBQ0gsaUJBQUssUUFBTCxDQUFjLFdBQWQ7QUFDQTtBQUNIOztBQUVELGVBQU8sRUFBRSxPQUFGLEVBQVA7QUFDSDtBQUVKLENBL1NELEVBK1NHLEtBL1NIIiwiZmlsZSI6InN3aXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBbmltYXRpb25zO1xuXG4gICAgVUkuY29tcG9uZW50KCdzd2l0Y2hlcicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgY29ubmVjdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB0b2dnbGUgICAgOiBcIj4qXCIsXG4gICAgICAgICAgICBhY3RpdmUgICAgOiAwLFxuICAgICAgICAgICAgYW5pbWF0aW9uIDogZmFsc2UsXG4gICAgICAgICAgICBkdXJhdGlvbiAgOiAyMDAsXG4gICAgICAgICAgICBzd2lwaW5nICAgOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstc3dpdGNoZXJdXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzd2l0Y2hlciA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzd2l0Y2hlci5kYXRhKFwic3dpdGNoZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBVSS5zd2l0Y2hlcihzd2l0Y2hlciwgVUkuVXRpbHMub3B0aW9ucyhzd2l0Y2hlci5hdHRyKFwiZGF0YS11ay1zd2l0Y2hlclwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrLnVrLnN3aXRjaGVyXCIsIHRoaXMub3B0aW9ucy50b2dnbGUsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuc2hvdyh0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbm5lY3QpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdCA9IFVJLiQodGhpcy5vcHRpb25zLmNvbm5lY3QpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoXCJ1ay1hY3RpdmVcIik7XG5cbiAgICAgICAgICAgICAgICAvLyBkZWxlZ2F0ZSBzd2l0Y2ggY29tbWFuZHMgd2l0aGluIGNvbnRhaW5lciBjb250ZW50XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbml0IEFSSUEgZm9yIGNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0LmNoaWxkcmVuKCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdC5vbihcImNsaWNrXCIsICdbZGF0YS11ay1zd2l0Y2hlci1pdGVtXScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IFVJLiQodGhpcykuYXR0cignZGF0YS11ay1zd2l0Y2hlci1pdGVtJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5pbmRleCA9PSBpdGVtKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5zaG93KCR0aGlzLmluZGV4ICsgKGl0ZW09PSduZXh0JyA/IDE6LTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuc2hvdyhwYXJzZUludChpdGVtLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN3aXBpbmcpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0Lm9uKCdzd2lwZVJpZ2h0IHN3aXBlTGVmdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnNob3coJHRoaXMuaW5kZXggKyAoZS50eXBlID09ICdzd2lwZUxlZnQnID8gMSA6IC0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlcyA9IHRoaXMuZmluZCh0aGlzLm9wdGlvbnMudG9nZ2xlKSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlICA9IHRvZ2dsZXMuZmlsdGVyKFwiLnVrLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdyhhY3RpdmUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWN0aXZlPT09ZmFsc2UpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSB0b2dnbGVzLmVxKHRoaXMub3B0aW9ucy5hY3RpdmUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coYWN0aXZlLmxlbmd0aCA/IGFjdGl2ZSA6IHRvZ2dsZXMuZXEoMCksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJbml0IEFSSUEgZm9yIHRvZ2dsZXNcbiAgICAgICAgICAgICAgICB0b2dnbGVzLm5vdChhY3RpdmUpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICBhY3RpdmUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbih0YWIsIGFuaW1hdGUpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNOYU4odGFiKSkge1xuICAgICAgICAgICAgICAgIHRhYiA9IFVJLiQodGFiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlcyA9IHRoaXMuZmluZCh0aGlzLm9wdGlvbnMudG9nZ2xlKTtcblxuICAgICAgICAgICAgICAgIHRhYiA9IHRhYiA8IDAgPyB0b2dnbGVzLmxlbmd0aC0xIDogdGFiO1xuICAgICAgICAgICAgICAgIHRhYiA9IHRvZ2dsZXMuZXEodG9nZ2xlc1t0YWJdID8gdGFiIDogMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHRvZ2dsZXMgICA9IHRoaXMuZmluZCh0aGlzLm9wdGlvbnMudG9nZ2xlKSxcbiAgICAgICAgICAgICAgICBhY3RpdmUgICAgPSBVSS4kKHRhYiksXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uID0gQW5pbWF0aW9uc1t0aGlzLm9wdGlvbnMuYW5pbWF0aW9uXSB8fCBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkdGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbnMubm9uZS5hcHBseSgkdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbSA9ICR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW0ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1bMV0gPSBhbmltWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYW5pbVswXSA9IGFuaW1bMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBhbmltWzFdID0gYW5pbVsxXS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvcmVBbmltYXRpb24uYXBwbHkoJHRoaXMsIFthbmltLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGFuaW1hdGU9PT1mYWxzZSB8fCAhVUkuc3VwcG9ydC5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBBbmltYXRpb25zLm5vbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmUuaGFzQ2xhc3MoXCJ1ay1kaXNhYmxlZFwiKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgQVJJQSBmb3IgVG9nZ2xlc1xuICAgICAgICAgICAgdG9nZ2xlcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICBhY3RpdmUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG5cbiAgICAgICAgICAgIHRvZ2dsZXMuZmlsdGVyKFwiLnVrLWFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcInVrLWFjdGl2ZVwiKTtcbiAgICAgICAgICAgIGFjdGl2ZS5hZGRDbGFzcyhcInVrLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb25uZWN0ICYmIHRoaXMuY29ubmVjdC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmQodGhpcy5vcHRpb25zLnRvZ2dsZSkuaW5kZXgoYWN0aXZlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3QuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gVUkuJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuICA9IFVJLiQoY29udGFpbmVyLmNoaWxkcmVuKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCAgID0gVUkuJChjaGlsZHJlbi5maWx0ZXIoJy51ay1hY3RpdmUnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0ICAgICAgPSBVSS4kKGNoaWxkcmVuLmVxKCR0aGlzLmluZGV4KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5hcHBseSgkdGhpcywgW2N1cnJlbnQsIG5leHRdKS50aGVuKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKFwidWstYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuYWRkQ2xhc3MoXCJ1ay1hY3RpdmVcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgQVJJQSBmb3IgY29ubmVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheShuZXh0LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwic2hvdy51ay5zd2l0Y2hlclwiLCBbYWN0aXZlXSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIEFuaW1hdGlvbnMgPSB7XG5cbiAgICAgICAgJ25vbmUnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkID0gVUkuJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZC5wcm9taXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2ZhZGUnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1mYWRlJywgY3VycmVudCwgbmV4dF0pO1xuICAgICAgICB9LFxuXG4gICAgICAgICdzbGlkZS1ib3R0b20nOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1zbGlkZS1ib3R0b20nLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWRlLXRvcCc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3JlQW5pbWF0aW9uLmFwcGx5KHRoaXMsIFsndWstYW5pbWF0aW9uLXNsaWRlLXRvcCcsIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2xpZGUtdmVydGljYWwnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSBbJ3VrLWFuaW1hdGlvbi1zbGlkZS10b3AnLCAndWstYW5pbWF0aW9uLXNsaWRlLWJvdHRvbSddO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LmluZGV4KCkgPiBuZXh0LmluZGV4KCkpIHtcbiAgICAgICAgICAgICAgICBhbmltLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvcmVBbmltYXRpb24uYXBwbHkodGhpcywgW2FuaW0sIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2xpZGUtbGVmdCc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3JlQW5pbWF0aW9uLmFwcGx5KHRoaXMsIFsndWstYW5pbWF0aW9uLXNsaWRlLWxlZnQnLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWRlLXJpZ2h0JzogZnVuY3Rpb24oY3VycmVudCwgbmV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvcmVBbmltYXRpb24uYXBwbHkodGhpcywgWyd1ay1hbmltYXRpb24tc2xpZGUtcmlnaHQnLCBjdXJyZW50LCBuZXh0XSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWRlLWhvcml6b250YWwnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW0gPSBbJ3VrLWFuaW1hdGlvbi1zbGlkZS1yaWdodCcsICd1ay1hbmltYXRpb24tc2xpZGUtbGVmdCddO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LmluZGV4KCkgPiBuZXh0LmluZGV4KCkpIHtcbiAgICAgICAgICAgICAgICBhbmltLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvcmVBbmltYXRpb24uYXBwbHkodGhpcywgW2FuaW0sIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2NhbGUnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZUFuaW1hdGlvbi5hcHBseSh0aGlzLCBbJ3VrLWFuaW1hdGlvbi1zY2FsZS11cCcsIGN1cnJlbnQsIG5leHRdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBVSS5zd2l0Y2hlci5hbmltYXRpb25zID0gQW5pbWF0aW9ucztcblxuXG4gICAgLy8gaGVscGVyc1xuXG4gICAgZnVuY3Rpb24gY29yZUFuaW1hdGlvbihjbHMsIGN1cnJlbnQsIG5leHQpIHtcblxuICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKSwgY2xzSW4gPSBjbHMsIGNsc091dCA9IGNscywgcmVsZWFzZTtcblxuICAgICAgICBpZiAobmV4dFswXT09PWN1cnJlbnRbMF0pIHtcbiAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZihjbHMpID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjbHNJbiAgPSBjbHNbMF07XG4gICAgICAgICAgICBjbHNPdXQgPSBjbHNbMV0gfHwgY2xzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgVUkuJGJvZHkuY3NzKCdvdmVyZmxvdy14JywgJ2hpZGRlbicpOyAvLyBmaXggc2Nyb2xsIGp1bXBpbmcgaW4gaU9TXG5cbiAgICAgICAgcmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudCkgY3VycmVudC5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3VrLWFjdGl2ZSAnK2Nsc091dCsnIHVrLWFuaW1hdGlvbi1yZXZlcnNlJyk7XG5cbiAgICAgICAgICAgIG5leHQuYWRkQ2xhc3MoY2xzSW4pLm9uZShVSS5zdXBwb3J0LmFuaW1hdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgbmV4dC5yZW1vdmVDbGFzcygnJytjbHNJbisnJykuY3NzKHtvcGFjaXR5OicnLCBkaXNwbGF5OicnfSk7XG5cbiAgICAgICAgICAgICAgICBkLnJlc29sdmUoKTtcblxuICAgICAgICAgICAgICAgIFVJLiRib2R5LmNzcygnb3ZlcmZsb3cteCcsICcnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50KSBjdXJyZW50LmNzcyh7b3BhY2l0eTonJywgZGlzcGxheTonJ30pO1xuXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpLnNob3coKTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZXh0LmNzcygnYW5pbWF0aW9uLWR1cmF0aW9uJywgdGhpcy5vcHRpb25zLmR1cmF0aW9uKydtcycpO1xuXG4gICAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGN1cnJlbnQuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgIGN1cnJlbnQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKS5hZGRDbGFzcyhjbHNPdXQrJyB1ay1hbmltYXRpb24tcmV2ZXJzZScpLm9uZShVSS5zdXBwb3J0LmFuaW1hdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSkuY3NzKCdkaXNwbGF5JywgJycpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0LmFkZENsYXNzKCd1ay1hY3RpdmUnKTtcbiAgICAgICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICB9XG5cbn0pKFVJa2l0KTtcbiJdfQ==