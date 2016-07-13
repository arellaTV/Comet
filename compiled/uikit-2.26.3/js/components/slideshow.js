"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideshow", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var Animations,
        playerId = 0;

    UI.component('slideshow', {

        defaults: {
            animation: "fade",
            duration: 500,
            height: "auto",
            start: 0,
            autoplay: false,
            autoplayInterval: 7000,
            videoautoplay: true,
            videomute: true,
            slices: 15,
            pauseOnHover: true,
            kenburns: false,
            kenburnsanimations: ['uk-animation-middle-left', 'uk-animation-top-right', 'uk-animation-bottom-left', 'uk-animation-top-center', '', // middle-center
            'uk-animation-bottom-right']
        },

        current: false,
        interval: null,
        hovering: false,

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$('[data-uk-slideshow]', context).each(function () {

                    var slideshow = UI.$(this);

                    if (!slideshow.data("slideshow")) {
                        UI.slideshow(slideshow, UI.Utils.options(slideshow.attr("data-uk-slideshow")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this,
                canvas,
                kbanimduration;

            this.container = this.element.hasClass('uk-slideshow') ? this.element : UI.$(this.find('.uk-slideshow'));
            this.slides = this.container.children();
            this.slidesCount = this.slides.length;
            this.current = this.options.start;
            this.animating = false;
            this.triggers = this.find('[data-uk-slideshow-item]');
            this.fixFullscreen = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && this.container.hasClass('uk-slideshow-fullscreen'); // viewport unit fix for height:100vh - should be fixed in iOS 8

            if (this.options.kenburns) {

                kbanimduration = this.options.kenburns === true ? '15s' : this.options.kenburns;

                if (!String(kbanimduration).match(/(ms|s)$/)) {
                    kbanimduration += 'ms';
                }

                if (typeof this.options.kenburnsanimations == 'string') {
                    this.options.kenburnsanimations = this.options.kenburnsanimations.split(',');
                }
            }

            this.slides.each(function (index) {

                var slide = UI.$(this),
                    media = slide.children('img,video,iframe').eq(0);

                slide.data('media', media);
                slide.data('sizer', media);

                if (media.length) {

                    var placeholder;

                    switch (media[0].nodeName) {
                        case 'IMG':

                            var cover = UI.$('<div class="uk-cover-background uk-position-cover"></div>').css({ 'background-image': 'url(' + media.attr('src') + ')' });

                            if (media.attr('width') && media.attr('height')) {
                                placeholder = UI.$('<canvas></canvas>').attr({ width: media.attr('width'), height: media.attr('height') });
                                media.replaceWith(placeholder);
                                media = placeholder;
                                placeholder = undefined;
                            }

                            media.css({ width: '100%', height: 'auto', opacity: 0 });
                            slide.prepend(cover).data('cover', cover);
                            break;

                        case 'IFRAME':

                            var src = media[0].src,
                                iframeId = 'sw-' + ++playerId;

                            media.attr('src', '').on('load', function () {

                                if (index !== $this.current || index == $this.current && !$this.options.videoautoplay) {
                                    $this.pausemedia(media);
                                }

                                if ($this.options.videomute) {

                                    $this.mutemedia(media);

                                    var inv = setInterval(function (ic) {
                                        return function () {
                                            $this.mutemedia(media);
                                            if (++ic >= 4) clearInterval(inv);
                                        };
                                    }(0), 250);
                                }
                            }).data('slideshow', $this) // add self-reference for the vimeo-ready listener
                            .attr('data-player-id', iframeId) // add frameId for the vimeo-ready listener
                            .attr('src', [src, src.indexOf('?') > -1 ? '&' : '?', 'enablejsapi=1&api=1&player_id=' + iframeId].join('')).addClass('uk-position-absolute');

                            // disable pointer events
                            if (!UI.support.touch) media.css('pointer-events', 'none');

                            placeholder = true;

                            if (UI.cover) {
                                UI.cover(media);
                                media.attr('data-uk-cover', '{}');
                            }

                            break;

                        case 'VIDEO':
                            media.addClass('uk-cover-object uk-position-absolute');
                            placeholder = true;

                            if ($this.options.videomute) $this.mutemedia(media);
                    }

                    if (placeholder) {

                        canvas = UI.$('<canvas></canvas>').attr({ 'width': media[0].width, 'height': media[0].height });
                        var img = UI.$('<img style="width:100%;height:auto;">').attr('src', canvas[0].toDataURL());

                        slide.prepend(img);
                        slide.data('sizer', img);
                    }
                } else {
                    slide.data('sizer', slide);
                }

                if ($this.hasKenBurns(slide)) {

                    slide.data('cover').css({
                        '-webkit-animation-duration': kbanimduration,
                        'animation-duration': kbanimduration
                    });
                }
            });

            this.on("click.uk.slideshow", '[data-uk-slideshow-item]', function (e) {

                e.preventDefault();

                var slide = UI.$(this).attr('data-uk-slideshow-item');

                if ($this.current == slide) return;

                switch (slide) {
                    case 'next':
                    case 'previous':
                        $this[slide == 'next' ? 'next' : 'previous']();
                        break;
                    default:
                        $this.show(parseInt(slide, 10));
                }

                $this.stop();
            });

            // Set start slide
            this.slides.attr('aria-hidden', 'true').eq(this.current).addClass('uk-active').attr('aria-hidden', 'false');
            this.triggers.filter('[data-uk-slideshow-item="' + this.current + '"]').addClass('uk-active');

            UI.$win.on("resize load", UI.Utils.debounce(function () {
                $this.resize();

                if ($this.fixFullscreen) {
                    $this.container.css('height', window.innerHeight);
                    $this.slides.css('height', window.innerHeight);
                }
            }, 100));

            // chrome image load fix
            setTimeout(function () {
                $this.resize();
            }, 80);

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }

            if (this.options.videoautoplay && this.slides.eq(this.current).data('media')) {
                this.playmedia(this.slides.eq(this.current).data('media'));
            }

            if (this.options.kenburns) {
                this.applyKenBurns(this.slides.eq(this.current));
            }

            this.container.on({
                mouseenter: function mouseenter() {
                    if ($this.options.pauseOnHover) $this.hovering = true;
                },
                mouseleave: function mouseleave() {
                    $this.hovering = false;
                }
            });

            this.on('swipeRight swipeLeft', function (e) {
                $this[e.type == 'swipeLeft' ? 'next' : 'previous']();
            });

            this.on('display.uk.check', function () {
                if ($this.element.is(":visible")) {

                    $this.resize();

                    if ($this.fixFullscreen) {
                        $this.container.css('height', window.innerHeight);
                        $this.slides.css('height', window.innerHeight);
                    }
                }
            });
        },

        resize: function resize() {

            if (this.container.hasClass('uk-slideshow-fullscreen')) return;

            var height = this.options.height;

            if (this.options.height === 'auto') {

                height = 0;

                this.slides.css('height', '').each(function () {
                    height = Math.max(height, UI.$(this).height());
                });
            }

            this.container.css('height', height);
            this.slides.css('height', height);
        },

        show: function show(index, direction) {

            if (this.animating || this.current == index) return;

            this.animating = true;

            var $this = this,
                current = this.slides.eq(this.current),
                next = this.slides.eq(index),
                dir = direction ? direction : this.current < index ? 1 : -1,
                currentmedia = current.data('media'),
                animation = Animations[this.options.animation] ? this.options.animation : 'fade',
                nextmedia = next.data('media'),
                finalize = function finalize() {

                if (!$this.animating) return;

                if (currentmedia && currentmedia.is('video,iframe')) {
                    $this.pausemedia(currentmedia);
                }

                if (nextmedia && nextmedia.is('video,iframe')) {
                    $this.playmedia(nextmedia);
                }

                next.addClass("uk-active").attr('aria-hidden', 'false');
                current.removeClass("uk-active").attr('aria-hidden', 'true');

                $this.animating = false;
                $this.current = index;

                UI.Utils.checkDisplay(next, '[class*="uk-animation-"]:not(.uk-cover-background.uk-position-cover)');

                $this.trigger('show.uk.slideshow', [next, current, $this]);
            };

            $this.applyKenBurns(next);

            // animation fallback
            if (!UI.support.animation) {
                animation = 'none';
            }

            current = UI.$(current);
            next = UI.$(next);

            $this.trigger('beforeshow.uk.slideshow', [next, current, $this]);

            Animations[animation].apply(this, [current, next, dir]).then(finalize);

            $this.triggers.removeClass('uk-active');
            $this.triggers.filter('[data-uk-slideshow-item="' + index + '"]').addClass('uk-active');
        },

        applyKenBurns: function applyKenBurns(slide) {

            if (!this.hasKenBurns(slide)) {
                return;
            }

            var animations = this.options.kenburnsanimations,
                index = this.kbindex || 0;

            slide.data('cover').attr('class', 'uk-cover-background uk-position-cover').width();
            slide.data('cover').addClass(['uk-animation-scale', 'uk-animation-reverse', animations[index].trim()].join(' '));

            this.kbindex = animations[index + 1] ? index + 1 : 0;
        },

        hasKenBurns: function hasKenBurns(slide) {
            return this.options.kenburns && slide.data('cover');
        },

        next: function next() {
            this.show(this.slides[this.current + 1] ? this.current + 1 : 0, 1);
        },

        previous: function previous() {
            this.show(this.slides[this.current - 1] ? this.current - 1 : this.slides.length - 1, -1);
        },

        start: function start() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function () {
                if (!$this.hovering) $this.next();
            }, this.options.autoplayInterval);
        },

        stop: function stop() {
            if (this.interval) clearInterval(this.interval);
        },

        playmedia: function playmedia(media) {

            if (!(media && media[0])) return;

            switch (media[0].nodeName) {
                case 'VIDEO':

                    if (!this.options.videomute) {
                        media[0].muted = false;
                    }

                    media[0].play();
                    break;
                case 'IFRAME':

                    if (!this.options.videomute) {
                        media[0].contentWindow.postMessage('{ "event": "command", "func": "unmute", "method":"setVolume", "value":1}', '*');
                    }

                    media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
                    break;
            }
        },

        pausemedia: function pausemedia(media) {

            switch (media[0].nodeName) {
                case 'VIDEO':
                    media[0].pause();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
                    break;
            }
        },

        mutemedia: function mutemedia(media) {

            switch (media[0].nodeName) {
                case 'VIDEO':
                    media[0].muted = true;
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                    break;
            }
        }
    });

    Animations = {

        'none': function none() {

            var d = UI.$.Deferred();
            d.resolve();
            return d.promise();
        },

        'scroll': function scroll(current, next, dir) {

            var d = UI.$.Deferred();

            current.css('animation-duration', this.options.duration + 'ms');
            next.css('animation-duration', this.options.duration + 'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function () {

                current.removeClass(dir == -1 ? 'uk-slideshow-scroll-backward-out' : 'uk-slideshow-scroll-forward-out');
                next.css('opacity', '').removeClass(dir == -1 ? 'uk-slideshow-scroll-backward-in' : 'uk-slideshow-scroll-forward-in');
                d.resolve();
            }.bind(this));

            current.addClass(dir == -1 ? 'uk-slideshow-scroll-backward-out' : 'uk-slideshow-scroll-forward-out');
            next.addClass(dir == -1 ? 'uk-slideshow-scroll-backward-in' : 'uk-slideshow-scroll-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'swipe': function swipe(current, next, dir) {

            var d = UI.$.Deferred();

            current.css('animation-duration', this.options.duration + 'ms');
            next.css('animation-duration', this.options.duration + 'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function () {

                current.removeClass(dir === -1 ? 'uk-slideshow-swipe-backward-out' : 'uk-slideshow-swipe-forward-out');
                next.css('opacity', '').removeClass(dir === -1 ? 'uk-slideshow-swipe-backward-in' : 'uk-slideshow-swipe-forward-in');
                d.resolve();
            }.bind(this));

            current.addClass(dir == -1 ? 'uk-slideshow-swipe-backward-out' : 'uk-slideshow-swipe-forward-out');
            next.addClass(dir == -1 ? 'uk-slideshow-swipe-backward-in' : 'uk-slideshow-swipe-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'scale': function scale(current, next, dir) {

            var d = UI.$.Deferred();

            current.css('animation-duration', this.options.duration + 'ms');
            next.css('animation-duration', this.options.duration + 'ms');

            next.css('opacity', 1);

            current.one(UI.support.animation.end, function () {

                current.removeClass('uk-slideshow-scale-out');
                next.css('opacity', '');
                d.resolve();
            }.bind(this));

            current.addClass('uk-slideshow-scale-out');
            current.width(); // force redraw

            return d.promise();
        },

        'fade': function fade(current, next, dir) {

            var d = UI.$.Deferred();

            current.css('animation-duration', this.options.duration + 'ms');
            next.css('animation-duration', this.options.duration + 'ms');

            next.css('opacity', 1);

            // for plain text content slides - looks smoother
            if (!(next.data('cover') || next.data('placeholder'))) {

                next.css('opacity', 1).one(UI.support.animation.end, function () {
                    next.removeClass('uk-slideshow-fade-in');
                }).addClass('uk-slideshow-fade-in');
            }

            current.one(UI.support.animation.end, function () {

                current.removeClass('uk-slideshow-fade-out');
                next.css('opacity', '');
                d.resolve();
            }.bind(this));

            current.addClass('uk-slideshow-fade-out');
            current.width(); // force redraw

            return d.promise();
        }
    };

    UI.slideshow.animations = Animations;

    // Listen for messages from the vimeo player
    window.addEventListener('message', function onMessageReceived(e) {

        var data = e.data,
            iframe;

        if (typeof data == 'string') {

            try {
                data = JSON.parse(data);
            } catch (err) {
                data = {};
            }
        }

        if (e.origin && e.origin.indexOf('vimeo') > -1 && data.event == 'ready' && data.player_id) {
            iframe = UI.$('[data-player-id="' + data.player_id + '"]');

            if (iframe.length) {
                iframe.data('slideshow').mutemedia(iframe);
            }
        }
    }, false);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NsaWRlc2hvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxpQkFBUCxFQUEwQixDQUFDLE9BQUQsQ0FBMUIsRUFBcUMsWUFBVztBQUM1QyxtQkFBTyxhQUFhLE1BQU0sS0FBTixDQUFwQjtBQUNILFNBRkQ7QUFHSDtBQUVKLENBZEQsRUFjRyxVQUFTLEVBQVQsRUFBYTs7QUFFWjs7QUFFQSxRQUFJLFVBQUo7QUFBQSxRQUFnQixXQUFXLENBQTNCOztBQUVBLE9BQUcsU0FBSCxDQUFhLFdBQWIsRUFBMEI7O0FBRXRCLGtCQUFVO0FBQ04sdUJBQXFCLE1BRGY7QUFFTixzQkFBcUIsR0FGZjtBQUdOLG9CQUFxQixNQUhmO0FBSU4sbUJBQXFCLENBSmY7QUFLTixzQkFBcUIsS0FMZjtBQU1OLDhCQUFxQixJQU5mO0FBT04sMkJBQXFCLElBUGY7QUFRTix1QkFBcUIsSUFSZjtBQVNOLG9CQUFxQixFQVRmO0FBVU4sMEJBQXFCLElBVmY7QUFXTixzQkFBcUIsS0FYZjtBQVlOLGdDQUFxQixDQUNqQiwwQkFEaUIsRUFFakIsd0JBRmlCLEVBR2pCLDBCQUhpQixFQUlqQix5QkFKaUIsRUFLakIsRUFMaUIsRTtBQU1qQix1Q0FOaUI7QUFaZixTQUZZOztBQXdCdEIsaUJBQVcsS0F4Qlc7QUF5QnRCLGtCQUFXLElBekJXO0FBMEJ0QixrQkFBVyxLQTFCVzs7QUE0QnRCLGNBQU0sZ0JBQVc7OztBQUdiLGVBQUcsS0FBSCxDQUFTLFVBQVMsT0FBVCxFQUFrQjs7QUFFdkIsbUJBQUcsQ0FBSCxD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LEVBQW1DLFNBQVMsaUJBQVQsQ0FBMkIsQ0FBM0IsRUFBOEI7O0FBRTdELFlBQUksT0FBTyxFQUFFLElBQWI7QUFBQSxZQUFtQixNQUFuQjs7QUFFQSxZQUFJLE9BQU8sSUFBUCxJQUFnQixRQUFwQixFQUE4Qjs7QUFFMUIsZ0JBQUk7QUFDQSx1QkFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQVA7QUFDSCxhQUZELENBRUUsT0FBTSxHQUFOLEVBQVc7QUFDVCx1QkFBTyxFQUFQO0FBQ0g7QUFDSjs7QUFFRCxZQUFJLEVBQUUsTUFBRixJQUFZLEVBQUUsTUFBRixDQUFTLE9BQVQsQ0FBaUIsT0FBakIsSUFBNEIsQ0FBQyxDQUF6QyxJQUE4QyxLQUFLLEtBQUwsSUFBYyxPQUE1RCxJQUF1RSxLQUFLLFNBQWhGLEVBQTJGO0FBQ3ZGLHFCQUFTLEdBQUcsQ0FBSCxDQUFLLHNCQUFxQixLQUFLLFNBQTFCLEdBQW9DLElBQXpDLENBQVQ7O0FBRUEsZ0JBQUksT0FBTyxNQUFYLEVBQW1CO0FBQ2YsdUJBQU8sSUFBUCxDQUFZLFdBQVosRUFBeUIsU0FBekIsQ0FBbUMsTUFBbkM7QUFDSDtBQUNKO0FBQ0osS0FwQkQsRUFvQkcsS0FwQkg7QUFzQkgsQ0FoakJEIiwiZmlsZSI6InNsaWRlc2hvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBVSWtpdCAyLjI2LjMgfCBodHRwOi8vd3d3LmdldHVpa2l0LmNvbSB8IChjKSAyMDE0IFlPT3RoZW1lIHwgTUlUIExpY2Vuc2UgKi9cbihmdW5jdGlvbihhZGRvbikge1xuXG4gICAgdmFyIGNvbXBvbmVudDtcblxuICAgIGlmICh3aW5kb3cuVUlraXQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gYWRkb24oVUlraXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInVpa2l0LXNsaWRlc2hvd1wiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQW5pbWF0aW9ucywgcGxheWVySWQgPSAwO1xuXG4gICAgVUkuY29tcG9uZW50KCdzbGlkZXNob3cnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbiAgICAgICAgICA6IFwiZmFkZVwiLFxuICAgICAgICAgICAgZHVyYXRpb24gICAgICAgICAgIDogNTAwLFxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgICAgICAgIDogXCJhdXRvXCIsXG4gICAgICAgICAgICBzdGFydCAgICAgICAgICAgICAgOiAwLFxuICAgICAgICAgICAgYXV0b3BsYXkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBhdXRvcGxheUludGVydmFsICAgOiA3MDAwLFxuICAgICAgICAgICAgdmlkZW9hdXRvcGxheSAgICAgIDogdHJ1ZSxcbiAgICAgICAgICAgIHZpZGVvbXV0ZSAgICAgICAgICA6IHRydWUsXG4gICAgICAgICAgICBzbGljZXMgICAgICAgICAgICAgOiAxNSxcbiAgICAgICAgICAgIHBhdXNlT25Ib3ZlciAgICAgICA6IHRydWUsXG4gICAgICAgICAgICBrZW5idXJucyAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIGtlbmJ1cm5zYW5pbWF0aW9ucyA6IFtcbiAgICAgICAgICAgICAgICAndWstYW5pbWF0aW9uLW1pZGRsZS1sZWZ0JyxcbiAgICAgICAgICAgICAgICAndWstYW5pbWF0aW9uLXRvcC1yaWdodCcsXG4gICAgICAgICAgICAgICAgJ3VrLWFuaW1hdGlvbi1ib3R0b20tbGVmdCcsXG4gICAgICAgICAgICAgICAgJ3VrLWFuaW1hdGlvbi10b3AtY2VudGVyJyxcbiAgICAgICAgICAgICAgICAnJywgLy8gbWlkZGxlLWNlbnRlclxuICAgICAgICAgICAgICAgICd1ay1hbmltYXRpb24tYm90dG9tLXJpZ2h0J1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuXG4gICAgICAgIGN1cnJlbnQgIDogZmFsc2UsXG4gICAgICAgIGludGVydmFsIDogbnVsbCxcbiAgICAgICAgaG92ZXJpbmcgOiBmYWxzZSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKCdbZGF0YS11ay1zbGlkZXNob3ddJywgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGVzaG93ID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlc2hvdy5kYXRhKFwic2xpZGVzaG93XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5zbGlkZXNob3coc2xpZGVzaG93LCBVSS5VdGlscy5vcHRpb25zKHNsaWRlc2hvdy5hdHRyKFwiZGF0YS11ay1zbGlkZXNob3dcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIGNhbnZhcywga2JhbmltZHVyYXRpb247XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyICAgICA9IHRoaXMuZWxlbWVudC5oYXNDbGFzcygndWstc2xpZGVzaG93JykgPyB0aGlzLmVsZW1lbnQgOiBVSS4kKHRoaXMuZmluZCgnLnVrLXNsaWRlc2hvdycpKTtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzICAgICAgICA9IHRoaXMuY29udGFpbmVyLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlc0NvdW50ICAgPSB0aGlzLnNsaWRlcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgICAgICAgPSB0aGlzLm9wdGlvbnMuc3RhcnQ7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyAgICAgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcnMgICAgICA9IHRoaXMuZmluZCgnW2RhdGEtdWstc2xpZGVzaG93LWl0ZW1dJyk7XG4gICAgICAgICAgICB0aGlzLmZpeEZ1bGxzY3JlZW4gPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBhZHxpUGhvbmV8aVBvZCkvZykgJiYgdGhpcy5jb250YWluZXIuaGFzQ2xhc3MoJ3VrLXNsaWRlc2hvdy1mdWxsc2NyZWVuJyk7IC8vIHZpZXdwb3J0IHVuaXQgZml4IGZvciBoZWlnaHQ6MTAwdmggLSBzaG91bGQgYmUgZml4ZWQgaW4gaU9TIDhcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZW5idXJucykge1xuXG4gICAgICAgICAgICAgICAga2JhbmltZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMua2VuYnVybnMgPT09IHRydWUgPyAnMTVzJzogdGhpcy5vcHRpb25zLmtlbmJ1cm5zO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFTdHJpbmcoa2JhbmltZHVyYXRpb24pLm1hdGNoKC8obXN8cykkLykpIHtcbiAgICAgICAgICAgICAgICAgICAga2JhbmltZHVyYXRpb24gKz0gJ21zJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHRoaXMub3B0aW9ucy5rZW5idXJuc2FuaW1hdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5rZW5idXJuc2FuaW1hdGlvbnMgPSB0aGlzLm9wdGlvbnMua2VuYnVybnNhbmltYXRpb25zLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtZWRpYSA9IHNsaWRlLmNoaWxkcmVuKCdpbWcsdmlkZW8saWZyYW1lJykuZXEoMCk7XG5cbiAgICAgICAgICAgICAgICBzbGlkZS5kYXRhKCdtZWRpYScsIG1lZGlhKTtcbiAgICAgICAgICAgICAgICBzbGlkZS5kYXRhKCdzaXplcicsIG1lZGlhKTtcblxuICAgICAgICAgICAgICAgIGlmIChtZWRpYS5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKG1lZGlhWzBdLm5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdJTUcnOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdmVyID0gVUkuJCgnPGRpdiBjbGFzcz1cInVrLWNvdmVyLWJhY2tncm91bmQgdWstcG9zaXRpb24tY292ZXJcIj48L2Rpdj4nKS5jc3MoeydiYWNrZ3JvdW5kLWltYWdlJzondXJsKCcrIG1lZGlhLmF0dHIoJ3NyYycpICsgJyknfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVkaWEuYXR0cignd2lkdGgnKSAmJiBtZWRpYS5hdHRyKCdoZWlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlciA9IFVJLiQoJzxjYW52YXM+PC9jYW52YXM+JykuYXR0cih7d2lkdGg6bWVkaWEuYXR0cignd2lkdGgnKSwgaGVpZ2h0Om1lZGlhLmF0dHIoJ2hlaWdodCcpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lZGlhLnJlcGxhY2VXaXRoKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWEgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWEuY3NzKHt3aWR0aDogJzEwMCUnLGhlaWdodDogJ2F1dG8nLCBvcGFjaXR5OjB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5wcmVwZW5kKGNvdmVyKS5kYXRhKCdjb3ZlcicsIGNvdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnSUZSQU1FJzpcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcmMgPSBtZWRpYVswXS5zcmMsIGlmcmFtZUlkID0gJ3N3LScrKCsrcGxheWVySWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsICcnKS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gJHRoaXMuY3VycmVudCB8fCAoaW5kZXggPT0gJHRoaXMuY3VycmVudCAmJiAhJHRoaXMub3B0aW9ucy52aWRlb2F1dG9wbGF5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnBhdXNlbWVkaWEobWVkaWEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMub3B0aW9ucy52aWRlb211dGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLm11dGVtZWRpYShtZWRpYSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52ID0gc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKGljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLm11dGVtZWRpYShtZWRpYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKytpYyA+PSA0KSBjbGVhckludGVydmFsKGludik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgwKSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSgnc2xpZGVzaG93JywgJHRoaXMpICAvLyBhZGQgc2VsZi1yZWZlcmVuY2UgZm9yIHRoZSB2aW1lby1yZWFkeSBsaXN0ZW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1wbGF5ZXItaWQnLCBpZnJhbWVJZCkgIC8vIGFkZCBmcmFtZUlkIGZvciB0aGUgdmltZW8tcmVhZHkgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsIFtzcmMsIChzcmMuaW5kZXhPZignPycpID4gLTEgPyAnJic6Jz8nKSwgJ2VuYWJsZWpzYXBpPTEmYXBpPTEmcGxheWVyX2lkPScraWZyYW1lSWRdLmpvaW4oJycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3VrLXBvc2l0aW9uLWFic29sdXRlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNhYmxlIHBvaW50ZXIgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIVVJLnN1cHBvcnQudG91Y2gpIG1lZGlhLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFVJLmNvdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVJLmNvdmVyKG1lZGlhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWEuYXR0cignZGF0YS11ay1jb3ZlcicsICd7fScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdWSURFTyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWEuYWRkQ2xhc3MoJ3VrLWNvdmVyLW9iamVjdCB1ay1wb3NpdGlvbi1hYnNvbHV0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5vcHRpb25zLnZpZGVvbXV0ZSkgJHRoaXMubXV0ZW1lZGlhKG1lZGlhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMgID0gVUkuJCgnPGNhbnZhcz48L2NhbnZhcz4nKS5hdHRyKHsnd2lkdGgnOiBtZWRpYVswXS53aWR0aCwgJ2hlaWdodCc6IG1lZGlhWzBdLmhlaWdodH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZyA9IFVJLiQoJzxpbWcgc3R5bGU9XCJ3aWR0aDoxMDAlO2hlaWdodDphdXRvO1wiPicpLmF0dHIoJ3NyYycsIGNhbnZhc1swXS50b0RhdGFVUkwoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLnByZXBlbmQoaW1nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmRhdGEoJ3NpemVyJywgaW1nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuZGF0YSgnc2l6ZXInLCBzbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmhhc0tlbkJ1cm5zKHNsaWRlKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLmRhdGEoJ2NvdmVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICctd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbic6IGtiYW5pbWR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbic6IGtiYW5pbWR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2sudWsuc2xpZGVzaG93XCIsICdbZGF0YS11ay1zbGlkZXNob3ctaXRlbV0nLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2xpZGUgPSBVSS4kKHRoaXMpLmF0dHIoJ2RhdGEtdWstc2xpZGVzaG93LWl0ZW0nKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5jdXJyZW50ID09IHNsaWRlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2goc2xpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzW3NsaWRlPT0nbmV4dCcgPyAnbmV4dCc6J3ByZXZpb3VzJ10oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuc2hvdyhwYXJzZUludChzbGlkZSwgMTApKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2V0IHN0YXJ0IHNsaWRlXG4gICAgICAgICAgICB0aGlzLnNsaWRlcy5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJykuZXEodGhpcy5jdXJyZW50KS5hZGRDbGFzcygndWstYWN0aXZlJykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcnMuZmlsdGVyKCdbZGF0YS11ay1zbGlkZXNob3ctaXRlbT1cIicrdGhpcy5jdXJyZW50KydcIl0nKS5hZGRDbGFzcygndWstYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIFVJLiR3aW4ub24oXCJyZXNpemUgbG9hZFwiLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5yZXNpemUoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5maXhGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmNvbnRhaW5lci5jc3MoJ2hlaWdodCcsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnNsaWRlcy5jc3MoJ2hlaWdodCcsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwKSk7XG5cbiAgICAgICAgICAgIC8vIGNocm9tZSBpbWFnZSBsb2FkIGZpeFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAgICAgfSwgODApO1xuXG4gICAgICAgICAgICAvLyBTZXQgYXV0b3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlkZW9hdXRvcGxheSAmJiB0aGlzLnNsaWRlcy5lcSh0aGlzLmN1cnJlbnQpLmRhdGEoJ21lZGlhJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXltZWRpYSh0aGlzLnNsaWRlcy5lcSh0aGlzLmN1cnJlbnQpLmRhdGEoJ21lZGlhJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmtlbmJ1cm5zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUtlbkJ1cm5zKHRoaXMuc2xpZGVzLmVxKHRoaXMuY3VycmVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5vbih7XG4gICAgICAgICAgICAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24oKSB7IGlmICgkdGhpcy5vcHRpb25zLnBhdXNlT25Ib3ZlcikgJHRoaXMuaG92ZXJpbmcgPSB0cnVlOyAgfSxcbiAgICAgICAgICAgICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbigpIHsgJHRoaXMuaG92ZXJpbmcgPSBmYWxzZTsgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ3N3aXBlUmlnaHQgc3dpcGVMZWZ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICR0aGlzW2UudHlwZT09J3N3aXBlTGVmdCcgPyAnbmV4dCcgOiAncHJldmlvdXMnXSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2Rpc3BsYXkudWsuY2hlY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpIHtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5yZXNpemUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuZml4RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuY29udGFpbmVyLmNzcygnaGVpZ2h0Jywgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnNsaWRlcy5jc3MoJ2hlaWdodCcsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIHJlc2l6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5oYXNDbGFzcygndWstc2xpZGVzaG93LWZ1bGxzY3JlZW4nKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWlnaHQgPT09ICdhdXRvJykge1xuXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gMDtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVzLmNzcygnaGVpZ2h0JywgJycpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgVUkuJCh0aGlzKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbihpbmRleCwgZGlyZWN0aW9uKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGluZyB8fCB0aGlzLmN1cnJlbnQgPT0gaW5kZXgpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICAgICAgID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjdXJyZW50ICAgICAgPSB0aGlzLnNsaWRlcy5lcSh0aGlzLmN1cnJlbnQpLFxuICAgICAgICAgICAgICAgIG5leHQgICAgICAgICA9IHRoaXMuc2xpZGVzLmVxKGluZGV4KSxcbiAgICAgICAgICAgICAgICBkaXIgICAgICAgICAgPSBkaXJlY3Rpb24gPyBkaXJlY3Rpb24gOiB0aGlzLmN1cnJlbnQgPCBpbmRleCA/IDEgOiAtMSxcbiAgICAgICAgICAgICAgICBjdXJyZW50bWVkaWEgPSBjdXJyZW50LmRhdGEoJ21lZGlhJyksXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uICAgID0gQW5pbWF0aW9uc1t0aGlzLm9wdGlvbnMuYW5pbWF0aW9uXSA/IHRoaXMub3B0aW9ucy5hbmltYXRpb24gOiAnZmFkZScsXG4gICAgICAgICAgICAgICAgbmV4dG1lZGlhICAgID0gbmV4dC5kYXRhKCdtZWRpYScpLFxuICAgICAgICAgICAgICAgIGZpbmFsaXplICAgICA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJHRoaXMuYW5pbWF0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRtZWRpYSAmJiBjdXJyZW50bWVkaWEuaXMoJ3ZpZGVvLGlmcmFtZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5wYXVzZW1lZGlhKGN1cnJlbnRtZWRpYSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dG1lZGlhICYmIG5leHRtZWRpYS5pcygndmlkZW8saWZyYW1lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnBsYXltZWRpYShuZXh0bWVkaWEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dC5hZGRDbGFzcyhcInVrLWFjdGl2ZVwiKS5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKFwidWstYWN0aXZlXCIpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuY3VycmVudCAgID0gaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KG5leHQsICdbY2xhc3MqPVwidWstYW5pbWF0aW9uLVwiXTpub3QoLnVrLWNvdmVyLWJhY2tncm91bmQudWstcG9zaXRpb24tY292ZXIpJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignc2hvdy51ay5zbGlkZXNob3cnLCBbbmV4dCwgY3VycmVudCwgJHRoaXNdKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkdGhpcy5hcHBseUtlbkJ1cm5zKG5leHQpO1xuXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gZmFsbGJhY2tcbiAgICAgICAgICAgIGlmICghVUkuc3VwcG9ydC5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnQgPSBVSS4kKGN1cnJlbnQpO1xuICAgICAgICAgICAgbmV4dCAgICA9IFVJLiQobmV4dCk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2JlZm9yZXNob3cudWsuc2xpZGVzaG93JywgW25leHQsIGN1cnJlbnQsICR0aGlzXSk7XG5cbiAgICAgICAgICAgIEFuaW1hdGlvbnNbYW5pbWF0aW9uXS5hcHBseSh0aGlzLCBbY3VycmVudCwgbmV4dCwgZGlyXSkudGhlbihmaW5hbGl6ZSk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXJzLnJlbW92ZUNsYXNzKCd1ay1hY3RpdmUnKTtcbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXJzLmZpbHRlcignW2RhdGEtdWstc2xpZGVzaG93LWl0ZW09XCInK2luZGV4KydcIl0nKS5hZGRDbGFzcygndWstYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXBwbHlLZW5CdXJuczogZnVuY3Rpb24oc2xpZGUpIHtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0tlbkJ1cm5zKHNsaWRlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbnMgPSB0aGlzLm9wdGlvbnMua2VuYnVybnNhbmltYXRpb25zLFxuICAgICAgICAgICAgICAgIGluZGV4ICAgICAgPSB0aGlzLmtiaW5kZXggfHwgMDtcblxuXG4gICAgICAgICAgICBzbGlkZS5kYXRhKCdjb3ZlcicpLmF0dHIoJ2NsYXNzJywgJ3VrLWNvdmVyLWJhY2tncm91bmQgdWstcG9zaXRpb24tY292ZXInKS53aWR0aCgpO1xuICAgICAgICAgICAgc2xpZGUuZGF0YSgnY292ZXInKS5hZGRDbGFzcyhbJ3VrLWFuaW1hdGlvbi1zY2FsZScsICd1ay1hbmltYXRpb24tcmV2ZXJzZScsIGFuaW1hdGlvbnNbaW5kZXhdLnRyaW0oKV0uam9pbignICcpKTtcblxuICAgICAgICAgICAgdGhpcy5rYmluZGV4ID0gYW5pbWF0aW9uc1tpbmRleCArIDFdID8gKGluZGV4KzEpOjA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzS2VuQnVybnM6IGZ1bmN0aW9uKHNsaWRlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMub3B0aW9ucy5rZW5idXJucyAmJiBzbGlkZS5kYXRhKCdjb3ZlcicpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLnNsaWRlc1t0aGlzLmN1cnJlbnQgKyAxXSA/ICh0aGlzLmN1cnJlbnQgKyAxKSA6IDAsIDEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLnNsaWRlc1t0aGlzLmN1cnJlbnQgLSAxXSA/ICh0aGlzLmN1cnJlbnQgLSAxKSA6ICh0aGlzLnNsaWRlcy5sZW5ndGggLSAxKSwgLTEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmhvdmVyaW5nKSAkdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXlJbnRlcnZhbCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBsYXltZWRpYTogZnVuY3Rpb24obWVkaWEpIHtcblxuICAgICAgICAgICAgaWYgKCEobWVkaWEgJiYgbWVkaWFbMF0pKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN3aXRjaChtZWRpYVswXS5ub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1ZJREVPJzpcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy52aWRlb211dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lZGlhWzBdLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtZWRpYVswXS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0lGUkFNRSc6XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMudmlkZW9tdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZWRpYVswXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7IFwiZXZlbnRcIjogXCJjb21tYW5kXCIsIFwiZnVuY1wiOiBcInVubXV0ZVwiLCBcIm1ldGhvZFwiOlwic2V0Vm9sdW1lXCIsIFwidmFsdWVcIjoxfScsICcqJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtZWRpYVswXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCd7IFwiZXZlbnRcIjogXCJjb21tYW5kXCIsIFwiZnVuY1wiOiBcInBsYXlWaWRlb1wiLCBcIm1ldGhvZFwiOlwicGxheVwifScsICcqJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhdXNlbWVkaWE6IGZ1bmN0aW9uKG1lZGlhKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaChtZWRpYVswXS5ub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1ZJREVPJzpcbiAgICAgICAgICAgICAgICAgICAgbWVkaWFbMF0ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnSUZSQU1FJzpcbiAgICAgICAgICAgICAgICAgICAgbWVkaWFbMF0uY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSgneyBcImV2ZW50XCI6IFwiY29tbWFuZFwiLCBcImZ1bmNcIjogXCJwYXVzZVZpZGVvXCIsIFwibWV0aG9kXCI6XCJwYXVzZVwifScsICcqJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG11dGVtZWRpYTogZnVuY3Rpb24obWVkaWEpIHtcblxuICAgICAgICAgICAgc3dpdGNoKG1lZGlhWzBdLm5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnVklERU8nOlxuICAgICAgICAgICAgICAgICAgICBtZWRpYVswXS5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0lGUkFNRSc6XG4gICAgICAgICAgICAgICAgICAgIG1lZGlhWzBdLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3sgXCJldmVudFwiOiBcImNvbW1hbmRcIiwgXCJmdW5jXCI6IFwibXV0ZVwiLCBcIm1ldGhvZFwiOlwic2V0Vm9sdW1lXCIsIFwidmFsdWVcIjowfScsICcqJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBBbmltYXRpb25zID0ge1xuXG4gICAgICAgICdub25lJzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBkID0gVUkuJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZC5wcm9taXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3Njcm9sbCc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuXG4gICAgICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgY3VycmVudC5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsIHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMnKTtcbiAgICAgICAgICAgIG5leHQuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgIG5leHQuY3NzKCdvcGFjaXR5JywgMSkub25lKFVJLnN1cHBvcnQuYW5pbWF0aW9uLmVuZCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKGRpciA9PSAtMSA/ICd1ay1zbGlkZXNob3ctc2Nyb2xsLWJhY2t3YXJkLW91dCcgOiAndWstc2xpZGVzaG93LXNjcm9sbC1mb3J3YXJkLW91dCcpO1xuICAgICAgICAgICAgICAgIG5leHQuY3NzKCdvcGFjaXR5JywgJycpLnJlbW92ZUNsYXNzKGRpciA9PSAtMSA/ICd1ay1zbGlkZXNob3ctc2Nyb2xsLWJhY2t3YXJkLWluJyA6ICd1ay1zbGlkZXNob3ctc2Nyb2xsLWZvcndhcmQtaW4nKTtcbiAgICAgICAgICAgICAgICBkLnJlc29sdmUoKTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgY3VycmVudC5hZGRDbGFzcyhkaXIgPT0gLTEgPyAndWstc2xpZGVzaG93LXNjcm9sbC1iYWNrd2FyZC1vdXQnIDogJ3VrLXNsaWRlc2hvdy1zY3JvbGwtZm9yd2FyZC1vdXQnKTtcbiAgICAgICAgICAgIG5leHQuYWRkQ2xhc3MoZGlyID09IC0xID8gJ3VrLXNsaWRlc2hvdy1zY3JvbGwtYmFja3dhcmQtaW4nIDogJ3VrLXNsaWRlc2hvdy1zY3JvbGwtZm9yd2FyZC1pbicpO1xuICAgICAgICAgICAgbmV4dC53aWR0aCgpOyAvLyBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdzd2lwZSc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuXG4gICAgICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgY3VycmVudC5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsIHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMnKTtcbiAgICAgICAgICAgIG5leHQuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgIG5leHQuY3NzKCdvcGFjaXR5JywgMSkub25lKFVJLnN1cHBvcnQuYW5pbWF0aW9uLmVuZCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKGRpciA9PT0gLTEgPyAndWstc2xpZGVzaG93LXN3aXBlLWJhY2t3YXJkLW91dCcgOiAndWstc2xpZGVzaG93LXN3aXBlLWZvcndhcmQtb3V0Jyk7XG4gICAgICAgICAgICAgICAgbmV4dC5jc3MoJ29wYWNpdHknLCAnJykucmVtb3ZlQ2xhc3MoZGlyID09PSAtMSA/ICd1ay1zbGlkZXNob3ctc3dpcGUtYmFja3dhcmQtaW4nIDogJ3VrLXNsaWRlc2hvdy1zd2lwZS1mb3J3YXJkLWluJyk7XG4gICAgICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnQuYWRkQ2xhc3MoZGlyID09IC0xID8gJ3VrLXNsaWRlc2hvdy1zd2lwZS1iYWNrd2FyZC1vdXQnIDogJ3VrLXNsaWRlc2hvdy1zd2lwZS1mb3J3YXJkLW91dCcpO1xuICAgICAgICAgICAgbmV4dC5hZGRDbGFzcyhkaXIgPT0gLTEgPyAndWstc2xpZGVzaG93LXN3aXBlLWJhY2t3YXJkLWluJyA6ICd1ay1zbGlkZXNob3ctc3dpcGUtZm9yd2FyZC1pbicpO1xuICAgICAgICAgICAgbmV4dC53aWR0aCgpOyAvLyBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdzY2FsZSc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuXG4gICAgICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgY3VycmVudC5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsIHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMnKTtcbiAgICAgICAgICAgIG5leHQuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgIG5leHQuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnQub25lKFVJLnN1cHBvcnQuYW5pbWF0aW9uLmVuZCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKCd1ay1zbGlkZXNob3ctc2NhbGUtb3V0Jyk7XG4gICAgICAgICAgICAgICAgbmV4dC5jc3MoJ29wYWNpdHknLCAnJyk7XG4gICAgICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnQuYWRkQ2xhc3MoJ3VrLXNsaWRlc2hvdy1zY2FsZS1vdXQnKTtcbiAgICAgICAgICAgIGN1cnJlbnQud2lkdGgoKTsgLy8gZm9yY2UgcmVkcmF3XG5cbiAgICAgICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnZmFkZSc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuXG4gICAgICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgY3VycmVudC5jc3MoJ2FuaW1hdGlvbi1kdXJhdGlvbicsIHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMnKTtcbiAgICAgICAgICAgIG5leHQuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zJyk7XG5cbiAgICAgICAgICAgIG5leHQuY3NzKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgICAgICAgIC8vIGZvciBwbGFpbiB0ZXh0IGNvbnRlbnQgc2xpZGVzIC0gbG9va3Mgc21vb3RoZXJcbiAgICAgICAgICAgIGlmICghKG5leHQuZGF0YSgnY292ZXInKSB8fCBuZXh0LmRhdGEoJ3BsYWNlaG9sZGVyJykpKSB7XG5cbiAgICAgICAgICAgICAgICBuZXh0LmNzcygnb3BhY2l0eScsIDEpLm9uZShVSS5zdXBwb3J0LmFuaW1hdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0LnJlbW92ZUNsYXNzKCd1ay1zbGlkZXNob3ctZmFkZS1pbicpO1xuICAgICAgICAgICAgICAgIH0pLmFkZENsYXNzKCd1ay1zbGlkZXNob3ctZmFkZS1pbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50Lm9uZShVSS5zdXBwb3J0LmFuaW1hdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgY3VycmVudC5yZW1vdmVDbGFzcygndWstc2xpZGVzaG93LWZhZGUtb3V0Jyk7XG4gICAgICAgICAgICAgICAgbmV4dC5jc3MoJ29wYWNpdHknLCAnJyk7XG4gICAgICAgICAgICAgICAgZC5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnQuYWRkQ2xhc3MoJ3VrLXNsaWRlc2hvdy1mYWRlLW91dCcpO1xuICAgICAgICAgICAgY3VycmVudC53aWR0aCgpOyAvLyBmb3JjZSByZWRyYXdcblxuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFVJLnNsaWRlc2hvdy5hbmltYXRpb25zID0gQW5pbWF0aW9ucztcblxuICAgIC8vIExpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgdmltZW8gcGxheWVyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiBvbk1lc3NhZ2VSZWNlaXZlZChlKSB7XG5cbiAgICAgICAgdmFyIGRhdGEgPSBlLmRhdGEsIGlmcmFtZTtcblxuICAgICAgICBpZiAodHlwZW9mKGRhdGEpID09ICdzdHJpbmcnKSB7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlLm9yaWdpbiAmJiBlLm9yaWdpbi5pbmRleE9mKCd2aW1lbycpID4gLTEgJiYgZGF0YS5ldmVudCA9PSAncmVhZHknICYmIGRhdGEucGxheWVyX2lkKSB7XG4gICAgICAgICAgICBpZnJhbWUgPSBVSS4kKCdbZGF0YS1wbGF5ZXItaWQ9XCInKyBkYXRhLnBsYXllcl9pZCsnXCJdJyk7XG5cbiAgICAgICAgICAgIGlmIChpZnJhbWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWZyYW1lLmRhdGEoJ3NsaWRlc2hvdycpLm11dGVtZWRpYShpZnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgZmFsc2UpO1xuXG59KTtcbiJdfQ==