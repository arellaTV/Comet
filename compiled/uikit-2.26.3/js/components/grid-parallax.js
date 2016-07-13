"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-grid-parallax", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    var parallaxes = [],
        checkParallaxes = function checkParallaxes() {

        requestAnimationFrame(function () {
            for (var i = 0; i < parallaxes.length; i++) {
                parallaxes[i].process();
            }
        });
    };

    UI.component('gridparallax', {

        defaults: {
            target: false,
            smooth: 150,
            translate: 150
        },

        boot: function boot() {

            // listen to scroll and resize
            UI.$doc.on("scrolling.uk.document", checkParallaxes);
            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function () {
                checkParallaxes();
            }, 50));

            // init code
            UI.ready(function (context) {

                UI.$('[data-uk-grid-parallax]', context).each(function () {

                    var parallax = UI.$(this);

                    if (!parallax.data("gridparallax")) {
                        UI.gridparallax(parallax, UI.Utils.options(parallax.attr("data-uk-grid-parallax")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.initItems().process();
            parallaxes.push(this);

            UI.$win.on('load resize orientationchange', function () {

                var fn = function fn() {
                    var columns = getcolumns($this.element);

                    $this.element.css('margin-bottom', '');

                    if (columns > 1) {
                        $this.element.css('margin-bottom', $this.options.translate + parseInt($this.element.css('margin-bottom')));
                    }
                };

                UI.$(function () {
                    fn();
                });

                return UI.Utils.debounce(fn, 50);
            }());
        },

        initItems: function initItems() {

            var smooth = this.options.smooth;

            this.items = (this.options.target ? this.element.find(this.options.target) : this.element.children()).each(function () {
                UI.$(this).css({
                    transition: 'transform ' + smooth + 'ms linear',
                    transform: ''
                });
            });

            return this;
        },

        process: function process() {

            var percent = percentageInViewport(this.element),
                columns = getcolumns(this.element),
                items = this.items,
                mods = [columns - 1];

            if (columns == 1 || !percent) {
                items.css('transform', '');
                return;
            }

            while (mods.length < columns) {
                if (!(mods[mods.length - 1] - 2)) break;
                mods.push(mods[mods.length - 1] - 2);
            }

            var translate = this.options.translate,
                percenttranslate = percent * translate;

            items.each(function (idx, ele, translate) {
                translate = mods.indexOf((idx + 1) % columns) != -1 ? percenttranslate : percenttranslate / 8;
                UI.$(this).css('transform', 'translate3d(0,' + translate + 'px, 0)');
            });
        }

    });

    function getcolumns(element) {

        var children = element.children(),
            first = children.filter(':visible:first'),
            top = first[0].offsetTop + first.outerHeight();

        for (var column = 0; column < children.length; column++) {
            if (children[column].offsetTop >= top) break;
        }

        return column || 1;
    }

    function percentageInViewport(element) {

        var top = element.offset().top,
            height = element.outerHeight(),
            scrolltop = UIkit.$win.scrollTop(),
            wh = window.innerHeight,
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

            if (top < wh) {
                percent = percent * scrolltop / (top + height - wh);
            }
        }

        return percent > 1 ? 1 : percent;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2dyaWQtcGFyYWxsYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8scUJBQVAsRUFBOEIsQ0FBQyxPQUFELENBQTlCLEVBQXlDLFlBQVU7QUFDL0MsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVgsUUFBSSxhQUFjLEVBQWxCO0FBQUEsUUFBc0Isa0JBQWtCLFNBQWxCLGVBQWtCLEdBQVc7O0FBRTNDLDhCQUFzQixZQUFVO0FBQzVCLGlCQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBSSxXQUFXLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3RDLDJCQUFXLENBQVgsRUFBYyxPQUFkO0FBQ0g7QUFDSixTQUpEO0FBS0gsS0FQTDs7QUFVQSxPQUFHLFNBQUgsQ0FBYSxjQUFiLEVBQTZCOztBQUV6QixrQkFBVTtBQUNOLG9CQUFXLEtBREw7QUFFTixvQkFBVyxHQUZMO0FBR04sdUJBQWdCO0FBSFYsU0FGZTs7QUFRekIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxJQUFILENBQVEsRUFBUixDQUFXLHVCQUFYLEVBQW9DLGVBQXBDO0FBQ0EsZUFBRyxJQUFILENBQVEsRUFBUixDQUFXLCtCQUFYLEVBQTRDLEdBQUcsS0FBSCxDQUFTLFFBQVQsQ0FBa0IsWUFBVTtBQUNwRTtBQUNILGFBRjJDLEVBRXpDLEVBRnlDLENBQTVDOzs7QUFLQSxlQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7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QUFZLEVBQVosR0FBaUIsU0FBakIsR0FBNkIsWUFBWSxFQUExQyxLQUFpRCxNQUFJLE1BQXJELENBQVY7QUFDSCxhQUZELE1BRU87O0FBRUgsMkJBQWMsWUFBWSxFQUFiLEdBQW1CLEdBQWhDO0FBQ0EsNkJBQWEsS0FBSyxLQUFMLENBQVcsWUFBWSxDQUFDLEtBQUssTUFBTixJQUFnQixHQUE1QixDQUFYLENBQWI7QUFDQSwwQkFBYSxhQUFXLEdBQXhCO0FBQ0g7O0FBRUQsZ0JBQUksTUFBTSxFQUFWLEVBQWM7QUFDViwwQkFBVSxVQUFVLFNBQVYsSUFBd0IsTUFBTSxNQUFQLEdBQWlCLEVBQXhDLENBQVY7QUFDSDtBQUNKOztBQUVELGVBQU8sVUFBVSxDQUFWLEdBQWMsQ0FBZCxHQUFnQixPQUF2QjtBQUNIO0FBQ0osQ0F0S0QiLCJmaWxlIjoiZ3JpZC1wYXJhbGxheC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LWdyaWQtcGFyYWxsYXhcIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSl7XG5cbiAgICB2YXIgcGFyYWxsYXhlcyAgPSBbXSwgY2hlY2tQYXJhbGxheGVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHBhcmFsbGF4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYWxsYXhlc1tpXS5wcm9jZXNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgIFVJLmNvbXBvbmVudCgnZ3JpZHBhcmFsbGF4Jywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICB0YXJnZXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgc21vb3RoICAgOiAxNTAsXG4gICAgICAgICAgICB0cmFuc2xhdGUgICAgIDogMTUwXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGxpc3RlbiB0byBzY3JvbGwgYW5kIHJlc2l6ZVxuICAgICAgICAgICAgVUkuJGRvYy5vbihcInNjcm9sbGluZy51ay5kb2N1bWVudFwiLCBjaGVja1BhcmFsbGF4ZXMpO1xuICAgICAgICAgICAgVUkuJHdpbi5vbihcImxvYWQgcmVzaXplIG9yaWVudGF0aW9uY2hhbmdlXCIsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY2hlY2tQYXJhbGxheGVzKCk7XG4gICAgICAgICAgICB9LCA1MCkpO1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoJ1tkYXRhLXVrLWdyaWQtcGFyYWxsYXhdJywgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYWxsYXggPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFyYWxsYXguZGF0YShcImdyaWRwYXJhbGxheFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuZ3JpZHBhcmFsbGF4KHBhcmFsbGF4LCBVSS5VdGlscy5vcHRpb25zKHBhcmFsbGF4LmF0dHIoXCJkYXRhLXVrLWdyaWQtcGFyYWxsYXhcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdEl0ZW1zKCkucHJvY2VzcygpO1xuICAgICAgICAgICAgcGFyYWxsYXhlcy5wdXNoKHRoaXMpO1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdsb2FkIHJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sdW1ucyAgPSBnZXRjb2x1bW5zKCR0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuY3NzKCdtYXJnaW4tYm90dG9tJywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5zID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5jc3MoJ21hcmdpbi1ib3R0b20nLCAkdGhpcy5vcHRpb25zLnRyYW5zbGF0ZSArIHBhcnNlSW50KCR0aGlzLmVsZW1lbnQuY3NzKCdtYXJnaW4tYm90dG9tJykpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBVSS4kKGZ1bmN0aW9uKCkgeyBmbigpOyB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBVSS5VdGlscy5kZWJvdW5jZShmbiwgNTApO1xuICAgICAgICAgICAgfSkoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEl0ZW1zOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIHNtb290aCA9IHRoaXMub3B0aW9ucy5zbW9vdGg7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSAodGhpcy5vcHRpb25zLnRhcmdldCA/IHRoaXMuZWxlbWVudC5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpIDogdGhpcy5lbGVtZW50LmNoaWxkcmVuKCkpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBVSS4kKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gJytzbW9vdGgrJ21zIGxpbmVhcicsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIHBlcmNlbnQgID0gcGVyY2VudGFnZUluVmlld3BvcnQodGhpcy5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zICA9IGdldGNvbHVtbnModGhpcy5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICBpdGVtcyAgICA9IHRoaXMuaXRlbXMsXG4gICAgICAgICAgICAgICAgbW9kcyAgICAgPSBbKGNvbHVtbnMtMSldO1xuXG4gICAgICAgICAgICBpZiAoY29sdW1ucyA9PSAxIHx8ICFwZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgaXRlbXMuY3NzKCd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZShtb2RzLmxlbmd0aCA8IGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgIGlmKCEobW9kc1ttb2RzLmxlbmd0aC0xXSAtIDIpKSBicmVhaztcbiAgICAgICAgICAgICAgIG1vZHMucHVzaChtb2RzW21vZHMubGVuZ3RoLTFdIC0gMik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgID0gdGhpcy5vcHRpb25zLnRyYW5zbGF0ZSwgcGVyY2VudHRyYW5zbGF0ZSA9IHBlcmNlbnQgKiB0cmFuc2xhdGU7XG5cbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oaWR4LCBlbGUsIHRyYW5zbGF0ZSl7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlID0gbW9kcy5pbmRleE9mKChpZHgrMSkgJSBjb2x1bW5zKSAhPSAtMSA/IHBlcmNlbnR0cmFuc2xhdGUgOiBwZXJjZW50dHJhbnNsYXRlIC8gODtcbiAgICAgICAgICAgICAgICBVSS4kKHRoaXMpLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDAsJysodHJhbnNsYXRlKSsncHgsIDApJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIGdldGNvbHVtbnMoZWxlbWVudCkge1xuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGRyZW4oKSxcbiAgICAgICAgICAgIGZpcnN0ICAgID0gY2hpbGRyZW4uZmlsdGVyKCc6dmlzaWJsZTpmaXJzdCcpLFxuICAgICAgICAgICAgdG9wICAgICAgPSBmaXJzdFswXS5vZmZzZXRUb3AgKyBmaXJzdC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgIGZvciAodmFyIGNvbHVtbj0wO2NvbHVtbjxjaGlsZHJlbi5sZW5ndGg7Y29sdW1uKyspIHtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbltjb2x1bW5dLm9mZnNldFRvcCA+PSB0b3ApICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2x1bW4gfHwgMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZXJjZW50YWdlSW5WaWV3cG9ydChlbGVtZW50KSB7XG5cbiAgICAgICAgdmFyIHRvcCAgICAgICA9IGVsZW1lbnQub2Zmc2V0KCkudG9wLFxuICAgICAgICAgICAgaGVpZ2h0ICAgID0gZWxlbWVudC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgc2Nyb2xsdG9wID0gVUlraXQuJHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIHdoICAgICAgICA9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgIGRpc3RhbmNlLCBwZXJjZW50YWdlLCBwZXJjZW50O1xuXG4gICAgICAgIGlmICh0b3AgPiAoc2Nyb2xsdG9wICsgd2gpKSB7XG4gICAgICAgICAgICBwZXJjZW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICgodG9wICsgaGVpZ2h0KSA8IHNjcm9sbHRvcCkge1xuICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICgodG9wICsgaGVpZ2h0KSA8IHdoKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IChzY3JvbGx0b3AgPCB3aCA/IHNjcm9sbHRvcCA6IHNjcm9sbHRvcCAtIHdoKSAvICh0b3AraGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBkaXN0YW5jZSAgID0gKHNjcm9sbHRvcCArIHdoKSAtIHRvcDtcbiAgICAgICAgICAgICAgICBwZXJjZW50YWdlID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvICgod2ggKyBoZWlnaHQpIC8gMTAwKSk7XG4gICAgICAgICAgICAgICAgcGVyY2VudCAgICA9IHBlcmNlbnRhZ2UvMTAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9wIDwgd2gpIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gcGVyY2VudCAqIHNjcm9sbHRvcCAvICgodG9wICsgaGVpZ2h0KSAtIHdoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwZXJjZW50ID4gMSA/IDE6cGVyY2VudDtcbiAgICB9XG59KTsiXX0=