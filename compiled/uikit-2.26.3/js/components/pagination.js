"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
 * Based on simplePagination - Copyright (c) 2012 Flavius Matis - http://flaviusmatis.github.com/simplePagination.js/ (MIT)
 */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-pagination", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('pagination', {

        defaults: {
            items: 1,
            itemsOnPage: 1,
            pages: 0,
            displayedPages: 7,
            edges: 1,
            currentPage: 0,
            lblPrev: false,
            lblNext: false,
            onSelectPage: function onSelectPage() {}
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$("[data-uk-pagination]", context).each(function () {
                    var ele = UI.$(this);

                    if (!ele.data("pagination")) {
                        UI.pagination(ele, UI.Utils.options(ele.attr("data-uk-pagination")));
                    }
                });
            });
        },

        init: function init() {

            var $this = this;

            this.pages = this.options.pages ? this.options.pages : Math.ceil(this.options.items / this.options.itemsOnPage) ? Math.ceil(this.options.items / this.options.itemsOnPage) : 1;
            this.currentPage = this.options.currentPage;
            this.halfDisplayed = this.options.displayedPages / 2;

            this.on("click", "a[data-page]", function (e) {
                e.preventDefault();
                $this.selectPage(UI.$(this).data("page"));
            });

            this._render();
        },

        _getInterval: function _getInterval() {

            return {
                start: Math.ceil(this.currentPage > this.halfDisplayed ? Math.max(Math.min(this.currentPage - this.halfDisplayed, this.pages - this.options.displayedPages), 0) : 0),
                end: Math.ceil(this.currentPage > this.halfDisplayed ? Math.min(this.currentPage + this.halfDisplayed, this.pages) : Math.min(this.options.displayedPages, this.pages))
            };
        },

        render: function render(pages) {
            this.pages = pages ? pages : this.pages;
            this._render();
        },

        selectPage: function selectPage(pageIndex, pages) {
            this.currentPage = pageIndex;
            this.render(pages);

            this.options.onSelectPage.apply(this, [pageIndex]);
            this.trigger('select.uk.pagination', [pageIndex, this]);
        },

        _render: function _render() {

            var o = this.options,
                interval = this._getInterval(),
                i;

            this.element.empty();

            // Generate Prev link
            if (o.lblPrev) this._append(this.currentPage - 1, { text: o.lblPrev });

            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {

                var end = Math.min(o.edges, interval.start);

                for (i = 0; i < end; i++) {
                    this._append(i);
                }if (o.edges < interval.start && interval.start - o.edges != 1) {
                    this.element.append('<li><span>...</span></li>');
                } else if (interval.start - o.edges == 1) {
                    this._append(o.edges);
                }
            }

            // Generate interval links
            for (i = interval.start; i < interval.end; i++) {
                this._append(i);
            } // Generate end edges
            if (interval.end < this.pages && o.edges > 0) {

                if (this.pages - o.edges > interval.end && this.pages - o.edges - interval.end != 1) {
                    this.element.append('<li><span>...</span></li>');
                } else if (this.pages - o.edges - interval.end == 1) {
                    this._append(interval.end++);
                }

                var begin = Math.max(this.pages - o.edges, interval.end);

                for (i = begin; i < this.pages; i++) {
                    this._append(i);
                }
            }

            // Generate Next link (unless option is set for at front)
            if (o.lblNext) this._append(this.currentPage + 1, { text: o.lblNext });
        },

        _append: function _append(pageIndex, opts) {

            var item, options;

            pageIndex = pageIndex < 0 ? 0 : pageIndex < this.pages ? pageIndex : this.pages - 1;
            options = UI.$.extend({ text: pageIndex + 1 }, opts);

            item = pageIndex == this.currentPage ? '<li class="uk-active"><span>' + options.text + '</span></li>' : '<li><a href="#page-' + (pageIndex + 1) + '" data-page="' + pageIndex + '">' + options.text + '</a></li>';

            this.element.append(item);
        }
    });

    return UI.pagination;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3BhZ2luYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8sa0JBQVAsRUFBMkIsQ0FBQyxPQUFELENBQTNCLEVBQXNDLFlBQVU7QUFDNUMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBRUEsT0FBRyxTQUFILENBQWEsWUFBYixFQUEyQjs7QUFFdkIsa0JBQVU7QUFDTixtQkFBaUIsQ0FEWDtBQUVOLHlCQUFpQixDQUZYO0FBR04sbUJBQWlCLENBSFg7QUFJTiw0QkFBaUIsQ0FKWDtBQUtOLG1CQUFpQixDQUxYO0FBTU4seUJBQWlCLENBTlg7QUFPTixxQkFBaUIsS0FQWDtBQVFOLHFCQUFpQixLQVJYO0FBU04sMEJBQWlCLHdCQUFXLENBQUU7QUFUeEIsU0FGYTs7QUFjdkIsY0FBTSxnQkFBVzs7O0FBR2IsZUFBRyxLQUFILENBQVMsVUFBUyxPQUFULEVBQWtCOztBQUV2QixtQkFBRyxDQUFILENBQUssc0JBQUwsRUFBNkIsT0FBN0IsRUFBc0MsSUFBdEMsQ0FBMkMsWUFBVTtBQUNqRCx3QkFBSSxNQUFNLEdBQUcsQ0FBSCxDQUFLLElBQUwsQ0FBVjs7QUFFQSx3QkFBSSxDQUFDLElBQUksSUFBSixDQUFTLFlBQVQsQ0FBTCxFQUE2QjtBQUN6QiwyQkFBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLG9C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RCxnQkFBSSxFQUFFLE9BQU4sRUFBZSxLQUFLLE9BQUwsQ0FBYSxLQUFLLFdBQUwsR0FBbUIsQ0FBaEMsRUFBbUMsRUFBQyxNQUFNLEVBQUUsT0FBVCxFQUFuQztBQUNsQixTQTVHc0I7O0FBOEd2QixpQkFBUyxpQkFBUyxTQUFULEVBQW9CLElBQXBCLEVBQTBCOztBQUUvQixnQkFBSSxJQUFKLEVBQVUsT0FBVjs7QUFFQSx3QkFBWSxZQUFZLENBQVosR0FBZ0IsQ0FBaEIsR0FBcUIsWUFBWSxLQUFLLEtBQWpCLEdBQXlCLFNBQXpCLEdBQXFDLEtBQUssS0FBTCxHQUFhLENBQW5GO0FBQ0Esc0JBQVksR0FBRyxDQUFILENBQUssTUFBTCxDQUFZLEVBQUUsTUFBTSxZQUFZLENBQXBCLEVBQVosRUFBcUMsSUFBckMsQ0FBWjs7QUFFQSxtQkFBUSxhQUFhLEtBQUssV0FBbkIsR0FBa0MsaUNBQWtDLFFBQVEsSUFBMUMsR0FBa0QsY0FBcEYsR0FBcUcseUJBQXVCLFlBQVUsQ0FBakMsSUFBb0MsZUFBcEMsR0FBb0QsU0FBcEQsR0FBOEQsSUFBOUQsR0FBbUUsUUFBUSxJQUEzRSxHQUFnRixXQUE1TDs7QUFFQSxpQkFBSyxPQUFMLENBQWEsTUFBYixDQUFvQixJQUFwQjtBQUNIO0FBeEhzQixLQUEzQjs7QUEySEEsV0FBTyxHQUFHLFVBQVY7QUFDSCxDQTlJRCIsImZpbGUiOiJwYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuLypcbiAqIEJhc2VkIG9uIHNpbXBsZVBhZ2luYXRpb24gLSBDb3B5cmlnaHQgKGMpIDIwMTIgRmxhdml1cyBNYXRpcyAtIGh0dHA6Ly9mbGF2aXVzbWF0aXMuZ2l0aHViLmNvbS9zaW1wbGVQYWdpbmF0aW9uLmpzLyAoTUlUKVxuICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1wYWdpbmF0aW9uXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpe1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBVSS5jb21wb25lbnQoJ3BhZ2luYXRpb24nLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIGl0ZW1zICAgICAgICAgIDogMSxcbiAgICAgICAgICAgIGl0ZW1zT25QYWdlICAgIDogMSxcbiAgICAgICAgICAgIHBhZ2VzICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIGRpc3BsYXllZFBhZ2VzIDogNyxcbiAgICAgICAgICAgIGVkZ2VzICAgICAgICAgIDogMSxcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlICAgIDogMCxcbiAgICAgICAgICAgIGxibFByZXYgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBsYmxOZXh0ICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgb25TZWxlY3RQYWdlICAgOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9vdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIGluaXQgY29kZVxuICAgICAgICAgICAgVUkucmVhZHkoZnVuY3Rpb24oY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgVUkuJChcIltkYXRhLXVrLXBhZ2luYXRpb25dXCIsIGNvbnRleHQpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZSA9IFVJLiQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcInBhZ2luYXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLnBhZ2luYXRpb24oZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay1wYWdpbmF0aW9uXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnBhZ2VzICAgICAgICAgPSB0aGlzLm9wdGlvbnMucGFnZXMgPyAgdGhpcy5vcHRpb25zLnBhZ2VzIDogTWF0aC5jZWlsKHRoaXMub3B0aW9ucy5pdGVtcyAvIHRoaXMub3B0aW9ucy5pdGVtc09uUGFnZSkgPyBNYXRoLmNlaWwodGhpcy5vcHRpb25zLml0ZW1zIC8gdGhpcy5vcHRpb25zLml0ZW1zT25QYWdlKSA6IDE7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlICAgPSB0aGlzLm9wdGlvbnMuY3VycmVudFBhZ2U7XG4gICAgICAgICAgICB0aGlzLmhhbGZEaXNwbGF5ZWQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheWVkUGFnZXMgLyAyO1xuXG4gICAgICAgICAgICB0aGlzLm9uKFwiY2xpY2tcIiwgXCJhW2RhdGEtcGFnZV1cIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICR0aGlzLnNlbGVjdFBhZ2UoVUkuJCh0aGlzKS5kYXRhKFwicGFnZVwiKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2dldEludGVydmFsOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGFydDogTWF0aC5jZWlsKHRoaXMuY3VycmVudFBhZ2UgPiB0aGlzLmhhbGZEaXNwbGF5ZWQgPyBNYXRoLm1heChNYXRoLm1pbih0aGlzLmN1cnJlbnRQYWdlIC0gdGhpcy5oYWxmRGlzcGxheWVkLCAodGhpcy5wYWdlcyAtIHRoaXMub3B0aW9ucy5kaXNwbGF5ZWRQYWdlcykpLCAwKSA6IDApLFxuICAgICAgICAgICAgICAgIGVuZCAgOiBNYXRoLmNlaWwodGhpcy5jdXJyZW50UGFnZSA+IHRoaXMuaGFsZkRpc3BsYXllZCA/IE1hdGgubWluKHRoaXMuY3VycmVudFBhZ2UgKyB0aGlzLmhhbGZEaXNwbGF5ZWQsIHRoaXMucGFnZXMpIDogTWF0aC5taW4odGhpcy5vcHRpb25zLmRpc3BsYXllZFBhZ2VzLCB0aGlzLnBhZ2VzKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbihwYWdlcykge1xuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IHBhZ2VzID8gcGFnZXMgOiB0aGlzLnBhZ2VzO1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VsZWN0UGFnZTogZnVuY3Rpb24ocGFnZUluZGV4LCBwYWdlcykge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2VJbmRleDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKHBhZ2VzKTtcblxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uU2VsZWN0UGFnZS5hcHBseSh0aGlzLCBbcGFnZUluZGV4XSk7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdC51ay5wYWdpbmF0aW9uJywgW3BhZ2VJbmRleCwgdGhpc10pO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9yZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgbyA9IHRoaXMub3B0aW9ucywgaW50ZXJ2YWwgPSB0aGlzLl9nZXRJbnRlcnZhbCgpLCBpO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZW1wdHkoKTtcblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgUHJldiBsaW5rXG4gICAgICAgICAgICBpZiAoby5sYmxQcmV2KSB0aGlzLl9hcHBlbmQodGhpcy5jdXJyZW50UGFnZSAtIDEsIHt0ZXh0OiBvLmxibFByZXZ9KTtcblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgc3RhcnQgZWRnZXNcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbC5zdGFydCA+IDAgJiYgby5lZGdlcyA+IDApIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbmQgPSBNYXRoLm1pbihvLmVkZ2VzLCBpbnRlcnZhbC5zdGFydCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZW5kOyBpKyspIHRoaXMuX2FwcGVuZChpKTtcblxuICAgICAgICAgICAgICAgIGlmIChvLmVkZ2VzIDwgaW50ZXJ2YWwuc3RhcnQgJiYgKGludGVydmFsLnN0YXJ0IC0gby5lZGdlcyAhPSAxKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKCc8bGk+PHNwYW4+Li4uPC9zcGFuPjwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbC5zdGFydCAtIG8uZWRnZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBlbmQoby5lZGdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBpbnRlcnZhbCBsaW5rc1xuICAgICAgICAgICAgZm9yIChpID0gaW50ZXJ2YWwuc3RhcnQ7IGkgPCBpbnRlcnZhbC5lbmQ7IGkrKykgdGhpcy5fYXBwZW5kKGkpO1xuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBlbmQgZWRnZXNcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbC5lbmQgPCB0aGlzLnBhZ2VzICYmIG8uZWRnZXMgPiAwKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlcyAtIG8uZWRnZXMgPiBpbnRlcnZhbC5lbmQgJiYgKHRoaXMucGFnZXMgLSBvLmVkZ2VzIC0gaW50ZXJ2YWwuZW5kICE9IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoJzxsaT48c3Bhbj4uLi48L3NwYW4+PC9saT4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFnZXMgLSBvLmVkZ2VzIC0gaW50ZXJ2YWwuZW5kID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kKGludGVydmFsLmVuZCsrKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgYmVnaW4gPSBNYXRoLm1heCh0aGlzLnBhZ2VzIC0gby5lZGdlcywgaW50ZXJ2YWwuZW5kKTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IGJlZ2luOyBpIDwgdGhpcy5wYWdlczsgaSsrKSB0aGlzLl9hcHBlbmQoaSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIE5leHQgbGluayAodW5sZXNzIG9wdGlvbiBpcyBzZXQgZm9yIGF0IGZyb250KVxuICAgICAgICAgICAgaWYgKG8ubGJsTmV4dCkgdGhpcy5fYXBwZW5kKHRoaXMuY3VycmVudFBhZ2UgKyAxLCB7dGV4dDogby5sYmxOZXh0fSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FwcGVuZDogZnVuY3Rpb24ocGFnZUluZGV4LCBvcHRzKSB7XG5cbiAgICAgICAgICAgIHZhciBpdGVtLCBvcHRpb25zO1xuXG4gICAgICAgICAgICBwYWdlSW5kZXggPSBwYWdlSW5kZXggPCAwID8gMCA6IChwYWdlSW5kZXggPCB0aGlzLnBhZ2VzID8gcGFnZUluZGV4IDogdGhpcy5wYWdlcyAtIDEpO1xuICAgICAgICAgICAgb3B0aW9ucyAgID0gVUkuJC5leHRlbmQoeyB0ZXh0OiBwYWdlSW5kZXggKyAxIH0sIG9wdHMpO1xuXG4gICAgICAgICAgICBpdGVtID0gKHBhZ2VJbmRleCA9PSB0aGlzLmN1cnJlbnRQYWdlKSA/ICc8bGkgY2xhc3M9XCJ1ay1hY3RpdmVcIj48c3Bhbj4nICsgKG9wdGlvbnMudGV4dCkgKyAnPC9zcGFuPjwvbGk+JyA6ICc8bGk+PGEgaHJlZj1cIiNwYWdlLScrKHBhZ2VJbmRleCsxKSsnXCIgZGF0YS1wYWdlPVwiJytwYWdlSW5kZXgrJ1wiPicrb3B0aW9ucy50ZXh0Kyc8L2E+PC9saT4nO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gVUkucGFnaW5hdGlvbjtcbn0pO1xuIl19