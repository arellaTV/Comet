'use strict';

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
//  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.

;(function ($) {

  if ($.fn.swipeLeft) {
    return;
  }

  var touch = {},
      touchTimeout,
      tapTimeout,
      swipeTimeout,
      longTapTimeout,
      longTapDelay = 750,
      gesture;

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      if (touch.el !== undefined) touch.el.trigger('longTap');
      touch = {};
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout);
    if (tapTimeout) clearTimeout(tapTimeout);
    if (swipeTimeout) clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }

  function isPrimaryTouch(event) {
    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary;
  }

  $(function () {
    var now,
        delta,
        deltaX = 0,
        deltaY = 0,
        firstTouch;

    if ('MSGesture' in window) {
      gesture = new MSGesture();
      gesture.target = document.body;
    }

    $(document).on('MSGestureEnd gestureend', function (e) {

      var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

      if (swipeDirectionFromVelocity && touch.el !== undefined) {
        touch.el.trigger('swipe');
        touch.el.trigger('swipe' + swipeDirectionFromVelocity);
      }
    })
    // MSPointerDown: for IE10
    // pointerdown: for IE11
    .on('touchstart MSPointerDown pointerdown', function (e) {

      if (e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

      firstTouch = e.type == 'MSPointerDown' || e.type == 'pointerdown' ? e : e.originalEvent.touches[0];

      now = Date.now();
      delta = now - (touch.last || now);
      touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

      if (touchTimeout) clearTimeout(touchTimeout);

      touch.x1 = firstTouch.pageX;
      touch.y1 = firstTouch.pageY;

      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

      touch.last = now;
      longTapTimeout = setTimeout(longTap, longTapDelay);

      // adds the current touch contact for IE gesture recognition
      if (gesture && (e.type == 'MSPointerDown' || e.type == 'pointerdown' || e.type == 'touchstart')) {
        gesture.addPointer(e.originalEvent.pointerId);
      }
    })
    // MSPointerMove: for IE10
    // pointermove: for IE11
    .on('touchmove MSPointerMove pointermove', function (e) {

      if (e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

      firstTouch = e.type == 'MSPointerMove' || e.type == 'pointermove' ? e : e.originalEvent.touches[0];

      cancelLongTap();
      touch.x2 = firstTouch.pageX;
      touch.y2 = firstTouch.pageY;

      deltaX += Math.abs(touch.x1 - touch.x2);
      deltaY += Math.abs(touch.y1 - touch.y2);
    })
    // MSPointerUp: for IE10
    // pointerup: for IE11
    .on('touchend MSPointerUp pointerup', function (e) {

      if (e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

      cancelLongTap();

      // swipe
      if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

        swipeTimeout = setTimeout(function () {
          if (touch.el !== undefined) {
            touch.el.trigger('swipe');
            touch.el.trigger('swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
          }
          touch = {};
        }, 0);

        // normal tap
      } else if ('last' in touch) {

        // don't fire tap when delta position changed by more than 30 pixels,
        // for instance when moving to a point and back to origin
        if (isNaN(deltaX) || deltaX < 30 && deltaY < 30) {
          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function () {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap');
            event.cancelTouch = cancelAll;
            if (touch.el !== undefined) touch.el.trigger(event);

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              if (touch.el !== undefined) touch.el.trigger('doubleTap');
              touch = {};
            }

            // trigger single tap after 250ms of inactivity
            else {
                touchTimeout = setTimeout(function () {
                  touchTimeout = null;
                  if (touch.el !== undefined) touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
          }, 0);
        } else {
          touch = {};
        }
        deltaX = deltaY = 0;
      }
    })
    // when the browser window loses focus,
    // for example when a modal dialog is shown,
    // cancel all ongoing events
    .on('touchcancel MSPointerCancel', cancelAll);

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll);
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (eventName) {
    $.fn[eventName] = function (callback) {
      return $(this).on(eventName, callback);
    };
  });
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb3JlL3RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQSxDQUFDLENBQUMsVUFBUyxDQUFULEVBQVc7O0FBRVgsTUFBSSxFQUFFLEVBQUYsQ0FBSyxTQUFULEVBQW9CO0FBQ2xCO0FBQ0Q7O0FBR0QsTUFBSSxRQUFRLEVBQVo7QUFBQSxNQUFnQixZQUFoQjtBQUFBLE1BQThCLFVBQTlCO0FBQUEsTUFBMEMsWUFBMUM7QUFBQSxNQUF3RCxjQUF4RDtBQUFBLE1BQXdFLGVBQWUsR0FBdkY7QUFBQSxNQUE0RixPQUE1Rjs7QUFFQSxXQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsRUFBNUIsRUFBZ0MsRUFBaEMsRUFBb0MsRUFBcEMsRUFBd0M7QUFDdEMsV0FBTyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEVBQWQsS0FBcUIsS0FBSyxHQUFMLENBQVMsS0FBSyxFQUFkLENBQXJCLEdBQTBDLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBYyxNQUFkLEdBQXVCLE9BQWpFLEdBQTZFLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBYyxJQUFkLEdBQXFCLE1BQXpHO0FBQ0Q7O0FBRUQsV0FBUyxPQUFULEdBQW1CO0FBQ2pCLHFCQUFpQixJQUFqQjtBQUNBLFFBQUksTUFBTSxJQUFWLEVBQWdCO0FBQ2QsVUFBSyxNQUFNLEVBQU4sS0FBYSxTQUFsQixFQUE4QixNQUFNLEVBQU4sQ0FBUyxPQUFULENBQWlCLFNBQWpCO0FBQzlCLGNBQVEsRUFBUjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxhQUFULEdBQXlCO0FBQ3ZCLFFBQUksY0FBSixFQUFvQixhQUFhLGNBQWI7QUFDcEIscUJBQWlCLElBQWpCO0FBQ0Q7O0FBRUQsV0FBUyxTQUFULEdBQXFCO0FBQ25CLFFBQUksWUFBSixFQUFvQixhQUFhLFlBQWI7QUFDcEIsUUFBSSxVQUFKLEVBQW9CLGFBQWEsVUFBYjtBQUNwQixRQUFJLFlBQUosRUFBb0IsYUFB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QVcsU0FBWCxFQUFzQixRQUF0QixDQUFQO0FBQXlDLEtBQS9FO0FBQ0QsR0FGRDtBQUdELENBektBLEVBeUtFLE1BektGIiwiZmlsZSI6InRvdWNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuLy8gIEJhc2VkIG9uIFplcHRvcyB0b3VjaC5qc1xuLy8gIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vbWFkcm9iYnkvemVwdG8vbWFzdGVyL3NyYy90b3VjaC5qc1xuLy8gIFplcHRvLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG47KGZ1bmN0aW9uKCQpe1xuXG4gIGlmICgkLmZuLnN3aXBlTGVmdCkge1xuICAgIHJldHVybjtcbiAgfVxuXG5cbiAgdmFyIHRvdWNoID0ge30sIHRvdWNoVGltZW91dCwgdGFwVGltZW91dCwgc3dpcGVUaW1lb3V0LCBsb25nVGFwVGltZW91dCwgbG9uZ1RhcERlbGF5ID0gNzUwLCBnZXN0dXJlO1xuXG4gIGZ1bmN0aW9uIHN3aXBlRGlyZWN0aW9uKHgxLCB4MiwgeTEsIHkyKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKHgxIC0geDIpID49IE1hdGguYWJzKHkxIC0geTIpID8gKHgxIC0geDIgPiAwID8gJ0xlZnQnIDogJ1JpZ2h0JykgOiAoeTEgLSB5MiA+IDAgPyAnVXAnIDogJ0Rvd24nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvbmdUYXAoKSB7XG4gICAgbG9uZ1RhcFRpbWVvdXQgPSBudWxsO1xuICAgIGlmICh0b3VjaC5sYXN0KSB7XG4gICAgICBpZiAoIHRvdWNoLmVsICE9PSB1bmRlZmluZWQgKSB0b3VjaC5lbC50cmlnZ2VyKCdsb25nVGFwJyk7XG4gICAgICB0b3VjaCA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbExvbmdUYXAoKSB7XG4gICAgaWYgKGxvbmdUYXBUaW1lb3V0KSBjbGVhclRpbWVvdXQobG9uZ1RhcFRpbWVvdXQpO1xuICAgIGxvbmdUYXBUaW1lb3V0ID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsbCgpIHtcbiAgICBpZiAodG91Y2hUaW1lb3V0KSAgIGNsZWFyVGltZW91dCh0b3VjaFRpbWVvdXQpO1xuICAgIGlmICh0YXBUaW1lb3V0KSAgICAgY2xlYXJUaW1lb3V0KHRhcFRpbWVvdXQpO1xuICAgIGlmIChzd2lwZVRpbWVvdXQpICAgY2xlYXJUaW1lb3V0KHN3aXBlVGltZW91dCk7XG4gICAgaWYgKGxvbmdUYXBUaW1lb3V0KSBjbGVhclRpbWVvdXQobG9uZ1RhcFRpbWVvdXQpO1xuICAgIHRvdWNoVGltZW91dCA9IHRhcFRpbWVvdXQgPSBzd2lwZVRpbWVvdXQgPSBsb25nVGFwVGltZW91dCA9IG51bGw7XG4gICAgdG91Y2ggPSB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUHJpbWFyeVRvdWNoKGV2ZW50KXtcbiAgICByZXR1cm4gZXZlbnQucG9pbnRlclR5cGUgPT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggJiYgZXZlbnQuaXNQcmltYXJ5O1xuICB9XG5cbiAgJChmdW5jdGlvbigpe1xuICAgIHZhciBub3csIGRlbHRhLCBkZWx0YVggPSAwLCBkZWx0YVkgPSAwLCBmaXJzdFRvdWNoO1xuXG4gICAgaWYgKCdNU0dlc3R1cmUnIGluIHdpbmRvdykge1xuICAgICAgZ2VzdHVyZSA9IG5ldyBNU0dlc3R1cmUoKTtcbiAgICAgIGdlc3R1cmUudGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KVxuICAgICAgLm9uKCdNU0dlc3R1cmVFbmQgZ2VzdHVyZWVuZCcsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgIHZhciBzd2lwZURpcmVjdGlvbkZyb21WZWxvY2l0eSA9IGUub3JpZ2luYWxFdmVudC52ZWxvY2l0eVggPiAxID8gJ1JpZ2h0JyA6IGUub3JpZ2luYWxFdmVudC52ZWxvY2l0eVggPCAtMSA/ICdMZWZ0JyA6IGUub3JpZ2luYWxFdmVudC52ZWxvY2l0eVkgPiAxID8gJ0Rvd24nIDogZS5vcmlnaW5hbEV2ZW50LnZlbG9jaXR5WSA8IC0xID8gJ1VwJyA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN3aXBlRGlyZWN0aW9uRnJvbVZlbG9jaXR5ICYmIHRvdWNoLmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0b3VjaC5lbC50cmlnZ2VyKCdzd2lwZScpO1xuICAgICAgICAgIHRvdWNoLmVsLnRyaWdnZXIoJ3N3aXBlJysgc3dpcGVEaXJlY3Rpb25Gcm9tVmVsb2NpdHkpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gTVNQb2ludGVyRG93bjogZm9yIElFMTBcbiAgICAgIC8vIHBvaW50ZXJkb3duOiBmb3IgSUUxMVxuICAgICAgLm9uKCd0b3VjaHN0YXJ0IE1TUG9pbnRlckRvd24gcG9pbnRlcmRvd24nLCBmdW5jdGlvbihlKXtcblxuICAgICAgICBpZihlLnR5cGUgPT0gJ01TUG9pbnRlckRvd24nICYmICFpc1ByaW1hcnlUb3VjaChlLm9yaWdpbmFsRXZlbnQpKSByZXR1cm47XG5cbiAgICAgICAgZmlyc3RUb3VjaCA9IChlLnR5cGUgPT0gJ01TUG9pbnRlckRvd24nIHx8IGUudHlwZSA9PSAncG9pbnRlcmRvd24nKSA/IGUgOiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcblxuICAgICAgICBub3cgICAgICA9IERhdGUubm93KCk7XG4gICAgICAgIGRlbHRhICAgID0gbm93IC0gKHRvdWNoLmxhc3QgfHwgbm93KTtcbiAgICAgICAgdG91Y2guZWwgPSAkKCd0YWdOYW1lJyBpbiBmaXJzdFRvdWNoLnRhcmdldCA/IGZpcnN0VG91Y2gudGFyZ2V0IDogZmlyc3RUb3VjaC50YXJnZXQucGFyZW50Tm9kZSk7XG5cbiAgICAgICAgaWYodG91Y2hUaW1lb3V0KSBjbGVhclRpbWVvdXQodG91Y2hUaW1lb3V0KTtcblxuICAgICAgICB0b3VjaC54MSA9IGZpcnN0VG91Y2gucGFnZVg7XG4gICAgICAgIHRvdWNoLnkxID0gZmlyc3RUb3VjaC5wYWdlWTtcblxuICAgICAgICBpZiAoZGVsdGEgPiAwICYmIGRlbHRhIDw9IDI1MCkgdG91Y2guaXNEb3VibGVUYXAgPSB0cnVlO1xuXG4gICAgICAgIHRvdWNoLmxhc3QgPSBub3c7XG4gICAgICAgIGxvbmdUYXBUaW1lb3V0ID0gc2V0VGltZW91dChsb25nVGFwLCBsb25nVGFwRGVsYXkpO1xuXG4gICAgICAgIC8vIGFkZHMgdGhlIGN1cnJlbnQgdG91Y2ggY29udGFjdCBmb3IgSUUgZ2VzdHVyZSByZWNvZ25pdGlvblxuICAgICAgICBpZiAoZ2VzdHVyZSAmJiAoIGUudHlwZSA9PSAnTVNQb2ludGVyRG93bicgfHwgZS50eXBlID09ICdwb2ludGVyZG93bicgfHwgZS50eXBlID09ICd0b3VjaHN0YXJ0JyApICkge1xuICAgICAgICAgIGdlc3R1cmUuYWRkUG9pbnRlcihlLm9yaWdpbmFsRXZlbnQucG9pbnRlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICB9KVxuICAgICAgLy8gTVNQb2ludGVyTW92ZTogZm9yIElFMTBcbiAgICAgIC8vIHBvaW50ZXJtb3ZlOiBmb3IgSUUxMVxuICAgICAgLm9uKCd0b3VjaG1vdmUgTVNQb2ludGVyTW92ZSBwb2ludGVybW92ZScsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgIGlmIChlLnR5cGUgPT0gJ01TUG9pbnRlck1vdmUnICYmICFpc1ByaW1hcnlUb3VjaChlLm9yaWdpbmFsRXZlbnQpKSByZXR1cm47XG5cbiAgICAgICAgZmlyc3RUb3VjaCA9IChlLnR5cGUgPT0gJ01TUG9pbnRlck1vdmUnIHx8IGUudHlwZSA9PSAncG9pbnRlcm1vdmUnKSA/IGUgOiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcblxuICAgICAgICBjYW5jZWxMb25nVGFwKCk7XG4gICAgICAgIHRvdWNoLngyID0gZmlyc3RUb3VjaC5wYWdlWDtcbiAgICAgICAgdG91Y2gueTIgPSBmaXJzdFRvdWNoLnBhZ2VZO1xuXG4gICAgICAgIGRlbHRhWCArPSBNYXRoLmFicyh0b3VjaC54MSAtIHRvdWNoLngyKTtcbiAgICAgICAgZGVsdGFZICs9IE1hdGguYWJzKHRvdWNoLnkxIC0gdG91Y2gueTIpO1xuICAgICAgfSlcbiAgICAgIC8vIE1TUG9pbnRlclVwOiBmb3IgSUUxMFxuICAgICAgLy8gcG9pbnRlcnVwOiBmb3IgSUUxMVxuICAgICAgLm9uKCd0b3VjaGVuZCBNU1BvaW50ZXJVcCBwb2ludGVydXAnLCBmdW5jdGlvbihlKXtcblxuICAgICAgICBpZiAoZS50eXBlID09ICdNU1BvaW50ZXJVcCcgJiYgIWlzUHJpbWFyeVRvdWNoKGUub3JpZ2luYWxFdmVudCkpIHJldHVybjtcblxuICAgICAgICBjYW5jZWxMb25nVGFwKCk7XG5cbiAgICAgICAgLy8gc3dpcGVcbiAgICAgICAgaWYgKCh0b3VjaC54MiAmJiBNYXRoLmFicyh0b3VjaC54MSAtIHRvdWNoLngyKSA+IDMwKSB8fCAodG91Y2gueTIgJiYgTWF0aC5hYnModG91Y2gueTEgLSB0b3VjaC55MikgPiAzMCkpe1xuXG4gICAgICAgICAgc3dpcGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggdG91Y2guZWwgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgdG91Y2guZWwudHJpZ2dlcignc3dpcGUnKTtcbiAgICAgICAgICAgICAgdG91Y2guZWwudHJpZ2dlcignc3dpcGUnICsgKHN3aXBlRGlyZWN0aW9uKHRvdWNoLngxLCB0b3VjaC54MiwgdG91Y2gueTEsIHRvdWNoLnkyKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG91Y2ggPSB7fTtcbiAgICAgICAgICB9LCAwKTtcblxuICAgICAgICAvLyBub3JtYWwgdGFwXG4gICAgICAgIH0gZWxzZSBpZiAoJ2xhc3QnIGluIHRvdWNoKSB7XG5cbiAgICAgICAgICAvLyBkb24ndCBmaXJlIHRhcCB3aGVuIGRlbHRhIHBvc2l0aW9uIGNoYW5nZWQgYnkgbW9yZSB0aGFuIDMwIHBpeGVscyxcbiAgICAgICAgICAvLyBmb3IgaW5zdGFuY2Ugd2hlbiBtb3ZpbmcgdG8gYSBwb2ludCBhbmQgYmFjayB0byBvcmlnaW5cbiAgICAgICAgICBpZiAoaXNOYU4oZGVsdGFYKSB8fCAoZGVsdGFYIDwgMzAgJiYgZGVsdGFZIDwgMzApKSB7XG4gICAgICAgICAgICAvLyBkZWxheSBieSBvbmUgdGljayBzbyB3ZSBjYW4gY2FuY2VsIHRoZSAndGFwJyBldmVudCBpZiAnc2Nyb2xsJyBmaXJlc1xuICAgICAgICAgICAgLy8gKCd0YXAnIGZpcmVzIGJlZm9yZSAnc2Nyb2xsJylcbiAgICAgICAgICAgIHRhcFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgIC8vIHRyaWdnZXIgdW5pdmVyc2FsICd0YXAnIHdpdGggdGhlIG9wdGlvbiB0byBjYW5jZWxUb3VjaCgpXG4gICAgICAgICAgICAgIC8vIChjYW5jZWxUb3VjaCBjYW5jZWxzIHByb2Nlc3Npbmcgb2Ygc2luZ2xlIHZzIGRvdWJsZSB0YXBzIGZvciBmYXN0ZXIgJ3RhcCcgcmVzcG9uc2UpXG4gICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoJ3RhcCcpO1xuICAgICAgICAgICAgICBldmVudC5jYW5jZWxUb3VjaCA9IGNhbmNlbEFsbDtcbiAgICAgICAgICAgICAgaWYgKCB0b3VjaC5lbCAhPT0gdW5kZWZpbmVkICkgdG91Y2guZWwudHJpZ2dlcihldmVudCk7XG5cbiAgICAgICAgICAgICAgLy8gdHJpZ2dlciBkb3VibGUgdGFwIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgIGlmICh0b3VjaC5pc0RvdWJsZVRhcCkge1xuICAgICAgICAgICAgICAgIGlmICggdG91Y2guZWwgIT09IHVuZGVmaW5lZCApIHRvdWNoLmVsLnRyaWdnZXIoJ2RvdWJsZVRhcCcpO1xuICAgICAgICAgICAgICAgIHRvdWNoID0ge307XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyB0cmlnZ2VyIHNpbmdsZSB0YXAgYWZ0ZXIgMjUwbXMgb2YgaW5hY3Rpdml0eVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b3VjaFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICB0b3VjaFRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKCB0b3VjaC5lbCAhPT0gdW5kZWZpbmVkICkgdG91Y2guZWwudHJpZ2dlcignc2luZ2xlVGFwJyk7XG4gICAgICAgICAgICAgICAgICB0b3VjaCA9IHt9O1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3VjaCA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWx0YVggPSBkZWx0YVkgPSAwO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gd2hlbiB0aGUgYnJvd3NlciB3aW5kb3cgbG9zZXMgZm9jdXMsXG4gICAgICAvLyBmb3IgZXhhbXBsZSB3aGVuIGEgbW9kYWwgZGlhbG9nIGlzIHNob3duLFxuICAgICAgLy8gY2FuY2VsIGFsbCBvbmdvaW5nIGV2ZW50c1xuICAgICAgLm9uKCd0b3VjaGNhbmNlbCBNU1BvaW50ZXJDYW5jZWwnLCBjYW5jZWxBbGwpO1xuXG4gICAgLy8gc2Nyb2xsaW5nIHRoZSB3aW5kb3cgaW5kaWNhdGVzIGludGVudGlvbiBvZiB0aGUgdXNlclxuICAgIC8vIHRvIHNjcm9sbCwgbm90IHRhcCBvciBzd2lwZSwgc28gY2FuY2VsIGFsbCBvbmdvaW5nIGV2ZW50c1xuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgY2FuY2VsQWxsKTtcbiAgfSk7XG5cbiAgWydzd2lwZScsICdzd2lwZUxlZnQnLCAnc3dpcGVSaWdodCcsICdzd2lwZVVwJywgJ3N3aXBlRG93bicsICdkb3VibGVUYXAnLCAndGFwJywgJ3NpbmdsZVRhcCcsICdsb25nVGFwJ10uZm9yRWFjaChmdW5jdGlvbihldmVudE5hbWUpe1xuICAgICQuZm5bZXZlbnROYW1lXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXsgcmV0dXJuICQodGhpcykub24oZXZlbnROYW1lLCBjYWxsYmFjayk7IH07XG4gIH0pO1xufSkoalF1ZXJ5KTtcbiJdfQ==