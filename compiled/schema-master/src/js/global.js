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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NjaGVtYS1tYXN0ZXIvc3JjL2pzL2dsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFVBQVMsQ0FBVCxFQUFZO0FBQzVCLE1BQUksT0FBTyxFQUFFLEVBQUUsYUFBSixFQUFtQixPQUFuQixDQUEyQixhQUEzQixDQUFYO0FBQ0EsT0FBSyxXQUFMLENBQWlCLElBQWpCOztBQUVBLGFBQVcsWUFBWTtBQUNyQixTQUFLLE1BQUw7QUFDRCxHQUZELEVBRUcsR0FGSDtBQUdELENBUEQ7OztBQVVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsVUFBUyxDQUFULEVBQVc7QUFDM0IsTUFBSSxTQUFTLEVBQUUsRUFBRSxhQUFKLEVBQW1CLE9BQW5CLENBQTJCLGFBQTNCLENBQWI7QUFDQSxTQUFPLFdBQVAsQ0FBbUIsSUFBbkI7QUFDRCxDQUhEIiwiZmlsZSI6Imdsb2JhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vICBcbi8vICBBbGVydHNcbi8vXHRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gXG5cblxuLy8gVXNlIHRoZSBjbGFzcyAuYWxlcnQtZ29uZSB0byByZW1vdmVcbi8vIHRoZSBlbGVtZW50IGZyb20gdGhlIERPTVxuXG4vLyBVc2UgdGhlIGNsYXNzIC5hbGVydC1oaWRlIHRvIGp1c3Rcbi8vIGhpZGUgdGhlIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG5cblxuLy8gVGhpcyByZW1vdmVzIHRoZSBlbGVtZW50IGZyb20gdGhlIERPTVxuJCgnLmNsb3NlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICB2YXIgZWxlbSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcuYWxlcnQtZ29uZScpO1xuICBlbGVtLnJlbW92ZUNsYXNzKCdpbicpO1xuICBcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgZWxlbS5yZW1vdmUoKTtcbiAgfSwgNDUwKTtcbn0pO1xuXG4vLyBUaGlzIGp1c3QgaGlkZXMgdGhlIGVsZW1lbnRcbiQoJy5jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICB2YXIgaGlkaW5nID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudHMoJy5hbGVydC1oaWRlJyk7XG4gIGhpZGluZy5yZW1vdmVDbGFzcygnaW4nKTtcbn0pOyJdfQ==