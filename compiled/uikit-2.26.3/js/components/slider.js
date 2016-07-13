"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slider", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var dragging,
        _delayIdle,
        anchor,
        dragged,
        store = {};

    UI.component('slider', {

        defaults: {
            center: false,
            threshold: 10,
            infinite: true,
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true,
            activecls: 'uk-active'
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                setTimeout(function () {

                    UI.$('[data-uk-slider]', context).each(function () {

                        var ele = UI.$(this);

                        if (!ele.data('slider')) {
                            UI.slider(ele, UI.Utils.options(ele.attr('data-uk-slider')));
                        }
                    });
                }, 0);
            });
        },

        init: function init() {

            var $this = this;

            this.container = this.element.find('.uk-slider');
            this.focus = 0;

            UI.$win.on('resize load', UI.Utils.debounce(function () {
                $this.resize(true);
            }, 100));

            this.on('click.uk.slider', '[data-uk-slider-item]', function (e) {

                e.preventDefault();

                var item = UI.$(this).attr('data-uk-slider-item');

                if ($this.focus == item) return;

                // stop autoplay
                $this.stop();

                switch (item) {
                    case 'next':
                    case 'previous':
                        $this[item == 'next' ? 'next' : 'previous']();
                        break;
                    default:
                        $this.updateFocus(parseInt(item, 10));
                }
            });

            this.container.on({

                'touchstart mousedown': function touchstartMousedown(evt) {

                    if (evt.originalEvent && evt.originalEvent.touches) {
                        evt = evt.originalEvent.touches[0];
                    }

                    // ignore right click button
                    if (evt.button && evt.button == 2 || !$this.active) {
                        return;
                    }

                    // stop autoplay
                    $this.stop();

                    anchor = UI.$(evt.target).is('a') ? UI.$(evt.target) : UI.$(evt.target).parents('a:first');
                    dragged = false;

                    if (anchor.length) {

                        anchor.one('click', function (e) {
                            if (dragged) e.preventDefault();
                        });
                    }

                    _delayIdle = function delayIdle(e) {

                        dragged = true;
                        dragging = $this;
                        store = {
                            touchx: parseInt(e.pageX, 10),
                            dir: 1,
                            focus: $this.focus,
                            base: $this.options.center ? 'center' : 'area'
                        };

                        if (e.originalEvent && e.originalEvent.touches) {
                            e = e.originalEvent.touches[0];
                        }

                        dragging.element.data({
                            'pointer-start': { x: parseInt(e.pageX, 10), y: parseInt(e.pageY, 10) },
                            'pointer-pos-start': $this.pos
                        });

                        $this.container.addClass('uk-drag');

                        _delayIdle = false;
                    };

                    _delayIdle.x = parseInt(evt.pageX, 10);
                    _delayIdle.threshold = $this.options.threshold;
                },

                mouseenter: function mouseenter() {
                    if ($this.options.pauseOnHover) $this.hovering = true;
                },
                mouseleave: function mouseleave() {
                    $this.hovering = false;
                }
            });

            this.resize(true);

            this.on('display.uk.check', function () {
                if ($this.element.is(":visible")) {
                    $this.resize(true);
                }
            });

            // prevent dragging links + images
            this.element.find('a,img').attr('draggable', 'false');

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }
        },

        resize: function resize(focus) {

            var $this = this,
                pos = 0,
                maxheight = 0,
                item,
                width,
                cwidth,
                size;

            this.items = this.container.children().filter(':visible');
            this.vp = this.element[0].getBoundingClientRect().width;

            this.container.css({ 'min-width': '', 'min-height': '' });

            this.items.each(function (idx) {

                item = UI.$(this);
                size = item.css({ 'left': '', 'width': '' })[0].getBoundingClientRect();
                width = size.width;
                cwidth = item.width();
                maxheight = Math.max(maxheight, size.height);

                item.css({ 'left': pos, 'width': width }).data({ 'idx': idx, 'left': pos, 'width': width, 'cwidth': cwidth, 'area': pos + width, 'center': pos - ($this.vp / 2 - cwidth / 2) });

                pos += width;
            });

            this.container.css({ 'min-width': pos, 'min-height': maxheight });

            if (this.options.infinite && (pos <= 2 * this.vp || this.items.length < 5) && !this.itemsResized) {

                // fill with cloned items
                this.container.children().each(function (idx) {
                    $this.container.append($this.items.eq(idx).clone(true).attr('id', ''));
                }).each(function (idx) {
                    $this.container.append($this.items.eq(idx).clone(true).attr('id', ''));
                });

                this.itemsResized = true;

                return this.resize();
            }

            this.cw = pos;
            this.pos = 0;
            this.active = pos >= this.vp;

            this.container.css({
                '-ms-transform': '',
                '-webkit-transform': '',
                'transform': ''
            });

            if (focus) this.updateFocus(this.focus);
        },

        updatePos: function updatePos(pos) {
            this.pos = pos;
            this.container.css({
                '-ms-transform': 'translateX(' + pos + 'px)',
                '-webkit-transform': 'translateX(' + pos + 'px)',
                'transform': 'translateX(' + pos + 'px)'
            });
        },

        updateFocus: function updateFocus(idx, dir) {

            if (!this.active) {
                return;
            }

            dir = dir || (idx > this.focus ? 1 : -1);

            var item = this.items.eq(idx),
                area,
                i;

            if (this.options.infinite) {
                this.infinite(idx, dir);
            }

            if (this.options.center) {

                this.updatePos(item.data('center') * -1);

                this.items.filter('.' + this.options.activecls).removeClass(this.options.activecls);
                item.addClass(this.options.activecls);
            } else {

                if (this.options.infinite) {

                    this.updatePos(item.data('left') * -1);
                } else {

                    area = 0;

                    for (i = idx; i < this.items.length; i++) {
                        area += this.items.eq(i).data('width');
                    }

                    if (area > this.vp) {

                        this.updatePos(item.data('left') * -1);
                    } else {

                        if (dir == 1) {

                            area = 0;

                            for (i = this.items.length - 1; i >= 0; i--) {

                                area += this.items.eq(i).data('width');

                                if (area == this.vp) {
                                    idx = i;
                                    break;
                                }

                                if (area > this.vp) {
                                    idx = i < this.items.length - 1 ? i + 1 : i;
                                    break;
                                }
                            }

                            if (area > this.vp) {
                                this.updatePos((this.container.width() - this.vp) * -1);
                            } else {
                                this.updatePos(this.items.eq(idx).data('left') * -1);
                            }
                        }
                    }
                }
            }

            // mark elements
            var left = this.items.eq(idx).data('left');

            this.items.removeClass('uk-slide-before uk-slide-after').each(function (i) {
                if (i !== idx) {
                    UI.$(this).addClass(UI.$(this).data('left') < left ? 'uk-slide-before' : 'uk-slide-after');
                }
            });

            this.focus = idx;

            this.trigger('focusitem.uk.slider', [idx, this.items.eq(idx), this]);
        },

        next: function next() {

            var focus = this.items[this.focus + 1] ? this.focus + 1 : this.options.infinite ? 0 : this.focus;

            this.updateFocus(focus, 1);
        },

        previous: function previous() {

            var focus = this.items[this.focus - 1] ? this.focus - 1 : this.options.infinite ? this.items[this.focus - 1] ? this.items - 1 : this.items.length - 1 : this.focus;

            this.updateFocus(focus, -1);
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

        infinite: function infinite(baseidx, direction) {

            var $this = this,
                item = this.items.eq(baseidx),
                i,
                z = baseidx,
                move = [],
                area = 0;

            if (direction == 1) {

                for (i = 0; i < this.items.length; i++) {

                    if (z != baseidx) {
                        area += this.items.eq(z).data('width');
                        move.push(this.items.eq(z));
                    }

                    if (area > this.vp) {
                        break;
                    }

                    z = z + 1 == this.items.length ? 0 : z + 1;
                }

                if (move.length) {

                    move.forEach(function (itm) {

                        var left = item.data('area');

                        itm.css({ 'left': left }).data({
                            'left': left,
                            'area': left + itm.data('width'),
                            'center': left - ($this.vp / 2 - itm.data('cwidth') / 2)
                        });

                        item = itm;
                    });
                }
            } else {

                for (i = this.items.length - 1; i > -1; i--) {

                    area += this.items.eq(z).data('width');

                    if (z != baseidx) {
                        move.push(this.items.eq(z));
                    }

                    if (area > this.vp) {
                        break;
                    }

                    z = z - 1 == -1 ? this.items.length - 1 : z - 1;
                }

                if (move.length) {

                    move.forEach(function (itm) {

                        var left = item.data('left') - itm.data('width');

                        itm.css({ 'left': left }).data({
                            'left': left,
                            'area': left + itm.data('width'),
                            'center': left - ($this.vp / 2 - itm.data('cwidth') / 2)
                        });

                        item = itm;
                    });
                }
            }
        }
    });

    // handle dragging
    UI.$doc.on('mousemove.uk.slider touchmove.uk.slider', function (e) {

        if (e.originalEvent && e.originalEvent.touches) {
            e = e.originalEvent.touches[0];
        }

        if (_delayIdle && Math.abs(e.pageX - _delayIdle.x) > _delayIdle.threshold) {

            if (!window.getSelection().toString()) {
                _delayIdle(e);
            } else {
                dragging = _delayIdle = false;
            }
        }

        if (!dragging) {
            return;
        }

        var x, xDiff, pos, dir, focus, item, next, diff, i, z, itm;

        if (e.clientX || e.clientY) {
            x = e.clientX;
        } else if (e.pageX || e.pageY) {
            x = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
        }

        focus = store.focus;
        xDiff = x - dragging.element.data('pointer-start').x;
        pos = dragging.element.data('pointer-pos-start') + xDiff;
        dir = x > dragging.element.data('pointer-start').x ? -1 : 1;
        item = dragging.items.eq(store.focus);

        if (dir == 1) {

            diff = item.data('left') + Math.abs(xDiff);

            for (i = 0, z = store.focus; i < dragging.items.length; i++) {

                itm = dragging.items.eq(z);

                if (z != store.focus && itm.data('left') < diff && itm.data('area') > diff) {
                    focus = z;
                    break;
                }

                z = z + 1 == dragging.items.length ? 0 : z + 1;
            }
        } else {

            diff = item.data('left') - Math.abs(xDiff);

            for (i = 0, z = store.focus; i < dragging.items.length; i++) {

                itm = dragging.items.eq(z);

                if (z != store.focus && itm.data('area') <= item.data('left') && itm.data('center') < diff) {
                    focus = z;
                    break;
                }

                z = z - 1 == -1 ? dragging.items.length - 1 : z - 1;
            }
        }

        if (dragging.options.infinite && focus != store._focus) {
            dragging.infinite(focus, dir);
        }

        dragging.updatePos(pos);

        store.dir = dir;
        store._focus = focus;
        store.touchx = parseInt(e.pageX, 10);
        store.diff = diff;
    });

    UI.$doc.on('mouseup.uk.slider touchend.uk.slider', function (e) {

        if (dragging) {

            dragging.container.removeClass('uk-drag');

            // TODO is this needed?
            dragging.items.eq(store.focus);

            var itm,
                focus = false,
                i,
                z;

            if (store.dir == 1) {

                for (i = 0, z = store.focus; i < dragging.items.length; i++) {

                    itm = dragging.items.eq(z);

                    if (z != store.focus && itm.data('left') > store.diff) {
                        focus = z;
                        break;
                    }

                    z = z + 1 == dragging.items.length ? 0 : z + 1;
                }
            } else {

                for (i = 0, z = store.focus; i < dragging.items.length; i++) {

                    itm = dragging.items.eq(z);

                    if (z != store.focus && itm.data('left') < store.diff) {
                        focus = z;
                        break;
                    }

                    z = z - 1 == -1 ? dragging.items.length - 1 : z - 1;
                }
            }

            dragging.updateFocus(focus !== false ? focus : store._focus);
        }

        dragging = _delayIdle = false;
    });

    return UI.slider;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxjQUFQLEVBQXVCLENBQUMsT0FBRCxDQUF2QixFQUFrQyxZQUFVO0FBQ3hDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksUUFBSjtBQUFBLFFBQWMsVUFBZDtBQUFBLFFBQXlCLE1BQXpCO0FBQUEsUUFBaUMsT0FBakM7QUFBQSxRQUEwQyxRQUFRLEVBQWxEOztBQUVBLE9BQUcsU0FBSCxDQUFhLFFBQWIsRUFBdUI7O0FBRW5CLGtCQUFVO0FBQ04sb0JBQW1CLEtBRGI7QUFFTix1QkFBbUIsRUFGYjtBQUdOLHNCQUFtQixJQUhiO0FBSU4sc0JBQW1CLEtBSmI7QUFLTiw4QkFBbUIsSUFMYjtBQU1OLDBCQUFtQixJQU5iO0FBT04sdUJBQW1CO0FBUGIsU0FGUzs7QUFZbkIsY0FBTyxnQkFBVzs7O0FBR2QsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QiwyQkFBVyxZQUFVOztBQUVqQix1QkFBRyxDQUFILENBQUssa0JBQUwsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBdUMsWUFBVTs7QUFFN0MsNEJBQUksTUFBTSxHQUFHLENBQUgsQ0FBSyxJQUFMLENBQVY7O0FBRUEsNEJBQUksQ0FBQyxJQUFJLElBQUosQ0FBUyxRQUFULENBQUwsRUFBeUI7QUFDckIsK0JBQUcsTUFBSCxDQUFVLEdB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QUFrQixDQUFsQixDQUFOOztBQUVBLHdCQUFJLEtBQUssTUFBTSxLQUFYLElBQW9CLElBQUksSUFBSixDQUFTLE1BQVQsSUFBbUIsTUFBTSxJQUFqRCxFQUF1RDtBQUNuRCxnQ0FBUSxDQUFSO0FBQ0E7QUFDSDs7QUFFRCx3QkFBSSxJQUFFLENBQUYsSUFBTyxTQUFTLEtBQVQsQ0FBZSxNQUF0QixHQUErQixDQUEvQixHQUFpQyxJQUFFLENBQXZDO0FBQ0g7QUFFSixhQWRELE1BY087O0FBRUgscUJBQUssSUFBRSxDQUFGLEVBQUksSUFBRSxNQUFNLEtBQWpCLEVBQXVCLElBQUUsU0FBUyxLQUFULENBQWUsTUFBeEMsRUFBK0MsR0FBL0MsRUFBb0Q7O0FBRWhELDBCQUFNLFNBQVMsS0FBVCxDQUFlLEVBQWYsQ0FBa0IsQ0FBbEIsQ0FBTjs7QUFFQSx3QkFBSSxLQUFLLE1BQU0sS0FBWCxJQUFvQixJQUFJLElBQUosQ0FBUyxNQUFULElBQW1CLE1BQU0sSUFBakQsRUFBdUQ7QUFDbkQsZ0NBQVEsQ0FBUjtBQUNBO0FBQ0g7O0FBRUQsd0JBQUksSUFBRSxDQUFGLElBQU8sQ0FBQyxDQUFSLEdBQVksU0FBUyxLQUFULENBQWUsTUFBZixHQUFzQixDQUFsQyxHQUFvQyxJQUFFLENBQTFDO0FBQ0g7QUFDSjs7QUFFRCxxQkFBUyxXQUFULENBQXFCLFVBQVEsS0FBUixHQUFnQixLQUFoQixHQUFzQixNQUFNLE1BQWpEO0FBRUg7O0FBRUQsbUJBQVcsYUFBWSxLQUF2QjtBQUNILEtBN0NEOztBQStDQSxXQUFPLEdBQUcsTUFBVjtBQUNILENBMWhCRCIsImZpbGUiOiJzbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1zbGlkZXJcIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSl7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBkcmFnZ2luZywgZGVsYXlJZGxlLCBhbmNob3IsIGRyYWdnZWQsIHN0b3JlID0ge307XG5cbiAgICBVSS5jb21wb25lbnQoJ3NsaWRlcicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgY2VudGVyICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdGhyZXNob2xkICAgICAgICA6IDEwLFxuICAgICAgICAgICAgaW5maW5pdGUgICAgICAgICA6IHRydWUsXG4gICAgICAgICAgICBhdXRvcGxheSAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBhdXRvcGxheUludGVydmFsIDogNzAwMCxcbiAgICAgICAgICAgIHBhdXNlT25Ib3ZlciAgICAgOiB0cnVlLFxuICAgICAgICAgICAgYWN0aXZlY2xzICAgICAgICA6ICd1ay1hY3RpdmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICBVSS4kKCdbZGF0YS11ay1zbGlkZXJdJywgY29udGV4dCkuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YSgnc2xpZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBVSS5zbGlkZXIoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKCdkYXRhLXVrLXNsaWRlcicpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLnVrLXNsaWRlcicpO1xuICAgICAgICAgICAgdGhpcy5mb2N1cyAgICAgPSAwO1xuXG4gICAgICAgICAgICBVSS4kd2luLm9uKCdyZXNpemUgbG9hZCcsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICR0aGlzLnJlc2l6ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sIDEwMCkpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdjbGljay51ay5zbGlkZXInLCAnW2RhdGEtdWstc2xpZGVyLWl0ZW1dJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBVSS4kKHRoaXMpLmF0dHIoJ2RhdGEtdWstc2xpZGVyLWl0ZW0nKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5mb2N1cyA9PSBpdGVtKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAvLyBzdG9wIGF1dG9wbGF5XG4gICAgICAgICAgICAgICAgJHRoaXMuc3RvcCgpO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzW2l0ZW09PSduZXh0JyA/ICduZXh0JzoncHJldmlvdXMnXSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy51cGRhdGVGb2N1cyhwYXJzZUludChpdGVtLCAxMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5vbih7XG5cbiAgICAgICAgICAgICAgICAndG91Y2hzdGFydCBtb3VzZWRvd24nOiBmdW5jdGlvbihldnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0Lm9yaWdpbmFsRXZlbnQgJiYgZXZ0Lm9yaWdpbmFsRXZlbnQudG91Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZ0ID0gZXZ0Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSByaWdodCBjbGljayBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5idXR0b24gJiYgZXZ0LmJ1dHRvbj09MiB8fCAhJHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9wIGF1dG9wbGF5XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnN0b3AoKTtcblxuICAgICAgICAgICAgICAgICAgICBhbmNob3IgID0gVUkuJChldnQudGFyZ2V0KS5pcygnYScpID8gVUkuJChldnQudGFyZ2V0KSA6IFVJLiQoZXZ0LnRhcmdldCkucGFyZW50cygnYTpmaXJzdCcpO1xuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuY2hvci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZHJhZ2dlZCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkZWxheUlkbGUgPSBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnZWQgID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gJHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZSAgICA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3VjaHggOiBwYXJzZUludChlLnBhZ2VYLCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyICAgIDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1cyAgOiAkdGhpcy5mb2N1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlICAgOiAkdGhpcy5vcHRpb25zLmNlbnRlciA/ICdjZW50ZXInOidhcmVhJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmcuZWxlbWVudC5kYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncG9pbnRlci1zdGFydCc6IHt4OiBwYXJzZUludChlLnBhZ2VYLCAxMCksIHk6IHBhcnNlSW50KGUucGFnZVksIDEwKX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BvaW50ZXItcG9zLXN0YXJ0JzogJHRoaXMucG9zXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuY29udGFpbmVyLmFkZENsYXNzKCd1ay1kcmFnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5SWRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5SWRsZS54ICAgICAgICAgPSBwYXJzZUludChldnQucGFnZVgsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsYXlJZGxlLnRocmVzaG9sZCA9ICR0aGlzLm9wdGlvbnMudGhyZXNob2xkO1xuXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKCkgeyBpZiAoJHRoaXMub3B0aW9ucy5wYXVzZU9uSG92ZXIpICR0aGlzLmhvdmVyaW5nID0gdHJ1ZTsgIH0sXG4gICAgICAgICAgICAgICAgbW91c2VsZWF2ZTogZnVuY3Rpb24oKSB7ICR0aGlzLmhvdmVyaW5nID0gZmFsc2U7IH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZSh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5vbignZGlzcGxheS51ay5jaGVjaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5yZXNpemUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHByZXZlbnQgZHJhZ2dpbmcgbGlua3MgKyBpbWFnZXNcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdhLGltZycpLmF0dHIoJ2RyYWdnYWJsZScsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAvLyBTZXQgYXV0b3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZXNpemU6IGZ1bmN0aW9uKGZvY3VzKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXMsIHBvcyA9IDAsIG1heGhlaWdodCA9IDAsIGl0ZW0sIHdpZHRoLCBjd2lkdGgsIHNpemU7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLmNvbnRhaW5lci5jaGlsZHJlbigpLmZpbHRlcignOnZpc2libGUnKTtcbiAgICAgICAgICAgIHRoaXMudnAgICAgPSB0aGlzLmVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNzcyh7J21pbi13aWR0aCc6ICcnLCAnbWluLWhlaWdodCc6ICcnfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMuZWFjaChmdW5jdGlvbihpZHgpe1xuXG4gICAgICAgICAgICAgICAgaXRlbSAgICAgID0gVUkuJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBzaXplICAgICAgPSBpdGVtLmNzcyh7J2xlZnQnOiAnJywgJ3dpZHRoJzonJ30pWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHdpZHRoICAgICA9IHNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgY3dpZHRoICAgID0gaXRlbS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIG1heGhlaWdodCA9IE1hdGgubWF4KG1heGhlaWdodCwgc2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5jc3MoeydsZWZ0JzogcG9zLCAnd2lkdGgnOndpZHRofSkuZGF0YSh7J2lkeCc6aWR4LCAnbGVmdCc6IHBvcywgJ3dpZHRoJzogd2lkdGgsICdjd2lkdGgnOmN3aWR0aCwgJ2FyZWEnOiAocG9zK3dpZHRoKSwgJ2NlbnRlcic6KHBvcyAtICgkdGhpcy52cC8yIC0gY3dpZHRoLzIpKX0pO1xuXG4gICAgICAgICAgICAgICAgcG9zICs9IHdpZHRoO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNzcyh7J21pbi13aWR0aCc6IHBvcywgJ21pbi1oZWlnaHQnOiBtYXhoZWlnaHR9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmZpbml0ZSAmJiAocG9zIDw9ICgyKnRoaXMudnApIHx8IHRoaXMuaXRlbXMubGVuZ3RoIDwgNSkgJiYgIXRoaXMuaXRlbXNSZXNpemVkKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBmaWxsIHdpdGggY2xvbmVkIGl0ZW1zXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKGlkeCl7XG4gICAgICAgICAgICAgICAgICAgJHRoaXMuY29udGFpbmVyLmFwcGVuZCgkdGhpcy5pdGVtcy5lcShpZHgpLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpKTtcbiAgICAgICAgICAgICAgICB9KS5lYWNoKGZ1bmN0aW9uKGlkeCl7XG4gICAgICAgICAgICAgICAgICAgJHRoaXMuY29udGFpbmVyLmFwcGVuZCgkdGhpcy5pdGVtcy5lcShpZHgpLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNSZXNpemVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN3ICAgICA9IHBvcztcbiAgICAgICAgICAgIHRoaXMucG9zICAgID0gMDtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gcG9zID49IHRoaXMudnA7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiAnJyxcbiAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiAnJyxcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogJydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZm9jdXMpIHRoaXMudXBkYXRlRm9jdXModGhpcy5mb2N1cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlUG9zOiBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcrcG9zKydweCknLFxuICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcrcG9zKydweCknLFxuICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgnK3BvcysncHgpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlRm9jdXM6IGZ1bmN0aW9uKGlkeCwgZGlyKSB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRpciA9IGRpciB8fCAoaWR4ID4gdGhpcy5mb2N1cyA/IDE6LTEpO1xuXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbXMuZXEoaWR4KSwgYXJlYSwgaTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmZpbml0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5maW5pdGUoaWR4LCBkaXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNlbnRlcikge1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQb3MoaXRlbS5kYXRhKCdjZW50ZXInKSotMSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zLmZpbHRlcignLicrdGhpcy5vcHRpb25zLmFjdGl2ZWNscykucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmFjdGl2ZWNscyk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuYWN0aXZlY2xzKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5maW5pdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBvcyhpdGVtLmRhdGEoJ2xlZnQnKSotMSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGFyZWEgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaT1pZHg7aTx0aGlzLml0ZW1zLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEgKz0gdGhpcy5pdGVtcy5lcShpKS5kYXRhKCd3aWR0aCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJlYSA+IHRoaXMudnApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQb3MoaXRlbS5kYXRhKCdsZWZ0JykqLTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXIgPT0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk9dGhpcy5pdGVtcy5sZW5ndGgtMTtpPj0wO2ktLSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEgKz0gdGhpcy5pdGVtcy5lcShpKS5kYXRhKCd3aWR0aCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmVhID09IHRoaXMudnApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkeCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmVhID4gdGhpcy52cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4ID0gKGkgPCB0aGlzLml0ZW1zLmxlbmd0aC0xKSA/IGkrMSA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmVhID4gdGhpcy52cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBvcygodGhpcy5jb250YWluZXIud2lkdGgoKSAtIHRoaXMudnApICogLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zKHRoaXMuaXRlbXMuZXEoaWR4KS5kYXRhKCdsZWZ0JykqLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWFyayBlbGVtZW50c1xuICAgICAgICAgICAgdmFyIGxlZnQgPSB0aGlzLml0ZW1zLmVxKGlkeCkuZGF0YSgnbGVmdCcpO1xuXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnJlbW92ZUNsYXNzKCd1ay1zbGlkZS1iZWZvcmUgdWstc2xpZGUtYWZ0ZXInKS5lYWNoKGZ1bmN0aW9uKGkpe1xuICAgICAgICAgICAgICAgIGlmIChpIT09aWR4KSB7XG4gICAgICAgICAgICAgICAgICAgIFVJLiQodGhpcykuYWRkQ2xhc3MoVUkuJCh0aGlzKS5kYXRhKCdsZWZ0JykgPCBsZWZ0ID8gJ3VrLXNsaWRlLWJlZm9yZSc6J3VrLXNsaWRlLWFmdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9jdXMgPSBpZHg7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZm9jdXNpdGVtLnVrLnNsaWRlcicsIFtpZHgsdGhpcy5pdGVtcy5lcShpZHgpLHRoaXNdKTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGZvY3VzID0gdGhpcy5pdGVtc1t0aGlzLmZvY3VzICsgMV0gPyAodGhpcy5mb2N1cyArIDEpIDogKHRoaXMub3B0aW9ucy5pbmZpbml0ZSA/IDA6dGhpcy5mb2N1cyk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm9jdXMoZm9jdXMsIDEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGZvY3VzID0gdGhpcy5pdGVtc1t0aGlzLmZvY3VzIC0gMV0gPyAodGhpcy5mb2N1cyAtIDEpIDogKHRoaXMub3B0aW9ucy5pbmZpbml0ZSA/ICh0aGlzLml0ZW1zW3RoaXMuZm9jdXMgLSAxXSA/IHRoaXMuaXRlbXMtMTp0aGlzLml0ZW1zLmxlbmd0aC0xKTp0aGlzLmZvY3VzKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVGb2N1cyhmb2N1cywgLTEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmhvdmVyaW5nKSAkdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXlJbnRlcnZhbCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluZmluaXRlOiBmdW5jdGlvbihiYXNlaWR4LCBkaXJlY3Rpb24pIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgaXRlbSA9IHRoaXMuaXRlbXMuZXEoYmFzZWlkeCksIGksIHogPSBiYXNlaWR4LCBtb3ZlID0gW10sIGFyZWEgPSAwO1xuXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09IDEpIHtcblxuXG4gICAgICAgICAgICAgICAgZm9yIChpPTA7aTx0aGlzLml0ZW1zLmxlbmd0aDtpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoeiAhPSBiYXNlaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhICs9IHRoaXMuaXRlbXMuZXEoeikuZGF0YSgnd2lkdGgnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUucHVzaCh0aGlzLml0ZW1zLmVxKHopKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmVhID4gdGhpcy52cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB6ID0geisxID09IHRoaXMuaXRlbXMubGVuZ3RoID8gMDp6KzE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1vdmUubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0bSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gaXRlbS5kYXRhKCdhcmVhJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0bS5jc3MoeydsZWZ0JzogbGVmdH0pLmRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsZWZ0JyAgOiBsZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhcmVhJyAgOiAobGVmdCtpdG0uZGF0YSgnd2lkdGgnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NlbnRlcic6IChsZWZ0IC0gKCR0aGlzLnZwLzIgLSBpdG0uZGF0YSgnY3dpZHRoJykvMikpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGl0bTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGk9dGhpcy5pdGVtcy5sZW5ndGgtMTtpID4tMSA7aS0tKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYXJlYSArPSB0aGlzLml0ZW1zLmVxKHopLmRhdGEoJ3dpZHRoJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHogIT0gYmFzZWlkeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZS5wdXNoKHRoaXMuaXRlbXMuZXEoeikpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZWEgPiB0aGlzLnZwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHogPSB6LTEgPT0gLTEgPyB0aGlzLml0ZW1zLmxlbmd0aC0xOnotMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobW92ZS5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBtb3ZlLmZvckVhY2goZnVuY3Rpb24oaXRtKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSBpdGVtLmRhdGEoJ2xlZnQnKSAtIGl0bS5kYXRhKCd3aWR0aCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpdG0uY3NzKHsnbGVmdCc6IGxlZnR9KS5kYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCcgIDogbGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJlYScgIDogKGxlZnQraXRtLmRhdGEoJ3dpZHRoJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjZW50ZXInOiAobGVmdCAtICgkdGhpcy52cC8yIC0gaXRtLmRhdGEoJ2N3aWR0aCcpLzIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBpdG07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gaGFuZGxlIGRyYWdnaW5nXG4gICAgVUkuJGRvYy5vbignbW91c2Vtb3ZlLnVrLnNsaWRlciB0b3VjaG1vdmUudWsuc2xpZGVyJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMpIHtcbiAgICAgICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWxheUlkbGUgJiYgTWF0aC5hYnMoZS5wYWdlWCAtIGRlbGF5SWRsZS54KSA+IGRlbGF5SWRsZS50aHJlc2hvbGQpIHtcblxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgIGRlbGF5SWRsZShlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBkZWxheUlkbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4LCB4RGlmZiwgcG9zLCBkaXIsIGZvY3VzLCBpdGVtLCBuZXh0LCBkaWZmLCBpLCB6LCBpdG07XG5cbiAgICAgICAgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFkpIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICAgICAgICB4ID0gZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9jdXMgPSBzdG9yZS5mb2N1cztcbiAgICAgICAgeERpZmYgPSB4IC0gZHJhZ2dpbmcuZWxlbWVudC5kYXRhKCdwb2ludGVyLXN0YXJ0JykueDtcbiAgICAgICAgcG9zICAgPSBkcmFnZ2luZy5lbGVtZW50LmRhdGEoJ3BvaW50ZXItcG9zLXN0YXJ0JykgKyB4RGlmZjtcbiAgICAgICAgZGlyICAgPSB4ID4gZHJhZ2dpbmcuZWxlbWVudC5kYXRhKCdwb2ludGVyLXN0YXJ0JykueCA/IC0xOjE7XG4gICAgICAgIGl0ZW0gID0gZHJhZ2dpbmcuaXRlbXMuZXEoc3RvcmUuZm9jdXMpO1xuXG4gICAgICAgIGlmIChkaXIgPT0gMSkge1xuXG4gICAgICAgICAgICBkaWZmID0gaXRlbS5kYXRhKCdsZWZ0JykgKyBNYXRoLmFicyh4RGlmZik7XG5cbiAgICAgICAgICAgIGZvciAoaT0wLHo9c3RvcmUuZm9jdXM7aTxkcmFnZ2luZy5pdGVtcy5sZW5ndGg7aSsrKSB7XG5cbiAgICAgICAgICAgICAgICBpdG0gPSBkcmFnZ2luZy5pdGVtcy5lcSh6KTtcblxuICAgICAgICAgICAgICAgIGlmICh6ICE9IHN0b3JlLmZvY3VzICYmIGl0bS5kYXRhKCdsZWZ0JykgPCBkaWZmICYmIGl0bS5kYXRhKCdhcmVhJykgPiBkaWZmKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvY3VzID0gejtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeiA9IHorMSA9PSBkcmFnZ2luZy5pdGVtcy5sZW5ndGggPyAwOnorMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBkaWZmID0gaXRlbS5kYXRhKCdsZWZ0JykgLSBNYXRoLmFicyh4RGlmZik7XG5cbiAgICAgICAgICAgIGZvciAoaT0wLHo9c3RvcmUuZm9jdXM7aTxkcmFnZ2luZy5pdGVtcy5sZW5ndGg7aSsrKSB7XG5cbiAgICAgICAgICAgICAgICBpdG0gPSBkcmFnZ2luZy5pdGVtcy5lcSh6KTtcblxuICAgICAgICAgICAgICAgIGlmICh6ICE9IHN0b3JlLmZvY3VzICYmIGl0bS5kYXRhKCdhcmVhJykgPD0gaXRlbS5kYXRhKCdsZWZ0JykgJiYgaXRtLmRhdGEoJ2NlbnRlcicpIDwgZGlmZikge1xuICAgICAgICAgICAgICAgICAgICBmb2N1cyA9IHo7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHogPSB6LTEgPT0gLTEgPyBkcmFnZ2luZy5pdGVtcy5sZW5ndGgtMTp6LTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHJhZ2dpbmcub3B0aW9ucy5pbmZpbml0ZSAmJiBmb2N1cyE9c3RvcmUuX2ZvY3VzKSB7XG4gICAgICAgICAgICBkcmFnZ2luZy5pbmZpbml0ZShmb2N1cywgZGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdnaW5nLnVwZGF0ZVBvcyhwb3MpO1xuXG4gICAgICAgIHN0b3JlLmRpciAgICAgPSBkaXI7XG4gICAgICAgIHN0b3JlLl9mb2N1cyAgPSBmb2N1cztcbiAgICAgICAgc3RvcmUudG91Y2h4ICA9IHBhcnNlSW50KGUucGFnZVgsIDEwKTtcbiAgICAgICAgc3RvcmUuZGlmZiAgICA9IGRpZmY7XG4gICAgfSk7XG5cbiAgICBVSS4kZG9jLm9uKCdtb3VzZXVwLnVrLnNsaWRlciB0b3VjaGVuZC51ay5zbGlkZXInLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgIGRyYWdnaW5nLmNvbnRhaW5lci5yZW1vdmVDbGFzcygndWstZHJhZycpO1xuXG4gICAgICAgICAgICAvLyBUT0RPIGlzIHRoaXMgbmVlZGVkP1xuICAgICAgICAgICAgZHJhZ2dpbmcuaXRlbXMuZXEoc3RvcmUuZm9jdXMpO1xuXG4gICAgICAgICAgICB2YXIgaXRtLCBmb2N1cyA9IGZhbHNlLCBpLCB6O1xuXG4gICAgICAgICAgICBpZiAoc3RvcmUuZGlyID09IDEpIHtcblxuICAgICAgICAgICAgICAgIGZvciAoaT0wLHo9c3RvcmUuZm9jdXM7aTxkcmFnZ2luZy5pdGVtcy5sZW5ndGg7aSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaXRtID0gZHJhZ2dpbmcuaXRlbXMuZXEoeik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHogIT0gc3RvcmUuZm9jdXMgJiYgaXRtLmRhdGEoJ2xlZnQnKSA+IHN0b3JlLmRpZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgeiA9IHorMSA9PSBkcmFnZ2luZy5pdGVtcy5sZW5ndGggPyAwOnorMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGk9MCx6PXN0b3JlLmZvY3VzO2k8ZHJhZ2dpbmcuaXRlbXMubGVuZ3RoO2krKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGl0bSA9IGRyYWdnaW5nLml0ZW1zLmVxKHopO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh6ICE9IHN0b3JlLmZvY3VzICYmIGl0bS5kYXRhKCdsZWZ0JykgPCBzdG9yZS5kaWZmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1cyA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHogPSB6LTEgPT0gLTEgPyBkcmFnZ2luZy5pdGVtcy5sZW5ndGgtMTp6LTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkcmFnZ2luZy51cGRhdGVGb2N1cyhmb2N1cyE9PWZhbHNlID8gZm9jdXM6c3RvcmUuX2ZvY3VzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZHJhZ2dpbmcgPSBkZWxheUlkbGUgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBVSS5zbGlkZXI7XG59KTtcbiJdfQ==