"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideshow-fx", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var Animations = UI.slideshow.animations;

    UI.$.extend(UI.slideshow.animations, {
        'slice': function slice(current, next, dir, fromfx) {

            if (!current.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var sliceWidth = Math.ceil(this.element.width() / this.options.slices),
                bgimage = next.data('cover').css('background-image'),
                ghost = UI.$('<li></li>').css({
                top: 0,
                left: 0,
                width: this.container.width(),
                height: this.container.height(),
                opacity: 1,
                zIndex: 15
            }),
                ghostWidth = ghost.width(),
                ghostHeight = ghost.height(),
                pos = fromfx == 'slice-up' ? ghostHeight : '0',
                bar;

            for (var i = 0; i < this.options.slices; i++) {

                if (fromfx == 'slice-up-down') {
                    pos = (i % 2 + 2) % 2 == 0 ? '0' : ghostHeight;
                }

                var width = i == this.options.slices - 1 ? sliceWidth : sliceWidth,
                    clipto = 'rect(0px, ' + width * (i + 1) + 'px, ' + ghostHeight + 'px, ' + sliceWidth * i + 'px)',
                    clipfrom;

                //slice-down - default
                clipfrom = 'rect(0px, ' + width * (i + 1) + 'px, 0px, ' + sliceWidth * i + 'px)';

                if (fromfx == 'slice-up' || fromfx == 'slice-up-down' && (i % 2 + 2) % 2 == 0) {
                    clipfrom = 'rect(' + ghostHeight + 'px, ' + width * (i + 1) + 'px, ' + ghostHeight + 'px, ' + sliceWidth * i + 'px)';
                }

                bar = UI.$('<div class="uk-cover-background"></div>').css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': ghostWidth,
                    'height': ghostHeight,
                    'background-image': bgimage,
                    'clip': clipfrom,
                    'opacity': 0,
                    'transition': 'all ' + this.options.duration + 'ms ease-in-out ' + i * 60 + 'ms',
                    '-webkit-transition': 'all ' + this.options.duration + 'ms ease-in-out ' + i * 60 + 'ms'

                }).data('clip', clipto);

                ghost.append(bar);
            }

            this.container.append(ghost);

            ghost.children().last().on(UI.support.transition.end, function () {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            ghost.children().each(function () {
                var bar = UI.$(this);

                bar.css({
                    'clip': bar.data('clip'),
                    'opacity': 1
                });
            });

            return d.promise();
        },

        'slice-up': function sliceUp(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-up']);
        },

        'slice-down': function sliceDown(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-down']);
        },

        'slice-up-down': function sliceUpDown(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-up-down']);
        },

        'fold': function fold(current, next, dir) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var sliceWidth = Math.ceil(this.element.width() / this.options.slices),
                bgimage = next.data('cover').css('background-image'),
                ghost = UI.$('<li></li>').css({
                width: next.width(),
                height: next.height(),
                opacity: 1,
                zIndex: 15
            }),
                ghostWidth = next.width(),
                ghostHeight = next.height(),
                bar;

            for (var i = 0; i < this.options.slices; i++) {

                bar = UI.$('<div class="uk-cover-background"></div>').css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': ghostWidth,
                    'height': ghostHeight,
                    'background-image': bgimage,
                    'transform-origin': sliceWidth * i + 'px 0 0',
                    'clip': 'rect(0px, ' + sliceWidth * (i + 1) + 'px, ' + ghostHeight + 'px, ' + sliceWidth * i + 'px)',
                    'opacity': 0,
                    'transform': 'scaleX(0.000001)',
                    'transition': 'all ' + this.options.duration + 'ms ease-in-out ' + (100 + i * 60) + 'ms',
                    '-webkit-transition': 'all ' + this.options.duration + 'ms ease-in-out ' + (100 + i * 60) + 'ms'
                });

                ghost.prepend(bar);
            }

            this.container.append(ghost);

            ghost.width();

            ghost.children().first().on(UI.support.transition.end, function () {
                ghost.remove();
                d.resolve();
            }).end().css({
                'transform': 'scaleX(1)',
                'opacity': 1
            });

            return d.promise();
        },

        'puzzle': function puzzle(current, next, dir) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred(),
                $this = this;

            var boxCols = Math.round(this.options.slices / 2),
                boxWidth = Math.round(next.width() / boxCols),
                boxRows = Math.round(next.height() / boxWidth),
                boxHeight = Math.round(next.height() / boxRows) + 1,
                bgimage = next.data('cover').css('background-image'),
                ghost = UI.$('<li></li>').css({
                width: this.container.width(),
                height: this.container.height(),
                opacity: 1,
                zIndex: 15
            }),
                ghostWidth = this.container.width(),
                ghostHeight = this.container.height(),
                box,
                rect,
                width;

            for (var rows = 0; rows < boxRows; rows++) {

                for (var cols = 0; cols < boxCols; cols++) {

                    width = cols == boxCols - 1 ? boxWidth + 2 : boxWidth;

                    rect = [boxHeight * rows + 'px', // top
                    width * (cols + 1) + 'px', // right
                    boxHeight * (rows + 1) + 'px', // bottom
                    boxWidth * cols + 'px' // left
                    ];

                    box = UI.$('<div class="uk-cover-background"></div>').css({
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'opacity': 0,
                        'width': ghostWidth,
                        'height': ghostHeight,
                        'background-image': bgimage,
                        'clip': 'rect(' + rect.join(',') + ')',
                        '-webkit-transform': 'translateZ(0)', // fixes webkit opacity flickering bug
                        'transform': 'translateZ(0)' // fixes moz opacity flickering bug
                    });

                    ghost.append(box);
                }
            }

            this.container.append(ghost);

            var boxes = shuffle(ghost.children());

            boxes.each(function (i) {
                UI.$(this).css({
                    'transition': 'all ' + $this.options.duration + 'ms ease-in-out ' + (50 + i * 25) + 'ms',
                    '-webkit-transition': 'all ' + $this.options.duration + 'ms ease-in-out ' + (50 + i * 25) + 'ms'
                });
            }).last().on(UI.support.transition.end, function () {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            boxes.css({ 'opacity': 1 });

            return d.promise();
        },

        'boxes': function boxes(current, next, dir, fromfx) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var boxCols = Math.round(this.options.slices / 2),
                boxWidth = Math.round(next.width() / boxCols),
                boxRows = Math.round(next.height() / boxWidth),
                boxHeight = Math.round(next.height() / boxRows) + 1,
                bgimage = next.data('cover').css('background-image'),
                ghost = UI.$('<li></li>').css({
                width: next.width(),
                height: next.height(),
                opacity: 1,
                zIndex: 15
            }),
                ghostWidth = next.width(),
                ghostHeight = next.height(),
                box,
                rect,
                width,
                cols;

            for (var rows = 0; rows < boxRows; rows++) {

                for (cols = 0; cols < boxCols; cols++) {

                    width = cols == boxCols - 1 ? boxWidth + 2 : boxWidth;

                    rect = [boxHeight * rows + 'px', // top
                    width * (cols + 1) + 'px', // right
                    boxHeight * (rows + 1) + 'px', // bottom
                    boxWidth * cols + 'px' // left
                    ];

                    box = UI.$('<div class="uk-cover-background"></div>').css({
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'opacity': 1,
                        'width': ghostWidth,
                        'height': ghostHeight,
                        'background-image': bgimage,
                        'transform-origin': rect[3] + ' ' + rect[0] + ' 0',
                        'clip': 'rect(' + rect.join(',') + ')',
                        '-webkit-transform': 'scale(0.0000000000000001)',
                        'transform': 'scale(0.0000000000000001)'
                    });

                    ghost.append(box);
                }
            }

            this.container.append(ghost);

            var rowIndex = 0,
                colIndex = 0,
                timeBuff = 0,
                box2Darr = [[]],
                boxes = ghost.children(),
                prevCol;

            if (fromfx == 'boxes-reverse') {
                boxes = [].reverse.apply(boxes);
            }

            boxes.each(function () {

                box2Darr[rowIndex][colIndex] = UI.$(this);
                colIndex++;

                if (colIndex == boxCols) {
                    rowIndex++;
                    colIndex = 0;
                    box2Darr[rowIndex] = [];
                }
            });

            for (cols = 0, prevCol = 0; cols < boxCols * boxRows; cols++) {

                prevCol = cols;

                for (var row = 0; row < boxRows; row++) {

                    if (prevCol >= 0 && prevCol < boxCols) {

                        box2Darr[row][prevCol].css({
                            'transition': 'all ' + this.options.duration + 'ms linear ' + (50 + timeBuff) + 'ms',
                            '-webkit-transition': 'all ' + this.options.duration + 'ms linear ' + (50 + timeBuff) + 'ms'
                        });
                    }
                    prevCol--;
                }
                timeBuff += 100;
            }

            boxes.last().on(UI.support.transition.end, function () {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            boxes.css({
                '-webkit-transform': 'scale(1)',
                'transform': 'scale(1)'
            });

            return d.promise();
        },

        'boxes-reverse': function boxesReverse(current, next, dir) {
            return Animations.boxes.apply(this, [current, next, dir, 'boxes-reverse']);
        },

        'random-fx': function randomFx() {

            var animations = ['slice-up', 'fold', 'puzzle', 'slice-down', 'boxes', 'slice-up-down', 'boxes-reverse'];

            this.fxIndex = (this.fxIndex === undefined ? -1 : this.fxIndex) + 1;

            if (!animations[this.fxIndex]) this.fxIndex = 0;

            return Animations[animations[this.fxIndex]].apply(this, arguments);
        }
    });

    // helper functions

    // Shuffle an array
    var shuffle = function shuffle(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
        return arr;
    };

    return UI.slideshow.animations;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NsaWRlc2hvdy1meC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxvQkFBUCxFQUE2QixDQUFDLE9BQUQsQ0FBN0IsRUFBd0MsWUFBVztBQUMvQyxtQkFBTyxhQUFhLE1BQU0sS0FBTixDQUFwQjtBQUNILFNBRkQ7QUFHSDtBQUVKLENBZEQsRUFjRyxVQUFTLEVBQVQsRUFBYTs7QUFFWjs7QUFFQSxRQUFJLGFBQWEsR0FBRyxTQUFILENBQWEsVUFBOUI7O0FBRUEsT0FBRyxDQUFILENBQUssTUFBTCxDQUFZLEdBQUcsU0FBSCxDQUFhLFVBQXpCLEVBQXFDO0FBQ2pDLGlCQUFTLGVBQVMsT0FBVCxFQUFrQixJQUFsQixFQUF3QixHQUF4QixFQUE2QixNQUE3QixFQUFxQzs7QUFFMUMsZ0JBQUksQ0FBQyxRQUFRLElBQVIsQ0FBYSxPQUFiLENBQUwsRUFBNEI7QUFDeEIsdUJBQU8sV0FBVyxJQUFYLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLFNBQTVCLENBQVA7QUFDSDs7QUFFRCxnQkFBSSxJQUFJLEdBQUcsQ0FBSCxDQUFLLFFBQUwsRUFBUjs7QUFFQSxnQkFBSSxhQUFhLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBTCxDQUFhLEtBQWIsS0FBdUIsS0FBSyxPQUFMLENBQWEsTUFBOUMsQ0FBakI7QUFBQSxnQkFDSSxVQUFhLEtBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsR0FBbkIsQ0FBdUIsa0JBQXZCLENBRGpCO0FBQUEsZ0JBRUksUUFBYSxHQUFHLENBQUgsQ0FBSyxX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O0FBRUEsaUJBQUssT0FBTCxHQUFlLENBQUMsS0FBSyxPQUFMLEtBQWlCLFNBQWpCLEdBQTZCLENBQUMsQ0FBOUIsR0FBa0MsS0FBSyxPQUF4QyxJQUFtRCxDQUFsRTs7QUFFQSxnQkFBSSxDQUFDLFdBQVcsS0FBSyxPQUFoQixDQUFMLEVBQStCLEtBQUssT0FBTCxHQUFlLENBQWY7O0FBRS9CLG1CQUFPLFdBQVcsV0FBVyxLQUFLLE9BQWhCLENBQVgsRUFBcUMsS0FBckMsQ0FBMkMsSUFBM0MsRUFBaUQsU0FBakQsQ0FBUDtBQUNIO0FBcFZnQyxLQUFyQzs7Ozs7QUEyVkEsUUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFTLEdBQVQsRUFBYztBQUN4QixhQUFLLElBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxJQUFJLElBQUksTUFBdkIsRUFBK0IsQ0FBL0IsRUFBa0MsSUFBSSxTQUFTLEtBQUssTUFBTCxLQUFnQixDQUF6QixDQUFKLEVBQWlDLElBQUksSUFBSSxFQUFFLENBQU4sQ0FBckMsRUFBK0MsSUFBSSxDQUFKLElBQVMsSUFBSSxDQUFKLENBQXhELEVBQWdFLElBQUksQ0FBSixJQUFTLENBQTNHLEVBQThHLENBQUU7QUFDaEgsZUFBTyxHQUFQO0FBQ0gsS0FIRDs7QUFLQSxXQUFPLEdBQUcsU0FBSCxDQUFhLFVBQXBCO0FBQ0gsQ0FyWEQiLCJmaWxlIjoic2xpZGVzaG93LWZ4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtc2xpZGVzaG93LWZ4XCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBbmltYXRpb25zID0gVUkuc2xpZGVzaG93LmFuaW1hdGlvbnM7XG5cbiAgICBVSS4kLmV4dGVuZChVSS5zbGlkZXNob3cuYW5pbWF0aW9ucywge1xuICAgICAgICAnc2xpY2UnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIsIGZyb21meCkge1xuXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnQuZGF0YSgnY292ZXInKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBbmltYXRpb25zLmZhZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGQgPSBVSS4kLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIHZhciBzbGljZVdpZHRoID0gTWF0aC5jZWlsKHRoaXMuZWxlbWVudC53aWR0aCgpIC8gdGhpcy5vcHRpb25zLnNsaWNlcyksXG4gICAgICAgICAgICAgICAgYmdpbWFnZSAgICA9IG5leHQuZGF0YSgnY292ZXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcbiAgICAgICAgICAgICAgICBnaG9zdCAgICAgID0gVUkuJCgnPGxpPjwvbGk+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgdG9wICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdCAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggIDogdGhpcy5jb250YWluZXIud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy5jb250YWluZXIuaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleCA6IDE1XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgZ2hvc3RXaWR0aCAgPSBnaG9zdC53aWR0aCgpLFxuICAgICAgICAgICAgICAgIGdob3N0SGVpZ2h0ID0gZ2hvc3QuaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgcG9zICAgICAgICAgPSBmcm9tZnggPT0gJ3NsaWNlLXVwJyA/IGdob3N0SGVpZ2h0OicwJyxcbiAgICAgICAgICAgICAgICBiYXI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLnNsaWNlczsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJvbWZ4ID09ICdzbGljZS11cC1kb3duJykge1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSAoKGkgJSAyKSArIDIpICUgMj09MCA/ICcwJzpnaG9zdEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggICAgPSAoaSA9PSB0aGlzLm9wdGlvbnMuc2xpY2VzLTEpID8gc2xpY2VXaWR0aCA6IHNsaWNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGNsaXB0byAgID0gKCdyZWN0KDBweCwgJysod2lkdGgqKGkrMSkpKydweCwgJytnaG9zdEhlaWdodCsncHgsICcrKHNsaWNlV2lkdGgqaSkrJ3B4KScpLFxuICAgICAgICAgICAgICAgICAgICBjbGlwZnJvbTtcblxuICAgICAgICAgICAgICAgIC8vc2xpY2UtZG93biAtIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBjbGlwZnJvbSA9ICgncmVjdCgwcHgsICcrKHdpZHRoKihpKzEpKSsncHgsIDBweCwgJysoc2xpY2VXaWR0aCppKSsncHgpJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJvbWZ4ID09ICdzbGljZS11cCcgfHwgKGZyb21meCA9PSAnc2xpY2UtdXAtZG93bicgJiYgKChpICUgMikgKyAyKSAlIDI9PTAgKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGlwZnJvbSA9ICgncmVjdCgnK2dob3N0SGVpZ2h0KydweCwgJysod2lkdGgqKGkrMSkpKydweCwgJytnaG9zdEhlaWdodCsncHgsICcrKHNsaWNlV2lkdGgqaSkrJ3B4KScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJhciA9IFVJLiQoJzxkaXYgY2xhc3M9XCJ1ay1jb3Zlci1iYWNrZ3JvdW5kXCI+PC9kaXY+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJyAgICAgICAgICAgOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAndG9wJyAgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgICAgICdsZWZ0JyAgICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJyAgICAgICAgICAgICAgOiBnaG9zdFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JyAgICAgICAgICAgICA6IGdob3N0SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZScgICA6IGJnaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICdjbGlwJyAgICAgICAgICAgICAgIDogY2xpcGZyb20sXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nICAgICAgICAgOiAnYWxsICcrdGhpcy5vcHRpb25zLmR1cmF0aW9uKydtcyBlYXNlLWluLW91dCAnKyhpKjYwKSsnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uJyA6ICdhbGwgJyt0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zIGVhc2UtaW4tb3V0ICcrKGkqNjApKydtcydcblxuICAgICAgICAgICAgICAgIH0pLmRhdGEoJ2NsaXAnLCBjbGlwdG8pO1xuXG4gICAgICAgICAgICAgICAgZ2hvc3QuYXBwZW5kKGJhcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZChnaG9zdCk7XG5cbiAgICAgICAgICAgIGdob3N0LmNoaWxkcmVuKCkubGFzdCgpLm9uKFVJLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGdob3N0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGdob3N0LndpZHRoKCk7XG5cbiAgICAgICAgICAgIGdob3N0LmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYmFyID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGJhci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnY2xpcCc6IGJhci5kYXRhKCdjbGlwJyksXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JzogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2xpY2UtdXAnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcbiAgICAgICAgICAgIHJldHVybiBBbmltYXRpb25zLnNsaWNlLmFwcGx5KHRoaXMsIFtjdXJyZW50LCBuZXh0LCBkaXIsICdzbGljZS11cCddKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnc2xpY2UtZG93bic6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuICAgICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbnMuc2xpY2UuYXBwbHkodGhpcywgW2N1cnJlbnQsIG5leHQsIGRpciwgJ3NsaWNlLWRvd24nXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3NsaWNlLXVwLWRvd24nOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcbiAgICAgICAgICAgIHJldHVybiBBbmltYXRpb25zLnNsaWNlLmFwcGx5KHRoaXMsIFtjdXJyZW50LCBuZXh0LCBkaXIsICdzbGljZS11cC1kb3duJ10pO1xuICAgICAgICB9LFxuXG4gICAgICAgICdmb2xkJzogZnVuY3Rpb24oY3VycmVudCwgbmV4dCwgZGlyKSB7XG5cbiAgICAgICAgICAgIGlmICghbmV4dC5kYXRhKCdjb3ZlcicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbnMuZmFkZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZCA9IFVJLiQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgdmFyIHNsaWNlV2lkdGggPSBNYXRoLmNlaWwodGhpcy5lbGVtZW50LndpZHRoKCkgLyB0aGlzLm9wdGlvbnMuc2xpY2VzKSxcbiAgICAgICAgICAgICAgICBiZ2ltYWdlICAgID0gbmV4dC5kYXRhKCdjb3ZlcicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxuICAgICAgICAgICAgICAgIGdob3N0ICAgICAgPSBVSS4kKCc8bGk+PC9saT4nKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCAgOiBuZXh0LndpZHRoKCksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA6IG5leHQuaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleCA6IDE1XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgZ2hvc3RXaWR0aCAgPSBuZXh0LndpZHRoKCksXG4gICAgICAgICAgICAgICAgZ2hvc3RIZWlnaHQgPSBuZXh0LmhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGJhcjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMuc2xpY2VzOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGJhciA9IFVJLiQoJzxkaXYgY2xhc3M9XCJ1ay1jb3Zlci1iYWNrZ3JvdW5kXCI+PC9kaXY+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJyAgICAgICAgICAgOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAndG9wJyAgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgICAgICdsZWZ0JyAgICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJyAgICAgICAgICAgICAgOiBnaG9zdFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JyAgICAgICAgICAgICA6IGdob3N0SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZScgICA6IGJnaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0tb3JpZ2luJyAgIDogKHNsaWNlV2lkdGgqaSkrJ3B4IDAgMCcsXG4gICAgICAgICAgICAgICAgICAgICdjbGlwJyAgICAgICAgICAgICAgIDogKCdyZWN0KDBweCwgJysoc2xpY2VXaWR0aCooaSsxKSkrJ3B4LCAnK2dob3N0SGVpZ2h0KydweCwgJysoc2xpY2VXaWR0aCppKSsncHgpJyksXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybScgICAgICAgICAgOiAnc2NhbGVYKDAuMDAwMDAxKScsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJyAgICAgICAgIDogJ2FsbCAnK3RoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMgZWFzZS1pbi1vdXQgJysoMTAwK2kqNjApKydtcycsXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zaXRpb24nIDogJ2FsbCAnK3RoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMgZWFzZS1pbi1vdXQgJysoMTAwK2kqNjApKydtcydcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdob3N0LnByZXBlbmQoYmFyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKGdob3N0KTtcblxuICAgICAgICAgICAgZ2hvc3Qud2lkdGgoKTtcblxuICAgICAgICAgICAgZ2hvc3QuY2hpbGRyZW4oKS5maXJzdCgpLm9uKFVJLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGdob3N0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSkuZW5kKCkuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogJ3NjYWxlWCgxKScsXG4gICAgICAgICAgICAgICAgJ29wYWNpdHknOiAxXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdwdXp6bGUnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIpIHtcblxuICAgICAgICAgICAgaWYgKCFuZXh0LmRhdGEoJ2NvdmVyJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pbWF0aW9ucy5mYWRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkID0gVUkuJC5EZWZlcnJlZCgpLCAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBib3hDb2xzICAgPSBNYXRoLnJvdW5kKHRoaXMub3B0aW9ucy5zbGljZXMvMiksXG4gICAgICAgICAgICAgICAgYm94V2lkdGggID0gTWF0aC5yb3VuZChuZXh0LndpZHRoKCkvYm94Q29scyksXG4gICAgICAgICAgICAgICAgYm94Um93cyAgID0gTWF0aC5yb3VuZChuZXh0LmhlaWdodCgpL2JveFdpZHRoKSxcbiAgICAgICAgICAgICAgICBib3hIZWlnaHQgPSBNYXRoLnJvdW5kKG5leHQuaGVpZ2h0KCkvYm94Um93cykrMSxcbiAgICAgICAgICAgICAgICBiZ2ltYWdlICAgPSBuZXh0LmRhdGEoJ2NvdmVyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG4gICAgICAgICAgICAgICAgZ2hvc3QgICAgID0gVUkuJCgnPGxpPjwvbGk+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggICA6IHRoaXMuY29udGFpbmVyLndpZHRoKCksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAgOiB0aGlzLmNvbnRhaW5lci5oZWlnaHQoKSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eSA6IDEsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleCAgOiAxNVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGdob3N0V2lkdGggID0gdGhpcy5jb250YWluZXIud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBnaG9zdEhlaWdodCA9IHRoaXMuY29udGFpbmVyLmhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGJveCwgcmVjdCwgd2lkdGg7XG5cbiAgICAgICAgICAgIGZvciAodmFyIHJvd3MgPSAwOyByb3dzIDwgYm94Um93czsgcm93cysrKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjb2xzID0gMDsgY29scyA8IGJveENvbHM7IGNvbHMrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICA9IChjb2xzID09IGJveENvbHMtMSkgPyAoYm94V2lkdGggKyAyKSA6IGJveFdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlY3QgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAoYm94SGVpZ2h0ICogcm93cykgICAgICAgKydweCcsIC8vIHRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgKHdpZHRoICAqIChjb2xzKzEpKSAgICAgICsncHgnLCAvLyByaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJveEhlaWdodCAqIChyb3dzICsgMSkpICsncHgnLCAvLyBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgICAgIChib3hXaWR0aCAgKiBjb2xzKSAgICAgICArJ3B4JyAgLy8gbGVmdFxuICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgICAgIGJveCA9IFVJLiQoJzxkaXYgY2xhc3M9XCJ1ay1jb3Zlci1iYWNrZ3JvdW5kXCI+PC9kaXY+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbicgICAgICAgICAgOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCcgICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgICAgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJyAgICAgICAgICAgICA6IGdob3N0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JyAgICAgICAgICAgIDogZ2hvc3RIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZScgIDogYmdpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGlwJyAgICAgICAgICAgICAgOiAoJ3JlY3QoJytyZWN0LmpvaW4oJywnKSsnKScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVaKDApJywgLy8gZml4ZXMgd2Via2l0IG9wYWNpdHkgZmxpY2tlcmluZyBidWdcbiAgICAgICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nICAgICAgICAgOiAndHJhbnNsYXRlWigwKScgICAgICAgICAgLy8gZml4ZXMgbW96IG9wYWNpdHkgZmxpY2tlcmluZyBidWdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZ2hvc3QuYXBwZW5kKGJveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoZ2hvc3QpO1xuXG4gICAgICAgICAgICB2YXIgYm94ZXMgPSBzaHVmZmxlKGdob3N0LmNoaWxkcmVuKCkpO1xuXG4gICAgICAgICAgICBib3hlcy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICBVSS4kKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJ2FsbCAnKyR0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zIGVhc2UtaW4tb3V0ICcrKDUwK2kqMjUpKydtcycsXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zaXRpb24nOiAnYWxsICcrJHRoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMgZWFzZS1pbi1vdXQgJysoNTAraSoyNSkrJ21zJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkubGFzdCgpLm9uKFVJLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGdob3N0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGdob3N0LndpZHRoKCk7XG5cbiAgICAgICAgICAgIGJveGVzLmNzcyh7J29wYWNpdHknOiAxfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnYm94ZXMnOiBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkaXIsIGZyb21meCkge1xuXG4gICAgICAgICAgICBpZiAoIW5leHQuZGF0YSgnY292ZXInKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBbmltYXRpb25zLmZhZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGQgPSBVSS4kLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIHZhciBib3hDb2xzICAgPSBNYXRoLnJvdW5kKHRoaXMub3B0aW9ucy5zbGljZXMvMiksXG4gICAgICAgICAgICAgICAgYm94V2lkdGggID0gTWF0aC5yb3VuZChuZXh0LndpZHRoKCkvYm94Q29scyksXG4gICAgICAgICAgICAgICAgYm94Um93cyAgID0gTWF0aC5yb3VuZChuZXh0LmhlaWdodCgpL2JveFdpZHRoKSxcbiAgICAgICAgICAgICAgICBib3hIZWlnaHQgPSBNYXRoLnJvdW5kKG5leHQuaGVpZ2h0KCkvYm94Um93cykrMSxcbiAgICAgICAgICAgICAgICBiZ2ltYWdlICAgPSBuZXh0LmRhdGEoJ2NvdmVyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG4gICAgICAgICAgICAgICAgZ2hvc3QgICAgID0gVUkuJCgnPGxpPjwvbGk+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggICA6IG5leHQud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICA6IG5leHQuaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHkgOiAxLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXggIDogMTVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBnaG9zdFdpZHRoICA9IG5leHQud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBnaG9zdEhlaWdodCA9IG5leHQuaGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgYm94LCByZWN0LCB3aWR0aCwgY29scztcblxuICAgICAgICAgICAgZm9yICh2YXIgcm93cyA9IDA7IHJvd3MgPCBib3hSb3dzOyByb3dzKyspIHtcblxuICAgICAgICAgICAgICAgIGZvciAoY29scyA9IDA7IGNvbHMgPCBib3hDb2xzOyBjb2xzKyspIHtcblxuICAgICAgICAgICAgICAgICAgICB3aWR0aCAgPSAoY29scyA9PSBib3hDb2xzLTEpID8gKGJveFdpZHRoICsgMikgOiBib3hXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICByZWN0ID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGJveEhlaWdodCAqIHJvd3MpICAgICAgICsncHgnLCAvLyB0b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAgKiAoY29scysxKSkgICAgICArJ3B4JywgLy8gcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIChib3hIZWlnaHQgKiAocm93cyArIDEpKSArJ3B4JywgLy8gYm90dG9tXG4gICAgICAgICAgICAgICAgICAgICAgICAoYm94V2lkdGggICogY29scykgICAgICAgKydweCcgIC8vIGxlZnRcbiAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgICAgICBib3ggPSBVSS4kKCc8ZGl2IGNsYXNzPVwidWstY292ZXItYmFja2dyb3VuZFwiPjwvZGl2PicpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAncG9zaXRpb24nICAgICAgICAgIDogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnICAgICAgICAgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eScgICAgICAgICAgIDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCcgICAgICAgICAgICAgOiBnaG9zdFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCcgICAgICAgICAgICA6IGdob3N0SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnICA6IGJnaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHJhbnNmb3JtLW9yaWdpbicgIDogcmVjdFszXSsnICcrcmVjdFswXSsnIDAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaXAnICAgICAgICAgICAgICA6ICgncmVjdCgnK3JlY3Quam9pbignLCcpKycpJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nIDogJ3NjYWxlKDAuMDAwMDAwMDAwMDAwMDAwMSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybScgICAgICAgICA6ICdzY2FsZSgwLjAwMDAwMDAwMDAwMDAwMDEpJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBnaG9zdC5hcHBlbmQoYm94KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZChnaG9zdCk7XG5cbiAgICAgICAgICAgIHZhciByb3dJbmRleCA9IDAsIGNvbEluZGV4ID0gMCwgdGltZUJ1ZmYgPSAwLCBib3gyRGFyciA9IFtbXV0sIGJveGVzID0gZ2hvc3QuY2hpbGRyZW4oKSwgcHJldkNvbDtcblxuICAgICAgICAgICAgaWYgKGZyb21meCA9PSAnYm94ZXMtcmV2ZXJzZScpIHtcbiAgICAgICAgICAgICAgICBib3hlcyA9IFtdLnJldmVyc2UuYXBwbHkoYm94ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBib3hlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgYm94MkRhcnJbcm93SW5kZXhdW2NvbEluZGV4XSA9IFVJLiQodGhpcyk7XG4gICAgICAgICAgICAgICAgY29sSW5kZXgrKztcblxuICAgICAgICAgICAgICAgIGlmKGNvbEluZGV4ID09IGJveENvbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93SW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgY29sSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICBib3gyRGFycltyb3dJbmRleF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChjb2xzID0gMCwgcHJldkNvbCA9IDA7IGNvbHMgPCAoYm94Q29scyAqIGJveFJvd3MpOyBjb2xzKyspIHtcblxuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBjb2xzO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm94Um93czsgcm93KyspIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNvbCA+PSAwICYmIHByZXZDb2wgPCBib3hDb2xzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJveDJEYXJyW3Jvd11bcHJldkNvbF0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICdhbGwgJyt0aGlzLm9wdGlvbnMuZHVyYXRpb24rJ21zIGxpbmVhciAnKyg1MCt0aW1lQnVmZikrJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uJzogJ2FsbCAnK3RoaXMub3B0aW9ucy5kdXJhdGlvbisnbXMgbGluZWFyICcrKDUwK3RpbWVCdWZmKSsnbXMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcmV2Q29sLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpbWVCdWZmICs9IDEwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYm94ZXMubGFzdCgpLm9uKFVJLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGdob3N0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGdob3N0LndpZHRoKCk7XG5cbiAgICAgICAgICAgIGJveGVzLmNzcyh7XG4gICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogJ3NjYWxlKDEpJyxcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogJ3NjYWxlKDEpJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkLnByb21pc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnYm94ZXMtcmV2ZXJzZSc6IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGRpcikge1xuICAgICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbnMuYm94ZXMuYXBwbHkodGhpcywgW2N1cnJlbnQsIG5leHQsIGRpciwgJ2JveGVzLXJldmVyc2UnXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3JhbmRvbS1meCc6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHZhciBhbmltYXRpb25zID0gWydzbGljZS11cCcsICdmb2xkJywgJ3B1enpsZScsICdzbGljZS1kb3duJywgJ2JveGVzJywgJ3NsaWNlLXVwLWRvd24nLCAnYm94ZXMtcmV2ZXJzZSddO1xuXG4gICAgICAgICAgICB0aGlzLmZ4SW5kZXggPSAodGhpcy5meEluZGV4ID09PSB1bmRlZmluZWQgPyAtMSA6IHRoaXMuZnhJbmRleCkgKyAxO1xuXG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbnNbdGhpcy5meEluZGV4XSkgdGhpcy5meEluZGV4ID0gMDtcblxuICAgICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbnNbYW5pbWF0aW9uc1t0aGlzLmZ4SW5kZXhdXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbnNcblxuICAgIC8vIFNodWZmbGUgYW4gYXJyYXlcbiAgICB2YXIgc2h1ZmZsZSA9IGZ1bmN0aW9uKGFycikge1xuICAgICAgICBmb3IgKHZhciBqLCB4LCBpID0gYXJyLmxlbmd0aDsgaTsgaiA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBpKSwgeCA9IGFyclstLWldLCBhcnJbaV0gPSBhcnJbal0sIGFycltqXSA9IHgpIHt9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfTtcblxuICAgIHJldHVybiBVSS5zbGlkZXNob3cuYW5pbWF0aW9ucztcbn0pO1xuIl19