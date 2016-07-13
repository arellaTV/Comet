"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
 * Based on Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-nestable", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var hasTouch = 'ontouchstart' in window,
        html = UI.$html,
        touchedlists = [],
        $win = UI.$win,
        draggingElement;

    var eStart = hasTouch ? 'touchstart' : 'mousedown',
        eMove = hasTouch ? 'touchmove' : 'mousemove',
        eEnd = hasTouch ? 'touchend' : 'mouseup',
        eCancel = hasTouch ? 'touchcancel' : 'mouseup';

    UI.component('nestable', {

        defaults: {
            listBaseClass: 'uk-nestable',
            listClass: 'uk-nestable-list',
            listItemClass: 'uk-nestable-item',
            dragClass: 'uk-nestable-dragged',
            movingClass: 'uk-nestable-moving',
            noChildrenClass: 'uk-nestable-nochildren',
            emptyClass: 'uk-nestable-empty',
            handleClass: '',
            collapsedClass: 'uk-collapsed',
            placeholderClass: 'uk-nestable-placeholder',
            noDragClass: 'uk-nestable-nodrag',
            group: false,
            maxDepth: 10,
            threshold: 20,
            idlethreshold: 10
        },

        boot: function boot() {

            // adjust document scrolling
            UI.$html.on('mousemove touchmove', function (e) {

                if (draggingElement) {

                    var top = draggingElement.offset().top;

                    if (top < UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() - Math.ceil(draggingElement.height() / 2));
                    } else if (top + draggingElement.height() > window.innerHeight + UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() + Math.ceil(draggingElement.height() / 2));
                    }
                }
            });

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-nestable]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("nestable")) {
                        UI.nestable(ele, UI.Utils.options(ele.attr("data-uk-nestable")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            Object.keys(this.options).forEach(function (key) {

                if (String(key).indexOf('Class') != -1) {
                    $this.options['_' + key] = '.' + $this.options[key];
                }
            });

            this.find(this.options._listItemClass).find(">ul").addClass(this.options.listClass);

            this.checkEmptyList();

            this.reset();
            this.element.data('nestable-group', this.options.group || UI.Utils.uid('nestable-group'));

            this.find(this.options._listItemClass).each(function () {
                $this.setParent(UI.$(this));
            });

            this.on('click', '[data-nestable-action]', function (e) {

                if ($this.dragEl || !hasTouch && e.button !== 0) {
                    return;
                }

                e.preventDefault();

                var target = UI.$(e.currentTarget),
                    action = target.data('nestableAction'),
                    item = target.closest($this.options._listItemClass);

                if (action === 'collapse') {
                    $this.collapseItem(item);
                }
                if (action === 'expand') {
                    $this.expandItem(item);
                }
                if (action === 'toggle') {
                    $this.toggleItem(item);
                }
            });

            var onStartEvent = function onStartEvent(e) {

                var handle = UI.$(e.target),
                    link = handle.is('a[href]') ? handle : handle.parents('a[href]');

                if (e.target === $this.element[0]) {
                    return;
                }

                if (handle.is($this.options._noDragClass) || handle.closest($this.options._noDragClass).length) {
                    return;
                }

                if (handle.is('[data-nestable-action]') || handle.closest('[data-nestable-action]').length) {
                    return;
                }

                if ($this.options.handleClass && !handle.hasClass($this.options.handleClass)) {

                    if ($this.options.handleClass) {
                        handle = handle.closest($this.options._handleClass);
                    }
                }

                if (!handle.length || $this.dragEl || !hasTouch && e.button !== 0 || hasTouch && e.touches.length !== 1) {
                    return;
                }

                if (e.originalEvent && e.originalEvent.touches) {
                    e = evt.originalEvent.touches[0];
                }

                $this.delayMove = function (evt) {

                    link = false;

                    evt.preventDefault();
                    $this.dragStart(e);
                    $this.trigger('start.uk.nestable', [$this]);

                    $this.delayMove = false;
                };

                $this.delayMove.x = parseInt(e.pageX, 10);
                $this.delayMove.y = parseInt(e.pageY, 10);
                $this.delayMove.threshold = $this.options.idlethreshold;

                if (link.length && eEnd == 'touchend') {

                    $this.one(eEnd, function () {
                        if (link && link.attr('href').trim()) {
                            location.href = link.attr('href');
                        }
                    });
                }

                e.preventDefault();
            };

            var onMoveEvent = function onMoveEvent(e) {

                if (e.originalEvent && e.originalEvent.touches) {
                    e = e.originalEvent.touches[0];
                }

                if ($this.delayMove && (Math.abs(e.pageX - $this.delayMove.x) > $this.delayMove.threshold || Math.abs(e.pageY - $this.delayMove.y) > $this.delayMove.threshold)) {

                    if (!window.getSelection().toString()) {
                        $this.delayMove(e);
                    } else {
                        $this.delayMove = false;
                    }
                }

                if ($this.dragEl) {
                    e.preventDefault();
                    $this.dragMove(e);
                    $this.trigger('move.uk.nestable', [$this]);
                }
            };

            var onEndEvent = function onEndEvent(e) {

                if ($this.dragEl) {
                    e.preventDefault();
                    $this.dragStop(hasTouch ? e.touches[0] : e);
                }

                draggingElement = false;
                $this.delayMove = false;
            };

            if (hasTouch) {
                this.element[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } else {
                this.on(eStart, onStartEvent);
                $win.on(eMove, onMoveEvent);
                $win.on(eEnd, onEndEvent);
            }
        },

        serialize: function serialize() {

            var data,
                depth = 0,
                list = this,
                step = function step(level, depth) {

                var array = [],
                    items = level.children(list.options._listItemClass);

                items.each(function () {

                    var li = UI.$(this),
                        item = {},
                        attribute,
                        sub = li.children(list.options._listClass);

                    for (var i = 0, attr, val; i < li[0].attributes.length; i++) {
                        attribute = li[0].attributes[i];
                        if (attribute.name.indexOf('data-') === 0) {
                            attr = attribute.name.substr(5);
                            val = UI.Utils.str2json(attribute.value);
                            item[attr] = val || attribute.value == 'false' || attribute.value == '0' ? val : attribute.value;
                        }
                    }

                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }

                    array.push(item);
                });
                return array;
            };

            data = step(list.element, depth);

            return data;
        },

        list: function list(options) {

            var data = [],
                list = this,
                depth = 0,
                step = function step(level, depth, parent) {

                var items = level.children(options._listItemClass);

                items.each(function (index) {
                    var li = UI.$(this),
                        item = UI.$.extend({ parent_id: parent ? parent : null, depth: depth, order: index }, li.data()),
                        sub = li.children(options._listClass);

                    data.push(item);

                    if (sub.length) {
                        step(sub, depth + 1, li.data(options.idProperty || 'id'));
                    }
                });
            };

            options = UI.$.extend({}, list.options, options);

            step(list.element, depth);

            return data;
        },

        reset: function reset() {

            this.mouse = {
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0,
                lastX: 0,
                lastY: 0,
                nowX: 0,
                nowY: 0,
                distX: 0,
                distY: 0,
                dirAx: 0,
                dirX: 0,
                dirY: 0,
                lastDirX: 0,
                lastDirY: 0,
                distAxX: 0,
                distAxY: 0
            };
            this.moving = false;
            this.dragEl = null;
            this.dragRootEl = null;
            this.dragDepth = 0;
            this.hasNewRoot = false;
            this.pointEl = null;

            for (var i = 0; i < touchedlists.length; i++) {
                this.checkEmptyList(touchedlists[i]);
            }

            touchedlists = [];
        },

        toggleItem: function toggleItem(li) {
            this[li.hasClass(this.options.collapsedClass) ? "expandItem" : "collapseItem"](li);
        },

        expandItem: function expandItem(li) {
            li.removeClass(this.options.collapsedClass);
        },

        collapseItem: function collapseItem(li) {
            var lists = li.children(this.options._listClass);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
            }
        },

        expandAll: function expandAll() {
            var list = this;
            this.find(list.options._listItemClass).each(function () {
                list.expandItem(UI.$(this));
            });
        },

        collapseAll: function collapseAll() {
            var list = this;
            this.find(list.options._listItemClass).each(function () {
                list.collapseItem(UI.$(this));
            });
        },

        setParent: function setParent(li) {

            if (li.children(this.options._listClass).length) {
                li.addClass("uk-parent");
            }
        },

        unsetParent: function unsetParent(li) {
            li.removeClass('uk-parent ' + this.options.collapsedClass);
            li.children(this.options._listClass).remove();
        },

        dragStart: function dragStart(e) {

            var mouse = this.mouse,
                target = UI.$(e.target),
                dragItem = target.closest(this.options._listItemClass),
                offset = dragItem.offset();

            this.placeEl = dragItem;

            mouse.offsetX = e.pageX - offset.left;
            mouse.offsetY = e.pageY - offset.top;

            mouse.startX = mouse.lastX = offset.left;
            mouse.startY = mouse.lastY = offset.top;

            this.dragRootEl = this.element;

            this.dragEl = UI.$('<ul></ul>').addClass(this.options.listClass + ' ' + this.options.dragClass).append(dragItem.clone());
            this.dragEl.css('width', dragItem.width());
            this.placeEl.addClass(this.options.placeholderClass);

            draggingElement = this.dragEl;

            this.tmpDragOnSiblings = [dragItem[0].previousSibling, dragItem[0].nextSibling];

            UI.$body.append(this.dragEl);

            this.dragEl.css({
                left: offset.left,
                top: offset.top
            });

            // total depth of dragging item
            var i,
                depth,
                items = this.dragEl.find(this.options._listItemClass);

            for (i = 0; i < items.length; i++) {
                depth = UI.$(items[i]).parents(this.options._listClass + ',' + this.options._listBaseClass).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }

            html.addClass(this.options.movingClass);
        },

        dragStop: function dragStop(e) {

            var el = UI.$(this.placeEl),
                root = this.placeEl.parents(this.options._listBaseClass + ':first');

            this.placeEl.removeClass(this.options.placeholderClass);
            this.dragEl.remove();

            if (this.element[0] !== root[0]) {

                root.trigger('change.uk.nestable', [root.data('nestable'), el, 'added']);
                this.element.trigger('change.uk.nestable', [this, el, 'removed']);
            } else {
                this.element.trigger('change.uk.nestable', [this, el, "moved"]);
            }

            this.trigger('stop.uk.nestable', [this, el]);

            this.reset();

            html.removeClass(this.options.movingClass);
        },

        dragMove: function dragMove(e) {
            var list,
                parent,
                prev,
                next,
                depth,
                opt = this.options,
                mouse = this.mouse,
                maxDepth = this.dragRootEl ? this.dragRootEl.data('nestable').options.maxDepth : opt.maxDepth;

            this.dragEl.css({
                left: e.pageX - mouse.offsetX,
                top: e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX = e.pageX;
            mouse.nowY = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev('li');

                // increase horizontal level if previous sibling exists, is not collapsed, and does not have a 'no children' class
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass) && !prev.hasClass(opt.noChildrenClass)) {

                    // cannot increase level when item above is collapsed
                    list = prev.find(opt._listClass).last();

                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt._listClass + ',' + opt._listBaseClass).length;

                    if (depth + this.dragDepth <= maxDepth) {

                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = UI.$('<ul/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt._listClass).last();
                            list.append(this.placeEl);
                        }
                    }
                }

                // decrease horizontal level
                if (mouse.distX < 0) {

                    // we cannot decrease the level if an item precedes the current one
                    next = this.placeEl.next(opt._listItemClass);
                    if (!next.length) {

                        // get parent ul of the list item
                        var parentUl = this.placeEl.closest([opt._listBaseClass, opt._listClass].join(','));
                        // try to get the li surrounding the ul
                        var surroundingLi = parentUl.closest(opt._listItemClass);

                        // if the ul is inside of a li (meaning it is nested)
                        if (surroundingLi.length) {
                            // we can decrease the horizontal level
                            surroundingLi.after(this.placeEl);
                            // if the previous parent ul is now empty
                            if (!parentUl.children().length) {
                                this.unsetParent(surroundingLi);
                            }
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            var pointX = e.pageX - (window.pageXOffset || document.scrollLeft || 0),
                pointY = e.pageY - (window.pageYOffset || document.documentElement.scrollTop);
            this.pointEl = UI.$(document.elementFromPoint(pointX, pointY));

            if (opt.handleClass && this.pointEl.hasClass(opt.handleClass)) {

                this.pointEl = this.pointEl.closest(opt._listItemClass);
            } else {

                var nestableitem = this.pointEl.closest(opt._listItemClass);

                if (nestableitem.length) {
                    this.pointEl = nestableitem;
                }
            }

            if (this.placeEl.find(this.pointEl).length) {
                return;
            }

            if (this.pointEl.data('nestable') && !this.pointEl.children().length) {
                isEmpty = true;
                this.checkEmptyList(this.pointEl);
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.listItemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.element,
                tmpRoot = this.pointEl.closest(this.options._listBaseClass),
                isNewRoot = pointElRoot[0] != tmpRoot[0];

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {

                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== tmpRoot.data('nestable-group')) {
                    return;
                } else {
                    touchedlists.push(pointElRoot);
                }

                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt._listClass + ',' + opt._listBaseClass).length;

                if (depth > maxDepth) {
                    return;
                }

                var before = e.pageY < this.pointEl.offset().top + this.pointEl.height() / 2;

                parent = this.placeEl.parent();

                if (isEmpty) {
                    this.pointEl.append(this.placeEl);
                } else if (before) {
                    this.pointEl.before(this.placeEl);
                } else {
                    this.pointEl.after(this.placeEl);
                }

                if (!parent.children().length) {
                    if (!parent.data("nestable")) this.unsetParent(parent.parent());
                }

                this.checkEmptyList(this.dragRootEl);
                this.checkEmptyList(pointElRoot);

                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = tmpRoot;
                    this.hasNewRoot = this.element[0] !== this.dragRootEl[0];
                }
            }
        },

        checkEmptyList: function checkEmptyList(list) {

            list = list ? UI.$(list) : this.element;

            if (this.options.emptyClass) {
                list[!list.children().length ? 'addClass' : 'removeClass'](this.options.emptyClass);
            }
        }

    });

    return UI.nestable;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL25lc3RhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLENBQUMsVUFBUyxLQUFULEVBQWdCOztBQUViLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLGdCQUFQLEVBQXlCLENBQUMsT0FBRCxDQUF6QixFQUFvQyxZQUFVO0FBQzFDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFhOztBQUVaOztBQUVBLFFBQUksV0FBZSxrQkFBa0IsTUFBckM7QUFBQSxRQUNJLE9BQWUsR0FBRyxLQUR0QjtBQUFBLFFBRUksZUFBZSxFQUZuQjtBQUFBLFFBR0ksT0FBZSxHQUFHLElBSHRCO0FBQUEsUUFJSSxlQUpKOztBQU1BLFFBQUksU0FBVSxXQUFXLFlBQVgsR0FBMkIsV0FBekM7QUFBQSxRQUNJLFFBQVUsV0FBVyxXQUFYLEdBQTJCLFdBRHpDO0FBQUEsUUFFSSxPQUFVLFdBQVcsVUFBWCxHQUEyQixTQUZ6QztBQUFBLFFBR0ksVUFBVSxXQUFXLGFBQVgsR0FBMkIsU0FIekM7O0FBTUEsT0FBRyxTQUFILENBQWEsVUFBYixFQUF5Qjs7QUFFckIsa0JBQVU7QUFDTiwyQkFBa0IsYUFEWjtBQUVOLHVCQUFrQixrQkFGWjtBQUdOLDJCQUFrQixrQkFIWjtBQUlOLHVCQUFrQixxQkFKWjtBQUtOLHlCQUFrQixvQkFMWjtBQU1OLDZCQUFrQix3QkFOWjtBQU9OLHdCQUFrQixtQkFQWjtBQVFOLHlCQUFrQixFQVJaO0FBU04sNEJBQWtCLGNBVFo7QUFVTiw4QkFBa0IseUJBVlo7QUFXTix5QkFBa0Isb0JB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QUksS0FBSyxPQUFMLENBQWEsVUFBakIsRUFBNkI7QUFDekIscUJBQUssQ0FBQyxLQUFLLFFBQUwsR0FBZ0IsTUFBakIsR0FBMEIsVUFBMUIsR0FBcUMsYUFBMUMsRUFBeUQsS0FBSyxPQUFMLENBQWEsVUFBdEU7QUFDSDtBQUNKOztBQXJtQm9CLEtBQXpCOztBQXltQkEsV0FBTyxHQUFHLFFBQVY7QUFDSCxDQXhvQkQiLCJmaWxlIjoibmVzdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4vKlxuICogQmFzZWQgb24gTmVzdGFibGUgalF1ZXJ5IFBsdWdpbiAtIENvcHlyaWdodCAoYykgMjAxMiBEYXZpZCBCdXNoZWxsIC0gaHR0cDovL2RidXNoZWxsLmNvbS9cbiAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtbmVzdGFibGVcIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgaGFzVG91Y2ggICAgID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93LFxuICAgICAgICBodG1sICAgICAgICAgPSBVSS4kaHRtbCxcbiAgICAgICAgdG91Y2hlZGxpc3RzID0gW10sXG4gICAgICAgICR3aW4gICAgICAgICA9IFVJLiR3aW4sXG4gICAgICAgIGRyYWdnaW5nRWxlbWVudDtcblxuICAgIHZhciBlU3RhcnQgID0gaGFzVG91Y2ggPyAndG91Y2hzdGFydCcgIDogJ21vdXNlZG93bicsXG4gICAgICAgIGVNb3ZlICAgPSBoYXNUb3VjaCA/ICd0b3VjaG1vdmUnICAgOiAnbW91c2Vtb3ZlJyxcbiAgICAgICAgZUVuZCAgICA9IGhhc1RvdWNoID8gJ3RvdWNoZW5kJyAgICA6ICdtb3VzZXVwJyxcbiAgICAgICAgZUNhbmNlbCA9IGhhc1RvdWNoID8gJ3RvdWNoY2FuY2VsJyA6ICdtb3VzZXVwJztcblxuXG4gICAgVUkuY29tcG9uZW50KCduZXN0YWJsZScsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgbGlzdEJhc2VDbGFzcyAgIDogJ3VrLW5lc3RhYmxlJyxcbiAgICAgICAgICAgIGxpc3RDbGFzcyAgICAgICA6ICd1ay1uZXN0YWJsZS1saXN0JyxcbiAgICAgICAgICAgIGxpc3RJdGVtQ2xhc3MgICA6ICd1ay1uZXN0YWJsZS1pdGVtJyxcbiAgICAgICAgICAgIGRyYWdDbGFzcyAgICAgICA6ICd1ay1uZXN0YWJsZS1kcmFnZ2VkJyxcbiAgICAgICAgICAgIG1vdmluZ0NsYXNzICAgICA6ICd1ay1uZXN0YWJsZS1tb3ZpbmcnLFxuICAgICAgICAgICAgbm9DaGlsZHJlbkNsYXNzIDogJ3VrLW5lc3RhYmxlLW5vY2hpbGRyZW4nLFxuICAgICAgICAgICAgZW1wdHlDbGFzcyAgICAgIDogJ3VrLW5lc3RhYmxlLWVtcHR5JyxcbiAgICAgICAgICAgIGhhbmRsZUNsYXNzICAgICA6ICcnLFxuICAgICAgICAgICAgY29sbGFwc2VkQ2xhc3MgIDogJ3VrLWNvbGxhcHNlZCcsXG4gICAgICAgICAgICBwbGFjZWhvbGRlckNsYXNzOiAndWstbmVzdGFibGUtcGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgbm9EcmFnQ2xhc3MgICAgIDogJ3VrLW5lc3RhYmxlLW5vZHJhZycsXG4gICAgICAgICAgICBncm91cCAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIG1heERlcHRoICAgICAgICA6IDEwLFxuICAgICAgICAgICAgdGhyZXNob2xkICAgICAgIDogMjAsXG4gICAgICAgICAgICBpZGxldGhyZXNob2xkICAgOiAxMCxcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gYWRqdXN0IGRvY3VtZW50IHNjcm9sbGluZ1xuICAgICAgICAgICAgVUkuJGh0bWwub24oJ21vdXNlbW92ZSB0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdFbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCA9IGRyYWdnaW5nRWxlbWVudC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcCA8IFVJLiR3aW4uc2Nyb2xsVG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLiR3aW4uc2Nyb2xsVG9wKFVJLiR3aW4uc2Nyb2xsVG9wKCkgLSBNYXRoLmNlaWwoZHJhZ2dpbmdFbGVtZW50LmhlaWdodCgpLzIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKHRvcCArIGRyYWdnaW5nRWxlbWVudC5oZWlnaHQoKSkgPiAod2luZG93LmlubmVySGVpZ2h0ICsgVUkuJHdpbi5zY3JvbGxUb3AoKSkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS4kd2luLnNjcm9sbFRvcChVSS4kd2luLnNjcm9sbFRvcCgpICsgTWF0aC5jZWlsKGRyYWdnaW5nRWxlbWVudC5oZWlnaHQoKS8yKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstbmVzdGFibGVdXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwibmVzdGFibGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLm5lc3RhYmxlKGVsZSwgVUkuVXRpbHMub3B0aW9ucyhlbGUuYXR0cihcImRhdGEtdWstbmVzdGFibGVcIikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXG4gICAgICAgICAgICAgICAgaWYoU3RyaW5nKGtleSkuaW5kZXhPZignQ2xhc3MnKSE9LTEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub3B0aW9uc1snXycra2V5XSA9ICcuJyArICR0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5maW5kKHRoaXMub3B0aW9ucy5fbGlzdEl0ZW1DbGFzcykuZmluZChcIj51bFwiKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGlzdENsYXNzKTtcblxuICAgICAgICAgICAgdGhpcy5jaGVja0VtcHR5TGlzdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YSgnbmVzdGFibGUtZ3JvdXAnLCB0aGlzLm9wdGlvbnMuZ3JvdXAgfHwgVUkuVXRpbHMudWlkKCduZXN0YWJsZS1ncm91cCcpKTtcblxuICAgICAgICAgICAgdGhpcy5maW5kKHRoaXMub3B0aW9ucy5fbGlzdEl0ZW1DbGFzcykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5zZXRQYXJlbnQoVUkuJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vbignY2xpY2snLCAnW2RhdGEtbmVzdGFibGUtYWN0aW9uXScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5kcmFnRWwgfHwgKCFoYXNUb3VjaCAmJiBlLmJ1dHRvbiAhPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBVSS4kKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRhcmdldC5kYXRhKCduZXN0YWJsZUFjdGlvbicpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtICAgPSB0YXJnZXQuY2xvc2VzdCgkdGhpcy5vcHRpb25zLl9saXN0SXRlbUNsYXNzKTtcblxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuY29sbGFwc2VJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZXhwYW5kJykge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5leHBhbmRJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAndG9nZ2xlJykge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy50b2dnbGVJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb25TdGFydEV2ZW50ID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9IFVJLiQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICBsaW5rICAgPSBoYW5kbGUuaXMoJ2FbaHJlZl0nKSA/IGhhbmRsZTpoYW5kbGUucGFyZW50cygnYVtocmVmXScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSAkdGhpcy5lbGVtZW50WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlLmlzKCR0aGlzLm9wdGlvbnMuX25vRHJhZ0NsYXNzKSB8fCBoYW5kbGUuY2xvc2VzdCgkdGhpcy5vcHRpb25zLl9ub0RyYWdDbGFzcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlLmlzKCdbZGF0YS1uZXN0YWJsZS1hY3Rpb25dJykgfHwgaGFuZGxlLmNsb3Nlc3QoJ1tkYXRhLW5lc3RhYmxlLWFjdGlvbl0nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5vcHRpb25zLmhhbmRsZUNsYXNzICYmICFoYW5kbGUuaGFzQ2xhc3MoJHRoaXMub3B0aW9ucy5oYW5kbGVDbGFzcykpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMub3B0aW9ucy5oYW5kbGVDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlID0gaGFuZGxlLmNsb3Nlc3QoJHRoaXMub3B0aW9ucy5faGFuZGxlQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFoYW5kbGUubGVuZ3RoIHx8ICR0aGlzLmRyYWdFbCB8fCAoIWhhc1RvdWNoICYmIGUuYnV0dG9uICE9PSAwKSB8fCAoaGFzVG91Y2ggJiYgZS50b3VjaGVzLmxlbmd0aCAhPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGV2dC5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRoaXMuZGVsYXlNb3ZlID0gZnVuY3Rpb24oZXZ0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGluayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcmFnU3RhcnQoZSk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3N0YXJ0LnVrLm5lc3RhYmxlJywgWyR0aGlzXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZGVsYXlNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmRlbGF5TW92ZS54ICAgICAgICAgPSBwYXJzZUludChlLnBhZ2VYLCAxMCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZGVsYXlNb3ZlLnkgICAgICAgICA9IHBhcnNlSW50KGUucGFnZVksIDEwKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5kZWxheU1vdmUudGhyZXNob2xkID0gJHRoaXMub3B0aW9ucy5pZGxldGhyZXNob2xkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmsubGVuZ3RoICYmIGVFbmQgPT0gJ3RvdWNoZW5kJykge1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm9uZShlRW5kLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmsgJiYgbGluay5hdHRyKCdocmVmJykudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IGxpbmsuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb25Nb3ZlRXZlbnQgPSBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC50b3VjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuZGVsYXlNb3ZlICYmIChNYXRoLmFicyhlLnBhZ2VYIC0gJHRoaXMuZGVsYXlNb3ZlLngpID4gJHRoaXMuZGVsYXlNb3ZlLnRocmVzaG9sZCB8fCBNYXRoLmFicyhlLnBhZ2VZIC0gJHRoaXMuZGVsYXlNb3ZlLnkpID4gJHRoaXMuZGVsYXlNb3ZlLnRocmVzaG9sZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5kZWxheU1vdmUoZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5kZWxheU1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5kcmFnRWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcmFnTW92ZShlKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignbW92ZS51ay5uZXN0YWJsZScsIFskdGhpc10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBvbkVuZEV2ZW50ID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmRyYWdTdG9wKGhhc1RvdWNoID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHRoaXMuZGVsYXlNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoaGFzVG91Y2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcihlU3RhcnQsIG9uU3RhcnRFdmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGVNb3ZlLCBvbk1vdmVFdmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGVFbmQsIG9uRW5kRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihlQ2FuY2VsLCBvbkVuZEV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub24oZVN0YXJ0LCBvblN0YXJ0RXZlbnQpO1xuICAgICAgICAgICAgICAgICR3aW4ub24oZU1vdmUsIG9uTW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICAkd2luLm9uKGVFbmQsIG9uRW5kRXZlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGRhdGEsXG4gICAgICAgICAgICAgICAgZGVwdGggPSAwLFxuICAgICAgICAgICAgICAgIGxpc3QgID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzdGVwICA9IGZ1bmN0aW9uKGxldmVsLCBkZXB0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IFsgXSwgaXRlbXMgPSBsZXZlbC5jaGlsZHJlbihsaXN0Lm9wdGlvbnMuX2xpc3RJdGVtQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaSAgICA9IFVJLiQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSAgPSB7fSwgYXR0cmlidXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YiAgID0gbGkuY2hpbGRyZW4obGlzdC5vcHRpb25zLl9saXN0Q2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgYXR0ciwgdmFsOyBpIDwgbGlbMF0uYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGxpWzBdLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5uYW1lLmluZGV4T2YoJ2RhdGEtJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciAgICAgICA9IGF0dHJpYnV0ZS5uYW1lLnN1YnN0cig1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsICAgICAgICA9ICBVSS5VdGlscy5zdHIyanNvbihhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtW2F0dHJdID0gKHZhbCB8fCBhdHRyaWJ1dGUudmFsdWU9PSdmYWxzZScgfHwgYXR0cmlidXRlLnZhbHVlPT0nMCcpID8gdmFsOmF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGlsZHJlbiA9IHN0ZXAoc3ViLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGF0YSA9IHN0ZXAobGlzdC5lbGVtZW50LCBkZXB0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3Q6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgdmFyIGRhdGEgID0gW10sXG4gICAgICAgICAgICAgICAgbGlzdCAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRlcHRoID0gMCxcbiAgICAgICAgICAgICAgICBzdGVwICA9IGZ1bmN0aW9uKGxldmVsLCBkZXB0aCwgcGFyZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gbGV2ZWwuY2hpbGRyZW4ob3B0aW9ucy5fbGlzdEl0ZW1DbGFzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpICAgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBVSS4kLmV4dGVuZCh7cGFyZW50X2lkOiAocGFyZW50ID8gcGFyZW50IDogbnVsbCksIGRlcHRoOiBkZXB0aCwgb3JkZXI6IGluZGV4fSwgbGkuZGF0YSgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWIgID0gbGkuY2hpbGRyZW4ob3B0aW9ucy5fbGlzdENsYXNzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAoc3ViLCBkZXB0aCArIDEsIGxpLmRhdGEob3B0aW9ucy5pZFByb3BlcnR5IHx8ICdpZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgb3B0aW9ucyA9IFVJLiQuZXh0ZW5kKHt9LCBsaXN0Lm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBzdGVwKGxpc3QuZWxlbWVudCwgZGVwdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMubW91c2UgPSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0WCAgIDogMCxcbiAgICAgICAgICAgICAgICBvZmZzZXRZICAgOiAwLFxuICAgICAgICAgICAgICAgIHN0YXJ0WCAgICA6IDAsXG4gICAgICAgICAgICAgICAgc3RhcnRZICAgIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0WCAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGxhc3RZICAgICA6IDAsXG4gICAgICAgICAgICAgICAgbm93WCAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBub3dZICAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpc3RYICAgICA6IDAsXG4gICAgICAgICAgICAgICAgZGlzdFkgICAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXJBeCAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpclggICAgICA6IDAsXG4gICAgICAgICAgICAgICAgZGlyWSAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0RGlyWCAgOiAwLFxuICAgICAgICAgICAgICAgIGxhc3REaXJZICA6IDAsXG4gICAgICAgICAgICAgICAgZGlzdEF4WCAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXN0QXhZICAgOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgICAgID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbCAgICAgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcmFnUm9vdEVsID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0RlcHRoICA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc05ld1Jvb3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRFbCAgICA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0b3VjaGVkbGlzdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRW1wdHlMaXN0KHRvdWNoZWRsaXN0c1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRvdWNoZWRsaXN0cyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZUl0ZW06IGZ1bmN0aW9uKGxpKSB7XG4gICAgICAgICAgICB0aGlzW2xpLmhhc0NsYXNzKHRoaXMub3B0aW9ucy5jb2xsYXBzZWRDbGFzcykgPyBcImV4cGFuZEl0ZW1cIjpcImNvbGxhcHNlSXRlbVwiXShsaSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhwYW5kSXRlbTogZnVuY3Rpb24obGkpIHtcbiAgICAgICAgICAgIGxpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb2xsYXBzZWRDbGFzcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbihsaSkge1xuICAgICAgICAgICAgdmFyIGxpc3RzID0gbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLl9saXN0Q2xhc3MpO1xuICAgICAgICAgICAgaWYgKGxpc3RzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jb2xsYXBzZWRDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhwYW5kQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZmluZChsaXN0Lm9wdGlvbnMuX2xpc3RJdGVtQ2xhc3MpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5leHBhbmRJdGVtKFVJLiQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5maW5kKGxpc3Qub3B0aW9ucy5fbGlzdEl0ZW1DbGFzcykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmNvbGxhcHNlSXRlbShVSS4kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFBhcmVudDogZnVuY3Rpb24obGkpIHtcblxuICAgICAgICAgICAgaWYgKGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5fbGlzdENsYXNzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaS5hZGRDbGFzcyhcInVrLXBhcmVudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1bnNldFBhcmVudDogZnVuY3Rpb24obGkpIHtcbiAgICAgICAgICAgIGxpLnJlbW92ZUNsYXNzKCd1ay1wYXJlbnQgJyt0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLl9saXN0Q2xhc3MpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWdTdGFydDogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICB2YXIgbW91c2UgICAgPSB0aGlzLm1vdXNlLFxuICAgICAgICAgICAgICAgIHRhcmdldCAgID0gVUkuJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSB0YXJnZXQuY2xvc2VzdCh0aGlzLm9wdGlvbnMuX2xpc3RJdGVtQ2xhc3MpLFxuICAgICAgICAgICAgICAgIG9mZnNldCAgID0gZHJhZ0l0ZW0ub2Zmc2V0KCk7XG5cbiAgICAgICAgICAgIHRoaXMucGxhY2VFbCA9IGRyYWdJdGVtO1xuXG4gICAgICAgICAgICBtb3VzZS5vZmZzZXRYID0gZS5wYWdlWCAtIG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgbW91c2Uub2Zmc2V0WSA9IGUucGFnZVkgLSBvZmZzZXQudG9wO1xuXG4gICAgICAgICAgICBtb3VzZS5zdGFydFggPSBtb3VzZS5sYXN0WCA9IG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgbW91c2Uuc3RhcnRZID0gbW91c2UubGFzdFkgPSBvZmZzZXQudG9wO1xuXG4gICAgICAgICAgICB0aGlzLmRyYWdSb290RWwgPSB0aGlzLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0VsID0gVUkuJCgnPHVsPjwvdWw+JykuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmxpc3RDbGFzcyArICcgJyArIHRoaXMub3B0aW9ucy5kcmFnQ2xhc3MpLmFwcGVuZChkcmFnSXRlbS5jbG9uZSgpKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VsLmNzcygnd2lkdGgnLCBkcmFnSXRlbS53aWR0aCgpKTtcbiAgICAgICAgICAgIHRoaXMucGxhY2VFbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJDbGFzcyk7XG5cbiAgICAgICAgICAgIGRyYWdnaW5nRWxlbWVudCA9IHRoaXMuZHJhZ0VsO1xuXG4gICAgICAgICAgICB0aGlzLnRtcERyYWdPblNpYmxpbmdzID0gW2RyYWdJdGVtWzBdLnByZXZpb3VzU2libGluZywgZHJhZ0l0ZW1bMF0ubmV4dFNpYmxpbmddO1xuXG4gICAgICAgICAgICBVSS4kYm9keS5hcHBlbmQodGhpcy5kcmFnRWwpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYWdFbC5jc3Moe1xuICAgICAgICAgICAgICAgIGxlZnQgOiBvZmZzZXQubGVmdCxcbiAgICAgICAgICAgICAgICB0b3AgIDogb2Zmc2V0LnRvcFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHRvdGFsIGRlcHRoIG9mIGRyYWdnaW5nIGl0ZW1cbiAgICAgICAgICAgIHZhciBpLCBkZXB0aCwgaXRlbXMgPSB0aGlzLmRyYWdFbC5maW5kKHRoaXMub3B0aW9ucy5fbGlzdEl0ZW1DbGFzcyk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRlcHRoID0gVUkuJChpdGVtc1tpXSkucGFyZW50cyh0aGlzLm9wdGlvbnMuX2xpc3RDbGFzcysnLCcrdGhpcy5vcHRpb25zLl9saXN0QmFzZUNsYXNzKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGRlcHRoID4gdGhpcy5kcmFnRGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnRGVwdGggPSBkZXB0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLm1vdmluZ0NsYXNzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnU3RvcDogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICB2YXIgZWwgICAgICAgPSBVSS4kKHRoaXMucGxhY2VFbCksXG4gICAgICAgICAgICAgICAgcm9vdCAgICAgPSB0aGlzLnBsYWNlRWwucGFyZW50cyh0aGlzLm9wdGlvbnMuX2xpc3RCYXNlQ2xhc3MrJzpmaXJzdCcpO1xuXG4gICAgICAgICAgICB0aGlzLnBsYWNlRWwucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyQ2xhc3MpO1xuICAgICAgICAgICAgdGhpcy5kcmFnRWwucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnRbMF0gIT09IHJvb3RbMF0pIHtcblxuICAgICAgICAgICAgICAgIHJvb3QudHJpZ2dlcignY2hhbmdlLnVrLm5lc3RhYmxlJyxbcm9vdC5kYXRhKCduZXN0YWJsZScpLCBlbCwgJ2FkZGVkJ10pO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UudWsubmVzdGFibGUnLCBbdGhpcywgZWwsICdyZW1vdmVkJ10pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UudWsubmVzdGFibGUnLFt0aGlzLCBlbCwgXCJtb3ZlZFwiXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignc3RvcC51ay5uZXN0YWJsZScsIFt0aGlzLCBlbF0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLm1vdmluZ0NsYXNzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnTW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGxpc3QsIHBhcmVudCwgcHJldiwgbmV4dCwgZGVwdGgsXG4gICAgICAgICAgICAgICAgb3B0ICAgICAgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgbW91c2UgICAgPSB0aGlzLm1vdXNlLFxuICAgICAgICAgICAgICAgIG1heERlcHRoID0gdGhpcy5kcmFnUm9vdEVsID8gdGhpcy5kcmFnUm9vdEVsLmRhdGEoJ25lc3RhYmxlJykub3B0aW9ucy5tYXhEZXB0aCA6IG9wdC5tYXhEZXB0aDtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRWwuY3NzKHtcbiAgICAgICAgICAgICAgICBsZWZ0IDogZS5wYWdlWCAtIG1vdXNlLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgdG9wICA6IGUucGFnZVkgLSBtb3VzZS5vZmZzZXRZXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbW91c2UgcG9zaXRpb24gbGFzdCBldmVudHNcbiAgICAgICAgICAgIG1vdXNlLmxhc3RYID0gbW91c2Uubm93WDtcbiAgICAgICAgICAgIG1vdXNlLmxhc3RZID0gbW91c2Uubm93WTtcbiAgICAgICAgICAgIC8vIG1vdXNlIHBvc2l0aW9uIHRoaXMgZXZlbnRzXG4gICAgICAgICAgICBtb3VzZS5ub3dYICA9IGUucGFnZVg7XG4gICAgICAgICAgICBtb3VzZS5ub3dZICA9IGUucGFnZVk7XG4gICAgICAgICAgICAvLyBkaXN0YW5jZSBtb3VzZSBtb3ZlZCBiZXR3ZWVuIGV2ZW50c1xuICAgICAgICAgICAgbW91c2UuZGlzdFggPSBtb3VzZS5ub3dYIC0gbW91c2UubGFzdFg7XG4gICAgICAgICAgICBtb3VzZS5kaXN0WSA9IG1vdXNlLm5vd1kgLSBtb3VzZS5sYXN0WTtcbiAgICAgICAgICAgIC8vIGRpcmVjdGlvbiBtb3VzZSB3YXMgbW92aW5nXG4gICAgICAgICAgICBtb3VzZS5sYXN0RGlyWCA9IG1vdXNlLmRpclg7XG4gICAgICAgICAgICBtb3VzZS5sYXN0RGlyWSA9IG1vdXNlLmRpclk7XG4gICAgICAgICAgICAvLyBkaXJlY3Rpb24gbW91c2UgaXMgbm93IG1vdmluZyAob24gYm90aCBheGlzKVxuICAgICAgICAgICAgbW91c2UuZGlyWCA9IG1vdXNlLmRpc3RYID09PSAwID8gMCA6IG1vdXNlLmRpc3RYID4gMCA/IDEgOiAtMTtcbiAgICAgICAgICAgIG1vdXNlLmRpclkgPSBtb3VzZS5kaXN0WSA9PT0gMCA/IDAgOiBtb3VzZS5kaXN0WSA+IDAgPyAxIDogLTE7XG4gICAgICAgICAgICAvLyBheGlzIG1vdXNlIGlzIG5vdyBtb3Zpbmcgb25cbiAgICAgICAgICAgIHZhciBuZXdBeCAgID0gTWF0aC5hYnMobW91c2UuZGlzdFgpID4gTWF0aC5hYnMobW91c2UuZGlzdFkpID8gMSA6IDA7XG5cbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgb24gZmlyc3QgbW92ZVxuICAgICAgICAgICAgaWYgKCFtb3VzZS5tb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICBtb3VzZS5kaXJBeCAgPSBuZXdBeDtcbiAgICAgICAgICAgICAgICBtb3VzZS5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FsYyBkaXN0YW5jZSBtb3ZlZCBvbiB0aGlzIGF4aXMgKGFuZCBkaXJlY3Rpb24pXG4gICAgICAgICAgICBpZiAobW91c2UuZGlyQXggIT09IG5ld0F4KSB7XG4gICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WCA9IDA7XG4gICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFggKz0gTWF0aC5hYnMobW91c2UuZGlzdFgpO1xuICAgICAgICAgICAgICAgIGlmIChtb3VzZS5kaXJYICE9PSAwICYmIG1vdXNlLmRpclggIT09IG1vdXNlLmxhc3REaXJYKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhZICs9IE1hdGguYWJzKG1vdXNlLmRpc3RZKTtcbiAgICAgICAgICAgICAgICBpZiAobW91c2UuZGlyWSAhPT0gMCAmJiBtb3VzZS5kaXJZICE9PSBtb3VzZS5sYXN0RGlyWSkge1xuICAgICAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhZID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb3VzZS5kaXJBeCA9IG5ld0F4O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIG1vdmUgaG9yaXpvbnRhbFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAobW91c2UuZGlyQXggJiYgbW91c2UuZGlzdEF4WCA+PSBvcHQudGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgbW92ZSBkaXN0YW5jZSBvbiB4LWF4aXMgZm9yIG5ldyBwaGFzZVxuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFggPSAwO1xuICAgICAgICAgICAgICAgIHByZXYgPSB0aGlzLnBsYWNlRWwucHJldignbGknKTtcblxuICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIGhvcml6b250YWwgbGV2ZWwgaWYgcHJldmlvdXMgc2libGluZyBleGlzdHMsIGlzIG5vdCBjb2xsYXBzZWQsIGFuZCBkb2VzIG5vdCBoYXZlIGEgJ25vIGNoaWxkcmVuJyBjbGFzc1xuICAgICAgICAgICAgICAgIGlmIChtb3VzZS5kaXN0WCA+IDAgJiYgcHJldi5sZW5ndGggJiYgIXByZXYuaGFzQ2xhc3Mob3B0LmNvbGxhcHNlZENsYXNzKSAmJiAhcHJldi5oYXNDbGFzcyhvcHQubm9DaGlsZHJlbkNsYXNzKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbm5vdCBpbmNyZWFzZSBsZXZlbCB3aGVuIGl0ZW0gYWJvdmUgaXMgY29sbGFwc2VkXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBwcmV2LmZpbmQob3B0Ll9saXN0Q2xhc3MpLmxhc3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBkZXB0aCBsaW1pdCBoYXMgcmVhY2hlZFxuICAgICAgICAgICAgICAgICAgICBkZXB0aCA9IHRoaXMucGxhY2VFbC5wYXJlbnRzKG9wdC5fbGlzdENsYXNzKycsJytvcHQuX2xpc3RCYXNlQ2xhc3MpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVwdGggKyB0aGlzLmRyYWdEZXB0aCA8PSBtYXhEZXB0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbmV3IHN1Yi1sZXZlbCBpZiBvbmUgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBVSS4kKCc8dWwvPicpLmFkZENsYXNzKG9wdC5saXN0Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5hcHBlbmQobGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRQYXJlbnQocHJldik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgYXBwZW5kIHRvIG5leHQgbGV2ZWwgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gcHJldi5jaGlsZHJlbihvcHQuX2xpc3RDbGFzcykubGFzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkZWNyZWFzZSBob3Jpem9udGFsIGxldmVsXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLmRpc3RYIDwgMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBkZWNyZWFzZSB0aGUgbGV2ZWwgaWYgYW4gaXRlbSBwcmVjZWRlcyB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHRoaXMucGxhY2VFbC5uZXh0KG9wdC5fbGlzdEl0ZW1DbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHBhcmVudCB1bCBvZiB0aGUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50VWwgPSB0aGlzLnBsYWNlRWwuY2xvc2VzdChbb3B0Ll9saXN0QmFzZUNsYXNzLCBvcHQuX2xpc3RDbGFzc10uam9pbignLCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB0byBnZXQgdGhlIGxpIHN1cnJvdW5kaW5nIHRoZSB1bFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1cnJvdW5kaW5nTGkgPSBwYXJlbnRVbC5jbG9zZXN0KG9wdC5fbGlzdEl0ZW1DbGFzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB1bCBpcyBpbnNpZGUgb2YgYSBsaSAobWVhbmluZyBpdCBpcyBuZXN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Vycm91bmRpbmdMaS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gZGVjcmVhc2UgdGhlIGhvcml6b250YWwgbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXJyb3VuZGluZ0xpLmFmdGVyKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXZpb3VzIHBhcmVudCB1bCBpcyBub3cgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudFVsLmNoaWxkcmVuKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5zZXRQYXJlbnQoc3Vycm91bmRpbmdMaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXNFbXB0eSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBmaW5kIGxpc3QgaXRlbSB1bmRlciBjdXJzb3JcbiAgICAgICAgICAgIHZhciBwb2ludFggPSBlLnBhZ2VYIC0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5zY3JvbGxMZWZ0IHx8IDApLFxuICAgICAgICAgICAgICAgIHBvaW50WSA9IGUucGFnZVkgLSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApO1xuICAgICAgICAgICAgdGhpcy5wb2ludEVsID0gVUkuJChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHBvaW50WCwgcG9pbnRZKSk7XG5cbiAgICAgICAgICAgIGlmIChvcHQuaGFuZGxlQ2xhc3MgJiYgdGhpcy5wb2ludEVsLmhhc0NsYXNzKG9wdC5oYW5kbGVDbGFzcykpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbCA9IHRoaXMucG9pbnRFbC5jbG9zZXN0KG9wdC5fbGlzdEl0ZW1DbGFzcyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmVzdGFibGVpdGVtID0gdGhpcy5wb2ludEVsLmNsb3Nlc3Qob3B0Ll9saXN0SXRlbUNsYXNzKTtcblxuICAgICAgICAgICAgICAgIGlmIChuZXN0YWJsZWl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbCA9IG5lc3RhYmxlaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlRWwuZmluZCh0aGlzLnBvaW50RWwpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRFbC5kYXRhKCduZXN0YWJsZScpICYmICF0aGlzLnBvaW50RWwuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRW1wdHlMaXN0KHRoaXMucG9pbnRFbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnBvaW50RWwubGVuZ3RoIHx8ICF0aGlzLnBvaW50RWwuaGFzQ2xhc3Mob3B0Lmxpc3RJdGVtQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaW5kIHBhcmVudCBsaXN0IG9mIGl0ZW0gdW5kZXIgY3Vyc29yXG4gICAgICAgICAgICB2YXIgcG9pbnRFbFJvb3QgPSB0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgdG1wUm9vdCAgICAgPSB0aGlzLnBvaW50RWwuY2xvc2VzdCh0aGlzLm9wdGlvbnMuX2xpc3RCYXNlQ2xhc3MpLFxuICAgICAgICAgICAgICAgIGlzTmV3Um9vdCAgID0gcG9pbnRFbFJvb3RbMF0gIT0gdG1wUm9vdFswXTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBtb3ZlIHZlcnRpY2FsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICghbW91c2UuZGlyQXggfHwgaXNOZXdSb290IHx8IGlzRW1wdHkpIHtcblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdyb3VwcyBtYXRjaCBpZiBkcmFnZ2luZyBvdmVyIG5ldyByb290XG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCAmJiBvcHQuZ3JvdXAgIT09IHRtcFJvb3QuZGF0YSgnbmVzdGFibGUtZ3JvdXAnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hlZGxpc3RzLnB1c2gocG9pbnRFbFJvb3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGRlcHRoIGxpbWl0XG4gICAgICAgICAgICAgICAgZGVwdGggPSB0aGlzLmRyYWdEZXB0aCAtIDEgKyB0aGlzLnBvaW50RWwucGFyZW50cyhvcHQuX2xpc3RDbGFzcysnLCcrb3B0Ll9saXN0QmFzZUNsYXNzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGVwdGggPiBtYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGJlZm9yZSA9IGUucGFnZVkgPCAodGhpcy5wb2ludEVsLm9mZnNldCgpLnRvcCArIHRoaXMucG9pbnRFbC5oZWlnaHQoKSAvIDIpO1xuXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5wbGFjZUVsLnBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludEVsLmFwcGVuZCh0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5iZWZvcmUodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50RWwuYWZ0ZXIodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5kYXRhKFwibmVzdGFibGVcIikpIHRoaXMudW5zZXRQYXJlbnQocGFyZW50LnBhcmVudCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRW1wdHlMaXN0KHRoaXMuZHJhZ1Jvb3RFbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0VtcHR5TGlzdChwb2ludEVsUm9vdCk7XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgcm9vdCBsaXN0IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdSb290RWwgPSB0bXBSb290O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc05ld1Jvb3QgPSB0aGlzLmVsZW1lbnRbMF0gIT09IHRoaXMuZHJhZ1Jvb3RFbFswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tFbXB0eUxpc3Q6IGZ1bmN0aW9uKGxpc3QpIHtcblxuICAgICAgICAgICAgbGlzdCAgPSBsaXN0ID8gVUkuJChsaXN0KSA6IHRoaXMuZWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbXB0eUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgbGlzdFshbGlzdC5jaGlsZHJlbigpLmxlbmd0aCA/ICdhZGRDbGFzcyc6J3JlbW92ZUNsYXNzJ10odGhpcy5vcHRpb25zLmVtcHR5Q2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBVSS5uZXN0YWJsZTtcbn0pO1xuIl19