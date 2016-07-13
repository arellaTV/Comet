"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            "target": false,
            "row": true,
            "ignorestacked": false,
            "observe": false
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-grid-match]", context).each(function () {
                    var grid = UI.$(this),
                        obj;

                    if (!grid.data("gridMatchHeight")) {
                        obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.columns = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            UI.$win.on('load resize orientationchange', function () {

                var fn = function fn() {
                    if ($this.element.is(":visible")) $this.match();
                };

                UI.$(function () {
                    fn();
                });

                return UI.Utils.debounce(fn, 50);
            }());

            if (this.options.observe) {

                UI.domObserve(this.element, function (e) {
                    if ($this.element.is(":visible")) $this.match();
                });
            }

            this.on("display.uk.check", function (e) {
                if (this.element.is(":visible")) this.match();
            }.bind(this));

            grids.push(this);
        },

        match: function match() {

            var firstvisible = this.columns.filter(":visible:first");

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

            if (stacked && !this.options.ignorestacked) {
                this.revert();
            } else {
                UI.Utils.matchHeights(this.elements, this.options);
            }

            return this;
        },

        revert: function revert() {
            this.elements.css('min-height', '');
            return this;
        }
    });

    UI.component('gridMargin', {

        defaults: {
            cls: 'uk-grid-margin',
            rowfirst: 'uk-row-first'
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-grid-margin]", context).each(function () {
                    var grid = UI.$(this),
                        obj;

                    if (!grid.data("gridMargin")) {
                        obj = UI.gridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
                    }
                });
            });
        },

        init: function init() {

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2dyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEVBQVQsRUFBYTs7QUFFVjs7QUFFQSxRQUFJLFFBQVEsRUFBWjs7QUFFQSxPQUFHLFNBQUgsQ0FBYSxpQkFBYixFQUFnQzs7QUFFNUIsa0JBQVU7QUFDTixzQkFBa0IsS0FEWjtBQUVOLG1CQUFrQixJQUZaO0FBR04sNkJBQWtCLEtBSFo7QUFJTix1QkFBa0I7QUFKWixTQUZrQjs7QUFTNUIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUssc0JBQUwsRUFBNkIsT0FBN0IsRUFBc0MsSUFBdEMsQ0FBMkMsWUFBVztBQUNsRCx3QkFBSSxPQUFPLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBWDtBQUFBLHdCQUF1QixHQUF2Qjs7QUFFQSx3QkFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLGlCQUFWLENBQUwsRUFBbUM7QUFDL0IsOEJBQU0sR0FBRyxlQUFILENBQW1CLElBQW5CLEVBQXlCLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsS0FBSyxJQUFMLENBQVUsb0JBQVYsQ0FBakIsQ0FBekIsQ0FBTjtBQUNIO0FBQ0osaUJBTkQ7QUFPSCxhQVREO0FBVUgsU0F0QjJCOztBQXdCNUIsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssT0FBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQWhCO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBTCxDQUFhLE1BQXZCLENBQXRCLEdBQXVELEtBQUssT0FBNUU7O0FBRUEsZ0JBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxNQUFsQixFQUEwQjs7QUFFMUIsZUFBRyxJQUFILENBQVEs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Oi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihVSSkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZ3JpZHMgPSBbXTtcblxuICAgIFVJLmNvbXBvbmVudCgnZ3JpZE1hdGNoSGVpZ2h0Jywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBcInRhcmdldFwiICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgXCJyb3dcIiAgICAgICAgICAgOiB0cnVlLFxuICAgICAgICAgICAgXCJpZ25vcmVzdGFja2VkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwib2JzZXJ2ZVwiICAgICAgIDogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstZ3JpZC1tYXRjaF1cIiwgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyaWQgPSBVSS4kKHRoaXMpLCBvYmo7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncmlkLmRhdGEoXCJncmlkTWF0Y2hIZWlnaHRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IFVJLmdyaWRNYXRjaEhlaWdodChncmlkLCBVSS5VdGlscy5vcHRpb25zKGdyaWQuYXR0cihcImRhdGEtdWstZ3JpZC1tYXRjaFwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb2x1bW5zICA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMub3B0aW9ucy50YXJnZXQgPyB0aGlzLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldCkgOiB0aGlzLmNvbHVtbnM7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5jb2x1bW5zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdsb2FkIHJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKSAkdGhpcy5tYXRjaCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBVSS4kKGZ1bmN0aW9uKCkgeyBmbigpOyB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBVSS5VdGlscy5kZWJvdW5jZShmbiwgNTApO1xuICAgICAgICAgICAgfSkoKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub2JzZXJ2ZSkge1xuXG4gICAgICAgICAgICAgICAgVUkuZG9tT2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSkgJHRoaXMubWF0Y2goKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbihcImRpc3BsYXkudWsuY2hlY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKSB0aGlzLm1hdGNoKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBncmlkcy5wdXNoKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGZpcnN0dmlzaWJsZSA9IHRoaXMuY29sdW1ucy5maWx0ZXIoXCI6dmlzaWJsZTpmaXJzdFwiKTtcblxuICAgICAgICAgICAgaWYgKCFmaXJzdHZpc2libGUubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBzdGFja2VkID0gTWF0aC5jZWlsKDEwMCAqIHBhcnNlRmxvYXQoZmlyc3R2aXNpYmxlLmNzcygnd2lkdGgnKSkgLyBwYXJzZUZsb2F0KGZpcnN0dmlzaWJsZS5wYXJlbnQoKS5jc3MoJ3dpZHRoJykpKSA+PSAxMDA7XG5cbiAgICAgICAgICAgIGlmIChzdGFja2VkICYmICF0aGlzLm9wdGlvbnMuaWdub3Jlc3RhY2tlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmV2ZXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFVJLlV0aWxzLm1hdGNoSGVpZ2h0cyh0aGlzLmVsZW1lbnRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXZlcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgVUkuY29tcG9uZW50KCdncmlkTWFyZ2luJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBjbHMgICAgICA6ICd1ay1ncmlkLW1hcmdpbicsXG4gICAgICAgICAgICByb3dmaXJzdCA6ICd1ay1yb3ctZmlyc3QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLWdyaWQtbWFyZ2luXVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JpZCA9IFVJLiQodGhpcyksIG9iajtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWdyaWQuZGF0YShcImdyaWRNYXJnaW5cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IFVJLmdyaWRNYXJnaW4oZ3JpZCwgVUkuVXRpbHMub3B0aW9ucyhncmlkLmF0dHIoXCJkYXRhLXVrLWdyaWQtbWFyZ2luXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgc3RhY2tNYXJnaW4gPSBVSS5zdGFja01hcmdpbih0aGlzLmVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoVUlraXQpO1xuIl19