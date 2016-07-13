"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var active = false,
        activeCount = 0,
        $html = UI.$html,
        body;

    UI.$win.on("resize orientationchange", UI.Utils.debounce(function () {
        UI.$('.uk-modal.uk-open').each(function () {
            UI.$(this).data('modal').resize();
        });
    }, 150));

    UI.component('modal', {

        defaults: {
            keyboard: true,
            bgclose: true,
            minScrollHeight: 150,
            center: false,
            modal: true
        },

        scrollable: false,
        transition: false,
        hasTransitioned: true,

        init: function init() {

            if (!body) body = UI.$('body');

            if (!this.element.length) return;

            var $this = this;

            this.paddingdir = "padding-" + (UI.langdirection == 'left' ? "right" : "left");
            this.dialog = this.find(".uk-modal-dialog");

            this.active = false;

            // Update ARIA
            this.element.attr('aria-hidden', this.element.hasClass("uk-open"));

            this.on("click", ".uk-modal-close", function (e) {
                e.preventDefault();
                $this.hide();
            }).on("click", function (e) {

                var target = UI.$(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }
            });

            UI.domObserve(this.element, function (e) {
                $this.resize();
            });
        },

        toggle: function toggle() {
            return this[this.isActive() ? "hide" : "show"]();
        },

        show: function show() {

            if (!this.element.length) return;

            var $this = this;

            if (this.isActive()) return;

            if (this.options.modal && active) {
                active.hide(true);
            }

            this.element.removeClass("uk-open").show();
            this.resize(true);

            if (this.options.modal) {
                active = this;
            }

            this.active = true;

            activeCount++;

            if (UI.support.transition) {
                this.hasTransitioned = false;
                this.element.one(UI.support.transition.end, function () {
                    $this.hasTransitioned = true;
                }).addClass("uk-open");
            } else {
                this.element.addClass("uk-open");
            }

            $html.addClass("uk-modal-page").height(); // force browser engine redraw

            // Update ARIA
            this.element.attr('aria-hidden', 'false');

            this.element.trigger("show.uk.modal");

            UI.Utils.checkDisplay(this.dialog, true);

            return this;
        },

        hide: function hide(force) {

            if (!force && UI.support.transition && this.hasTransitioned) {

                var $this = this;

                this.one(UI.support.transition.end, function () {
                    $this._hide();
                }).removeClass("uk-open");
            } else {

                this._hide();
            }

            return this;
        },

        resize: function resize(force) {

            if (!this.isActive() && !force) return;

            var bodywidth = body.width();

            this.scrollbarwidth = window.innerWidth - bodywidth;

            body.css(this.paddingdir, this.scrollbarwidth);

            this.element.css('overflow-y', this.scrollbarwidth ? 'scroll' : 'auto');

            if (!this.updateScrollable() && this.options.center) {

                var dh = this.dialog.outerHeight(),
                    pad = parseInt(this.dialog.css('margin-top'), 10) + parseInt(this.dialog.css('margin-bottom'), 10);

                if (dh + pad < window.innerHeight) {
                    this.dialog.css({ 'top': window.innerHeight / 2 - dh / 2 - pad });
                } else {
                    this.dialog.css({ 'top': '' });
                }
            }
        },

        updateScrollable: function updateScrollable() {

            // has scrollable?
            var scrollable = this.dialog.find('.uk-overflow-container:visible:first');

            if (scrollable.length) {

                scrollable.css('height', 0);

                var offset = Math.abs(parseInt(this.dialog.css('margin-top'), 10)),
                    dh = this.dialog.outerHeight(),
                    wh = window.innerHeight,
                    h = wh - 2 * (offset < 20 ? 20 : offset) - dh;

                scrollable.css({
                    'max-height': h < this.options.minScrollHeight ? '' : h,
                    'height': ''
                });

                return true;
            }

            return false;
        },

        _hide: function _hide() {

            this.active = false;
            if (activeCount > 0) activeCount--;else activeCount = 0;

            this.element.hide().removeClass('uk-open');

            // Update ARIA
            this.element.attr('aria-hidden', 'true');

            if (!activeCount) {
                $html.removeClass('uk-modal-page');
                body.css(this.paddingdir, "");
            }

            if (active === this) active = false;

            this.trigger('hide.uk.modal');
        },

        isActive: function isActive() {
            return this.element.hasClass('uk-open');
        }

    });

    UI.component('modalTrigger', {

        boot: function boot() {

            // init code
            UI.$html.on("click.modal.uikit", "[data-uk-modal]", function (e) {

                var ele = UI.$(this);

                if (ele.is("a")) {
                    e.preventDefault();
                }

                if (!ele.data("modalTrigger")) {
                    var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr("data-uk-modal")));
                    modal.show();
                }
            });

            // close modal on esc button
            UI.$html.on('keydown.modal.uikit', function (e) {

                if (active && e.keyCode === 27 && active.options.keyboard) {
                    // ESC
                    e.preventDefault();
                    active.hide();
                }
            });
        },

        init: function init() {

            var $this = this;

            this.options = UI.$.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.modal = UI.modal(this.options.target, this.options);

            this.on("click", function (e) {
                e.preventDefault();
                $this.show();
            });

            //methods
            this.proxy(this.modal, "show hide isActive");
        }
    });

    UI.modal.dialog = function (content, options) {

        var modal = UI.modal(UI.$(UI.modal.dialog.template).appendTo("body"), options);

        modal.on("hide.uk.modal", function () {
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data("modalPersistParent"));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    UI.modal.dialog.template = '<div class="uk-modal"><div class="uk-modal-dialog" style="min-height:0;"></div></div>';

    UI.modal.alert = function (content, options) {

        options = UI.$.extend(true, { bgclose: false, keyboard: false, modal: false, labels: UI.modal.labels }, options);

        var modal = UI.modal.dialog(['<div class="uk-margin uk-modal-content">' + String(content) + '</div>', '<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-button-primary uk-modal-close">' + options.labels.Ok + '</button></div>'].join(""), options);

        modal.on('show.uk.modal', function () {
            setTimeout(function () {
                modal.element.find('button:first').focus();
            }, 50);
        });

        return modal.show();
    };

    UI.modal.confirm = function (content, onconfirm, oncancel) {

        var options = arguments.length > 1 && arguments[arguments.length - 1] ? arguments[arguments.length - 1] : {};

        onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function () {};
        oncancel = UI.$.isFunction(oncancel) ? oncancel : function () {};
        options = UI.$.extend(true, { bgclose: false, keyboard: false, modal: false, labels: UI.modal.labels }, UI.$.isFunction(options) ? {} : options);

        var modal = UI.modal.dialog(['<div class="uk-margin uk-modal-content">' + String(content) + '</div>', '<div class="uk-modal-footer uk-text-right"><button class="uk-button js-modal-confirm-cancel">' + options.labels.Cancel + '</button> <button class="uk-button uk-button-primary js-modal-confirm">' + options.labels.Ok + '</button></div>'].join(""), options);

        modal.element.find(".js-modal-confirm, .js-modal-confirm-cancel").on("click", function () {
            UI.$(this).is('.js-modal-confirm') ? onconfirm() : oncancel();
            modal.hide();
        });

        modal.on('show.uk.modal', function () {
            setTimeout(function () {
                modal.element.find('.js-modal-confirm').focus();
            }, 50);
        });

        return modal.show();
    };

    UI.modal.prompt = function (text, value, onsubmit, options) {

        onsubmit = UI.$.isFunction(onsubmit) ? onsubmit : function (value) {};
        options = UI.$.extend(true, { bgclose: false, keyboard: false, modal: false, labels: UI.modal.labels }, options);

        var modal = UI.modal.dialog([text ? '<div class="uk-modal-content uk-form">' + String(text) + '</div>' : '', '<div class="uk-margin-small-top uk-modal-content uk-form"><p><input type="text" class="uk-width-1-1"></p></div>', '<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-modal-close">' + options.labels.Cancel + '</button> <button class="uk-button uk-button-primary js-modal-ok">' + options.labels.Ok + '</button></div>'].join(""), options),
            input = modal.element.find("input[type='text']").val(value || '').on('keyup', function (e) {
            if (e.keyCode == 13) {
                modal.element.find(".js-modal-ok").trigger('click');
            }
        });

        modal.element.find(".js-modal-ok").on("click", function () {
            if (onsubmit(input.val()) !== false) {
                modal.hide();
            }
        });

        modal.on('show.uk.modal', function () {
            setTimeout(function () {
                input.focus();
            }, 50);
        });

        return modal.show();
    };

    UI.modal.blockUI = function (content, options) {

        var modal = UI.modal.dialog(['<div class="uk-margin uk-modal-content">' + String(content || '<div class="uk-text-center">...</div>') + '</div>'].join(""), UI.$.extend({ bgclose: false, keyboard: false, modal: false }, options));

        modal.content = modal.element.find('.uk-modal-content:first');

        return modal.show();
    };

    UI.modal.labels = {
        'Ok': 'Ok',
        'Cancel': 'Cancel'
    };

    // helper functions
    function setContent(content, modal) {

        if (!modal) return;

        if ((typeof content === "undefined" ? "undefined" : _typeof(content)) === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : UI.$(content);

            if (content.parent().length) {
                modal.persist = content;
                modal.persist.data("modalPersistParent", content.parent());
            }
        } else if (typeof content === 'string' || typeof content === 'number') {
            // just insert the data as innerHTML
            content = UI.$('<div></div>').html(content);
        } else {
            // unsupported data type!
            content = UI.$('<div></div>').html('UIkit.modal Error: Unsupported data type: ' + (typeof content === "undefined" ? "undefined" : _typeof(content)));
        }

        content.appendTo(modal.element.find('.uk-modal-dialog'));

        return modal;
    }
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL21vZGFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsQ0FBQyxVQUFTLEVBQVQsRUFBYTs7QUFFVjs7QUFFQSxRQUFJLFNBQVMsS0FBYjtBQUFBLFFBQW9CLGNBQWMsQ0FBbEM7QUFBQSxRQUFxQyxRQUFRLEdBQUcsS0FBaEQ7QUFBQSxRQUF1RCxJQUF2RDs7QUFFQSxPQUFHLElBQUgsQ0FBUSxFQUFSLENBQVcsMEJBQVgsRUFBdUMsR0FBRyxLQUFILENBQVMsUUFBVCxDQUFrQixZQUFVO0FBQy9ELFdBQUcsQ0FBSCxDQUFLLG1CQUFMLEVBQTBCLElBQTFCLENBQStCLFlBQVU7QUFDckMsZUFBRyxDQUFILENBQUssSUFBTCxFQUFXLElBQVgsQ0FBZ0IsT0FBaEIsRUFBeUIsTUFBekI7QUFDSCxTQUZEO0FBR0gsS0FKc0MsRUFJcEMsR0FKb0MsQ0FBdkM7O0FBTUEsT0FBRyxTQUFILENBQWEsT0FBYixFQUFzQjs7QUFFbEIsa0JBQVU7QUFDTixzQkFBVSxJQURKO0FBRU4scUJBQVMsSUFGSDtBQUdOLDZCQUFpQixHQUhYO0FBSU4sb0JBQVEsS0FKRjtBQUtOLG1CQUFPO0FBTEQsU0FGUTs7QUFVbEIsb0JBQVksS0FWTTtBQVdsQixvQkFBWSxLQVhNO0FBWWxCLHlCQUFpQixJQVpDOztBQWNsQixjQUFNLGdCQUFXOztBQUViLGdCQUFJLENBQUMsSUFBTCxFQUFXLE9BQU8sR0FBRyxDQUFILENBQUssTUFBTCxDQUFQOztBQUVYLGdCQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsTUFBbEIsRUFBMEI7O0FBRTFCLGdCQUFJLFFBQVEsSUFBWjs7QUFFQSxpQkFBSyxVQUFMLEdBQWtCLGNBQWMsR0FBRyxhQUFILElBQW9CLE1BQXBCLEdBQTZCLE9BQTdCLEdBQXFDLE1BQW5ELENBQWxCO0FBQ0EsaUJBQUssTUFBTCxHQUFrQixLQUFLLElBQUwsQ0FBVSxrQkFBVixDQUFsQjs7QUFFQSxp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SDtBQUVKLENBdllELEVBdVlHLEtBdllIIiwiZmlsZSI6Im1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBhY3RpdmUgPSBmYWxzZSwgYWN0aXZlQ291bnQgPSAwLCAkaHRtbCA9IFVJLiRodG1sLCBib2R5O1xuXG4gICAgVUkuJHdpbi5vbihcInJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZVwiLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpe1xuICAgICAgICBVSS4kKCcudWstbW9kYWwudWstb3BlbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFVJLiQodGhpcykuZGF0YSgnbW9kYWwnKS5yZXNpemUoKTtcbiAgICAgICAgfSk7XG4gICAgfSwgMTUwKSk7XG5cbiAgICBVSS5jb21wb25lbnQoJ21vZGFsJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIGJnY2xvc2U6IHRydWUsXG4gICAgICAgICAgICBtaW5TY3JvbGxIZWlnaHQ6IDE1MCxcbiAgICAgICAgICAgIGNlbnRlcjogZmFsc2UsXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHNjcm9sbGFibGU6IGZhbHNlLFxuICAgICAgICB0cmFuc2l0aW9uOiBmYWxzZSxcbiAgICAgICAgaGFzVHJhbnNpdGlvbmVkOiB0cnVlLFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoIWJvZHkpIGJvZHkgPSBVSS4kKCdib2R5Jyk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnBhZGRpbmdkaXIgPSBcInBhZGRpbmctXCIgKyAoVUkubGFuZ2RpcmVjdGlvbiA9PSAnbGVmdCcgPyBcInJpZ2h0XCI6XCJsZWZ0XCIpO1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cgICAgID0gdGhpcy5maW5kKFwiLnVrLW1vZGFsLWRpYWxvZ1wiKTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmUgICAgID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBBUklBXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoXCJ1ay1vcGVuXCIpKTtcblxuICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrXCIsIFwiLnVrLW1vZGFsLWNsb3NlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfSkub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gVUkuJChlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0WzBdID09ICR0aGlzLmVsZW1lbnRbMF0gJiYgJHRoaXMub3B0aW9ucy5iZ2Nsb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVUkuZG9tT2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIGZ1bmN0aW9uKGUpIHsgJHRoaXMucmVzaXplKCk7IH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t0aGlzLmlzQWN0aXZlKCkgPyBcImhpZGVcIiA6IFwic2hvd1wiXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZWxlbWVudC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1vZGFsICYmIGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZS5oaWRlKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJ1ay1vcGVuXCIpLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplKHRydWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1vZGFsKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlID0gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBhY3RpdmVDb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoVUkuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNUcmFuc2l0aW9uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQub25lKFVJLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmhhc1RyYW5zaXRpb25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSkuYWRkQ2xhc3MoXCJ1ay1vcGVuXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1ay1vcGVuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkaHRtbC5hZGRDbGFzcyhcInVrLW1vZGFsLXBhZ2VcIikuaGVpZ2h0KCk7IC8vIGZvcmNlIGJyb3dzZXIgZW5naW5lIHJlZHJhd1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgQVJJQVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKFwic2hvdy51ay5tb2RhbFwiKTtcblxuICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KHRoaXMuZGlhbG9nLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oZm9yY2UpIHtcblxuICAgICAgICAgICAgaWYgKCFmb3JjZSAmJiBVSS5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy5oYXNUcmFuc2l0aW9uZWQpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uZShVSS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuX2hpZGUoKTtcbiAgICAgICAgICAgICAgICB9KS5yZW1vdmVDbGFzcyhcInVrLW9wZW5cIik7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2l6ZTogZnVuY3Rpb24oZm9yY2UpIHtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKCkgJiYgIWZvcmNlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBib2R5d2lkdGggID0gYm9keS53aWR0aCgpO1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhcndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSBib2R5d2lkdGg7XG5cbiAgICAgICAgICAgIGJvZHkuY3NzKHRoaXMucGFkZGluZ2RpciwgdGhpcy5zY3JvbGxiYXJ3aWR0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ292ZXJmbG93LXknLCB0aGlzLnNjcm9sbGJhcndpZHRoID8gJ3Njcm9sbCcgOiAnYXV0bycpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudXBkYXRlU2Nyb2xsYWJsZSgpICYmIHRoaXMub3B0aW9ucy5jZW50ZXIpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkaCAgPSB0aGlzLmRpYWxvZy5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgIHBhZCA9IHBhcnNlSW50KHRoaXMuZGlhbG9nLmNzcygnbWFyZ2luLXRvcCcpLCAxMCkgKyBwYXJzZUludCh0aGlzLmRpYWxvZy5jc3MoJ21hcmdpbi1ib3R0b20nKSwgMTApO1xuXG4gICAgICAgICAgICAgICAgaWYgKChkaCArIHBhZCkgPCB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaWFsb2cuY3NzKHsndG9wJzogKHdpbmRvdy5pbm5lckhlaWdodC8yIC0gZGgvMikgLSBwYWQgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaWFsb2cuY3NzKHsndG9wJzogJyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlU2Nyb2xsYWJsZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGhhcyBzY3JvbGxhYmxlP1xuICAgICAgICAgICAgdmFyIHNjcm9sbGFibGUgPSB0aGlzLmRpYWxvZy5maW5kKCcudWstb3ZlcmZsb3ctY29udGFpbmVyOnZpc2libGU6Zmlyc3QnKTtcblxuICAgICAgICAgICAgaWYgKHNjcm9sbGFibGUubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICBzY3JvbGxhYmxlLmNzcygnaGVpZ2h0JywgMCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gTWF0aC5hYnMocGFyc2VJbnQodGhpcy5kaWFsb2cuY3NzKCdtYXJnaW4tdG9wJyksIDEwKSksXG4gICAgICAgICAgICAgICAgZGggICAgID0gdGhpcy5kaWFsb2cub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICB3aCAgICAgPSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgaCAgICAgID0gd2ggLSAyKihvZmZzZXQgPCAyMCA/IDIwOm9mZnNldCkgLSBkaDtcblxuICAgICAgICAgICAgICAgIHNjcm9sbGFibGUuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ21heC1oZWlnaHQnOiAoaCA8IHRoaXMub3B0aW9ucy5taW5TY3JvbGxIZWlnaHQgPyAnJzpoKSxcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6JydcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUNvdW50ID4gMCkgYWN0aXZlQ291bnQtLTtcbiAgICAgICAgICAgIGVsc2UgYWN0aXZlQ291bnQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuaGlkZSgpLnJlbW92ZUNsYXNzKCd1ay1vcGVuJyk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBBUklBXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICBpZiAoIWFjdGl2ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ3VrLW1vZGFsLXBhZ2UnKTtcbiAgICAgICAgICAgICAgICBib2R5LmNzcyh0aGlzLnBhZGRpbmdkaXIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0aXZlPT09dGhpcykgYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignaGlkZS51ay5tb2RhbCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzQWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ3VrLW9wZW4nKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBVSS5jb21wb25lbnQoJ21vZGFsVHJpZ2dlcicsIHtcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS4kaHRtbC5vbihcImNsaWNrLm1vZGFsLnVpa2l0XCIsIFwiW2RhdGEtdWstbW9kYWxdXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZS5pcyhcImFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZWxlLmRhdGEoXCJtb2RhbFRyaWdnZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWxUcmlnZ2VyKGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstbW9kYWxcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNsb3NlIG1vZGFsIG9uIGVzYyBidXR0b25cbiAgICAgICAgICAgIFVJLiRodG1sLm9uKCdrZXlkb3duLm1vZGFsLnVpa2l0JywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUgJiYgZS5rZXlDb2RlID09PSAyNyAmJiBhY3RpdmUub3B0aW9ucy5rZXlib2FyZCkgeyAvLyBFU0NcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBVSS4kLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjogJHRoaXMuZWxlbWVudC5pcyhcImFcIikgPyAkdGhpcy5lbGVtZW50LmF0dHIoXCJocmVmXCIpIDogZmFsc2VcbiAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kYWwgPSBVSS5tb2RhbCh0aGlzLm9wdGlvbnMudGFyZ2V0LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5zaG93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9tZXRob2RzXG4gICAgICAgICAgICB0aGlzLnByb3h5KHRoaXMubW9kYWwsIFwic2hvdyBoaWRlIGlzQWN0aXZlXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBVSS5tb2RhbC5kaWFsb2cgPSBmdW5jdGlvbihjb250ZW50LCBvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWwoVUkuJChVSS5tb2RhbC5kaWFsb2cudGVtcGxhdGUpLmFwcGVuZFRvKFwiYm9keVwiKSwgb3B0aW9ucyk7XG5cbiAgICAgICAgbW9kYWwub24oXCJoaWRlLnVrLm1vZGFsXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAobW9kYWwucGVyc2lzdCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLnBlcnNpc3QuYXBwZW5kVG8obW9kYWwucGVyc2lzdC5kYXRhKFwibW9kYWxQZXJzaXN0UGFyZW50XCIpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5wZXJzaXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb2RhbC5lbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZXRDb250ZW50KGNvbnRlbnQsIG1vZGFsKTtcblxuICAgICAgICByZXR1cm4gbW9kYWw7XG4gICAgfTtcblxuICAgIFVJLm1vZGFsLmRpYWxvZy50ZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwidWstbW9kYWxcIj48ZGl2IGNsYXNzPVwidWstbW9kYWwtZGlhbG9nXCIgc3R5bGU9XCJtaW4taGVpZ2h0OjA7XCI+PC9kaXY+PC9kaXY+JztcblxuICAgIFVJLm1vZGFsLmFsZXJ0ID0gZnVuY3Rpb24oY29udGVudCwgb3B0aW9ucykge1xuXG4gICAgICAgIG9wdGlvbnMgPSBVSS4kLmV4dGVuZCh0cnVlLCB7YmdjbG9zZTpmYWxzZSwga2V5Ym9hcmQ6ZmFsc2UsIG1vZGFsOmZhbHNlLCBsYWJlbHM6VUkubW9kYWwubGFiZWxzfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWwuZGlhbG9nKChbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1hcmdpbiB1ay1tb2RhbC1jb250ZW50XCI+JytTdHJpbmcoY29udGVudCkrJzwvZGl2PicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1vZGFsLWZvb3RlciB1ay10ZXh0LXJpZ2h0XCI+PGJ1dHRvbiBjbGFzcz1cInVrLWJ1dHRvbiB1ay1idXR0b24tcHJpbWFyeSB1ay1tb2RhbC1jbG9zZVwiPicrb3B0aW9ucy5sYWJlbHMuT2srJzwvYnV0dG9uPjwvZGl2PidcbiAgICAgICAgXSkuam9pbihcIlwiKSwgb3B0aW9ucyk7XG5cbiAgICAgICAgbW9kYWwub24oJ3Nob3cudWsubW9kYWwnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG1vZGFsLmVsZW1lbnQuZmluZCgnYnV0dG9uOmZpcnN0JykuZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1vZGFsLnNob3coKTtcbiAgICB9O1xuXG4gICAgVUkubW9kYWwuY29uZmlybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIG9uY29uZmlybSwgb25jYW5jZWwpIHtcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdID8gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0gOiB7fTtcblxuICAgICAgICBvbmNvbmZpcm0gPSBVSS4kLmlzRnVuY3Rpb24ob25jb25maXJtKSA/IG9uY29uZmlybSA6IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgb25jYW5jZWwgID0gVUkuJC5pc0Z1bmN0aW9uKG9uY2FuY2VsKSA/IG9uY2FuY2VsIDogZnVuY3Rpb24oKXt9O1xuICAgICAgICBvcHRpb25zICAgPSBVSS4kLmV4dGVuZCh0cnVlLCB7YmdjbG9zZTpmYWxzZSwga2V5Ym9hcmQ6ZmFsc2UsIG1vZGFsOmZhbHNlLCBsYWJlbHM6VUkubW9kYWwubGFiZWxzfSwgVUkuJC5pc0Z1bmN0aW9uKG9wdGlvbnMpID8ge306b3B0aW9ucyk7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWwuZGlhbG9nKChbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1hcmdpbiB1ay1tb2RhbC1jb250ZW50XCI+JytTdHJpbmcoY29udGVudCkrJzwvZGl2PicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1vZGFsLWZvb3RlciB1ay10ZXh0LXJpZ2h0XCI+PGJ1dHRvbiBjbGFzcz1cInVrLWJ1dHRvbiBqcy1tb2RhbC1jb25maXJtLWNhbmNlbFwiPicrb3B0aW9ucy5sYWJlbHMuQ2FuY2VsKyc8L2J1dHRvbj4gPGJ1dHRvbiBjbGFzcz1cInVrLWJ1dHRvbiB1ay1idXR0b24tcHJpbWFyeSBqcy1tb2RhbC1jb25maXJtXCI+JytvcHRpb25zLmxhYmVscy5PaysnPC9idXR0b24+PC9kaXY+J1xuICAgICAgICBdKS5qb2luKFwiXCIpLCBvcHRpb25zKTtcblxuICAgICAgICBtb2RhbC5lbGVtZW50LmZpbmQoXCIuanMtbW9kYWwtY29uZmlybSwgLmpzLW1vZGFsLWNvbmZpcm0tY2FuY2VsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFVJLiQodGhpcykuaXMoJy5qcy1tb2RhbC1jb25maXJtJykgPyBvbmNvbmZpcm0oKSA6IG9uY2FuY2VsKCk7XG4gICAgICAgICAgICBtb2RhbC5oaWRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsLm9uKCdzaG93LnVrLm1vZGFsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBtb2RhbC5lbGVtZW50LmZpbmQoJy5qcy1tb2RhbC1jb25maXJtJykuZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1vZGFsLnNob3coKTtcbiAgICB9O1xuXG4gICAgVUkubW9kYWwucHJvbXB0ID0gZnVuY3Rpb24odGV4dCwgdmFsdWUsIG9uc3VibWl0LCBvcHRpb25zKSB7XG5cbiAgICAgICAgb25zdWJtaXQgPSBVSS4kLmlzRnVuY3Rpb24ob25zdWJtaXQpID8gb25zdWJtaXQgOiBmdW5jdGlvbih2YWx1ZSl7fTtcbiAgICAgICAgb3B0aW9ucyAgPSBVSS4kLmV4dGVuZCh0cnVlLCB7YmdjbG9zZTpmYWxzZSwga2V5Ym9hcmQ6ZmFsc2UsIG1vZGFsOmZhbHNlLCBsYWJlbHM6VUkubW9kYWwubGFiZWxzfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWwuZGlhbG9nKChbXG4gICAgICAgICAgICB0ZXh0ID8gJzxkaXYgY2xhc3M9XCJ1ay1tb2RhbC1jb250ZW50IHVrLWZvcm1cIj4nK1N0cmluZyh0ZXh0KSsnPC9kaXY+JzonJyxcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstbWFyZ2luLXNtYWxsLXRvcCB1ay1tb2RhbC1jb250ZW50IHVrLWZvcm1cIj48cD48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInVrLXdpZHRoLTEtMVwiPjwvcD48L2Rpdj4nLFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1tb2RhbC1mb290ZXIgdWstdGV4dC1yaWdodFwiPjxidXR0b24gY2xhc3M9XCJ1ay1idXR0b24gdWstbW9kYWwtY2xvc2VcIj4nK29wdGlvbnMubGFiZWxzLkNhbmNlbCsnPC9idXR0b24+IDxidXR0b24gY2xhc3M9XCJ1ay1idXR0b24gdWstYnV0dG9uLXByaW1hcnkganMtbW9kYWwtb2tcIj4nK29wdGlvbnMubGFiZWxzLk9rKyc8L2J1dHRvbj48L2Rpdj4nXG4gICAgICAgIF0pLmpvaW4oXCJcIiksIG9wdGlvbnMpLFxuXG4gICAgICAgIGlucHV0ID0gbW9kYWwuZWxlbWVudC5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCh2YWx1ZSB8fCAnJykub24oJ2tleXVwJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuZWxlbWVudC5maW5kKFwiLmpzLW1vZGFsLW9rXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsLmVsZW1lbnQuZmluZChcIi5qcy1tb2RhbC1va1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAob25zdWJtaXQoaW5wdXQudmFsKCkpIT09ZmFsc2Upe1xuICAgICAgICAgICAgICAgIG1vZGFsLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWwub24oJ3Nob3cudWsubW9kYWwnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBtb2RhbC5zaG93KCk7XG4gICAgfTtcblxuICAgIFVJLm1vZGFsLmJsb2NrVUkgPSBmdW5jdGlvbihjb250ZW50LCBvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gVUkubW9kYWwuZGlhbG9nKChbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1hcmdpbiB1ay1tb2RhbC1jb250ZW50XCI+JytTdHJpbmcoY29udGVudCB8fCAnPGRpdiBjbGFzcz1cInVrLXRleHQtY2VudGVyXCI+Li4uPC9kaXY+JykrJzwvZGl2PidcbiAgICAgICAgXSkuam9pbihcIlwiKSwgVUkuJC5leHRlbmQoe2JnY2xvc2U6ZmFsc2UsIGtleWJvYXJkOmZhbHNlLCBtb2RhbDpmYWxzZX0sIG9wdGlvbnMpKTtcblxuICAgICAgICBtb2RhbC5jb250ZW50ID0gbW9kYWwuZWxlbWVudC5maW5kKCcudWstbW9kYWwtY29udGVudDpmaXJzdCcpO1xuXG4gICAgICAgIHJldHVybiBtb2RhbC5zaG93KCk7XG4gICAgfTtcblxuXG4gICAgVUkubW9kYWwubGFiZWxzID0ge1xuICAgICAgICAnT2snOiAnT2snLFxuICAgICAgICAnQ2FuY2VsJzogJ0NhbmNlbCdcbiAgICB9O1xuXG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gc2V0Q29udGVudChjb250ZW50LCBtb2RhbCl7XG5cbiAgICAgICAgaWYoIW1vZGFsKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnb2JqZWN0Jykge1xuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IERPTSBvYmplY3QgdG8gYSBqUXVlcnkgb2JqZWN0XG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudCBpbnN0YW5jZW9mIGpRdWVyeSA/IGNvbnRlbnQgOiBVSS4kKGNvbnRlbnQpO1xuXG4gICAgICAgICAgICBpZihjb250ZW50LnBhcmVudCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLnBlcnNpc3QgPSBjb250ZW50O1xuICAgICAgICAgICAgICAgIG1vZGFsLnBlcnNpc3QuZGF0YShcIm1vZGFsUGVyc2lzdFBhcmVudFwiLCBjb250ZW50LnBhcmVudCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgY29udGVudCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGluc2VydCB0aGUgZGF0YSBhcyBpbm5lckhUTUxcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gVUkuJCgnPGRpdj48L2Rpdj4nKS5odG1sKGNvbnRlbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdW5zdXBwb3J0ZWQgZGF0YSB0eXBlIVxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBVSS4kKCc8ZGl2PjwvZGl2PicpLmh0bWwoJ1VJa2l0Lm1vZGFsIEVycm9yOiBVbnN1cHBvcnRlZCBkYXRhIHR5cGU6ICcgKyB0eXBlb2YgY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZW50LmFwcGVuZFRvKG1vZGFsLmVsZW1lbnQuZmluZCgnLnVrLW1vZGFsLWRpYWxvZycpKTtcblxuICAgICAgICByZXR1cm4gbW9kYWw7XG4gICAgfVxuXG59KShVSWtpdCk7XG4iXX0=