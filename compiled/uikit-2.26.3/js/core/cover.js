"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    UI.component('cover', {

        defaults: {
            automute: true
        },

        boot: function boot() {

            // auto init
            UI.ready(function (context) {

                UI.$("[data-uk-cover]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("cover")) {
                        var plugin = UI.cover(ele, UI.Utils.options(ele.attr("data-uk-cover")));
                    }
                });
            });
        },

        init: function init() {

            this.parent = this.element.parent();

            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function () {
                this.check();
            }.bind(this), 100));

            this.on("display.uk.check", function (e) {
                if (this.element.is(":visible")) this.check();
            }.bind(this));

            this.check();

            if (this.element.is('iframe') && this.options.automute) {

                var src = this.element.attr('src');

                this.element.attr('src', '').on('load', function () {

                    this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                }).attr('src', [src, src.indexOf('?') > -1 ? '&' : '?', 'enablejsapi=1&api=1'].join(''));
            }
        },

        check: function check() {

            this.element.css({
                'width': '',
                'height': ''
            });

            this.dimension = { w: this.element.width(), h: this.element.height() };

            if (this.element.attr('width') && !isNaN(this.element.attr('width'))) {
                this.dimension.w = this.element.attr('width');
            }

            if (this.element.attr('height') && !isNaN(this.element.attr('height'))) {
                this.dimension.h = this.element.attr('height');
            }

            this.ratio = this.dimension.w / this.dimension.h;

            var w = this.parent.width(),
                h = this.parent.height(),
                width,
                height;

            // if element height < parent height (gap underneath)
            if (w / this.ratio < h) {

                width = Math.ceil(h * this.ratio);
                height = h;

                // element width < parent width (gap to right)
            } else {

                width = w;
                height = Math.ceil(w / this.ratio);
            }

            this.element.css({
                'width': width,
                'height': height
            });
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2NvdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLENBQUMsVUFBUyxFQUFULEVBQVk7O0FBRVQ7O0FBRUEsT0FBRyxTQUFILENBQWEsT0FBYixFQUFzQjs7QUFFbEIsa0JBQVU7QUFDTixzQkFBVztBQURMLFNBRlE7O0FBTWxCLGNBQU0sZ0JBQVc7OztBQUdiLGVBQUcsS0FBSCxDQUFTLFVBQVMsT0FBVCxFQUFrQjs7QUFFdkIsbUJBQUcsQ0FBSCxDQUFLLGlCQUFMLEVBQXdCLE9BQXhCLEVBQWlDLElBQWpDLENBQXNDLFlBQVU7O0FBRTVDLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFHLENBQUMsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFKLEVBQXVCO0FBQ25CLDRCQUFJLFNBQVMsR0FBRyxLQUFILENBQVMsR0FBVCxFQUFjLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsZUFBVCxDQUFqQixDQUFkLENBQWI7QUFDSDtBQUNKLGlCQVBEO0FBUUgsYUFWRDtBQVdILFNBcEJpQjs7QUFzQmxCLGNBQU0sZ0JBQVc7O0FBRWIsaUJBQUssTUFBTCxHQUFjLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBZDs7QUFFQSxlQUFHLElBQUgsQ0FBUSxFQUFSLENBQVcsK0JBQVgsRUFBNEMsR0FBRyxLQUFILENBQVMsUUFBVCxDQUFrQixZQUFVO0FBQ3BFLHFCQUFLLEtBQUw7QUFDSCxhQUY2RCxDQUU1RCxJQUY0RCxDQUV2RCxJQUZ1RCxDQUFsQixFQUU5QixHQUY4QixDQUE1Qzs7QUFJQSxpQkFBSyxFQUFMLENBQVEsa0JBQVIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDcEMsb0JBQUcsS0FBSyxPQUFMLENBQWEsRUFBYixDQUFnQixVQUFoQixDQUFILEVBQWdDLEtBQUssS0FBTDtBQUNuQyxhQUYyQixDQUUxQixJQUYwQixDQUVyQixJQUZxQixDQUE1Qjs7QUFJQSxpQkFBSyxLQUFMOztBQUVBLGdCQUFJLEtBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsUUFBaEIsS0FBNkIsS0FBSyxPQUFMLENBQWEsUUFBOUMsRUFBd0Q7O0FBRXBELG9CQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixDQUFWOztBQUVBLHFCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQWxCLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCLENBQWdDLE1BQWhDLEVBQXdDLFlBQVU7O0FBRTlDLHlCQUFLLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBK0Isd0VBQS9CLEVBQXlHLEdBQXpHO0FBRUgsaUJBSkQsRUFJRyxJQUpILENBSVEsS0FKUixFQUllLENBQUMsR0FBRCxFQUFPLElBQUksT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBQyxDQUFwQixHQUF3QixHQUF4QixHQUE0QixHQUFuQyxFQUF5QyxxQkFBekMsRUFBZ0UsSUFBaEUsQ0FBcUUsRUFBckUsQ0FKZjtBQUtIO0FBQ0osU0E5Q2lCOztBQWdEbEIsZUFBTyxpQkFBVzs7QUFFZCxpQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQjtBQUNiLHlCQUFXLEVBREU7QUFFYiwwQkFBVztBQUZFLGFBQWpCOztBQUtBLGlCQUFLLFNBQUwsR0FBaUIsRUFBQyxHQUFHLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBSixFQUEwQixHQUFHLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBN0IsRUFBakI7O0FBRUEsZ0JBQUksS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixPQUFsQixLQUE4QixDQUFDLE1BQU0sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixPQUFsQixDQUFOLENBQW5DLEVBQXNFO0FBQ2xFLHFCQUFLLFNBQUwsQ0FBZSxDQUFmLEdBQW1CLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsT0FBbEIsQ0FBbkI7QUFDSDs7QUFFRCxnQkFBSSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFFBQWxCLEtBQStCLENBQUMsTUFBTSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFFBQWxCLENBQU4sQ0FBcEMsRUFBd0U7QUFDcEUscUJBQUssU0FBTCxDQUFlLENBQWYsR0FBbUIsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixRQUFsQixDQUFuQjtBQUNIOztBQUVELGlCQUFLLEtBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsQ0FBZixHQUFtQixLQUFLLFNBQUwsQ0FBZSxDQUFuRDs7QUFFQSxnQkFBSSxJQUFJLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBUjtBQUFBLGdCQUE2QixJQUFJLEtBQUssTUFBTCxDQUFZLE1BQVosRUFBakM7QUFBQSxnQkFBdUQsS0FBdkQ7QUFBQSxnQkFBOEQsTUFBOUQ7OztBQUdBLGdCQUFLLElBQUksS0FBSyxLQUFWLEdBQW1CLENBQXZCLEVBQTBCOztBQUV0Qix3QkFBUyxLQUFLLElBQUwsQ0FBVSxJQUFJLEtBQUssS0FBbkIsQ0FBVDtBQUNBLHlCQUFTLENBQVQ7OztBQUdILGFBTkQsTUFNTzs7QUFFSCx3QkFBUyxDQUFUO0FBQ0EseUJBQVMsS0FBSyxJQUFMLENBQVUsSUFBSSxLQUFLLEtBQW5CLENBQVQ7QUFDSDs7QUFFRCxpQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQjtBQUNiLHlCQUFXLEtBREU7QUFFYiwwQkFBVztBQUZFLGFBQWpCO0FBSUg7QUF0RmlCLEtBQXRCO0FBeUZILENBN0ZELEVBNkZHLEtBN0ZIIiwiZmlsZSI6ImNvdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgVUkuY29tcG9uZW50KCdjb3ZlcicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgYXV0b211dGUgOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGF1dG8gaW5pdFxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLWNvdmVyXVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWVsZS5kYXRhKFwiY292ZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwbHVnaW4gPSBVSS5jb3ZlcihlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLWNvdmVyXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKTtcblxuICAgICAgICAgICAgVUkuJHdpbi5vbignbG9hZCByZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTAwKSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJkaXNwbGF5LnVrLmNoZWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSkgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmlzKCdpZnJhbWUnKSAmJiB0aGlzLm9wdGlvbnMuYXV0b211dGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLmVsZW1lbnQuYXR0cignc3JjJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXR0cignc3JjJywgJycpLm9uKCdsb2FkJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3sgXCJldmVudFwiOiBcImNvbW1hbmRcIiwgXCJmdW5jXCI6IFwibXV0ZVwiLCBcIm1ldGhvZFwiOlwic2V0Vm9sdW1lXCIsIFwidmFsdWVcIjowfScsICcqJyk7XG5cbiAgICAgICAgICAgICAgICB9KS5hdHRyKCdzcmMnLCBbc3JjLCAoc3JjLmluZGV4T2YoJz8nKSA+IC0xID8gJyYnOic/JyksICdlbmFibGVqc2FwaT0xJmFwaT0xJ10uam9pbignJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3dpZHRoJyAgOiAnJyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JyA6ICcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5kaW1lbnNpb24gPSB7dzogdGhpcy5lbGVtZW50LndpZHRoKCksIGg6IHRoaXMuZWxlbWVudC5oZWlnaHQoKX07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuYXR0cignd2lkdGgnKSAmJiAhaXNOYU4odGhpcy5lbGVtZW50LmF0dHIoJ3dpZHRoJykpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb24udyA9IHRoaXMuZWxlbWVudC5hdHRyKCd3aWR0aCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmF0dHIoJ2hlaWdodCcpICYmICFpc05hTih0aGlzLmVsZW1lbnQuYXR0cignaGVpZ2h0JykpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb24uaCA9IHRoaXMuZWxlbWVudC5hdHRyKCdoZWlnaHQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yYXRpbyAgICAgPSB0aGlzLmRpbWVuc2lvbi53IC8gdGhpcy5kaW1lbnNpb24uaDtcblxuICAgICAgICAgICAgdmFyIHcgPSB0aGlzLnBhcmVudC53aWR0aCgpLCBoID0gdGhpcy5wYXJlbnQuaGVpZ2h0KCksIHdpZHRoLCBoZWlnaHQ7XG5cbiAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgaGVpZ2h0IDwgcGFyZW50IGhlaWdodCAoZ2FwIHVuZGVybmVhdGgpXG4gICAgICAgICAgICBpZiAoKHcgLyB0aGlzLnJhdGlvKSA8IGgpIHtcblxuICAgICAgICAgICAgICAgIHdpZHRoICA9IE1hdGguY2VpbChoICogdGhpcy5yYXRpbyk7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaDtcblxuICAgICAgICAgICAgLy8gZWxlbWVudCB3aWR0aCA8IHBhcmVudCB3aWR0aCAoZ2FwIHRvIHJpZ2h0KVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHdpZHRoICA9IHc7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5jZWlsKHcgLyB0aGlzLnJhdGlvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgJ3dpZHRoJyAgOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JyA6IGhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoVUlraXQpO1xuIl19