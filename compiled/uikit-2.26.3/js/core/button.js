"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "activeClass": 'uk-active',
            "target": ".uk-button"
        },

        boot: function boot() {

            // init code
            UI.$html.on("click.buttonradio.uikit", "[data-uk-button-radio]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("buttonRadio")) {

                    var obj = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-uk-button-radio"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger("click");
                    }
                }
            });
        },

        init: function init() {

            var $this = this;

            // Init ARIA
            this.find($this.options.target).attr('aria-checked', 'false').filter('.' + $this.options.activeClass).attr('aria-checked', 'true');

            this.on("click", this.options.target, function (e) {

                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(ele).removeClass($this.options.activeClass).blur();
                ele.addClass($this.options.activeClass);

                // Update ARIA
                $this.find($this.options.target).not(ele).attr('aria-checked', 'false');
                ele.attr('aria-checked', 'true');

                $this.trigger("change.uk.button", [ele]);
            });
        },

        getSelected: function getSelected() {
            return this.find('.' + this.options.activeClass);
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "activeClass": 'uk-active',
            "target": ".uk-button"
        },

        boot: function boot() {

            UI.$html.on("click.buttoncheckbox.uikit", "[data-uk-button-checkbox]", function (e) {
                var ele = UI.$(this);

                if (!ele.data("buttonCheckbox")) {

                    var obj = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-uk-button-checkbox"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger("click");
                    }
                }
            });
        },

        init: function init() {

            var $this = this;

            // Init ARIA
            this.find($this.options.target).attr('aria-checked', 'false').filter('.' + $this.options.activeClass).attr('aria-checked', 'true');

            this.on("click", this.options.target, function (e) {
                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                ele.toggleClass($this.options.activeClass).blur();

                // Update ARIA
                ele.attr('aria-checked', ele.hasClass($this.options.activeClass));

                $this.trigger("change.uk.button", [ele]);
            });
        },

        getSelected: function getSelected() {
            return this.find('.' + this.options.activeClass);
        }
    });

    UI.component('button', {

        defaults: {},

        boot: function boot() {

            UI.$html.on("click.button.uikit", "[data-uk-button]", function (e) {
                var ele = UI.$(this);

                if (!ele.data("button")) {

                    var obj = UI.button(ele, UI.Utils.options(ele.attr("data-uk-button")));
                    ele.trigger("click");
                }
            });
        },

        init: function init() {

            var $this = this;

            // Init ARIA
            this.element.attr('aria-pressed', this.element.hasClass("uk-active"));

            this.on("click", function (e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change.uk.button", [$this.element.blur().hasClass("uk-active")]);
            });
        },

        toggle: function toggle() {
            this.element.toggleClass("uk-active");

            // Update ARIA
            this.element.attr('aria-pressed', this.element.hasClass("uk-active"));
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2J1dHRvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFhOztBQUVWOztBQUVBLE9BQUcsU0FBSCxDQUFhLGFBQWIsRUFBNEI7O0FBRXhCLGtCQUFVO0FBQ04sMkJBQWUsV0FEVDtBQUVOLHNCQUFVO0FBRkosU0FGYzs7QUFPeEIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsRUFBVCxDQUFZLHlCQUFaLEVBQXVDLHdCQUF2QyxFQUFpRSxVQUFTLENBQVQsRUFBWTs7QUFFekUsb0JBQUksTUFBTSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQVY7O0FBRUEsb0JBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxhQUFULENBQUwsRUFBOEI7O0FBRTFCLHdCQUFJLE1BQVMsR0FBRyxXQUFILENBQWUsR0FBZixFQUFvQixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLHNCQUFULENBQWpCLENBQXBCLENBQWI7QUFBQSx3QkFDSSxTQUFTLEdBQUcsQ0FBSCxDQUFLLEVBQUUsTUFBUCxDQURiOztBQUdBLHdCQUFJLE9BQU8sRUFBUCxDQUFVLElBQUksT0FBSixDQUFZLE1BQXRCLENBQUosRUFBbUM7QUFDL0IsK0JBQU8sT0FBUCxDQUFlLE9BQWY7QUFDSDtBQUNKO0FBQ0osYUFiRDtBQWNILFNBeEJ1Qjs7QUEwQnhCLGNBQU0sZ0JBQVc7O0FBRWIsZ0JBQUksUUFBUSxJQUFaOzs7QUFHQSxpQkFBSyxJQUFMLENBQVUsTUFBTSxPQUFOLENBQWMsTUFBeEIsRUFBZ0MsSUFBaEMsQ0FBcUMsY0FBckMsRUFBcUQsT0FBckQsRUFBOEQsTUFBOUQsQ0FBcUUsTUFBTSxNQUFNLE9BQU4sQ0FBYyxXQUF6RixFQUFzRyxJQUF0RyxDQUEyRyxjQUEzRyxFQUEySCxNQUEzSDs7QUFFQSxpQkFBSyxFQUFMLENBQVEsT0FBUixFQUFpQixLQUFL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LENBQXNCLFdBQXRCLENBQWxDO0FBQ0g7QUF2Q2tCLEtBQXZCO0FBMENILENBMUpELEVBMEpHLEtBMUpIIiwiZmlsZSI6ImJ1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihVSSkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBVSS5jb21wb25lbnQoJ2J1dHRvblJhZGlvJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBcImFjdGl2ZUNsYXNzXCI6ICd1ay1hY3RpdmUnLFxuICAgICAgICAgICAgXCJ0YXJnZXRcIjogXCIudWstYnV0dG9uXCJcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS4kaHRtbC5vbihcImNsaWNrLmJ1dHRvbnJhZGlvLnVpa2l0XCIsIFwiW2RhdGEtdWstYnV0dG9uLXJhZGlvXVwiLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoXCJidXR0b25SYWRpb1wiKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogICAgPSBVSS5idXR0b25SYWRpbyhlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLWJ1dHRvbi1yYWRpb1wiKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gVUkuJChlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pcyhvYmoub3B0aW9ucy50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEluaXQgQVJJQVxuICAgICAgICAgICAgdGhpcy5maW5kKCR0aGlzLm9wdGlvbnMudGFyZ2V0KS5hdHRyKCdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnKS5maWx0ZXIoJy4nICsgJHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcykuYXR0cignYXJpYS1jaGVja2VkJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrXCIsIHRoaXMub3B0aW9ucy50YXJnZXQsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZS5pcygnYVtocmVmPVwiI1wiXScpKSBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCR0aGlzLm9wdGlvbnMudGFyZ2V0KS5ub3QoZWxlKS5yZW1vdmVDbGFzcygkdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzKS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgZWxlLmFkZENsYXNzKCR0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCR0aGlzLm9wdGlvbnMudGFyZ2V0KS5ub3QoZWxlKS5hdHRyKCdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICBlbGUuYXR0cignYXJpYS1jaGVja2VkJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoXCJjaGFuZ2UudWsuYnV0dG9uXCIsIFtlbGVdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZCgnLicgKyB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBVSS5jb21wb25lbnQoJ2J1dHRvbkNoZWNrYm94Jywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBcImFjdGl2ZUNsYXNzXCI6ICd1ay1hY3RpdmUnLFxuICAgICAgICAgICAgXCJ0YXJnZXRcIjogXCIudWstYnV0dG9uXCJcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgVUkuJGh0bWwub24oXCJjbGljay5idXR0b25jaGVja2JveC51aWtpdFwiLCBcIltkYXRhLXVrLWJ1dHRvbi1jaGVja2JveF1cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcImJ1dHRvbkNoZWNrYm94XCIpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiAgICA9IFVJLmJ1dHRvbkNoZWNrYm94KGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstYnV0dG9uLWNoZWNrYm94XCIpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBVSS4kKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlzKG9iai5vcHRpb25zLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgLy8gSW5pdCBBUklBXG4gICAgICAgICAgICB0aGlzLmZpbmQoJHRoaXMub3B0aW9ucy50YXJnZXQpLmF0dHIoJ2FyaWEtY2hlY2tlZCcsICdmYWxzZScpLmZpbHRlcignLicgKyAkdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzKS5hdHRyKCdhcmlhLWNoZWNrZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2tcIiwgdGhpcy5vcHRpb25zLnRhcmdldCwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZS5pcygnYVtocmVmPVwiI1wiXScpKSBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBlbGUudG9nZ2xlQ2xhc3MoJHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcykuYmx1cigpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgICAgICBlbGUuYXR0cignYXJpYS1jaGVja2VkJywgZWxlLmhhc0NsYXNzKCR0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MpKTtcblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoXCJjaGFuZ2UudWsuYnV0dG9uXCIsIFtlbGVdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZCgnLicgKyB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIFVJLmNvbXBvbmVudCgnYnV0dG9uJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7fSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgVUkuJGh0bWwub24oXCJjbGljay5idXR0b24udWlraXRcIiwgXCJbZGF0YS11ay1idXR0b25dXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoXCJidXR0b25cIikpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gVUkuYnV0dG9uKGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstYnV0dG9uXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEluaXQgQVJJQVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtcHJlc3NlZCcsIHRoaXMuZWxlbWVudC5oYXNDbGFzcyhcInVrLWFjdGl2ZVwiKSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuZWxlbWVudC5pcygnYVtocmVmPVwiI1wiXScpKSBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwiY2hhbmdlLnVrLmJ1dHRvblwiLCBbJHRoaXMuZWxlbWVudC5ibHVyKCkuaGFzQ2xhc3MoXCJ1ay1hY3RpdmVcIildKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50b2dnbGVDbGFzcyhcInVrLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLXByZXNzZWQnLCB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoXCJ1ay1hY3RpdmVcIikpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKFVJa2l0KTtcblxuIl19