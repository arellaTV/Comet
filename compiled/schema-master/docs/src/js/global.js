'use strict';

// =============================================================
// 
//  Alerts
//	
// =============================================================

// Use the class .alert-gone to remove
// the element from the DOM

// Use the class .alert-hide to just
// hide the element from the DOM

// This removes the element from the DOM
$('.close').click(function (e) {
  var elem = $(e.currentTarget).parents('.alert-gone');
  elem.removeClass('in');

  setTimeout(function () {
    elem.remove();
  }, 450);
});

// This just hides the element
$('.close').click(function (e) {
  var hiding = $(e.currentTarget).parents('.alert-hide');
  hiding.removeClass('in');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NjaGVtYS1tYXN0ZXIvZG9jcy9zcmMvanMvZ2xvYmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsVUFBUyxDQUFULEVBQVk7QUFDNUIsTUFBSSxPQUFPLEVBQUUsRUFBRSxhQUFKLEVBQW1CLE9BQW5CLENBQTJCLGFBQTNCLENBQVg7QUFDQSxPQUFLLFdBQUwsQ0FBaUIsSUFBakI7O0FBRUEsYUFBVyxZQUFZO0FBQ3JCLFNBQUssTUFBTDtBQUNELEdBRkQsRUFFRyxHQUZIO0FBR0QsQ0FQRDs7O0FBVUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixVQUFTLENBQVQsRUFBVztBQUMzQixNQUFJLFNBQVMsRUFBRSxFQUFFLGFBQUosRUFBbUIsT0FBbkIsQ0FBMkIsYUFBM0IsQ0FBYjtBQUNBLFNBQU8sV0FBUCxDQUFtQixJQUFuQjtBQUNELENBSEQiLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gIFxuLy8gIEFsZXJ0c1xuLy9cdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblxuXG4vLyBVc2UgdGhlIGNsYXNzIC5hbGVydC1nb25lIHRvIHJlbW92ZVxuLy8gdGhlIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG5cbi8vIFVzZSB0aGUgY2xhc3MgLmFsZXJ0LWhpZGUgdG8ganVzdFxuLy8gaGlkZSB0aGUgZWxlbWVudCBmcm9tIHRoZSBET01cblxuXG4vLyBUaGlzIHJlbW92ZXMgdGhlIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG4kKCcuY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gIHZhciBlbGVtID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudHMoJy5hbGVydC1nb25lJyk7XG4gIGVsZW0ucmVtb3ZlQ2xhc3MoJ2luJyk7XG4gIFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBlbGVtLnJlbW92ZSgpO1xuICB9LCA0NTApO1xufSk7XG5cbi8vIFRoaXMganVzdCBoaWRlcyB0aGUgZWxlbWVudFxuJCgnLmNsb3NlJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gIHZhciBoaWRpbmcgPSAkKGUuY3VycmVudFRhcmdldCkucGFyZW50cygnLmFsZXJ0LWhpZGUnKTtcbiAgaGlkaW5nLnJlbW92ZUNsYXNzKCdpbicpO1xufSk7Il19