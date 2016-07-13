"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-autocomplete", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var active;

    UI.component('autocomplete', {

        defaults: {
            minLength: 3,
            param: 'search',
            method: 'post',
            delay: 300,
            loadingClass: 'uk-loading',
            flipDropdown: false,
            skipClass: 'uk-skip',
            hoverClass: 'uk-active',
            source: null,
            renderer: null,

            // template

            template: '<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">{{~items}}<li data-value="{{$item.value}}"><a>{{$item.value}}</a></li>{{/items}}</ul>'
        },

        visible: false,
        value: null,
        selected: null,

        boot: function boot() {

            // init code
            UI.$html.on("focus.autocomplete.uikit", "[data-uk-autocomplete]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("autocomplete")) {
                    UI.autocomplete(ele, UI.Utils.options(ele.attr("data-uk-autocomplete")));
                }
            });

            // register outer click for autocompletes
            UI.$html.on("click.autocomplete.uikit", function (e) {
                if (active && e.target != active.input[0]) active.hide();
            });
        },

        init: function init() {

            var $this = this,
                select = false,
                trigger = UI.Utils.debounce(function (e) {
                if (select) {
                    return select = false;
                }
                $this.handle();
            }, this.options.delay);

            this.dropdown = this.find('.uk-dropdown');
            this.template = this.find('script[type="text/autocomplete"]').html();
            this.template = UI.Utils.template(this.template || this.options.template);
            this.input = this.find("input:first").attr("autocomplete", "off");

            if (!this.dropdown.length) {
                this.dropdown = UI.$('<div class="uk-dropdown"></div>').appendTo(this.element);
            }

            if (this.options.flipDropdown) {
                this.dropdown.addClass('uk-dropdown-flip');
            }

            this.dropdown.attr('aria-expanded', 'false');

            this.input.on({
                "keydown": function keydown(e) {

                    if (e && e.which && !e.shiftKey) {

                        switch (e.which) {
                            case 13:
                                // enter
                                select = true;

                                if ($this.selected) {
                                    e.preventDefault();
                                    $this.select();
                                }
                                break;
                            case 38:
                                // up
                                e.preventDefault();
                                $this.pick('prev', true);
                                break;
                            case 40:
                                // down
                                e.preventDefault();
                                $this.pick('next', true);
                                break;
                            case 27:
                            case 9:
                                // esc, tab
                                $this.hide();
                                break;
                            default:
                                break;
                        }
                    }
                },
                "keyup": trigger
            });

            this.dropdown.on("click", ".uk-autocomplete-results > *", function () {
                $this.select();
            });

            this.dropdown.on("mouseover", ".uk-autocomplete-results > *", function () {
                $this.pick(UI.$(this));
            });

            this.triggercomplete = trigger;
        },

        handle: function handle() {

            var $this = this,
                old = this.value;

            this.value = this.input.val();

            if (this.value.length < this.options.minLength) return this.hide();

            if (this.value != old) {
                $this.request();
            }

            return this;
        },

        pick: function pick(item, scrollinview) {

            var $this = this,
                items = UI.$(this.dropdown.find('.uk-autocomplete-results').children(':not(.' + this.options.skipClass + ')')),
                selected = false;

            if (typeof item !== "string" && !item.hasClass(this.options.skipClass)) {
                selected = item;
            } else if (item == 'next' || item == 'prev') {

                if (this.selected) {
                    var index = items.index(this.selected);

                    if (item == 'next') {
                        selected = items.eq(index + 1 < items.length ? index + 1 : 0);
                    } else {
                        selected = items.eq(index - 1 < 0 ? items.length - 1 : index - 1);
                    }
                } else {
                    selected = items[item == 'next' ? 'first' : 'last']();
                }

                selected = UI.$(selected);
            }

            if (selected && selected.length) {
                this.selected = selected;
                items.removeClass(this.options.hoverClass);
                this.selected.addClass(this.options.hoverClass);

                // jump to selected if not in view
                if (scrollinview) {

                    var top = selected.position().top,
                        scrollTop = $this.dropdown.scrollTop(),
                        dpheight = $this.dropdown.height();

                    if (top > dpheight || top < 0) {
                        $this.dropdown.scrollTop(scrollTop + top);
                    }
                }
            }
        },

        select: function select() {

            if (!this.selected) return;

            var data = this.selected.data();

            this.trigger("selectitem.uk.autocomplete", [data, this]);

            if (data.value) {
                this.input.val(data.value).trigger('change');
            }

            this.hide();
        },

        show: function show() {
            if (this.visible) return;
            this.visible = true;
            this.element.addClass("uk-open");

            if (active && active !== this) {
                active.hide();
            }

            active = this;

            // Update aria
            this.dropdown.attr('aria-expanded', 'true');

            return this;
        },

        hide: function hide() {
            if (!this.visible) return;
            this.visible = false;
            this.element.removeClass("uk-open");

            if (active === this) {
                active = false;
            }

            // Update aria
            this.dropdown.attr('aria-expanded', 'false');

            return this;
        },

        request: function request() {

            var $this = this,
                release = function release(data) {

                if (data) {
                    $this.render(data);
                }

                $this.element.removeClass($this.options.loadingClass);
            };

            this.element.addClass(this.options.loadingClass);

            if (this.options.source) {

                var source = this.options.source;

                switch (_typeof(this.options.source)) {
                    case 'function':

                        this.options.source.apply(this, [release]);

                        break;

                    case 'object':

                        if (source.length) {

                            var items = [];

                            source.forEach(function (item) {
                                if (item.value && item.value.toLowerCase().indexOf($this.value.toLowerCase()) != -1) {
                                    items.push(item);
                                }
                            });

                            release(items);
                        }

                        break;

                    case 'string':

                        var params = {};

                        params[this.options.param] = this.value;

                        UI.$.ajax({
                            url: this.options.source,
                            data: params,
                            type: this.options.method,
                            dataType: 'json'
                        }).done(function (json) {
                            release(json || []);
                        });

                        break;

                    default:
                        release(null);
                }
            } else {
                this.element.removeClass($this.options.loadingClass);
            }
        },

        render: function render(data) {

            this.dropdown.empty();

            this.selected = false;

            if (this.options.renderer) {

                this.options.renderer.apply(this, [data]);
            } else if (data && data.length) {

                this.dropdown.append(this.template({ "items": data }));
                this.show();

                this.trigger('show.uk.autocomplete');
            }

            return this;
        }
    });

    return UI.autocomplete;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2F1dG9jb21wbGV0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLENBQUMsVUFBUyxLQUFULEVBQWdCOztBQUViLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLG9CQUFQLEVBQTZCLENBQUMsT0FBRCxDQUE3QixFQUF3QyxZQUFVO0FBQzlDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksTUFBSjs7QUFFQSxPQUFHLFNBQUgsQ0FBYSxjQUFiLEVBQTZCOztBQUV6QixrQkFBVTtBQUNOLHVCQUFXLENBREw7QUFFTixtQkFBTyxRQUZEO0FBR04sb0JBQVEsTUFIRjtBQUlOLG1CQUFPLEdBSkQ7QUFLTiwwQkFBYyxZQUxSO0FBTU4sMEJBQWMsS0FOUjtBQU9OLHVCQUFXLFNBUEw7QUFRTix3QkFBWSxXQVJOO0FBU04sb0JBQVEsSUFURjtBQVVOLHNCQUFVLElBVko7Ozs7QUFjTixzQkFBVTtBQWRKLFNBRmU7O0FBbUJ6QixpQkFBVyxLQW5CYztBQW9CekIsZUFBVyxJQXBCYztBQXFCekIsa0JBQVcsSUFyQmM7O0FBdUJ6QixjQUFNLGdCQUFXOzs7QUFHYixlQUFHLEtBQUgsQ0FBUyxFQUFULENBQVksMEJBQVosRUFBd0Msd0JBQXhDLEVBQWtFLFVBQVMsQ0FBVCxFQUFZOztBQUUxRSxvQkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjs7QUFFQSxvQkFBSSxDQUFDLElBQUksSUFBSixDQUFTLGNBQVQsQ0FBTCxFQUErQjtBQUMzQix1QkFBRyxZQUFI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YixDQUFzQixLQUF0QixDQUE0QixJQUE1QixFQUFrQyxDQUFDLElBQUQsQ0FBbEM7QUFFSCxhQUpELE1BSU8sSUFBRyxRQUFRLEtBQUssTUFBaEIsRUFBd0I7O0FBRTNCLHFCQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQUssUUFBTCxDQUFjLEVBQUMsU0FBUSxJQUFULEVBQWQsQ0FBckI7QUFDQSxxQkFBSyxJQUFMOztBQUVBLHFCQUFLLE9BQUwsQ0FBYSxzQkFBYjtBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSDtBQXBUd0IsS0FBN0I7O0FBdVRBLFdBQU8sR0FBRyxZQUFWO0FBQ0gsQ0E1VUQiLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtYXV0b2NvbXBsZXRlXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgYWN0aXZlO1xuXG4gICAgVUkuY29tcG9uZW50KCdhdXRvY29tcGxldGUnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcbiAgICAgICAgICAgIHBhcmFtOiAnc2VhcmNoJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgZGVsYXk6IDMwMCxcbiAgICAgICAgICAgIGxvYWRpbmdDbGFzczogJ3VrLWxvYWRpbmcnLFxuICAgICAgICAgICAgZmxpcERyb3Bkb3duOiBmYWxzZSxcbiAgICAgICAgICAgIHNraXBDbGFzczogJ3VrLXNraXAnLFxuICAgICAgICAgICAgaG92ZXJDbGFzczogJ3VrLWFjdGl2ZScsXG4gICAgICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgICAgICByZW5kZXJlcjogbnVsbCxcblxuICAgICAgICAgICAgLy8gdGVtcGxhdGVcblxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dWwgY2xhc3M9XCJ1ay1uYXYgdWstbmF2LWF1dG9jb21wbGV0ZSB1ay1hdXRvY29tcGxldGUtcmVzdWx0c1wiPnt7fml0ZW1zfX08bGkgZGF0YS12YWx1ZT1cInt7JGl0ZW0udmFsdWV9fVwiPjxhPnt7JGl0ZW0udmFsdWV9fTwvYT48L2xpPnt7L2l0ZW1zfX08L3VsPidcbiAgICAgICAgfSxcblxuICAgICAgICB2aXNpYmxlICA6IGZhbHNlLFxuICAgICAgICB2YWx1ZSAgICA6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkIDogbnVsbCxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS4kaHRtbC5vbihcImZvY3VzLmF1dG9jb21wbGV0ZS51aWtpdFwiLCBcIltkYXRhLXVrLWF1dG9jb21wbGV0ZV1cIiwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwiYXV0b2NvbXBsZXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIFVJLmF1dG9jb21wbGV0ZShlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLWF1dG9jb21wbGV0ZVwiKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyByZWdpc3RlciBvdXRlciBjbGljayBmb3IgYXV0b2NvbXBsZXRlc1xuICAgICAgICAgICAgVUkuJGh0bWwub24oXCJjbGljay5hdXRvY29tcGxldGUudWlraXRcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUgJiYgZS50YXJnZXQhPWFjdGl2ZS5pbnB1dFswXSkgYWN0aXZlLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc2VsZWN0ICA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRyaWdnZXIgPSBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChzZWxlY3QgPSBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuaGFuZGxlKCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5vcHRpb25zLmRlbGF5KTtcblxuXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duID0gdGhpcy5maW5kKCcudWstZHJvcGRvd24nKTtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmZpbmQoJ3NjcmlwdFt0eXBlPVwidGV4dC9hdXRvY29tcGxldGVcIl0nKS5odG1sKCk7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gVUkuVXRpbHMudGVtcGxhdGUodGhpcy50ZW1wbGF0ZSB8fCB0aGlzLm9wdGlvbnMudGVtcGxhdGUpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dCAgICA9IHRoaXMuZmluZChcImlucHV0OmZpcnN0XCIpLmF0dHIoXCJhdXRvY29tcGxldGVcIiwgXCJvZmZcIik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcm9wZG93bi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24gPSBVSS4kKCc8ZGl2IGNsYXNzPVwidWstZHJvcGRvd25cIj48L2Rpdj4nKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZsaXBEcm9wZG93bikge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uYWRkQ2xhc3MoJ3VrLWRyb3Bkb3duLWZsaXAnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQub24oe1xuICAgICAgICAgICAgICAgIFwia2V5ZG93blwiOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgJiYgZS53aGljaCAmJiAhZS5zaGlmdEtleSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzODogLy8gdXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5waWNrKCdwcmV2JywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5waWNrKCduZXh0JywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5OiAvLyBlc2MsIHRhYlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwia2V5dXBcIjogdHJpZ2dlclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24ub24oXCJjbGlja1wiLCBcIi51ay1hdXRvY29tcGxldGUtcmVzdWx0cyA+ICpcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkdGhpcy5zZWxlY3QoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLm9uKFwibW91c2VvdmVyXCIsIFwiLnVrLWF1dG9jb21wbGV0ZS1yZXN1bHRzID4gKlwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR0aGlzLnBpY2soVUkuJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyY29tcGxldGUgPSB0cmlnZ2VyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIG9sZCA9IHRoaXMudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPCB0aGlzLm9wdGlvbnMubWluTGVuZ3RoKSByZXR1cm4gdGhpcy5oaWRlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9IG9sZCkge1xuICAgICAgICAgICAgICAgICR0aGlzLnJlcXVlc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGljazogZnVuY3Rpb24oaXRlbSwgc2Nyb2xsaW52aWV3KSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaXRlbXMgICAgPSBVSS4kKHRoaXMuZHJvcGRvd24uZmluZCgnLnVrLWF1dG9jb21wbGV0ZS1yZXN1bHRzJykuY2hpbGRyZW4oJzpub3QoLicrdGhpcy5vcHRpb25zLnNraXBDbGFzcysnKScpKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gIT09IFwic3RyaW5nXCIgJiYgIWl0ZW0uaGFzQ2xhc3ModGhpcy5vcHRpb25zLnNraXBDbGFzcykpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGl0ZW07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gPT0gJ25leHQnIHx8IGl0ZW0gPT0gJ3ByZXYnKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtcy5pbmRleCh0aGlzLnNlbGVjdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSAnbmV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gaXRlbXMuZXEoaW5kZXggKyAxIDwgaXRlbXMubGVuZ3RoID8gaW5kZXggKyAxIDogMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGl0ZW1zLmVxKGluZGV4IC0gMSA8IDAgPyBpdGVtcy5sZW5ndGggLSAxIDogaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBpdGVtc1soaXRlbSA9PSAnbmV4dCcpID8gJ2ZpcnN0JyA6ICdsYXN0J10oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IFVJLiQoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgICAgICAgICAgIGl0ZW1zLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZENsYXNzKHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzKTtcblxuICAgICAgICAgICAgICAgIC8vIGp1bXAgdG8gc2VsZWN0ZWQgaWYgbm90IGluIHZpZXdcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsaW52aWV3KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCAgICAgICA9IHNlbGVjdGVkLnBvc2l0aW9uKCkudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJHRoaXMuZHJvcGRvd24uc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBkcGhlaWdodCAgPSAkdGhpcy5kcm9wZG93bi5oZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodG9wID4gZHBoZWlnaHQgfHwgIHRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmRyb3Bkb3duLnNjcm9sbFRvcChzY3JvbGxUb3AgKyB0b3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLnNlbGVjdGVkKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5zZWxlY3RlZC5kYXRhKCk7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcInNlbGVjdGl0ZW0udWsuYXV0b2NvbXBsZXRlXCIsIFtkYXRhLCB0aGlzXSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC52YWwoZGF0YS52YWx1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyhcInVrLW9wZW5cIik7XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmUgJiYgYWN0aXZlIT09dGhpcykge1xuICAgICAgICAgICAgICAgIGFjdGl2ZS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFjdGl2ZSA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBhcmlhXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyhcInVrLW9wZW5cIik7XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmUgPT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIGFyaWFcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHJlbGVhc2UgPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVuZGVyKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygkdGhpcy5vcHRpb25zLmxvYWRpbmdDbGFzcyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5sb2FkaW5nQ2xhc3MpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNvdXJjZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMub3B0aW9ucy5zb3VyY2U7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2godHlwZW9mKHRoaXMub3B0aW9ucy5zb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvdXJjZS5hcHBseSh0aGlzLCBbcmVsZWFzZV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzb3VyY2UubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLnZhbHVlICYmIGl0ZW0udmFsdWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCR0aGlzLnZhbHVlLnRvTG93ZXJDYXNlKCkpIT0tMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsZWFzZShpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPXt9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbdGhpcy5vcHRpb25zLnBhcmFtXSA9IHRoaXMudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLiQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLm9wdGlvbnMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMubWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGVhc2UoanNvbiB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGVhc2UobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygkdGhpcy5vcHRpb25zLmxvYWRpbmdDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uZW1wdHkoKTtcblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJlbmRlcmVyKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucmVuZGVyZXIuYXBwbHkodGhpcywgW2RhdGFdKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmKGRhdGEgJiYgZGF0YS5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uYXBwZW5kKHRoaXMudGVtcGxhdGUoe1wiaXRlbXNcIjpkYXRhfSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzaG93LnVrLmF1dG9jb21wbGV0ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFVJLmF1dG9jb21wbGV0ZTtcbn0pO1xuIl19