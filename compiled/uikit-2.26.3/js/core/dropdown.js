"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (UI) {

    "use strict";

    var active = false,
        hoverIdle,
        flips = {
        'x': {
            "bottom-left": 'bottom-right',
            "bottom-right": 'bottom-left',
            "bottom-center": 'bottom-center',
            "top-left": 'top-right',
            "top-right": 'top-left',
            "top-center": 'top-center',
            "left-top": 'right-top',
            "left-bottom": 'right-bottom',
            "left-center": 'right-center',
            "right-top": 'left-top',
            "right-bottom": 'left-bottom',
            "right-center": 'left-center'
        },
        'y': {
            "bottom-left": 'top-left',
            "bottom-right": 'top-right',
            "bottom-center": 'top-center',
            "top-left": 'bottom-left',
            "top-right": 'bottom-right',
            "top-center": 'bottom-center',
            "left-top": 'left-bottom',
            "left-bottom": 'left-top',
            "left-center": 'left-center',
            "right-top": 'right-bottom',
            "right-bottom": 'right-top',
            "right-center": 'right-center'
        },
        'xy': {
            "bottom-left": 'top-right',
            "bottom-right": 'top-left',
            "bottom-center": 'top-center',
            "top-left": 'bottom-right',
            "top-right": 'bottom-left',
            "top-center": 'bottom-center',
            "left-top": 'right-bottom',
            "left-bottom": 'right-top',
            "left-center": 'right-center',
            "right-top": 'left-bottom',
            "right-bottom": 'left-top',
            "right-center": 'left-center'
        }
    };

    UI.component('dropdown', {

        defaults: {
            'mode': 'hover',
            'pos': 'bottom-left',
            'offset': 0,
            'remaintime': 800,
            'justify': false,
            'boundary': UI.$win,
            'delay': 0,
            'dropdownSelector': '.uk-dropdown,.uk-dropdown-blank',
            'hoverDelayIdle': 250,
            'preventflip': false
        },

        remainIdle: false,

        boot: function boot() {

            var triggerevent = UI.support.touch ? "click" : "mouseenter";

            // init code
            UI.$html.on(triggerevent + ".dropdown.uikit", "[data-uk-dropdown]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("dropdown")) {

                    var dropdown = UI.dropdown(ele, UI.Utils.options(ele.attr("data-uk-dropdown")));

                    if (triggerevent == "click" || triggerevent == "mouseenter" && dropdown.options.mode == "hover") {
                        dropdown.element.trigger(triggerevent);
                    }

                    if (dropdown.element.find(dropdown.options.dropdownSelector).length) {
                        e.preventDefault();
                    }
                }
            });
        },

        init: function init() {

            var $this = this;

            this.dropdown = this.find(this.options.dropdownSelector);
            this.offsetParent = this.dropdown.parents().filter(function () {
                return UI.$.inArray(UI.$(this).css('position'), ['relative', 'fixed', 'absolute']) !== -1;
            }).slice(0, 1);

            this.centered = this.dropdown.hasClass('uk-dropdown-center');
            this.justified = this.options.justify ? UI.$(this.options.justify) : false;

            this.boundary = UI.$(this.options.boundary);

            if (!this.boundary.length) {
                this.boundary = UI.$win;
            }

            // legacy DEPRECATED!
            if (this.dropdown.hasClass('uk-dropdown-up')) {
                this.options.pos = 'top-left';
            }
            if (this.dropdown.hasClass('uk-dropdown-flip')) {
                this.options.pos = this.options.pos.replace('left', 'right');
            }
            if (this.dropdown.hasClass('uk-dropdown-center')) {
                this.options.pos = this.options.pos.replace(/(left|right)/, 'center');
            }
            //-- end legacy

            // Init ARIA
            this.element.attr('aria-haspopup', 'true');
            this.element.attr('aria-expanded', this.element.hasClass("uk-open"));

            if (this.options.mode == "click" || UI.support.touch) {

                this.on("click.uk.dropdown", function (e) {

                    var $target = UI.$(e.target);

                    if (!$target.parents($this.options.dropdownSelector).length) {

                        if ($target.is("a[href='#']") || $target.parent().is("a[href='#']") || $this.dropdown.length && !$this.dropdown.is(":visible")) {
                            e.preventDefault();
                        }

                        $target.blur();
                    }

                    if (!$this.element.hasClass('uk-open')) {

                        $this.show();
                    } else {

                        if (!$this.dropdown.find(e.target).length || $target.is(".uk-dropdown-close") || $target.parents(".uk-dropdown-close").length) {
                            $this.hide();
                        }
                    }
                });
            } else {

                this.on("mouseenter", function (e) {

                    $this.trigger('pointerenter.uk.dropdown', [$this]);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    if (active && active == $this) {
                        return;
                    }

                    // pseudo manuAim
                    if (active && active != $this) {

                        hoverIdle = setTimeout(function () {
                            hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);
                        }, $this.options.hoverDelayIdle);
                    } else {

                        hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);
                    }
                }).on("mouseleave", function () {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    $this.remainIdle = setTimeout(function () {
                        if (active && active == $this) $this.hide();
                    }, $this.options.remaintime);

                    $this.trigger('pointerleave.uk.dropdown', [$this]);
                }).on("click", function (e) {

                    var $target = UI.$(e.target);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (active && active == $this) {
                        if (!$this.dropdown.find(e.target).length || $target.is(".uk-dropdown-close") || $target.parents(".uk-dropdown-close").length) {
                            $this.hide();
                        }
                        return;
                    }

                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")) {
                        e.preventDefault();
                    }

                    $this.show();
                });
            }
        },

        show: function show() {

            UI.$html.off("click.outer.dropdown");

            if (active && active != this) {
                active.hide(true);
            }

            if (hoverIdle) {
                clearTimeout(hoverIdle);
            }

            this.trigger('beforeshow.uk.dropdown', [this]);

            this.checkDimensions();
            this.element.addClass('uk-open');

            // Update ARIA
            this.element.attr('aria-expanded', 'true');

            this.trigger('show.uk.dropdown', [this]);

            UI.Utils.checkDisplay(this.dropdown, true);
            active = this;

            this.registerOuterClick();
        },

        hide: function hide(force) {

            this.trigger('beforehide.uk.dropdown', [this, force]);

            this.element.removeClass('uk-open');

            if (this.remainIdle) {
                clearTimeout(this.remainIdle);
            }

            this.remainIdle = false;

            // Update ARIA
            this.element.attr('aria-expanded', 'false');

            this.trigger('hide.uk.dropdown', [this, force]);

            if (active == this) active = false;
        },

        registerOuterClick: function registerOuterClick() {

            var $this = this;

            UI.$html.off("click.outer.dropdown");

            setTimeout(function () {

                UI.$html.on("click.outer.dropdown", function (e) {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    var $target = UI.$(e.target);

                    if (active == $this && !$this.element.find(e.target).length) {
                        $this.hide(true);
                        UI.$html.off("click.outer.dropdown");
                    }
                });
            }, 10);
        },

        checkDimensions: function checkDimensions() {

            if (!this.dropdown.length) return;

            // reset
            this.dropdown.removeClass('uk-dropdown-top uk-dropdown-bottom uk-dropdown-left uk-dropdown-right uk-dropdown-stack').css({
                'top-left': '',
                'left': '',
                'margin-left': '',
                'margin-right': ''
            });

            if (this.justified && this.justified.length) {
                this.dropdown.css("min-width", "");
            }

            var $this = this,
                pos = UI.$.extend({}, this.offsetParent.offset(), { width: this.offsetParent[0].offsetWidth, height: this.offsetParent[0].offsetHeight }),
                posoffset = this.options.offset,
                dropdown = this.dropdown,
                offset = dropdown.show().offset() || { left: 0, top: 0 },
                width = dropdown.outerWidth(),
                height = dropdown.outerHeight(),
                boundarywidth = this.boundary.width(),
                boundaryoffset = this.boundary[0] !== window && this.boundary.offset() ? this.boundary.offset() : { top: 0, left: 0 },
                dpos = this.options.pos;

            var variants = {
                "bottom-left": { top: 0 + pos.height + posoffset, left: 0 },
                "bottom-right": { top: 0 + pos.height + posoffset, left: 0 + pos.width - width },
                "bottom-center": { top: 0 + pos.height + posoffset, left: 0 + pos.width / 2 - width / 2 },
                "top-left": { top: 0 - height - posoffset, left: 0 },
                "top-right": { top: 0 - height - posoffset, left: 0 + pos.width - width },
                "top-center": { top: 0 - height - posoffset, left: 0 + pos.width / 2 - width / 2 },
                "left-top": { top: 0, left: 0 - width - posoffset },
                "left-bottom": { top: 0 + pos.height - height, left: 0 - width - posoffset },
                "left-center": { top: 0 + pos.height / 2 - height / 2, left: 0 - width - posoffset },
                "right-top": { top: 0, left: 0 + pos.width + posoffset },
                "right-bottom": { top: 0 + pos.height - height, left: 0 + pos.width + posoffset },
                "right-center": { top: 0 + pos.height / 2 - height / 2, left: 0 + pos.width + posoffset }
            },
                css = {},
                pp;

            pp = dpos.split('-');
            css = variants[dpos] ? variants[dpos] : variants['bottom-left'];

            // justify dropdown
            if (this.justified && this.justified.length) {
                justify(dropdown.css({ left: 0 }), this.justified, boundarywidth);
            } else {

                if (this.options.preventflip !== true) {

                    var fdpos;

                    switch (this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundarywidth)) {
                        case "x":
                            if (this.options.preventflip !== 'x') fdpos = flips['x'][dpos] || 'right-top';
                            break;
                        case "y":
                            if (this.options.preventflip !== 'y') fdpos = flips['y'][dpos] || 'top-left';
                            break;
                        case "xy":
                            if (!this.options.preventflip) fdpos = flips['xy'][dpos] || 'right-bottom';
                            break;
                    }

                    if (fdpos) {

                        pp = fdpos.split('-');
                        css = variants[fdpos] ? variants[fdpos] : variants['bottom-left'];

                        // check flipped
                        if (this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundarywidth)) {
                            pp = dpos.split('-');
                            css = variants[dpos] ? variants[dpos] : variants['bottom-left'];
                        }
                    }
                }
            }

            if (width > boundarywidth) {
                dropdown.addClass("uk-dropdown-stack");
                this.trigger('stack.uk.dropdown', [this]);
            }

            dropdown.css(css).css("display", "").addClass('uk-dropdown-' + pp[0]);
        },

        checkBoundary: function checkBoundary(left, top, width, height, boundarywidth) {

            var axis = "";

            if (left < 0 || left - UI.$win.scrollLeft() + width > boundarywidth) {
                axis += "x";
            }

            if (top - UI.$win.scrollTop() < 0 || top - UI.$win.scrollTop() + height > window.innerHeight) {
                axis += "y";
            }

            return axis;
        }
    });

    UI.component('dropdownOverlay', {

        defaults: {
            'justify': false,
            'cls': '',
            'duration': 200
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-dropdown-overlay]", context).each(function () {
                    var ele = UI.$(this);

                    if (!ele.data("dropdownOverlay")) {
                        UI.dropdownOverlay(ele, UI.Utils.options(ele.attr("data-uk-dropdown-overlay")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.justified = this.options.justify ? UI.$(this.options.justify) : false;
            this.overlay = this.element.find('uk-dropdown-overlay');

            if (!this.overlay.length) {
                this.overlay = UI.$('<div class="uk-dropdown-overlay"></div>').appendTo(this.element);
            }

            this.overlay.addClass(this.options.cls);

            this.on({

                'beforeshow.uk.dropdown': function beforeshowUkDropdown(e, dropdown) {
                    $this.dropdown = dropdown;

                    if ($this.justified && $this.justified.length) {
                        justify($this.overlay.css({ 'display': 'block', 'margin-left': '', 'margin-right': '' }), $this.justified, $this.justified.outerWidth());
                    }
                },

                'show.uk.dropdown': function showUkDropdown(e, dropdown) {

                    var h = $this.dropdown.dropdown.outerHeight(true);

                    $this.dropdown.element.removeClass('uk-open');

                    $this.overlay.stop().css('display', 'block').animate({ height: h }, $this.options.duration, function () {

                        $this.dropdown.dropdown.css('visibility', '');
                        $this.dropdown.element.addClass('uk-open');

                        UI.Utils.checkDisplay($this.dropdown.dropdown, true);
                    });

                    $this.pointerleave = false;
                },

                'hide.uk.dropdown': function hideUkDropdown() {
                    $this.overlay.stop().animate({ height: 0 }, $this.options.duration);
                },

                'pointerenter.uk.dropdown': function pointerenterUkDropdown(e, dropdown) {
                    clearTimeout($this.remainIdle);
                },

                'pointerleave.uk.dropdown': function pointerleaveUkDropdown(e, dropdown) {
                    $this.pointerleave = true;
                }
            });

            this.overlay.on({

                'mouseenter': function mouseenter() {
                    if ($this.remainIdle) {
                        clearTimeout($this.dropdown.remainIdle);
                        clearTimeout($this.remainIdle);
                    }
                },

                'mouseleave': function mouseleave() {

                    if ($this.pointerleave && active) {

                        $this.remainIdle = setTimeout(function () {
                            if (active) active.hide();
                        }, active.options.remaintime);
                    }
                }
            });
        }

    });

    function justify(ele, justifyTo, boundarywidth, offset) {

        ele = UI.$(ele);
        justifyTo = UI.$(justifyTo);
        boundarywidth = boundarywidth || window.innerWidth;
        offset = offset || ele.offset();

        if (justifyTo.length) {

            var jwidth = justifyTo.outerWidth();

            ele.css("min-width", jwidth);

            if (UI.langdirection == 'right') {

                var right1 = boundarywidth - (justifyTo.offset().left + jwidth),
                    right2 = boundarywidth - (ele.offset().left + ele.outerWidth());

                ele.css("margin-right", right1 - right2);
            } else {
                ele.css("margin-left", justifyTo.offset().left - offset.left);
            }
        }
    }
})(UIkit);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL2Ryb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLENBQUMsVUFBUyxFQUFULEVBQWE7O0FBRVY7O0FBRUEsUUFBSSxTQUFTLEtBQWI7QUFBQSxRQUFvQixTQUFwQjtBQUFBLFFBQStCLFFBQVE7QUFDbkMsYUFBSztBQUNELDJCQUFrQixjQURqQjtBQUVELDRCQUFrQixhQUZqQjtBQUdELDZCQUFrQixlQUhqQjtBQUlELHdCQUFrQixXQUpqQjtBQUtELHlCQUFrQixVQUxqQjtBQU1ELDBCQUFrQixZQU5qQjtBQU9ELHdCQUFrQixXQVBqQjtBQVFELDJCQUFrQixjQVJqQjtBQVNELDJCQUFrQixjQVRqQjtBQVVELHlCQUFrQixVQVZqQjtBQVdELDRCQUFrQixhQVhqQjtBQVlELDRCQUFrQjtBQVpqQixTQUQ4QjtBQWVuQyxhQUFLO0FBQ0QsMkJBQWtCLFVBRGpCO0FBRUQsNEJBQWtCLFdBRmpCO0FBR0QsNkJBQWtCLFlBSGpCO0FBSUQsd0JBQWtCLGFBSmpCO0FBS0QseUJBQWtCLGNBTGpCO0FBTUQsMEJBQWtCLGVBTmpCO0FBT0Qsd0JBQWtCLGFBUGpCO0FBUUQsMkJBQWtCLFVBUmpCO0FBU0QsMkJBQWtCLGFBVGpCO0FBVUQseUJBQWtCLGNBVmpCO0FBV0QsNEJBQWtCLFdBWGpCO0FBWUQsNEJBQWtCO0FBWmpCLFNBZjhCO0FBNkJuQyxjQUFNO0FBQ0YsMkJBQWtCLFdBRGhCO0FBRUYsNEJBQWtCLFVBRmhCO0FBR0YsNkJBQWtCLFlBSGhCO0FBSUYsd0JBQWtCLGNBSmhCO0FBS0YseUJBQWtCLGFBTGhCO0FBTUYsMEJBQWtCLGVBTmhCO0FBT0Ysd0JBQWtCLGNBUGhCO0FBUUYsMkJBQWtCLFdBUmhCO0FBU0YsMkJBQWtCLGNBVGhCO0FBVUYseUJBQWtCLGFBVmhCO0FBV0YsNEJBQWtCLFVBWGhCO0FBWUYsNEJBQWtCO0FBWmhCO0FBN0I2QixLQUF2Qzs7QUE2Q0EsT0FB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QUVwRCxjQUFnQixHQUFHLENBQUgsQ0FBSyxHQUFMLENBQWhCO0FBQ0Esb0JBQWdCLEdBQUcsQ0FBSCxDQUFLLFNBQUwsQ0FBaEI7QUFDQSx3QkFBZ0IsaUJBQWlCLE9BQU8sVUFBeEM7QUFDQSxpQkFBZ0IsVUFBVSxJQUFJLE1BQUosRUFBMUI7O0FBRUEsWUFBSSxVQUFVLE1BQWQsRUFBc0I7O0FBRWxCLGdCQUFJLFNBQVMsVUFBVSxVQUFWLEVBQWI7O0FBRUEsZ0JBQUksR0FBSixDQUFRLFdBQVIsRUFBcUIsTUFBckI7O0FBRUEsZ0JBQUksR0FBRyxhQUFILElBQW9CLE9BQXhCLEVBQWlDOztBQUU3QixvQkFBSSxTQUFXLGlCQUFpQixVQUFVLE1BQVYsR0FBbUIsSUFBbkIsR0FBMEIsTUFBM0MsQ0FBZjtBQUFBLG9CQUNJLFNBQVcsaUJBQWlCLElBQUksTUFBSixHQUFhLElBQWIsR0FBb0IsSUFBSSxVQUFKLEVBQXJDLENBRGY7O0FBR0Esb0JBQUksR0FBSixDQUFRLGNBQVIsRUFBd0IsU0FBUyxNQUFqQztBQUVILGFBUEQsTUFPTztBQUNILG9CQUFJLEdBQUosQ0FBUSxhQUFSLEVBQXVCLFVBQVUsTUFBVixHQUFtQixJQUFuQixHQUEwQixPQUFPLElBQXhEO0FBQ0g7QUFDSjtBQUNKO0FBRUosQ0EzZ0JELEVBMmdCRyxLQTNnQkgiLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oVUkpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGFjdGl2ZSA9IGZhbHNlLCBob3ZlcklkbGUsIGZsaXBzID0ge1xuICAgICAgICAneCc6IHtcbiAgICAgICAgICAgIFwiYm90dG9tLWxlZnRcIiAgIDogJ2JvdHRvbS1yaWdodCcsXG4gICAgICAgICAgICBcImJvdHRvbS1yaWdodFwiICA6ICdib3R0b20tbGVmdCcsXG4gICAgICAgICAgICBcImJvdHRvbS1jZW50ZXJcIiA6ICdib3R0b20tY2VudGVyJyxcbiAgICAgICAgICAgIFwidG9wLWxlZnRcIiAgICAgIDogJ3RvcC1yaWdodCcsXG4gICAgICAgICAgICBcInRvcC1yaWdodFwiICAgICA6ICd0b3AtbGVmdCcsXG4gICAgICAgICAgICBcInRvcC1jZW50ZXJcIiAgICA6ICd0b3AtY2VudGVyJyxcbiAgICAgICAgICAgIFwibGVmdC10b3BcIiAgICAgIDogJ3JpZ2h0LXRvcCcsXG4gICAgICAgICAgICBcImxlZnQtYm90dG9tXCIgICA6ICdyaWdodC1ib3R0b20nLFxuICAgICAgICAgICAgXCJsZWZ0LWNlbnRlclwiICAgOiAncmlnaHQtY2VudGVyJyxcbiAgICAgICAgICAgIFwicmlnaHQtdG9wXCIgICAgIDogJ2xlZnQtdG9wJyxcbiAgICAgICAgICAgIFwicmlnaHQtYm90dG9tXCIgIDogJ2xlZnQtYm90dG9tJyxcbiAgICAgICAgICAgIFwicmlnaHQtY2VudGVyXCIgIDogJ2xlZnQtY2VudGVyJ1xuICAgICAgICB9LFxuICAgICAgICAneSc6IHtcbiAgICAgICAgICAgIFwiYm90dG9tLWxlZnRcIiAgIDogJ3RvcC1sZWZ0JyxcbiAgICAgICAgICAgIFwiYm90dG9tLXJpZ2h0XCIgIDogJ3RvcC1yaWdodCcsXG4gICAgICAgICAgICBcImJvdHRvbS1jZW50ZXJcIiA6ICd0b3AtY2VudGVyJyxcbiAgICAgICAgICAgIFwidG9wLWxlZnRcIiAgICAgIDogJ2JvdHRvbS1sZWZ0JyxcbiAgICAgICAgICAgIFwidG9wLXJpZ2h0XCIgICAgIDogJ2JvdHRvbS1yaWdodCcsXG4gICAgICAgICAgICBcInRvcC1jZW50ZXJcIiAgICA6ICdib3R0b20tY2VudGVyJyxcbiAgICAgICAgICAgIFwibGVmdC10b3BcIiAgICAgIDogJ2xlZnQtYm90dG9tJyxcbiAgICAgICAgICAgIFwibGVmdC1ib3R0b21cIiAgIDogJ2xlZnQtdG9wJyxcbiAgICAgICAgICAgIFwibGVmdC1jZW50ZXJcIiAgIDogJ2xlZnQtY2VudGVyJyxcbiAgICAgICAgICAgIFwicmlnaHQtdG9wXCIgICAgIDogJ3JpZ2h0LWJvdHRvbScsXG4gICAgICAgICAgICBcInJpZ2h0LWJvdHRvbVwiICA6ICdyaWdodC10b3AnLFxuICAgICAgICAgICAgXCJyaWdodC1jZW50ZXJcIiAgOiAncmlnaHQtY2VudGVyJ1xuICAgICAgICB9LFxuICAgICAgICAneHknOiB7XG4gICAgICAgICAgICBcImJvdHRvbS1sZWZ0XCIgICA6ICd0b3AtcmlnaHQnLFxuICAgICAgICAgICAgXCJib3R0b20tcmlnaHRcIiAgOiAndG9wLWxlZnQnLFxuICAgICAgICAgICAgXCJib3R0b20tY2VudGVyXCIgOiAndG9wLWNlbnRlcicsXG4gICAgICAgICAgICBcInRvcC1sZWZ0XCIgICAgICA6ICdib3R0b20tcmlnaHQnLFxuICAgICAgICAgICAgXCJ0b3AtcmlnaHRcIiAgICAgOiAnYm90dG9tLWxlZnQnLFxuICAgICAgICAgICAgXCJ0b3AtY2VudGVyXCIgICAgOiAnYm90dG9tLWNlbnRlcicsXG4gICAgICAgICAgICBcImxlZnQtdG9wXCIgICAgICA6ICdyaWdodC1ib3R0b20nLFxuICAgICAgICAgICAgXCJsZWZ0LWJvdHRvbVwiICAgOiAncmlnaHQtdG9wJyxcbiAgICAgICAgICAgIFwibGVmdC1jZW50ZXJcIiAgIDogJ3JpZ2h0LWNlbnRlcicsXG4gICAgICAgICAgICBcInJpZ2h0LXRvcFwiICAgICA6ICdsZWZ0LWJvdHRvbScsXG4gICAgICAgICAgICBcInJpZ2h0LWJvdHRvbVwiICA6ICdsZWZ0LXRvcCcsXG4gICAgICAgICAgICBcInJpZ2h0LWNlbnRlclwiICA6ICdsZWZ0LWNlbnRlcidcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBVSS5jb21wb25lbnQoJ2Ryb3Bkb3duJywge1xuXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICdtb2RlJyAgICAgICAgICAgIDogJ2hvdmVyJyxcbiAgICAgICAgICAgJ3BvcycgICAgICAgICAgICAgOiAnYm90dG9tLWxlZnQnLFxuICAgICAgICAgICAnb2Zmc2V0JyAgICAgICAgICA6IDAsXG4gICAgICAgICAgICdyZW1haW50aW1lJyAgICAgIDogODAwLFxuICAgICAgICAgICAnanVzdGlmeScgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAnYm91bmRhcnknICAgICAgICA6IFVJLiR3aW4sXG4gICAgICAgICAgICdkZWxheScgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgJ2Ryb3Bkb3duU2VsZWN0b3InOiAnLnVrLWRyb3Bkb3duLC51ay1kcm9wZG93bi1ibGFuaycsXG4gICAgICAgICAgICdob3ZlckRlbGF5SWRsZScgIDogMjUwLFxuICAgICAgICAgICAncHJldmVudGZsaXAnICAgICA6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtYWluSWRsZTogZmFsc2UsXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciB0cmlnZ2VyZXZlbnQgPSBVSS5zdXBwb3J0LnRvdWNoID8gXCJjbGlja1wiIDogXCJtb3VzZWVudGVyXCI7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkuJGh0bWwub24odHJpZ2dlcmV2ZW50K1wiLmRyb3Bkb3duLnVpa2l0XCIsIFwiW2RhdGEtdWstZHJvcGRvd25dXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcImRyb3Bkb3duXCIpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRyb3Bkb3duID0gVUkuZHJvcGRvd24oZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1kcm9wZG93blwiKSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyZXZlbnQ9PVwiY2xpY2tcIiB8fCAodHJpZ2dlcmV2ZW50PT1cIm1vdXNlZW50ZXJcIiAmJiBkcm9wZG93bi5vcHRpb25zLm1vZGU9PVwiaG92ZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmVsZW1lbnQudHJpZ2dlcih0cmlnZ2VyZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyb3Bkb3duLmVsZW1lbnQuZmluZChkcm9wZG93bi5vcHRpb25zLmRyb3Bkb3duU2VsZWN0b3IpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24gICAgID0gdGhpcy5maW5kKHRoaXMub3B0aW9ucy5kcm9wZG93blNlbGVjdG9yKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0UGFyZW50ID0gdGhpcy5kcm9wZG93bi5wYXJlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVSS4kLmluQXJyYXkoVUkuJCh0aGlzKS5jc3MoJ3Bvc2l0aW9uJyksIFsncmVsYXRpdmUnLCAnZml4ZWQnLCAnYWJzb2x1dGUnXSkgIT09IC0xO1xuICAgICAgICAgICAgfSkuc2xpY2UoMCwxKTtcblxuICAgICAgICAgICAgdGhpcy5jZW50ZXJlZCAgPSB0aGlzLmRyb3Bkb3duLmhhc0NsYXNzKCd1ay1kcm9wZG93bi1jZW50ZXInKTtcbiAgICAgICAgICAgIHRoaXMuanVzdGlmaWVkID0gdGhpcy5vcHRpb25zLmp1c3RpZnkgPyBVSS4kKHRoaXMub3B0aW9ucy5qdXN0aWZ5KSA6IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLmJvdW5kYXJ5ICA9IFVJLiQodGhpcy5vcHRpb25zLmJvdW5kYXJ5KTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmJvdW5kYXJ5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYm91bmRhcnkgPSBVSS4kd2luO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBsZWdhY3kgREVQUkVDQVRFRCFcbiAgICAgICAgICAgIGlmICh0aGlzLmRyb3Bkb3duLmhhc0NsYXNzKCd1ay1kcm9wZG93bi11cCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBvcyA9ICd0b3AtbGVmdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bi5oYXNDbGFzcygndWstZHJvcGRvd24tZmxpcCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBvcyA9IHRoaXMub3B0aW9ucy5wb3MucmVwbGFjZSgnbGVmdCcsJ3JpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bi5oYXNDbGFzcygndWstZHJvcGRvd24tY2VudGVyJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucG9zID0gdGhpcy5vcHRpb25zLnBvcy5yZXBsYWNlKC8obGVmdHxyaWdodCkvLCdjZW50ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vLS0gZW5kIGxlZ2FjeVxuXG4gICAgICAgICAgICAvLyBJbml0IEFSSUFcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWhhc3BvcHVwJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdGhpcy5lbGVtZW50Lmhhc0NsYXNzKFwidWstb3BlblwiKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubW9kZSA9PSBcImNsaWNrXCIgfHwgVUkuc3VwcG9ydC50b3VjaCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbihcImNsaWNrLnVrLmRyb3Bkb3duXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRhcmdldCA9IFVJLiQoZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJHRhcmdldC5wYXJlbnRzKCR0aGlzLm9wdGlvbnMuZHJvcGRvd25TZWxlY3RvcikubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKFwiYVtocmVmPScjJ11cIikgfHwgJHRhcmdldC5wYXJlbnQoKS5pcyhcImFbaHJlZj0nIyddXCIpIHx8ICgkdGhpcy5kcm9wZG93bi5sZW5ndGggJiYgISR0aGlzLmRyb3Bkb3duLmlzKFwiOnZpc2libGVcIikpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJHRoaXMuZWxlbWVudC5oYXNDbGFzcygndWstb3BlbicpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmRyb3Bkb3duLmZpbmQoZS50YXJnZXQpLmxlbmd0aCB8fCAkdGFyZ2V0LmlzKFwiLnVrLWRyb3Bkb3duLWNsb3NlXCIpIHx8ICR0YXJnZXQucGFyZW50cyhcIi51ay1kcm9wZG93bi1jbG9zZVwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHRoaXMub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdwb2ludGVyZW50ZXIudWsuZHJvcGRvd24nLCBbJHRoaXNdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMucmVtYWluSWRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCR0aGlzLnJlbWFpbklkbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdmVySWRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGhvdmVySWRsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlICYmIGFjdGl2ZSA9PSAkdGhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcHNldWRvIG1hbnVBaW1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSAmJiBhY3RpdmUgIT0gJHRoaXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXJJZGxlID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3ZlcklkbGUgPSBzZXRUaW1lb3V0KCR0aGlzLnNob3cuYmluZCgkdGhpcyksICR0aGlzLm9wdGlvbnMuZGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHRoaXMub3B0aW9ucy5ob3ZlckRlbGF5SWRsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXJJZGxlID0gc2V0VGltZW91dCgkdGhpcy5zaG93LmJpbmQoJHRoaXMpLCAkdGhpcy5vcHRpb25zLmRlbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSkub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3ZlcklkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChob3ZlcklkbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVtYWluSWRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlICYmIGFjdGl2ZSA9PSAkdGhpcykgJHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LCAkdGhpcy5vcHRpb25zLnJlbWFpbnRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3BvaW50ZXJsZWF2ZS51ay5kcm9wZG93bicsIFskdGhpc10pO1xuXG4gICAgICAgICAgICAgICAgfSkub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRhcmdldCA9IFVJLiQoZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5yZW1haW5JZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoJHRoaXMucmVtYWluSWRsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlICYmIGFjdGl2ZSA9PSAkdGhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkdGhpcy5kcm9wZG93bi5maW5kKGUudGFyZ2V0KS5sZW5ndGggfHwgJHRhcmdldC5pcyhcIi51ay1kcm9wZG93bi1jbG9zZVwiKSB8fCAkdGFyZ2V0LnBhcmVudHMoXCIudWstZHJvcGRvd24tY2xvc2VcIikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoXCJhW2hyZWY9JyMnXVwiKSB8fCAkdGFyZ2V0LnBhcmVudCgpLmlzKFwiYVtocmVmPScjJ11cIikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIFVJLiRodG1sLm9mZihcImNsaWNrLm91dGVyLmRyb3Bkb3duXCIpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlICYmIGFjdGl2ZSAhPSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlLmhpZGUodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChob3ZlcklkbGUpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaG92ZXJJZGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdiZWZvcmVzaG93LnVrLmRyb3Bkb3duJywgW3RoaXNdKTtcblxuICAgICAgICAgICAgdGhpcy5jaGVja0RpbWVuc2lvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygndWstb3BlbicpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgQVJJQVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3Nob3cudWsuZHJvcGRvd24nLCBbdGhpc10pO1xuXG4gICAgICAgICAgICBVSS5VdGlscy5jaGVja0Rpc3BsYXkodGhpcy5kcm9wZG93biwgdHJ1ZSk7XG4gICAgICAgICAgICBhY3RpdmUgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyT3V0ZXJDbGljaygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKGZvcmNlKSB7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignYmVmb3JlaGlkZS51ay5kcm9wZG93bicsIFt0aGlzLCBmb3JjZV0pO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3VrLW9wZW4nKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmVtYWluSWRsZSkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbWFpbklkbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlbWFpbklkbGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIEFSSUFcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcignaGlkZS51ay5kcm9wZG93bicsIFt0aGlzLCBmb3JjZV0pO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlID09IHRoaXMpIGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlZ2lzdGVyT3V0ZXJDbGljazogZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgVUkuJGh0bWwub2ZmKFwiY2xpY2sub3V0ZXIuZHJvcGRvd25cIik7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kaHRtbC5vbihcImNsaWNrLm91dGVyLmRyb3Bkb3duXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaG92ZXJJZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaG92ZXJJZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gVUkuJChlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PSAkdGhpcyAmJiAhJHRoaXMuZWxlbWVudC5maW5kKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmhpZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS4kaHRtbC5vZmYoXCJjbGljay5vdXRlci5kcm9wZG93blwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrRGltZW5zaW9uczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcm9wZG93bi5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ3VrLWRyb3Bkb3duLXRvcCB1ay1kcm9wZG93bi1ib3R0b20gdWstZHJvcGRvd24tbGVmdCB1ay1kcm9wZG93bi1yaWdodCB1ay1kcm9wZG93bi1zdGFjaycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RvcC1sZWZ0JzonJyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6JycsXG4gICAgICAgICAgICAgICAgJ21hcmdpbi1sZWZ0JyA6JycsXG4gICAgICAgICAgICAgICAgJ21hcmdpbi1yaWdodCc6JydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5qdXN0aWZpZWQgJiYgdGhpcy5qdXN0aWZpZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5jc3MoXCJtaW4td2lkdGhcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgICAgICAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcG9zICAgICAgICAgICAgPSBVSS4kLmV4dGVuZCh7fSwgdGhpcy5vZmZzZXRQYXJlbnQub2Zmc2V0KCksIHt3aWR0aDogdGhpcy5vZmZzZXRQYXJlbnRbMF0ub2Zmc2V0V2lkdGgsIGhlaWdodDogdGhpcy5vZmZzZXRQYXJlbnRbMF0ub2Zmc2V0SGVpZ2h0fSksXG4gICAgICAgICAgICAgICAgcG9zb2Zmc2V0ICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0LFxuICAgICAgICAgICAgICAgIGRyb3Bkb3duICAgICAgID0gdGhpcy5kcm9wZG93bixcbiAgICAgICAgICAgICAgICBvZmZzZXQgICAgICAgICA9IGRyb3Bkb3duLnNob3coKS5vZmZzZXQoKSB8fCB7bGVmdDogMCwgdG9wOiAwfSxcbiAgICAgICAgICAgICAgICB3aWR0aCAgICAgICAgICA9IGRyb3Bkb3duLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQgICAgICAgICA9IGRyb3Bkb3duLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgYm91bmRhcnl3aWR0aCAgPSB0aGlzLmJvdW5kYXJ5LndpZHRoKCksXG4gICAgICAgICAgICAgICAgYm91bmRhcnlvZmZzZXQgPSB0aGlzLmJvdW5kYXJ5WzBdICE9PSB3aW5kb3cgJiYgdGhpcy5ib3VuZGFyeS5vZmZzZXQoKSA/IHRoaXMuYm91bmRhcnkub2Zmc2V0KCk6IHt0b3A6MCwgbGVmdDowfSxcbiAgICAgICAgICAgICAgICBkcG9zICAgICAgICAgICA9IHRoaXMub3B0aW9ucy5wb3M7XG5cbiAgICAgICAgICAgIHZhciB2YXJpYW50cyA9ICB7XG4gICAgICAgICAgICAgICAgICAgIFwiYm90dG9tLWxlZnRcIiAgIDoge3RvcDogMCArIHBvcy5oZWlnaHQgKyBwb3NvZmZzZXQsIGxlZnQ6IDB9LFxuICAgICAgICAgICAgICAgICAgICBcImJvdHRvbS1yaWdodFwiICA6IHt0b3A6IDAgKyBwb3MuaGVpZ2h0ICsgcG9zb2Zmc2V0LCBsZWZ0OiAwICsgcG9zLndpZHRoIC0gd2lkdGh9LFxuICAgICAgICAgICAgICAgICAgICBcImJvdHRvbS1jZW50ZXJcIiA6IHt0b3A6IDAgKyBwb3MuaGVpZ2h0ICsgcG9zb2Zmc2V0LCBsZWZ0OiAwICsgcG9zLndpZHRoIC8gMiAtIHdpZHRoIC8gMn0sXG4gICAgICAgICAgICAgICAgICAgIFwidG9wLWxlZnRcIiAgICAgIDoge3RvcDogMCAtIGhlaWdodCAtIHBvc29mZnNldCwgbGVmdDogMH0sXG4gICAgICAgICAgICAgICAgICAgIFwidG9wLXJpZ2h0XCIgICAgIDoge3RvcDogMCAtIGhlaWdodCAtIHBvc29mZnNldCwgbGVmdDogMCArIHBvcy53aWR0aCAtIHdpZHRofSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0b3AtY2VudGVyXCIgICAgOiB7dG9wOiAwIC0gaGVpZ2h0IC0gcG9zb2Zmc2V0LCBsZWZ0OiAwICsgcG9zLndpZHRoIC8gMiAtIHdpZHRoIC8gMn0sXG4gICAgICAgICAgICAgICAgICAgIFwibGVmdC10b3BcIiAgICAgIDoge3RvcDogMCwgbGVmdDogMCAtIHdpZHRoIC0gcG9zb2Zmc2V0fSxcbiAgICAgICAgICAgICAgICAgICAgXCJsZWZ0LWJvdHRvbVwiICAgOiB7dG9wOiAwICsgcG9zLmhlaWdodCAtIGhlaWdodCwgbGVmdDogMCAtIHdpZHRoIC0gcG9zb2Zmc2V0fSxcbiAgICAgICAgICAgICAgICAgICAgXCJsZWZ0LWNlbnRlclwiICAgOiB7dG9wOiAwICsgcG9zLmhlaWdodCAvIDIgLSBoZWlnaHQgLyAyLCBsZWZ0OiAwIC0gd2lkdGggLSBwb3NvZmZzZXR9LFxuICAgICAgICAgICAgICAgICAgICBcInJpZ2h0LXRvcFwiICAgICA6IHt0b3A6IDAsIGxlZnQ6IDAgKyBwb3Mud2lkdGggKyBwb3NvZmZzZXR9LFxuICAgICAgICAgICAgICAgICAgICBcInJpZ2h0LWJvdHRvbVwiICA6IHt0b3A6IDAgKyBwb3MuaGVpZ2h0IC0gaGVpZ2h0LCBsZWZ0OiAwICsgcG9zLndpZHRoICsgcG9zb2Zmc2V0fSxcbiAgICAgICAgICAgICAgICAgICAgXCJyaWdodC1jZW50ZXJcIiAgOiB7dG9wOiAwICsgcG9zLmhlaWdodCAvIDIgLSBoZWlnaHQgLyAyLCBsZWZ0OiAwICsgcG9zLndpZHRoICsgcG9zb2Zmc2V0fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY3NzID0ge30sXG4gICAgICAgICAgICAgICAgcHA7XG5cbiAgICAgICAgICAgIHBwID0gZHBvcy5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY3NzID0gdmFyaWFudHNbZHBvc10gPyB2YXJpYW50c1tkcG9zXSA6IHZhcmlhbnRzWydib3R0b20tbGVmdCddO1xuXG4gICAgICAgICAgICAvLyBqdXN0aWZ5IGRyb3Bkb3duXG4gICAgICAgICAgICBpZiAodGhpcy5qdXN0aWZpZWQgJiYgdGhpcy5qdXN0aWZpZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAganVzdGlmeShkcm9wZG93bi5jc3Moe2xlZnQ6MH0pLCB0aGlzLmp1c3RpZmllZCwgYm91bmRhcnl3aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50ZmxpcCAhPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmZHBvcztcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jaGVja0JvdW5kYXJ5KHBvcy5sZWZ0ICsgY3NzLmxlZnQsIHBvcy50b3AgKyBjc3MudG9wLCB3aWR0aCwgaGVpZ2h0LCBib3VuZGFyeXdpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMucHJldmVudGZsaXAgIT09J3gnKSBmZHBvcyA9IGZsaXBzWyd4J11bZHBvc10gfHwgJ3JpZ2h0LXRvcCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwieVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5wcmV2ZW50ZmxpcCAhPT0neScpIGZkcG9zID0gZmxpcHNbJ3knXVtkcG9zXSB8fCAndG9wLWxlZnQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInh5XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMub3B0aW9ucy5wcmV2ZW50ZmxpcCkgZmRwb3MgPSBmbGlwc1sneHknXVtkcG9zXSB8fCAncmlnaHQtYm90dG9tJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmZHBvcykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcCAgPSBmZHBvcy5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3NzID0gdmFyaWFudHNbZmRwb3NdID8gdmFyaWFudHNbZmRwb3NdIDogdmFyaWFudHNbJ2JvdHRvbS1sZWZ0J107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZsaXBwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQm91bmRhcnkocG9zLmxlZnQgKyBjc3MubGVmdCwgcG9zLnRvcCArIGNzcy50b3AsIHdpZHRoLCBoZWlnaHQsIGJvdW5kYXJ5d2lkdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHAgID0gZHBvcy5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcyA9IHZhcmlhbnRzW2Rwb3NdID8gdmFyaWFudHNbZHBvc10gOiB2YXJpYW50c1snYm90dG9tLWxlZnQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdpZHRoID4gYm91bmRhcnl3aWR0aCkge1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZENsYXNzKFwidWstZHJvcGRvd24tc3RhY2tcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzdGFjay51ay5kcm9wZG93bicsIFt0aGlzXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRyb3Bkb3duLmNzcyhjc3MpLmNzcyhcImRpc3BsYXlcIiwgXCJcIikuYWRkQ2xhc3MoJ3VrLWRyb3Bkb3duLScrcHBbMF0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrQm91bmRhcnk6IGZ1bmN0aW9uKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCwgYm91bmRhcnl3aWR0aCkge1xuXG4gICAgICAgICAgICB2YXIgYXhpcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChsZWZ0IDwgMCB8fCAoKGxlZnQgLSBVSS4kd2luLnNjcm9sbExlZnQoKSkrd2lkdGgpID4gYm91bmRhcnl3aWR0aCkge1xuICAgICAgICAgICAgICAgYXhpcyArPSBcInhcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCh0b3AgLSBVSS4kd2luLnNjcm9sbFRvcCgpKSA8IDAgfHwgKCh0b3AgLSBVSS4kd2luLnNjcm9sbFRvcCgpKStoZWlnaHQpID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICBheGlzICs9IFwieVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBVSS5jb21wb25lbnQoJ2Ryb3Bkb3duT3ZlcmxheScsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAnanVzdGlmeScgOiBmYWxzZSxcbiAgICAgICAgICAgJ2NscycgICAgIDogJycsXG4gICAgICAgICAgICdkdXJhdGlvbic6IDIwMFxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLnJlYWR5KGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIFVJLiQoXCJbZGF0YS11ay1kcm9wZG93bi1vdmVybGF5XVwiLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwiZHJvcGRvd25PdmVybGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5kcm9wZG93bk92ZXJsYXkoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1kcm9wZG93bi1vdmVybGF5XCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmp1c3RpZmllZCA9IHRoaXMub3B0aW9ucy5qdXN0aWZ5ID8gVUkuJCh0aGlzLm9wdGlvbnMuanVzdGlmeSkgOiBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheSAgID0gdGhpcy5lbGVtZW50LmZpbmQoJ3VrLWRyb3Bkb3duLW92ZXJsYXknKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5ID0gVUkuJCgnPGRpdiBjbGFzcz1cInVrLWRyb3Bkb3duLW92ZXJsYXlcIj48L2Rpdj4nKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNscyk7XG5cbiAgICAgICAgICAgIHRoaXMub24oe1xuXG4gICAgICAgICAgICAgICAgJ2JlZm9yZXNob3cudWsuZHJvcGRvd24nOiBmdW5jdGlvbihlLCBkcm9wZG93bikge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcm9wZG93biA9IGRyb3Bkb3duO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5qdXN0aWZpZWQgJiYgJHRoaXMuanVzdGlmaWVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeSgkdGhpcy5vdmVybGF5LmNzcyh7J2Rpc3BsYXknOidibG9jaycsICdtYXJnaW4tbGVmdCc6JycsJ21hcmdpbi1yaWdodCc6Jyd9KSwgJHRoaXMuanVzdGlmaWVkLCAkdGhpcy5qdXN0aWZpZWQub3V0ZXJXaWR0aCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAnc2hvdy51ay5kcm9wZG93bic6IGZ1bmN0aW9uKGUsIGRyb3Bkb3duKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAkdGhpcy5kcm9wZG93bi5kcm9wZG93bi5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcm9wZG93bi5lbGVtZW50LnJlbW92ZUNsYXNzKCd1ay1vcGVuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub3ZlcmxheS5zdG9wKCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykuYW5pbWF0ZSh7aGVpZ2h0OiBofSwgJHRoaXMub3B0aW9ucy5kdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZHJvcGRvd24uZHJvcGRvd24uY3NzKCd2aXNpYmlsaXR5JywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5kcm9wZG93bi5lbGVtZW50LmFkZENsYXNzKCd1ay1vcGVuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgVUkuVXRpbHMuY2hlY2tEaXNwbGF5KCR0aGlzLmRyb3Bkb3duLmRyb3Bkb3duLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucG9pbnRlcmxlYXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICdoaWRlLnVrLmRyb3Bkb3duJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm92ZXJsYXkuc3RvcCgpLmFuaW1hdGUoe2hlaWdodDogMH0sICR0aGlzLm9wdGlvbnMuZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAncG9pbnRlcmVudGVyLnVrLmRyb3Bkb3duJzogZnVuY3Rpb24oZSwgZHJvcGRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCR0aGlzLnJlbWFpbklkbGUpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAncG9pbnRlcmxlYXZlLnVrLmRyb3Bkb3duJzogZnVuY3Rpb24oZSwgZHJvcGRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucG9pbnRlcmxlYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkub24oe1xuXG4gICAgICAgICAgICAgICAgJ21vdXNlZW50ZXInOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLnJlbWFpbklkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkdGhpcy5kcm9wZG93bi5yZW1haW5JZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkdGhpcy5yZW1haW5JZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAnbW91c2VsZWF2ZSc6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLnBvaW50ZXJsZWF2ZSAmJiBhY3RpdmUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVtYWluSWRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhY3RpdmUpIGFjdGl2ZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBhY3RpdmUub3B0aW9ucy5yZW1haW50aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBqdXN0aWZ5KGVsZSwganVzdGlmeVRvLCBib3VuZGFyeXdpZHRoLCBvZmZzZXQpIHtcblxuICAgICAgICBlbGUgICAgICAgICAgID0gVUkuJChlbGUpO1xuICAgICAgICBqdXN0aWZ5VG8gICAgID0gVUkuJChqdXN0aWZ5VG8pO1xuICAgICAgICBib3VuZGFyeXdpZHRoID0gYm91bmRhcnl3aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgb2Zmc2V0ICAgICAgICA9IG9mZnNldCB8fCBlbGUub2Zmc2V0KCk7XG5cbiAgICAgICAgaWYgKGp1c3RpZnlUby5sZW5ndGgpIHtcblxuICAgICAgICAgICAgdmFyIGp3aWR0aCA9IGp1c3RpZnlUby5vdXRlcldpZHRoKCk7XG5cbiAgICAgICAgICAgIGVsZS5jc3MoXCJtaW4td2lkdGhcIiwgandpZHRoKTtcblxuICAgICAgICAgICAgaWYgKFVJLmxhbmdkaXJlY3Rpb24gPT0gJ3JpZ2h0Jykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0MSAgID0gYm91bmRhcnl3aWR0aCAtIChqdXN0aWZ5VG8ub2Zmc2V0KCkubGVmdCArIGp3aWR0aCksXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0MiAgID0gYm91bmRhcnl3aWR0aCAtIChlbGUub2Zmc2V0KCkubGVmdCArIGVsZS5vdXRlcldpZHRoKCkpO1xuXG4gICAgICAgICAgICAgICAgZWxlLmNzcyhcIm1hcmdpbi1yaWdodFwiLCByaWdodDEgLSByaWdodDIpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZS5jc3MoXCJtYXJnaW4tbGVmdFwiLCBqdXN0aWZ5VG8ub2Zmc2V0KCkubGVmdCAtIG9mZnNldC5sZWZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSkoVUlraXQpO1xuIl19