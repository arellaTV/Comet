"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var $win = UI.$win,
        $doc = UI.$doc,
        scrollspies = [],
        checkScrollSpy = function checkScrollSpy() {
        for (var i = 0; i < scrollspies.length; i++) {
            window.requestAnimationFrame.apply(window, [scrollspies[i].check]);
        }
    };

    UI.component('scrollspy', {

        defaults: {
            "target": false,
            "cls": "uk-scrollspy-inview",
            "initcls": "uk-scrollspy-init-inview",
            "topoffset": 0,
            "leftoffset": 0,
            "repeat": false,
            "delay": 0
        },

        boot: function boot() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpy);
            $win.on("load resize orientationchange", UI.Utils.debounce(checkScrollSpy, 50));

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-scrollspy]", context).each(function () {

                    var element = UI.$(this);

                    if (!element.data("scrollspy")) {
                        var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this,
                inviewstate,
                initinview,
                togglecls = this.options.cls.split(/,/),
                fn = function fn() {

                var elements = $this.options.target ? $this.element.find($this.options.target) : $this.element,
                    delayIdx = elements.length === 1 ? 1 : 0,
                    toggleclsIdx = 0;

                elements.each(function (idx) {

                    var element = UI.$(this),
                        inviewstate = element.data('inviewstate'),
                        inview = UI.Utils.isInView(element, $this.options),
                        toggle = element.data('ukScrollspyCls') || togglecls[toggleclsIdx].trim();

                    if (inview && !inviewstate && !element.data('scrollspy-idle')) {

                        if (!initinview) {
                            element.addClass($this.options.initcls);
                            $this.offset = element.offset();
                            initinview = true;

                            element.trigger("init.uk.scrollspy");
                        }

                        element.data('scrollspy-idle', setTimeout(function () {

                            element.addClass("uk-scrollspy-inview").toggleClass(toggle).width();
                            element.trigger("inview.uk.scrollspy");

                            element.data('scrollspy-idle', false);
                            element.data('inviewstate', true);
                        }, $this.options.delay * delayIdx));

                        delayIdx++;
                    }

                    if (!inview && inviewstate && $this.options.repeat) {

                        if (element.data('scrollspy-idle')) {
                            clearTimeout(element.data('scrollspy-idle'));
                            element.data('scrollspy-idle', false);
                        }

                        element.removeClass("uk-scrollspy-inview").toggleClass(toggle);
                        element.data('inviewstate', false);

                        element.trigger("outview.uk.scrollspy");
                    }

                    toggleclsIdx = togglecls[toggleclsIdx + 1] ? toggleclsIdx + 1 : 0;
                });
            };

            fn();

            this.check = fn;

            scrollspies.push(this);
        }
    });

    var scrollspynavs = [],
        checkScrollSpyNavs = function checkScrollSpyNavs() {
        for (var i = 0; i < scrollspynavs.length; i++) {
            window.requestAnimationFrame.apply(window, [scrollspynavs[i].check]);
        }
    };

    UI.component('scrollspynav', {

        defaults: {
            "cls": 'uk-active',
            "closest": false,
            "topoffset": 0,
            "leftoffset": 0,
            "smoothscroll": false
        },

        boot: function boot() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpyNavs);
            $win.on("resize orientationchange", UI.Utils.debounce(checkScrollSpyNavs, 50));

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-scrollspy-nav]", context).each(function () {

                    var element = UI.$(this);

                    if (!element.data("scrollspynav")) {
                        var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
                    }
                });
            });
        },

        init: function init() {

            var ids = [],
                links = this.find("a[href^='#']").each(function () {
                if (this.getAttribute("href").trim() !== '#') ids.push(this.getAttribute("href"));
            }),
                targets = UI.$(ids.join(",")),
                clsActive = this.options.cls,
                clsClosest = this.options.closest || this.options.closest;

            var $this = this,
                inviews,
                fn = function fn() {

                inviews = [];

                for (var i = 0; i < targets.length; i++) {
                    if (UI.Utils.isInView(targets.eq(i), $this.options)) {
                        inviews.push(targets.eq(i));
                    }
                }

                if (inviews.length) {

                    var navitems,
                        scrollTop = $win.scrollTop(),
                        target = function () {
                        for (var i = 0; i < inviews.length; i++) {
                            if (inviews[i].offset().top >= scrollTop) {
                                return inviews[i];
                            }
                        }
                    }();

                    if (!target) return;

                    if ($this.options.closest) {
                        links.blur().closest(clsClosest).removeClass(clsActive);
                        navitems = links.filter("a[href='#" + target.attr("id") + "']").closest(clsClosest).addClass(clsActive);
                    } else {
                        navitems = links.removeClass(clsActive).filter("a[href='#" + target.attr("id") + "']").addClass(clsActive);
                    }

                    $this.element.trigger("inview.uk.scrollspynav", [target, navitems]);
                }
            };

            if (this.options.smoothscroll && UI.smoothScroll) {
                links.each(function () {
                    UI.smoothScroll(this, $this.options.smoothscroll);
                });
            }

            fn();

            this.element.data("scrollspynav", this);

            this.check = fn;
            scrollspynavs.push(this);
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3Njcm9sbHNweS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFhOztBQUVWOztBQUVBLFFBQUksT0FBaUIsR0FBRyxJQUF4QjtBQUFBLFFBQ0ksT0FBaUIsR0FBRyxJQUR4QjtBQUFBLFFBRUksY0FBaUIsRUFGckI7QUFBQSxRQUdJLGlCQUFpQixTQUFqQixjQUFpQixHQUFXO0FBQ3hCLGFBQUksSUFBSSxJQUFFLENBQVYsRUFBYSxJQUFJLFlBQVksTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDdEMsbUJBQU8scUJBQVAsQ0FBNkIsS0FBN0IsQ0FBbUMsTUFBbkMsRUFBMkMsQ0FBQyxZQUFZLENBQVosRUFBZSxLQUFoQixDQUEzQztBQUNIO0FBQ0osS0FQTDs7QUFTQSxPQUFHLFNBQUgsQ0FBYSxXQUFiLEVBQTBCOztBQUV0QixrQkFBVTtBQUNOLHNCQUFlLEtBRFQ7QUFFTixtQkFBZSxxQkFGVDtBQUdOLHVCQUFlLDBCQUhUO0FBSU4seUJBQWUsQ0FKVDtBQUtOLDBCQUFlLENBTFQ7QUFNTixzQkFBZSxLQU5UO0FBT04scUJBQWU7QUFQVCxTQUZZOztBQVl0QixjQUFNLGdCQUFXOzs7QUFHYixpQkFBSyxFQUFMLENBQVEsdUJBQVIsRUFBaUMsY0FBakM7QUFDQSxpQkFBSyxFQUFMLENBQVEsK0JBQVIsRUFBeUMsR0FBRyxLQUFILENBQVMsUUFBVCxDQUFrQixjQUFsQixFQUFrQyxFQUFsQyxDQUF6Qzs7O0FBR0EsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUsscUJBQUwsRUFBNEIsT0FBNUIsRUFBcUMsSUFBckMsQ0FBMEMsWUFBVzs7QUFFakQsd0JBQUksVUFBVSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQWQ7O0FBRUEsd0JBQUksQ0FBQyxRQUFRLElBQVIsQ0FBYSxXQUFiLENBQUwsRUFBZ0M7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QUFDLE1BQUwsRUFBYTs7QUFFYix3QkFBSSxNQUFNLE9BQU4sQ0FBYyxPQUFsQixFQUEyQjtBQUN2Qiw4QkFBTSxJQUFOLEdBQWEsT0FBYixDQUFxQixVQUFyQixFQUFpQyxXQUFqQyxDQUE2QyxTQUE3QztBQUNBLG1DQUFXLE1BQU0sTUFBTixDQUFhLGNBQVksT0FBTyxJQUFQLENBQVksSUFBWixDQUFaLEdBQThCLElBQTNDLEVBQWlELE9BQWpELENBQXlELFVBQXpELEVBQXFFLFFBQXJFLENBQThFLFNBQTlFLENBQVg7QUFDSCxxQkFIRCxNQUdPO0FBQ0gsbUNBQVcsTUFBTSxXQUFOLENBQWtCLFNBQWxCLEVBQTZCLE1BQTdCLENBQW9DLGNBQVksT0FBTyxJQUFQLENBQVksSUFBWixDQUFaLEdBQThCLElBQWxFLEVBQXdFLFFBQXhFLENBQWlGLFNBQWpGLENBQVg7QUFDSDs7QUFFRCwwQkFBTSxPQUFOLENBQWMsT0FBZCxDQUFzQix3QkFBdEIsRUFBZ0QsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFoRDtBQUNIO0FBQ0osYUFqQ0Q7O0FBbUNBLGdCQUFJLEtBQUssT0FBTCxDQUFhLFlBQWIsSUFBNkIsR0FBRyxZQUFwQyxFQUFrRDtBQUM5QyxzQkFBTSxJQUFOLENBQVcsWUFBVTtBQUNqQix1QkFBRyxZQUFILENBQWdCLElBQWhCLEVBQXNCLE1BQU0sT0FBTixDQUFjLFlBQXBDO0FBQ0gsaUJBRkQ7QUFHSDs7QUFFRDs7QUFFQSxpQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixjQUFsQixFQUFrQyxJQUFsQzs7QUFFQSxpQkFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLDBCQUFjLElBQWQsQ0FBbUIsSUFBbkI7QUFFSDtBQXZGd0IsS0FBN0I7QUEwRkgsQ0EvTUQsRUErTUcsS0EvTUgiLCJmaWxlIjoic2Nyb2xsc3B5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciAkd2luICAgICAgICAgICA9IFVJLiR3aW4sXG4gICAgICAgICRkb2MgICAgICAgICAgID0gVUkuJGRvYyxcbiAgICAgICAgc2Nyb2xsc3BpZXMgICAgPSBbXSxcbiAgICAgICAgY2hlY2tTY3JvbGxTcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgc2Nyb2xsc3BpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmFwcGx5KHdpbmRvdywgW3Njcm9sbHNwaWVzW2ldLmNoZWNrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICBVSS5jb21wb25lbnQoJ3Njcm9sbHNweScsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgXCJ0YXJnZXRcIiAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiY2xzXCIgICAgICAgIDogXCJ1ay1zY3JvbGxzcHktaW52aWV3XCIsXG4gICAgICAgICAgICBcImluaXRjbHNcIiAgICA6IFwidWstc2Nyb2xsc3B5LWluaXQtaW52aWV3XCIsXG4gICAgICAgICAgICBcInRvcG9mZnNldFwiICA6IDAsXG4gICAgICAgICAgICBcImxlZnRvZmZzZXRcIiA6IDAsXG4gICAgICAgICAgICBcInJlcGVhdFwiICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgXCJkZWxheVwiICAgICAgOiAwXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGxpc3RlbiB0byBzY3JvbGwgYW5kIHJlc2l6ZVxuICAgICAgICAgICAgJGRvYy5vbihcInNjcm9sbGluZy51ay5kb2N1bWVudFwiLCBjaGVja1Njcm9sbFNweSk7XG4gICAgICAgICAgICAkd2luLm9uKFwibG9hZCByZXNpemUgb3JpZW50YXRpb25jaGFuZ2VcIiwgVUkuVXRpbHMuZGVib3VuY2UoY2hlY2tTY3JvbGxTcHksIDUwKSk7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLXNjcm9sbHNweV1cIiwgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50LmRhdGEoXCJzY3JvbGxzcHlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBVSS5zY3JvbGxzcHkoZWxlbWVudCwgVUkuVXRpbHMub3B0aW9ucyhlbGVtZW50LmF0dHIoXCJkYXRhLXVrLXNjcm9sbHNweVwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgaW52aWV3c3RhdGUsIGluaXRpbnZpZXcsIHRvZ2dsZWNscyA9IHRoaXMub3B0aW9ucy5jbHMuc3BsaXQoLywvKSwgZm4gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzICAgICA9ICR0aGlzLm9wdGlvbnMudGFyZ2V0ID8gJHRoaXMuZWxlbWVudC5maW5kKCR0aGlzLm9wdGlvbnMudGFyZ2V0KSA6ICR0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5SWR4ICAgICA9IGVsZW1lbnRzLmxlbmd0aCA9PT0gMSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVjbHNJZHggPSAwO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbihpZHgpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ICAgICA9IFVJLiQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZpZXdzdGF0ZSA9IGVsZW1lbnQuZGF0YSgnaW52aWV3c3RhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmlldyAgICAgID0gVUkuVXRpbHMuaXNJblZpZXcoZWxlbWVudCwgJHRoaXMub3B0aW9ucyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUgICAgICA9IGVsZW1lbnQuZGF0YSgndWtTY3JvbGxzcHlDbHMnKSB8fCB0b2dnbGVjbHNbdG9nZ2xlY2xzSWR4XS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGludmlldyAmJiAhaW52aWV3c3RhdGUgJiYgIWVsZW1lbnQuZGF0YSgnc2Nyb2xsc3B5LWlkbGUnKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluaXRpbnZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCR0aGlzLm9wdGlvbnMuaW5pdGNscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMub2Zmc2V0ID0gZWxlbWVudC5vZmZzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aW52aWV3ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudHJpZ2dlcihcImluaXQudWsuc2Nyb2xsc3B5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGEoJ3Njcm9sbHNweS1pZGxlJywgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhcInVrLXNjcm9sbHNweS1pbnZpZXdcIikudG9nZ2xlQ2xhc3ModG9nZ2xlKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudHJpZ2dlcihcImludmlldy51ay5zY3JvbGxzcHlcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGEoJ3Njcm9sbHNweS1pZGxlJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnaW52aWV3c3RhdGUnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHRoaXMub3B0aW9ucy5kZWxheSAqIGRlbGF5SWR4KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5SWR4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWludmlldyAmJiBpbnZpZXdzdGF0ZSAmJiAkdGhpcy5vcHRpb25zLnJlcGVhdCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhKCdzY3JvbGxzcHktaWRsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGVsZW1lbnQuZGF0YSgnc2Nyb2xsc3B5LWlkbGUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdzY3JvbGxzcHktaWRsZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhcInVrLXNjcm9sbHNweS1pbnZpZXdcIikudG9nZ2xlQ2xhc3ModG9nZ2xlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnaW52aWV3c3RhdGUnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudHJpZ2dlcihcIm91dHZpZXcudWsuc2Nyb2xsc3B5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlY2xzSWR4ID0gdG9nZ2xlY2xzW3RvZ2dsZWNsc0lkeCArIDFdID8gKHRvZ2dsZWNsc0lkeCArIDEpIDogMDtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm4oKTtcblxuICAgICAgICAgICAgdGhpcy5jaGVjayA9IGZuO1xuXG4gICAgICAgICAgICBzY3JvbGxzcGllcy5wdXNoKHRoaXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHZhciBzY3JvbGxzcHluYXZzID0gW10sXG4gICAgICAgIGNoZWNrU2Nyb2xsU3B5TmF2cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBzY3JvbGxzcHluYXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZS5hcHBseSh3aW5kb3csIFtzY3JvbGxzcHluYXZzW2ldLmNoZWNrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICBVSS5jb21wb25lbnQoJ3Njcm9sbHNweW5hdicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgXCJjbHNcIiAgICAgICAgICA6ICd1ay1hY3RpdmUnLFxuICAgICAgICAgICAgXCJjbG9zZXN0XCIgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgXCJ0b3BvZmZzZXRcIiAgICA6IDAsXG4gICAgICAgICAgICBcImxlZnRvZmZzZXRcIiAgIDogMCxcbiAgICAgICAgICAgIFwic21vb3Roc2Nyb2xsXCIgOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBsaXN0ZW4gdG8gc2Nyb2xsIGFuZCByZXNpemVcbiAgICAgICAgICAgICRkb2Mub24oXCJzY3JvbGxpbmcudWsuZG9jdW1lbnRcIiwgY2hlY2tTY3JvbGxTcHlOYXZzKTtcbiAgICAgICAgICAgICR3aW4ub24oXCJyZXNpemUgb3JpZW50YXRpb25jaGFuZ2VcIiwgVUkuVXRpbHMuZGVib3VuY2UoY2hlY2tTY3JvbGxTcHlOYXZzLCA1MCkpO1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoXCJbZGF0YS11ay1zY3JvbGxzcHktbmF2XVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQuZGF0YShcInNjcm9sbHNweW5hdlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IFVJLnNjcm9sbHNweW5hdihlbGVtZW50LCBVSS5VdGlscy5vcHRpb25zKGVsZW1lbnQuYXR0cihcImRhdGEtdWstc2Nyb2xsc3B5LW5hdlwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGlkcyAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICBsaW5rcyAgID0gdGhpcy5maW5kKFwiYVtocmVmXj0nIyddXCIpLmVhY2goZnVuY3Rpb24oKXsgaWYodGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpLnRyaW0oKSE9PScjJykgaWRzLnB1c2godGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTsgfSksXG4gICAgICAgICAgICAgICAgdGFyZ2V0cyA9IFVJLiQoaWRzLmpvaW4oXCIsXCIpKSxcblxuICAgICAgICAgICAgICAgIGNsc0FjdGl2ZSAgPSB0aGlzLm9wdGlvbnMuY2xzLFxuICAgICAgICAgICAgICAgIGNsc0Nsb3Nlc3QgPSB0aGlzLm9wdGlvbnMuY2xvc2VzdCB8fCB0aGlzLm9wdGlvbnMuY2xvc2VzdDtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgaW52aWV3cywgZm4gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaW52aWV3cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wIDsgaSA8IHRhcmdldHMubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChVSS5VdGlscy5pc0luVmlldyh0YXJnZXRzLmVxKGkpLCAkdGhpcy5vcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52aWV3cy5wdXNoKHRhcmdldHMuZXEoaSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGludmlld3MubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hdml0ZW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPCBpbnZpZXdzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpbnZpZXdzW2ldLm9mZnNldCgpLnRvcCA+PSBzY3JvbGxUb3Ape1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmlld3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLm9wdGlvbnMuY2xvc2VzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3MuYmx1cigpLmNsb3Nlc3QoY2xzQ2xvc2VzdCkucmVtb3ZlQ2xhc3MoY2xzQWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdml0ZW1zID0gbGlua3MuZmlsdGVyKFwiYVtocmVmPScjXCIrdGFyZ2V0LmF0dHIoXCJpZFwiKStcIiddXCIpLmNsb3Nlc3QoY2xzQ2xvc2VzdCkuYWRkQ2xhc3MoY2xzQWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdml0ZW1zID0gbGlua3MucmVtb3ZlQ2xhc3MoY2xzQWN0aXZlKS5maWx0ZXIoXCJhW2hyZWY9JyNcIit0YXJnZXQuYXR0cihcImlkXCIpK1wiJ11cIikuYWRkQ2xhc3MoY2xzQWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQudHJpZ2dlcihcImludmlldy51ay5zY3JvbGxzcHluYXZcIiwgW3RhcmdldCwgbmF2aXRlbXNdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtb290aHNjcm9sbCAmJiBVSS5zbW9vdGhTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICBsaW5rcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIFVJLnNtb290aFNjcm9sbCh0aGlzLCAkdGhpcy5vcHRpb25zLnNtb290aHNjcm9sbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZuKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhKFwic2Nyb2xsc3B5bmF2XCIsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrID0gZm47XG4gICAgICAgICAgICBzY3JvbGxzcHluYXZzLnB1c2godGhpcyk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KShVSWtpdCk7XG4iXX0=