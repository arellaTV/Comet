"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-notify", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var containers = {},
        messages = {},
        notify = function notify(options) {

        if (UI.$.type(options) == 'string') {
            options = { message: options };
        }

        if (arguments[1]) {
            options = UI.$.extend(options, UI.$.type(arguments[1]) == 'string' ? { status: arguments[1] } : arguments[1]);
        }

        return new Message(options).show();
    },
        closeAll = function closeAll(group, instantly) {

        var id;

        if (group) {
            for (id in messages) {
                if (group === messages[id].group) messages[id].close(instantly);
            }
        } else {
            for (id in messages) {
                messages[id].close(instantly);
            }
        }
    };

    var Message = function Message(options) {

        this.options = UI.$.extend({}, Message.defaults, options);

        this.uuid = UI.Utils.uid("notifymsg");
        this.element = UI.$(['<div class="uk-notify-message">', '<a class="uk-close"></a>', '<div></div>', '</div>'].join('')).data("notifyMessage", this);

        this.content(this.options.message);

        // status
        if (this.options.status) {
            this.element.addClass('uk-notify-message-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = UI.$('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function () {

                var message = UI.$(this).data("notifyMessage");

                message.element.trigger('manualclose.uk.notify', [message]);
                message.close();
            });
        }
    };

    UI.$.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function show() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }).animate({ "opacity": 1, "margin-top": 0, "margin-bottom": marginbottom }, function () {

                if ($this.options.timeout) {

                    var closefn = function closefn() {
                        $this.close();
                    };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(function () {
                        clearTimeout($this.timeout);
                    }, function () {
                        $this.timeout = setTimeout(closefn, $this.options.timeout);
                    });
                }
            });

            return this;
        },

        close: function close(instantly) {

            var $this = this,
                finalize = function finalize() {
                $this.element.remove();

                if (!containers[$this.options.pos].children().length) {
                    containers[$this.options.pos].hide();
                }

                $this.options.onClose.apply($this, []);
                $this.element.trigger('close.uk.notify', [$this]);

                delete messages[$this.uuid];
            };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }, function () {
                    finalize();
                });
            }
        },

        content: function content(html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function status(_status) {

            if (!_status) {
                return this.currentstatus;
            }

            this.element.removeClass('uk-notify-message-' + this.currentstatus).addClass('uk-notify-message-' + _status);

            this.currentstatus = _status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "",
        timeout: 5000,
        group: null,
        pos: 'top-center',
        onClose: function onClose() {}
    };

    UI.notify = notify;
    UI.notify.message = Message;
    UI.notify.closeAll = closeAll;

    return notify;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL25vdGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxjQUFQLEVBQXVCLENBQUMsT0FBRCxDQUF2QixFQUFrQyxZQUFVO0FBQ3hDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksYUFBYSxFQUFqQjtBQUFBLFFBQ0ksV0FBYSxFQURqQjtBQUFBLFFBR0ksU0FBYyxTQUFkLE1BQWMsQ0FBUyxPQUFULEVBQWlCOztBQUUzQixZQUFJLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVSxPQUFWLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2hDLHNCQUFVLEVBQUUsU0FBUyxPQUFYLEVBQVY7QUFDSDs7QUFFRCxZQUFJLFVBQVUsQ0FBVixDQUFKLEVBQWtCO0FBQ2Qsc0JBQVUsR0FBRyxDQUFILENBQUssTUFBTCxDQUFZLE9BQVosRUFBcUIsR0FBRyxDQUFILENBQUssSUFBTCxDQUFVLFVBQVUsQ0FBVixDQUFWLEtBQTJCLFFBQTNCLEdBQXNDLEVBQUMsUUFBTyxVQUFVLENBQVYsQ0FBUixFQUF0QyxHQUE4RCxVQUFVLENBQVYsQ0FBbkYsQ0FBVjtBQUNIOztBQUVELGVBQVEsSUFBSSxPQUFKLENBQVksT0FBWixDQUFELENBQXVCLElBQXZCLEVBQVA7QUFDSCxLQWRMO0FBQUEsUUFlSSxXQUFZLFNBQVosUUFBWSxDQUFTLEtBQVQsRUFBZ0IsU0FBaEIsRUFBMEI7O0FBRWxDLFlBQUksRUFBSjs7QUFFQSxZQUFJLEtBQUosRUFBVztBQUNQLGlCQUFJLEVBQUosSUFBVSxRQUFWLEVBQW9CO0FBQUUsb0JBQUcsVUFBUSxTQUFTLEVBQVQsRUFBYSxLQUF4QixFQUErQixTQUFTLEVBQVQsRUFBYSxLQUFiLENBQW1CLFNBQW5CO0FBQWdDO0FBQ3hGLFNBRkQsTUFFTztBQUNILGlCQUFJLEVBQUosSUFBVSxRQUFWLEVBQW9CO0FBQUUseUJBQVMsRUFBVCxFQUFhLEtBQWIsQ0FBbUIsU0FBbkI7QUFBZ0M7QUFDekQ7QUFDSixLQXhCTDs7QUEwQkEsUUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFTLE9BQVQsRUFBaUI7O0FBRTNCLGFBQUssT0FBTCxHQUFlLEdBQUcsQ0FBSCxDQUFLLE1BQUwsQ0FBWSxFQUFaLEVBQWdCLFFBQVEsUUFBeEIsRUFBa0MsT0FBbEMsQ0FBZjs7QUFFQSxhQUFLLElBQUwsR0FBZSxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQWEsV0FBYixDQUFmO0FBQ0EsYUFBSyxPQUFMLEdBQWUsR0FBRyxDQUFILENBQUssQ0FFaEIsaUNBRmdCLEVBR1osMEJBSFksRUFJWixhQUpZLEVBS2hCLFFBTGdCLEVBT2xCLElBUGtCLENBT2IsRUFQYSxDQUFMLEVBT0gsSUFQRyxDQU9FLGVBUEYsRUFPbUIsSUFQbkIsQ0FBZjs7QUFTQSxhQUFLLE9BQUwsQ0FBYSxLQUFLLE9BQUwsQ0FBYSxPQUExQjs7O0FBR0EsWUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQixFQUF5QjtBQUNyQixpQkFBSyxPQUFMLENBQWEsUUFBYixDQUFzQix1QkFBcUIsS0FBSyxPQUFMLENBQWEsTUFBeEQ7QUFDQSxpQkFBSyxhQUFMLEdBQXFCLEtBQUssT0FBTCxDQUFhLE1BQWxDO0FBQ0g7O0FBRUQsYUFBSyxLQUFMLEdBQWEsS0FBSyxPQUFMLENBQWEsS0FBMUI7O0FBRUEsaUJBQVMsS0FBSyxJQUFkLElBQXNCLElBQXRCOztBQUVBLFlBQUcsQ0FBQyxXQUFXLEtBQUssT0FBTCxDQUFhLEdBQXhCLENBQUosRUFBa0M7QUFDOUIsdUJBQVcsS0FBSyxPQUFMLENBQWEsR0FBeEIsSUFBK0IsR0FBRyxDQUFILENBQUsscUNBQW1DLEtBQUssT0FBTCxDQUFhLEdBQWhELEdBQW9ELFVBQXpELEVBQXFFLFFBQXJFLENBQThFLE1BQTlFLEVBQXNGLEVBQXRGLENBQXlGLE9BQXpGLEVBQWtHLG9CQUFsRyxFQUF3SCxZQUFVOztBQUU3SixvQkFBSSxVQUFVLEdBQUcsQ0FBSCxDQUFLLElBQUwsRUFBVyxJQUFYLENBQWdCLGVBQWhCLENBQWQ7O0FBRUEsd0JBQVEsT0FBUixDQUFnQixPQUFoQixDQUF3Qix1QkFBeEIsRUFBaUQsQ0FBQyxPQUFELENBQWpEO0FBQ0Esd0JBQVEsS0FBUjtBQUNILGFBTjhCLENBQS9CO0FBT0g7QUFDSixLQW5DRDs7QUFzQ0EsT0FBRyxDQUFILENBQUssTUFBTCxDQUFZLFFBQVEsU0FBcEIsRUFBK0I7O0FBRTNCLGNBQU0sS0FGcUI7QUFHM0IsaUJBQVMsS0FIa0I7QUFJM0IsZ0JBQVEsS0FKbUI7QUFLM0IsdUJBQWUsRUFMWTtBQU0zQixlQUFPLEtBTm9COztBQVEzQixjQUFNLGdCQUFXOztBQUViLGdCQUFJLEtBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsVUFBaEIsQ0FBSixFQUFpQzs7QUFFakMsZ0JBQUksUUFBUSxJQUFaOztBQUVBLHVCQUFXLEtBQUssT0FBTCxDQUFhLEdBQXhCLEVBQTZCLElBQTdCLEdBQW9DLE9BQXBDLENBQTRDLEtBQUssT0FBakQ7O0FBRUEsZ0JBQUksZUFBZSxTQUFTLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsZUFBakIsQ0FBVCxFQUE0QyxFQUE1QyxDQUFuQjs7QUFFQSxpQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixFQUFDLFdBQVUsQ0FBWCxFQUFjLGNBQWMsQ0FBQyxDQUFELEdBQUcsS0FBSyxPQUFMLENBQWEsV0FBYixFQUEvQixFQUEyRCxpQkFBZ0IsQ0FBM0UsRUFBakIsRUFBZ0csT0FBaEcsQ0FBd0csRUFBQyxXQUFVLENBQVgsRUFBYyxjQUFjLENBQTVCLEVBQStCLGlCQUFnQixZQUEvQyxFQUF4RyxFQUFzSyxZQUFVOztBQUU1SyxvQkFBSSxNQUFNLE9BQU4sQ0FBYyxPQUFsQixFQUEyQjs7QUFFdkIsd0JBQUksVUFBVSxTQUFWLE9BQVUsR0FBVTtBQUFFLDhCQUFNLEtBQU47QUFBZ0IscUJBQTFDOztBQUVBLDBCQUFNLE9BQU4sR0FBZ0IsV0FBVyxPQUFYLEVBQW9CLE1BQU0sT0FBTixDQUFjLE9BQWxDLENBQWhCOztBQUVBLDBCQUFNLE9BQU4sQ0FBYyxLQUFkLENBQ0ksWUFBVztBQUFFLHFDQUFhLE1BQU0sT0FBbkI7QUFBOEIscUJBRC9DLEVBRUksWUFBVztBQUFFLDhCQUFNLE9BQU4sR0FBZ0IsV0FBVyxPQUFYLEVBQW9CLE1BQU0sT0FBTixDQUFjLE9BQWxDLENBQWhCO0FBQThELHFCQUYvRTtBQUlIO0FBRUosYUFkRDs7QUFnQkEsbUJBQU8sSUFBUDtBQUNILFNBbkMwQjs7QUFxQzNCLGVBQU8sZUFBUyxTQUFULEVBQW9COztBQUV2QixnQkFBSSxRQUFXLElBQWY7QUFBQSxnQkFDSSxXQUFXLFNBQVgsUUFBVyxHQUFVO0FBQ2pCLHNCQUFNLE9BQU4sQ0FBYyxNQUFkOztBQUVBLG9CQUFJLENBQUMsV0FBVyxNQUFNLE9BQU4sQ0FBYyxHQUF6QixFQUE4QixRQUE5QixHQUF5QyxNQUE5QyxFQUFzRDtBQUNsRCwrQkFBVyxNQUFNLE9BQU4sQ0FBYyxHQUF6QixFQUE4QixJQUE5QjtBQUNIOztBQUVELHNCQUFNLE9BQU4sQ0FBYyxPQUFkLENBQXNCLEtBQXRCLENBQTRCLEtBQTVCLEVBQW1DLEVBQW5DO0FBQ0Esc0JBQU0sT0FBTixDQUFjLE9BQWQsQ0FBc0IsaUJBQXRCLEVBQXlDLENBQUMsS0FBRCxDQUF6Qzs7QUFFQSx1QkFBTyxTQUFTLE1BQU0sSUFBZixDQUFQO0FBQ0gsYUFaTDs7QUFjQSxnQkFBSSxLQUFLLE9BQVQsRUFBa0IsYUFBYSxLQUFLLE9BQWxCOztBQUVsQixnQkFBSSxTQUFKLEVBQWU7QUFDWDtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEVBQUMsV0FBVSxDQUFYLEVBQWMsY0FBYyxDQUFDLENBQUQsR0FBSSxLQUFLLE9BQUwsQ0FBYSxXQUFiLEVBQWhDLEVBQTRELGlCQUFnQixDQUE1RSxFQUFyQixFQUFxRyxZQUFVO0FBQzNHO0FBQ0gsaUJBRkQ7QUFHSDtBQUNKLFNBOUQwQjs7QUFnRTNCLGlCQUFTLGlCQUFTLElBQVQsRUFBYzs7QUFFbkIsZ0JBQUksWUFBWSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLE1BQWxCLENBQWhCOztBQUVBLGdCQUFHLENBQUMsSUFBSixFQUFVO0FBQ04sdUJBQU8sVUFBVSxJQUFWLEVBQVA7QUFDSDs7QUFFRCxzQkFBVSxJQUFWLENBQWUsSUFBZjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0gsU0EzRTBCOztBQTZFM0IsZ0JBQVEsZ0JBQVMsT0FBVCxFQUFpQjs7QUFFckIsZ0JBQUksQ0FBQyxPQUFMLEVBQWE7QUFDVCx1QkFBTyxLQUFLLGFBQVo7QUFDSDs7QUFFRCxpQkFBSyxPQUFMLENBQWEsV0FBYixDQUF5Qix1QkFBcUIsS0FBSyxhQUFuRCxFQUFrRSxRQUFsRSxDQUEyRSx1QkFBcUIsT0FBaEc7O0FBRUEsaUJBQUssYUFBTCxHQUFxQixPQUFyQjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7QUF4RjBCLEtBQS9COztBQTJGQSxZQUFRLFFBQVIsR0FBbUI7QUFDZixpQkFBUyxFQURNO0FBRWYsZ0JBQVEsRUFGTztBQUdmLGlCQUFTLElBSE07QUFJZixlQUFPLElBSlE7QUFLZixhQUFLLFlBTFU7QUFNZixpQkFBUyxtQkFBVyxDQUFFO0FBTlAsS0FBbkI7O0FBU0EsT0FBRyxNQUFILEdBQXFCLE1BQXJCO0FBQ0EsT0FBRyxNQUFILENBQVUsT0FBVixHQUFxQixPQUFyQjtBQUNBLE9BQUcsTUFBSCxDQUFVLFFBQVYsR0FBcUIsUUFBckI7O0FBRUEsV0FBTyxNQUFQO0FBQ0gsQ0EzTEQiLCJmaWxlIjoibm90aWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtbm90aWZ5XCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgY29udGFpbmVycyA9IHt9LFxuICAgICAgICBtZXNzYWdlcyAgID0ge30sXG5cbiAgICAgICAgbm90aWZ5ICAgICA9ICBmdW5jdGlvbihvcHRpb25zKXtcblxuICAgICAgICAgICAgaWYgKFVJLiQudHlwZShvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7IG1lc3NhZ2U6IG9wdGlvbnMgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1sxXSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBVSS4kLmV4dGVuZChvcHRpb25zLCBVSS4kLnR5cGUoYXJndW1lbnRzWzFdKSA9PSAnc3RyaW5nJyA/IHtzdGF0dXM6YXJndW1lbnRzWzFdfSA6IGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAobmV3IE1lc3NhZ2Uob3B0aW9ucykpLnNob3coKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2VBbGwgID0gZnVuY3Rpb24oZ3JvdXAsIGluc3RhbnRseSl7XG5cbiAgICAgICAgICAgIHZhciBpZDtcblxuICAgICAgICAgICAgaWYgKGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgZm9yKGlkIGluIG1lc3NhZ2VzKSB7IGlmKGdyb3VwPT09bWVzc2FnZXNbaWRdLmdyb3VwKSBtZXNzYWdlc1tpZF0uY2xvc2UoaW5zdGFudGx5KTsgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IoaWQgaW4gbWVzc2FnZXMpIHsgbWVzc2FnZXNbaWRdLmNsb3NlKGluc3RhbnRseSk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIHZhciBNZXNzYWdlID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gVUkuJC5leHRlbmQoe30sIE1lc3NhZ2UuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMudXVpZCAgICA9IFVJLlV0aWxzLnVpZChcIm5vdGlmeW1zZ1wiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gVUkuJChbXG5cbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstbm90aWZ5LW1lc3NhZ2VcIj4nLFxuICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cInVrLWNsb3NlXCI+PC9hPicsXG4gICAgICAgICAgICAgICAgJzxkaXY+PC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgXS5qb2luKCcnKSkuZGF0YShcIm5vdGlmeU1lc3NhZ2VcIiwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50KHRoaXMub3B0aW9ucy5tZXNzYWdlKTtcblxuICAgICAgICAvLyBzdGF0dXNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdGF0dXMpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygndWstbm90aWZ5LW1lc3NhZ2UtJyt0aGlzLm9wdGlvbnMuc3RhdHVzKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudHN0YXR1cyA9IHRoaXMub3B0aW9ucy5zdGF0dXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyb3VwID0gdGhpcy5vcHRpb25zLmdyb3VwO1xuXG4gICAgICAgIG1lc3NhZ2VzW3RoaXMudXVpZF0gPSB0aGlzO1xuXG4gICAgICAgIGlmKCFjb250YWluZXJzW3RoaXMub3B0aW9ucy5wb3NdKSB7XG4gICAgICAgICAgICBjb250YWluZXJzW3RoaXMub3B0aW9ucy5wb3NdID0gVUkuJCgnPGRpdiBjbGFzcz1cInVrLW5vdGlmeSB1ay1ub3RpZnktJyt0aGlzLm9wdGlvbnMucG9zKydcIj48L2Rpdj4nKS5hcHBlbmRUbygnYm9keScpLm9uKFwiY2xpY2tcIiwgXCIudWstbm90aWZ5LW1lc3NhZ2VcIiwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gVUkuJCh0aGlzKS5kYXRhKFwibm90aWZ5TWVzc2FnZVwiKTtcblxuICAgICAgICAgICAgICAgIG1lc3NhZ2UuZWxlbWVudC50cmlnZ2VyKCdtYW51YWxjbG9zZS51ay5ub3RpZnknLCBbbWVzc2FnZV0pO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UuY2xvc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgVUkuJC5leHRlbmQoTWVzc2FnZS5wcm90b3R5cGUsIHtcblxuICAgICAgICB1dWlkOiBmYWxzZSxcbiAgICAgICAgZWxlbWVudDogZmFsc2UsXG4gICAgICAgIHRpbW91dDogZmFsc2UsXG4gICAgICAgIGN1cnJlbnRzdGF0dXM6IFwiXCIsXG4gICAgICAgIGdyb3VwOiBmYWxzZSxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lcnNbdGhpcy5vcHRpb25zLnBvc10uc2hvdygpLnByZXBlbmQodGhpcy5lbGVtZW50KTtcblxuICAgICAgICAgICAgdmFyIG1hcmdpbmJvdHRvbSA9IHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoXCJtYXJnaW4tYm90dG9tXCIpLCAxMCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1wib3BhY2l0eVwiOjAsIFwibWFyZ2luLXRvcFwiOiAtMSp0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoKSwgXCJtYXJnaW4tYm90dG9tXCI6MH0pLmFuaW1hdGUoe1wib3BhY2l0eVwiOjEsIFwibWFyZ2luLXRvcFwiOiAwLCBcIm1hcmdpbi1ib3R0b21cIjptYXJnaW5ib3R0b219LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLm9wdGlvbnMudGltZW91dCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZWZuID0gZnVuY3Rpb24oKXsgJHRoaXMuY2xvc2UoKTsgfTtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuaG92ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgY2xlYXJUaW1lb3V0KCR0aGlzLnRpbWVvdXQpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7ICR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsb3NlZm4sICR0aGlzLm9wdGlvbnMudGltZW91dCk7ICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKGluc3RhbnRseSkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGZpbmFsaXplID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lcnNbJHRoaXMub3B0aW9ucy5wb3NdLmNoaWxkcmVuKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5vcHRpb25zLm9uQ2xvc2UuYXBwbHkoJHRoaXMsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjbG9zZS51ay5ub3RpZnknLCBbJHRoaXNdKTtcblxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbJHRoaXMudXVpZF07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgICAgIGlmIChpbnN0YW50bHkpIHtcbiAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYW5pbWF0ZSh7XCJvcGFjaXR5XCI6MCwgXCJtYXJnaW4tdG9wXCI6IC0xKiB0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoKSwgXCJtYXJnaW4tYm90dG9tXCI6MH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsaXplKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29udGVudDogZnVuY3Rpb24oaHRtbCl7XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZChcIj5kaXZcIik7XG5cbiAgICAgICAgICAgIGlmKCFodG1sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5odG1sKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5odG1sKGh0bWwpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdGF0dXM6IGZ1bmN0aW9uKHN0YXR1cykge1xuXG4gICAgICAgICAgICBpZiAoIXN0YXR1cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRzdGF0dXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygndWstbm90aWZ5LW1lc3NhZ2UtJyt0aGlzLmN1cnJlbnRzdGF0dXMpLmFkZENsYXNzKCd1ay1ub3RpZnktbWVzc2FnZS0nK3N0YXR1cyk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudHN0YXR1cyA9IHN0YXR1cztcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIE1lc3NhZ2UuZGVmYXVsdHMgPSB7XG4gICAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgICAgIHN0YXR1czogXCJcIixcbiAgICAgICAgdGltZW91dDogNTAwMCxcbiAgICAgICAgZ3JvdXA6IG51bGwsXG4gICAgICAgIHBvczogJ3RvcC1jZW50ZXInLFxuICAgICAgICBvbkNsb3NlOiBmdW5jdGlvbigpIHt9XG4gICAgfTtcblxuICAgIFVJLm5vdGlmeSAgICAgICAgICA9IG5vdGlmeTtcbiAgICBVSS5ub3RpZnkubWVzc2FnZSAgPSBNZXNzYWdlO1xuICAgIFVJLm5vdGlmeS5jbG9zZUFsbCA9IGNsb3NlQWxsO1xuXG4gICAgcmV0dXJuIG5vdGlmeTtcbn0pO1xuIl19