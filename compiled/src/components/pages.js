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
      null,
      props.pages.map(function (page) {
        return React.createElement(
          "li",
          { key: page._id },
          page.title
        );
      })
    )
  );
};

window.Pages = Pages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3BhZ2VzLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxTQUFSLEtBQVEsQ0FBQyxLQUFEO0FBQUEsU0FDVjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUFBO0FBQUE7QUFDRyxZQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQUEsZUFDZjtBQUFBO0FBQUEsWUFBSSxLQUFLLEtBQUssR0FBZDtBQUFvQixlQUFLO0FBQXpCLFNBRGU7QUFBQSxPQUFoQjtBQURIO0FBRkYsR0FEVTtBQUFBLENBQVo7O0FBV0EsT0FBTyxLQUFQLEdBQWUsS0FBZiIsImZpbGUiOiJwYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQYWdlcyA9IChwcm9wcykgPT4gKFxuICA8ZGl2PlxuICAgIDxoMT5QYWdlczwvaDE+XG4gICAgPHVsPlxuICAgICAge3Byb3BzLnBhZ2VzLm1hcChwYWdlID0+XG4gICAgICAgIDxsaSBrZXk9e3BhZ2UuX2lkfT57cGFnZS50aXRsZX08L2xpPlxuICAgICAgKX1cbiAgICA8L3VsPlxuICA8L2Rpdj5cbik7XG5cbndpbmRvdy5QYWdlcyA9IFBhZ2VzO1xuIl19