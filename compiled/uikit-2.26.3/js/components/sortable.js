"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
  * Based on nativesortable - Copyright (c) Brian Grinstead - https://github.com/bgrins/nativesortable
  */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sortable", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var supportsTouch = 'ontouchstart' in window || 'MSGesture' in window || window.DocumentTouch && document instanceof DocumentTouch,
        draggingPlaceholder,
        currentlyDraggingElement,
        currentlyDraggingTarget,
        dragging,
        moving,
        clickedlink,
        delayIdle,
        touchedlists,
        moved,
        overElement;

    function closestSortable(ele) {

        ele = UI.$(ele);

        do {
            if (ele.data('sortable')) {
                return ele;
            }
            ele = UI.$(ele).parent();
        } while (ele.length);

        return ele;
    }

    UI.component('sortable', {

        defaults: {

            animation: 150,
            threshold: 10,

            childClass: 'uk-sortable-item',
            placeholderClass: 'uk-sortable-placeholder',
            overClass: 'uk-sortable-over',
            draggingClass: 'uk-sortable-dragged',
            dragMovingClass: 'uk-sortable-moving',
            baseClass: 'uk-sortable',
            noDragClass: 'uk-sortable-nodrag',
            emptyClass: 'uk-sortable-empty',
            dragCustomClass: '',
            handleClass: false,
            group: false,

            stop: function stop() {},
            start: function start() {},
            change: function change() {}
        },

        boot: function boot() {

            // auto init
            UI.ready(function (context) {

                UI.$("[data-uk-sortable]", context).each(function () {

                    var ele = UI.$(this);

                    if (!ele.data("sortable")) {
                        UI.sortable(ele, UI.Utils.options(ele.attr("data-uk-sortable")));
                    }
                });
            });

            UI.$html.on('mousemove touchmove', function (e) {

                if (delayIdle) {

                    var src = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;
                    if (Math.abs(src.pageX - delayIdle.pos.x) > delayIdle.threshold || Math.abs(src.pageY - delayIdle.pos.y) > delayIdle.threshold) {
                        delayIdle.apply(src);
                    }
                }

                if (draggingPlaceholder) {

                    if (!moving) {
                        moving = true;
                        draggingPlaceholder.show();

                        draggingPlaceholder.$current.addClass(draggingPlaceholder.$sortable.options.placeholderClass);
                        draggingPlaceholder.$sortable.element.children().addClass(draggingPlaceholder.$sortable.options.childClass);

                        UI.$html.addClass(draggingPlaceholder.$sortable.options.dragMovingClass);
                    }

                    var offset = draggingPlaceholder.data('mouse-offset'),
                        left = parseInt(e.originalEvent.pageX, 10) + offset.left,
                        top = parseInt(e.originalEvent.pageY, 10) + offset.top;

                    draggingPlaceholder.css({ 'left': left, 'top': top });

                    // adjust document scrolling

                    if (top + draggingPlaceholder.height() / 3 > document.body.offsetHeight) {
                        return;
                    }

                    if (top < UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() - Math.ceil(draggingPlaceholder.height() / 3));
                    } else if (top + draggingPlaceholder.height() / 3 > window.innerHeight + UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() + Math.ceil(draggingPlaceholder.height() / 3));
                    }
                }
            });

            UI.$html.on('mouseup touchend', function (e) {

                delayIdle = clickedlink = false;

                // dragging?
                if (!currentlyDraggingElement || !draggingPlaceholder) {
                    // completely reset dragging attempt. will cause weird delay behavior elsewise
                    currentlyDraggingElement = draggingPlaceholder = null;
                    return;
                }

                // inside or outside of sortable?
                var sortable = closestSortable(currentlyDraggingElement),
                    component = draggingPlaceholder.$sortable,
                    ev = { type: e.type };

                if (sortable[0]) {
                    component.dragDrop(ev, component.element);
                }
                component.dragEnd(ev, component.element);
            });
        },

        init: function init() {

            var $this = this,
                element = this.element[0];

            touchedlists = [];

            this.checkEmptyList();

            this.element.data('sortable-group', this.options.group ? this.options.group : UI.Utils.uid('sortable-group'));

            var handleDragStart = delegate(function (e) {

                if (e.data && e.data.sortable) {
                    return;
                }

                var $target = UI.$(e.target),
                    $link = $target.is('a[href]') ? $target : $target.parents('a[href]');

                if ($target.is(':input')) {
                    return;
                }

                if ($this.options.handleClass) {
                    var handle = $target.hasClass($this.options.handleClass) ? $target : $target.closest('.' + $this.options.handleClass, $this.element);
                    if (!handle.length) return;
                }

                e.preventDefault();

                if ($link.length) {

                    $link.one('click', function (e) {
                        e.preventDefault();
                    }).one('mouseup touchend', function () {

                        if (!moved) {
                            $link.trigger('click');
                            if (supportsTouch && $link.attr('href').trim()) {
                                location.href = $link.attr('href');
                            }
                        }
                    });
                }

                e.data = e.data || {};

                e.data.sortable = element;

                return $this.dragStart(e, this);
            });

            var handleDragEnter = delegate(UI.Utils.debounce(function (e) {
                return $this.dragEnter(e, this);
            }), 40);

            var handleDragLeave = delegate(function (e) {

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = $this.dragenterData(this);
                $this.dragenterData(this, previousCounter - 1);

                // This is a fix for child elements firing dragenter before the parent fires dragleave
                if (!$this.dragenterData(this)) {
                    UI.$(this).removeClass($this.options.overClass);
                    $this.dragenterData(this, false);
                }
            });

            var handleTouchMove = delegate(function (e) {

                if (!currentlyDraggingElement || currentlyDraggingElement === this || currentlyDraggingTarget === this) {
                    return true;
                }

                $this.element.children().removeClass($this.options.overClass);
                currentlyDraggingTarget = this;

                $this.moveElementNextTo(currentlyDraggingElement, this);

                return prevent(e);
            });

            // Bind/unbind standard mouse/touch events as a polyfill.
            function addDragHandlers() {
                if (supportsTouch) {
                    element.addEventListener("touchmove", handleTouchMove, false);
                } else {
                    element.addEventListener('mouseover', handleDragEnter, false);
                    element.addEventListener('mouseout', handleDragLeave, false);
                }

                // document.addEventListener("selectstart", prevent, false);
            }

            function removeDragHandlers() {
                if (supportsTouch) {
                    element.removeEventListener("touchmove", handleTouchMove, false);
                } else {
                    element.removeEventListener('mouseover', handleDragEnter, false);
                    element.removeEventListener('mouseout', handleDragLeave, false);
                }

                // document.removeEventListener("selectstart", prevent, false);
            }

            this.addDragHandlers = addDragHandlers;
            this.removeDragHandlers = removeDragHandlers;

            function handleDragMove(e) {

                if (!currentlyDraggingElement) {
                    return;
                }

                $this.dragMove(e, $this);
            }

            function delegate(fn) {

                return function (e) {

                    var touch, target, context;

                    if (e) {
                        touch = supportsTouch && e.touches && e.touches[0] || {};
                        target = touch.target || e.target;

                        // Fix event.target for a touch event
                        if (supportsTouch && document.elementFromPoint) {
                            target = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop);
                        }

                        overElement = UI.$(target);
                    }

                    if (UI.$(target).hasClass($this.options.childClass)) {
                        fn.apply(target, [e]);
                    } else if (target !== element) {

                        // If a child is initiating the event or ending it, then use the container as context for the callback.
                        context = moveUpToChildNode(element, target);

                        if (context) {
                            fn.apply(context, [e]);
                        }
                    }
                };
            }

            window.addEventListener(supportsTouch ? 'touchmove' : 'mousemove', handleDragMove, false);
            element.addEventListener(supportsTouch ? 'touchstart' : 'mousedown', handleDragStart, false);
        },

        dragStart: function dragStart(e, elem) {

            moved = false;
            moving = false;
            dragging = false;

            var $this = this,
                target = UI.$(e.target);

            if (!supportsTouch && e.button == 2) {
                return;
            }

            if (target.is('.' + $this.options.noDragClass) || target.closest('.' + $this.options.noDragClass).length) {
                return;
            }

            // prevent dragging if taget is a form field
            if (target.is(':input')) {
                return;
            }

            currentlyDraggingElement = elem;

            // init drag placeholder
            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
            }

            var $current = UI.$(currentlyDraggingElement),
                offset = $current.offset();

            delayIdle = {

                pos: { x: e.pageX, y: e.pageY },
                threshold: $this.options.handleClass ? 1 : $this.options.threshold,
                apply: function apply(evt) {

                    draggingPlaceholder = UI.$('<div class="' + [$this.options.draggingClass, $this.options.dragCustomClass].join(' ') + '"></div>').css({
                        display: 'none',
                        top: offset.top,
                        left: offset.left,
                        width: $current.width(),
                        height: $current.height(),
                        padding: $current.css('padding')
                    }).data({
                        'mouse-offset': {
                            'left': offset.left - parseInt(evt.pageX, 10),
                            'top': offset.top - parseInt(evt.pageY, 10)
                        },
                        'origin': $this.element,
                        'index': $current.index()
                    }).append($current.html()).appendTo('body');

                    draggingPlaceholder.$current = $current;
                    draggingPlaceholder.$sortable = $this;

                    $current.data({
                        'start-list': $current.parent(),
                        'start-index': $current.index(),
                        'sortable-group': $this.options.group
                    });

                    $this.addDragHandlers();

                    $this.options.start(this, currentlyDraggingElement);
                    $this.trigger('start.uk.sortable', [$this, currentlyDraggingElement]);

                    moved = true;
                    delayIdle = false;
                }
            };
        },

        dragMove: function dragMove(e, elem) {

            overElement = UI.$(document.elementFromPoint(e.pageX - (document.body.scrollLeft || document.scrollLeft || 0), e.pageY - (document.body.scrollTop || document.documentElement.scrollTop || 0)));

            var overRoot = overElement.closest('.' + this.options.baseClass),
                groupOver = overRoot.data("sortable-group"),
                $current = UI.$(currentlyDraggingElement),
                currentRoot = $current.parent(),
                groupCurrent = $current.data("sortable-group"),
                overChild;

            if (overRoot[0] !== currentRoot[0] && groupCurrent !== undefined && groupOver === groupCurrent) {

                overRoot.data('sortable').addDragHandlers();

                touchedlists.push(overRoot);
                overRoot.children().addClass(this.options.childClass);

                // swap root
                if (overRoot.children().length > 0) {
                    overChild = overElement.closest('.' + this.options.childClass);

                    if (overChild.length) {
                        overChild.before($current);
                    } else {
                        overRoot.append($current);
                    }
                } else {
                    // empty list
                    overElement.append($current);
                }

                UIkit.$doc.trigger('mouseover');
            }

            this.checkEmptyList();
            this.checkEmptyList(currentRoot);
        },

        dragEnter: function dragEnter(e, elem) {

            if (!currentlyDraggingElement || currentlyDraggingElement === elem) {
                return true;
            }

            var previousCounter = this.dragenterData(elem);

            this.dragenterData(elem, previousCounter + 1);

            // Prevent dragenter on a child from allowing a dragleave on the container
            if (previousCounter === 0) {

                var currentlist = UI.$(elem).parent(),
                    startlist = UI.$(currentlyDraggingElement).data("start-list");

                if (currentlist[0] !== startlist[0]) {

                    var groupOver = currentlist.data('sortable-group'),
                        groupCurrent = UI.$(currentlyDraggingElement).data("sortable-group");

                    if ((groupOver || groupCurrent) && groupOver != groupCurrent) {
                        return false;
                    }
                }

                UI.$(elem).addClass(this.options.overClass);
                this.moveElementNextTo(currentlyDraggingElement, elem);
            }

            return false;
        },

        dragEnd: function dragEnd(e, elem) {

            var $this = this;

            // avoid triggering event twice
            if (currentlyDraggingElement) {
                // TODO: trigger on right element?
                this.options.stop(elem);
                this.trigger('stop.uk.sortable', [this]);
            }

            currentlyDraggingElement = null;
            currentlyDraggingTarget = null;

            touchedlists.push(this.element);
            touchedlists.forEach(function (el, i) {
                UI.$(el).children().each(function () {
                    if (this.nodeType === 1) {
                        UI.$(this).removeClass($this.options.overClass).removeClass($this.options.placeholderClass).removeClass($this.options.childClass);
                        $this.dragenterData(this, false);
                    }
                });
            });

            touchedlists = [];

            UI.$html.removeClass(this.options.dragMovingClass);

            this.removeDragHandlers();

            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
                draggingPlaceholder = null;
            }
        },

        dragDrop: function dragDrop(e, elem) {

            if (e.type === 'drop') {

                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }
            }

            this.triggerChangeEvents();
        },

        triggerChangeEvents: function triggerChangeEvents() {

            // trigger events once
            if (!currentlyDraggingElement) return;

            var $current = UI.$(currentlyDraggingElement),
                oldRoot = draggingPlaceholder.data("origin"),
                newRoot = $current.closest('.' + this.options.baseClass),
                triggers = [],
                el = UI.$(currentlyDraggingElement);

            // events depending on move inside lists or across lists
            if (oldRoot[0] === newRoot[0] && draggingPlaceholder.data('index') != $current.index()) {
                triggers.push({ sortable: this, mode: 'moved' });
            } else if (oldRoot[0] != newRoot[0]) {
                triggers.push({ sortable: UI.$(newRoot).data('sortable'), mode: 'added' }, { sortable: UI.$(oldRoot).data('sortable'), mode: 'removed' });
            }

            triggers.forEach(function (trigger, i) {
                if (trigger.sortable) {
                    trigger.sortable.element.trigger('change.uk.sortable', [trigger.sortable, el, trigger.mode]);
                }
            });
        },

        dragenterData: function dragenterData(element, val) {

            element = UI.$(element);

            if (arguments.length == 1) {
                return parseInt(element.data('child-dragenter'), 10) || 0;
            } else if (!val) {
                element.removeData('child-dragenter');
            } else {
                element.data('child-dragenter', Math.max(0, val));
            }
        },

        moveElementNextTo: function moveElementNextTo(element, elementToMoveNextTo) {

            dragging = true;

            var $this = this,
                list = UI.$(element).parent().css('min-height', ''),
                next = isBelow(element, elementToMoveNextTo) ? elementToMoveNextTo : elementToMoveNextTo.nextSibling,
                children = list.children(),
                count = children.length;

            if (!$this.options.animation) {
                elementToMoveNextTo.parentNode.insertBefore(element, next);
                UI.Utils.checkDisplay($this.element.parent());
                return;
            }

            list.css('min-height', list.height());

            children.stop().each(function () {
                var ele = UI.$(this),
                    offset = ele.position();

                offset.width = ele.width();

                ele.data('offset-before', offset);
            });

            elementToMoveNextTo.parentNode.insertBefore(element, next);

            UI.Utils.checkDisplay($this.element.parent());

            children = list.children().each(function () {
                var ele = UI.$(this);
                ele.data('offset-after', ele.position());
            }).each(function () {
                var ele = UI.$(this),
                    before = ele.data('offset-before');
                ele.css({ 'position': 'absolute', 'top': before.top, 'left': before.left, 'min-width': before.width });
            });

            children.each(function () {

                var ele = UI.$(this),
                    before = ele.data('offset-before'),
                    offset = ele.data('offset-after');

                ele.css('pointer-events', 'none').width();

                setTimeout(function () {
                    ele.animate({ 'top': offset.top, 'left': offset.left }, $this.options.animation, function () {
                        ele.css({ 'position': '', 'top': '', 'left': '', 'min-width': '', 'pointer-events': '' }).removeClass($this.options.overClass).removeData('child-dragenter');
                        count--;
                        if (!count) {
                            list.css('min-height', '');
                            UI.Utils.checkDisplay($this.element.parent());
                        }
                    });
                }, 0);
            });
        },

        serialize: function serialize() {

            var data = [],
                item,
                attribute;

            this.element.children().each(function (j, child) {
                item = {};
                for (var i = 0, attr, val; i < child.attributes.length; i++) {
                    attribute = child.attributes[i];
                    if (attribute.name.indexOf('data-') === 0) {
                        attr = attribute.name.substr(5);
                        val = UI.Utils.str2json(attribute.value);
                        item[attr] = val || attribute.value == 'false' || attribute.value == '0' ? val : attribute.value;
                    }
                }
                data.push(item);
            });

            return data;
        },

        checkEmptyList: function checkEmptyList(list) {

            list = list ? UI.$(list) : this.element;

            if (this.options.emptyClass) {
                list[!list.children().length ? 'addClass' : 'removeClass'](this.options.emptyClass);
            }
        }
    });

    // helpers

    function isBelow(el1, el2) {

        var parent = el1.parentNode;

        if (el2.parentNode != parent) {
            return false;
        }

        var cur = el1.previousSibling;

        while (cur && cur.nodeType !== 9) {
            if (cur === el2) {
                return true;
            }
            cur = cur.previousSibling;
        }

        return false;
    }

    function moveUpToChildNode(parent, child) {
        var cur = child;
        if (cur == parent) {
            return null;
        }

        while (cur) {
            if (cur.parentNode === parent) {
                return cur;
            }

            cur = cur.parentNode;
            if (!cur || !cur.ownerDocument || cur.nodeType === 11) {
                break;
            }
        }
        return null;
    }

    function prevent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    return UI.sortable;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NvcnRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLENBQUMsVUFBUyxLQUFULEVBQWdCOztBQUViLFFBQUksU0FBSjs7QUFFQSxRQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFZLE1BQU0sS0FBTixDQUFaO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsT0FBTyxHQUExQyxFQUErQztBQUMzQyxlQUFPLGdCQUFQLEVBQXlCLENBQUMsT0FBRCxDQUF6QixFQUFvQyxZQUFVO0FBQzFDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLFFBQUksZ0JBQXVCLGtCQUFrQixNQUFsQixJQUE0QixlQUFlLE1BQTVDLElBQXdELE9BQU8sYUFBUCxJQUF3QixvQkFBb0IsYUFBOUg7QUFBQSxRQUNJLG1CQURKO0FBQUEsUUFDeUIsd0JBRHpCO0FBQUEsUUFDbUQsdUJBRG5EO0FBQUEsUUFDNEUsUUFENUU7QUFBQSxRQUNzRixNQUR0RjtBQUFBLFFBQzhGLFdBRDlGO0FBQUEsUUFDMkcsU0FEM0c7QUFBQSxRQUNzSCxZQUR0SDtBQUFBLFFBQ29JLEtBRHBJO0FBQUEsUUFDMkksV0FEM0k7O0FBR0EsYUFBUyxlQUFULENBQXlCLEdBQXpCLEVBQThCOztBQUUxQixjQUFNLEdBQUcsQ0FBSCxDQUFLLEdBQUwsQ0FBTjs7QUFFQSxXQUFHO0FBQ0MsZ0JBQUksSUFBSSxJQUFKLENBQVMsVUFBVCxDQUFKLEVBQTBCO0FBQ3RCLHVCQUFPLEdBQVA7QUFDSDtBQUNELGtCQUFNLEdBQUcsQ0FBSCxDQUFLLEdBQUwsRUFBVSxNQUFWLEVBQU47QUFDSCxTQUxELFFBS1EsSUFBSSxNQUxaOztBQU9BLGVBQU8sR0FBUDtBQUNIOztBQUVELE9BQUcs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dUI7QUFDbkIsY0FBRSxlQUFGO0FBQ0g7QUFDRCxZQUFJLEVBQUUsY0FBTixFQUFzQjtBQUNsQixjQUFFLGNBQUY7QUFDSDtBQUNELFVBQUUsV0FBRixHQUFnQixLQUFoQjtBQUNIOztBQUVELFdBQU8sR0FBRyxRQUFWO0FBQ0gsQ0FscUJEIiwiZmlsZSI6InNvcnRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuLypcbiAgKiBCYXNlZCBvbiBuYXRpdmVzb3J0YWJsZSAtIENvcHlyaWdodCAoYykgQnJpYW4gR3JpbnN0ZWFkIC0gaHR0cHM6Ly9naXRodWIuY29tL2Jncmlucy9uYXRpdmVzb3J0YWJsZVxuICAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtc29ydGFibGVcIiwgW1widWlraXRcIl0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50IHx8IGFkZG9uKFVJa2l0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShmdW5jdGlvbihVSSl7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBzdXBwb3J0c1RvdWNoICAgICAgID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAnTVNHZXN0dXJlJyBpbiB3aW5kb3cpIHx8ICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpLFxuICAgICAgICBkcmFnZ2luZ1BsYWNlaG9sZGVyLCBjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQsIGN1cnJlbnRseURyYWdnaW5nVGFyZ2V0LCBkcmFnZ2luZywgbW92aW5nLCBjbGlja2VkbGluaywgZGVsYXlJZGxlLCB0b3VjaGVkbGlzdHMsIG1vdmVkLCBvdmVyRWxlbWVudDtcblxuICAgIGZ1bmN0aW9uIGNsb3Nlc3RTb3J0YWJsZShlbGUpIHtcblxuICAgICAgICBlbGUgPSBVSS4kKGVsZSk7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKGVsZS5kYXRhKCdzb3J0YWJsZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZSA9IFVJLiQoZWxlKS5wYXJlbnQoKTtcbiAgICAgICAgfSB3aGlsZShlbGUubGVuZ3RoKTtcblxuICAgICAgICByZXR1cm4gZWxlO1xuICAgIH1cblxuICAgIFVJLmNvbXBvbmVudCgnc29ydGFibGUnLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcblxuICAgICAgICAgICAgYW5pbWF0aW9uICAgICAgICA6IDE1MCxcbiAgICAgICAgICAgIHRocmVzaG9sZCAgICAgICAgOiAxMCxcblxuICAgICAgICAgICAgY2hpbGRDbGFzcyAgICAgICA6ICd1ay1zb3J0YWJsZS1pdGVtJyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyQ2xhc3MgOiAndWstc29ydGFibGUtcGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgb3ZlckNsYXNzICAgICAgICA6ICd1ay1zb3J0YWJsZS1vdmVyJyxcbiAgICAgICAgICAgIGRyYWdnaW5nQ2xhc3MgICAgOiAndWstc29ydGFibGUtZHJhZ2dlZCcsXG4gICAgICAgICAgICBkcmFnTW92aW5nQ2xhc3MgIDogJ3VrLXNvcnRhYmxlLW1vdmluZycsXG4gICAgICAgICAgICBiYXNlQ2xhc3MgICAgICAgIDogJ3VrLXNvcnRhYmxlJyxcbiAgICAgICAgICAgIG5vRHJhZ0NsYXNzICAgICAgOiAndWstc29ydGFibGUtbm9kcmFnJyxcbiAgICAgICAgICAgIGVtcHR5Q2xhc3MgICAgICAgOiAndWstc29ydGFibGUtZW1wdHknLFxuICAgICAgICAgICAgZHJhZ0N1c3RvbUNsYXNzICA6ICcnLFxuICAgICAgICAgICAgaGFuZGxlQ2xhc3MgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgZ3JvdXAgICAgICAgICAgICA6IGZhbHNlLFxuXG4gICAgICAgICAgICBzdG9wICAgICAgICAgICAgIDogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgIHN0YXJ0ICAgICAgICAgICAgOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgY2hhbmdlICAgICAgICAgICA6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gYXV0byBpbml0XG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKFwiW2RhdGEtdWstc29ydGFibGVdXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZighZWxlLmRhdGEoXCJzb3J0YWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuc29ydGFibGUoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1zb3J0YWJsZVwiKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVUkuJGh0bWwub24oJ21vdXNlbW92ZSB0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGVsYXlJZGxlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNyYyA9IGUub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzID8gZS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0gOiBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc3JjLnBhZ2VYIC0gZGVsYXlJZGxlLnBvcy54KSA+IGRlbGF5SWRsZS50aHJlc2hvbGQgfHwgTWF0aC5hYnMoc3JjLnBhZ2VZIC0gZGVsYXlJZGxlLnBvcy55KSA+IGRlbGF5SWRsZS50aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5SWRsZS5hcHBseShzcmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nUGxhY2Vob2xkZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vdmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnZ2luZ1BsYWNlaG9sZGVyLiRjdXJyZW50LmFkZENsYXNzKGRyYWdnaW5nUGxhY2Vob2xkZXIuJHNvcnRhYmxlLm9wdGlvbnMucGxhY2Vob2xkZXJDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnZ2luZ1BsYWNlaG9sZGVyLiRzb3J0YWJsZS5lbGVtZW50LmNoaWxkcmVuKCkuYWRkQ2xhc3MoZHJhZ2dpbmdQbGFjZWhvbGRlci4kc29ydGFibGUub3B0aW9ucy5jaGlsZENsYXNzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgVUkuJGh0bWwuYWRkQ2xhc3MoZHJhZ2dpbmdQbGFjZWhvbGRlci4kc29ydGFibGUub3B0aW9ucy5kcmFnTW92aW5nQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IGRyYWdnaW5nUGxhY2Vob2xkZXIuZGF0YSgnbW91c2Utb2Zmc2V0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ICAgPSBwYXJzZUludChlLm9yaWdpbmFsRXZlbnQucGFnZVgsIDEwKSArIG9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wICAgID0gcGFyc2VJbnQoZS5vcmlnaW5hbEV2ZW50LnBhZ2VZLCAxMCkgKyBvZmZzZXQudG9wO1xuXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIuY3NzKHsnbGVmdCc6IGxlZnQsICd0b3AnOiB0b3AgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0IGRvY3VtZW50IHNjcm9sbGluZ1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3AgKyAoZHJhZ2dpbmdQbGFjZWhvbGRlci5oZWlnaHQoKS8zKSA+IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgVUkuJHdpbi5zY3JvbGxUb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuJHdpbi5zY3JvbGxUb3AoVUkuJHdpbi5zY3JvbGxUb3AoKSAtIE1hdGguY2VpbChkcmFnZ2luZ1BsYWNlaG9sZGVyLmhlaWdodCgpLzMpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggKHRvcCArIChkcmFnZ2luZ1BsYWNlaG9sZGVyLmhlaWdodCgpLzMpKSA+ICh3aW5kb3cuaW5uZXJIZWlnaHQgKyBVSS4kd2luLnNjcm9sbFRvcCgpKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLiR3aW4uc2Nyb2xsVG9wKFVJLiR3aW4uc2Nyb2xsVG9wKCkgKyBNYXRoLmNlaWwoZHJhZ2dpbmdQbGFjZWhvbGRlci5oZWlnaHQoKS8zKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVUkuJGh0bWwub24oJ21vdXNldXAgdG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBkZWxheUlkbGUgPSBjbGlja2VkbGluayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gZHJhZ2dpbmc/XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQgfHwgIWRyYWdnaW5nUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGxldGVseSByZXNldCBkcmFnZ2luZyBhdHRlbXB0LiB3aWxsIGNhdXNlIHdlaXJkIGRlbGF5IGJlaGF2aW9yIGVsc2V3aXNlXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCA9IGRyYWdnaW5nUGxhY2Vob2xkZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaW5zaWRlIG9yIG91dHNpZGUgb2Ygc29ydGFibGU/XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRhYmxlICA9IGNsb3Nlc3RTb3J0YWJsZShjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSBkcmFnZ2luZ1BsYWNlaG9sZGVyLiRzb3J0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgZXYgICAgICAgID0geyB0eXBlOiBlLnR5cGUgfTtcblxuICAgICAgICAgICAgICAgIGlmIChzb3J0YWJsZVswXSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZHJhZ0Ryb3AoZXYsIGNvbXBvbmVudC5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmRyYWdFbmQoZXYsIGNvbXBvbmVudC5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudFswXTtcblxuICAgICAgICAgICAgdG91Y2hlZGxpc3RzID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tFbXB0eUxpc3QoKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGEoJ3NvcnRhYmxlLWdyb3VwJywgdGhpcy5vcHRpb25zLmdyb3VwID8gdGhpcy5vcHRpb25zLmdyb3VwIDogVUkuVXRpbHMudWlkKCdzb3J0YWJsZS1ncm91cCcpKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZURyYWdTdGFydCA9IGRlbGVnYXRlKGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLmRhdGEgJiYgZS5kYXRhLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRhcmdldCA9IFVJLiQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICAkbGluayAgID0gJHRhcmdldC5pcygnYVtocmVmXScpID8gJHRhcmdldDokdGFyZ2V0LnBhcmVudHMoJ2FbaHJlZl0nKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6aW5wdXQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLm9wdGlvbnMuaGFuZGxlQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9ICR0YXJnZXQuaGFzQ2xhc3MoJHRoaXMub3B0aW9ucy5oYW5kbGVDbGFzcykgPyAkdGFyZ2V0IDogJHRhcmdldC5jbG9zZXN0KCcuJyskdGhpcy5vcHRpb25zLmhhbmRsZUNsYXNzLCAkdGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYW5kbGUubGVuZ3RoKSByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRsaW5rLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICRsaW5rLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkub25lKCdtb3VzZXVwIHRvdWNoZW5kJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsaW5rLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1cHBvcnRzVG91Y2ggJiYgJGxpbmsuYXR0cignaHJlZicpLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJGxpbmsuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5kYXRhID0gZS5kYXRhIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZS5kYXRhLnNvcnRhYmxlID0gZWxlbWVudDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkdGhpcy5kcmFnU3RhcnQoZSwgdGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZURyYWdFbnRlciA9IGRlbGVnYXRlKFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRoaXMuZHJhZ0VudGVyKGUsIHRoaXMpO1xuICAgICAgICAgICAgfSksIDQwKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZURyYWdMZWF2ZSA9IGRlbGVnYXRlKGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgZHJhZ2VudGVyIG9uIGEgY2hpbGQgZnJvbSBhbGxvd2luZyBhIGRyYWdsZWF2ZSBvbiB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQ291bnRlciA9ICR0aGlzLmRyYWdlbnRlckRhdGEodGhpcyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZHJhZ2VudGVyRGF0YSh0aGlzLCBwcmV2aW91c0NvdW50ZXIgLSAxKTtcblxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBmaXggZm9yIGNoaWxkIGVsZW1lbnRzIGZpcmluZyBkcmFnZW50ZXIgYmVmb3JlIHRoZSBwYXJlbnQgZmlyZXMgZHJhZ2xlYXZlXG4gICAgICAgICAgICAgICAgaWYgKCEkdGhpcy5kcmFnZW50ZXJEYXRhKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIFVJLiQodGhpcykucmVtb3ZlQ2xhc3MoJHRoaXMub3B0aW9ucy5vdmVyQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcmFnZW50ZXJEYXRhKHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZVRvdWNoTW92ZSA9IGRlbGVnYXRlKGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGlmICghY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCA9PT0gdGhpcyB8fFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlEcmFnZ2luZ1RhcmdldCA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJHRoaXMub3B0aW9ucy5vdmVyQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseURyYWdnaW5nVGFyZ2V0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgICR0aGlzLm1vdmVFbGVtZW50TmV4dFRvKGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldmVudChlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBCaW5kL3VuYmluZCBzdGFuZGFyZCBtb3VzZS90b3VjaCBldmVudHMgYXMgYSBwb2x5ZmlsbC5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZERyYWdIYW5kbGVycygpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwcG9ydHNUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlVG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVEcmFnRW50ZXIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGhhbmRsZURyYWdMZWF2ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLCBwcmV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZURyYWdIYW5kbGVycygpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwcG9ydHNUb3VjaCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlVG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVEcmFnRW50ZXIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGhhbmRsZURyYWdMZWF2ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLCBwcmV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWRkRHJhZ0hhbmRsZXJzICAgID0gYWRkRHJhZ0hhbmRsZXJzO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVEcmFnSGFuZGxlcnMgPSByZW1vdmVEcmFnSGFuZGxlcnM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZURyYWdNb3ZlKGUpIHtcblxuICAgICAgICAgICAgICAgIGlmICghY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5kcmFnTW92ZShlLCAkdGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGVnYXRlKGZuKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaCwgdGFyZ2V0LCBjb250ZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaCAgPSAoc3VwcG9ydHNUb3VjaCAmJiBlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCB7IH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0b3VjaC50YXJnZXQgfHwgZS50YXJnZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCBldmVudC50YXJnZXQgZm9yIGEgdG91Y2ggZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdXBwb3J0c1RvdWNoICYmIGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsIGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJFbGVtZW50ID0gVUkuJCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFVJLiQodGFyZ2V0KS5oYXNDbGFzcygkdGhpcy5vcHRpb25zLmNoaWxkQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbi5hcHBseSh0YXJnZXQsIFtlXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0ICE9PSBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgY2hpbGQgaXMgaW5pdGlhdGluZyB0aGUgZXZlbnQgb3IgZW5kaW5nIGl0LCB0aGVuIHVzZSB0aGUgY29udGFpbmVyIGFzIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBtb3ZlVXBUb0NoaWxkTm9kZShlbGVtZW50LCB0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIFtlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihzdXBwb3J0c1RvdWNoID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJywgaGFuZGxlRHJhZ01vdmUsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihzdXBwb3J0c1RvdWNoID8gJ3RvdWNoc3RhcnQnOiAnbW91c2Vkb3duJywgaGFuZGxlRHJhZ1N0YXJ0LCBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZHJhZ1N0YXJ0OiBmdW5jdGlvbihlLCBlbGVtKSB7XG5cbiAgICAgICAgICAgIG1vdmVkICAgID0gZmFsc2U7XG4gICAgICAgICAgICBtb3ZpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyICR0aGlzICAgID0gdGhpcyxcbiAgICAgICAgICAgICAgICB0YXJnZXQgICA9IFVJLiQoZS50YXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAoIXN1cHBvcnRzVG91Y2ggJiYgZS5idXR0b249PTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXQuaXMoJy4nKyR0aGlzLm9wdGlvbnMubm9EcmFnQ2xhc3MpIHx8IHRhcmdldC5jbG9zZXN0KCcuJyskdGhpcy5vcHRpb25zLm5vRHJhZ0NsYXNzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHByZXZlbnQgZHJhZ2dpbmcgaWYgdGFnZXQgaXMgYSBmb3JtIGZpZWxkXG4gICAgICAgICAgICBpZiAodGFyZ2V0LmlzKCc6aW5wdXQnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50ID0gZWxlbTtcblxuICAgICAgICAgICAgLy8gaW5pdCBkcmFnIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmdQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkY3VycmVudCA9IFVJLiQoY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50KSwgb2Zmc2V0ID0gJGN1cnJlbnQub2Zmc2V0KCk7XG5cbiAgICAgICAgICAgIGRlbGF5SWRsZSA9IHtcblxuICAgICAgICAgICAgICAgIHBvcyAgICAgICA6IHsgeDplLnBhZ2VYLCB5OmUucGFnZVkgfSxcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQgOiAkdGhpcy5vcHRpb25zLmhhbmRsZUNsYXNzID8gMSA6ICR0aGlzLm9wdGlvbnMudGhyZXNob2xkLFxuICAgICAgICAgICAgICAgIGFwcGx5ICAgICA6IGZ1bmN0aW9uKGV2dCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIgPSBVSS4kKCc8ZGl2IGNsYXNzPVwiJysoWyR0aGlzLm9wdGlvbnMuZHJhZ2dpbmdDbGFzcywgJHRoaXMub3B0aW9ucy5kcmFnQ3VzdG9tQ2xhc3NdLmpvaW4oJyAnKSkrJ1wiPjwvZGl2PicpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5IDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wICAgICA6IG9mZnNldC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ICAgIDogb2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCAgIDogJGN1cnJlbnQud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCAgOiAkY3VycmVudC5oZWlnaHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmcgOiAkY3VycmVudC5jc3MoJ3BhZGRpbmcnKVxuICAgICAgICAgICAgICAgICAgICB9KS5kYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdtb3VzZS1vZmZzZXQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnICAgOiBvZmZzZXQubGVmdCAtIHBhcnNlSW50KGV2dC5wYWdlWCwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnICAgIDogb2Zmc2V0LnRvcCAgLSBwYXJzZUludChldnQucGFnZVksIDEwKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvcmlnaW4nIDogJHRoaXMuZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdpbmRleCcgIDogJGN1cnJlbnQuaW5kZXgoKVxuICAgICAgICAgICAgICAgICAgICB9KS5hcHBlbmQoJGN1cnJlbnQuaHRtbCgpKS5hcHBlbmRUbygnYm9keScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIuJGN1cnJlbnQgID0gJGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGRyYWdnaW5nUGxhY2Vob2xkZXIuJHNvcnRhYmxlID0gJHRoaXM7XG5cbiAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnQuZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhcnQtbGlzdCc6ICRjdXJyZW50LnBhcmVudCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXJ0LWluZGV4JzogJGN1cnJlbnQuaW5kZXgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzb3J0YWJsZS1ncm91cCc6ICR0aGlzLm9wdGlvbnMuZ3JvdXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkRHJhZ0hhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub3B0aW9ucy5zdGFydCh0aGlzLCBjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdzdGFydC51ay5zb3J0YWJsZScsIFskdGhpcywgY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbW92ZWQgICAgID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsYXlJZGxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnTW92ZTogZnVuY3Rpb24oZSwgZWxlbSkge1xuXG4gICAgICAgICAgICBvdmVyRWxlbWVudCA9IFVJLiQoZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLnBhZ2VYIC0gKGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCB8fCBkb2N1bWVudC5zY3JvbGxMZWZ0IHx8IDApLCBlLnBhZ2VZIC0gKGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgMCkpKTtcblxuICAgICAgICAgICAgdmFyIG92ZXJSb290ICAgICA9IG92ZXJFbGVtZW50LmNsb3Nlc3QoJy4nK3RoaXMub3B0aW9ucy5iYXNlQ2xhc3MpLFxuICAgICAgICAgICAgICAgIGdyb3VwT3ZlciAgICA9IG92ZXJSb290LmRhdGEoXCJzb3J0YWJsZS1ncm91cFwiKSxcbiAgICAgICAgICAgICAgICAkY3VycmVudCAgICAgPSBVSS4kKGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCksXG4gICAgICAgICAgICAgICAgY3VycmVudFJvb3QgID0gJGN1cnJlbnQucGFyZW50KCksXG4gICAgICAgICAgICAgICAgZ3JvdXBDdXJyZW50ID0gJGN1cnJlbnQuZGF0YShcInNvcnRhYmxlLWdyb3VwXCIpLFxuICAgICAgICAgICAgICAgIG92ZXJDaGlsZDtcblxuICAgICAgICAgICAgaWYgKG92ZXJSb290WzBdICE9PSBjdXJyZW50Um9vdFswXSAmJiBncm91cEN1cnJlbnQgIT09IHVuZGVmaW5lZCAmJiBncm91cE92ZXIgPT09IGdyb3VwQ3VycmVudCkge1xuXG4gICAgICAgICAgICAgICAgb3ZlclJvb3QuZGF0YSgnc29ydGFibGUnKS5hZGREcmFnSGFuZGxlcnMoKTtcblxuICAgICAgICAgICAgICAgIHRvdWNoZWRsaXN0cy5wdXNoKG92ZXJSb290KTtcbiAgICAgICAgICAgICAgICBvdmVyUm9vdC5jaGlsZHJlbigpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jaGlsZENsYXNzKTtcblxuICAgICAgICAgICAgICAgIC8vIHN3YXAgcm9vdFxuICAgICAgICAgICAgICAgIGlmIChvdmVyUm9vdC5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlckNoaWxkID0gb3ZlckVsZW1lbnQuY2xvc2VzdCgnLicrdGhpcy5vcHRpb25zLmNoaWxkQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVyQ2hpbGQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyQ2hpbGQuYmVmb3JlKCRjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJSb290LmFwcGVuZCgkY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGVtcHR5IGxpc3RcbiAgICAgICAgICAgICAgICAgICAgb3ZlckVsZW1lbnQuYXBwZW5kKCRjdXJyZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBVSWtpdC4kZG9jLnRyaWdnZXIoJ21vdXNlb3ZlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNoZWNrRW1wdHlMaXN0KCk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrRW1wdHlMaXN0KGN1cnJlbnRSb290KTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnRW50ZXI6IGZ1bmN0aW9uKGUsIGVsZW0pIHtcblxuICAgICAgICAgICAgaWYgKCFjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQgfHwgY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50ID09PSBlbGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwcmV2aW91c0NvdW50ZXIgPSB0aGlzLmRyYWdlbnRlckRhdGEoZWxlbSk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ2VudGVyRGF0YShlbGVtLCBwcmV2aW91c0NvdW50ZXIgKyAxKTtcblxuICAgICAgICAgICAgLy8gUHJldmVudCBkcmFnZW50ZXIgb24gYSBjaGlsZCBmcm9tIGFsbG93aW5nIGEgZHJhZ2xlYXZlIG9uIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0NvdW50ZXIgPT09IDApIHtcblxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50bGlzdCA9IFVJLiQoZWxlbSkucGFyZW50KCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0bGlzdCAgID0gVUkuJChjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQpLmRhdGEoXCJzdGFydC1saXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRsaXN0WzBdICE9PSBzdGFydGxpc3RbMF0pIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBPdmVyICAgID0gY3VycmVudGxpc3QuZGF0YSgnc29ydGFibGUtZ3JvdXAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ3VycmVudCA9IFVJLiQoY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50KS5kYXRhKFwic29ydGFibGUtZ3JvdXBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKChncm91cE92ZXIgfHwgIGdyb3VwQ3VycmVudCkgJiYgKGdyb3VwT3ZlciAhPSBncm91cEN1cnJlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBVSS4kKGVsZW0pLmFkZENsYXNzKHRoaXMub3B0aW9ucy5vdmVyQ2xhc3MpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZUVsZW1lbnROZXh0VG8oY3VycmVudGx5RHJhZ2dpbmdFbGVtZW50LCBlbGVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWdFbmQ6IGZ1bmN0aW9uKGUsIGVsZW0pIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgLy8gYXZvaWQgdHJpZ2dlcmluZyBldmVudCB0d2ljZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHRyaWdnZXIgb24gcmlnaHQgZWxlbWVudD9cbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcChlbGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3N0b3AudWsuc29ydGFibGUnLCBbdGhpc10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgY3VycmVudGx5RHJhZ2dpbmdUYXJnZXQgID0gbnVsbDtcblxuICAgICAgICAgICAgdG91Y2hlZGxpc3RzLnB1c2godGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIHRvdWNoZWRsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKSB7XG4gICAgICAgICAgICAgICAgVUkuJChlbCkuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuJCh0aGlzKS5yZW1vdmVDbGFzcygkdGhpcy5vcHRpb25zLm92ZXJDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlckNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygkdGhpcy5vcHRpb25zLmNoaWxkQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZHJhZ2VudGVyRGF0YSh0aGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0b3VjaGVkbGlzdHMgPSBbXTtcblxuICAgICAgICAgICAgVUkuJGh0bWwucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmRyYWdNb3ZpbmdDbGFzcyk7XG5cbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRHJhZ0hhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQbGFjZWhvbGRlci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BsYWNlaG9sZGVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnRHJvcDogZnVuY3Rpb24oZSwgZWxlbSkge1xuXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSAnZHJvcCcpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlLnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckNoYW5nZUV2ZW50cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXJDaGFuZ2VFdmVudHM6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50cyBvbmNlXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRseURyYWdnaW5nRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgJGN1cnJlbnQgPSBVSS4kKGN1cnJlbnRseURyYWdnaW5nRWxlbWVudCksXG4gICAgICAgICAgICAgICAgb2xkUm9vdCAgPSBkcmFnZ2luZ1BsYWNlaG9sZGVyLmRhdGEoXCJvcmlnaW5cIiksXG4gICAgICAgICAgICAgICAgbmV3Um9vdCAgPSAkY3VycmVudC5jbG9zZXN0KCcuJyt0aGlzLm9wdGlvbnMuYmFzZUNsYXNzKSxcbiAgICAgICAgICAgICAgICB0cmlnZ2VycyA9IFtdLFxuICAgICAgICAgICAgICAgIGVsICAgICAgID0gVUkuJChjdXJyZW50bHlEcmFnZ2luZ0VsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBldmVudHMgZGVwZW5kaW5nIG9uIG1vdmUgaW5zaWRlIGxpc3RzIG9yIGFjcm9zcyBsaXN0c1xuICAgICAgICAgICAgaWYgKG9sZFJvb3RbMF0gPT09IG5ld1Jvb3RbMF0gJiYgZHJhZ2dpbmdQbGFjZWhvbGRlci5kYXRhKCdpbmRleCcpICE9ICRjdXJyZW50LmluZGV4KCkgKSB7XG4gICAgICAgICAgICAgICAgdHJpZ2dlcnMucHVzaCh7c29ydGFibGU6IHRoaXMsIG1vZGU6ICdtb3ZlZCd9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2xkUm9vdFswXSAhPSBuZXdSb290WzBdKSB7XG4gICAgICAgICAgICAgICAgdHJpZ2dlcnMucHVzaCh7c29ydGFibGU6IFVJLiQobmV3Um9vdCkuZGF0YSgnc29ydGFibGUnKSwgbW9kZTogJ2FkZGVkJ30sIHtzb3J0YWJsZTogVUkuJChvbGRSb290KS5kYXRhKCdzb3J0YWJsZScpLCBtb2RlOiAncmVtb3ZlZCd9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodHJpZ2dlciwgaSkge1xuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIuc29ydGFibGUuZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UudWsuc29ydGFibGUnLCBbdHJpZ2dlci5zb3J0YWJsZSwgZWwsIHRyaWdnZXIubW9kZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWdlbnRlckRhdGE6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbCkge1xuXG4gICAgICAgICAgICBlbGVtZW50ID0gVUkuJChlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChlbGVtZW50LmRhdGEoJ2NoaWxkLWRyYWdlbnRlcicpLCAxMCkgfHwgMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXZhbCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRGF0YSgnY2hpbGQtZHJhZ2VudGVyJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnY2hpbGQtZHJhZ2VudGVyJywgTWF0aC5tYXgoMCwgdmFsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZUVsZW1lbnROZXh0VG86IGZ1bmN0aW9uKGVsZW1lbnQsIGVsZW1lbnRUb01vdmVOZXh0VG8pIHtcblxuICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGxpc3QgICAgID0gVUkuJChlbGVtZW50KS5wYXJlbnQoKS5jc3MoJ21pbi1oZWlnaHQnLCAnJyksXG4gICAgICAgICAgICAgICAgbmV4dCAgICAgPSBpc0JlbG93KGVsZW1lbnQsIGVsZW1lbnRUb01vdmVOZXh0VG8pID8gZWxlbWVudFRvTW92ZU5leHRUbyA6IGVsZW1lbnRUb01vdmVOZXh0VG8ubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBsaXN0LmNoaWxkcmVuKCksXG4gICAgICAgICAgICAgICAgY291bnQgICAgPSBjaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmICghJHRoaXMub3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50VG9Nb3ZlTmV4dFRvLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIG5leHQpO1xuICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSgkdGhpcy5lbGVtZW50LnBhcmVudCgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QuY3NzKCdtaW4taGVpZ2h0JywgbGlzdC5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnN0b3AoKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IGVsZS5wb3NpdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldC53aWR0aCA9IGVsZS53aWR0aCgpO1xuXG4gICAgICAgICAgICAgICAgZWxlLmRhdGEoJ29mZnNldC1iZWZvcmUnLCBvZmZzZXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnRUb01vdmVOZXh0VG8ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgbmV4dCk7XG5cbiAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSgkdGhpcy5lbGVtZW50LnBhcmVudCgpKTtcblxuICAgICAgICAgICAgY2hpbGRyZW4gPSBsaXN0LmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlICAgID0gVUkuJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBlbGUuZGF0YSgnb2Zmc2V0LWFmdGVyJywgZWxlLnBvc2l0aW9uKCkpO1xuICAgICAgICAgICAgfSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlICAgID0gVUkuJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlID0gZWxlLmRhdGEoJ29mZnNldC1iZWZvcmUnKTtcbiAgICAgICAgICAgICAgICBlbGUuY3NzKHsncG9zaXRpb24nOidhYnNvbHV0ZScsICd0b3AnOmJlZm9yZS50b3AsICdsZWZ0JzpiZWZvcmUubGVmdCwgJ21pbi13aWR0aCc6YmVmb3JlLndpZHRoIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgICAgPSBVSS4kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmUgPSBlbGUuZGF0YSgnb2Zmc2V0LWJlZm9yZScpLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBlbGUuZGF0YSgnb2Zmc2V0LWFmdGVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpLndpZHRoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLmFuaW1hdGUoeyd0b3AnOm9mZnNldC50b3AsICdsZWZ0JzpvZmZzZXQubGVmdH0sICR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuY3NzKHsncG9zaXRpb24nOicnLCd0b3AnOicnLCAnbGVmdCc6JycsICdtaW4td2lkdGgnOiAnJywgJ3BvaW50ZXItZXZlbnRzJzonJ30pLnJlbW92ZUNsYXNzKCR0aGlzLm9wdGlvbnMub3ZlckNsYXNzKS5yZW1vdmVEYXRhKCdjaGlsZC1kcmFnZW50ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVJLlV0aWxzLmNoZWNrRGlzcGxheSgkdGhpcy5lbGVtZW50LnBhcmVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtdLCBpdGVtLCBhdHRyaWJ1dGU7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oaiwgY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBpdGVtID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGF0dHIsIHZhbDsgaSA8IGNoaWxkLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gY2hpbGQuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5uYW1lLmluZGV4T2YoJ2RhdGEtJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgICAgICAgPSBhdHRyaWJ1dGUubmFtZS5zdWJzdHIoNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgICAgICAgID0gIFVJLlV0aWxzLnN0cjJqc29uKGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtW2F0dHJdID0gKHZhbCB8fCBhdHRyaWJ1dGUudmFsdWU9PSdmYWxzZScgfHwgYXR0cmlidXRlLnZhbHVlPT0nMCcpID8gdmFsOmF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tFbXB0eUxpc3Q6IGZ1bmN0aW9uKGxpc3QpIHtcblxuICAgICAgICAgICAgbGlzdCAgPSBsaXN0ID8gVUkuJChsaXN0KSA6IHRoaXMuZWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbXB0eUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgbGlzdFshbGlzdC5jaGlsZHJlbigpLmxlbmd0aCA/ICdhZGRDbGFzcyc6J3JlbW92ZUNsYXNzJ10odGhpcy5vcHRpb25zLmVtcHR5Q2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBoZWxwZXJzXG5cbiAgICBmdW5jdGlvbiBpc0JlbG93KGVsMSwgZWwyKSB7XG5cbiAgICAgICAgdmFyIHBhcmVudCA9IGVsMS5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChlbDIucGFyZW50Tm9kZSAhPSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXIgPSBlbDEucHJldmlvdXNTaWJsaW5nO1xuXG4gICAgICAgIHdoaWxlIChjdXIgJiYgY3VyLm5vZGVUeXBlICE9PSA5KSB7XG4gICAgICAgICAgICBpZiAoY3VyID09PSBlbDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1ciA9IGN1ci5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZVVwVG9DaGlsZE5vZGUocGFyZW50LCBjaGlsZCkge1xuICAgICAgICB2YXIgY3VyID0gY2hpbGQ7XG4gICAgICAgIGlmIChjdXIgPT0gcGFyZW50KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgICAgd2hpbGUgKGN1cikge1xuICAgICAgICAgICAgaWYgKGN1ci5wYXJlbnROb2RlID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXIgPSBjdXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmICggIWN1ciB8fCAhY3VyLm93bmVyRG9jdW1lbnQgfHwgY3VyLm5vZGVUeXBlID09PSAxMSApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2ZW50KGUpIHtcbiAgICAgICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBVSS5zb3J0YWJsZTtcbn0pO1xuIl19