"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-form-select", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('formSelect', {

        defaults: {
            'target': '>span:first',
            'activeClass': 'uk-active'
        },

        boot: function boot() {
            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-form-select]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("formSelect")) {
                        UI.formSelect(ele, UI.Utils.options(ele.attr("data-uk-form-select")));
                    }
                });
            });
        },

        init: function init() {
            var $this = this;

            this.target = this.find(this.options.target);
            this.select = this.find('select');

            // init + on change event
            this.select.on("change", function () {

                var select = $this.select[0],
                    fn = function fn() {

                    try {
                        if ($this.options.target === 'input') {
                            $this.target.val(select.options[select.selectedIndex].text);
                        } else {
                            $this.target.text(select.options[select.selectedIndex].text);
                        }
                    } catch (e) {}

                    $this.element[$this.select.val() ? 'addClass' : 'removeClass']($this.options.activeClass);

                    return fn;
                };

                return fn();
            }());

            this.element.data("formSelect", this);
        }
    });

    return UI.formSelect;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2Zvcm0tc2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLENBQUMsVUFBUyxLQUFULEVBQWdCOztBQUViLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLG1CQUFQLEVBQTRCLENBQUMsT0FBRCxDQUE1QixFQUF1QyxZQUFVO0FBQzdDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLE9BQUcsU0FBSCxDQUFhLFlBQWIsRUFBMkI7O0FBRXZCLGtCQUFVO0FBQ04sc0JBQVUsYUFESjtBQUVOLDJCQUFlO0FBRlQsU0FGYTs7QUFPdkIsY0FBTSxnQkFBVzs7QUFFYixlQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7O0FBRXZCLG1CQUFHLENBQUgsQ0FBSyx1QkFBTCxFQUE4QixPQUE5QixFQUF1QyxJQUF2QyxDQUE0QyxZQUFVOztBQUVsRCx3QkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjs7QUFFQSx3QkFBSSxDQUFDLElBQUksSUFBSixDQUFTLFlBQVQsQ0FBTCxFQUE2QjtBQUN6QiwyQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLHFCQUFULENBQWpCLENBQW5CO0FBQ0g7QUFDSixpQkFQRDtBQVFILGFBVkQ7QUFXSCxTQXBCc0I7O0FBc0J2QixjQUFNLGdCQUFXO0FBQ2IsZ0JBQUksUUFBUSxJQUFaOztBQUVBLGlCQUFLLE1BQUwsR0FBZSxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQUwsQ0FBYSxNQUF2QixDQUFmO0FBQ0EsaUJBQUssTUFBTCxHQUFlLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBZjs7O0FBR0EsaUJBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxRQUFmLEVBQTBCLFlBQVU7O0FBRWhDLG9CQUFJLFNBQVMsTUFBTSxNQUFOLENBQWEsQ0FBYixDQUFiO0FBQUEsb0JBQThCLEtBQUssU0FBTCxFQUFLLEdBQVU7O0FBRXpDLHdCQUFJO0FBQ0EsNEJBQUcsTUFBTSxPQUFOLENBQWMsTUFBZCxLQUF5QixPQUE1QixFQUNBO0FBQ0ksa0NBQU0sTUFBTixDQUFhLEdBQWIsQ0FBaUIsT0FBTyxPQUFQLENBQWUsT0FBTyxhQUF0QixFQUFxQyxJQUF0RDtBQUNILHlCQUhELE1BS0E7QUFDSSxrQ0FBTSxNQUFOLENBQWEsSUFBYixDQUFrQixPQUFPLE9BQVAsQ0FBZSxPQUFPLGFBQXRCLEVBQXFDLElBQXZEO0FBQ0g7QUFDSixxQkFURCxDQVNFLE9BQU0sQ0FBTixFQUFTLENBQUU7O0FBRWIsMEJBQU0sT0FBTixDQUFjLE1BQU0sTUFBTixDQUFhLEdBQWIsS0FBcUIsVUFBckIsR0FBZ0MsYUFBOUMsRUFBNkQsTUFBTSxPQUFOLENBQWMsV0FBM0U7O0FBRUEsMkJBQU8sRUFBUDtBQUNILGlCQWhCRDs7QUFrQkEsdUJBQU8sSUFBUDtBQUNILGFBckJ3QixFQUF6Qjs7QUF1QkEsaUJBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsWUFBbEIsRUFBZ0MsSUFBaEM7QUFDSDtBQXJEc0IsS0FBM0I7O0FBd0RBLFdBQU8sR0FBRyxVQUFWO0FBQ0gsQ0EzRUQiLCJmaWxlIjoiZm9ybS1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1mb3JtLXNlbGVjdFwiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgVUkuY29tcG9uZW50KCdmb3JtU2VsZWN0Jywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAndGFyZ2V0JzogJz5zcGFuOmZpcnN0JyxcbiAgICAgICAgICAgICdhY3RpdmVDbGFzcyc6ICd1ay1hY3RpdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoXCJbZGF0YS11ay1mb3JtLXNlbGVjdF1cIiwgY29udGV4dCkuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoXCJmb3JtU2VsZWN0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5mb3JtU2VsZWN0KGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstZm9ybS1zZWxlY3RcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnRhcmdldCAgPSB0aGlzLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdCAgPSB0aGlzLmZpbmQoJ3NlbGVjdCcpO1xuXG4gICAgICAgICAgICAvLyBpbml0ICsgb24gY2hhbmdlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLnNlbGVjdC5vbihcImNoYW5nZVwiLCAoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkdGhpcy5zZWxlY3RbMF0sIGZuID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMub3B0aW9ucy50YXJnZXQgPT09ICdpbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudGFyZ2V0LnZhbChzZWxlY3Qub3B0aW9uc1tzZWxlY3Quc2VsZWN0ZWRJbmRleF0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudGFyZ2V0LnRleHQoc2VsZWN0Lm9wdGlvbnNbc2VsZWN0LnNlbGVjdGVkSW5kZXhdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHt9XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudFskdGhpcy5zZWxlY3QudmFsKCkgPyAnYWRkQ2xhc3MnOidyZW1vdmVDbGFzcyddKCR0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgICAgICB9KSgpKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGEoXCJmb3JtU2VsZWN0XCIsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gVUkuZm9ybVNlbGVjdDtcbn0pO1xuIl19