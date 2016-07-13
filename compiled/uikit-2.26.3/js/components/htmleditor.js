"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-htmleditor", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    var editors = [];

    UI.component('htmleditor', {

        defaults: {
            iframe: false,
            mode: 'split',
            markdown: false,
            autocomplete: true,
            height: 500,
            maxsplitsize: 1000,
            codemirror: { mode: 'htmlmixed', lineWrapping: true, dragDrop: false, autoCloseTags: true, matchTags: true, autoCloseBrackets: true, matchBrackets: true, indentUnit: 4, indentWithTabs: false, tabSize: 4, hintOptions: { completionSingle: false } },
            toolbar: ['bold', 'italic', 'strike', 'link', 'image', 'blockquote', 'listUl', 'listOl'],
            lblPreview: 'Preview',
            lblCodeview: 'HTML',
            lblMarkedview: 'Markdown'
        },

        boot: function boot() {

            // init code
            UI.ready(function (context) {

                UI.$('textarea[data-uk-htmleditor]', context).each(function () {

                    var editor = UI.$(this);

                    if (!editor.data('htmleditor')) {
                        UI.htmleditor(editor, UI.Utils.options(editor.attr('data-uk-htmleditor')));
                    }
                });
            });
        },

        init: function init() {

            var $this = this,
                tpl = UI.components.htmleditor.template;

            this.CodeMirror = this.options.CodeMirror || CodeMirror;
            this.buttons = {};

            tpl = tpl.replace(/\{:lblPreview}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{:lblCodeview}/g, this.options.lblCodeview);

            this.htmleditor = UI.$(tpl);
            this.content = this.htmleditor.find('.uk-htmleditor-content');
            this.toolbar = this.htmleditor.find('.uk-htmleditor-toolbar');
            this.preview = this.htmleditor.find('.uk-htmleditor-preview').children().eq(0);
            this.code = this.htmleditor.find('.uk-htmleditor-code');

            this.element.before(this.htmleditor).appendTo(this.code);
            this.editor = this.CodeMirror.fromTextArea(this.element[0], this.options.codemirror);
            this.editor.htmleditor = this;
            this.editor.on('change', UI.Utils.debounce(function () {
                $this.render();
            }, 150));
            this.editor.on('change', function () {
                $this.editor.save();
                $this.element.trigger('input');
            });
            this.code.find('.CodeMirror').css('height', this.options.height);

            // iframe mode?
            if (this.options.iframe) {

                this.iframe = UI.$('<iframe class="uk-htmleditor-iframe" frameborder="0" scrolling="auto" height="100" width="100%"></iframe>');
                this.preview.append(this.iframe);

                // must open and close document object to start using it!
                this.iframe[0].contentWindow.document.open();
                this.iframe[0].contentWindow.document.close();

                this.preview.container = UI.$(this.iframe[0].contentWindow.document).find('body');

                // append custom stylesheet
                if (typeof this.options.iframe === 'string') {
                    this.preview.container.parent().append('<link rel="stylesheet" href="' + this.options.iframe + '">');
                }
            } else {
                this.preview.container = this.preview;
            }

            UI.$win.on('resize load', UI.Utils.debounce(function () {
                $this.fit();
            }, 200));

            var previewContainer = this.iframe ? this.preview.container : $this.preview.parent(),
                codeContent = this.code.find('.CodeMirror-sizer'),
                codeScroll = this.code.find('.CodeMirror-scroll').on('scroll', UI.Utils.debounce(function () {

                if ($this.htmleditor.attr('data-mode') == 'tab') return;

                // calc position
                var codeHeight = codeContent.height() - codeScroll.height(),
                    previewHeight = previewContainer[0].scrollHeight - ($this.iframe ? $this.iframe.height() : previewContainer.height()),
                    ratio = previewHeight / codeHeight,
                    previewPosition = codeScroll.scrollTop() * ratio;

                // apply new scroll
                previewContainer.scrollTop(previewPosition);
            }, 10));

            this.htmleditor.on('click', '.uk-htmleditor-button-code, .uk-htmleditor-button-preview', function (e) {

                e.preventDefault();

                if ($this.htmleditor.attr('data-mode') == 'tab') {

                    $this.htmleditor.find('.uk-htmleditor-button-code, .uk-htmleditor-button-preview').removeClass('uk-active').filter(this).addClass('uk-active');

                    $this.activetab = UI.$(this).hasClass('uk-htmleditor-button-code') ? 'code' : 'preview';
                    $this.htmleditor.attr('data-active-tab', $this.activetab);
                    $this.editor.refresh();
                }
            });

            // toolbar actions
            this.htmleditor.on('click', 'a[data-htmleditor-button]', function () {

                if (!$this.code.is(':visible')) return;

                $this.trigger('action.' + UI.$(this).data('htmleditor-button'), [$this.editor]);
            });

            this.preview.parent().css('height', this.code.height());

            // autocomplete
            if (this.options.autocomplete && this.CodeMirror.showHint && this.CodeMirror.hint && this.CodeMirror.hint.html) {

                this.editor.on('inputRead', UI.Utils.debounce(function () {
                    var doc = $this.editor.getDoc(),
                        POS = doc.getCursor(),
                        mode = $this.CodeMirror.innerMode($this.editor.getMode(), $this.editor.getTokenAt(POS).state).mode.name;

                    if (mode == 'xml') {
                        //html depends on xml

                        var cur = $this.editor.getCursor(),
                            token = $this.editor.getTokenAt(cur);

                        if (token.string.charAt(0) == '<' || token.type == 'attribute') {
                            $this.CodeMirror.showHint($this.editor, $this.CodeMirror.hint.html, { completeSingle: false });
                        }
                    }
                }, 100));
            }

            this.debouncedRedraw = UI.Utils.debounce(function () {
                $this.redraw();
            }, 5);

            this.on('init.uk.component', function () {
                $this.debouncedRedraw();
            });

            this.element.attr('data-uk-check-display', 1).on('display.uk.check', function (e) {
                if (this.htmleditor.is(":visible")) this.fit();
            }.bind(this));

            editors.push(this);
        },

        addButton: function addButton(name, button) {
            this.buttons[name] = button;
        },

        addButtons: function addButtons(buttons) {
            UI.$.extend(this.buttons, buttons);
        },

        replaceInPreview: function replaceInPreview(regexp, callback) {

            var editor = this.editor,
                results = [],
                value = editor.getValue(),
                offset = -1,
                index = 0;

            this.currentvalue = this.currentvalue.replace(regexp, function () {

                offset = value.indexOf(arguments[0], ++offset);

                var match = {
                    matches: arguments,
                    from: translateOffset(offset),
                    to: translateOffset(offset + arguments[0].length),
                    replace: function replace(value) {
                        editor.replaceRange(value, match.from, match.to);
                    },
                    inRange: function inRange(cursor) {

                        if (cursor.line === match.from.line && cursor.line === match.to.line) {
                            return cursor.ch >= match.from.ch && cursor.ch < match.to.ch;
                        }

                        return cursor.line === match.from.line && cursor.ch >= match.from.ch || cursor.line > match.from.line && cursor.line < match.to.line || cursor.line === match.to.line && cursor.ch < match.to.ch;
                    }
                };

                var result = typeof callback === 'string' ? callback : callback(match, index);

                if (!result && result !== '') {
                    return arguments[0];
                }

                index++;

                results.push(match);
                return result;
            });

            function translateOffset(offset) {
                var result = editor.getValue().substring(0, offset).split('\n');
                return { line: result.length - 1, ch: result[result.length - 1].length };
            }

            return results;
        },

        _buildtoolbar: function _buildtoolbar() {

            if (!(this.options.toolbar && this.options.toolbar.length)) return;

            var $this = this,
                bar = [];

            this.toolbar.empty();

            this.options.toolbar.forEach(function (button) {
                if (!$this.buttons[button]) return;

                var title = $this.buttons[button].title ? $this.buttons[button].title : button;

                bar.push('<li><a data-htmleditor-button="' + button + '" title="' + title + '" data-uk-tooltip>' + $this.buttons[button].label + '</a></li>');
            });

            this.toolbar.html(bar.join('\n'));
        },

        fit: function fit() {

            var mode = this.options.mode;

            if (mode == 'split' && this.htmleditor.width() < this.options.maxsplitsize) {
                mode = 'tab';
            }

            if (mode == 'tab') {
                if (!this.activetab) {
                    this.activetab = 'code';
                    this.htmleditor.attr('data-active-tab', this.activetab);
                }

                this.htmleditor.find('.uk-htmleditor-button-code, .uk-htmleditor-button-preview').removeClass('uk-active').filter(this.activetab == 'code' ? '.uk-htmleditor-button-code' : '.uk-htmleditor-button-preview').addClass('uk-active');
            }

            this.editor.refresh();
            this.preview.parent().css('height', this.code.height());

            this.htmleditor.attr('data-mode', mode);
        },

        redraw: function redraw() {
            this._buildtoolbar();
            this.render();
            this.fit();
        },

        getMode: function getMode() {
            return this.editor.getOption('mode');
        },

        getCursorMode: function getCursorMode() {
            var param = { mode: 'html' };
            this.trigger('cursorMode', [param]);
            return param.mode;
        },

        render: function render() {

            this.currentvalue = this.editor.getValue();

            // empty code
            if (!this.currentvalue) {

                this.element.val('');
                this.preview.container.html('');

                return;
            }

            this.trigger('render', [this]);
            this.trigger('renderLate', [this]);

            this.preview.container.html(this.currentvalue);
        },

        addShortcut: function addShortcut(name, callback) {
            var map = {};
            if (!UI.$.isArray(name)) {
                name = [name];
            }

            name.forEach(function (key) {
                map[key] = callback;
            });

            this.editor.addKeyMap(map);

            return map;
        },

        addShortcutAction: function addShortcutAction(action, shortcuts) {
            var editor = this;
            this.addShortcut(shortcuts, function () {
                editor.element.trigger('action.' + action, [editor.editor]);
            });
        },

        replaceSelection: function replaceSelection(replace) {

            var text = this.editor.getSelection();

            if (!text.length) {

                var cur = this.editor.getCursor(),
                    curLine = this.editor.getLine(cur.line),
                    start = cur.ch,
                    end = start;

                while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) {
                    ++end;
                }while (start && /[\w$]+/.test(curLine.charAt(start - 1))) {
                    --start;
                }var curWord = start != end && curLine.slice(start, end);

                if (curWord) {
                    this.editor.setSelection({ line: cur.line, ch: start }, { line: cur.line, ch: end });
                    text = curWord;
                }
            }

            var html = replace.replace('$1', text);

            this.editor.replaceSelection(html, 'end');
            this.editor.focus();
        },

        replaceLine: function replaceLine(replace) {
            var pos = this.editor.getDoc().getCursor(),
                text = this.editor.getLine(pos.line),
                html = replace.replace('$1', text);

            this.editor.replaceRange(html, { line: pos.line, ch: 0 }, { line: pos.line, ch: text.length });
            this.editor.setCursor({ line: pos.line, ch: html.length });
            this.editor.focus();
        },

        save: function save() {
            this.editor.save();
        }
    });

    UI.components.htmleditor.template = ['<div class="uk-htmleditor uk-clearfix" data-mode="split">', '<div class="uk-htmleditor-navbar">', '<ul class="uk-htmleditor-navbar-nav uk-htmleditor-toolbar"></ul>', '<div class="uk-htmleditor-navbar-flip">', '<ul class="uk-htmleditor-navbar-nav">', '<li class="uk-htmleditor-button-code"><a>{:lblCodeview}</a></li>', '<li class="uk-htmleditor-button-preview"><a>{:lblPreview}</a></li>', '<li><a data-htmleditor-button="fullscreen"><i class="uk-icon-expand"></i></a></li>', '</ul>', '</div>', '</div>', '<div class="uk-htmleditor-content">', '<div class="uk-htmleditor-code"></div>', '<div class="uk-htmleditor-preview"><div></div></div>', '</div>', '</div>'].join('');

    UI.plugin('htmleditor', 'base', {

        init: function init(editor) {

            editor.addButtons({

                fullscreen: {
                    title: 'Fullscreen',
                    label: '<i class="uk-icon-expand"></i>'
                },
                bold: {
                    title: 'Bold',
                    label: '<i class="uk-icon-bold"></i>'
                },
                italic: {
                    title: 'Italic',
                    label: '<i class="uk-icon-italic"></i>'
                },
                strike: {
                    title: 'Strikethrough',
                    label: '<i class="uk-icon-strikethrough"></i>'
                },
                blockquote: {
                    title: 'Blockquote',
                    label: '<i class="uk-icon-quote-right"></i>'
                },
                link: {
                    title: 'Link',
                    label: '<i class="uk-icon-link"></i>'
                },
                image: {
                    title: 'Image',
                    label: '<i class="uk-icon-picture-o"></i>'
                },
                listUl: {
                    title: 'Unordered List',
                    label: '<i class="uk-icon-list-ul"></i>'
                },
                listOl: {
                    title: 'Ordered List',
                    label: '<i class="uk-icon-list-ol"></i>'
                }

            });

            addAction('bold', '<strong>$1</strong>');
            addAction('italic', '<em>$1</em>');
            addAction('strike', '<del>$1</del>');
            addAction('blockquote', '<blockquote><p>$1</p></blockquote>', 'replaceLine');
            addAction('link', '<a href="http://">$1</a>');
            addAction('image', '<img src="http://" alt="$1">');

            var listfn = function listfn(tag) {
                if (editor.getCursorMode() == 'html') {

                    tag = tag || 'ul';

                    var cm = editor.editor,
                        doc = cm.getDoc(),
                        pos = doc.getCursor(true),
                        posend = doc.getCursor(false),
                        im = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(cm.getCursor()).state),
                        inList = im && im.state && im.state.context && ['ul', 'ol'].indexOf(im.state.context.tagName) != -1;

                    for (var i = pos.line; i < posend.line + 1; i++) {
                        cm.replaceRange('<li>' + cm.getLine(i) + '</li>', { line: i, ch: 0 }, { line: i, ch: cm.getLine(i).length });
                    }

                    if (!inList) {
                        cm.replaceRange('<' + tag + '>' + "\n" + cm.getLine(pos.line), { line: pos.line, ch: 0 }, { line: pos.line, ch: cm.getLine(pos.line).length });
                        cm.replaceRange(cm.getLine(posend.line + 1) + "\n" + '</' + tag + '>', { line: posend.line + 1, ch: 0 }, { line: posend.line + 1, ch: cm.getLine(posend.line + 1).length });
                        cm.setCursor({ line: posend.line + 1, ch: cm.getLine(posend.line + 1).length });
                    } else {
                        cm.setCursor({ line: posend.line, ch: cm.getLine(posend.line).length });
                    }

                    cm.focus();
                }
            };

            editor.on('action.listUl', function () {
                listfn('ul');
            });

            editor.on('action.listOl', function () {
                listfn('ol');
            });

            editor.htmleditor.on('click', 'a[data-htmleditor-button="fullscreen"]', function () {
                editor.htmleditor.toggleClass('uk-htmleditor-fullscreen');

                var wrap = editor.editor.getWrapperElement();

                if (editor.htmleditor.hasClass('uk-htmleditor-fullscreen')) {

                    editor.editor.state.fullScreenRestore = { scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset, width: wrap.style.width, height: wrap.style.height };
                    wrap.style.width = '';
                    wrap.style.height = editor.content.height() + 'px';
                    document.documentElement.style.overflow = 'hidden';
                } else {

                    document.documentElement.style.overflow = '';
                    var info = editor.editor.state.fullScreenRestore;
                    wrap.style.width = info.width;wrap.style.height = info.height;
                    window.scrollTo(info.scrollLeft, info.scrollTop);
                }

                setTimeout(function () {
                    editor.fit();
                    UI.$win.trigger('resize');
                }, 50);
            });

            editor.addShortcut(['Ctrl-S', 'Cmd-S'], function () {
                editor.element.trigger('htmleditor-save', [editor]);
            });
            editor.addShortcutAction('bold', ['Ctrl-B', 'Cmd-B']);

            function addAction(name, replace, mode) {
                editor.on('action.' + name, function () {
                    if (editor.getCursorMode() == 'html') {
                        editor[mode == 'replaceLine' ? 'replaceLine' : 'replaceSelection'](replace);
                    }
                });
            }
        }
    });

    UI.plugin('htmleditor', 'markdown', {

        init: function init(editor) {

            var parser = editor.options.mdparser || window.marked || null;

            if (!parser) return;

            if (editor.options.markdown) {
                _enableMarkdown();
            }

            addAction('bold', '**$1**');
            addAction('italic', '*$1*');
            addAction('strike', '~~$1~~');
            addAction('blockquote', '> $1', 'replaceLine');
            addAction('link', '[$1](http://)');
            addAction('image', '![$1](http://)');

            editor.on('action.listUl', function () {

                if (editor.getCursorMode() == 'markdown') {

                    var cm = editor.editor,
                        pos = cm.getDoc().getCursor(true),
                        posend = cm.getDoc().getCursor(false);

                    for (var i = pos.line; i < posend.line + 1; i++) {
                        cm.replaceRange('* ' + cm.getLine(i), { line: i, ch: 0 }, { line: i, ch: cm.getLine(i).length });
                    }

                    cm.setCursor({ line: posend.line, ch: cm.getLine(posend.line).length });
                    cm.focus();
                }
            });

            editor.on('action.listOl', function () {

                if (editor.getCursorMode() == 'markdown') {

                    var cm = editor.editor,
                        pos = cm.getDoc().getCursor(true),
                        posend = cm.getDoc().getCursor(false),
                        prefix = 1;

                    if (pos.line > 0) {
                        var prevline = cm.getLine(pos.line - 1),
                            matches;

                        if (matches = prevline.match(/^(\d+)\./)) {
                            prefix = Number(matches[1]) + 1;
                        }
                    }

                    for (var i = pos.line; i < posend.line + 1; i++) {
                        cm.replaceRange(prefix + '. ' + cm.getLine(i), { line: i, ch: 0 }, { line: i, ch: cm.getLine(i).length });
                        prefix++;
                    }

                    cm.setCursor({ line: posend.line, ch: cm.getLine(posend.line).length });
                    cm.focus();
                }
            });

            editor.on('renderLate', function () {
                if (editor.editor.options.mode == 'gfm') {
                    editor.currentvalue = parser(editor.currentvalue);
                }
            });

            editor.on('cursorMode', function (e, param) {
                if (editor.editor.options.mode == 'gfm') {
                    var pos = editor.editor.getDoc().getCursor();
                    if (!editor.editor.getTokenAt(pos).state.base.htmlState) {
                        param.mode = 'markdown';
                    }
                }
            });

            UI.$.extend(editor, {

                enableMarkdown: function enableMarkdown() {
                    _enableMarkdown();
                    this.render();
                },
                disableMarkdown: function disableMarkdown() {
                    this.editor.setOption('mode', 'htmlmixed');
                    this.htmleditor.find('.uk-htmleditor-button-code a').html(this.options.lblCodeview);
                    this.render();
                }

            });

            // switch markdown mode on event
            editor.on({
                enableMarkdown: function enableMarkdown() {
                    editor.enableMarkdown();
                },
                disableMarkdown: function disableMarkdown() {
                    editor.disableMarkdown();
                }
            });

            function _enableMarkdown() {
                editor.editor.setOption('mode', 'gfm');
                editor.htmleditor.find('.uk-htmleditor-button-code a').html(editor.options.lblMarkedview);
            }

            function addAction(name, replace, mode) {
                editor.on('action.' + name, function () {
                    if (editor.getCursorMode() == 'markdown') {
                        editor[mode == 'replaceLine' ? 'replaceLine' : 'replaceSelection'](replace);
                    }
                });
            }
        }
    });

    return UI.htmleditor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL2h0bWxlZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8sa0JBQVAsRUFBMkIsQ0FBQyxPQUFELENBQTNCLEVBQXNDLFlBQVU7QUFDNUMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQWE7O0FBRVo7O0FBRUEsUUFBSSxVQUFVLEVBQWQ7O0FBRUEsT0FBRyxTQUFILENBQWEsWUFBYixFQUEyQjs7QUFFdkIsa0JBQVU7QUFDTixvQkFBZSxLQURUO0FBRU4sa0JBQWUsT0FGVDtBQUdOLHNCQUFlLEtBSFQ7QUFJTiwwQkFBZSxJQUpUO0FBS04sb0JBQWUsR0FMVDtBQU1OLDBCQUFlLElBTlQ7QUFPTix3QkFBZSxFQUFFLE1BQU0sV0FBUixFQUFxQixjQUFjLElBQW5DLEVBQXlDLFVBQVUsS0FBbkQsRUFBMEQsZUFBZSxJQUF6RSxFQUErRSxXQUFXLElBQTFGLEVBQWdHLG1CQUFtQixJQUFuSCxFQUF5SCxlQUFlLElBQXhJLEVBQThJLFlBQVksQ0FBMUosRUFBNkosZ0JBQWdCLEtBQTdLLEVBQW9MLFNBQVMsQ0FBN0wsRUFBZ00sYUFBYSxFQUFDLGtCQUFpQixLQUFsQixFQUE3TSxFQVBUO0FBUU4scUJBQWUsQ0FBRSxNQUFGLEVBQVUsUUFBVixFQUFvQixRQUFwQixFQUE4QixNQUE5QixFQUFzQyxPQUF0QyxFQUErQyxZQUEvQyxFQUE2RCxRQUE3RCxFQUF1RSxRQUF2RSxDQVJUO0FBU04sd0JBQWUs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UyxlQUFULEdBQTBCO0FBQ3RCLHVCQUFPLE1BQVAsQ0FBYyxTQUFkLENBQXdCLE1BQXhCLEVBQWdDLEtBQWhDO0FBQ0EsdUJBQU8sVUFBUCxDQUFrQixJQUFsQixDQUF1Qiw4QkFBdkIsRUFBdUQsSUFBdkQsQ0FBNEQsT0FBTyxPQUFQLENBQWUsYUFBM0U7QUFDSDs7QUFFRCxxQkFBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLE9BQXpCLEVBQWtDLElBQWxDLEVBQXdDO0FBQ3BDLHVCQUFPLEVBQVAsQ0FBVSxZQUFVLElBQXBCLEVBQTBCLFlBQVc7QUFDakMsd0JBQUksT0FBTyxhQUFQLE1BQTBCLFVBQTlCLEVBQTBDO0FBQ3RDLCtCQUFPLFFBQVEsYUFBUixHQUF3QixhQUF4QixHQUF3QyxrQkFBL0MsRUFBbUUsT0FBbkU7QUFDSDtBQUNKLGlCQUpEO0FBS0g7QUFDSjtBQTlHK0IsS0FBcEM7O0FBaUhBLFdBQU8sR0FBRyxVQUFWO0FBQ0gsQ0F6bkJEIiwiZmlsZSI6Imh0bWxlZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVUlraXQgMi4yNi4zIHwgaHR0cDovL3d3dy5nZXR1aWtpdC5jb20gfCAoYykgMjAxNCBZT090aGVtZSB8IE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24oYWRkb24pIHtcblxuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICBpZiAod2luZG93LlVJa2l0KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGFkZG9uKFVJa2l0KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJ1aWtpdC1odG1sZWRpdG9yXCIsIFtcInVpa2l0XCJdLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudCB8fCBhZGRvbihVSWtpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoZnVuY3Rpb24oVUkpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGVkaXRvcnMgPSBbXTtcblxuICAgIFVJLmNvbXBvbmVudCgnaHRtbGVkaXRvcicsIHtcblxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgaWZyYW1lICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBtb2RlICAgICAgICAgOiAnc3BsaXQnLFxuICAgICAgICAgICAgbWFya2Rvd24gICAgIDogZmFsc2UsXG4gICAgICAgICAgICBhdXRvY29tcGxldGUgOiB0cnVlLFxuICAgICAgICAgICAgaGVpZ2h0ICAgICAgIDogNTAwLFxuICAgICAgICAgICAgbWF4c3BsaXRzaXplIDogMTAwMCxcbiAgICAgICAgICAgIGNvZGVtaXJyb3IgICA6IHsgbW9kZTogJ2h0bWxtaXhlZCcsIGxpbmVXcmFwcGluZzogdHJ1ZSwgZHJhZ0Ryb3A6IGZhbHNlLCBhdXRvQ2xvc2VUYWdzOiB0cnVlLCBtYXRjaFRhZ3M6IHRydWUsIGF1dG9DbG9zZUJyYWNrZXRzOiB0cnVlLCBtYXRjaEJyYWNrZXRzOiB0cnVlLCBpbmRlbnRVbml0OiA0LCBpbmRlbnRXaXRoVGFiczogZmFsc2UsIHRhYlNpemU6IDQsIGhpbnRPcHRpb25zOiB7Y29tcGxldGlvblNpbmdsZTpmYWxzZX0gfSxcbiAgICAgICAgICAgIHRvb2xiYXIgICAgICA6IFsgJ2JvbGQnLCAnaXRhbGljJywgJ3N0cmlrZScsICdsaW5rJywgJ2ltYWdlJywgJ2Jsb2NrcXVvdGUnLCAnbGlzdFVsJywgJ2xpc3RPbCcgXSxcbiAgICAgICAgICAgIGxibFByZXZpZXcgICA6ICdQcmV2aWV3JyxcbiAgICAgICAgICAgIGxibENvZGV2aWV3ICA6ICdIVE1MJyxcbiAgICAgICAgICAgIGxibE1hcmtlZHZpZXc6ICdNYXJrZG93bidcbiAgICAgICAgfSxcblxuICAgICAgICBib290OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBjb2RlXG4gICAgICAgICAgICBVSS5yZWFkeShmdW5jdGlvbihjb250ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICBVSS4kKCd0ZXh0YXJlYVtkYXRhLXVrLWh0bWxlZGl0b3JdJywgY29udGV4dCkuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gVUkuJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvci5kYXRhKCdodG1sZWRpdG9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVJLmh0bWxlZGl0b3IoZWRpdG9yLCBVSS5VdGlscy5vcHRpb25zKGVkaXRvci5hdHRyKCdkYXRhLXVrLWh0bWxlZGl0b3InKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcywgdHBsID0gVUkuY29tcG9uZW50cy5odG1sZWRpdG9yLnRlbXBsYXRlO1xuXG4gICAgICAgICAgICB0aGlzLkNvZGVNaXJyb3IgPSB0aGlzLm9wdGlvbnMuQ29kZU1pcnJvciB8fCBDb2RlTWlycm9yO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zICAgID0ge307XG5cbiAgICAgICAgICAgIHRwbCA9IHRwbC5yZXBsYWNlKC9cXHs6bGJsUHJldmlld30vZywgdGhpcy5vcHRpb25zLmxibFByZXZpZXcpO1xuICAgICAgICAgICAgdHBsID0gdHBsLnJlcGxhY2UoL1xcezpsYmxDb2Rldmlld30vZywgdGhpcy5vcHRpb25zLmxibENvZGV2aWV3KTtcblxuICAgICAgICAgICAgdGhpcy5odG1sZWRpdG9yID0gVUkuJCh0cGwpO1xuICAgICAgICAgICAgdGhpcy5jb250ZW50ICAgID0gdGhpcy5odG1sZWRpdG9yLmZpbmQoJy51ay1odG1sZWRpdG9yLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIHRoaXMudG9vbGJhciAgICA9IHRoaXMuaHRtbGVkaXRvci5maW5kKCcudWstaHRtbGVkaXRvci10b29sYmFyJyk7XG4gICAgICAgICAgICB0aGlzLnByZXZpZXcgICAgPSB0aGlzLmh0bWxlZGl0b3IuZmluZCgnLnVrLWh0bWxlZGl0b3ItcHJldmlldycpLmNoaWxkcmVuKCkuZXEoMCk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgICAgICAgPSB0aGlzLmh0bWxlZGl0b3IuZmluZCgnLnVrLWh0bWxlZGl0b3ItY29kZScpO1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYmVmb3JlKHRoaXMuaHRtbGVkaXRvcikuYXBwZW5kVG8odGhpcy5jb2RlKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yID0gdGhpcy5Db2RlTWlycm9yLmZyb21UZXh0QXJlYSh0aGlzLmVsZW1lbnRbMF0sIHRoaXMub3B0aW9ucy5jb2RlbWlycm9yKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLmh0bWxlZGl0b3IgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3Iub24oJ2NoYW5nZScsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCkgeyAkdGhpcy5yZW5kZXIoKTsgfSwgMTUwKSk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZWRpdG9yLnNhdmUoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY29kZS5maW5kKCcuQ29kZU1pcnJvcicpLmNzcygnaGVpZ2h0JywgdGhpcy5vcHRpb25zLmhlaWdodCk7XG5cbiAgICAgICAgICAgIC8vIGlmcmFtZSBtb2RlP1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZnJhbWUpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lID0gVUkuJCgnPGlmcmFtZSBjbGFzcz1cInVrLWh0bWxlZGl0b3ItaWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgc2Nyb2xsaW5nPVwiYXV0b1wiIGhlaWdodD1cIjEwMFwiIHdpZHRoPVwiMTAwJVwiPjwvaWZyYW1lPicpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldmlldy5hcHBlbmQodGhpcy5pZnJhbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gbXVzdCBvcGVuIGFuZCBjbG9zZSBkb2N1bWVudCBvYmplY3QgdG8gc3RhcnQgdXNpbmcgaXQhXG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWVbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWVbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3LmNvbnRhaW5lciA9IFVJLiQodGhpcy5pZnJhbWVbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudCkuZmluZCgnYm9keScpO1xuXG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kIGN1c3RvbSBzdHlsZXNoZWV0XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZih0aGlzLm9wdGlvbnMuaWZyYW1lKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3LmNvbnRhaW5lci5wYXJlbnQoKS5hcHBlbmQoJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJyt0aGlzLm9wdGlvbnMuaWZyYW1lKydcIj4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3LmNvbnRhaW5lciA9IHRoaXMucHJldmlldztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVUkuJHdpbi5vbigncmVzaXplIGxvYWQnLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpIHsgJHRoaXMuZml0KCk7IH0sIDIwMCkpO1xuXG4gICAgICAgICAgICB2YXIgcHJldmlld0NvbnRhaW5lciA9IHRoaXMuaWZyYW1lID8gdGhpcy5wcmV2aWV3LmNvbnRhaW5lcjokdGhpcy5wcmV2aWV3LnBhcmVudCgpLFxuICAgICAgICAgICAgICAgIGNvZGVDb250ZW50ICAgICAgPSB0aGlzLmNvZGUuZmluZCgnLkNvZGVNaXJyb3Itc2l6ZXInKSxcbiAgICAgICAgICAgICAgICBjb2RlU2Nyb2xsICAgICAgID0gdGhpcy5jb2RlLmZpbmQoJy5Db2RlTWlycm9yLXNjcm9sbCcpLm9uKCdzY3JvbGwnLCBVSS5VdGlscy5kZWJvdW5jZShmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuaHRtbGVkaXRvci5hdHRyKCdkYXRhLW1vZGUnKSA9PSAndGFiJykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGMgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVIZWlnaHQgICAgICA9IGNvZGVDb250ZW50LmhlaWdodCgpIC0gY29kZVNjcm9sbC5oZWlnaHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpZXdIZWlnaHQgICA9IHByZXZpZXdDb250YWluZXJbMF0uc2Nyb2xsSGVpZ2h0IC0gKCR0aGlzLmlmcmFtZSA/ICR0aGlzLmlmcmFtZS5oZWlnaHQoKSA6IHByZXZpZXdDb250YWluZXIuaGVpZ2h0KCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW8gICAgICAgICAgID0gcHJldmlld0hlaWdodCAvIGNvZGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3UG9zaXRpb24gPSBjb2RlU2Nyb2xsLnNjcm9sbFRvcCgpICogcmF0aW87XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXBwbHkgbmV3IHNjcm9sbFxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3Q29udGFpbmVyLnNjcm9sbFRvcChwcmV2aWV3UG9zaXRpb24pO1xuXG4gICAgICAgICAgICAgICAgfSwgMTApKTtcblxuICAgICAgICAgICAgdGhpcy5odG1sZWRpdG9yLm9uKCdjbGljaycsICcudWstaHRtbGVkaXRvci1idXR0b24tY29kZSwgLnVrLWh0bWxlZGl0b3ItYnV0dG9uLXByZXZpZXcnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuaHRtbGVkaXRvci5hdHRyKCdkYXRhLW1vZGUnKSA9PSAndGFiJykge1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmh0bWxlZGl0b3IuZmluZCgnLnVrLWh0bWxlZGl0b3ItYnV0dG9uLWNvZGUsIC51ay1odG1sZWRpdG9yLWJ1dHRvbi1wcmV2aWV3JykucmVtb3ZlQ2xhc3MoJ3VrLWFjdGl2ZScpLmZpbHRlcih0aGlzKS5hZGRDbGFzcygndWstYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWN0aXZldGFiID0gVUkuJCh0aGlzKS5oYXNDbGFzcygndWstaHRtbGVkaXRvci1idXR0b24tY29kZScpID8gJ2NvZGUnIDogJ3ByZXZpZXcnO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5odG1sZWRpdG9yLmF0dHIoJ2RhdGEtYWN0aXZlLXRhYicsICR0aGlzLmFjdGl2ZXRhYik7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHRvb2xiYXIgYWN0aW9uc1xuICAgICAgICAgICAgdGhpcy5odG1sZWRpdG9yLm9uKCdjbGljaycsICdhW2RhdGEtaHRtbGVkaXRvci1idXR0b25dJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmNvZGUuaXMoJzp2aXNpYmxlJykpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2FjdGlvbi4nICsgVUkuJCh0aGlzKS5kYXRhKCdodG1sZWRpdG9yLWJ1dHRvbicpLCBbJHRoaXMuZWRpdG9yXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3LnBhcmVudCgpLmNzcygnaGVpZ2h0JywgdGhpcy5jb2RlLmhlaWdodCgpKTtcblxuICAgICAgICAgICAgLy8gYXV0b2NvbXBsZXRlXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9jb21wbGV0ZSAmJiB0aGlzLkNvZGVNaXJyb3Iuc2hvd0hpbnQgJiYgdGhpcy5Db2RlTWlycm9yLmhpbnQgJiYgdGhpcy5Db2RlTWlycm9yLmhpbnQuaHRtbCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3Iub24oJ2lucHV0UmVhZCcsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZG9jID0gJHRoaXMuZWRpdG9yLmdldERvYygpLCBQT1MgPSBkb2MuZ2V0Q3Vyc29yKCksIG1vZGUgPSAkdGhpcy5Db2RlTWlycm9yLmlubmVyTW9kZSgkdGhpcy5lZGl0b3IuZ2V0TW9kZSgpLCAkdGhpcy5lZGl0b3IuZ2V0VG9rZW5BdChQT1MpLnN0YXRlKS5tb2RlLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGUgPT0gJ3htbCcpIHsgLy9odG1sIGRlcGVuZHMgb24geG1sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXIgPSAkdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yKCksIHRva2VuID0gJHRoaXMuZWRpdG9yLmdldFRva2VuQXQoY3VyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnN0cmluZy5jaGFyQXQoMCkgPT0gJzwnIHx8IHRva2VuLnR5cGUgPT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5Db2RlTWlycm9yLnNob3dIaW50KCR0aGlzLmVkaXRvciwgJHRoaXMuQ29kZU1pcnJvci5oaW50Lmh0bWwsIHsgY29tcGxldGVTaW5nbGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2VkUmVkcmF3ID0gVUkuVXRpbHMuZGVib3VuY2UoZnVuY3Rpb24gKCkgeyAkdGhpcy5yZWRyYXcoKTsgfSwgNSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2luaXQudWsuY29tcG9uZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZGVib3VuY2VkUmVkcmF3KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmF0dHIoJ2RhdGEtdWstY2hlY2stZGlzcGxheScsIDEpLm9uKCdkaXNwbGF5LnVrLmNoZWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmh0bWxlZGl0b3IuaXMoXCI6dmlzaWJsZVwiKSkgdGhpcy5maXQoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGVkaXRvcnMucHVzaCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRCdXR0b246IGZ1bmN0aW9uKG5hbWUsIGJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5idXR0b25zW25hbWVdID0gYnV0dG9uO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEJ1dHRvbnM6IGZ1bmN0aW9uKGJ1dHRvbnMpIHtcbiAgICAgICAgICAgIFVJLiQuZXh0ZW5kKHRoaXMuYnV0dG9ucywgYnV0dG9ucyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVwbGFjZUluUHJldmlldzogZnVuY3Rpb24ocmVnZXhwLCBjYWxsYmFjaykge1xuXG4gICAgICAgICAgICB2YXIgZWRpdG9yID0gdGhpcy5lZGl0b3IsIHJlc3VsdHMgPSBbXSwgdmFsdWUgPSBlZGl0b3IuZ2V0VmFsdWUoKSwgb2Zmc2V0ID0gLTEsIGluZGV4ID0gMDtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50dmFsdWUgPSB0aGlzLmN1cnJlbnR2YWx1ZS5yZXBsYWNlKHJlZ2V4cCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXQgPSB2YWx1ZS5pbmRleE9mKGFyZ3VtZW50c1swXSwgKytvZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoICA9IHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlczogYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICBmcm9tICAgOiB0cmFuc2xhdGVPZmZzZXQob2Zmc2V0KSxcbiAgICAgICAgICAgICAgICAgICAgdG8gICAgIDogdHJhbnNsYXRlT2Zmc2V0KG9mZnNldCArIGFyZ3VtZW50c1swXS5sZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZSh2YWx1ZSwgbWF0Y2guZnJvbSwgbWF0Y2gudG8pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpblJhbmdlOiBmdW5jdGlvbihjdXJzb3IpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnNvci5saW5lID09PSBtYXRjaC5mcm9tLmxpbmUgJiYgY3Vyc29yLmxpbmUgPT09IG1hdGNoLnRvLmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yLmNoID49IG1hdGNoLmZyb20uY2ggJiYgY3Vyc29yLmNoIDwgbWF0Y2gudG8uY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgKGN1cnNvci5saW5lID09PSBtYXRjaC5mcm9tLmxpbmUgJiYgY3Vyc29yLmNoICAgPj0gbWF0Y2guZnJvbS5jaCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGN1cnNvci5saW5lID4gICBtYXRjaC5mcm9tLmxpbmUgJiYgY3Vyc29yLmxpbmUgPCAgbWF0Y2gudG8ubGluZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGN1cnNvci5saW5lID09PSBtYXRjaC50by5saW5lICAgJiYgY3Vyc29yLmNoICAgPCAgbWF0Y2gudG8uY2gpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0eXBlb2YoY2FsbGJhY2spID09PSAnc3RyaW5nJyA/IGNhbGxiYWNrIDogY2FsbGJhY2sobWF0Y2gsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0ICYmIHJlc3VsdCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1hdGNoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZU9mZnNldChvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZWRpdG9yLmdldFZhbHVlKCkuc3Vic3RyaW5nKDAsIG9mZnNldCkuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGxpbmU6IHJlc3VsdC5sZW5ndGggLSAxLCBjaDogcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXS5sZW5ndGggfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfSxcblxuICAgICAgICBfYnVpbGR0b29sYmFyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKCEodGhpcy5vcHRpb25zLnRvb2xiYXIgJiYgdGhpcy5vcHRpb25zLnRvb2xiYXIubGVuZ3RoKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSB0aGlzLCBiYXIgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy50b29sYmFyLmVtcHR5KCk7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b29sYmFyLmZvckVhY2goZnVuY3Rpb24oYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkdGhpcy5idXR0b25zW2J1dHRvbl0pIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICR0aGlzLmJ1dHRvbnNbYnV0dG9uXS50aXRsZSA/ICR0aGlzLmJ1dHRvbnNbYnV0dG9uXS50aXRsZSA6IGJ1dHRvbjtcblxuICAgICAgICAgICAgICAgIGJhci5wdXNoKCc8bGk+PGEgZGF0YS1odG1sZWRpdG9yLWJ1dHRvbj1cIicrYnV0dG9uKydcIiB0aXRsZT1cIicrdGl0bGUrJ1wiIGRhdGEtdWstdG9vbHRpcD4nKyR0aGlzLmJ1dHRvbnNbYnV0dG9uXS5sYWJlbCsnPC9hPjwvbGk+Jyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50b29sYmFyLmh0bWwoYmFyLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgbW9kZSA9IHRoaXMub3B0aW9ucy5tb2RlO1xuXG4gICAgICAgICAgICBpZiAobW9kZSA9PSAnc3BsaXQnICYmIHRoaXMuaHRtbGVkaXRvci53aWR0aCgpIDwgdGhpcy5vcHRpb25zLm1heHNwbGl0c2l6ZSkge1xuICAgICAgICAgICAgICAgIG1vZGUgPSAndGFiJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vZGUgPT0gJ3RhYicpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWN0aXZldGFiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZldGFiID0gJ2NvZGUnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0bWxlZGl0b3IuYXR0cignZGF0YS1hY3RpdmUtdGFiJywgdGhpcy5hY3RpdmV0YWIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaHRtbGVkaXRvci5maW5kKCcudWstaHRtbGVkaXRvci1idXR0b24tY29kZSwgLnVrLWh0bWxlZGl0b3ItYnV0dG9uLXByZXZpZXcnKS5yZW1vdmVDbGFzcygndWstYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih0aGlzLmFjdGl2ZXRhYiA9PSAnY29kZScgPyAnLnVrLWh0bWxlZGl0b3ItYnV0dG9uLWNvZGUnIDogJy51ay1odG1sZWRpdG9yLWJ1dHRvbi1wcmV2aWV3JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd1ay1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucmVmcmVzaCgpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aWV3LnBhcmVudCgpLmNzcygnaGVpZ2h0JywgdGhpcy5jb2RlLmhlaWdodCgpKTtcblxuICAgICAgICAgICAgdGhpcy5odG1sZWRpdG9yLmF0dHIoJ2RhdGEtbW9kZScsIG1vZGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9idWlsZHRvb2xiYXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmZpdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldE1vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldE9wdGlvbignbW9kZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnNvck1vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmFtID0geyBtb2RlOiAnaHRtbCd9O1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjdXJzb3JNb2RlJywgW3BhcmFtXSk7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW0ubW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnR2YWx1ZSA9IHRoaXMuZWRpdG9yLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgIC8vIGVtcHR5IGNvZGVcbiAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50dmFsdWUpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC52YWwoJycpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldmlldy5jb250YWluZXIuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncmVuZGVyJywgW3RoaXNdKTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncmVuZGVyTGF0ZScsIFt0aGlzXSk7XG5cbiAgICAgICAgICAgIHRoaXMucHJldmlldy5jb250YWluZXIuaHRtbCh0aGlzLmN1cnJlbnR2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkU2hvcnRjdXQ6IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgbWFwID0ge307XG4gICAgICAgICAgICBpZiAoIVVJLiQuaXNBcnJheShuYW1lKSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBbbmFtZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hbWUuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICBtYXBba2V5XSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLmFkZEtleU1hcChtYXApO1xuXG4gICAgICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZFNob3J0Y3V0QWN0aW9uOiBmdW5jdGlvbihhY3Rpb24sIHNob3J0Y3V0cykge1xuICAgICAgICAgICAgdmFyIGVkaXRvciA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmFkZFNob3J0Y3V0KHNob3J0Y3V0cywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmVsZW1lbnQudHJpZ2dlcignYWN0aW9uLicgKyBhY3Rpb24sIFtlZGl0b3IuZWRpdG9yXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXBsYWNlU2VsZWN0aW9uOiBmdW5jdGlvbihyZXBsYWNlKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5lZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIGlmICghdGV4dC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjdXIgICAgID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yKCksXG4gICAgICAgICAgICAgICAgICAgIGN1ckxpbmUgPSB0aGlzLmVkaXRvci5nZXRMaW5lKGN1ci5saW5lKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgICA9IGN1ci5jaCxcbiAgICAgICAgICAgICAgICAgICAgZW5kICAgICA9IHN0YXJ0O1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGVuZCA8IGN1ckxpbmUubGVuZ3RoICYmIC9bXFx3JF0rLy50ZXN0KGN1ckxpbmUuY2hhckF0KGVuZCkpKSArK2VuZDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3RhcnQgJiYgL1tcXHckXSsvLnRlc3QoY3VyTGluZS5jaGFyQXQoc3RhcnQgLSAxKSkpIC0tc3RhcnQ7XG5cbiAgICAgICAgICAgICAgICB2YXIgY3VyV29yZCA9IHN0YXJ0ICE9IGVuZCAmJiBjdXJMaW5lLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cldvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0b3Iuc2V0U2VsZWN0aW9uKHsgbGluZTogY3VyLmxpbmUsIGNoOiBzdGFydH0sIHsgbGluZTogY3VyLmxpbmUsIGNoOiBlbmQgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBjdXJXb3JkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGh0bWwgPSByZXBsYWNlLnJlcGxhY2UoJyQxJywgdGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oaHRtbCwgJ2VuZCcpO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXBsYWNlTGluZTogZnVuY3Rpb24ocmVwbGFjZSkge1xuICAgICAgICAgICAgdmFyIHBvcyAgPSB0aGlzLmVkaXRvci5nZXREb2MoKS5nZXRDdXJzb3IoKSxcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGhpcy5lZGl0b3IuZ2V0TGluZShwb3MubGluZSksXG4gICAgICAgICAgICAgICAgaHRtbCA9IHJlcGxhY2UucmVwbGFjZSgnJDEnLCB0ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucmVwbGFjZVJhbmdlKGh0bWwgLCB7IGxpbmU6IHBvcy5saW5lLCBjaDogMCB9LCB7IGxpbmU6IHBvcy5saW5lLCBjaDogdGV4dC5sZW5ndGggfSk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3IoeyBsaW5lOiBwb3MubGluZSwgY2g6IGh0bWwubGVuZ3RoIH0pO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBVSS5jb21wb25lbnRzLmh0bWxlZGl0b3IudGVtcGxhdGUgPSBbXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidWstaHRtbGVkaXRvciB1ay1jbGVhcmZpeFwiIGRhdGEtbW9kZT1cInNwbGl0XCI+JyxcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstaHRtbGVkaXRvci1uYXZiYXJcIj4nLFxuICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJ1ay1odG1sZWRpdG9yLW5hdmJhci1uYXYgdWstaHRtbGVkaXRvci10b29sYmFyXCI+PC91bD4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstaHRtbGVkaXRvci1uYXZiYXItZmxpcFwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJ1ay1odG1sZWRpdG9yLW5hdmJhci1uYXZcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxsaSBjbGFzcz1cInVrLWh0bWxlZGl0b3ItYnV0dG9uLWNvZGVcIj48YT57OmxibENvZGV2aWV3fTwvYT48L2xpPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwidWstaHRtbGVkaXRvci1idXR0b24tcHJldmlld1wiPjxhPns6bGJsUHJldmlld308L2E+PC9saT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxsaT48YSBkYXRhLWh0bWxlZGl0b3ItYnV0dG9uPVwiZnVsbHNjcmVlblwiPjxpIGNsYXNzPVwidWstaWNvbi1leHBhbmRcIj48L2k+PC9hPjwvbGk+JyxcbiAgICAgICAgICAgICAgICAgICAgJzwvdWw+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1odG1sZWRpdG9yLWNvbnRlbnRcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidWstaHRtbGVkaXRvci1jb2RlXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInVrLWh0bWxlZGl0b3ItcHJldmlld1wiPjxkaXY+PC9kaXY+PC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAnPC9kaXY+J1xuICAgIF0uam9pbignJyk7XG5cblxuICAgIFVJLnBsdWdpbignaHRtbGVkaXRvcicsICdiYXNlJywge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGVkaXRvcikge1xuXG4gICAgICAgICAgICBlZGl0b3IuYWRkQnV0dG9ucyh7XG5cbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlICA6ICdGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgIDogJzxpIGNsYXNzPVwidWstaWNvbi1leHBhbmRcIj48L2k+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9sZCA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgIDogJ0JvbGQnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbCAgOiAnPGkgY2xhc3M9XCJ1ay1pY29uLWJvbGRcIj48L2k+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaXRhbGljIDoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSAgOiAnSXRhbGljJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgIDogJzxpIGNsYXNzPVwidWstaWNvbi1pdGFsaWNcIj48L2k+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaWtlIDoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSAgOiAnU3RyaWtldGhyb3VnaCcsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsICA6ICc8aSBjbGFzcz1cInVrLWljb24tc3RyaWtldGhyb3VnaFwiPjwvaT4nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBibG9ja3F1b3RlIDoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSAgOiAnQmxvY2txdW90ZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsICA6ICc8aSBjbGFzcz1cInVrLWljb24tcXVvdGUtcmlnaHRcIj48L2k+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGluayA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgIDogJ0xpbmsnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbCAgOiAnPGkgY2xhc3M9XCJ1ay1pY29uLWxpbmtcIj48L2k+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW1hZ2UgOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlICA6ICdJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsICA6ICc8aSBjbGFzcz1cInVrLWljb24tcGljdHVyZS1vXCI+PC9pPidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxpc3RVbCA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgIDogJ1Vub3JkZXJlZCBMaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgIDogJzxpIGNsYXNzPVwidWstaWNvbi1saXN0LXVsXCI+PC9pPidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxpc3RPbCA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgIDogJ09yZGVyZWQgTGlzdCcsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsICA6ICc8aSBjbGFzcz1cInVrLWljb24tbGlzdC1vbFwiPjwvaT4nXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWRkQWN0aW9uKCdib2xkJywgJzxzdHJvbmc+JDE8L3N0cm9uZz4nKTtcbiAgICAgICAgICAgIGFkZEFjdGlvbignaXRhbGljJywgJzxlbT4kMTwvZW0+Jyk7XG4gICAgICAgICAgICBhZGRBY3Rpb24oJ3N0cmlrZScsICc8ZGVsPiQxPC9kZWw+Jyk7XG4gICAgICAgICAgICBhZGRBY3Rpb24oJ2Jsb2NrcXVvdGUnLCAnPGJsb2NrcXVvdGU+PHA+JDE8L3A+PC9ibG9ja3F1b3RlPicsICdyZXBsYWNlTGluZScpO1xuICAgICAgICAgICAgYWRkQWN0aW9uKCdsaW5rJywgJzxhIGhyZWY9XCJodHRwOi8vXCI+JDE8L2E+Jyk7XG4gICAgICAgICAgICBhZGRBY3Rpb24oJ2ltYWdlJywgJzxpbWcgc3JjPVwiaHR0cDovL1wiIGFsdD1cIiQxXCI+Jyk7XG5cbiAgICAgICAgICAgIHZhciBsaXN0Zm4gPSBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldEN1cnNvck1vZGUoKSA9PSAnaHRtbCcpIHtcblxuICAgICAgICAgICAgICAgICAgICB0YWcgPSB0YWcgfHwgJ3VsJztcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY20gICAgICAgID0gZWRpdG9yLmVkaXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYyAgICAgICA9IGNtLmdldERvYygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zICAgICAgID0gZG9jLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2VuZCAgICA9IGRvYy5nZXRDdXJzb3IoZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW0gICAgICAgID0gQ29kZU1pcnJvci5pbm5lck1vZGUoY20uZ2V0TW9kZSgpLCBjbS5nZXRUb2tlbkF0KGNtLmdldEN1cnNvcigpKS5zdGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbkxpc3QgICAgPSBpbSAmJiBpbS5zdGF0ZSAmJiBpbS5zdGF0ZS5jb250ZXh0ICYmIFsndWwnLCdvbCddLmluZGV4T2YoaW0uc3RhdGUuY29udGV4dC50YWdOYW1lKSAhPSAtMTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPXBvcy5saW5lOyBpPChwb3NlbmQubGluZSsxKTtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnPGxpPicrY20uZ2V0TGluZShpKSsnPC9saT4nLCB7IGxpbmU6IGksIGNoOiAwIH0sIHsgbGluZTogaSwgY2g6IGNtLmdldExpbmUoaSkubGVuZ3RoIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbkxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnPCcrdGFnKyc+JytcIlxcblwiK2NtLmdldExpbmUocG9zLmxpbmUpLCB7IGxpbmU6IHBvcy5saW5lLCBjaDogMCB9LCB7IGxpbmU6IHBvcy5saW5lLCBjaDogY20uZ2V0TGluZShwb3MubGluZSkubGVuZ3RoIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNtLmdldExpbmUoKHBvc2VuZC5saW5lKzEpKStcIlxcblwiKyc8LycrdGFnKyc+JywgeyBsaW5lOiAocG9zZW5kLmxpbmUrMSksIGNoOiAwIH0sIHsgbGluZTogKHBvc2VuZC5saW5lKzEpLCBjaDogY20uZ2V0TGluZSgocG9zZW5kLmxpbmUrMSkpLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtLnNldEN1cnNvcih7IGxpbmU6IHBvc2VuZC5saW5lKzEsIGNoOiBjbS5nZXRMaW5lKHBvc2VuZC5saW5lKzEpLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtLnNldEN1cnNvcih7IGxpbmU6IHBvc2VuZC5saW5lLCBjaDogY20uZ2V0TGluZShwb3NlbmQubGluZSkubGVuZ3RoIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY20uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlZGl0b3Iub24oJ2FjdGlvbi5saXN0VWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsaXN0Zm4oJ3VsJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdG9yLm9uKCdhY3Rpb24ubGlzdE9sJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdGZuKCdvbCcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRvci5odG1sZWRpdG9yLm9uKCdjbGljaycsICdhW2RhdGEtaHRtbGVkaXRvci1idXR0b249XCJmdWxsc2NyZWVuXCJdJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmh0bWxlZGl0b3IudG9nZ2xlQ2xhc3MoJ3VrLWh0bWxlZGl0b3ItZnVsbHNjcmVlbicpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHdyYXAgPSBlZGl0b3IuZWRpdG9yLmdldFdyYXBwZXJFbGVtZW50KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmh0bWxlZGl0b3IuaGFzQ2xhc3MoJ3VrLWh0bWxlZGl0b3ItZnVsbHNjcmVlbicpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmVkaXRvci5zdGF0ZS5mdWxsU2NyZWVuUmVzdG9yZSA9IHtzY3JvbGxUb3A6IHdpbmRvdy5wYWdlWU9mZnNldCwgc2Nyb2xsTGVmdDogd2luZG93LnBhZ2VYT2Zmc2V0LCB3aWR0aDogd3JhcC5zdHlsZS53aWR0aCwgaGVpZ2h0OiB3cmFwLnN0eWxlLmhlaWdodH07XG4gICAgICAgICAgICAgICAgICAgIHdyYXAuc3R5bGUud2lkdGggID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHdyYXAuc3R5bGUuaGVpZ2h0ID0gZWRpdG9yLmNvbnRlbnQuaGVpZ2h0KCkrJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IGVkaXRvci5lZGl0b3Iuc3RhdGUuZnVsbFNjcmVlblJlc3RvcmU7XG4gICAgICAgICAgICAgICAgICAgIHdyYXAuc3R5bGUud2lkdGggPSBpbmZvLndpZHRoOyB3cmFwLnN0eWxlLmhlaWdodCA9IGluZm8uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaW5mby5zY3JvbGxMZWZ0LCBpbmZvLnNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmZpdCgpO1xuICAgICAgICAgICAgICAgICAgICBVSS4kd2luLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0b3IuYWRkU2hvcnRjdXQoWydDdHJsLVMnLCAnQ21kLVMnXSwgZnVuY3Rpb24oKSB7IGVkaXRvci5lbGVtZW50LnRyaWdnZXIoJ2h0bWxlZGl0b3Itc2F2ZScsIFtlZGl0b3JdKTsgfSk7XG4gICAgICAgICAgICBlZGl0b3IuYWRkU2hvcnRjdXRBY3Rpb24oJ2JvbGQnLCBbJ0N0cmwtQicsICdDbWQtQiddKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkQWN0aW9uKG5hbWUsIHJlcGxhY2UsIG1vZGUpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3Iub24oJ2FjdGlvbi4nK25hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldEN1cnNvck1vZGUoKSA9PSAnaHRtbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvclttb2RlID09ICdyZXBsYWNlTGluZScgPyAncmVwbGFjZUxpbmUnIDogJ3JlcGxhY2VTZWxlY3Rpb24nXShyZXBsYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBVSS5wbHVnaW4oJ2h0bWxlZGl0b3InLCAnbWFya2Rvd24nLCB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oZWRpdG9yKSB7XG5cbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBlZGl0b3Iub3B0aW9ucy5tZHBhcnNlciB8fCB3aW5kb3cubWFya2VkIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmICghcGFyc2VyKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChlZGl0b3Iub3B0aW9ucy5tYXJrZG93bikge1xuICAgICAgICAgICAgICAgIGVuYWJsZU1hcmtkb3duKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZEFjdGlvbignYm9sZCcsICcqKiQxKionKTtcbiAgICAgICAgICAgIGFkZEFjdGlvbignaXRhbGljJywgJyokMSonKTtcbiAgICAgICAgICAgIGFkZEFjdGlvbignc3RyaWtlJywgJ35+JDF+ficpO1xuICAgICAgICAgICAgYWRkQWN0aW9uKCdibG9ja3F1b3RlJywgJz4gJDEnLCAncmVwbGFjZUxpbmUnKTtcbiAgICAgICAgICAgIGFkZEFjdGlvbignbGluaycsICdbJDFdKGh0dHA6Ly8pJyk7XG4gICAgICAgICAgICBhZGRBY3Rpb24oJ2ltYWdlJywgJyFbJDFdKGh0dHA6Ly8pJyk7XG5cbiAgICAgICAgICAgIGVkaXRvci5vbignYWN0aW9uLmxpc3RVbCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvci5nZXRDdXJzb3JNb2RlKCkgPT0gJ21hcmtkb3duJykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbSAgICAgID0gZWRpdG9yLmVkaXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyAgICAgPSBjbS5nZXREb2MoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NlbmQgID0gY20uZ2V0RG9jKCkuZ2V0Q3Vyc29yKGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPXBvcy5saW5lOyBpPChwb3NlbmQubGluZSsxKTtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnKiAnK2NtLmdldExpbmUoaSksIHsgbGluZTogaSwgY2g6IDAgfSwgeyBsaW5lOiBpLCBjaDogY20uZ2V0TGluZShpKS5sZW5ndGggfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjbS5zZXRDdXJzb3IoeyBsaW5lOiBwb3NlbmQubGluZSwgY2g6IGNtLmdldExpbmUocG9zZW5kLmxpbmUpLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgY20uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdG9yLm9uKCdhY3Rpb24ubGlzdE9sJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldEN1cnNvck1vZGUoKSA9PSAnbWFya2Rvd24nKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNtICAgICAgPSBlZGl0b3IuZWRpdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zICAgICA9IGNtLmdldERvYygpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2VuZCAgPSBjbS5nZXREb2MoKS5nZXRDdXJzb3IoZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ICA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcy5saW5lID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZsaW5lID0gY20uZ2V0TGluZShwb3MubGluZS0xKSwgbWF0Y2hlcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobWF0Y2hlcyA9IHByZXZsaW5lLm1hdGNoKC9eKFxcZCspXFwuLykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSBOdW1iZXIobWF0Y2hlc1sxXSkrMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9cG9zLmxpbmU7IGk8KHBvc2VuZC5saW5lKzEpO2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHByZWZpeCsnLiAnK2NtLmdldExpbmUoaSksIHsgbGluZTogaSwgY2g6IDAgfSwgeyBsaW5lOiBpLCBjaDogY20uZ2V0TGluZShpKS5sZW5ndGggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXgrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNtLnNldEN1cnNvcih7IGxpbmU6IHBvc2VuZC5saW5lLCBjaDogY20uZ2V0TGluZShwb3NlbmQubGluZSkubGVuZ3RoIH0pO1xuICAgICAgICAgICAgICAgICAgICBjbS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0b3Iub24oJ3JlbmRlckxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmVkaXRvci5vcHRpb25zLm1vZGUgPT0gJ2dmbScpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmN1cnJlbnR2YWx1ZSA9IHBhcnNlcihlZGl0b3IuY3VycmVudHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdG9yLm9uKCdjdXJzb3JNb2RlJywgZnVuY3Rpb24oZSwgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmVkaXRvci5vcHRpb25zLm1vZGUgPT0gJ2dmbScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGVkaXRvci5lZGl0b3IuZ2V0RG9jKCkuZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yLmVkaXRvci5nZXRUb2tlbkF0KHBvcykuc3RhdGUuYmFzZS5odG1sU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLm1vZGUgPSAnbWFya2Rvd24nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFVJLiQuZXh0ZW5kKGVkaXRvciwge1xuXG4gICAgICAgICAgICAgICAgZW5hYmxlTWFya2Rvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVNYXJrZG93bigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzYWJsZU1hcmtkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0b3Iuc2V0T3B0aW9uKCdtb2RlJywgJ2h0bWxtaXhlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0bWxlZGl0b3IuZmluZCgnLnVrLWh0bWxlZGl0b3ItYnV0dG9uLWNvZGUgYScpLmh0bWwodGhpcy5vcHRpb25zLmxibENvZGV2aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzd2l0Y2ggbWFya2Rvd24gbW9kZSBvbiBldmVudFxuICAgICAgICAgICAgZWRpdG9yLm9uKHtcbiAgICAgICAgICAgICAgICBlbmFibGVNYXJrZG93biAgOiBmdW5jdGlvbigpIHsgZWRpdG9yLmVuYWJsZU1hcmtkb3duKCk7IH0sXG4gICAgICAgICAgICAgICAgZGlzYWJsZU1hcmtkb3duIDogZnVuY3Rpb24oKSB7IGVkaXRvci5kaXNhYmxlTWFya2Rvd24oKTsgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGVuYWJsZU1hcmtkb3duKCkge1xuICAgICAgICAgICAgICAgIGVkaXRvci5lZGl0b3Iuc2V0T3B0aW9uKCdtb2RlJywgJ2dmbScpO1xuICAgICAgICAgICAgICAgIGVkaXRvci5odG1sZWRpdG9yLmZpbmQoJy51ay1odG1sZWRpdG9yLWJ1dHRvbi1jb2RlIGEnKS5odG1sKGVkaXRvci5vcHRpb25zLmxibE1hcmtlZHZpZXcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRBY3Rpb24obmFtZSwgcmVwbGFjZSwgbW9kZSkge1xuICAgICAgICAgICAgICAgIGVkaXRvci5vbignYWN0aW9uLicrbmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0b3IuZ2V0Q3Vyc29yTW9kZSgpID09ICdtYXJrZG93bicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvclttb2RlID09ICdyZXBsYWNlTGluZScgPyAncmVwbGFjZUxpbmUnIDogJ3JlcGxhY2VTZWxlY3Rpb24nXShyZXBsYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gVUkuaHRtbGVkaXRvcjtcbn0pO1xuIl19