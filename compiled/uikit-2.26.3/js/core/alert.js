"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        boot: function boot() {

            // init code
            UI.$html.on("click.alert.uikit", "[data-uk-alert]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("alert")) {

                    var alert = UI.alert(ele, UI.Utils.options(ele.attr("data-uk-alert")));

                    if (UI.$(e.target).is(alert.options.trigger)) {
                        e.preventDefault();
                        alert.close();
                    }
                }
            });
        },

        init: function init() {

            var $this = this;

            this.on("click", this.options.trigger, function (e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function close() {

            var element = this.trigger("close.uk.alert"),
                removeElement = function () {
                this.trigger("closed.uk.alert").remove();
            }.bind(this);

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height": 0,
                    "opacity": 0,
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "margin-top": 0,
                    "margin-bottom": 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }
        }

    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2FsZXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLENBQUMsVUFBUyxFQUFULEVBQWE7O0FBRVY7O0FBRUEsT0FBRyxTQUFILENBQWEsT0FBYixFQUFzQjs7QUFFbEIsa0JBQVU7QUFDTixvQkFBUSxJQURGO0FBRU4sd0JBQVksR0FGTjtBQUdOLHVCQUFXO0FBSEwsU0FGUTs7QUFRbEIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsRUFBVCxDQUFZLG1CQUFaLEVBQWlDLGlCQUFqQyxFQUFvRCxVQUFTLENBQVQsRUFBWTs7QUFFNUQsb0JBQUksTUFBTSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQVY7O0FBRUEsb0JBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxPQUFULENBQUwsRUFBd0I7O0FBRXBCLHdCQUFJLFFBQVEsR0FBRyxLQUFILENBQVMsR0FBVCxFQUFjLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsZUFBVCxDQUFqQixDQUFkLENBQVo7O0FBRUEsd0JBQUksR0FBRyxDQUFILENBQUssRUFBRSxNQUFQLEVBQWUsRUFBZixDQUFrQixNQUFNLE9BQU4sQ0FBYyxPQUFoQyxDQUFKLEVBQThDO0FBQzFDLDBCQUFFLGNBQUY7QUFDQSw4QkFBTSxLQUFOO0FBQ0g7QUFDSjtBQUNKLGFBYkQ7QUFjSCxTQXpCaUI7O0FBMkJsQixjQUFNLGdCQUFXOztBQUViLGdCQUFJLFFBQVEsSUFBWjs7QUFFQSxpQkFBSyxFQUFMLENBQVEsT0FBUixFQUFpQixLQUFLLE9BQUwsQ0FBYSxPQUE5QixFQUF1QyxVQUFTLENBQVQsRUFBWTtBQUMvQyxrQkFBRSxjQUFGO0FBQ0Esc0JBQU0sS0FBTjtBQUNILGFBSEQ7QUFJSCxTQW5DaUI7O0FBcUNsQixlQUFPLGlCQUFXOztBQUVkLGdCQUFJLFVBQWdCLEtBQUssT0FBTCxDQUFhLGdCQUFiLENBQXBCO0FBQUEsZ0JBQ0ksZ0JBQWdCLFlBQVk7QUFDeEIscUJBQUssT0FBTCxDQUFhLGlCQUFiLEVBQWdDLE1BQWhDO0FBQ0gsYUFGZSxDQUVkLElBRmMsQ0FFVCxJQUZTLENBRHBCOztBQUtBLGdCQUFJLEtBQUssT0FBTCxDQUFhLElBQWpCLEVBQXVCO0FBQ25CLHdCQUFRLEdBQVIsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCLEVBQWtDLEdBQWxDLENBQXNDLFlBQXRDLEVBQW9ELFFBQVEsTUFBUixFQUFwRCxFQUFzRSxPQUF0RSxDQUE4RTtBQUMxRSw4QkFBbUIsQ0FEdUQ7QUFFMUUsK0JBQW1CLENBRnVEO0FBRzFFLG1DQUFtQixDQUh1RDtBQUkxRSxzQ0FBbUIsQ0FKdUQ7QUFLMUUsa0NBQW1CLENBTHVEO0FBTTFFLHFDQUFtQjtBQU51RCxpQkFBOUUsRUFPRyxLQUFLLE9BQUwsQ0FBYSxRQVBoQixFQU8wQixhQVAxQjtBQVFILGFBVEQsTUFTTztBQUNIO0FBQ0g7QUFDSjs7QUF4RGlCLEtBQXRCO0FBNERILENBaEVELEVBZ0VHLEtBaEVIIiwiZmlsZSI6ImFsZXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIFVJLmNvbXBvbmVudCgnYWxlcnQnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIFwiZmFkZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkdXJhdGlvblwiOiAyMDAsXG4gICAgICAgICAgICBcInRyaWdnZXJcIjogXCIudWstYWxlcnQtY2xvc2VcIlxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLiRodG1sLm9uKFwiY2xpY2suYWxlcnQudWlraXRcIiwgXCJbZGF0YS11ay1hbGVydF1cIiwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwiYWxlcnRcIikpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnQgPSBVSS5hbGVydChlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLWFsZXJ0XCIpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFVJLiQoZS50YXJnZXQpLmlzKGFsZXJ0Lm9wdGlvbnMudHJpZ2dlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrXCIsIHRoaXMub3B0aW9ucy50cmlnZ2VyLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICR0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ICAgICAgID0gdGhpcy50cmlnZ2VyKFwiY2xvc2UudWsuYWxlcnRcIiksXG4gICAgICAgICAgICAgICAgcmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFwiY2xvc2VkLnVrLmFsZXJ0XCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5mYWRlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoXCJvdmVyZmxvd1wiLCBcImhpZGRlblwiKS5jc3MoXCJtYXgtaGVpZ2h0XCIsIGVsZW1lbnQuaGVpZ2h0KCkpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiICAgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIiAgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctdG9wXCIgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctYm90dG9tXCIgOiAwLFxuICAgICAgICAgICAgICAgICAgICBcIm1hcmdpbi10b3BcIiAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICBcIm1hcmdpbi1ib3R0b21cIiAgOiAwXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uLCByZW1vdmVFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRWxlbWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcblxufSkoVUlraXQpO1xuIl19