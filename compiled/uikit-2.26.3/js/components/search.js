"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-search", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('search', {
        defaults: {
            msgResultsHeader: 'Search Results',
            msgMoreResults: 'More Results',
            msgNoResults: 'No results found',
            template: '<ul class="uk-nav uk-nav-search uk-autocomplete-results">\
                                      {{#msgResultsHeader}}<li class="uk-nav-header uk-skip">{{msgResultsHeader}}</li>{{/msgResultsHeader}}\
                                      {{#items && items.length}}\
                                          {{~items}}\
                                          <li data-url="{{!$item.url}}">\
                                              <a href="{{!$item.url}}">\
                                                  {{{$item.title}}}\
                                                  {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}\
                                              </a>\
                                          </li>\
                                          {{/items}}\
                                          {{#msgMoreResults}}\
                                              <li class="uk-nav-divider uk-skip"></li>\
                                              <li class="uk-search-moreresults" data-moreresults="true"><a href="#" onclick="jQuery(this).closest(\'form\').submit();">{{msgMoreResults}}</a></li>\
                                          {{/msgMoreResults}}\
                                      {{/end}}\
                                      {{^items.length}}\
                                        {{#msgNoResults}}<li class="uk-skip"><a>{{msgNoResults}}</a></li>{{/msgNoResults}}\
                                      {{/end}}\
                                  </ul>',

            renderer: function renderer(data) {

                var opts = this.options;

                this.dropdown.append(this.template({ "items": data.results || [], "msgResultsHeader": opts.msgResultsHeader, "msgMoreResults": opts.msgMoreResults, "msgNoResults": opts.msgNoResults }));
                this.show();
            }
        },

        boot: function boot() {

            // init code
            UI.$html.on("focus.search.uikit", "[data-uk-search]", function (e) {
                var ele = UI.$(this);

                if (!ele.data("search")) {
                    UI.search(ele, UI.Utils.options(ele.attr("data-uk-search")));
                }
            });
        },

        init: function init() {
            var $this = this;

            this.autocomplete = UI.autocomplete(this.element, this.options);

            this.autocomplete.dropdown.addClass('uk-dropdown-search');

            this.autocomplete.input.on("keyup", function () {
                $this.element[$this.autocomplete.input.val() ? "addClass" : "removeClass"]("uk-active");
            }).closest("form").on("reset", function () {
                $this.value = "";
                $this.element.removeClass("uk-active");
            });

            this.on('selectitem.uk.autocomplete', function (e, data) {
                if (data.url) {
                    location.href = data.url;
                } else if (data.moreresults) {
                    $this.autocomplete.input.closest('form').submit();
                }
            });

            this.element.data("search", this);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3NlYXJjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxDQUFDLFVBQVMsS0FBVCxFQUFnQjs7QUFFYixRQUFJLFNBQUo7O0FBRUEsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDZCxvQkFBWSxNQUFNLEtBQU4sQ0FBWjtBQUNIOztBQUVELFFBQUksT0FBTyxNQUFQLElBQWlCLFVBQWpCLElBQStCLE9BQU8sR0FBMUMsRUFBK0M7QUFDM0MsZUFBTyxjQUFQLEVBQXVCLENBQUMsT0FBRCxDQUF2QixFQUFrQyxZQUFVO0FBQ3hDLG1CQUFPLGFBQWEsTUFBTSxLQUFOLENBQXBCO0FBQ0gsU0FGRDtBQUdIO0FBRUosQ0FkRCxFQWNHLFVBQVMsRUFBVCxFQUFZOztBQUVYOztBQUVBLE9BQUcsU0FBSCxDQUFhLFFBQWIsRUFBdUI7QUFDbkIsa0JBQVU7QUFDTiw4QkFBcUIsZ0JBRGY7QUFFTiw0QkFBcUIsY0FGZjtBQUdOLDBCQUFxQixrQkFIZjtBQUlOLHNCQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FKZjs7QUF5Qk4sc0JBQVUsa0JBQVMsSUFBVCxFQUFlOztBQUVyQixvQkFBSSxPQUFPLEtBQUssT0FBaEI7O0FBRUEscUJBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsS0FBSyxRQUFMLENBQWMsRUFBQyxTQUFRLEtBQUssT0FBTCxJQUFnQixFQUF6QixFQUE2QixvQkFBbUIsS0FBSyxnQkFBckQsRUFBdUUsa0JBQWtCLEtBQUssY0FBOUYsRUFBOEcsZ0JBQWdCLEtBQUssWUFBbkksRUFBZCxDQUFyQjtBQUNBLHFCQUFLLElBQUw7QUFDSDtBQS9CSyxTQURTOztBQW1DbkIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsRUFBVCxDQUFZLG9CQUFaLEVBQWtDLGtCQUFsQyxFQUFzRCxVQUFTLENBQVQsRUFBWTtBQUM5RCxvQkFBSSxNQUFLLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVDs7QUFFQSxvQkFBSSxDQUFDLElBQUksSUFBSixDQUFTLFFBQVQsQ0FBTCxFQUF5QjtBQUNyQix1QkFBRyxNQUFILENBQVUsR0FBVixFQUFlLEdBQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsSUFBSSxJQUFKLENBQVMsZ0JBQVQsQ0FBakIsQ0FBZjtBQUNIO0FBQ0osYUFORDtBQU9ILFNBN0NrQjs7QUErQ25CLGNBQU0sZ0JBQVc7QUFDYixnQkFBSSxRQUFRLElBQVo7O0FBRUEsaUJBQUssWUFBTCxHQUFvQixHQUFHLFlBQUgsQ0FBZ0IsS0FBSyxPQUFyQixFQUE4QixLQUFLLE9BQW5DLENBQXBCOztBQUVBLGlCQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBb0Msb0JBQXBDOztBQUVBLGlCQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsWUFBVTtBQUMxQyxzQkFBTSxPQUFOLENBQWMsTUFBTSxZQUFOLENBQW1CLEtBQW5CLENBQXlCLEdBQXpCLEtBQWlDLFVBQWpDLEdBQTRDLGFBQTFELEVBQXlFLFdBQXpFO0FBQ0gsYUFGRCxFQUVHLE9BRkgsQ0FFVyxNQUZYLEVBRW1CLEVBRm5CLENBRXNCLE9BRnRCLEVBRStCLFlBQVU7QUFDckMsc0JBQU0sS0FBTixHQUFZLEVBQVo7QUFDQSxzQkFBTSxPQUFOLENBQWMsV0FBZCxDQUEwQixXQUExQjtBQUNILGFBTEQ7O0FBT0EsaUJBQUssRUFBTCxDQUFRLDRCQUFSLEVBQXNDLFVBQVMsQ0FBVCxFQUFZLElBQVosRUFBa0I7QUFDcEQsb0JBQUksS0FBSyxHQUFULEVBQWM7QUFDWiw2QkFBUyxJQUFULEdBQWdCLEtBQUssR0FBckI7QUFDRCxpQkFGRCxNQUVPLElBQUcsS0FBSyxXQUFSLEVBQXFCO0FBQzFCLDBCQUFNLFlBQU4sQ0FBbUIsS0FBbkIsQ0FBeUIsT0FBekIsQ0FBaUMsTUFBakMsRUFBeUMsTUFBekM7QUFDRDtBQUNKLGFBTkQ7O0FBUUEsaUJBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUI7QUFDSDtBQXRFa0IsS0FBdkI7QUF3RUgsQ0ExRkQiLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtc2VhcmNoXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBVSS5jb21wb25lbnQoJ3NlYXJjaCcsIHtcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIG1zZ1Jlc3VsdHNIZWFkZXIgICA6ICdTZWFyY2ggUmVzdWx0cycsXG4gICAgICAgICAgICBtc2dNb3JlUmVzdWx0cyAgICAgOiAnTW9yZSBSZXN1bHRzJyxcbiAgICAgICAgICAgIG1zZ05vUmVzdWx0cyAgICAgICA6ICdObyByZXN1bHRzIGZvdW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlICAgICAgICAgICA6ICc8dWwgY2xhc3M9XCJ1ay1uYXYgdWstbmF2LXNlYXJjaCB1ay1hdXRvY29tcGxldGUtcmVzdWx0c1wiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7I21zZ1Jlc3VsdHNIZWFkZXJ9fTxsaSBjbGFzcz1cInVrLW5hdi1oZWFkZXIgdWstc2tpcFwiPnt7bXNnUmVzdWx0c0hlYWRlcn19PC9saT57ey9tc2dSZXN1bHRzSGVhZGVyfX1cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eyNpdGVtcyAmJiBpdGVtcy5sZW5ndGh9fVxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e35pdGVtc319XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLXVybD1cInt7ISRpdGVtLnVybH19XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwie3shJGl0ZW0udXJsfX1cIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e3skaXRlbS50aXRsZX19fVxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IyRpdGVtLnRleHR9fTxkaXY+e3t7JGl0ZW0udGV4dH19fTwvZGl2Pnt7LyRpdGVtLnRleHR9fVxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ey9pdGVtc319XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7I21zZ01vcmVSZXN1bHRzfX1cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInVrLW5hdi1kaXZpZGVyIHVrLXNraXBcIj48L2xpPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwidWstc2VhcmNoLW1vcmVyZXN1bHRzXCIgZGF0YS1tb3JlcmVzdWx0cz1cInRydWVcIj48YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJqUXVlcnkodGhpcykuY2xvc2VzdChcXCdmb3JtXFwnKS5zdWJtaXQoKTtcIj57e21zZ01vcmVSZXN1bHRzfX08L2E+PC9saT5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3svbXNnTW9yZVJlc3VsdHN9fVxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7L2VuZH19XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3teaXRlbXMubGVuZ3RofX1cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7I21zZ05vUmVzdWx0c319PGxpIGNsYXNzPVwidWstc2tpcFwiPjxhPnt7bXNnTm9SZXN1bHRzfX08L2E+PC9saT57ey9tc2dOb1Jlc3VsdHN9fVxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7L2VuZH19XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPicsXG5cbiAgICAgICAgICAgIHJlbmRlcmVyOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uYXBwZW5kKHRoaXMudGVtcGxhdGUoe1wiaXRlbXNcIjpkYXRhLnJlc3VsdHMgfHwgW10sIFwibXNnUmVzdWx0c0hlYWRlclwiOm9wdHMubXNnUmVzdWx0c0hlYWRlciwgXCJtc2dNb3JlUmVzdWx0c1wiOiBvcHRzLm1zZ01vcmVSZXN1bHRzLCBcIm1zZ05vUmVzdWx0c1wiOiBvcHRzLm1zZ05vUmVzdWx0c30pKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS4kaHRtbC5vbihcImZvY3VzLnNlYXJjaC51aWtpdFwiLCBcIltkYXRhLXVrLXNlYXJjaF1cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGUgPVVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZS5kYXRhKFwic2VhcmNoXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIFVJLnNlYXJjaChlbGUsIFVJLlV0aWxzLm9wdGlvbnMoZWxlLmF0dHIoXCJkYXRhLXVrLXNlYXJjaFwiKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUgPSBVSS5hdXRvY29tcGxldGUodGhpcy5lbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5kcm9wZG93bi5hZGRDbGFzcygndWstZHJvcGRvd24tc2VhcmNoJyk7XG5cbiAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmlucHV0Lm9uKFwia2V5dXBcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50WyR0aGlzLmF1dG9jb21wbGV0ZS5pbnB1dC52YWwoKSA/IFwiYWRkQ2xhc3NcIjpcInJlbW92ZUNsYXNzXCJdKFwidWstYWN0aXZlXCIpO1xuICAgICAgICAgICAgfSkuY2xvc2VzdChcImZvcm1cIikub24oXCJyZXNldFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR0aGlzLnZhbHVlPVwiXCI7XG4gICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyhcInVrLWFjdGl2ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdzZWxlY3RpdGVtLnVrLmF1dG9jb21wbGV0ZScsIGZ1bmN0aW9uKGUsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS51cmwpIHtcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBkYXRhLnVybDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZGF0YS5tb3JlcmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgJHRoaXMuYXV0b2NvbXBsZXRlLmlucHV0LmNsb3Nlc3QoJ2Zvcm0nKS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGEoXCJzZWFyY2hcIiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl19