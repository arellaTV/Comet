"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-upload", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('uploadSelect', {

        init: function init() {

            var $this = this;

            this.on("change", function () {
                xhrupload($this.element[0].files, $this.options);
                var twin = $this.element.clone(true).data('uploadSelect', $this);
                $this.element.replaceWith(twin);
                $this.element = twin;
            });
        }
    });

    UI.component('uploadDrop', {

        defaults: {
            'dragoverClass': 'uk-dragover'
        },

        init: function init() {

            var $this = this,
                hasdragCls = false;

            this.on("drop", function (e) {

                if (e.dataTransfer && e.dataTransfer.files) {

                    e.stopPropagation();
                    e.preventDefault();

                    $this.element.removeClass($this.options.dragoverClass);
                    $this.element.trigger('dropped.uk.upload', [e.dataTransfer.files]);

                    xhrupload(e.dataTransfer.files, $this.options);
                }
            }).on("dragenter", function (e) {
                e.stopPropagation();
                e.preventDefault();
            }).on("dragover", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (!hasdragCls) {
                    $this.element.addClass($this.options.dragoverClass);
                    hasdragCls = true;
                }
            }).on("dragleave", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $this.element.removeClass($this.options.dragoverClass);
                hasdragCls = false;
            });
        }
    });

    UI.support.ajaxupload = function () {

        function supportFileAPI() {
            var fi = document.createElement('INPUT');fi.type = 'file';return 'files' in fi;
        }

        function supportAjaxUploadProgressEvents() {
            var xhr = new XMLHttpRequest();return !!(xhr && 'upload' in xhr && 'onprogress' in xhr.upload);
        }

        function supportFormData() {
            return !!window.FormData;
        }

        return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
    }();

    if (UI.support.ajaxupload) {
        UI.$.event.props.push("dataTransfer");
    }

    function xhrupload(files, settings) {

        if (!UI.support.ajaxupload) {
            return this;
        }

        settings = UI.$.extend({}, xhrupload.defaults, settings);

        if (!files.length) {
            return;
        }

        if (settings.allow !== '*.*') {

            for (var i = 0, file; file = files[i]; i++) {

                if (!matchName(settings.allow, file.name)) {

                    if (typeof settings.notallowed == 'string') {
                        alert(settings.notallowed);
                    } else {
                        settings.notallowed(file, settings);
                    }
                    return;
                }
            }
        }

        var complete = settings.complete;

        if (settings.single) {

            var count = files.length,
                uploaded = 0,
                allow = true;

            settings.beforeAll(files);

            settings.complete = function (response, xhr) {

                uploaded = uploaded + 1;

                complete(response, xhr);

                if (settings.filelimit && uploaded >= settings.filelimit) {
                    allow = false;
                }

                if (allow && uploaded < count) {
                    upload([files[uploaded]], settings);
                } else {
                    settings.allcomplete(response, xhr);
                }
            };

            upload([files[0]], settings);
        } else {

            settings.complete = function (response, xhr) {
                complete(response, xhr);
                settings.allcomplete(response, xhr);
            };

            upload(files, settings);
        }

        function upload(files, settings) {

            // upload all at once
            var formData = new FormData(),
                xhr = new XMLHttpRequest();

            if (settings.before(settings, files) === false) return;

            for (var i = 0, f; f = files[i]; i++) {
                formData.append(settings.param, f);
            }
            for (var p in settings.params) {
                formData.append(p, settings.params[p]);
            }

            // Add any event handlers here...
            xhr.upload.addEventListener("progress", function (e) {
                var percent = e.loaded / e.total * 100;
                settings.progress(percent, e);
            }, false);

            xhr.addEventListener("loadstart", function (e) {
                settings.loadstart(e);
            }, false);
            xhr.addEventListener("load", function (e) {
                settings.load(e);
            }, false);
            xhr.addEventListener("loadend", function (e) {
                settings.loadend(e);
            }, false);
            xhr.addEventListener("error", function (e) {
                settings.error(e);
            }, false);
            xhr.addEventListener("abort", function (e) {
                settings.abort(e);
            }, false);

            xhr.open(settings.method, settings.action, true);

            if (settings.type == "json") {
                xhr.setRequestHeader("Accept", "application/json");
            }

            xhr.onreadystatechange = function () {

                settings.readystatechange(xhr);

                if (xhr.readyState == 4) {

                    var response = xhr.responseText;

                    if (settings.type == "json") {
                        try {
                            response = UI.$.parseJSON(response);
                        } catch (e) {
                            response = false;
                        }
                    }

                    settings.complete(response, xhr);
                }
            };
            settings.beforeSend(xhr);
            xhr.send(formData);
        }
    }

    xhrupload.defaults = {
        'action': '',
        'single': true,
        'method': 'POST',
        'param': 'files[]',
        'params': {},
        'allow': '*.*',
        'type': 'text',
        'filelimit': false,

        // events
        'before': function before(o) {},
        'beforeSend': function beforeSend(xhr) {},
        'beforeAll': function beforeAll() {},
        'loadstart': function loadstart() {},
        'load': function load() {},
        'loadend': function loadend() {},
        'error': function error() {},
        'abort': function abort() {},
        'progress': function progress() {},
        'complete': function complete() {},
        'allcomplete': function allcomplete() {},
        'readystatechange': function readystatechange() {},
        'notallowed': function notallowed(file, settings) {
            alert('Only the following file types are allowed: ' + settings.allow);
        }
    };

    function matchName(pattern, path) {

        var parsedPattern = '^' + pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.') + '$';

        parsedPattern = '^' + parsedPattern + '$';

        return path.match(new RegExp(parsedPattern, 'i')) !== null;
    }

    UI.Utils.xhrupload = xhrupload;

    return xhrupload;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3VwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxjQUFQLEVBQXVCLENBQUMsT0FBRCxDQUF2QixFQUFrQyxZQUFVO0FBQ3hDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLE9BQUcsU0FBSCxDQUFhLGNBQWIsRUFBNkI7O0FBRXpCLGNBQU0sZ0JBQVc7O0FBRWIsZ0JBQUksUUFBUSxJQUFaOztBQUVBLGlCQUFLLEVBQUwsQ0FBUSxRQUFSLEVBQWtCLFlBQVc7QUFDekIsMEJBQVUsTUFBTSxPQUFOLENBQWMsQ0FBZCxFQUFpQixLQUEzQixFQUFrQyxNQUFNLE9BQXhDO0FBQ0Esb0JBQUksT0FBTyxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQStCLGNBQS9CLEVBQStDLEtBQS9DLENBQVg7QUFDQSxzQkFBTSxPQUFOLENBQWMsV0FBZCxDQUEwQixJQUExQjtBQUNBLHNCQUFNLE9BQU4sR0FBZ0IsSUFBaEI7QUFDSCxhQUxEO0FBTUg7QUFad0IsS0FBN0I7O0FBZUEsT0FBRyxTQUFILENBQWEsWUFBYixFQUEyQjs7QUFFdkIsa0JBQVU7QUFDTiw2QkFBaUI7QUFEWCxTQUZhOztBQU12QixjQUFNLGdCQUFXOztBQUViLGdCQUFJLFFBQVEsSUFBWjtBQUFBLGdCQUFrQixhQUFhLEtBQS9COztBQUVBLGlCQUFLLEVBQUwsQ0FBUSxNQUFS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LENBZGY7QUFlakIsZ0JBQW9CLGdCQUFVLENBQUUsQ0FmZjtBQWdCakIsbUJBQW9CLG1CQUFVLENBQUUsQ0FoQmY7QUFpQmpCLGlCQUFvQixpQkFBVSxDQUFFLENBakJmO0FBa0JqQixpQkFBb0IsaUJBQVUsQ0FBRSxDQWxCZjtBQW1CakIsb0JBQW9CLG9CQUFVLENBQUUsQ0FuQmY7QUFvQmpCLG9CQUFvQixvQkFBVSxDQUFFLENBcEJmO0FBcUJqQix1QkFBb0IsdUJBQVUsQ0FBRSxDQXJCZjtBQXNCakIsNEJBQW9CLDRCQUFVLENBQUUsQ0F0QmY7QUF1QmpCLHNCQUFvQixvQkFBUyxJQUFULEVBQWUsUUFBZixFQUF3QjtBQUFFLGtCQUFNLGdEQUE4QyxTQUFTLEtBQTdEO0FBQXNFO0FBdkJuRyxLQUFyQjs7QUEwQkEsYUFBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLElBQTVCLEVBQWtDOztBQUU5QixZQUFJLGdCQUFnQixNQUFNLFFBQVEsT0FBUixDQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUN0QixPQURzQixDQUNkLE9BRGMsRUFDTCxlQURLLEVBRXRCLE9BRnNCLENBRWQsS0FGYyxFQUVQLFNBRk8sRUFHdEIsT0FIc0IsQ0FHZCxhQUhjLEVBR0MsS0FIRCxDQUFOLEdBR2dCLEdBSHBDOztBQUtBLHdCQUFnQixNQUFNLGFBQU4sR0FBc0IsR0FBdEM7O0FBRUEsZUFBUSxLQUFLLEtBQUwsQ0FBVyxJQUFJLE1BQUosQ0FBVyxhQUFYLEVBQTBCLEdBQTFCLENBQVgsTUFBK0MsSUFBdkQ7QUFDSDs7QUFFRCxPQUFHLEtBQUgsQ0FBUyxTQUFULEdBQXFCLFNBQXJCOztBQUVBLFdBQU8sU0FBUDtBQUNILENBbFFEIiwiZmlsZSI6InVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LXVwbG9hZFwiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgVUkuY29tcG9uZW50KCd1cGxvYWRTZWxlY3QnLCB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgeGhydXBsb2FkKCR0aGlzLmVsZW1lbnRbMF0uZmlsZXMsICR0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHZhciB0d2luID0gJHRoaXMuZWxlbWVudC5jbG9uZSh0cnVlKS5kYXRhKCd1cGxvYWRTZWxlY3QnLCAkdGhpcyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZXBsYWNlV2l0aCh0d2luKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50ID0gdHdpbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBVSS5jb21wb25lbnQoJ3VwbG9hZERyb3AnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICdkcmFnb3ZlckNsYXNzJzogJ3VrLWRyYWdvdmVyJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzLCBoYXNkcmFnQ2xzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMub24oXCJkcm9wXCIsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyICYmIGUuZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJHRoaXMub3B0aW9ucy5kcmFnb3ZlckNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC50cmlnZ2VyKCdkcm9wcGVkLnVrLnVwbG9hZCcsIFtlLmRhdGFUcmFuc2Zlci5maWxlc10pO1xuXG4gICAgICAgICAgICAgICAgICAgIHhocnVwbG9hZChlLmRhdGFUcmFuc2Zlci5maWxlcywgJHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KS5vbihcImRyYWdlbnRlclwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pLm9uKFwiZHJhZ292ZXJcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWhhc2RyYWdDbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5hZGRDbGFzcygkdGhpcy5vcHRpb25zLmRyYWdvdmVyQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBoYXNkcmFnQ2xzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5vbihcImRyYWdsZWF2ZVwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCR0aGlzLm9wdGlvbnMuZHJhZ292ZXJDbGFzcyk7XG4gICAgICAgICAgICAgICAgaGFzZHJhZ0NscyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgVUkuc3VwcG9ydC5hamF4dXBsb2FkID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRGaWxlQVBJKCkge1xuICAgICAgICAgICAgdmFyIGZpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSU5QVVQnKTsgZmkudHlwZSA9ICdmaWxlJzsgcmV0dXJuICdmaWxlcycgaW4gZmk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdXBwb3J0QWpheFVwbG9hZFByb2dyZXNzRXZlbnRzKCkge1xuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOyByZXR1cm4gISEgKHhociAmJiAoJ3VwbG9hZCcgaW4geGhyKSAmJiAoJ29ucHJvZ3Jlc3MnIGluIHhoci51cGxvYWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRGb3JtRGF0YSgpIHtcbiAgICAgICAgICAgIHJldHVybiAhISB3aW5kb3cuRm9ybURhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwcG9ydEZpbGVBUEkoKSAmJiBzdXBwb3J0QWpheFVwbG9hZFByb2dyZXNzRXZlbnRzKCkgJiYgc3VwcG9ydEZvcm1EYXRhKCk7XG4gICAgfSkoKTtcblxuICAgIGlmIChVSS5zdXBwb3J0LmFqYXh1cGxvYWQpe1xuICAgICAgICBVSS4kLmV2ZW50LnByb3BzLnB1c2goXCJkYXRhVHJhbnNmZXJcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geGhydXBsb2FkKGZpbGVzLCBzZXR0aW5ncykge1xuXG4gICAgICAgIGlmICghVUkuc3VwcG9ydC5hamF4dXBsb2FkKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0dGluZ3MgPSBVSS4kLmV4dGVuZCh7fSwgeGhydXBsb2FkLmRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgaWYgKCFmaWxlcy5sZW5ndGgpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmFsbG93ICE9PSAnKi4qJykge1xuXG4gICAgICAgICAgICBmb3IodmFyIGk9MCxmaWxlO2ZpbGU9ZmlsZXNbaV07aSsrKSB7XG5cbiAgICAgICAgICAgICAgICBpZighbWF0Y2hOYW1lKHNldHRpbmdzLmFsbG93LCBmaWxlLm5hbWUpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHNldHRpbmdzLm5vdGFsbG93ZWQpID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KHNldHRpbmdzLm5vdGFsbG93ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5ub3RhbGxvd2VkKGZpbGUsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBsZXRlID0gc2V0dGluZ3MuY29tcGxldGU7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLnNpbmdsZSl7XG5cbiAgICAgICAgICAgIHZhciBjb3VudCAgICA9IGZpbGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICB1cGxvYWRlZCA9IDAsXG4gICAgICAgICAgICAgICAgYWxsb3cgICAgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuYmVmb3JlQWxsKGZpbGVzKTtcblxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbXBsZXRlID0gZnVuY3Rpb24ocmVzcG9uc2UsIHhocil7XG5cbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQgPSB1cGxvYWRlZCArIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUocmVzcG9uc2UsIHhocik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmZpbGVsaW1pdCAmJiB1cGxvYWRlZCA+PSBzZXR0aW5ncy5maWxlbGltaXQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxvdyAmJiB1cGxvYWRlZDxjb3VudCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWQoW2ZpbGVzW3VwbG9hZGVkXV0sIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmFsbGNvbXBsZXRlKHJlc3BvbnNlLCB4aHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHVwbG9hZChbZmlsZXNbMF1dLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29tcGxldGUgPSBmdW5jdGlvbihyZXNwb25zZSwgeGhyKXtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZShyZXNwb25zZSwgeGhyKTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5hbGxjb21wbGV0ZShyZXNwb25zZSwgeGhyKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHVwbG9hZChmaWxlcywgc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkKGZpbGVzLCBzZXR0aW5ncyl7XG5cbiAgICAgICAgICAgIC8vIHVwbG9hZCBhbGwgYXQgb25jZVxuICAgICAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCksIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYmVmb3JlKHNldHRpbmdzLCBmaWxlcyk9PT1mYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgZjsgZiA9IGZpbGVzW2ldOyBpKyspIHsgZm9ybURhdGEuYXBwZW5kKHNldHRpbmdzLnBhcmFtLCBmKTsgfVxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzZXR0aW5ncy5wYXJhbXMpIHsgZm9ybURhdGEuYXBwZW5kKHAsIHNldHRpbmdzLnBhcmFtc1twXSk7IH1cblxuICAgICAgICAgICAgLy8gQWRkIGFueSBldmVudCBoYW5kbGVycyBoZXJlLi4uXG4gICAgICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IChlLmxvYWRlZCAvIGUudG90YWwpKjEwMDtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5wcm9ncmVzcyhwZXJjZW50LCBlKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2Fkc3RhcnRcIiwgZnVuY3Rpb24oZSl7IHNldHRpbmdzLmxvYWRzdGFydChlKTsgfSwgZmFsc2UpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICAgICAgZnVuY3Rpb24oZSl7IHNldHRpbmdzLmxvYWQoZSk7ICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsICAgZnVuY3Rpb24oZSl7IHNldHRpbmdzLmxvYWRlbmQoZSk7ICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAgICAgZnVuY3Rpb24oZSl7IHNldHRpbmdzLmVycm9yKGUpOyAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCAgICAgZnVuY3Rpb24oZSl7IHNldHRpbmdzLmFib3J0KGUpOyAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgICAgICB4aHIub3BlbihzZXR0aW5ncy5tZXRob2QsIHNldHRpbmdzLmFjdGlvbiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy50eXBlPT1cImpzb25cIikge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MucmVhZHlzdGF0ZWNoYW5nZSh4aHIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlPT00KXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy50eXBlPT1cImpzb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IFVJLiQucGFyc2VKU09OKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb21wbGV0ZShyZXNwb25zZSwgeGhyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2V0dGluZ3MuYmVmb3JlU2VuZCh4aHIpO1xuICAgICAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhydXBsb2FkLmRlZmF1bHRzID0ge1xuICAgICAgICAnYWN0aW9uJzogJycsXG4gICAgICAgICdzaW5nbGUnOiB0cnVlLFxuICAgICAgICAnbWV0aG9kJzogJ1BPU1QnLFxuICAgICAgICAncGFyYW0nIDogJ2ZpbGVzW10nLFxuICAgICAgICAncGFyYW1zJzoge30sXG4gICAgICAgICdhbGxvdycgOiAnKi4qJyxcbiAgICAgICAgJ3R5cGUnICA6ICd0ZXh0JyxcbiAgICAgICAgJ2ZpbGVsaW1pdCc6IGZhbHNlLFxuXG4gICAgICAgIC8vIGV2ZW50c1xuICAgICAgICAnYmVmb3JlJyAgICAgICAgICA6IGZ1bmN0aW9uKG8pe30sXG4gICAgICAgICdiZWZvcmVTZW5kJyAgICAgIDogZnVuY3Rpb24oeGhyKXt9LFxuICAgICAgICAnYmVmb3JlQWxsJyAgICAgICA6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgJ2xvYWRzdGFydCcgICAgICAgOiBmdW5jdGlvbigpe30sXG4gICAgICAgICdsb2FkJyAgICAgICAgICAgIDogZnVuY3Rpb24oKXt9LFxuICAgICAgICAnbG9hZGVuZCcgICAgICAgICA6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgJ2Vycm9yJyAgICAgICAgICAgOiBmdW5jdGlvbigpe30sXG4gICAgICAgICdhYm9ydCcgICAgICAgICAgIDogZnVuY3Rpb24oKXt9LFxuICAgICAgICAncHJvZ3Jlc3MnICAgICAgICA6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgJ2NvbXBsZXRlJyAgICAgICAgOiBmdW5jdGlvbigpe30sXG4gICAgICAgICdhbGxjb21wbGV0ZScgICAgIDogZnVuY3Rpb24oKXt9LFxuICAgICAgICAncmVhZHlzdGF0ZWNoYW5nZSc6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgJ25vdGFsbG93ZWQnICAgICAgOiBmdW5jdGlvbihmaWxlLCBzZXR0aW5ncyl7IGFsZXJ0KCdPbmx5IHRoZSBmb2xsb3dpbmcgZmlsZSB0eXBlcyBhcmUgYWxsb3dlZDogJytzZXR0aW5ncy5hbGxvdyk7IH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hOYW1lKHBhdHRlcm4sIHBhdGgpIHtcblxuICAgICAgICB2YXIgcGFyc2VkUGF0dGVybiA9ICdeJyArIHBhdHRlcm4ucmVwbGFjZSgvXFwvL2csICdcXFxcLycpLlxuICAgICAgICAgICAgcmVwbGFjZSgvXFwqXFwqL2csICcoXFxcXC9bXlxcXFwvXSspKicpLlxuICAgICAgICAgICAgcmVwbGFjZSgvXFwqL2csICdbXlxcXFwvXSsnKS5cbiAgICAgICAgICAgIHJlcGxhY2UoLygoPyFcXFxcKSlcXD8vZywgJyQxLicpICsgJyQnO1xuXG4gICAgICAgIHBhcnNlZFBhdHRlcm4gPSAnXicgKyBwYXJzZWRQYXR0ZXJuICsgJyQnO1xuXG4gICAgICAgIHJldHVybiAocGF0aC5tYXRjaChuZXcgUmVnRXhwKHBhcnNlZFBhdHRlcm4sICdpJykpICE9PSBudWxsKTtcbiAgICB9XG5cbiAgICBVSS5VdGlscy54aHJ1cGxvYWQgPSB4aHJ1cGxvYWQ7XG5cbiAgICByZXR1cm4geGhydXBsb2FkO1xufSk7XG4iXX0=