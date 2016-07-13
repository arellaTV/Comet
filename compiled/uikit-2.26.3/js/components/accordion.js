"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {
    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-accordion", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('accordion', {

        defaults: {
            showfirst: true,
            collapse: true,
            animate: true,
            easing: 'swing',
            duration: 300,
            toggle: '.uk-accordion-title',
            containers: '.uk-accordion-content',
            clsactive: 'uk-active'
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                setTimeout(function () {

                    UI.$("[data-uk-accordion]", context).each(function () {

                        var ele = UI.$(this);

                        if (!ele.data("accordion")) {
                            UI.accordion(ele, UI.Utils.options(ele.attr('data-uk-accordion')));
                        }
                    });
                }, 0);
            });
        },

        init: function init() {

            var $this = this;

            this.element.on('click.uk.accordion', this.options.toggle, function (e) {

                e.preventDefault();

                $this.toggleItem(UI.$(this).data('wrapper'), $this.options.animate, $this.options.collapse);
            });

            this.update();

            if (this.options.showfirst) {
                this.toggleItem(this.toggle.eq(0).data('wrapper'), false, false);
            }
        },

        toggleItem: function toggleItem(wrapper, animated, collapse) {

            var $this = this;

            wrapper.data('toggle').toggleClass(this.options.clsactive);
            wrapper.data('content').toggleClass(this.options.clsactive);

            var active = wrapper.data('toggle').hasClass(this.options.clsactive);

            if (collapse) {
                this.toggle.not(wrapper.data('toggle')).removeClass(this.options.clsactive);
                this.content.not(wrapper.data('content')).removeClass(this.options.clsactive).parent().stop().css('overflow', 'hidden').animate({ height: 0 }, { easing: this.options.easing, duration: animated ? this.options.duration : 0 }).attr('aria-expanded', 'false');
            }

            wrapper.stop().css('overflow', 'hidden');

            if (animated) {

                wrapper.animate({ height: active ? getHeight(wrapper.data('content')) : 0 }, { easing: this.options.easing, duration: this.options.duration, complete: function complete() {

                        if (active) {
                            wrapper.css({ 'overflow': '', 'height': 'auto' });
                            UI.Utils.checkDisplay(wrapper.data('content'));
                        }

                        $this.trigger('display.uk.check');
                    } });
            } else {

                wrapper.height(active ? 'auto' : 0);

                if (active) {
                    wrapper.css({ 'overflow': '' });
                    UI.Utils.checkDisplay(wrapper.data('content'));
                }

                this.trigger('display.uk.check');
            }

            // Update ARIA
            wrapper.attr('aria-expanded', active);

            this.element.trigger('toggle.uk.accordion', [active, wrapper.data('toggle'), wrapper.data('content')]);
        },

        update: function update() {

            var $this = this,
                $content,
                $wrapper,
                $toggle;

            this.toggle = this.find(this.options.toggle);
            this.content = this.find(this.options.containers);

            this.content.each(function (index) {

                $content = UI.$(this);

                if ($content.parent().data('wrapper')) {
                    $wrapper = $content.parent();
                } else {
                    $wrapper = UI.$(this).wrap('<div data-wrapper="true" style="overflow:hidden;height:0;position:relative;"></div>').parent();

                    // Init ARIA
                    $wrapper.attr('aria-expanded', 'false');
                }

                $toggle = $this.toggle.eq(index);

                $wrapper.data('toggle', $toggle);
                $wrapper.data('content', $content);
                $toggle.data('wrapper', $wrapper);
                $content.data('wrapper', $wrapper);
            });

            this.element.trigger('update.uk.accordion', [this]);
        }

    });

    // helper

    function getHeight(ele) {

        var $ele = UI.$(ele),
            height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({ position: 'absolute', visibility: 'hidden', display: 'block' }).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    return UI.accordion;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjtBQUNiLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLGlCQUFQLEVBQTBCLENBQUMsT0FBRCxDQUExQixFQUFxQyxZQUFVO0FBQzNDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBQ0osQ0FaRCxFQVlHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLE9BQUcsU0FBSCxDQUFhLFdBQWIsRUFBMEI7O0FBRXRCLGtCQUFVO0FBQ04sdUJBQWEsSUFEUDtBQUVOLHNCQUFhLElBRlA7QUFHTixxQkFBYSxJQUhQO0FBSU4sb0JBQWEsT0FKUDtBQUtOLHNCQUFhLEdBTFA7QUFNTixvQkFBYSxxQkFOUDtBQU9OLHdCQUFhLHVCQVBQO0FBUU4sdUJBQWE7QUFSUCxTQUZZOztBQWF0QixjQUFPLGdCQUFXOzs7QUFHZCxlQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7O0FBRXZCLDJCQUFXLFlBQVU7O0FBRWpCLHVCQUFHLENBQUgsQ0FBSyxxQkFBTCxFQUE0QixPQUE1QixFQUFxQyxJQUFyQyxDQUEwQyxZQUFVOztBQUVoRCw0QkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjs7QUFFQSw0QkFBRyxDQUFDLElBQUksSUFBSixDQUFTLFdBQVQsQ0FBSixFQUEyQjtBQUN2QiwrQkFBRyxTQUFILENBQWEsR0FBYixFQUFrQixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLG1CQUFULENBQWpCLENBQWxCO0FBQ0g7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LHlCQUFTLElBQVQsQ0FBYyxTQUFkLEVBQXlCLFFBQXpCO0FBQ0Esd0JBQVEsSUFBUixDQUFhLFNBQWIsRUFBd0IsUUFBeEI7QUFDQSx5QkFBUyxJQUFULENBQWMsU0FBZCxFQUF5QixRQUF6QjtBQUNILGFBbkJEOztBQXFCQSxpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixxQkFBckIsRUFBNEMsQ0FBQyxJQUFELENBQTVDO0FBQ0g7O0FBL0hxQixLQUExQjs7OztBQXFJQSxhQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0I7O0FBRXBCLFlBQUksT0FBTyxHQUFHLENBQUgsQ0FBSyxHQUFMLENBQVg7QUFBQSxZQUFzQixTQUFTLE1BQS9COztBQUVBLFlBQUksS0FBSyxFQUFMLENBQVEsVUFBUixDQUFKLEVBQXlCO0FBQ3JCLHFCQUFTLEtBQUssV0FBTCxFQUFUO0FBQ0gsU0FGRCxNQUVPOztBQUVILGdCQUFJLE1BQU07QUFDTiwwQkFBYSxLQUFLLEdBQUwsQ0FBUyxVQUFULENBRFA7QUFFTiw0QkFBYSxLQUFLLEdBQUwsQ0FBUyxZQUFULENBRlA7QUFHTix5QkFBYSxLQUFLLEdBQUwsQ0FBUyxTQUFUO0FBSFAsYUFBVjs7QUFNQSxxQkFBUyxLQUFLLEdBQUwsQ0FBUyxFQUFDLFVBQVUsVUFBWCxFQUF1QixZQUFZLFFBQW5DLEVBQTZDLFNBQVMsT0FBdEQsRUFBVCxFQUF5RSxXQUF6RSxFQUFUOztBQUVBLGlCQUFLLEdBQUwsQ0FBUyxHQUFULEU7QUFDSDs7QUFFRCxlQUFPLE1BQVA7QUFDSDs7QUFFRCxXQUFPLEdBQUcsU0FBVjtBQUNILENBNUtEIiwiZmlsZSI6ImFjY29yZGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1hY2NvcmRpb25cIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBVSS5jb21wb25lbnQoJ2FjY29yZGlvbicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgc2hvd2ZpcnN0ICA6IHRydWUsXG4gICAgICAgICAgICBjb2xsYXBzZSAgIDogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGUgICAgOiB0cnVlLFxuICAgICAgICAgICAgZWFzaW5nICAgICA6ICdzd2luZycsXG4gICAgICAgICAgICBkdXJhdGlvbiAgIDogMzAwLFxuICAgICAgICAgICAgdG9nZ2xlICAgICA6ICcudWstYWNjb3JkaW9uLXRpdGxlJyxcbiAgICAgICAgICAgIGNvbnRhaW5lcnMgOiAnLnVrLWFjY29yZGlvbi1jb250ZW50JyxcbiAgICAgICAgICAgIGNsc2FjdGl2ZSAgOiAndWstYWN0aXZlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6ICBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLWFjY29yZGlvbl1cIiwgY29udGV4dCkuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWVsZS5kYXRhKFwiYWNjb3JkaW9uXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVUkuYWNjb3JkaW9uKGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cignZGF0YS11ay1hY2NvcmRpb24nKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5vbignY2xpY2sudWsuYWNjb3JkaW9uJywgdGhpcy5vcHRpb25zLnRvZ2dsZSwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMudG9nZ2xlSXRlbShVSS4kKHRoaXMpLmRhdGEoJ3dyYXBwZXInKSwgJHRoaXMub3B0aW9ucy5hbmltYXRlLCAkdGhpcy5vcHRpb25zLmNvbGxhcHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dmaXJzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLnRvZ2dsZS5lcSgwKS5kYXRhKCd3cmFwcGVyJyksIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlSXRlbTogZnVuY3Rpb24od3JhcHBlciwgYW5pbWF0ZWQsIGNvbGxhcHNlKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdyYXBwZXIuZGF0YSgndG9nZ2xlJykudG9nZ2xlQ2xhc3ModGhpcy5vcHRpb25zLmNsc2FjdGl2ZSk7XG4gICAgICAgICAgICB3cmFwcGVyLmRhdGEoJ2NvbnRlbnQnKS50b2dnbGVDbGFzcyh0aGlzLm9wdGlvbnMuY2xzYWN0aXZlKTtcblxuICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IHdyYXBwZXIuZGF0YSgndG9nZ2xlJykuaGFzQ2xhc3ModGhpcy5vcHRpb25zLmNsc2FjdGl2ZSk7XG5cbiAgICAgICAgICAgIGlmIChjb2xsYXBzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlLm5vdCh3cmFwcGVyLmRhdGEoJ3RvZ2dsZScpKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xzYWN0aXZlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubm90KHdyYXBwZXIuZGF0YSgnY29udGVudCcpKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xzYWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KCkuc3RvcCgpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJykuYW5pbWF0ZSh7IGhlaWdodDogMCB9LCB7ZWFzaW5nOiB0aGlzLm9wdGlvbnMuZWFzaW5nLCBkdXJhdGlvbjogYW5pbWF0ZWQgPyB0aGlzLm9wdGlvbnMuZHVyYXRpb24gOiAwfSkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cmFwcGVyLnN0b3AoKS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuXG4gICAgICAgICAgICBpZiAoYW5pbWF0ZWQpIHtcblxuICAgICAgICAgICAgICAgIHdyYXBwZXIuYW5pbWF0ZSh7IGhlaWdodDogYWN0aXZlID8gZ2V0SGVpZ2h0KHdyYXBwZXIuZGF0YSgnY29udGVudCcpKSA6IDAgfSwge2Vhc2luZzogdGhpcy5vcHRpb25zLmVhc2luZywgZHVyYXRpb246IHRoaXMub3B0aW9ucy5kdXJhdGlvbiwgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuY3NzKHsnb3ZlcmZsb3cnOiAnJywgJ2hlaWdodCc6ICdhdXRvJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KHdyYXBwZXIuZGF0YSgnY29udGVudCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2Rpc3BsYXkudWsuY2hlY2snKTtcbiAgICAgICAgICAgICAgICB9fSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB3cmFwcGVyLmhlaWdodChhY3RpdmUgPyAnYXV0bycgOiAwKTtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5jc3MoeydvdmVyZmxvdyc6ICcnfSk7XG4gICAgICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSh3cmFwcGVyLmRhdGEoJ2NvbnRlbnQnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdkaXNwbGF5LnVrLmNoZWNrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBBUklBXG4gICAgICAgICAgICB3cmFwcGVyLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBhY3RpdmUpO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcigndG9nZ2xlLnVrLmFjY29yZGlvbicsIFthY3RpdmUsIHdyYXBwZXIuZGF0YSgndG9nZ2xlJyksIHdyYXBwZXIuZGF0YSgnY29udGVudCcpXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgJGNvbnRlbnQsICR3cmFwcGVyLCAkdG9nZ2xlO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSA9IHRoaXMuZmluZCh0aGlzLm9wdGlvbnMudG9nZ2xlKTtcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVycyk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgICAgICAgICAkY29udGVudCA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGNvbnRlbnQucGFyZW50KCkuZGF0YSgnd3JhcHBlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJGNvbnRlbnQucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIgPSBVSS4kKHRoaXMpLndyYXAoJzxkaXYgZGF0YS13cmFwcGVyPVwidHJ1ZVwiIHN0eWxlPVwib3ZlcmZsb3c6aGlkZGVuO2hlaWdodDowO3Bvc2l0aW9uOnJlbGF0aXZlO1wiPjwvZGl2PicpLnBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluaXQgQVJJQVxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRvZ2dsZSA9ICR0aGlzLnRvZ2dsZS5lcShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAkd3JhcHBlci5kYXRhKCd0b2dnbGUnLCAkdG9nZ2xlKTtcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5kYXRhKCdjb250ZW50JywgJGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICR0b2dnbGUuZGF0YSgnd3JhcHBlcicsICR3cmFwcGVyKTtcbiAgICAgICAgICAgICAgICAkY29udGVudC5kYXRhKCd3cmFwcGVyJywgJHdyYXBwZXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCd1cGRhdGUudWsuYWNjb3JkaW9uJywgW3RoaXNdKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAvLyBoZWxwZXJcblxuICAgIGZ1bmN0aW9uIGdldEhlaWdodChlbGUpIHtcblxuICAgICAgICB2YXIgJGVsZSA9IFVJLiQoZWxlKSwgaGVpZ2h0ID0gXCJhdXRvXCI7XG5cbiAgICAgICAgaWYgKCRlbGUuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsZS5vdXRlckhlaWdodCgpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgdG1wID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICAgOiAkZWxlLmNzcyhcInBvc2l0aW9uXCIpLFxuICAgICAgICAgICAgICAgIHZpc2liaWxpdHkgOiAkZWxlLmNzcyhcInZpc2liaWxpdHlcIiksXG4gICAgICAgICAgICAgICAgZGlzcGxheSAgICA6ICRlbGUuY3NzKFwiZGlzcGxheVwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsZS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJywgZGlzcGxheTogJ2Jsb2NrJ30pLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICRlbGUuY3NzKHRtcCk7IC8vIHJlc2V0IGVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVJLmFjY29yZGlvbjtcbn0pO1xuIl19