"use strict";

var Pages = function Pages(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      null,
      "Pages"
    ),
    React.createElement(
      "ul",
      { className: "list-group" },
      props.pages.map(function (page) {
        return React.createElement(
          "li",
          { className: "list-group-element", onClick: props.handleClick, id: page._id },
          page.title
        );
      })
    )
  );
};

window.Pages = Pages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3BhZ2VzLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxTQUFSLEtBQVEsQ0FBQyxLQUFEO0FBQUEsU0FDVjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFDRyxZQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQUEsZUFDZjtBQUFBO0FBQUEsWUFBSSxXQUFVLG9CQUFkLEVBQW1DLFNBQVMsTUFBTSxXQUFsRCxFQUErRCxJQUFJLEtBQUssR0FBeEU7QUFBK0UsZUFBSztBQUFwRixTQURlO0FBQUEsT0FBaEI7QUFESDtBQUZGLEdBRFU7QUFBQSxDQUFaOztBQVdBLE9BQU8sS0FBUCxHQUFlLEtBQWYiLCJmaWxlIjoicGFnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUGFnZXMgPSAocHJvcHMpID0+IChcbiAgPGRpdj5cbiAgICA8aDE+UGFnZXM8L2gxPlxuICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XG4gICAgICB7cHJvcHMucGFnZXMubWFwKHBhZ2UgPT5cbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtZWxlbWVudFwiIG9uQ2xpY2s9e3Byb3BzLmhhbmRsZUNsaWNrfSBpZD17cGFnZS5faWR9ID57cGFnZS50aXRsZX08L2xpPlxuICAgICAgKX1cbiAgICA8L3VsPlxuICA8L2Rpdj5cbik7XG5cbndpbmRvdy5QYWdlcyA9IFBhZ2VzO1xuIl19