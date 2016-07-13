"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var scrollpos = { x: window.scrollX, y: window.scrollY },
        $win = UI.$win,
        $doc = UI.$doc,
        $html = UI.$html,
        Offcanvas = {

        show: function show(element) {

            element = UI.$(element);

            if (!element.length) return;

            var $body = UI.$('body'),
                bar = element.find(".uk-offcanvas-bar:first"),
                rtl = UI.langdirection == "right",
                flip = bar.hasClass("uk-offcanvas-bar-flip") ? -1 : 1,
                dir = flip * (rtl ? -1 : 1),
                scrollbarwidth = window.innerWidth - $body.width();

            scrollpos = { x: window.pageXOffset, y: window.pageYOffset };

            element.addClass("uk-active");

            $body.css({ "width": window.innerWidth - scrollbarwidth, "height": window.innerHeight }).addClass("uk-offcanvas-page");
            $body.css(rtl ? "margin-right" : "margin-left", (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("uk-offcanvas-bar-show");

            this._initElement(element);

            bar.trigger('show.uk.offcanvas', [element, bar]);

            // Update ARIA
            element.attr('aria-hidden', 'false');
        },

        hide: function hide(force) {

            var $body = UI.$('body'),
                panel = UI.$(".uk-offcanvas.uk-active"),
                rtl = UI.langdirection == "right",
                bar = panel.find(".uk-offcanvas-bar:first"),
                finalize = function finalize() {
                $body.removeClass("uk-offcanvas-page").css({ "width": "", "height": "", "margin-left": "", "margin-right": "" });
                panel.removeClass("uk-active");

                bar.removeClass("uk-offcanvas-bar-show");
                $html.css('margin-top', '');
                window.scrollTo(scrollpos.x, scrollpos.y);
                bar.trigger('hide.uk.offcanvas', [panel, bar]);

                // Update ARIA
                panel.attr('aria-hidden', 'true');
            };

            if (!panel.length) return;

            if (UI.support.transition && !force) {

                $body.one(UI.support.transition.end, function () {
                    finalize();
                }).css(rtl ? "margin-right" : "margin-left", "");

                setTimeout(function () {
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 0);
            } else {
                finalize();
            }
        },

        _initElement: function _initElement(element) {

            if (element.data("OffcanvasInit")) return;

            element.on("click.uk.offcanvas swipeRight.uk.offcanvas swipeLeft.uk.offcanvas", function (e) {

                var target = UI.$(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("uk-offcanvas-close")) {
                        if (target.hasClass("uk-offcanvas-bar")) return;
                        if (target.parents(".uk-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            element.on("click", "a[href*='#']", function (e) {

                var link = UI.$(this),
                    href = link.attr("href");

                if (href == "#") {
                    return;
                }

                UI.$doc.one('hide.uk.offcanvas', function () {

                    var target;

                    try {
                        target = UI.$(link[0].hash);
                    } catch (e) {
                        target = '';
                    }

                    if (!target.length) {
                        target = UI.$('[name="' + link[0].hash.replace('#', '') + '"]');
                    }

                    if (target.length && UI.Utils.scrollToElement) {
                        UI.Utils.scrollToElement(target, UI.Utils.options(link.attr('data-uk-smooth-scroll') || '{}'));
                    } else {
                        window.location.href = href;
                    }
                });

                Offcanvas.hide();
            });

            element.data("OffcanvasInit", true);
        }
    };

    UI.component('offcanvasTrigger', {

        boot: function boot() {

            // init code
            $html.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function (e) {

                e.preventDefault();

                var ele = UI.$(this);

                if (!ele.data("offcanvasTrigger")) {
                    var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-offcanvas")));
                    ele.trigger("click");
                }
            });

            $html.on('keydown.uk.offcanvas', function (e) {

                if (e.keyCode === 27) {
                    // ESC
                    Offcanvas.hide();
                }
            });
        },

        init: function init() {

            var $this = this;

            this.options = UI.$.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.on("click", function (e) {
                e.preventDefault();
                Offcanvas.show($this.options.target);
            });
        }
    });

    UI.offcanvas = Offcanvas;
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL29mZmNhbnZhcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFhOztBQUVWOztBQUVBLFFBQUksWUFBWSxFQUFDLEdBQUcsT0FBTyxPQUFYLEVBQW9CLEdBQUcsT0FBTyxPQUE5QixFQUFoQjtBQUFBLFFBQ0ksT0FBWSxHQUFHLElBRG5CO0FBQUEsUUFFSSxPQUFZLEdBQUcsSUFGbkI7QUFBQSxRQUdJLFFBQVksR0FBRyxLQUhuQjtBQUFBLFFBSUksWUFBWTs7QUFFWixjQUFNLGNBQVMsT0FBVCxFQUFrQjs7QUFFcEIsc0JBQVUsR0FBRyxDQUFILENBQUssT0FBTCxDQUFWOztBQUVBLGdCQUFJLENBQUMsUUFBUSxNQUFiLEVBQXFCOztBQUVyQixnQkFBSSxRQUFZLEdBQUcsQ0FBSCxDQUFLLE1BQUwsQ0FBaEI7QUFBQSxnQkFDSSxNQUFZLFFBQVEsSUFBUixDQUFhLHlCQUFiLENBRGhCO0FBQUEsZ0JBRUksTUFBYSxHQUFHLGFBQUgsSUFBb0IsT0FGckM7QUFBQSxnQkFHSSxPQUFZLElBQUksUUFBSixDQUFhLHVCQUFiLElBQXdDLENBQUMsQ0FBekMsR0FBMkMsQ0FIM0Q7QUFBQSxnQkFJSSxNQUFZLFFBQVEsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFuQixDQUpoQjtBQUFBLGdCQU1JLGlCQUFrQixPQUFPLFVBQVAsR0FBb0IsTUFBTSxLQUFOLEVBTjFDOztBQVFBLHdCQUFZLEVBQUMsR0FBRyxPQUFPLFdBQVgsRUFBd0IsR0FBRyxPQUFPLFdBQWxDLEVBQVo7O0FBRUEsb0JBQVEsUUFBUixDQUFpQixXQUFqQjs7QUFFQSxrQkFBTSxHQUFOLENBQVUsRUFBQyxTQUFTLE9BQU8sVUFBUCxHQUFvQixjQUE5QixFQUE4QyxVQUFVLE9BQU8sV0FBL0QsRUFBVixFQUF1RixRQUF2RixDQUFnRyxtQkFBaEc7QUFDQSxrQkFBTSxHQUFOLENBQVcsTUFBTSxj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RUEsb0JBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxrQkFBVCxDQUFMLEVBQW1DO0FBQy9CLHdCQUFJLE1BQU0sR0FBRyxnQkFBSCxDQUFvQixHQUFwQixFQUF5QixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLG1CQUFULENBQWpCLENBQXpCLENBQVY7QUFDQSx3QkFBSSxPQUFKLENBQVksT0FBWjtBQUNIO0FBQ0osYUFWRDs7QUFZQSxrQkFBTSxFQUFOLENBQVMsc0JBQVQsRUFBaUMsVUFBUyxDQUFULEVBQVk7O0FBRXpDLG9CQUFJLEVBQUUsT0FBRixLQUFjLEVBQWxCLEVBQXNCOztBQUNsQiw4QkFBVSxJQUFWO0FBQ0g7QUFDSixhQUxEO0FBTUgsU0F2QjRCOztBQXlCN0IsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssT0FBTCxHQUFlLEdBQUcsQ0FBSCxDQUFLLE1BQUwsQ0FBWTtBQUN2QiwwQkFBVSxNQUFNLE9BQU4sQ0FBYyxFQUFkLENBQWlCLEdBQWpCLElBQXdCLE1BQU0sT0FBTixDQUFjLElBQWQsQ0FBbUIsTUFBbkIsQ0FBeEIsR0FBcUQ7QUFEeEMsYUFBWixFQUVaLEtBQUssT0FGTyxDQUFmOztBQUlBLGlCQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFVBQVMsQ0FBVCxFQUFZO0FBQ3pCLGtCQUFFLGNBQUY7QUFDQSwwQkFBVSxJQUFWLENBQWUsTUFBTSxPQUFOLENBQWMsTUFBN0I7QUFDSCxhQUhEO0FBSUg7QUFyQzRCLEtBQWpDOztBQXdDQSxPQUFHLFNBQUgsR0FBZSxTQUFmO0FBRUgsQ0FsTEQsRUFrTEcsS0FsTEgiLCJmaWxlIjoib2ZmY2FudmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzY3JvbGxwb3MgPSB7eDogd2luZG93LnNjcm9sbFgsIHk6IHdpbmRvdy5zY3JvbGxZfSxcbiAgICAgICAgJHdpbiAgICAgID0gVUkuJHdpbixcbiAgICAgICAgJGRvYyAgICAgID0gVUkuJGRvYyxcbiAgICAgICAgJGh0bWwgICAgID0gVUkuJGh0bWwsXG4gICAgICAgIE9mZmNhbnZhcyA9IHtcblxuICAgICAgICBzaG93OiBmdW5jdGlvbihlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGVsZW1lbnQgPSBVSS4kKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciAkYm9keSAgICAgPSBVSS4kKCdib2R5JyksXG4gICAgICAgICAgICAgICAgYmFyICAgICAgID0gZWxlbWVudC5maW5kKFwiLnVrLW9mZmNhbnZhcy1iYXI6Zmlyc3RcIiksXG4gICAgICAgICAgICAgICAgcnRsICAgICAgID0gKFVJLmxhbmdkaXJlY3Rpb24gPT0gXCJyaWdodFwiKSxcbiAgICAgICAgICAgICAgICBmbGlwICAgICAgPSBiYXIuaGFzQ2xhc3MoXCJ1ay1vZmZjYW52YXMtYmFyLWZsaXBcIikgPyAtMToxLFxuICAgICAgICAgICAgICAgIGRpciAgICAgICA9IGZsaXAgKiAocnRsID8gLTEgOiAxKSxcblxuICAgICAgICAgICAgICAgIHNjcm9sbGJhcndpZHRoID0gIHdpbmRvdy5pbm5lcldpZHRoIC0gJGJvZHkud2lkdGgoKTtcblxuICAgICAgICAgICAgc2Nyb2xscG9zID0ge3g6IHdpbmRvdy5wYWdlWE9mZnNldCwgeTogd2luZG93LnBhZ2VZT2Zmc2V0fTtcblxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhcInVrLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgJGJvZHkuY3NzKHtcIndpZHRoXCI6IHdpbmRvdy5pbm5lcldpZHRoIC0gc2Nyb2xsYmFyd2lkdGgsIFwiaGVpZ2h0XCI6IHdpbmRvdy5pbm5lckhlaWdodH0pLmFkZENsYXNzKFwidWstb2ZmY2FudmFzLXBhZ2VcIik7XG4gICAgICAgICAgICAkYm9keS5jc3MoKHJ0bCA/IFwibWFyZ2luLXJpZ2h0XCIgOiBcIm1hcmdpbi1sZWZ0XCIpLCAocnRsID8gLTEgOiAxKSAqIChiYXIub3V0ZXJXaWR0aCgpICogZGlyKSkud2lkdGgoKTsgLy8gLndpZHRoKCkgLSBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgJGh0bWwuY3NzKCdtYXJnaW4tdG9wJywgc2Nyb2xscG9zLnkgKiAtMSk7XG5cbiAgICAgICAgICAgIGJhci5hZGRDbGFzcyhcInVrLW9mZmNhbnZhcy1iYXItc2hvd1wiKTtcblxuICAgICAgICAgICAgdGhpcy5faW5pdEVsZW1lbnQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGJhci50cmlnZ2VyKCdzaG93LnVrLm9mZmNhbnZhcycsIFtlbGVtZW50LCBiYXJdKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbihmb3JjZSkge1xuXG4gICAgICAgICAgICB2YXIgJGJvZHkgPSBVSS4kKCdib2R5JyksXG4gICAgICAgICAgICAgICAgcGFuZWwgPSBVSS4kKFwiLnVrLW9mZmNhbnZhcy51ay1hY3RpdmVcIiksXG4gICAgICAgICAgICAgICAgcnRsICAgPSAoVUkubGFuZ2RpcmVjdGlvbiA9PSBcInJpZ2h0XCIpLFxuICAgICAgICAgICAgICAgIGJhciAgID0gcGFuZWwuZmluZChcIi51ay1vZmZjYW52YXMtYmFyOmZpcnN0XCIpLFxuICAgICAgICAgICAgICAgIGZpbmFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKFwidWstb2ZmY2FudmFzLXBhZ2VcIikuY3NzKHtcIndpZHRoXCI6IFwiXCIsIFwiaGVpZ2h0XCI6IFwiXCIsIFwibWFyZ2luLWxlZnRcIjogXCJcIiwgXCJtYXJnaW4tcmlnaHRcIjogXCJcIn0pO1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5yZW1vdmVDbGFzcyhcInVrLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBiYXIucmVtb3ZlQ2xhc3MoXCJ1ay1vZmZjYW52YXMtYmFyLXNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgICRodG1sLmNzcygnbWFyZ2luLXRvcCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHNjcm9sbHBvcy54LCBzY3JvbGxwb3MueSk7XG4gICAgICAgICAgICAgICAgICAgIGJhci50cmlnZ2VyKCdoaWRlLnVrLm9mZmNhbnZhcycsIFtwYW5lbCwgYmFyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICghcGFuZWwubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChVSS5zdXBwb3J0LnRyYW5zaXRpb24gJiYgIWZvcmNlKSB7XG5cbiAgICAgICAgICAgICAgICAkYm9keS5vbmUoVUkuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsaXplKCk7XG4gICAgICAgICAgICAgICAgfSkuY3NzKChydGwgPyBcIm1hcmdpbi1yaWdodFwiIDogXCJtYXJnaW4tbGVmdFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGJhci5yZW1vdmVDbGFzcyhcInVrLW9mZmNhbnZhcy1iYXItc2hvd1wiKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9pbml0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhKFwiT2ZmY2FudmFzSW5pdFwiKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBlbGVtZW50Lm9uKFwiY2xpY2sudWsub2ZmY2FudmFzIHN3aXBlUmlnaHQudWsub2ZmY2FudmFzIHN3aXBlTGVmdC51ay5vZmZjYW52YXNcIiwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IFVJLiQoZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlLnR5cGUubWF0Y2goL3N3aXBlLykpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5oYXNDbGFzcyhcInVrLW9mZmNhbnZhcy1jbG9zZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNDbGFzcyhcInVrLW9mZmNhbnZhcy1iYXJcIikpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQucGFyZW50cyhcIi51ay1vZmZjYW52YXMtYmFyOmZpcnN0XCIpLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBPZmZjYW52YXMuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQub24oXCJjbGlja1wiLCBcImFbaHJlZio9JyMnXVwiLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgICAgIHZhciBsaW5rID0gVUkuJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGxpbmsuYXR0cihcImhyZWZcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHJlZiA9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgVUkuJGRvYy5vbmUoJ2hpZGUudWsub2ZmY2FudmFzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gVUkuJChsaW5rWzBdLmhhc2gpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBVSS4kKCdbbmFtZT1cIicrbGlua1swXS5oYXNoLnJlcGxhY2UoJyMnLCcnKSsnXCJdJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lmxlbmd0aCAmJiBVSS5VdGlscy5zY3JvbGxUb0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLlV0aWxzLnNjcm9sbFRvRWxlbWVudCh0YXJnZXQsIFVJLlV0aWxzLm9wdGlvbnMobGluay5hdHRyKCdkYXRhLXVrLXNtb290aC1zY3JvbGwnKSB8fCAne30nKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhyZWY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIE9mZmNhbnZhcy5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxlbWVudC5kYXRhKFwiT2ZmY2FudmFzSW5pdFwiLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBVSS5jb21wb25lbnQoJ29mZmNhbnZhc1RyaWdnZXInLCB7XG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgJGh0bWwub24oXCJjbGljay5vZmZjYW52YXMudWlraXRcIiwgXCJbZGF0YS11ay1vZmZjYW52YXNdXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcIm9mZmNhbnZhc1RyaWdnZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IFVJLm9mZmNhbnZhc1RyaWdnZXIoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1vZmZjYW52YXNcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0bWwub24oJ2tleWRvd24udWsub2ZmY2FudmFzJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHsgLy8gRVNDXG4gICAgICAgICAgICAgICAgICAgIE9mZmNhbnZhcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IFVJLiQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBcInRhcmdldFwiOiAkdGhpcy5lbGVtZW50LmlzKFwiYVwiKSA/ICR0aGlzLmVsZW1lbnQuYXR0cihcImhyZWZcIikgOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgT2ZmY2FudmFzLnNob3coJHRoaXMub3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFVJLm9mZmNhbnZhcyA9IE9mZmNhbnZhcztcblxufSkoVUlraXQpO1xuIl19