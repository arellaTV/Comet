"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sticky", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var $win = UI.$win,
        $doc = UI.$doc,
        sticked = [],
        direction = 1;

    UI.component('sticky', {

        defaults: {
            top: 0,
            bottom: 0,
            animation: '',
            clsinit: 'uk-sticky-init',
            clsactive: 'uk-active',
            clsinactive: '',
            getWidthFrom: '',
            showup: false,
            boundary: false,
            media: false,
            target: false,
            disabled: false
        },

        boot: function boot() {

            // should be more efficient than using $win.scroll(checkscrollposition):
            UI.$doc.on('scrolling.uk.document', function (e, data) {
                if (!data || !data.dir) return;
                direction = data.dir.y;
                checkscrollposition();
            });

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function () {

                if (!sticked.length) return;

                for (var i = 0; i < sticked.length; i++) {
                    sticked[i].reset(true);
                    //sticked[i].self.computeWrapper();
                }

                checkscrollposition();
            }, 100));

            // init code
            UI.ready(function (context) {

                setTimeout(function () {

                    UI.$("[data-uk-sticky]", context).each(function () {

                        var $ele = UI.$(this);

                        if (!$ele.data("sticky")) {
                            UI.sticky($ele, UI.Utils.options($ele.attr('data-uk-sticky')));
                        }
                    });

                    checkscrollposition();
                }, 0);
            });
        },

        init: function init() {

            var boundary = this.options.boundary,
                boundtoparent;

            this.wrapper = this.element.wrap('<div class="uk-sticky-placeholder"></div>').parent();
            this.computeWrapper();
            this.element.css('margin', 0);

            if (boundary) {

                if (boundary === true || boundary[0] === '!') {

                    boundary = boundary === true ? this.wrapper.parent() : this.wrapper.closest(boundary.substr(1));
                    boundtoparent = true;
                } else if (typeof boundary === "string") {
                    boundary = UI.$(boundary);
                }
            }

            this.sticky = {
                self: this,
                options: this.options,
                element: this.element,
                currentTop: null,
                wrapper: this.wrapper,
                init: false,
                getWidthFrom: UI.$(this.options.getWidthFrom || this.wrapper),
                boundary: boundary,
                boundtoparent: boundtoparent,
                top: 0,
                calcTop: function calcTop() {

                    var top = this.options.top;

                    // dynamic top parameter
                    if (this.options.top && typeof this.options.top == 'string') {

                        // e.g. 50vh
                        if (this.options.top.match(/^(-|)(\d+)vh$/)) {
                            top = window.innerHeight * parseInt(this.options.top, 10) / 100;
                            // e.g. #elementId, or .class-1,class-2,.class-3 (first found is used)
                        } else {

                            var topElement = UI.$(this.options.top).first();

                            if (topElement.length && topElement.is(':visible')) {
                                top = -1 * (topElement.offset().top + topElement.outerHeight() - this.wrapper.offset().top);
                            }
                        }
                    }

                    this.top = top;
                },

                reset: function reset(force) {

                    this.calcTop();

                    var finalize = function () {
                        this.element.css({ "position": "", "top": "", "width": "", "left": "", "margin": "0" });
                        this.element.removeClass([this.options.animation, 'uk-animation-reverse', this.options.clsactive].join(' '));
                        this.element.addClass(this.options.clsinactive);
                        this.element.trigger('inactive.uk.sticky');

                        this.currentTop = null;
                        this.animate = false;
                    }.bind(this);

                    if (!force && this.options.animation && UI.support.animation && !UI.Utils.isInView(this.wrapper)) {

                        this.animate = true;

                        this.element.removeClass(this.options.animation).one(UI.support.animation.end, function () {
                            finalize();
                        }).width(); // force redraw

                        this.element.addClass(this.options.animation + ' ' + 'uk-animation-reverse');
                    } else {
                        finalize();
                    }
                },

                check: function check() {

                    if (this.options.disabled) {
                        return false;
                    }

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

                    var scrollTop = $win.scrollTop(),
                        documentHeight = $doc.height(),
                        dwh = documentHeight - window.innerHeight,
                        extra = scrollTop > dwh ? dwh - scrollTop : 0,
                        elementTop = this.wrapper.offset().top,
                        etse = elementTop - this.top - extra,
                        active = scrollTop >= etse;

                    if (active && this.options.showup) {

                        // set inactiv if scrolling down
                        if (direction == 1) {
                            active = false;
                        }

                        // set inactive when wrapper is still in view
                        if (direction == -1 && !this.element.hasClass(this.options.clsactive) && UI.Utils.isInView(this.wrapper)) {
                            active = false;
                        }
                    }

                    return active;
                }
            };

            this.sticky.calcTop();

            sticked.push(this.sticky);
        },

        update: function update() {
            checkscrollposition(this.sticky);
        },

        enable: function enable() {
            this.options.disabled = false;
            this.update();
        },

        disable: function disable(force) {
            this.options.disabled = true;
            this.sticky.reset(force);
        },

        computeWrapper: function computeWrapper() {

            this.wrapper.css({
                'height': ['absolute', 'fixed'].indexOf(this.element.css('position')) == -1 ? this.element.outerHeight() : '',
                'float': this.element.css('float') != 'none' ? this.element.css('float') : '',
                'margin': this.element.css('margin')
            });

            if (this.element.css('position') == 'fixed') {
                this.element.css({
                    width: this.sticky.getWidthFrom.length ? this.sticky.getWidthFrom.width() : this.element.width()
                });
            }
        }
    });

    function checkscrollposition(direction) {

        var stickies = arguments.length ? arguments : sticked;

        if (!stickies.length || $win.scrollTop() < 0) return;

        var scrollTop = $win.scrollTop(),
            documentHeight = $doc.height(),
            windowHeight = $win.height(),
            dwh = documentHeight - windowHeight,
            extra = scrollTop > dwh ? dwh - scrollTop : 0,
            newTop,
            containerBottom,
            stickyHeight,
            sticky;

        for (var i = 0; i < stickies.length; i++) {

            sticky = stickies[i];

            if (!sticky.element.is(":visible") || sticky.animate) {
                continue;
            }

            if (!sticky.check()) {

                if (sticky.currentTop !== null) {
                    sticky.reset();
                }
            } else {

                if (sticky.top < 0) {
                    newTop = 0;
                } else {
                    stickyHeight = sticky.element.outerHeight();
                    newTop = documentHeight - stickyHeight - sticky.top - sticky.options.bottom - scrollTop - extra;
                    newTop = newTop < 0 ? newTop + sticky.top : sticky.top;
                }

                if (sticky.boundary && sticky.boundary.length) {

                    var bTop = sticky.boundary.offset().top;

                    if (sticky.boundtoparent) {
                        containerBottom = documentHeight - (bTop + sticky.boundary.outerHeight()) + parseInt(sticky.boundary.css('padding-bottom'));
                    } else {
                        containerBottom = documentHeight - bTop;
                    }

                    newTop = scrollTop + stickyHeight > documentHeight - containerBottom - (sticky.top < 0 ? 0 : sticky.top) ? documentHeight - containerBottom - (scrollTop + stickyHeight) : newTop;
                }

                if (sticky.currentTop != newTop) {

                    sticky.element.css({
                        position: "fixed",
                        top: newTop,
                        width: sticky.getWidthFrom.length ? sticky.getWidthFrom.width() : sticky.element.width()
                    });

                    if (!sticky.init) {

                        sticky.element.addClass(sticky.options.clsinit);

                        if (location.hash && scrollTop > 0 && sticky.options.target) {

                            var $target = UI.$(location.hash);

                            if ($target.length) {

                                setTimeout(function ($target, sticky) {

                                    return function () {

                                        sticky.element.width(); // force redraw

                                        var offset = $target.offset(),
                                            maxoffset = offset.top + $target.outerHeight(),
                                            stickyOffset = sticky.element.offset(),
                                            stickyHeight = sticky.element.outerHeight(),
                                            stickyMaxOffset = stickyOffset.top + stickyHeight;

                                        if (stickyOffset.top < maxoffset && offset.top < stickyMaxOffset) {
                                            scrollTop = offset.top - stickyHeight - sticky.options.target;
                                            window.scrollTo(0, scrollTop);
                                        }
                                    };
                                }($target, sticky), 0);
                            }
                        }
                    }

                    sticky.element.addClass(sticky.options.clsactive).removeClass(sticky.options.clsinactive);
                    sticky.element.trigger('active.uk.sticky');
                    sticky.element.css('margin', '');

                    if (sticky.options.animation && sticky.init && !UI.Utils.isInView(sticky.wrapper)) {
                        sticky.element.addClass(sticky.options.animation);
                    }

                    sticky.currentTop = newTop;
                }
            }

            sticky.init = true;
        }
    }

    return UI.sticky;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3N0aWNreS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLENBQUMsVUFBUyxLQUFULEVBQWdCOztBQUViLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLGNBQVAsRUFBdUIsQ0FBQyxPQUFELENBQXZCLEVBQWtDLFlBQVU7QUFDeEMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBRUEsUUFBSSxPQUFlLEdBQUcsSUFBdEI7QUFBQSxRQUNJLE9BQWUsR0FBRyxJQUR0QjtBQUFBLFFBRUksVUFBZSxFQUZuQjtBQUFBLFFBR0ksWUFBZSxDQUhuQjs7QUFLQSxPQUFHLFNBQUgsQ0FBYSxRQUFiLEVBQXVCOztBQUVuQixrQkFBVTtBQUNOLGlCQUFlLENBRFQ7QUFFTixvQkFBZSxDQUZUO0FBR04sdUJBQWUsRUFIVDtBQUlOLHFCQUFlLGdCQUpUO0FBS04sdUJBQWUsV0FMVDtBQU1OLHlCQUFlLEVBTlQ7QUFPTiwwQkFBZSxFQVBUO0FBUU4sb0JBQWMsS0FSUjtBQVNOLHNCQUFlLEtBVFQ7QUFVTixtQkFBZSxLQVZUO0FBV04sb0JBQWUsS0FYVDtBQVlOLHNCQUFlO0FBWlQsU0FGUzs7QUFpQm5CLGNBQU0sZ0JBQVc7OztBQUdiLGVBQUcsSUFBSCxDQUFRLEVBQVIsQ0FBVyx1QkFBWCxFQUFvQyxVQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCO0FBQ2xELG9CQUFJLENBQUMsSUFBRCxJQUFTLENBQUMsS0FBSyxHQUFuQixFQUF3QjtBQUN4Qiw0QkFBWSxLQUFLLEdBQUwsQ0FBUyxDQUFy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Q0g7QUFDSixxQ0FkRDtBQWdCSCxpQ0FsQlUsQ0FrQlIsT0FsQlEsRUFrQkMsTUFsQkQsQ0FBWCxFQWtCcUIsQ0FsQnJCO0FBbUJIO0FBQ0o7QUFDSjs7QUFFRCwyQkFBTyxPQUFQLENBQWUsUUFBZixDQUF3QixPQUFPLE9BQVAsQ0FBZSxTQUF2QyxFQUFrRCxXQUFsRCxDQUE4RCxPQUFPLE9BQVAsQ0FBZSxXQUE3RTtBQUNBLDJCQUFPLE9BQVAsQ0FBZSxPQUFmLENBQXVCLGtCQUF2QjtBQUNBLDJCQUFPLE9BQVAsQ0FBZSxHQUFmLENBQW1CLFFBQW5CLEVBQTZCLEVBQTdCOztBQUVBLHdCQUFJLE9BQU8sT0FBUCxDQUFlLFNBQWYsSUFBNEIsT0FBTyxJQUFuQyxJQUEyQyxDQUFDLEdBQUcsS0FBSCxDQUFTLFFBQVQsQ0FBa0IsT0FBTyxPQUF6QixDQUFoRCxFQUFtRjtBQUMvRSwrQkFBTyxPQUFQLENBQWUsUUFBZixDQUF3QixPQUFPLE9BQVAsQ0FBZSxTQUF2QztBQUNIOztBQUVELDJCQUFPLFVBQVAsR0FBb0IsTUFBcEI7QUFDSDtBQUNKOztBQUVELG1CQUFPLElBQVAsR0FBYyxJQUFkO0FBQ0g7QUFDSjs7QUFFRCxXQUFPLEdBQUcsTUFBVjtBQUNILENBcFdEIiwiZmlsZSI6InN0aWNreS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LXN0aWNreVwiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyICR3aW4gICAgICAgICA9IFVJLiR3aW4sXG4gICAgICAgICRkb2MgICAgICAgICA9IFVJLiRkb2MsXG4gICAgICAgIHN0aWNrZWQgICAgICA9IFtdLFxuICAgICAgICBkaXJlY3Rpb24gICAgPSAxO1xuXG4gICAgVUkuY29tcG9uZW50KCdzdGlja3knLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHRvcCAgICAgICAgICA6IDAsXG4gICAgICAgICAgICBib3R0b20gICAgICAgOiAwLFxuICAgICAgICAgICAgYW5pbWF0aW9uICAgIDogJycsXG4gICAgICAgICAgICBjbHNpbml0ICAgICAgOiAndWstc3RpY2t5LWluaXQnLFxuICAgICAgICAgICAgY2xzYWN0aXZlICAgIDogJ3VrLWFjdGl2ZScsXG4gICAgICAgICAgICBjbHNpbmFjdGl2ZSAgOiAnJyxcbiAgICAgICAgICAgIGdldFdpZHRoRnJvbSA6ICcnLFxuICAgICAgICAgICAgc2hvd3VwICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIGJvdW5kYXJ5ICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgbWVkaWEgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB0YXJnZXQgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc2FibGVkICAgICA6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIHNob3VsZCBiZSBtb3JlIGVmZmljaWVudCB0aGFuIHVzaW5nICR3aW4uc2Nyb2xsKGNoZWNrc2Nyb2xscG9zaXRpb24pOlxuICAgICAgICAgICAgVUkuJGRvYy5vbignc2Nyb2xsaW5nLnVrLmRvY3VtZW50JywgZnVuY3Rpb24oZSwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5kaXIpIHJldHVybjtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBkYXRhLmRpci55O1xuICAgICAgICAgICAgICAgIGNoZWNrc2Nyb2xscG9zaXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICghc3RpY2tlZC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RpY2tlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdGlja2VkW2ldLnJlc2V0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAvL3N0aWNrZWRbaV0uc2VsZi5jb21wdXRlV3JhcHBlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoZWNrc2Nyb2xscG9zaXRpb24oKTtcbiAgICAgICAgICAgIH0sIDEwMCkpO1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstc3RpY2t5XVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoISRlbGUuZGF0YShcInN0aWNreVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVJLnN0aWNreSgkZWxlLCBVSS5VdGlscy5vcHRpb25zKCRlbGUuYXR0cignZGF0YS11ay1zdGlja3knKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjaGVja3Njcm9sbHBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJvdW5kYXJ5ID0gdGhpcy5vcHRpb25zLmJvdW5kYXJ5LCBib3VuZHRvcGFyZW50O1xuXG4gICAgICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmVsZW1lbnQud3JhcCgnPGRpdiBjbGFzcz1cInVrLXN0aWNreS1wbGFjZWhvbGRlclwiPjwvZGl2PicpLnBhcmVudCgpO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlV3JhcHBlcigpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnbWFyZ2luJywgMCk7XG5cbiAgICAgICAgICAgIGlmIChib3VuZGFyeSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGJvdW5kYXJ5ID09PSB0cnVlIHx8IGJvdW5kYXJ5WzBdID09PSAnIScpIHtcblxuICAgICAgICAgICAgICAgICAgICBib3VuZGFyeSAgICAgID0gYm91bmRhcnkgPT09IHRydWUgPyB0aGlzLndyYXBwZXIucGFyZW50KCkgOiB0aGlzLndyYXBwZXIuY2xvc2VzdChib3VuZGFyeS5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICBib3VuZHRvcGFyZW50ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvdW5kYXJ5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5ID0gVUkuJChib3VuZGFyeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0aWNreSA9IHtcbiAgICAgICAgICAgICAgICBzZWxmICAgICAgICAgIDogdGhpcyxcbiAgICAgICAgICAgICAgICBvcHRpb25zICAgICAgIDogdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQgICAgICAgOiB0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgY3VycmVudFRvcCAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgd3JhcHBlciAgICAgICA6IHRoaXMud3JhcHBlcixcbiAgICAgICAgICAgICAgICBpbml0ICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0V2lkdGhGcm9tICA6IFVJLiQodGhpcy5vcHRpb25zLmdldFdpZHRoRnJvbSB8fCB0aGlzLndyYXBwZXIpLFxuICAgICAgICAgICAgICAgIGJvdW5kYXJ5ICAgICAgOiBib3VuZGFyeSxcbiAgICAgICAgICAgICAgICBib3VuZHRvcGFyZW50IDogYm91bmR0b3BhcmVudCxcbiAgICAgICAgICAgICAgICB0b3AgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBjYWxjVG9wICAgICAgIDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCA9IHRoaXMub3B0aW9ucy50b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZHluYW1pYyB0b3AgcGFyYW1ldGVyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudG9wICYmIHR5cGVvZih0aGlzLm9wdGlvbnMudG9wKSA9PSAnc3RyaW5nJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcuIDUwdmhcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudG9wLm1hdGNoKC9eKC18KShcXGQrKXZoJC8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gd2luZG93LmlubmVySGVpZ2h0ICogcGFyc2VJbnQodGhpcy5vcHRpb25zLnRvcCwgMTApLzEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGUuZy4gI2VsZW1lbnRJZCwgb3IgLmNsYXNzLTEsY2xhc3MtMiwuY2xhc3MtMyAoZmlyc3QgZm91bmQgaXMgdXNlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9wRWxlbWVudCA9IFVJLiQodGhpcy5vcHRpb25zLnRvcCkuZmlyc3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3BFbGVtZW50Lmxlbmd0aCAmJiB0b3BFbGVtZW50LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9IC0xICogKCh0b3BFbGVtZW50Lm9mZnNldCgpLnRvcCArIHRvcEVsZW1lbnQub3V0ZXJIZWlnaHQoKSkgLSB0aGlzLndyYXBwZXIub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9wID0gdG9wO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICByZXNldDogZnVuY3Rpb24oZm9yY2UpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGNUb3AoKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1wicG9zaXRpb25cIjpcIlwiLCBcInRvcFwiOlwiXCIsIFwid2lkdGhcIjpcIlwiLCBcImxlZnRcIjpcIlwiLCBcIm1hcmdpblwiOlwiMFwifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoW3RoaXMub3B0aW9ucy5hbmltYXRpb24sICd1ay1hbmltYXRpb24tcmV2ZXJzZScsIHRoaXMub3B0aW9ucy5jbHNhY3RpdmVdLmpvaW4oJyAnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsc2luYWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdpbmFjdGl2ZS51ay5zdGlja3knKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9wID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSAgICA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMub3B0aW9ucy5hbmltYXRpb24gJiYgVUkuc3VwcG9ydC5hbmltYXRpb24gJiYgIVVJLlV0aWxzLmlzSW5WaWV3KHRoaXMud3JhcHBlcikpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hbmltYXRpb24pLm9uZShVSS5zdXBwb3J0LmFuaW1hdGlvbi5lbmQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxpemUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLndpZHRoKCk7IC8vIGZvcmNlIHJlZHJhd1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmFuaW1hdGlvbisnICcrJ3VrLWFuaW1hdGlvbi1yZXZlcnNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1lZGlhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCh0eXBlb2YodGhpcy5vcHRpb25zLm1lZGlhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IHRoaXMub3B0aW9ucy5tZWRpYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYSAmJiAhd2luZG93Lm1hdGNoTWVkaWEodGhpcy5vcHRpb25zLm1lZGlhKS5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsVG9wICAgICAgPSAkd2luLnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRIZWlnaHQgPSAkZG9jLmhlaWdodCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHdoICAgICAgICAgICAgPSBkb2N1bWVudEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhICAgICAgICAgID0gKHNjcm9sbFRvcCA+IGR3aCkgPyBkd2ggLSBzY3JvbGxUb3AgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRvcCAgICAgPSB0aGlzLndyYXBwZXIub2Zmc2V0KCkudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXRzZSAgICAgICAgICAgPSBlbGVtZW50VG9wIC0gdGhpcy50b3AgLSBleHRyYSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSAgICAgICAgID0gKHNjcm9sbFRvcCAgPj0gZXRzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSAmJiB0aGlzLm9wdGlvbnMuc2hvd3VwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCBpbmFjdGl2IGlmIHNjcm9sbGluZyBkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGluYWN0aXZlIHdoZW4gd3JhcHBlciBpcyBzdGlsbCBpbiB2aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09IC0xICYmICF0aGlzLmVsZW1lbnQuaGFzQ2xhc3ModGhpcy5vcHRpb25zLmNsc2FjdGl2ZSkgJiYgVUkuVXRpbHMuaXNJblZpZXcodGhpcy53cmFwcGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0aWNreS5jYWxjVG9wKCk7XG5cbiAgICAgICAgICAgIHN0aWNrZWQucHVzaCh0aGlzLnN0aWNreSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoZWNrc2Nyb2xscG9zaXRpb24odGhpcy5zdGlja3kpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0aWNreS5yZXNldChmb3JjZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29tcHV0ZVdyYXBwZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLndyYXBwZXIuY3NzKHtcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JyA6IFsnYWJzb2x1dGUnLCdmaXhlZCddLmluZGV4T2YodGhpcy5lbGVtZW50LmNzcygncG9zaXRpb24nKSkgPT0gLTEgPyB0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoKSA6ICcnLFxuICAgICAgICAgICAgICAgICdmbG9hdCcgIDogdGhpcy5lbGVtZW50LmNzcygnZmxvYXQnKSAhPSAnbm9uZScgPyB0aGlzLmVsZW1lbnQuY3NzKCdmbG9hdCcpIDogJycsXG4gICAgICAgICAgICAgICAgJ21hcmdpbicgOiB0aGlzLmVsZW1lbnQuY3NzKCdtYXJnaW4nKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuY3NzKCdwb3NpdGlvbicpID09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RpY2t5LmdldFdpZHRoRnJvbS5sZW5ndGggPyB0aGlzLnN0aWNreS5nZXRXaWR0aEZyb20ud2lkdGgoKSA6IHRoaXMuZWxlbWVudC53aWR0aCgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrc2Nyb2xscG9zaXRpb24oZGlyZWN0aW9uKSB7XG5cbiAgICAgICAgdmFyIHN0aWNraWVzID0gYXJndW1lbnRzLmxlbmd0aCA/IGFyZ3VtZW50cyA6IHN0aWNrZWQ7XG5cbiAgICAgICAgaWYgKCFzdGlja2llcy5sZW5ndGggfHwgJHdpbi5zY3JvbGxUb3AoKSA8IDApIHJldHVybjtcblxuICAgICAgICB2YXIgc2Nyb2xsVG9wICAgICAgID0gJHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGRvY3VtZW50SGVpZ2h0ICA9ICRkb2MuaGVpZ2h0KCksXG4gICAgICAgICAgICB3aW5kb3dIZWlnaHQgICAgPSAkd2luLmhlaWdodCgpLFxuICAgICAgICAgICAgZHdoICAgICAgICAgICAgID0gZG9jdW1lbnRIZWlnaHQgLSB3aW5kb3dIZWlnaHQsXG4gICAgICAgICAgICBleHRyYSAgICAgICAgICAgPSAoc2Nyb2xsVG9wID4gZHdoKSA/IGR3aCAtIHNjcm9sbFRvcCA6IDAsXG4gICAgICAgICAgICBuZXdUb3AsIGNvbnRhaW5lckJvdHRvbSwgc3RpY2t5SGVpZ2h0LCBzdGlja3k7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGlja2llcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBzdGlja3kgPSBzdGlja2llc1tpXTtcblxuICAgICAgICAgICAgaWYgKCFzdGlja3kuZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpIHx8IHN0aWNreS5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3RpY2t5LmNoZWNrKCkpIHtcblxuICAgICAgICAgICAgICAgIGlmIChzdGlja3kuY3VycmVudFRvcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzdGlja3kucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RpY2t5LnRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGlja3lIZWlnaHQgPSBzdGlja3kuZWxlbWVudC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgPSBkb2N1bWVudEhlaWdodCAtIHN0aWNreUhlaWdodCAtIHN0aWNreS50b3AgLSBzdGlja3kub3B0aW9ucy5ib3R0b20gLSBzY3JvbGxUb3AgLSBleHRyYTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wID0gbmV3VG9wIDwgMCA/IG5ld1RvcCArIHN0aWNreS50b3AgOiBzdGlja3kudG9wO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzdGlja3kuYm91bmRhcnkgJiYgc3RpY2t5LmJvdW5kYXJ5Lmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBiVG9wID0gc3RpY2t5LmJvdW5kYXJ5Lm9mZnNldCgpLnRvcDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RpY2t5LmJvdW5kdG9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckJvdHRvbSA9IGRvY3VtZW50SGVpZ2h0IC0gKGJUb3AgKyBzdGlja3kuYm91bmRhcnkub3V0ZXJIZWlnaHQoKSkgKyBwYXJzZUludChzdGlja3kuYm91bmRhcnkuY3NzKCdwYWRkaW5nLWJvdHRvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckJvdHRvbSA9IGRvY3VtZW50SGVpZ2h0IC0gYlRvcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5ld1RvcCA9IChzY3JvbGxUb3AgKyBzdGlja3lIZWlnaHQpID4gKGRvY3VtZW50SGVpZ2h0IC0gY29udGFpbmVyQm90dG9tIC0gKHN0aWNreS50b3AgPCAwID8gMCA6IHN0aWNreS50b3ApKSA/IChkb2N1bWVudEhlaWdodCAtIGNvbnRhaW5lckJvdHRvbSkgLSAoc2Nyb2xsVG9wICsgc3RpY2t5SGVpZ2h0KSA6IG5ld1RvcDtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlmIChzdGlja3kuY3VycmVudFRvcCAhPSBuZXdUb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICBzdGlja3kuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gOiBcImZpeGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgICAgICA6IG5ld1RvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoICAgIDogc3RpY2t5LmdldFdpZHRoRnJvbS5sZW5ndGggPyBzdGlja3kuZ2V0V2lkdGhGcm9tLndpZHRoKCkgOiBzdGlja3kuZWxlbWVudC53aWR0aCgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RpY2t5LmluaXQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3RpY2t5LmVsZW1lbnQuYWRkQ2xhc3Moc3RpY2t5Lm9wdGlvbnMuY2xzaW5pdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5oYXNoICYmIHNjcm9sbFRvcCA+IDAgJiYgc3RpY2t5Lm9wdGlvbnMudGFyZ2V0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRhcmdldCA9IFVJLiQobG9jYXRpb24uaGFzaCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHRhcmdldC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KChmdW5jdGlvbigkdGFyZ2V0LCBzdGlja3kpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGlja3kuZWxlbWVudC53aWR0aCgpOyAvLyBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgICAgICAgPSAkdGFyZ2V0Lm9mZnNldCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhvZmZzZXQgICAgPSBvZmZzZXQudG9wICsgJHRhcmdldC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGlja3lPZmZzZXQgPSBzdGlja3kuZWxlbWVudC5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RpY2t5SGVpZ2h0ID0gc3RpY2t5LmVsZW1lbnQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RpY2t5TWF4T2Zmc2V0ID0gc3RpY2t5T2Zmc2V0LnRvcCArIHN0aWNreUhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGlja3lPZmZzZXQudG9wIDwgbWF4b2Zmc2V0ICYmIG9mZnNldC50b3AgPCBzdGlja3lNYXhPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb2Zmc2V0LnRvcCAtIHN0aWNreUhlaWdodCAtIHN0aWNreS5vcHRpb25zLnRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgkdGFyZ2V0LCBzdGlja3kpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdGlja3kuZWxlbWVudC5hZGRDbGFzcyhzdGlja3kub3B0aW9ucy5jbHNhY3RpdmUpLnJlbW92ZUNsYXNzKHN0aWNreS5vcHRpb25zLmNsc2luYWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgc3RpY2t5LmVsZW1lbnQudHJpZ2dlcignYWN0aXZlLnVrLnN0aWNreScpO1xuICAgICAgICAgICAgICAgICAgICBzdGlja3kuZWxlbWVudC5jc3MoJ21hcmdpbicsICcnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RpY2t5Lm9wdGlvbnMuYW5pbWF0aW9uICYmIHN0aWNreS5pbml0ICYmICFVSS5VdGlscy5pc0luVmlldyhzdGlja3kud3JhcHBlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0aWNreS5lbGVtZW50LmFkZENsYXNzKHN0aWNreS5vcHRpb25zLmFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdGlja3kuY3VycmVudFRvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0aWNreS5pbml0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBVSS5zdGlja3k7XG59KTtcbiJdfQ==