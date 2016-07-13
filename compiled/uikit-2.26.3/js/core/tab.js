'use strict';

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    UI.component('tab', {

        defaults: {
            'target': '>li:not(.uk-tab-responsive, .uk-disabled)',
            'connect': false,
            'active': 0,
            'animation': false,
            'duration': 200,
            'swiping': true
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-tab]", context).each(function () {

                    var tab = UI.$(this);

                    if (!tab.data("tab")) {
                        var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-uk-tab")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.current = false;

            this.on("click.uk.tab", this.options.target, function (e) {

                e.preventDefault();

                if ($this.switcher && $this.switcher.animating) {
                    return;
                }

                var current = $this.find($this.options.target).not(this);

                current.removeClass("uk-active").blur();

                $this.trigger("change.uk.tab", [UI.$(this).addClass("uk-active"), $this.current]);

                $this.current = UI.$(this);

                // Update ARIA
                if (!$this.options.connect) {
                    current.attr('aria-expanded', 'false');
                    UI.$(this).attr('aria-expanded', 'true');
                }
            });

            if (this.options.connect) {
                this.connect = UI.$(this.options.connect);
            }

            // init responsive tab
            this.responsivetab = UI.$('<li class="uk-tab-responsive uk-active"><a></a></li>').append('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>');

            this.responsivetab.dropdown = this.responsivetab.find('.uk-dropdown');
            this.responsivetab.lst = this.responsivetab.dropdown.find('ul');
            this.responsivetab.caption = this.responsivetab.find('a:first');

            if (this.element.hasClass("uk-tab-bottom")) this.responsivetab.dropdown.addClass("uk-dropdown-up");

            // handle click
            this.responsivetab.lst.on('click.uk.tab', 'a', function (e) {

                e.preventDefault();
                e.stopPropagation();

                var link = UI.$(this);

                $this.element.children('li:not(.uk-tab-responsive)').eq(link.data('index')).trigger('click');
            });

            this.on('show.uk.switcher change.uk.tab', function (e, tab) {
                $this.responsivetab.caption.html(tab.text());
            });

            this.element.append(this.responsivetab);

            // init UIkit components
            if (this.options.connect) {
                this.switcher = UI.switcher(this.element, {
                    'toggle': '>li:not(.uk-tab-responsive)',
                    'connect': this.options.connect,
                    'active': this.options.active,
                    'animation': this.options.animation,
                    'duration': this.options.duration,
                    'swiping': this.options.swiping
                });
            }

            UI.dropdown(this.responsivetab, { "mode": "click", "preventflip": "y" });

            // init
            $this.trigger("change.uk.tab", [this.element.find(this.options.target).not('.uk-tab-responsive').filter('.uk-active')]);

            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function () {
                if ($this.element.is(":visible")) $this.check();
            }, 100));

            this.on('display.uk.check', function () {
                if ($this.element.is(":visible")) $this.check();
            });
        },

        check: function check() {

            var children = this.element.children('li:not(.uk-tab-responsive)').removeClass('uk-hidden');

            if (!children.length) {
                this.responsivetab.addClass('uk-hidden');
                return;
            }

            var top = children.eq(0).offset().top + Math.ceil(children.eq(0).height() / 2),
                doresponsive = false,
                item,
                link,
                clone;

            this.responsivetab.lst.empty();

            children.each(function () {

                if (UI.$(this).offset().top > top) {
                    doresponsive = true;
                }
            });

            if (doresponsive) {

                for (var i = 0; i < children.length; i++) {

                    item = UI.$(children.eq(i));
                    link = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('uk-dropdown')) {

                        if (!item.hasClass('uk-disabled')) {

                            clone = item[0].outerHTML.replace('<a ', '<a data-index="' + i + '" ');

                            this.responsivetab.lst.append(clone);
                        }

                        item.addClass('uk-hidden');
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children('li').length ? 'removeClass' : 'addClass']('uk-hidden');
        }
    });
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3RhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsRUFBVCxFQUFhOztBQUVWOztBQUVBLE9BQUcsU0FBSCxDQUFhLEtBQWIsRUFBb0I7O0FBRWhCLGtCQUFVO0FBQ04sc0JBQWMsMkNBRFI7QUFFTix1QkFBYyxLQUZSO0FBR04sc0JBQWMsQ0FIUjtBQUlOLHlCQUFjLEtBSlI7QUFLTix3QkFBYyxHQUxSO0FBTU4sdUJBQWM7QUFOUixTQUZNOztBQVdoQixjQUFNLGdCQUFXOzs7QUFHYixlQUFHLEtBQUgsQ0FBUyxVQUFTLE9BQVQsRUFBa0I7O0FBRXZCLG1CQUFHLENBQUgsQ0FBSyxlQUFMLEVBQXNCLE9BQXRCLEVBQStCLElBQS9CLENBQW9DLFlBQVc7O0FBRTNDLHdCQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLHdCQUFJLENBQUMsSUFBSSxJQUFKLENBQVMsS0FBVCxDQUFMLEVBQXNCO0FBQ2xCLDRCQUFJLE1BQU0sR0FBRyxHQUFILENBQU8sR0FBUCxFQUFZLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsYUFBVCxDQUFqQixDQUFaLENBQVY7QUFDSDtBQUNKLGlCQVBEO0FBUUgsYUFWRDtBQVdILFNBekJlOztBQTJCaEIsY0FBTSxnQkFBVzs7QUFFYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssT0FBTCxHQUFlLEtBQWY7O0FBRUEsaUJBQUssRUFBTCxDQUFRLGNBQVIsRUFBd0IsS0FBSyxPQUFMLENBQWEsTUFBckMsRUFBNkMsVUFBUyxDQUFULEVBQVk7O0FBRXJELGtCQUFFLGNBQUY7O0FBRUEsb0JBQUksTUFBTSxRQUFOLElBQWtCLE1BQU0sUUFBTixDQUFlLFNBQXJDLEVBQWdEO0FBQzVDO0FBQ0g7O0FBRUQsb0JBQUksVUFBVSxNQUFNLElBQU4sQ0FBVyxNQUFNLE9BQU4sQ0FBYyxNQUF6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LEdBQTBCLEdBQTlCLEVBQW1DO0FBQy9CLG1DQUFlLElBQWY7QUFDSDtBQUNKLGFBTEQ7O0FBT0EsZ0JBQUksWUFBSixFQUFrQjs7QUFFZCxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7O0FBRXRDLDJCQUFRLEdBQUcsQ0FBSCxDQUFLLFNBQVMsRUFBVCxDQUFZLENBQVosQ0FBTCxDQUFSO0FBQ0EsMkJBQVEsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFSOztBQUVBLHdCQUFJLEtBQUssR0FBTCxDQUFTLE9BQVQsS0FBcUIsTUFBckIsSUFBK0IsQ0FBQyxLQUFLLElBQUwsQ0FBVSxhQUFWLENBQXBDLEVBQThEOztBQUUxRCw0QkFBSSxDQUFDLEtBQUssUUFBTCxDQUFjLGFBQWQsQ0FBTCxFQUFtQzs7QUFFL0Isb0NBQVEsS0FBSyxDQUFMLEVBQVEsU0FBUixDQUFrQixPQUFsQixDQUEwQixLQUExQixFQUFpQyxvQkFBa0IsQ0FBbEIsR0FBb0IsSUFBckQsQ0FBUjs7QUFFQSxpQ0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLE1BQXZCLENBQThCLEtBQTlCO0FBQ0g7O0FBRUQsNkJBQUssUUFBTCxDQUFjLFdBQWQ7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsaUJBQUssYUFBTCxDQUFtQixLQUFLLGFBQUwsQ0FBbUIsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FBZ0MsSUFBaEMsRUFBc0MsTUFBdEMsR0FBK0MsYUFBL0MsR0FBNkQsVUFBaEYsRUFBNEYsV0FBNUY7QUFDSDtBQTlKZSxLQUFwQjtBQWlLSCxDQXJLRCxFQXFLRyxLQXJLSCIsImZpbGUiOiJ0YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oVUkpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgVUkuY29tcG9uZW50KCd0YWInLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICd0YXJnZXQnICAgIDogJz5saTpub3QoLnVrLXRhYi1yZXNwb25zaXZlLCAudWstZGlzYWJsZWQpJyxcbiAgICAgICAgICAgICdjb25uZWN0JyAgIDogZmFsc2UsXG4gICAgICAgICAgICAnYWN0aXZlJyAgICA6IDAsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJyA6IGZhbHNlLFxuICAgICAgICAgICAgJ2R1cmF0aW9uJyAgOiAyMDAsXG4gICAgICAgICAgICAnc3dpcGluZycgICA6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstdGFiXVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWIgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFiLmRhdGEoXCJ0YWJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBVSS50YWIodGFiLCBVSS5VdGlscy5vcHRpb25zKHRhYi5hdHRyKFwiZGF0YS11ay10YWJcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2sudWsudGFiXCIsIHRoaXMub3B0aW9ucy50YXJnZXQsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5zd2l0Y2hlciAmJiAkdGhpcy5zd2l0Y2hlci5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJHRoaXMuZmluZCgkdGhpcy5vcHRpb25zLnRhcmdldCkubm90KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudC5yZW1vdmVDbGFzcyhcInVrLWFjdGl2ZVwiKS5ibHVyKCk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwiY2hhbmdlLnVrLnRhYlwiLCBbVUkuJCh0aGlzKS5hZGRDbGFzcyhcInVrLWFjdGl2ZVwiKSwgJHRoaXMuY3VycmVudF0pO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMuY3VycmVudCA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgQVJJQVxuICAgICAgICAgICAgICAgIGlmICghJHRoaXMub3B0aW9ucy5jb25uZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgICAgICBVSS4kKHRoaXMpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3QgPSBVSS4kKHRoaXMub3B0aW9ucy5jb25uZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaW5pdCByZXNwb25zaXZlIHRhYlxuICAgICAgICAgICAgdGhpcy5yZXNwb25zaXZldGFiID0gVUkuJCgnPGxpIGNsYXNzPVwidWstdGFiLXJlc3BvbnNpdmUgdWstYWN0aXZlXCI+PGE+PC9hPjwvbGk+JykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwidWstZHJvcGRvd24gdWstZHJvcGRvd24tc21hbGxcIj48dWwgY2xhc3M9XCJ1ay1uYXYgdWstbmF2LWRyb3Bkb3duXCI+PC91bD48ZGl2PicpO1xuXG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNpdmV0YWIuZHJvcGRvd24gPSB0aGlzLnJlc3BvbnNpdmV0YWIuZmluZCgnLnVrLWRyb3Bkb3duJyk7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNpdmV0YWIubHN0ICAgICAgPSB0aGlzLnJlc3BvbnNpdmV0YWIuZHJvcGRvd24uZmluZCgndWwnKTtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZXRhYi5jYXB0aW9uICA9IHRoaXMucmVzcG9uc2l2ZXRhYi5maW5kKCdhOmZpcnN0Jyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoXCJ1ay10YWItYm90dG9tXCIpKSB0aGlzLnJlc3BvbnNpdmV0YWIuZHJvcGRvd24uYWRkQ2xhc3MoXCJ1ay1kcm9wZG93bi11cFwiKTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIGNsaWNrXG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNpdmV0YWIubHN0Lm9uKCdjbGljay51ay50YWInLCAnYScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5jaGlsZHJlbignbGk6bm90KC51ay10YWItcmVzcG9uc2l2ZSknKS5lcShsaW5rLmRhdGEoJ2luZGV4JykpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vbignc2hvdy51ay5zd2l0Y2hlciBjaGFuZ2UudWsudGFiJywgZnVuY3Rpb24oZSwgdGFiKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMucmVzcG9uc2l2ZXRhYi5jYXB0aW9uLmh0bWwodGFiLnRleHQoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZCh0aGlzLnJlc3BvbnNpdmV0YWIpO1xuXG4gICAgICAgICAgICAvLyBpbml0IFVJa2l0IGNvbXBvbmVudHNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29ubmVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoZXIgPSBVSS5zd2l0Y2hlcih0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgJ3RvZ2dsZScgICAgOiAnPmxpOm5vdCgudWstdGFiLXJlc3BvbnNpdmUpJyxcbiAgICAgICAgICAgICAgICAgICAgJ2Nvbm5lY3QnICAgOiB0aGlzLm9wdGlvbnMuY29ubmVjdCxcbiAgICAgICAgICAgICAgICAgICAgJ2FjdGl2ZScgICAgOiB0aGlzLm9wdGlvbnMuYWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAnYW5pbWF0aW9uJyA6IHRoaXMub3B0aW9ucy5hbmltYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICdkdXJhdGlvbicgIDogdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAnc3dpcGluZycgICA6IHRoaXMub3B0aW9ucy5zd2lwaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFVJLmRyb3Bkb3duKHRoaXMucmVzcG9uc2l2ZXRhYiwge1wibW9kZVwiOiBcImNsaWNrXCIsIFwicHJldmVudGZsaXBcIjogXCJ5XCJ9KTtcblxuICAgICAgICAgICAgLy8gaW5pdFxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcihcImNoYW5nZS51ay50YWJcIiwgW3RoaXMuZWxlbWVudC5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpLm5vdCgnLnVrLXRhYi1yZXNwb25zaXZlJykuZmlsdGVyKCcudWstYWN0aXZlJyldKTtcblxuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpICAkdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgfSwgMTAwKSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2Rpc3BsYXkudWsuY2hlY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpICAkdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW4oJ2xpOm5vdCgudWstdGFiLXJlc3BvbnNpdmUpJykucmVtb3ZlQ2xhc3MoJ3VrLWhpZGRlbicpO1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZXRhYi5hZGRDbGFzcygndWstaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdG9wICAgICAgICAgID0gKGNoaWxkcmVuLmVxKDApLm9mZnNldCgpLnRvcCArIE1hdGguY2VpbChjaGlsZHJlbi5lcSgwKS5oZWlnaHQoKS8yKSksXG4gICAgICAgICAgICAgICAgZG9yZXNwb25zaXZlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbSwgbGluaywgY2xvbmU7XG5cbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZXRhYi5sc3QuZW1wdHkoKTtcblxuICAgICAgICAgICAgY2hpbGRyZW4uZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYgKFVJLiQodGhpcykub2Zmc2V0KCkudG9wID4gdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvcmVzcG9uc2l2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChkb3Jlc3BvbnNpdmUpIHtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBpdGVtICA9IFVJLiQoY2hpbGRyZW4uZXEoaSkpO1xuICAgICAgICAgICAgICAgICAgICBsaW5rICA9IGl0ZW0uZmluZCgnYScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNzcygnZmxvYXQnKSAhPSAnbm9uZScgJiYgIWl0ZW0uYXR0cigndWstZHJvcGRvd24nKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uaGFzQ2xhc3MoJ3VrLWRpc2FibGVkJykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gaXRlbVswXS5vdXRlckhUTUwucmVwbGFjZSgnPGEgJywgJzxhIGRhdGEtaW5kZXg9XCInK2krJ1wiICcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNwb25zaXZldGFiLmxzdC5hcHBlbmQoY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmFkZENsYXNzKCd1ay1oaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXNwb25zaXZldGFiW3RoaXMucmVzcG9uc2l2ZXRhYi5sc3QuY2hpbGRyZW4oJ2xpJykubGVuZ3RoID8gJ3JlbW92ZUNsYXNzJzonYWRkQ2xhc3MnXSgndWstaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoVUlraXQpO1xuIl19