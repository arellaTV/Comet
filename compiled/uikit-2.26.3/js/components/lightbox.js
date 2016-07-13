"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        // AMD
        define("uikit-lightbox", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var modal,
        cache = {};

    UI.component('lightbox', {

        defaults: {
            "group": false,
            "duration": 400,
            "keyboard": true
        },

        index: 0,
        items: false,

        boot: function boot() {

            UI.$html.on('click', '[data-uk-lightbox]', function (e) {

                e.preventDefault();

                var link = UI.$(this);

                if (!link.data("lightbox")) {

                    UI.lightbox(link, UI.Utils.options(link.attr("data-uk-lightbox")));
                }

                link.data("lightbox").show(link);
            });

            // keyboard navigation
            UI.$doc.on('keyup', function (e) {

                if (modal && modal.is(':visible') && modal.lightbox.options.keyboard) {

                    e.preventDefault();

                    switch (e.keyCode) {
                        case 37:
                            modal.lightbox.previous();
                            break;
                        case 39:
                            modal.lightbox.next();
                            break;
                    }
                }
            });
        },

        init: function init() {

            var siblings = [];

            this.index = 0;
            this.siblings = [];

            if (this.element && this.element.length) {

                var domSiblings = this.options.group ? UI.$(['[data-uk-lightbox*="' + this.options.group + '"]', "[data-uk-lightbox*='" + this.options.group + "']"].join(',')) : this.element;

                domSiblings.each(function () {

                    var ele = UI.$(this);

                    siblings.push({
                        'source': ele.attr('href'),
                        'title': ele.attr('data-title') || ele.attr('title'),
                        'type': ele.attr("data-lightbox-type") || 'auto',
                        'link': ele
                    });
                });

                this.index = domSiblings.index(this.element);
                this.siblings = siblings;
            } else if (this.options.group && this.options.group.length) {
                this.siblings = this.options.group;
            }

            this.trigger('lightbox-init', [this]);
        },

        show: function show(index) {

            this.modal = getModal(this);

            // stop previous animation
            this.modal.dialog.stop();
            this.modal.content.stop();

            var $this = this,
                promise = UI.$.Deferred(),
                data,
                item;

            index = index || 0;

            // index is a jQuery object or DOM element
            if ((typeof index === "undefined" ? "undefined" : _typeof(index)) == 'object') {

                this.siblings.forEach(function (s, idx) {

                    if (index[0] === s.link[0]) {
                        index = idx;
                    }
                });
            }

            // fix index if needed
            if (index < 0) {
                index = this.siblings.length - index;
            } else if (!this.siblings[index]) {
                index = 0;
            }

            item = this.siblings[index];

            data = {
                "lightbox": $this,
                "source": item.source,
                "type": item.type,
                "index": index,
                "promise": promise,
                "title": item.title,
                "item": item,
                "meta": {
                    "content": '',
                    "width": null,
                    "height": null
                }
            };

            this.index = index;

            this.modal.content.empty();

            if (!this.modal.is(':visible')) {
                this.modal.content.css({ width: '', height: '' }).empty();
                this.modal.modal.show();
            }

            this.modal.loader.removeClass('uk-hidden');

            promise.promise().done(function () {

                $this.data = data;
                $this.fitSize(data);
            }).fail(function () {

                data.meta.content = '<div class="uk-position-cover uk-flex uk-flex-middle uk-flex-center"><strong>Loading resource failed!</strong></div>';
                data.meta.width = 400;
                data.meta.height = 300;

                $this.data = data;
                $this.fitSize(data);
            });

            $this.trigger('showitem.uk.lightbox', [data]);
        },

        fitSize: function fitSize() {

            var $this = this,
                data = this.data,
                pad = this.modal.dialog.outerWidth() - this.modal.dialog.width(),
                dpadTop = parseInt(this.modal.dialog.css('margin-top'), 10),
                dpadBot = parseInt(this.modal.dialog.css('margin-bottom'), 10),
                dpad = dpadTop + dpadBot,
                content = data.meta.content,
                duration = $this.options.duration;

            if (this.siblings.length > 1) {

                content = [content, '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-previous uk-hidden-touch" data-lightbox-previous></a>', '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-next uk-hidden-touch" data-lightbox-next></a>'].join('');
            }

            // calculate width
            var tmp = UI.$('<div>&nbsp;</div>').css({
                'opacity': 0,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': '100%',
                'max-width': $this.modal.dialog.css('max-width'),
                'padding': $this.modal.dialog.css('padding'),
                'margin': $this.modal.dialog.css('margin')
            }),
                maxwidth,
                maxheight,
                w = data.meta.width,
                h = data.meta.height;

            tmp.appendTo('body').width();

            maxwidth = tmp.width();
            maxheight = window.innerHeight - dpad;

            tmp.remove();

            this.modal.dialog.find('.uk-modal-caption').remove();

            if (data.title) {
                this.modal.dialog.append('<div class="uk-modal-caption">' + data.title + '</div>');
                maxheight -= this.modal.dialog.find('.uk-modal-caption').outerHeight();
            }

            if (maxwidth < data.meta.width) {

                h = Math.floor(h * (maxwidth / w));
                w = maxwidth;
            }

            if (maxheight < h) {

                h = Math.floor(maxheight);
                w = Math.ceil(data.meta.width * (maxheight / data.meta.height));
            }

            this.modal.content.css('opacity', 0).width(w).html(content);

            if (data.type == 'iframe') {
                this.modal.content.find('iframe:first').height(h);
            }

            var dh = h + pad,
                t = Math.floor(window.innerHeight / 2 - dh / 2) - dpad;

            if (t < 0) {
                t = 0;
            }

            this.modal.closer.addClass('uk-hidden');

            if ($this.modal.data('mwidth') == w && $this.modal.data('mheight') == h) {
                duration = 0;
            }

            this.modal.dialog.animate({ width: w + pad, height: h + pad, top: t }, duration, 'swing', function () {
                $this.modal.loader.addClass('uk-hidden');
                $this.modal.content.css({ width: '' }).animate({ 'opacity': 1 }, function () {
                    $this.modal.closer.removeClass('uk-hidden');
                });

                $this.modal.data({ 'mwidth': w, 'mheight': h });
            });
        },

        next: function next() {
            this.show(this.siblings[this.index + 1] ? this.index + 1 : 0);
        },

        previous: function previous() {
            this.show(this.siblings[this.index - 1] ? this.index - 1 : this.siblings.length - 1);
        }
    });

    // Plugins

    UI.plugin('lightbox', 'image', {

        init: function init(lightbox) {

            lightbox.on("showitem.uk.lightbox", function (e, data) {

                if (data.type == 'image' || data.source && data.source.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {

                    var resolve = function resolve(source, width, height) {

                        data.meta = {
                            "content": '<img class="uk-responsive-width" width="' + width + '" height="' + height + '" src ="' + source + '">',
                            "width": width,
                            "height": height
                        };

                        data.type = 'image';

                        data.promise.resolve();
                    };

                    if (!cache[data.source]) {

                        var img = new Image();

                        img.onerror = function () {
                            data.promise.reject('Loading image failed');
                        };

                        img.onload = function () {
                            cache[data.source] = { width: img.width, height: img.height };
                            resolve(data.source, cache[data.source].width, cache[data.source].height);
                        };

                        img.src = data.source;
                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });

    UI.plugin("lightbox", "youtube", {

        init: function init(lightbox) {

            var youtubeRegExp = /(\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/,
                youtubeRegExpShort = /youtu\.be\/(.*)/;

            lightbox.on("showitem.uk.lightbox", function (e, data) {

                var id,
                    matches,
                    resolve = function resolve(id, width, height) {

                    data.meta = {
                        'content': '<iframe src="//www.youtube.com/embed/' + id + '" width="' + width + '" height="' + height + '" style="max-width:100%;"></iframe>',
                        'width': width,
                        'height': height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(youtubeRegExp)) {
                    id = matches[2];
                }

                if (matches = data.source.match(youtubeRegExpShort)) {
                    id = matches[1];
                }

                if (id) {

                    if (!cache[id]) {

                        var img = new Image(),
                            lowres = false;

                        img.onerror = function () {
                            cache[id] = { width: 640, height: 320 };
                            resolve(id, cache[id].width, cache[id].height);
                        };

                        img.onload = function () {
                            //youtube default 404 thumb, fall back to lowres
                            if (img.width == 120 && img.height == 90) {
                                if (!lowres) {
                                    lowres = true;
                                    img.src = '//img.youtube.com/vi/' + id + '/0.jpg';
                                } else {
                                    cache[id] = { width: 640, height: 320 };
                                    resolve(id, cache[id].width, cache[id].height);
                                }
                            } else {
                                cache[id] = { width: img.width, height: img.height };
                                resolve(id, img.width, img.height);
                            }
                        };

                        img.src = '//img.youtube.com/vi/' + id + '/maxresdefault.jpg';
                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });

    UI.plugin("lightbox", "vimeo", {

        init: function init(lightbox) {

            var regex = /(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/,
                matches;

            lightbox.on("showitem.uk.lightbox", function (e, data) {

                var id,
                    resolve = function resolve(id, width, height) {

                    data.meta = {
                        'content': '<iframe src="//player.vimeo.com/video/' + id + '" width="' + width + '" height="' + height + '" style="width:100%;box-sizing:border-box;"></iframe>',
                        'width': width,
                        'height': height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(regex)) {

                    id = matches[2];

                    if (!cache[id]) {

                        UI.$.ajax({
                            type: 'GET',
                            url: 'http://vimeo.com/api/oembed.json?url=' + encodeURI(data.source),
                            jsonp: 'callback',
                            dataType: 'jsonp',
                            success: function success(data) {
                                cache[id] = { width: data.width, height: data.height };
                                resolve(id, cache[id].width, cache[id].height);
                            }
                        });
                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });

    UI.plugin("lightbox", "video", {

        init: function init(lightbox) {

            lightbox.on("showitem.uk.lightbox", function (e, data) {

                var resolve = function resolve(source, width, height) {

                    data.meta = {
                        'content': '<video class="uk-responsive-width" src="' + source + '" width="' + width + '" height="' + height + '" controls></video>',
                        'width': width,
                        'height': height
                    };

                    data.type = 'video';

                    data.promise.resolve();
                };

                if (data.type == 'video' || data.source.match(/\.(mp4|webm|ogv)$/i)) {

                    if (!cache[data.source]) {

                        var vid = UI.$('<video style="position:fixed;visibility:hidden;top:-10000px;"></video>').attr('src', data.source).appendTo('body');

                        var idle = setInterval(function () {

                            if (vid[0].videoWidth) {
                                clearInterval(idle);
                                cache[data.source] = { width: vid[0].videoWidth, height: vid[0].videoHeight };
                                resolve(data.source, cache[data.source].width, cache[data.source].height);
                                vid.remove();
                            }
                        }, 20);
                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });

    UIkit.plugin("lightbox", "iframe", {

        init: function init(lightbox) {

            lightbox.on("showitem.uk.lightbox", function (e, data) {

                var resolve = function resolve(source, width, height) {

                    data.meta = {
                        'content': '<iframe class="uk-responsive-width" src="' + source + '" width="' + width + '" height="' + height + '"></iframe>',
                        'width': width,
                        'height': height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (data.type === 'iframe' || data.source.match(/\.(html|php)$/)) {
                    resolve(data.source, lightbox.options.width || 800, lightbox.options.height || 600);
                }
            });
        }
    });

    function getModal(lightbox) {

        if (modal) {
            modal.lightbox = lightbox;
            return modal;
        }

        // init lightbox container
        modal = UI.$(['<div class="uk-modal">', '<div class="uk-modal-dialog uk-modal-dialog-lightbox uk-slidenav-position" style="margin-left:auto;margin-right:auto;width:200px;height:200px;top:' + Math.abs(window.innerHeight / 2 - 200) + 'px;">', '<a href="#" class="uk-modal-close uk-close uk-close-alt"></a>', '<div class="uk-lightbox-content"></div>', '<div class="uk-modal-spinner uk-hidden"></div>', '</div>', '</div>'].join('')).appendTo('body');

        modal.dialog = modal.find('.uk-modal-dialog:first');
        modal.content = modal.find('.uk-lightbox-content:first');
        modal.loader = modal.find('.uk-modal-spinner:first');
        modal.closer = modal.find('.uk-close.uk-close-alt');
        modal.modal = UI.modal(modal, { modal: false });

        // next / previous
        modal.on("swipeRight swipeLeft", function (e) {
            modal.lightbox[e.type == 'swipeLeft' ? 'next' : 'previous']();
        }).on("click", "[data-lightbox-previous], [data-lightbox-next]", function (e) {
            e.preventDefault();
            modal.lightbox[UI.$(this).is('[data-lightbox-next]') ? 'next' : 'previous']();
        });

        // destroy content on modal hide
        modal.on("hide.uk.modal", function (e) {
            modal.content.html('');
        });

        var resizeCache = { w: window.innerWidth, h: window.innerHeight };

        UI.$win.on('load resize orientationchange', UI.Utils.debounce(function (e) {

            if (resizeCache.w !== window.innerWidth && modal.is(':visible') && !UI.Utils.isFullscreen()) {
                modal.lightbox.fitSize();
            }

            resizeCache = { w: window.innerWidth, h: window.innerHeight };
        }, 100));

        modal.lightbox = lightbox;

        return modal;
    }

    UI.lightbox.create = function (items, options) {

        if (!items) return;

        var group = [],
            o;

        items.forEach(function (item) {

            group.push(UI.$.extend({
                'source': '',
                'title': '',
                'type': 'auto',
                'link': false
            }, typeof item == 'string' ? { 'source': item } : item));
        });

        o = UI.lightbox(UI.$.extend({}, options, { 'group': group }));

        return o;
    };

    return UI.lightbox;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2xpZ2h0Ym94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDOztBQUMzQyxlQUFPLGdCQUFQLEVBQXlCLENBQUMsT0FBRCxDQUF6QixFQUFvQyxZQUFVO0FBQzFDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksS0FBSjtBQUFBLFFBQVcsUUFBUSxFQUFuQjs7QUFFQSxPQUFHLFNBQUgsQ0FBYSxVQUFiLEVBQXlCOztBQUVyQixrQkFBVTtBQUNOLHFCQUFlLEtBRFQ7QUFFTix3QkFBZSxHQUZUO0FBR04sd0JBQWU7QUFIVCxTQUZXOztBQVFyQixlQUFRLENBUmE7QUFTckIsZUFBUSxLQVRhOztBQVdyQixjQUFNLGdCQUFXOztBQUViLGVBQUcsS0FBSCxDQUFTLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLG9CQUFyQixFQUEyQyxVQUFTLENBQVQsRUFBVzs7QUFFbEQsa0JBQUUsY0FBRjs7QUFFQSxvQkFBSSxPQUFPLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBWDs7QUFFQSxvQkFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLFVBQVYsQ0FBTCxFQUE0Qjs7QUFFeEIsdUJBQUcsUUFBSCxDQUFZLElBQVosRUFBa0IsR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixLQUFLLElBQUwsQ0FBVSxrQkFBVixDQUFqQixDQUFsQjtBQUNIOztBQUVELHFCQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLElBQXRCLENB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QUFFQSxlQUFPLEtBQVA7QUFDSDs7QUFFRCxPQUFHLFFBQUgsQ0FBWSxNQUFaLEdBQXFCLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5Qjs7QUFFMUMsWUFBSSxDQUFDLEtBQUwsRUFBWTs7QUFFWixZQUFJLFFBQVEsRUFBWjtBQUFBLFlBQWdCLENBQWhCOztBQUVBLGNBQU0sT0FBTixDQUFjLFVBQVMsSUFBVCxFQUFlOztBQUV6QixrQkFBTSxJQUFOLENBQVcsR0FBRyxDQUFILENBQUssTUFBTCxDQUFZO0FBQ25CLDBCQUFXLEVBRFE7QUFFbkIseUJBQVcsRUFGUTtBQUduQix3QkFBVyxNQUhRO0FBSW5CLHdCQUFXO0FBSlEsYUFBWixFQUtQLE9BQU8sSUFBUCxJQUFnQixRQUFoQixHQUEyQixFQUFDLFVBQVUsSUFBWCxFQUEzQixHQUE4QyxJQUx2QyxDQUFYO0FBTUgsU0FSRDs7QUFVQSxZQUFJLEdBQUcsUUFBSCxDQUFZLEdBQUcsQ0FBSCxDQUFLLE1BQUwsQ0FBWSxFQUFaLEVBQWdCLE9BQWhCLEVBQXlCLEVBQUMsU0FBUSxLQUFULEVBQXpCLENBQVosQ0FBSjs7QUFFQSxlQUFPLENBQVA7QUFDSCxLQW5CRDs7QUFxQkEsV0FBTyxHQUFHLFFBQVY7QUFDSCxDQTVrQkQiLCJmaWxlIjoibGlnaHRib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgeyAvLyBBTURcbiAgICAgICAgZGVmaW5lKFwidWlraXQtbGlnaHRib3hcIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSl7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBtb2RhbCwgY2FjaGUgPSB7fTtcblxuICAgIFVJLmNvbXBvbmVudCgnbGlnaHRib3gnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIFwiZ3JvdXBcIiAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBcImR1cmF0aW9uXCIgICA6IDQwMCxcbiAgICAgICAgICAgIFwia2V5Ym9hcmRcIiAgIDogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGluZGV4IDogMCxcbiAgICAgICAgaXRlbXMgOiBmYWxzZSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgVUkuJGh0bWwub24oJ2NsaWNrJywgJ1tkYXRhLXVrLWxpZ2h0Ym94XScsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rLmRhdGEoXCJsaWdodGJveFwiKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIFVJLmxpZ2h0Ym94KGxpbmssIFVJLlV0aWxzLm9wdGlvbnMobGluay5hdHRyKFwiZGF0YS11ay1saWdodGJveFwiKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxpbmsuZGF0YShcImxpZ2h0Ym94XCIpLnNob3cobGluayk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8ga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgICAgICAgVUkuJGRvYy5vbigna2V5dXAnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kYWwgJiYgbW9kYWwuaXMoJzp2aXNpYmxlJykgJiYgbW9kYWwubGlnaHRib3gub3B0aW9ucy5rZXlib2FyZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmxpZ2h0Ym94LnByZXZpb3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmxpZ2h0Ym94Lm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgc2libGluZ3MgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5pbmRleCAgICA9IDA7XG4gICAgICAgICAgICB0aGlzLnNpYmxpbmdzID0gW107XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQgJiYgdGhpcy5lbGVtZW50Lmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRvbVNpYmxpbmdzICA9IHRoaXMub3B0aW9ucy5ncm91cCA/IFVJLiQoW1xuICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdWstbGlnaHRib3gqPVwiJyt0aGlzLm9wdGlvbnMuZ3JvdXArJ1wiXScsXG4gICAgICAgICAgICAgICAgICAgIFwiW2RhdGEtdWstbGlnaHRib3gqPSdcIit0aGlzLm9wdGlvbnMuZ3JvdXArXCInXVwiXG4gICAgICAgICAgICAgICAgXS5qb2luKCcsJykpIDogdGhpcy5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgZG9tU2libGluZ3MuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzb3VyY2UnOiBlbGUuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJyA6IGVsZS5hdHRyKCdkYXRhLXRpdGxlJykgfHwgZWxlLmF0dHIoJ3RpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZScgIDogZWxlLmF0dHIoXCJkYXRhLWxpZ2h0Ym94LXR5cGVcIikgfHwgJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpbmsnICA6IGVsZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggICAgPSBkb21TaWJsaW5ncy5pbmRleCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2libGluZ3MgPSBzaWJsaW5ncztcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZ3JvdXAgJiYgdGhpcy5vcHRpb25zLmdyb3VwLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2libGluZ3MgPSB0aGlzLm9wdGlvbnMuZ3JvdXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignbGlnaHRib3gtaW5pdCcsIFt0aGlzXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgdGhpcy5tb2RhbCA9IGdldE1vZGFsKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBzdG9wIHByZXZpb3VzIGFuaW1hdGlvblxuICAgICAgICAgICAgdGhpcy5tb2RhbC5kaWFsb2cuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RhbC5jb250ZW50LnN0b3AoKTtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgcHJvbWlzZSA9IFVJLiQuRGVmZXJyZWQoKSwgZGF0YSwgaXRlbTtcblxuICAgICAgICAgICAgaW5kZXggPSBpbmRleCB8fCAwO1xuXG4gICAgICAgICAgICAvLyBpbmRleCBpcyBhIGpRdWVyeSBvYmplY3Qgb3IgRE9NIGVsZW1lbnRcbiAgICAgICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24ocywgaWR4KXtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXhbMF0gPT09IHMubGlua1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpZHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZml4IGluZGV4IGlmIG5lZWRlZFxuICAgICAgICAgICAgaWYgKCBpbmRleCA8IDAgKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLnNpYmxpbmdzLmxlbmd0aCAtIGluZGV4O1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5zaWJsaW5nc1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW0gICA9IHRoaXMuc2libGluZ3NbaW5kZXhdO1xuXG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIFwibGlnaHRib3hcIiA6ICR0aGlzLFxuICAgICAgICAgICAgICAgIFwic291cmNlXCIgICA6IGl0ZW0uc291cmNlLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiICAgICA6IGl0ZW0udHlwZSxcbiAgICAgICAgICAgICAgICBcImluZGV4XCIgICAgOiBpbmRleCxcbiAgICAgICAgICAgICAgICBcInByb21pc2VcIiAgOiBwcm9taXNlLFxuICAgICAgICAgICAgICAgIFwidGl0bGVcIiAgICA6IGl0ZW0udGl0bGUsXG4gICAgICAgICAgICAgICAgXCJpdGVtXCIgICAgIDogaXRlbSxcbiAgICAgICAgICAgICAgICBcIm1ldGFcIiAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29udGVudFwiIDogJycsXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIiAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIiAgOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgICAgICAgICB0aGlzLm1vZGFsLmNvbnRlbnQuZW1wdHkoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vZGFsLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5jb250ZW50LmNzcyh7d2lkdGg6JycsIGhlaWdodDonJ30pLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5tb2RhbC5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubW9kYWwubG9hZGVyLnJlbW92ZUNsYXNzKCd1ay1oaWRkZW4nKTtcblxuICAgICAgICAgICAgcHJvbWlzZS5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICR0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpdFNpemUoZGF0YSk7XG5cbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGRhdGEubWV0YS5jb250ZW50ID0gJzxkaXYgY2xhc3M9XCJ1ay1wb3NpdGlvbi1jb3ZlciB1ay1mbGV4IHVrLWZsZXgtbWlkZGxlIHVrLWZsZXgtY2VudGVyXCI+PHN0cm9uZz5Mb2FkaW5nIHJlc291cmNlIGZhaWxlZCE8L3N0cm9uZz48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGRhdGEubWV0YS53aWR0aCAgID0gNDAwO1xuICAgICAgICAgICAgICAgIGRhdGEubWV0YS5oZWlnaHQgID0gMzAwO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgJHRoaXMuZml0U2l6ZShkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdzaG93aXRlbS51ay5saWdodGJveCcsIFtkYXRhXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZml0U2l6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZGF0YSAgICAgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICAgICAgcGFkICAgICAgPSB0aGlzLm1vZGFsLmRpYWxvZy5vdXRlcldpZHRoKCkgLSB0aGlzLm1vZGFsLmRpYWxvZy53aWR0aCgpLFxuICAgICAgICAgICAgICAgIGRwYWRUb3AgID0gcGFyc2VJbnQodGhpcy5tb2RhbC5kaWFsb2cuY3NzKCdtYXJnaW4tdG9wJyksIDEwKSxcbiAgICAgICAgICAgICAgICBkcGFkQm90ICA9IHBhcnNlSW50KHRoaXMubW9kYWwuZGlhbG9nLmNzcygnbWFyZ2luLWJvdHRvbScpLCAxMCksXG4gICAgICAgICAgICAgICAgZHBhZCAgICAgPSBkcGFkVG9wICsgZHBhZEJvdCxcbiAgICAgICAgICAgICAgICBjb250ZW50ICA9IGRhdGEubWV0YS5jb250ZW50LFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gJHRoaXMub3B0aW9ucy5kdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2libGluZ3MubGVuZ3RoID4gMSkge1xuXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJ1ay1zbGlkZW5hdiB1ay1zbGlkZW5hdi1jb250cmFzdCB1ay1zbGlkZW5hdi1wcmV2aW91cyB1ay1oaWRkZW4tdG91Y2hcIiBkYXRhLWxpZ2h0Ym94LXByZXZpb3VzPjwvYT4nLFxuICAgICAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInVrLXNsaWRlbmF2IHVrLXNsaWRlbmF2LWNvbnRyYXN0IHVrLXNsaWRlbmF2LW5leHQgdWstaGlkZGVuLXRvdWNoXCIgZGF0YS1saWdodGJveC1uZXh0PjwvYT4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHdpZHRoXG4gICAgICAgICAgICB2YXIgdG1wID0gVUkuJCgnPGRpdj4mbmJzcDs8L2Rpdj4nKS5jc3Moe1xuICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgIDogMCxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24nICA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICdsZWZ0JyAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAnd2lkdGgnICAgICA6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnbWF4LXdpZHRoJyA6ICR0aGlzLm1vZGFsLmRpYWxvZy5jc3MoJ21heC13aWR0aCcpLFxuICAgICAgICAgICAgICAgICdwYWRkaW5nJyAgIDogJHRoaXMubW9kYWwuZGlhbG9nLmNzcygncGFkZGluZycpLFxuICAgICAgICAgICAgICAgICdtYXJnaW4nICAgIDogJHRoaXMubW9kYWwuZGlhbG9nLmNzcygnbWFyZ2luJylcbiAgICAgICAgICAgIH0pLCBtYXh3aWR0aCwgbWF4aGVpZ2h0LCB3ID0gZGF0YS5tZXRhLndpZHRoLCBoID0gZGF0YS5tZXRhLmhlaWdodDtcblxuICAgICAgICAgICAgdG1wLmFwcGVuZFRvKCdib2R5Jykud2lkdGgoKTtcblxuICAgICAgICAgICAgbWF4d2lkdGggID0gdG1wLndpZHRoKCk7XG4gICAgICAgICAgICBtYXhoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBkcGFkO1xuXG4gICAgICAgICAgICB0bXAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kYWwuZGlhbG9nLmZpbmQoJy51ay1tb2RhbC1jYXB0aW9uJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5kaWFsb2cuYXBwZW5kKCc8ZGl2IGNsYXNzPVwidWstbW9kYWwtY2FwdGlvblwiPicrZGF0YS50aXRsZSsnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgbWF4aGVpZ2h0IC09IHRoaXMubW9kYWwuZGlhbG9nLmZpbmQoJy51ay1tb2RhbC1jYXB0aW9uJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1heHdpZHRoIDwgZGF0YS5tZXRhLndpZHRoKSB7XG5cbiAgICAgICAgICAgICAgICBoID0gTWF0aC5mbG9vciggaCAqIChtYXh3aWR0aCAvIHcpICk7XG4gICAgICAgICAgICAgICAgdyA9IG1heHdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWF4aGVpZ2h0IDwgaCkge1xuXG4gICAgICAgICAgICAgICAgaCA9IE1hdGguZmxvb3IobWF4aGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB3ID0gTWF0aC5jZWlsKGRhdGEubWV0YS53aWR0aCAqIChtYXhoZWlnaHQvZGF0YS5tZXRhLmhlaWdodCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1vZGFsLmNvbnRlbnQuY3NzKCdvcGFjaXR5JywgMCkud2lkdGgodykuaHRtbChjb250ZW50KTtcblxuICAgICAgICAgICAgaWYgKGRhdGEudHlwZSA9PSAnaWZyYW1lJykge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuY29udGVudC5maW5kKCdpZnJhbWU6Zmlyc3QnKS5oZWlnaHQoaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaCAgID0gaCArIHBhZCxcbiAgICAgICAgICAgICAgICB0ICAgID0gTWF0aC5mbG9vcih3aW5kb3cuaW5uZXJIZWlnaHQvMiAtIGRoLzIpIC0gZHBhZDtcblxuICAgICAgICAgICAgaWYgKHQgPCAwKSB7IHQgPSAwOyB9XG5cbiAgICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2VyLmFkZENsYXNzKCd1ay1oaWRkZW4nKTtcblxuICAgICAgICAgICAgaWYgKCR0aGlzLm1vZGFsLmRhdGEoJ213aWR0aCcpID09IHcgJiYgICR0aGlzLm1vZGFsLmRhdGEoJ21oZWlnaHQnKSA9PSBoKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1vZGFsLmRpYWxvZy5hbmltYXRlKHt3aWR0aDogdyArIHBhZCwgaGVpZ2h0OiBoICsgcGFkLCB0b3A6IHQgfSwgZHVyYXRpb24sICdzd2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsLmxvYWRlci5hZGRDbGFzcygndWstaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMubW9kYWwuY29udGVudC5jc3Moe3dpZHRoOicnfSkuYW5pbWF0ZSh7J29wYWNpdHknOiAxfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsLmNsb3Nlci5yZW1vdmVDbGFzcygndWstaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5tb2RhbC5kYXRhKHsnbXdpZHRoJzogdywgJ21oZWlnaHQnOiBofSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLnNpYmxpbmdzWyh0aGlzLmluZGV4KzEpXSA/ICh0aGlzLmluZGV4KzEpIDogMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJldmlvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuc2libGluZ3NbKHRoaXMuaW5kZXgtMSldID8gKHRoaXMuaW5kZXgtMSkgOiB0aGlzLnNpYmxpbmdzLmxlbmd0aC0xKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLyBQbHVnaW5zXG5cbiAgICBVSS5wbHVnaW4oJ2xpZ2h0Ym94JywgJ2ltYWdlJywge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGxpZ2h0Ym94KSB7XG5cbiAgICAgICAgICAgIGxpZ2h0Ym94Lm9uKFwic2hvd2l0ZW0udWsubGlnaHRib3hcIiwgZnVuY3Rpb24oZSwgZGF0YSl7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS50eXBlID09ICdpbWFnZScgfHwgZGF0YS5zb3VyY2UgJiYgZGF0YS5zb3VyY2UubWF0Y2goL1xcLihqcGd8anBlZ3xwbmd8Z2lmfHN2ZykkL2kpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbihzb3VyY2UsIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tZXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGVudFwiIDogJzxpbWcgY2xhc3M9XCJ1ay1yZXNwb25zaXZlLXdpZHRoXCIgd2lkdGg9XCInK3dpZHRoKydcIiBoZWlnaHQ9XCInK2hlaWdodCsnXCIgc3JjID1cIicrc291cmNlKydcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIiAgIDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIiAgOiBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudHlwZSA9ICdpbWFnZSc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtkYXRhLnNvdXJjZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wcm9taXNlLnJlamVjdCgnTG9hZGluZyBpbWFnZSBmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlW2RhdGEuc291cmNlXSA9IHt3aWR0aDogaW1nLndpZHRoLCBoZWlnaHQ6IGltZy5oZWlnaHR9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5zb3VyY2UsIGNhY2hlW2RhdGEuc291cmNlXS53aWR0aCwgY2FjaGVbZGF0YS5zb3VyY2VdLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcuc3JjID0gZGF0YS5zb3VyY2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5zb3VyY2UsIGNhY2hlW2RhdGEuc291cmNlXS53aWR0aCwgY2FjaGVbZGF0YS5zb3VyY2VdLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgVUkucGx1Z2luKFwibGlnaHRib3hcIiwgXCJ5b3V0dWJlXCIsIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbihsaWdodGJveCkge1xuXG4gICAgICAgICAgICB2YXIgeW91dHViZVJlZ0V4cCA9IC8oXFwvXFwvLio/eW91dHViZVxcLlthLXpdKylcXC93YXRjaFxcP3Y9KFteJl0rKSY/KC4qKS8sXG4gICAgICAgICAgICAgICAgeW91dHViZVJlZ0V4cFNob3J0ID0gL3lvdXR1XFwuYmVcXC8oLiopLztcblxuXG4gICAgICAgICAgICBsaWdodGJveC5vbihcInNob3dpdGVtLnVrLmxpZ2h0Ym94XCIsIGZ1bmN0aW9uKGUsIGRhdGEpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGlkLCBtYXRjaGVzLCByZXNvbHZlID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgICAgICAgICAgICAgICAgICBkYXRhLm1ldGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6ICc8aWZyYW1lIHNyYz1cIi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycraWQrJ1wiIHdpZHRoPVwiJyt3aWR0aCsnXCIgaGVpZ2h0PVwiJytoZWlnaHQrJ1wiIHN0eWxlPVwibWF4LXdpZHRoOjEwMCU7XCI+PC9pZnJhbWU+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudHlwZSA9ICdpZnJhbWUnO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID0gZGF0YS5zb3VyY2UubWF0Y2goeW91dHViZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID0gZGF0YS5zb3VyY2UubWF0Y2goeW91dHViZVJlZ0V4cFNob3J0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZCA9IG1hdGNoZXNbMV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWNhY2hlW2lkXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCksIGxvd3JlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVbaWRdID0ge3dpZHRoOjY0MCwgaGVpZ2h0OjMyMH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpZCwgY2FjaGVbaWRdLndpZHRoLCBjYWNoZVtpZF0uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8veW91dHViZSBkZWZhdWx0IDQwNCB0aHVtYiwgZmFsbCBiYWNrIHRvIGxvd3Jlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWcud2lkdGggPT0gMTIwICYmIGltZy5oZWlnaHQgPT0gOTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb3dyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd3JlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcuc3JjID0gJy8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyBpZCArICcvMC5qcGcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVbaWRdID0ge3dpZHRoOiA2NDAsIGhlaWdodDogMzIwfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaWQsIGNhY2hlW2lkXS53aWR0aCwgY2FjaGVbaWRdLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVtpZF0gPSB7d2lkdGg6IGltZy53aWR0aCwgaGVpZ2h0OiBpbWcuaGVpZ2h0fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpZCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcuc3JjID0gJy8vaW1nLnlvdXR1YmUuY29tL3ZpLycraWQrJy9tYXhyZXNkZWZhdWx0LmpwZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaWQsIGNhY2hlW2lkXS53aWR0aCwgY2FjaGVbaWRdLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIFVJLnBsdWdpbihcImxpZ2h0Ym94XCIsIFwidmltZW9cIiwge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGxpZ2h0Ym94KSB7XG5cbiAgICAgICAgICAgIHZhciByZWdleCA9IC8oXFwvXFwvLio/KXZpbWVvXFwuW2Etel0rXFwvKFswLTldKykuKj8vLCBtYXRjaGVzO1xuXG5cbiAgICAgICAgICAgIGxpZ2h0Ym94Lm9uKFwic2hvd2l0ZW0udWsubGlnaHRib3hcIiwgZnVuY3Rpb24oZSwgZGF0YSl7XG5cbiAgICAgICAgICAgICAgICB2YXIgaWQsIHJlc29sdmUgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEubWV0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogJzxpZnJhbWUgc3JjPVwiLy9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLycraWQrJ1wiIHdpZHRoPVwiJyt3aWR0aCsnXCIgaGVpZ2h0PVwiJytoZWlnaHQrJ1wiIHN0eWxlPVwid2lkdGg6MTAwJTtib3gtc2l6aW5nOmJvcmRlci1ib3g7XCI+PC9pZnJhbWU+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudHlwZSA9ICdpZnJhbWUnO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID0gZGF0YS5zb3VyY2UubWF0Y2gocmVnZXgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWQgPSBtYXRjaGVzWzJdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjYWNoZVtpZF0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgVUkuJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlICAgICA6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybCAgICAgIDogJ2h0dHA6Ly92aW1lby5jb20vYXBpL29lbWJlZC5qc29uP3VybD0nICsgZW5jb2RlVVJJKGRhdGEuc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29ucCAgICA6ICdjYWxsYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGUgOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgIDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVtpZF0gPSB7d2lkdGg6ZGF0YS53aWR0aCwgaGVpZ2h0OmRhdGEuaGVpZ2h0fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpZCwgY2FjaGVbaWRdLndpZHRoLCBjYWNoZVtpZF0uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpZCwgY2FjaGVbaWRdLndpZHRoLCBjYWNoZVtpZF0uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFVJLnBsdWdpbihcImxpZ2h0Ym94XCIsIFwidmlkZW9cIiwge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGxpZ2h0Ym94KSB7XG5cbiAgICAgICAgICAgIGxpZ2h0Ym94Lm9uKFwic2hvd2l0ZW0udWsubGlnaHRib3hcIiwgZnVuY3Rpb24oZSwgZGF0YSl7XG5cblxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24oc291cmNlLCB3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5tZXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiAnPHZpZGVvIGNsYXNzPVwidWstcmVzcG9uc2l2ZS13aWR0aFwiIHNyYz1cIicrc291cmNlKydcIiB3aWR0aD1cIicrd2lkdGgrJ1wiIGhlaWdodD1cIicraGVpZ2h0KydcIiBjb250cm9scz48L3ZpZGVvPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBkYXRhLnR5cGUgPSAndmlkZW8nO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT0gJ3ZpZGVvJyB8fCBkYXRhLnNvdXJjZS5tYXRjaCgvXFwuKG1wNHx3ZWJtfG9ndikkL2kpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZVtkYXRhLnNvdXJjZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZCA9IFVJLiQoJzx2aWRlbyBzdHlsZT1cInBvc2l0aW9uOmZpeGVkO3Zpc2liaWxpdHk6aGlkZGVuO3RvcDotMTAwMDBweDtcIj48L3ZpZGVvPicpLmF0dHIoJ3NyYycsIGRhdGEuc291cmNlKS5hcHBlbmRUbygnYm9keScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWRsZSA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZpZFswXS52aWRlb1dpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaWRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlW2RhdGEuc291cmNlXSA9IHt3aWR0aDogdmlkWzBdLnZpZGVvV2lkdGgsIGhlaWdodDogdmlkWzBdLnZpZGVvSGVpZ2h0fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLnNvdXJjZSwgY2FjaGVbZGF0YS5zb3VyY2VdLndpZHRoLCBjYWNoZVtkYXRhLnNvdXJjZV0uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlkLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjApO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEuc291cmNlLCBjYWNoZVtkYXRhLnNvdXJjZV0ud2lkdGgsIGNhY2hlW2RhdGEuc291cmNlXS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgVUlraXQucGx1Z2luKFwibGlnaHRib3hcIiwgXCJpZnJhbWVcIiwge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChsaWdodGJveCkge1xuXG4gICAgICAgICAgICBsaWdodGJveC5vbihcInNob3dpdGVtLnVrLmxpZ2h0Ym94XCIsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHdpZHRoLCBoZWlnaHQpIHtcblxuICAgICAgICAgICAgICAgICAgICBkYXRhLm1ldGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6ICc8aWZyYW1lIGNsYXNzPVwidWstcmVzcG9uc2l2ZS13aWR0aFwiIHNyYz1cIicgKyBzb3VyY2UgKyAnXCIgd2lkdGg9XCInICsgd2lkdGggKyAnXCIgaGVpZ2h0PVwiJyArIGhlaWdodCArICdcIj48L2lmcmFtZT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS50eXBlID0gJ2lmcmFtZSc7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gJ2lmcmFtZScgfHwgZGF0YS5zb3VyY2UubWF0Y2goL1xcLihodG1sfHBocCkkLykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLnNvdXJjZSwgKGxpZ2h0Ym94Lm9wdGlvbnMud2lkdGggfHwgODAwKSwgKGxpZ2h0Ym94Lm9wdGlvbnMuaGVpZ2h0IHx8IDYwMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGdldE1vZGFsKGxpZ2h0Ym94KSB7XG5cbiAgICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgICAgICBtb2RhbC5saWdodGJveCA9IGxpZ2h0Ym94O1xuICAgICAgICAgICAgcmV0dXJuIG1vZGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5pdCBsaWdodGJveCBjb250YWluZXJcbiAgICAgICAgbW9kYWwgPSBVSS4kKFtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstbW9kYWxcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstbW9kYWwtZGlhbG9nIHVrLW1vZGFsLWRpYWxvZy1saWdodGJveCB1ay1zbGlkZW5hdi1wb3NpdGlvblwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tcmlnaHQ6YXV0bzt3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7dG9wOicrTWF0aC5hYnMod2luZG93LmlubmVySGVpZ2h0LzIgLSAyMDApKydweDtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInVrLW1vZGFsLWNsb3NlIHVrLWNsb3NlIHVrLWNsb3NlLWFsdFwiPjwvYT4nLFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLWxpZ2h0Ym94LWNvbnRlbnRcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLW1vZGFsLXNwaW5uZXIgdWstaGlkZGVuXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIF0uam9pbignJykpLmFwcGVuZFRvKCdib2R5Jyk7XG5cbiAgICAgICAgbW9kYWwuZGlhbG9nICA9IG1vZGFsLmZpbmQoJy51ay1tb2RhbC1kaWFsb2c6Zmlyc3QnKTtcbiAgICAgICAgbW9kYWwuY29udGVudCA9IG1vZGFsLmZpbmQoJy51ay1saWdodGJveC1jb250ZW50OmZpcnN0Jyk7XG4gICAgICAgIG1vZGFsLmxvYWRlciAgPSBtb2RhbC5maW5kKCcudWstbW9kYWwtc3Bpbm5lcjpmaXJzdCcpO1xuICAgICAgICBtb2RhbC5jbG9zZXIgID0gbW9kYWwuZmluZCgnLnVrLWNsb3NlLnVrLWNsb3NlLWFsdCcpO1xuICAgICAgICBtb2RhbC5tb2RhbCAgID0gVUkubW9kYWwobW9kYWwsIHttb2RhbDpmYWxzZX0pO1xuXG4gICAgICAgIC8vIG5leHQgLyBwcmV2aW91c1xuICAgICAgICBtb2RhbC5vbihcInN3aXBlUmlnaHQgc3dpcGVMZWZ0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIG1vZGFsLmxpZ2h0Ym94W2UudHlwZT09J3N3aXBlTGVmdCcgPyAnbmV4dCc6J3ByZXZpb3VzJ10oKTtcbiAgICAgICAgfSkub24oXCJjbGlja1wiLCBcIltkYXRhLWxpZ2h0Ym94LXByZXZpb3VzXSwgW2RhdGEtbGlnaHRib3gtbmV4dF1cIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBtb2RhbC5saWdodGJveFtVSS4kKHRoaXMpLmlzKCdbZGF0YS1saWdodGJveC1uZXh0XScpID8gJ25leHQnOidwcmV2aW91cyddKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRlc3Ryb3kgY29udGVudCBvbiBtb2RhbCBoaWRlXG4gICAgICAgIG1vZGFsLm9uKFwiaGlkZS51ay5tb2RhbFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBtb2RhbC5jb250ZW50Lmh0bWwoJycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmVzaXplQ2FjaGUgPSB7dzogd2luZG93LmlubmVyV2lkdGgsIGg6d2luZG93LmlubmVySGVpZ2h0fTtcblxuICAgICAgICBVSS4kd2luLm9uKCdsb2FkIHJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICBpZiAocmVzaXplQ2FjaGUudyAhPT0gd2luZG93LmlubmVyV2lkdGggJiYgbW9kYWwuaXMoJzp2aXNpYmxlJykgJiYgIVVJLlV0aWxzLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwubGlnaHRib3guZml0U2l6ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNpemVDYWNoZSA9IHt3OiB3aW5kb3cuaW5uZXJXaWR0aCwgaDp3aW5kb3cuaW5uZXJIZWlnaHR9O1xuXG4gICAgICAgIH0sIDEwMCkpO1xuXG4gICAgICAgIG1vZGFsLmxpZ2h0Ym94ID0gbGlnaHRib3g7XG5cbiAgICAgICAgcmV0dXJuIG1vZGFsO1xuICAgIH1cblxuICAgIFVJLmxpZ2h0Ym94LmNyZWF0ZSA9IGZ1bmN0aW9uKGl0ZW1zLCBvcHRpb25zKSB7XG5cbiAgICAgICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuXG4gICAgICAgIHZhciBncm91cCA9IFtdLCBvO1xuXG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXG4gICAgICAgICAgICBncm91cC5wdXNoKFVJLiQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICAnc291cmNlJyA6ICcnLFxuICAgICAgICAgICAgICAgICd0aXRsZScgIDogJycsXG4gICAgICAgICAgICAgICAgJ3R5cGUnICAgOiAnYXV0bycsXG4gICAgICAgICAgICAgICAgJ2xpbmsnICAgOiBmYWxzZVxuICAgICAgICAgICAgfSwgKHR5cGVvZihpdGVtKSA9PSAnc3RyaW5nJyA/IHsnc291cmNlJzogaXRlbX0gOiBpdGVtKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBvID0gVUkubGlnaHRib3goVUkuJC5leHRlbmQoe30sIG9wdGlvbnMsIHsnZ3JvdXAnOmdyb3VwfSkpO1xuXG4gICAgICAgIHJldHVybiBvO1xuICAgIH07XG5cbiAgICByZXR1cm4gVUkubGlnaHRib3g7XG59KTtcbiJdfQ==