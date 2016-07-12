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
          { onClick: props.handleClick, id: page._id },
          page.title
        );
      })
    )
  );
};

window.Pages = Pages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3BhZ2VzLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxTQUFSLEtBQVEsQ0FBQyxLQUFEO0FBQUEsU0FDVjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUFBO0FBQUE7QUFDRyxZQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCO0FBQUEsZUFDZjtBQUFBO0FBQUEsWUFBSSxTQUFTLE1BQU0sV0FBbkIsRUFBZ0MsSUFBSSxLQUFLLEdBQXpDO0FBQStDLGVBQUs7QUFBcEQsU0FEZTtBQUFBLE9BQWhCO0FBREg7QUFGRixHQURVO0FBQUEsQ0FBWjs7QUFXQSxPQUFPLEtBQVAsR0FBZSxLQUFmIiwiZmlsZSI6InBhZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFBhZ2VzID0gKHByb3BzKSA9PiAoXG4gIDxkaXY+XG4gICAgPGgxPlBhZ2VzPC9oMT5cbiAgICA8dWw+XG4gICAgICB7cHJvcHMucGFnZXMubWFwKHBhZ2UgPT5cbiAgICAgICAgPGxpIG9uQ2xpY2s9e3Byb3BzLmhhbmRsZUNsaWNrfSBpZD17cGFnZS5faWR9PntwYWdlLnRpdGxlfTwvbGk+XG4gICAgICApfVxuICAgIDwvdWw+XG4gIDwvZGl2PlxuKTtcblxud2luZG93LlBhZ2VzID0gUGFnZXM7XG4iXX0=