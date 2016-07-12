'use strict';

// var ReactGridLayout = require('react-grid-layout');

var Canvas = React.createClass({
  displayName: 'Canvas',

  render: function render() {
    var layout = [{ i: 'a', x: 0, y: 0, w: 1, h: 2 }, { i: 'b', x: 1, y: 0, w: 3, h: 2 }, { i: 'c', x: 4, y: 0, w: 1, h: 2 }];
    return React.createElement(
      ReactGridLayout,
      { className: 'layout', layout: layout, cols: 12, rowHeight: 30, width: 1200 },
      React.createElement(
        'div',
        { style: { 'backgroundColor': 'blue' }, key: 'a' },
        'a'
      ),
      React.createElement(
        'div',
        { style: { 'backgroundColor': 'green' }, key: 'b' },
        'b'
      ),
      React.createElement(
        'div',
        { style: { 'backgroundColor': 'red' }, key: 'c' },
        'c'
      )
    );
  }
});

window.Canvas = Canvas;
// <div></div>
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NhbnZhcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUksU0FBUyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IsVUFBUSxrQkFBVztBQUNqQixRQUFJLFNBQVMsQ0FDWCxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUFlLEdBQUcsQ0FBbEIsRUFBcUIsR0FBRyxDQUF4QixFQUEyQixHQUFHLENBQTlCLEVBRFcsRUFFWCxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUFlLEdBQUcsQ0FBbEIsRUFBcUIsR0FBRyxDQUF4QixFQUEyQixHQUFHLENBQTlCLEVBRlcsRUFHWCxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUFlLEdBQUcsQ0FBbEIsRUFBcUIsR0FBRyxDQUF4QixFQUEyQixHQUFHLENBQTlCLEVBSFcsQ0FBYjtBQUtBLFdBQ0U7QUFBQyxxQkFBRDtBQUFBLFFBQWlCLFdBQVUsUUFBM0IsRUFBb0MsUUFBUSxNQUE1QyxFQUFvRCxNQUFNLEVBQTFELEVBQThELFdBQVcsRUFBekUsRUFBNkUsT0FBTyxJQUFwRjtBQUNFO0FBQUE7QUFBQSxVQUFLLE9BQU8sRUFBQyxtQkFBbUIsTUFBcEIsRUFBWixFQUF5QyxLQUFLLEdBQTlDO0FBQUE7QUFBQSxPQURGO0FBRUU7QUFBQTtBQUFBLFVBQUssT0FBTyxFQUFDLG1CQUFtQixPQUFwQixFQUFaLEVBQTBDLEtBQUssR0FBL0M7QUFBQTtBQUFBLE9BRkY7QUFHRTtBQUFBO0FBQUEsVUFBSyxPQUFPLEVBQUMsbUJBQW1CLEtBQXBCLEVBQVosRUFBd0MsS0FBSyxHQUE3QztBQUFBO0FBQUE7QUFIRixLQURGO0FBT0Q7QUFkNEIsQ0FBbEIsQ0FBYjs7QUFpQkEsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6ImNhbnZhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBSZWFjdEdyaWRMYXlvdXQgPSByZXF1aXJlKCdyZWFjdC1ncmlkLWxheW91dCcpO1xuXG52YXIgQ2FudmFzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXQgPSBbXG4gICAgICB7aTogJ2EnLCB4OiAwLCB5OiAwLCB3OiAxLCBoOiAyfSxcbiAgICAgIHtpOiAnYicsIHg6IDEsIHk6IDAsIHc6IDMsIGg6IDJ9LFxuICAgICAge2k6ICdjJywgeDogNCwgeTogMCwgdzogMSwgaDogMn1cbiAgICBdO1xuICAgIHJldHVybiAoXG4gICAgICA8UmVhY3RHcmlkTGF5b3V0IGNsYXNzTmFtZT1cImxheW91dFwiIGxheW91dD17bGF5b3V0fSBjb2xzPXsxMn0gcm93SGVpZ2h0PXszMH0gd2lkdGg9ezEyMDB9PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7J2JhY2tncm91bmRDb2xvcic6ICdibHVlJ319IGtleT17J2EnfT5hPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3snYmFja2dyb3VuZENvbG9yJzogJ2dyZWVuJ319IGtleT17J2InfT5iPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3snYmFja2dyb3VuZENvbG9yJzogJ3JlZCd9fSBrZXk9eydjJ30+YzwvZGl2PlxuICAgICAgPC9SZWFjdEdyaWRMYXlvdXQ+XG4gICAgKVxuICB9XG59KTtcblxud2luZG93LkNhbnZhcyA9IENhbnZhcztcbi8vIDxkaXY+PC9kaXY+XG4iXX0=