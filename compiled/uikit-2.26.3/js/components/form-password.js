"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-form-password", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('formPassword', {

        defaults: {
            "lblShow": "Show",
            "lblHide": "Hide"
        },

        boot: function boot() {
            // init code
            UI.$html.on("click.formpassword.uikit", "[data-uk-form-password]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("formPassword")) {

                    e.preventDefault();

                    UI.formPassword(ele, UI.Utils.options(ele.attr("data-uk-form-password")));
                    ele.trigger("click");
                }
            });
        },

        init: function init() {

            var $this = this;

            this.on("click", function (e) {

                e.preventDefault();

                if ($this.input.length) {
                    var type = $this.input.attr("type");
                    $this.input.attr("type", type == "text" ? "password" : "text");
                    $this.element.html($this.options[type == "text" ? "lblShow" : "lblHide"]);
                }
            });

            this.input = this.element.next("input").length ? this.element.next("input") : this.element.prev("input");
            this.element.html(this.options[this.input.is("[type='password']") ? "lblShow" : "lblHide"]);

            this.element.data("formPassword", this);
        }
    });

    return UI.formPassword;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2Zvcm0tcGFzc3dvcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8scUJBQVAsRUFBOEIsQ0FBQyxPQUFELENBQTlCLEVBQXlDLFlBQVU7QUFDL0MsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBRUEsT0FBRyxTQUFILENBQWEsY0FBYixFQUE2Qjs7QUFFekIsa0JBQVU7QUFDTix1QkFBVyxNQURMO0FBRU4sdUJBQVc7QUFGTCxTQUZlOztBQU96QixjQUFNLGdCQUFXOztBQUViLGVBQUcsS0FBSCxDQUFTLEVBQVQsQ0FBWSwwQkFBWixFQUF3Qyx5QkFBeEMsRUFBbUUsVUFBUyxDQUFULEVBQVk7O0FBRTNFLG9CQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLG9CQUFJLENBQUMsSUFBSSxJQUFKLENBQVMsY0FBVCxDQUFMLEVBQStCOztBQUUzQixzQkFBRSxjQUFGOztBQUVBLHVCQUFHLFlBQUgsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixJQUFJLElBQUosQ0FBUyx1QkFBVCxDQUFqQixDQUFyQjtBQUNBLHdCQUFJLE9BQUosQ0FBWSxPQUFaO0FBQ0g7QUFDSixhQVhEO0FBWUgsU0FyQndCOztBQXVCekIsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFBUyxDQUFULEVBQVk7O0FBRXpCLGtCQUFFLGNBQUY7O0FBRUEsb0JBQUcsTUFBTSxLQUFOLENBQVksTUFBZixFQUF1QjtBQUNuQix3QkFBSSxPQUFPLE1BQU0sS0FBTixDQUFZLElBQVosQ0FBaUIsTUFBakIsQ0FBWDtBQUNBLDBCQUFNLEtBQU4sQ0FBWSxJQUFaLENBQWlCLE1BQWpCLEVBQXlCLFFBQU0sTUFBTixHQUFlLFVBQWYsR0FBMEIsTUFBbkQ7QUFDQSwwQkFBTSxPQUFOLENBQWMsSUFBZCxDQUFtQixNQUFNLE9BQU4sQ0FBYyxRQUFNLE1BQU4sR0FBZSxTQUFmLEdBQXlCLFNBQXZDLENBQW5CO0FBQ0g7QUFDSixhQVREOztBQVdBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLE9BQWxCLEVBQTJCLE1BQTNCLEdBQW9DLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsT0FBbEIsQ0FBcEMsR0FBaUUsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixPQUFsQixDQUE5RTtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQUssT0FBTCxDQUFhLEtBQUssS0FBTCxDQUFXLEVBQVgsQ0FBYyxtQkFBZCxJQUFxQyxTQUFyQyxHQUErQyxTQUE1RCxDQUFsQjs7QUFHQSxpQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixjQUFsQixFQUFrQyxJQUFsQztBQUNIO0FBM0N3QixLQUE3Qjs7QUE4Q0EsV0FBTyxHQUFHLFlBQVY7QUFDSCxDQWpFRCIsImZpbGUiOiJmb3JtLXBhc3N3b3JkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtZm9ybS1wYXNzd29yZFwiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgVUkuY29tcG9uZW50KCdmb3JtUGFzc3dvcmQnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIFwibGJsU2hvd1wiOiBcIlNob3dcIixcbiAgICAgICAgICAgIFwibGJsSGlkZVwiOiBcIkhpZGVcIlxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS4kaHRtbC5vbihcImNsaWNrLmZvcm1wYXNzd29yZC51aWtpdFwiLCBcIltkYXRhLXVrLWZvcm0tcGFzc3dvcmRdXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcImZvcm1QYXNzd29yZFwiKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBVSS5mb3JtUGFzc3dvcmQoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1mb3JtLXBhc3N3b3JkXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZigkdGhpcy5pbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAkdGhpcy5pbnB1dC5hdHRyKFwidHlwZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuaW5wdXQuYXR0cihcInR5cGVcIiwgdHlwZT09XCJ0ZXh0XCIgPyBcInBhc3N3b3JkXCI6XCJ0ZXh0XCIpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50Lmh0bWwoJHRoaXMub3B0aW9uc1t0eXBlPT1cInRleHRcIiA/IFwibGJsU2hvd1wiOlwibGJsSGlkZVwiXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmVsZW1lbnQubmV4dChcImlucHV0XCIpLmxlbmd0aCA/IHRoaXMuZWxlbWVudC5uZXh0KFwiaW5wdXRcIikgOiB0aGlzLmVsZW1lbnQucHJldihcImlucHV0XCIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwodGhpcy5vcHRpb25zW3RoaXMuaW5wdXQuaXMoXCJbdHlwZT0ncGFzc3dvcmQnXVwiKSA/IFwibGJsU2hvd1wiOlwibGJsSGlkZVwiXSk7XG5cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGEoXCJmb3JtUGFzc3dvcmRcIiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBVSS5mb3JtUGFzc3dvcmQ7XG59KTtcbiJdfQ==