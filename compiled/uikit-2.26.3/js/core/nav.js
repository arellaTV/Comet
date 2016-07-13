"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            "toggle": ">li.uk-parent > a[href='#']",
            "lists": ">li.uk-parent > ul",
            "multiple": false
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-nav]", context).each(function () {
                    var nav = UI.$(this);

                    if (!nav.data("nav")) {
                        var obj = UI.nav(nav, UI.Utils.options(nav.attr("data-uk-nav")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.on("click.uk.nav", this.options.toggle, function (e) {
                e.preventDefault();
                var ele = UI.$(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.find(this.options.lists).each(function () {
                var $ele = UI.$(this),
                    parent = $ele.parent(),
                    active = parent.hasClass("uk-active");

                $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                parent.data("list-container", $ele.parent()[active ? 'removeClass' : 'addClass']('uk-hidden'));

                // Init ARIA
                parent.attr('aria-expanded', parent.hasClass("uk-open"));

                if (active) $this.open(parent, true);
            });
        },

        open: function open(li, noanimation) {

            var $this = this,
                element = this.element,
                $li = UI.$(li),
                $container = $li.data('list-container');

            if (!this.options.multiple) {

                element.children('.uk-open').not(li).each(function () {

                    var ele = UI.$(this);

                    if (ele.data('list-container')) {
                        ele.data('list-container').stop().animate({ height: 0 }, function () {
                            UI.$(this).parent().removeClass('uk-open').end().addClass('uk-hidden');
                        });
                    }
                });
            }

            $li.toggleClass('uk-open');

            // Update ARIA
            $li.attr('aria-expanded', $li.hasClass('uk-open'));

            if ($container) {

                if ($li.hasClass('uk-open')) {
                    $container.removeClass('uk-hidden');
                }

                if (noanimation) {

                    $container.stop().height($li.hasClass('uk-open') ? 'auto' : 0);

                    if (!$li.hasClass('uk-open')) {
                        $container.addClass('uk-hidden');
                    }

                    this.trigger('display.uk.check');
                } else {

                    $container.stop().animate({
                        height: $li.hasClass('uk-open') ? getHeight($container.find('ul:first')) : 0
                    }, function () {

                        if (!$li.hasClass('uk-open')) {
                            $container.addClass('uk-hidden');
                        } else {
                            $container.css('height', '');
                        }

                        $this.trigger('display.uk.check');
                    });
                }
            }
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
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL25hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFhOztBQUVWOztBQUVBLE9BQUcsU0FBSCxDQUFhLEtBQWIsRUFBb0I7O0FBRWhCLGtCQUFVO0FBQ04sc0JBQVUsNkJBREo7QUFFTixxQkFBUyxvQkFGSDtBQUdOLHdCQUFZO0FBSE4sU0FGTTs7QUFRaEIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUssZUFBTCxFQUFzQixPQUF0QixFQUErQixJQUEvQixDQUFvQyxZQUFXO0FBQzNDLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFJLENBQUMsSUFBSSxJQUFKLENBQVMsS0FBVCxDQUFMLEVBQXNCO0FBQ2xCLDRCQUFJLE1BQU0sR0FBRyxHQUFILENBQU8sR0FBUCxFQUFZLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsYUFBVCxDQUFqQixDQUFaLENBQVY7QUFDSDtBQUNKLGlCQU5EO0FBT0gsYUFURDtBQVVILFNBckJlOztBQXVCaEIsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssRUFBTCxDQUFRLGNBQVIsRUFBd0IsS0FBSyxPQUFMLENBQWEsTUFBckMsRUFBNkMsVUFBUyxDQUFULEVBQVk7QUFDckQsa0JBQUUsY0FBRjtBQUNBLG9CQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWO0FBQ0Esc0JBQU0sSUFBTixDQUFXLElBQUksTUFBSixHQUFhLENBQWIsS0FBbUIsTUFBTSxPQUFOLENBQWMsQ0FBZCxDQUFuQixHQUFzQyxHQUF0QyxHQUE0QyxJQUFJLE1BQUosQ0FBVyxJQUFYLENBQXZEO0FBQ0gsYUFKRDs7QUFNQSxpQkFBSyxJQUFMLENBQVUsS0FB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QW5CLEVBQXdCO0FBQ3BCLFlBQUksT0FBTyxHQUFHLENBQUgsQ0FBSyxHQUFMLENBQVg7QUFBQSxZQUFzQixTQUFTLE1BQS9COztBQUVBLFlBQUksS0FBSyxFQUFMLENBQVEsVUFBUixDQUFKLEVBQXlCO0FBQ3JCLHFCQUFTLEtBQUssV0FBTCxFQUFUO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsZ0JBQUksTUFBTTtBQUNOLDBCQUFVLEtBQUssR0FBTCxDQUFTLFVBQVQsQ0FESjtBQUVOLDRCQUFZLEtBQUssR0FBTCxDQUFTLFlBQVQsQ0FGTjtBQUdOLHlCQUFTLEtBQUssR0FBTCxDQUFTLFNBQVQ7QUFISCxhQUFWOztBQU1BLHFCQUFTLEtBQUssR0FBTCxDQUFTLEVBQUMsVUFBVSxVQUFYLEVBQXVCLFlBQVksUUFBbkMsRUFBNkMsU0FBUyxPQUF0RCxFQUFULEVBQXlFLFdBQXpFLEVBQVQ7O0FBRUEsaUJBQUssR0FBTCxDQUFTLEdBQVQsRTtBQUNIOztBQUVELGVBQU8sTUFBUDtBQUNIO0FBRUosQ0F0SUQsRUFzSUcsS0F0SUgiLCJmaWxlIjoibmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIFVJLmNvbXBvbmVudCgnbmF2Jywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBcInRvZ2dsZVwiOiBcIj5saS51ay1wYXJlbnQgPiBhW2hyZWY9JyMnXVwiLFxuICAgICAgICAgICAgXCJsaXN0c1wiOiBcIj5saS51ay1wYXJlbnQgPiB1bFwiLFxuICAgICAgICAgICAgXCJtdWx0aXBsZVwiOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoXCJbZGF0YS11ay1uYXZdXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYXYgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmF2LmRhdGEoXCJuYXZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBVSS5uYXYobmF2LCBVSS5VdGlscy5vcHRpb25zKG5hdi5hdHRyKFwiZGF0YS11ay1uYXZcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJjbGljay51ay5uYXZcIiwgdGhpcy5vcHRpb25zLnRvZ2dsZSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5vcGVuKGVsZS5wYXJlbnQoKVswXSA9PSAkdGhpcy5lbGVtZW50WzBdID8gZWxlIDogZWxlLnBhcmVudChcImxpXCIpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmZpbmQodGhpcy5vcHRpb25zLmxpc3RzKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkZWxlICAgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSAkZWxlLnBhcmVudCgpLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBwYXJlbnQuaGFzQ2xhc3MoXCJ1ay1hY3RpdmVcIik7XG5cbiAgICAgICAgICAgICAgICAkZWxlLndyYXAoJzxkaXYgc3R5bGU9XCJvdmVyZmxvdzpoaWRkZW47aGVpZ2h0OjA7cG9zaXRpb246cmVsYXRpdmU7XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgcGFyZW50LmRhdGEoXCJsaXN0LWNvbnRhaW5lclwiLCAkZWxlLnBhcmVudCgpW2FjdGl2ZSA/ICdyZW1vdmVDbGFzcyc6J2FkZENsYXNzJ10oJ3VrLWhpZGRlbicpKTtcblxuICAgICAgICAgICAgICAgIC8vIEluaXQgQVJJQVxuICAgICAgICAgICAgICAgIHBhcmVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgcGFyZW50Lmhhc0NsYXNzKFwidWstb3BlblwiKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlKSAkdGhpcy5vcGVuKHBhcmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIG9wZW46IGZ1bmN0aW9uKGxpLCBub2FuaW1hdGlvbikge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzLCBlbGVtZW50ID0gdGhpcy5lbGVtZW50LCAkbGkgPSBVSS4kKGxpKSwgJGNvbnRhaW5lciA9ICRsaS5kYXRhKCdsaXN0LWNvbnRhaW5lcicpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5tdWx0aXBsZSkge1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbignLnVrLW9wZW4nKS5ub3QobGkpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZS5kYXRhKCdsaXN0LWNvbnRhaW5lcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUuZGF0YSgnbGlzdC1jb250YWluZXInKS5zdG9wKCkuYW5pbWF0ZSh7aGVpZ2h0OiAwfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVUkuJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygndWstb3BlbicpLmVuZCgpLmFkZENsYXNzKCd1ay1oaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsaS50b2dnbGVDbGFzcygndWstb3BlbicpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgQVJJQVxuICAgICAgICAgICAgJGxpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAkbGkuaGFzQ2xhc3MoJ3VrLW9wZW4nKSk7XG5cbiAgICAgICAgICAgIGlmICgkY29udGFpbmVyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGxpLmhhc0NsYXNzKCd1ay1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygndWstaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5vYW5pbWF0aW9uKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5zdG9wKCkuaGVpZ2h0KCRsaS5oYXNDbGFzcygndWstb3BlbicpID8gJ2F1dG8nIDogMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbGkuaGFzQ2xhc3MoJ3VrLW9wZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygndWstaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2Rpc3BsYXkudWsuY2hlY2snKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICgkbGkuaGFzQ2xhc3MoJ3VrLW9wZW4nKSA/IGdldEhlaWdodCgkY29udGFpbmVyLmZpbmQoJ3VsOmZpcnN0JykpIDogMClcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJGxpLmhhc0NsYXNzKCd1ay1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCd1ay1oaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignZGlzcGxheS51ay5jaGVjaycpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gaGVscGVyXG5cbiAgICBmdW5jdGlvbiBnZXRIZWlnaHQoZWxlKSB7XG4gICAgICAgIHZhciAkZWxlID0gVUkuJChlbGUpLCBoZWlnaHQgPSBcImF1dG9cIjtcblxuICAgICAgICBpZiAoJGVsZS5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICBoZWlnaHQgPSAkZWxlLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdG1wID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkZWxlLmNzcyhcInBvc2l0aW9uXCIpLFxuICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICRlbGUuY3NzKFwidmlzaWJpbGl0eVwiKSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAkZWxlLmNzcyhcImRpc3BsYXlcIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGhlaWdodCA9ICRlbGUuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdmlzaWJpbGl0eTogJ2hpZGRlbicsIGRpc3BsYXk6ICdibG9jayd9KS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAkZWxlLmNzcyh0bXApOyAvLyByZXNldCBlbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxufSkoVUlraXQpO1xuIl19