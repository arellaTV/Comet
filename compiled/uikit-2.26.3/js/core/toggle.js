'use strict';

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var toggles = [];

    UI.component('toggle', {

        defaults: {
            target: false,
            cls: 'uk-hidden',
            animation: false,
            duration: 200
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-toggle]", context).each(function () {
                    var ele = UI.$(this);

                    if (!ele.data("toggle")) {
                        var obj = UI.toggle(ele, UI.Utils.options(ele.attr("data-uk-toggle")));
                    }
                });

                setTimeout(function () {

                    toggles.forEach(function (toggle) {
                        toggle.getToggles();
                    });
                }, 0);
            });
        },

        init: function init() {

            var $this = this;

            this.aria = this.options.cls.indexOf('uk-hidden') !== -1;

            this.getToggles();

            this.on("click", function (e) {
                if ($this.element.is('a[href="#"]')) e.preventDefault();
                $this.toggle();
            });

            toggles.push(this);
        },

        toggle: function toggle() {

            if (!this.totoggle.length) return;

            if (this.options.animation && UI.support.animation) {

                var $this = this,
                    animations = this.options.animation.split(',');

                if (animations.length == 1) {
                    animations[1] = animations[0];
                }

                animations[0] = animations[0].trim();
                animations[1] = animations[1].trim();

                this.totoggle.css('animation-duration', this.options.duration + 'ms');

                this.totoggle.each(function () {

                    var ele = UI.$(this);

                    if (ele.hasClass($this.options.cls)) {

                        ele.toggleClass($this.options.cls);

                        UI.Utils.animate(ele, animations[0]).then(function () {
                            ele.css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });
                    } else {

                        UI.Utils.animate(this, animations[1] + ' uk-animation-reverse').then(function () {
                            ele.toggleClass($this.options.cls).css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });
                    }
                });
            } else {
                this.totoggle.toggleClass(this.options.cls);
                UI.Utils.checkDisplay(this.totoggle);
            }

            this.updateAria();
        },

        getToggles: function getToggles() {
            this.totoggle = this.options.target ? UI.$(this.options.target) : [];
            this.updateAria();
        },

        updateAria: function updateAria() {
            if (this.aria && this.totoggle.length) {
                this.totoggle.each(function () {
                    UI.$(this).attr('aria-hidden', UI.$(this).hasClass('uk-hidden'));
                });
            }
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3RvZ2dsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFZOztBQUVUOztBQUVBLFFBQUksVUFBVSxFQUFkOztBQUVBLE9BQUcsU0FBSCxDQUFhLFFBQWIsRUFBdUI7O0FBRW5CLGtCQUFVO0FBQ04sb0JBQVksS0FETjtBQUVOLGlCQUFZLFdBRk47QUFHTix1QkFBWSxLQUhOO0FBSU4sc0JBQVk7QUFKTixTQUZTOztBQVNuQixjQUFNLGdCQUFVOzs7QUFHWixlQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7O0FBRXZCLG1CQUFHLENBQUgsQ0FBSyxrQkFBTCxFQUF5QixPQUF6QixFQUFrQyxJQUFsQyxDQUF1QyxZQUFXO0FBQzlDLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFJLENBQUMsSUFBSSxJQUFKLENBQVMsUUFBVCxDQUFMLEVBQXlCO0FBQ3JCLDRCQUFJLE1BQU0sR0FBRyxNQUFILENBQVUsR0FBVixFQUFlLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsZ0JBQVQsQ0FBakIsQ0FBZixDQUFWO0FBQ0g7QUFDSixpQkFORDs7QUFRQSwyQkFBVyxZQUFVOztBQUVqQiw0QkFBUSxPQUFSLENBQWdCLFVBQVMsTUFBVCxFQUFnQjtBQUM1QiwrQkFBTyxVQUFQO0FBQ0gscUJBRkQ7QUFJSCxpQkFORCxFQU1HLENBTkg7QUFPSCxhQWpCRDtBQWtCSCxTQTlCa0I7O0FBZ0NuQixjQUFNLGdCQUFXOztBQUViLGdCQUFJLFFBQVEsSUFBWjs7QUFFQSxpQkFBSyxJQUFMLEdBQWEsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixPQUFqQixDQUF5QixXQUF6QixNQUEwQyxDQUFDLENBQXhEOztBQUVBLGlCQUFLLFVBQUw7O0FBRUEsaUJBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFB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QXRISCIsImZpbGUiOiJ0b2dnbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdG9nZ2xlcyA9IFtdO1xuXG4gICAgVUkuY29tcG9uZW50KCd0b2dnbGUnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHRhcmdldCAgICA6IGZhbHNlLFxuICAgICAgICAgICAgY2xzICAgICAgIDogJ3VrLWhpZGRlbicsXG4gICAgICAgICAgICBhbmltYXRpb24gOiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uICA6IDIwMFxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLXRvZ2dsZV1cIiwgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcInRvZ2dsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IFVJLnRvZ2dsZShlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLXRvZ2dsZVwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlcy5mb3JFYWNoKGZ1bmN0aW9uKHRvZ2dsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUuZ2V0VG9nZ2xlcygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuYXJpYSA9ICh0aGlzLm9wdGlvbnMuY2xzLmluZGV4T2YoJ3VrLWhpZGRlbicpICE9PSAtMSk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0VG9nZ2xlcygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKCdhW2hyZWY9XCIjXCJdJykpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0b2dnbGVzLnB1c2godGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYoIXRoaXMudG90b2dnbGUubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICYmIFVJLnN1cHBvcnQuYW5pbWF0aW9uKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzLCBhbmltYXRpb25zID0gdGhpcy5vcHRpb25zLmFuaW1hdGlvbi5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uc1sxXSA9IGFuaW1hdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uc1swXSA9IGFuaW1hdGlvbnNbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNbMV0gPSBhbmltYXRpb25zWzFdLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudG90b2dnbGUuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRvdG9nZ2xlLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlLmhhc0NsYXNzKCR0aGlzLm9wdGlvbnMuY2xzKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUudG9nZ2xlQ2xhc3MoJHRoaXMub3B0aW9ucy5jbHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5VdGlscy5hbmltYXRlKGVsZSwgYW5pbWF0aW9uc1swXSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBVSS5VdGlscy5jaGVja0Rpc3BsYXkoZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLlV0aWxzLmFuaW1hdGUodGhpcywgYW5pbWF0aW9uc1sxXSsnIHVrLWFuaW1hdGlvbi1yZXZlcnNlJykudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS50b2dnbGVDbGFzcygkdGhpcy5vcHRpb25zLmNscykuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KGVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdG9nZ2xlLnRvZ2dsZUNsYXNzKHRoaXMub3B0aW9ucy5jbHMpO1xuICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSh0aGlzLnRvdG9nZ2xlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGVBcmlhKCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRUb2dnbGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudG90b2dnbGUgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ID8gVUkuJCh0aGlzLm9wdGlvbnMudGFyZ2V0KTpbXTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQXJpYSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUFyaWE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXJpYSAmJiB0aGlzLnRvdG9nZ2xlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG90b2dnbGUuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBVSS4kKHRoaXMpLmF0dHIoJ2FyaWEtaGlkZGVuJywgVUkuJCh0aGlzKS5oYXNDbGFzcygndWstaGlkZGVuJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pKFVJa2l0KTtcbiJdfQ==