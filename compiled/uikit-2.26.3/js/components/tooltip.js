"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {
    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-tooltip", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var $tooltip, // tooltip container
    tooltipdelay, checkdelay;

    UI.component('tooltip', {

        defaults: {
            "offset": 5,
            "pos": "top",
            "animation": false,
            "delay": 0, // in miliseconds
            "cls": "",
            "activeClass": "uk-active",
            "src": function src(ele) {
                var title = ele.attr('title');

                if (title !== undefined) {
                    ele.data('cached-title', title).removeAttr('title');
                }

                return ele.data("cached-title");
            }
        },

        tip: "",

        boot: function boot() {

            // init code
            UI.$html.on("mouseenter.tooltip.uikit focus.tooltip.uikit", "[data-uk-tooltip]", function (e) {
                var ele = UI.$(this);

                if (!ele.data("tooltip")) {
                    UI.tooltip(ele, UI.Utils.options(ele.attr("data-uk-tooltip")));
                    ele.trigger("mouseenter");
                }
            });
        },

        init: function init() {

            var $this = this;

            if (!$tooltip) {
                $tooltip = UI.$('<div class="uk-tooltip"></div>').appendTo("body");
            }

            this.on({
                focus: function focus(e) {
                    $this.show();
                },
                blur: function blur(e) {
                    $this.hide();
                },
                mouseenter: function mouseenter(e) {
                    $this.show();
                },
                mouseleave: function mouseleave(e) {
                    $this.hide();
                }
            });
        },

        show: function show() {

            this.tip = typeof this.options.src === "function" ? this.options.src(this.element) : this.options.src;

            if (tooltipdelay) clearTimeout(tooltipdelay);
            if (checkdelay) clearTimeout(checkdelay);

            if (typeof this.tip === 'string' ? !this.tip.length : true) return;

            $tooltip.stop().css({ "top": -2000, "visibility": "hidden" }).removeClass(this.options.activeClass).show();
            $tooltip.html('<div class="uk-tooltip-inner">' + this.tip + '</div>');

            var $this = this,
                pos = UI.$.extend({}, this.element.offset(), { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight }),
                width = $tooltip[0].offsetWidth,
                height = $tooltip[0].offsetHeight,
                offset = typeof this.options.offset === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position = typeof this.options.pos === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tmppos = position.split("-"),
                tcss = {
                "display": "none",
                "visibility": "visible",
                "top": pos.top + pos.height + height,
                "left": pos.left
            };

            // prevent strange position
            // when tooltip is in offcanvas etc.
            if (UI.$html.css('position') == 'fixed' || UI.$body.css('position') == 'fixed') {
                var bodyoffset = UI.$('body').offset(),
                    htmloffset = UI.$('html').offset(),
                    docoffset = { 'top': htmloffset.top + bodyoffset.top, 'left': htmloffset.left + bodyoffset.left };

                pos.left -= docoffset.left;
                pos.top -= docoffset.top;
            }

            if ((tmppos[0] == "left" || tmppos[0] == "right") && UI.langdirection == 'right') {
                tmppos[0] = tmppos[0] == "left" ? "right" : "left";
            }

            var variants = {
                "bottom": { top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2 },
                "top": { top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2 },
                "left": { top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset },
                "right": { top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset }
            };

            UI.$.extend(tcss, variants[tmppos[0]]);

            if (tmppos.length == 2) tcss.left = tmppos[1] == 'left' ? pos.left : pos.left + pos.width - width;

            var boundary = this.checkBoundary(tcss.left, tcss.top, width, height);

            if (boundary) {

                switch (boundary) {
                    case "x":

                        if (tmppos.length == 2) {
                            position = tmppos[0] + "-" + (tcss.left < 0 ? "left" : "right");
                        } else {
                            position = tcss.left < 0 ? "right" : "left";
                        }

                        break;

                    case "y":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom" : "top") + "-" + tmppos[1];
                        } else {
                            position = tcss.top < 0 ? "bottom" : "top";
                        }

                        break;

                    case "xy":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom" : "top") + "-" + (tcss.left < 0 ? "left" : "right");
                        } else {
                            position = tcss.left < 0 ? "right" : "left";
                        }

                        break;

                }

                tmppos = position.split("-");

                UI.$.extend(tcss, variants[tmppos[0]]);

                if (tmppos.length == 2) tcss.left = tmppos[1] == 'left' ? pos.left : pos.left + pos.width - width;
            }

            tcss.left -= UI.$body.position().left;

            tooltipdelay = setTimeout(function () {

                $tooltip.css(tcss).attr("class", ["uk-tooltip", "uk-tooltip-" + position, $this.options.cls].join(' '));

                if ($this.options.animation) {
                    $tooltip.css({ opacity: 0, display: 'block' }).addClass($this.options.activeClass).animate({ opacity: 1 }, parseInt($this.options.animation, 10) || 400);
                } else {
                    $tooltip.show().addClass($this.options.activeClass);
                }

                tooltipdelay = false;

                // close tooltip if element was removed or hidden
                checkdelay = setInterval(function () {
                    if (!$this.element.is(':visible')) $this.hide();
                }, 150);
            }, parseInt(this.options.delay, 10) || 0);
        },

        hide: function hide() {
            if (this.element.is("input") && this.element[0] === document.activeElement) return;

            if (tooltipdelay) clearTimeout(tooltipdelay);
            if (checkdelay) clearTimeout(checkdelay);

            $tooltip.stop();

            if (this.options.animation) {

                var $this = this;

                $tooltip.fadeOut(parseInt(this.options.animation, 10) || 400, function () {
                    $tooltip.removeClass($this.options.activeClass);
                });
            } else {
                $tooltip.hide().removeClass(this.options.activeClass);
            }
        },

        content: function content() {
            return this.tip;
        },

        checkBoundary: function checkBoundary(left, top, width, height) {

            var axis = "";

            if (left < 0 || left - UI.$win.scrollLeft() + width > window.innerWidth) {
                axis += "x";
            }

            if (top < 0 || top - UI.$win.scrollTop() + height > window.innerHeight) {
                axis += "y";
            }

            return axis;
        }
    });

    return UI.tooltip;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7QUFDYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxlQUFQLEVBQXdCLENBQUMsT0FBRCxDQUF4QixFQUFtQyxZQUFVO0FBQ3pDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FiRCxFQWFHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksUUFBSixFO0FBQ0ksZ0JBREosRUFDa0IsVUFEbEI7O0FBR0EsT0FBRyxTQUFILENBQWEsU0FBYixFQUF3Qjs7QUFFcEIsa0JBQVU7QUFDTixzQkFBVSxDQURKO0FBRU4sbUJBQU8sS0FGRDtBQUdOLHlCQUFhLEtBSFA7QUFJTixxQkFBUyxDQUpILEU7QUFLTixtQkFBTyxFQUxEO0FBTU4sMkJBQWUsV0FOVDtBQU9OLG1CQUFPLGFBQVMsR0FBVCxFQUFjO0FBQ2pCLG9CQUFJLFFBQVEsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFaOztBQUVBLG9CQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUNyQix3QkFBSSxJQUFKLENBQVMsY0FBVCxFQUF5QixLQUF6QixFQUFnQyxVQUFoQyxDQUEyQyxPQUEzQztBQUNIOztBQUVELHVCQUFPLElBQUksSUFBSixDQUFTLGNBQVQsQ0FBUDtBQUNIO0FBZkssU0FGVTs7QUFvQnBCLGFBQUssRUFwQmU7O0FBc0JwQixjQUFNLGdCQUFXOzs7QUFHYixlQUFHLEtBQUgsQ0FBUyxFQUFULENBQVksOENBQVosRUFBNEQsbUJBQTVELEVBQWlGLFVBQVMsQ0FBVCxFQUFZ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LEdBQWdCLFdBQWhCLENBQTRCLEtBQUssT0FBTCxDQUFhLFdBQXpDO0FBQ0g7QUFDSixTQTdMbUI7O0FBK0xwQixpQkFBUyxtQkFBVztBQUNoQixtQkFBTyxLQUFLLEdBQVo7QUFDSCxTQWpNbUI7O0FBbU1wQix1QkFBZSx1QkFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQzs7QUFFOUMsZ0JBQUksT0FBTyxFQUFYOztBQUVBLGdCQUFHLE9BQU8sQ0FBUCxJQUFjLE9BQU8sR0FBRyxJQUFILENBQVEsVUFBUixFQUFSLEdBQThCLEtBQS9CLEdBQXdDLE9BQU8sVUFBOUQsRUFBMEU7QUFDdkUsd0JBQVEsR0FBUjtBQUNGOztBQUVELGdCQUFHLE1BQU0sQ0FBTixJQUFhLE1BQU0sR0FBRyxJQUFILENBQVEsU0FBUixFQUFQLEdBQTRCLE1BQTdCLEdBQXVDLE9BQU8sV0FBNUQsRUFBeUU7QUFDdEUsd0JBQVEsR0FBUjtBQUNGOztBQUVELG1CQUFPLElBQVA7QUFDSDtBQWhObUIsS0FBeEI7O0FBbU5BLFdBQU8sR0FBRyxPQUFWO0FBQ0gsQ0F4T0QiLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC10b29sdGlwXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgJHRvb2x0aXAsICAgLy8gdG9vbHRpcCBjb250YWluZXJcbiAgICAgICAgdG9vbHRpcGRlbGF5LCBjaGVja2RlbGF5O1xuXG4gICAgVUkuY29tcG9uZW50KCd0b29sdGlwJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBcIm9mZnNldFwiOiA1LFxuICAgICAgICAgICAgXCJwb3NcIjogXCJ0b3BcIixcbiAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJkZWxheVwiOiAwLCAvLyBpbiBtaWxpc2Vjb25kc1xuICAgICAgICAgICAgXCJjbHNcIjogXCJcIixcbiAgICAgICAgICAgIFwiYWN0aXZlQ2xhc3NcIjogXCJ1ay1hY3RpdmVcIixcbiAgICAgICAgICAgIFwic3JjXCI6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IGVsZS5hdHRyKCd0aXRsZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlLmRhdGEoJ2NhY2hlZC10aXRsZScsIHRpdGxlKS5yZW1vdmVBdHRyKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBlbGUuZGF0YShcImNhY2hlZC10aXRsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0aXA6IFwiXCIsXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkuJGh0bWwub24oXCJtb3VzZWVudGVyLnRvb2x0aXAudWlraXQgZm9jdXMudG9vbHRpcC51aWtpdFwiLCBcIltkYXRhLXVrLXRvb2x0aXBdXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoXCJ0b29sdGlwXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIFVJLnRvb2x0aXAoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay10b29sdGlwXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS50cmlnZ2VyKFwibW91c2VlbnRlclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKCEkdG9vbHRpcCkge1xuICAgICAgICAgICAgICAgICR0b29sdGlwID0gVUkuJCgnPGRpdiBjbGFzcz1cInVrLXRvb2x0aXBcIj48L2Rpdj4nKS5hcHBlbmRUbyhcImJvZHlcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub24oe1xuICAgICAgICAgICAgICAgIGZvY3VzICAgICAgOiBmdW5jdGlvbihlKSB7ICR0aGlzLnNob3coKTsgfSxcbiAgICAgICAgICAgICAgICBibHVyICAgICAgIDogZnVuY3Rpb24oZSkgeyAkdGhpcy5oaWRlKCk7IH0sXG4gICAgICAgICAgICAgICAgbW91c2VlbnRlciA6IGZ1bmN0aW9uKGUpIHsgJHRoaXMuc2hvdygpOyB9LFxuICAgICAgICAgICAgICAgIG1vdXNlbGVhdmUgOiBmdW5jdGlvbihlKSB7ICR0aGlzLmhpZGUoKTsgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMudGlwID0gdHlwZW9mKHRoaXMub3B0aW9ucy5zcmMpID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzLm9wdGlvbnMuc3JjKHRoaXMuZWxlbWVudCkgOiB0aGlzLm9wdGlvbnMuc3JjO1xuXG4gICAgICAgICAgICBpZiAodG9vbHRpcGRlbGF5KSAgICAgY2xlYXJUaW1lb3V0KHRvb2x0aXBkZWxheSk7XG4gICAgICAgICAgICBpZiAoY2hlY2tkZWxheSkgICAgICAgY2xlYXJUaW1lb3V0KGNoZWNrZGVsYXkpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKHRoaXMudGlwKSA9PT0gJ3N0cmluZycgPyAhdGhpcy50aXAubGVuZ3RoOnRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgJHRvb2x0aXAuc3RvcCgpLmNzcyh7XCJ0b3BcIjogLTIwMDAsIFwidmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSkucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzKS5zaG93KCk7XG4gICAgICAgICAgICAkdG9vbHRpcC5odG1sKCc8ZGl2IGNsYXNzPVwidWstdG9vbHRpcC1pbm5lclwiPicgKyB0aGlzLnRpcCArICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgdmFyICR0aGlzICAgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHBvcyAgICAgICAgPSBVSS4kLmV4dGVuZCh7fSwgdGhpcy5lbGVtZW50Lm9mZnNldCgpLCB7d2lkdGg6IHRoaXMuZWxlbWVudFswXS5vZmZzZXRXaWR0aCwgaGVpZ2h0OiB0aGlzLmVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0fSksXG4gICAgICAgICAgICAgICAgd2lkdGggICAgICA9ICR0b29sdGlwWzBdLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCAgICAgPSAkdG9vbHRpcFswXS5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICAgICA9IHR5cGVvZih0aGlzLm9wdGlvbnMub2Zmc2V0KSA9PT0gXCJmdW5jdGlvblwiID8gdGhpcy5vcHRpb25zLm9mZnNldC5jYWxsKHRoaXMuZWxlbWVudCkgOiB0aGlzLm9wdGlvbnMub2Zmc2V0LFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uICAgPSB0eXBlb2YodGhpcy5vcHRpb25zLnBvcykgPT09IFwiZnVuY3Rpb25cIiA/IHRoaXMub3B0aW9ucy5wb3MuY2FsbCh0aGlzLmVsZW1lbnQpIDogdGhpcy5vcHRpb25zLnBvcyxcbiAgICAgICAgICAgICAgICB0bXBwb3MgICAgID0gcG9zaXRpb24uc3BsaXQoXCItXCIpLFxuICAgICAgICAgICAgICAgIHRjc3MgICAgICAgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiICAgIDogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiIDogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9wXCIgICAgICAgIDogKHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgaGVpZ2h0KSxcbiAgICAgICAgICAgICAgICAgICAgXCJsZWZ0XCIgICAgICAgOiBwb3MubGVmdFxuICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgLy8gcHJldmVudCBzdHJhbmdlIHBvc2l0aW9uXG4gICAgICAgICAgICAvLyB3aGVuIHRvb2x0aXAgaXMgaW4gb2ZmY2FudmFzIGV0Yy5cbiAgICAgICAgICAgIGlmIChVSS4kaHRtbC5jc3MoJ3Bvc2l0aW9uJyk9PSdmaXhlZCcgfHwgVUkuJGJvZHkuY3NzKCdwb3NpdGlvbicpPT0nZml4ZWQnKXtcbiAgICAgICAgICAgICAgICB2YXIgYm9keW9mZnNldCA9IFVJLiQoJ2JvZHknKS5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgaHRtbG9mZnNldCA9IFVJLiQoJ2h0bWwnKS5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgZG9jb2Zmc2V0ICA9IHsndG9wJzogKGh0bWxvZmZzZXQudG9wICsgYm9keW9mZnNldC50b3ApLCAnbGVmdCc6IChodG1sb2Zmc2V0LmxlZnQgKyBib2R5b2Zmc2V0LmxlZnQpfTtcblxuICAgICAgICAgICAgICAgIHBvcy5sZWZ0IC09IGRvY29mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgIHBvcy50b3AgIC09IGRvY29mZnNldC50b3A7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKCh0bXBwb3NbMF0gPT0gXCJsZWZ0XCIgfHwgdG1wcG9zWzBdID09IFwicmlnaHRcIikgJiYgVUkubGFuZ2RpcmVjdGlvbiA9PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgdG1wcG9zWzBdID0gdG1wcG9zWzBdID09IFwibGVmdFwiID8gXCJyaWdodFwiIDogXCJsZWZ0XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YXJpYW50cyA9ICB7XG4gICAgICAgICAgICAgICAgXCJib3R0b21cIiAgOiB7dG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCArIG9mZnNldCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gd2lkdGggLyAyfSxcbiAgICAgICAgICAgICAgICBcInRvcFwiICAgICA6IHt0b3A6IHBvcy50b3AgLSBoZWlnaHQgLSBvZmZzZXQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIHdpZHRoIC8gMn0sXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCIgICAgOiB7dG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBoZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIHdpZHRoIC0gb2Zmc2V0fSxcbiAgICAgICAgICAgICAgICBcInJpZ2h0XCIgICA6IHt0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoICsgb2Zmc2V0fVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVUkuJC5leHRlbmQodGNzcywgdmFyaWFudHNbdG1wcG9zWzBdXSk7XG5cbiAgICAgICAgICAgIGlmICh0bXBwb3MubGVuZ3RoID09IDIpIHRjc3MubGVmdCA9ICh0bXBwb3NbMV0gPT0gJ2xlZnQnKSA/IChwb3MubGVmdCkgOiAoKHBvcy5sZWZ0ICsgcG9zLndpZHRoKSAtIHdpZHRoKTtcblxuICAgICAgICAgICAgdmFyIGJvdW5kYXJ5ID0gdGhpcy5jaGVja0JvdW5kYXJ5KHRjc3MubGVmdCwgdGNzcy50b3AsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICBpZihib3VuZGFyeSkge1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoKGJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ4XCI6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0bXBwb3MubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRtcHBvc1swXStcIi1cIisodGNzcy5sZWZ0IDwgMCA/IFwibGVmdFwiOiBcInJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRjc3MubGVmdCA8IDAgPyBcInJpZ2h0XCI6IFwibGVmdFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcHBvcy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gKHRjc3MudG9wIDwgMCA/IFwiYm90dG9tXCI6IFwidG9wXCIpK1wiLVwiK3RtcHBvc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSAodGNzcy50b3AgPCAwID8gXCJib3R0b21cIjogXCJ0b3BcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ4eVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcHBvcy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gKHRjc3MudG9wIDwgMCA/IFwiYm90dG9tXCI6IFwidG9wXCIpK1wiLVwiKyh0Y3NzLmxlZnQgPCAwID8gXCJsZWZ0XCI6IFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGNzcy5sZWZ0IDwgMCA/IFwicmlnaHRcIjogXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG1wcG9zID0gcG9zaXRpb24uc3BsaXQoXCItXCIpO1xuXG4gICAgICAgICAgICAgICAgVUkuJC5leHRlbmQodGNzcywgdmFyaWFudHNbdG1wcG9zWzBdXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodG1wcG9zLmxlbmd0aCA9PSAyKSB0Y3NzLmxlZnQgPSAodG1wcG9zWzFdID09ICdsZWZ0JykgPyAocG9zLmxlZnQpIDogKChwb3MubGVmdCArIHBvcy53aWR0aCkgLSB3aWR0aCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGNzcy5sZWZ0IC09IFVJLiRib2R5LnBvc2l0aW9uKCkubGVmdDtcblxuICAgICAgICAgICAgdG9vbHRpcGRlbGF5ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJHRvb2x0aXAuY3NzKHRjc3MpLmF0dHIoXCJjbGFzc1wiLCBbXCJ1ay10b29sdGlwXCIsIFwidWstdG9vbHRpcC1cIitwb3NpdGlvbiwgJHRoaXMub3B0aW9ucy5jbHNdLmpvaW4oJyAnKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMub3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgJHRvb2x0aXAuY3NzKHtvcGFjaXR5OiAwLCBkaXNwbGF5OiAnYmxvY2snfSkuYWRkQ2xhc3MoJHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIHBhcnNlSW50KCR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uLCAxMCkgfHwgNDAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdG9vbHRpcC5zaG93KCkuYWRkQ2xhc3MoJHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9vbHRpcGRlbGF5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSB0b29sdGlwIGlmIGVsZW1lbnQgd2FzIHJlbW92ZWQgb3IgaGlkZGVuXG4gICAgICAgICAgICAgICAgY2hlY2tkZWxheSA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCEkdGhpcy5lbGVtZW50LmlzKCc6dmlzaWJsZScpKSAkdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSwgMTUwKTtcblxuICAgICAgICAgICAgfSwgcGFyc2VJbnQodGhpcy5vcHRpb25zLmRlbGF5LCAxMCkgfHwgMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZih0aGlzLmVsZW1lbnQuaXMoXCJpbnB1dFwiKSAmJiB0aGlzLmVsZW1lbnRbMF09PT1kb2N1bWVudC5hY3RpdmVFbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmKHRvb2x0aXBkZWxheSkgY2xlYXJUaW1lb3V0KHRvb2x0aXBkZWxheSk7XG4gICAgICAgICAgICBpZiAoY2hlY2tkZWxheSkgIGNsZWFyVGltZW91dChjaGVja2RlbGF5KTtcblxuICAgICAgICAgICAgJHRvb2x0aXAuc3RvcCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgICR0b29sdGlwLmZhZGVPdXQocGFyc2VJbnQodGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgMTApIHx8IDQwMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcylcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdG9vbHRpcC5oaWRlKCkucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjb250ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRpcDtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGVja0JvdW5kYXJ5OiBmdW5jdGlvbihsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgICAgICAgICAgdmFyIGF4aXMgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZihsZWZ0IDwgMCB8fCAoKGxlZnQgLSBVSS4kd2luLnNjcm9sbExlZnQoKSkrd2lkdGgpID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgIGF4aXMgKz0gXCJ4XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRvcCA8IDAgfHwgKCh0b3AgLSBVSS4kd2luLnNjcm9sbFRvcCgpKStoZWlnaHQpID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICBheGlzICs9IFwieVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFVJLnRvb2x0aXA7XG59KTtcbiJdfQ==