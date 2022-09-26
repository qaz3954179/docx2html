'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _converter = require('./converter');

var _converter2 = _interopRequireDefault(_converter);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDocument, CSSStyleDeclaration;

var Document = function (_Converter) {
	(0, _inherits3.default)(Document, _Converter);

	function Document() {
		(0, _classCallCheck3.default)(this, Document);
		return (0, _possibleConstructorReturn3.default)(this, (Document.__proto__ || (0, _getPrototypeOf2.default)(Document)).apply(this, arguments));
	}

	(0, _createClass3.default)(Document, [{
		key: 'convert',
		value: function convert() {
			this.doc = this.constructor.create(this.options);
			this.content = this.doc;
			var contentStyle = this.content.style;
			contentStyle.backgroundColor = 'transparent';
			contentStyle.minHeight = '1000px';
			contentStyle.width = '100%';
			contentStyle.paddingTop = '20px';
			contentStyle.overflow = 'auto';

			var style = this.doc.createStyle('*');
			style.margin = '0';
			style.border = '0';
			style.padding = '0';
			style.boxSizing = 'border-box';

			style = this.doc.createStyle('table');
			style.width = '100%';
			style.borderCollapse = 'collapse';
			style.wordBreak = 'break-word';

			style = this.doc.createStyle('section');
			style.margin = 'auto';
			style.backgroundColor = 'white';
			style.color = 'black';
			style.position = 'relative';
			style.zIndex = 0;

			style = this.doc.createStyle('p:empty:before');
			style.content = '""';
			style.display = 'inline-block';

			style = this.doc.createStyle('ul');
			style.listStyle = "none";

			style = this.doc.createStyle('ul>li>p');
			style.position = 'relative';

			style = this.doc.createStyle('ul .marker');
			style.position = 'absolute';

			style = this.doc.createStyle('a');
			style.textDecoration = 'none';

			style = this.doc.createStyle('.unsupported');
			style.outline = "2px red solid";

			style = this.doc.createStyle('.warning');
			style.outline = "1px yellow solid";
			this.convertStyle();
		}
	}, {
		key: 'convertStyle',
		value: function convertStyle() {
			var bgStyle = this.wordModel.getBackgroundStyle();
			if (!bgStyle) return;

			var style = this.doc.createStyle('section');
			switch (typeof bgStyle === 'undefined' ? 'undefined' : (0, _typeof3.default)(bgStyle)) {
				case 'object':
					// fill
					console.warn('not support fill color on document background yet');
					break;
				default:
					style.backgroundColor = bgStyle;
					break;
			}
		}
		/**
  * opt: {
  * 	template: function(style, html, props){ return (html)},
  	extendScript: "http://a.com/a.js"
  	}
  */

	}, {
		key: 'toString',
		value: function toString(opt) {
			return this.doc.toString(opt, this.props);
		}
	}, {
		key: 'release',
		value: function release() {
			this.doc.release();
		}
	}, {
		key: 'asZip',
		value: function asZip(opt) {
			return this.doc.asZip(opt, this.props);
		}
	}, {
		key: 'download',
		value: function download(opt) {
			return this.doc.download(opt, this.props);
		}
		/**
  * opt=extend(toString.opt,{
  	saveImage: function(arrayBuffer, doc.props): promise(url) {},
  	saveHtml: function(){}
  })
  */

	}, {
		key: 'save',
		value: function save(opt) {
			return this.doc.save(opt, this.props);
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'html';
		}
	}], [{
		key: 'create',
		value: function create(opt) {
			var selfConverter = this;
			return function (document) {
				var doc = function browserDoc() {
					var _uid = 0;
					var root = (0, _assign2.default)(document.createElement('div'), {
						id: "A",
						section: null,
						createElement: document.createElement.bind(document),
						createTextNode: document.createTextNode.bind(document),
						createStyleSheet: function createStyleSheet() {
							if (this.stylesheet) return this.stylesheet;
							var elStyle = this.createElement('style');
							this.body.appendChild(elStyle, null);
							return this.stylesheet = elStyle.sheet;
						},
						getStyleText: function getStyleText() {
							var styles = [];
							for (var i = 0, rules = this.stylesheet.cssRules, len = rules.length; i < len; i++) {
								styles.push(rules[i].cssText);
							}return styles.join('\r\n');
						},
						uid: function uid() {
							return this.id + _uid++;
						},
						toString: function toString(opt) {
							var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selfConverter.props;

							if (opt && typeof opt.template != "undefined" && $.isFunction(opt.template)) return opt.template(this.getStyleText(), this._html(), props);
							var html = ['<!doctype html>\r\n<html><head><meta charset=utf-8><meta key="generator" value="docx2html"><title>' + (props.name || '') + '</title><style>'];
							html.push(this.getStyleText());
							html.push('</style></head><body>');
							html.push(this._html());
							opt && opt.extendScript && html.push('<script src="' + opt.extendScript + '"></script>');
							html.push('</body><html>');
							return html.join('\r\n');
						},
						_html: function _html() {
							var divs = this.querySelectorAll('p>div, span>div');
							if (divs.length == 0) return this.outerHTML;

							/**
       * illegal <p> <div/> </p>
       * DOM operation directly in onload
       */
							var divcontainer = doc.createElement('div'),
							    uid = 0;
							divcontainer.id = 'divcontainer';
							divcontainer.style.display = "none";
							this.appendChild(divcontainer);
							for (var i = divs.length - 1; i > -1; i--) {
								var div = divs[i],
								    parent = div.parentNode;

								if (!div.id) div.id = '_z' + ++uid;

								if (!parent.id) parent.id = '_y' + uid;

								div.setAttribute('data-parent', parent.id);
								div.setAttribute('data-index', indexOf(div, parent.childNodes));

								divcontainer.appendChild(divs[i]);
							}

							var html = this.outerHTML + '\n\r<script>(' + this._transformer.toString() + ')();</script>';
							this._transformer();
							return html;
						},
						_transformer: function _transformer() {
							var a = document.querySelector('#divcontainer');
							for (var divs = a.childNodes, i = divs.length - 1; i > -1; i--) {
								var div = divs[i],
								    parentId = div.getAttribute('data-parent'),
								    index = parseInt(div.getAttribute('data-index')),
								    parent = document.querySelector('#' + parentId);
								parent.insertBefore(div, parent.childNodes[index]);
							}
							a.parentNode.removeChild(a);
						}
					});

					function indexOf(el, els) {
						for (var i = els.length - 1; i > 0; i--) {
							if (el == els[i]) return i;
						}return 0;
					}

					(opt && opt.container || document.body).appendChild(root);
					root.body = root;
					return root;
				}();

				return function mixin(doc) {
					var stylesheet = doc.createStyleSheet();
					var relStyles = {},
					    styles = {};

					return (0, _assign2.default)(selfConverter[$.isNode ? 'nodefy' : 'browserify'](doc, stylesheet, opt), {
						createStyle: function createStyle(selector) {
							if (styles[selector]) return styles[selector];
							var rules = stylesheet.cssRules,
							    len = rules.length;
							try {
								stylesheet.insertRule(selector.split(',').map(function (a) {
									return a.trim()[0] == '#' ? a : '#' + this.id + ' ' + a;
								}.bind(this)).join(',') + '{}', len);
							} catch (e) {
								stylesheet.insertRule(selector.split(',').map(function (a) {
									return a.trim()[0] == '#' ? a : '#' + this.id + ' ' + '.ab' + a.slice(1);
								}.bind(this)).join(',') + '{}', len);
								console.log(selector + '解析失败');
							}
							return styles[selector] = stylesheet.cssRules[len].style;
						},
						stylePath: function stylePath(a, parent) {
							if (parent) return relStyles[a] = parent;
							var paths = [a],
							    parent = a;
							while (parent = relStyles[parent]) {
								paths.unshift(parent);
							}return paths.join(' ');
						},
						release: function release() {
							delete this.section;
							this._release();
						}
					});
				}(doc);
			}($.isNode ? createDocument() : document);
		}
	}, {
		key: 'nodefy',
		value: function nodefy(doc, stylesheet, opt) {
			return (0, _assign2.default)(doc, {
				_release: function _release() {},
				asImageURL: function asImageURL(buffer) {
					if (opt && typeof opt.asImageURL != 'undefined') return opt.asImageURL(buffer);
					return "image://notsupport";
				},
				asZip: function asZip() {
					throw new Error('not support');
				},
				download: function download() {
					throw new Error('not support');
				},
				save: function save() {
					throw new Error('not support');
				}
			});
		}
	}, {
		key: 'browserify',
		value: function browserify(doc, stylesheet, opt) {
			var Proto_Blob = function (a) {
				a = URL.createObjectURL(new Blob()).split('/');
				a.pop();
				return a.join('/');
			}(),
			    Reg_Proto_Blob = new RegExp(Proto_Blob + "/([\\w\\d-]+)", "gi");

			return (0, _assign2.default)(doc, {
				asZip: function asZip(opt, props) {
					var zip = new _jszip2.default(),
					    hasImage = false;
					var f = zip.folder('images');
					(0, _keys2.default)(this.images).forEach(function (a) {
						hasImage = true;
						f.file(a.split('/').pop(), this[a]);
					}, this.images);
					zip.file('props.json', (0, _stringify2.default)(props));
					zip.file('main.html', hasImage ? this.toString(opt).replace(Proto_Blob, 'images') : this.toString());
					return zip;
				},
				download: function download(opt, props) {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.href = URL.createObjectURL(this.asZip(opt, props).generate({ type: 'blob' }));
					a.download = (props.name || "document") + '.zip';
					a.click();
					URL.revokeObjectURL(a.href);
					document.body.removeChild(a);
				},
				save: function save(opt, props) {
					var hasImage = false,
					    images = {},
					    me = this;
					return $.Deferred.when((this.images && (0, _keys2.default)(this.images) || []).map(function (a) {
						hasImage = true;
						return opt.saveImage(this[a], props).then(function (url) {
							return images[a] = url;
						});
					}, this.images)).then(function () {
						var html = me.toString(opt, props);
						if (hasImage) html = html.replace(Reg_Proto_Blob, function (a, id) {
							return images[a];
						});
						return opt.saveHtml(html, props);
					});
				},

				images: {},
				asImageURL: function asImageURL(arrayBuffer) {
					var url = URL.createObjectURL(new Blob([arrayBuffer], { type: "image/" + (typeof arrayBuffer == 'string' ? 'svg+xml' : '*') }));
					this.images[url] = arrayBuffer;
					return url;
				},
				_release: function _release() {
					(0, _keys2.default)(this.images).forEach(function (b) {
						URL.revokeObjectURL(b);
					});
					delete this.images;
				}
			});
		}
	}]);
	return Document;
}(_converter2.default);

exports.default = Document;


(function (isNode, m) {
	if (!isNode) return;

	createDocument = require(m).jsdom;
	var window = createDocument().defaultView;

	global.btoa = window.btoa;
	CSSStyleDeclaration = window.CSSStyleDeclaration;
})($.isNode, "jsdom");
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb2N4L2h0bWwvZG9jdW1lbnQuanMiXSwibmFtZXMiOlsiY3JlYXRlRG9jdW1lbnQiLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwiRG9jdW1lbnQiLCJkb2MiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZSIsIm9wdGlvbnMiLCJjb250ZW50IiwiY29udGVudFN0eWxlIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtaW5IZWlnaHQiLCJ3aWR0aCIsInBhZGRpbmdUb3AiLCJvdmVyZmxvdyIsImNyZWF0ZVN0eWxlIiwibWFyZ2luIiwiYm9yZGVyIiwicGFkZGluZyIsImJveFNpemluZyIsImJvcmRlckNvbGxhcHNlIiwid29yZEJyZWFrIiwiY29sb3IiLCJwb3NpdGlvbiIsInpJbmRleCIsImRpc3BsYXkiLCJsaXN0U3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsIm91dGxpbmUiLCJjb252ZXJ0U3R5bGUiLCJiZ1N0eWxlIiwid29yZE1vZGVsIiwiZ2V0QmFja2dyb3VuZFN0eWxlIiwiY29uc29sZSIsIndhcm4iLCJvcHQiLCJ0b1N0cmluZyIsInByb3BzIiwicmVsZWFzZSIsImFzWmlwIiwiZG93bmxvYWQiLCJzYXZlIiwic2VsZkNvbnZlcnRlciIsImRvY3VtZW50IiwiYnJvd3NlckRvYyIsInVpZCIsInJvb3QiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJzZWN0aW9uIiwiYmluZCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlU3R5bGVTaGVldCIsInN0eWxlc2hlZXQiLCJlbFN0eWxlIiwiYm9keSIsImFwcGVuZENoaWxkIiwic2hlZXQiLCJnZXRTdHlsZVRleHQiLCJzdHlsZXMiLCJpIiwicnVsZXMiLCJjc3NSdWxlcyIsImxlbiIsImxlbmd0aCIsInB1c2giLCJjc3NUZXh0Iiwiam9pbiIsInRlbXBsYXRlIiwiJCIsImlzRnVuY3Rpb24iLCJfaHRtbCIsImh0bWwiLCJuYW1lIiwiZXh0ZW5kU2NyaXB0IiwiZGl2cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvdXRlckhUTUwiLCJkaXZjb250YWluZXIiLCJkaXYiLCJwYXJlbnQiLCJwYXJlbnROb2RlIiwic2V0QXR0cmlidXRlIiwiaW5kZXhPZiIsImNoaWxkTm9kZXMiLCJfdHJhbnNmb3JtZXIiLCJhIiwicXVlcnlTZWxlY3RvciIsInBhcmVudElkIiwiZ2V0QXR0cmlidXRlIiwiaW5kZXgiLCJwYXJzZUludCIsImluc2VydEJlZm9yZSIsInJlbW92ZUNoaWxkIiwiZWwiLCJlbHMiLCJjb250YWluZXIiLCJtaXhpbiIsInJlbFN0eWxlcyIsImlzTm9kZSIsInNlbGVjdG9yIiwiaW5zZXJ0UnVsZSIsInNwbGl0IiwibWFwIiwidHJpbSIsImUiLCJzbGljZSIsImxvZyIsInN0eWxlUGF0aCIsInBhdGhzIiwidW5zaGlmdCIsIl9yZWxlYXNlIiwiYXNJbWFnZVVSTCIsImJ1ZmZlciIsIkVycm9yIiwiUHJvdG9fQmxvYiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIkJsb2IiLCJwb3AiLCJSZWdfUHJvdG9fQmxvYiIsIlJlZ0V4cCIsInppcCIsIkpTWmlwIiwiaGFzSW1hZ2UiLCJmIiwiZm9sZGVyIiwiaW1hZ2VzIiwiZm9yRWFjaCIsImZpbGUiLCJyZXBsYWNlIiwiaHJlZiIsImdlbmVyYXRlIiwidHlwZSIsImNsaWNrIiwicmV2b2tlT2JqZWN0VVJMIiwibWUiLCJEZWZlcnJlZCIsIndoZW4iLCJzYXZlSW1hZ2UiLCJ0aGVuIiwidXJsIiwic2F2ZUh0bWwiLCJhcnJheUJ1ZmZlciIsImIiLCJDb252ZXJ0ZXIiLCJtIiwicmVxdWlyZSIsImpzZG9tIiwid2luZG93IiwiZGVmYXVsdFZpZXciLCJnbG9iYWwiLCJidG9hIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxjQUFKLEVBQW9CQyxtQkFBcEI7O0lBRXFCQyxROzs7Ozs7Ozs7OzRCQUdYO0FBQ1IsUUFBS0MsR0FBTCxHQUFTLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLEtBQUtDLE9BQTdCLENBQVQ7QUFDQSxRQUFLQyxPQUFMLEdBQWEsS0FBS0osR0FBbEI7QUFDQSxPQUFJSyxlQUFhLEtBQUtELE9BQUwsQ0FBYUUsS0FBOUI7QUFDQUQsZ0JBQWFFLGVBQWIsR0FBNkIsYUFBN0I7QUFDQUYsZ0JBQWFHLFNBQWIsR0FBdUIsUUFBdkI7QUFDQUgsZ0JBQWFJLEtBQWIsR0FBbUIsTUFBbkI7QUFDQUosZ0JBQWFLLFVBQWIsR0FBd0IsTUFBeEI7QUFDQUwsZ0JBQWFNLFFBQWIsR0FBc0IsTUFBdEI7O0FBRUEsT0FBSUwsUUFBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsR0FBckIsQ0FBVjtBQUNBTixTQUFNTyxNQUFOLEdBQWEsR0FBYjtBQUNBUCxTQUFNUSxNQUFOLEdBQWEsR0FBYjtBQUNBUixTQUFNUyxPQUFOLEdBQWMsR0FBZDtBQUNBVCxTQUFNVSxTQUFOLEdBQWdCLFlBQWhCOztBQUVBVixXQUFNLEtBQUtOLEdBQUwsQ0FBU1ksV0FBVCxDQUFxQixPQUFyQixDQUFOO0FBQ0FOLFNBQU1HLEtBQU4sR0FBWSxNQUFaO0FBQ0FILFNBQU1XLGNBQU4sR0FBcUIsVUFBckI7QUFDQVgsU0FBTVksU0FBTixHQUFnQixZQUFoQjs7QUFFQVosV0FBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsU0FBckIsQ0FBTjtBQUNBTixTQUFNTyxNQUFOLEdBQWEsTUFBYjtBQUNBUCxTQUFNQyxlQUFOLEdBQXNCLE9BQXRCO0FBQ0FELFNBQU1hLEtBQU4sR0FBWSxPQUFaO0FBQ0FiLFNBQU1jLFFBQU4sR0FBZSxVQUFmO0FBQ0FkLFNBQU1lLE1BQU4sR0FBYSxDQUFiOztBQUVBZixXQUFNLEtBQUtOLEdBQUwsQ0FBU1ksV0FBVCxDQUFxQixnQkFBckIsQ0FBTjtBQUNBTixTQUFNRixPQUFOLEdBQWMsSUFBZDtBQUNBRSxTQUFNZ0IsT0FBTixHQUFjLGNBQWQ7O0FBRUFoQixXQUFNLEtBQUtOLEdBQUwsQ0FBU1ksV0FBVCxDQUFxQixJQUFyQixDQUFOO0FBQ0FOLFNBQU1pQixTQUFOLEdBQWdCLE1BQWhCOztBQUVBakIsV0FBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsU0FBckIsQ0FBTjtBQUNBTixTQUFNYyxRQUFOLEdBQWUsVUFBZjs7QUFFQWQsV0FBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsWUFBckIsQ0FBTjtBQUNBTixTQUFNYyxRQUFOLEdBQWUsVUFBZjs7QUFFQWQsV0FBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsR0FBckIsQ0FBTjtBQUNBTixTQUFNa0IsY0FBTixHQUFxQixNQUFyQjs7QUFFQWxCLFdBQU0sS0FBS04sR0FBTCxDQUFTWSxXQUFULENBQXFCLGNBQXJCLENBQU47QUFDQU4sU0FBTW1CLE9BQU4sR0FBYyxlQUFkOztBQUVBbkIsV0FBTSxLQUFLTixHQUFMLENBQVNZLFdBQVQsQ0FBcUIsVUFBckIsQ0FBTjtBQUNBTixTQUFNbUIsT0FBTixHQUFjLGtCQUFkO0FBQ0EsUUFBS0MsWUFBTDtBQUNBOzs7aUNBRWE7QUFDYixPQUFJQyxVQUFRLEtBQUtDLFNBQUwsQ0FBZUMsa0JBQWYsRUFBWjtBQUNBLE9BQUcsQ0FBQ0YsT0FBSixFQUNDOztBQUVELE9BQUlyQixRQUFNLEtBQUtOLEdBQUwsQ0FBU1ksV0FBVCxDQUFxQixTQUFyQixDQUFWO0FBQ0Esa0JBQWNlLE9BQWQsdURBQWNBLE9BQWQ7QUFDQSxTQUFLLFFBQUw7QUFBYztBQUNiRyxhQUFRQyxJQUFSLENBQWEsbURBQWI7QUFDRDtBQUNBO0FBQ0N6QixXQUFNQyxlQUFOLEdBQXNCb0IsT0FBdEI7QUFDRDtBQU5BO0FBUUE7QUFDRDs7Ozs7Ozs7OzJCQU1TSyxHLEVBQUk7QUFDWixVQUFPLEtBQUtoQyxHQUFMLENBQVNpQyxRQUFULENBQWtCRCxHQUFsQixFQUFzQixLQUFLRSxLQUEzQixDQUFQO0FBQ0E7Ozs0QkFDUTtBQUNSLFFBQUtsQyxHQUFMLENBQVNtQyxPQUFUO0FBQ0E7Ozt3QkFDS0gsRyxFQUFJO0FBQ1QsVUFBTyxLQUFLaEMsR0FBTCxDQUFTb0MsS0FBVCxDQUFlSixHQUFmLEVBQW1CLEtBQUtFLEtBQXhCLENBQVA7QUFDQTs7OzJCQUNRRixHLEVBQUk7QUFDWixVQUFPLEtBQUtoQyxHQUFMLENBQVNxQyxRQUFULENBQWtCTCxHQUFsQixFQUF1QixLQUFLRSxLQUE1QixDQUFQO0FBQ0E7QUFDRDs7Ozs7Ozs7O3VCQU1NRixHLEVBQUk7QUFDVCxVQUFPLEtBQUtoQyxHQUFMLENBQVNzQyxJQUFULENBQWNOLEdBQWQsRUFBbUIsS0FBS0UsS0FBeEIsQ0FBUDtBQUNBOzs7c0JBL0ZRO0FBQUMsVUFBTyxNQUFQO0FBQWM7Ozt5QkFpR1ZGLEcsRUFBSTtBQUNqQixPQUFJTyxnQkFBYyxJQUFsQjtBQUNBLFVBQVEsVUFBU0MsUUFBVCxFQUFrQjtBQUN6QixRQUFJeEMsTUFBSyxTQUFTeUMsVUFBVCxHQUFxQjtBQUM3QixTQUFJQyxPQUFJLENBQVI7QUFDQSxTQUFJQyxPQUFLLHNCQUFjSCxTQUFTSSxhQUFULENBQXVCLEtBQXZCLENBQWQsRUFBNEM7QUFDcERDLFVBQUssR0FEK0M7QUFFcERDLGVBQVMsSUFGMkM7QUFHcERGLHFCQUFlSixTQUFTSSxhQUFULENBQXVCRyxJQUF2QixDQUE0QlAsUUFBNUIsQ0FIcUM7QUFJcERRLHNCQUFnQlIsU0FBU1EsY0FBVCxDQUF3QkQsSUFBeEIsQ0FBNkJQLFFBQTdCLENBSm9DO0FBS3BEUyxzQkFMb0QsOEJBS2xDO0FBQ2pCLFdBQUcsS0FBS0MsVUFBUixFQUNDLE9BQU8sS0FBS0EsVUFBWjtBQUNELFdBQUlDLFVBQVEsS0FBS1AsYUFBTCxDQUFtQixPQUFuQixDQUFaO0FBQ0EsWUFBS1EsSUFBTCxDQUFVQyxXQUFWLENBQXNCRixPQUF0QixFQUE4QixJQUE5QjtBQUNBLGNBQU8sS0FBS0QsVUFBTCxHQUFnQkMsUUFBUUcsS0FBL0I7QUFDQSxPQVhtRDtBQVlwREMsa0JBWm9ELDBCQVl0QztBQUNiLFdBQUlDLFNBQU8sRUFBWDtBQUNBLFlBQUksSUFBSUMsSUFBRSxDQUFOLEVBQVNDLFFBQU0sS0FBS1IsVUFBTCxDQUFnQlMsUUFBL0IsRUFBeUNDLE1BQUlGLE1BQU1HLE1BQXZELEVBQThESixJQUFFRyxHQUFoRSxFQUFvRUgsR0FBcEU7QUFDQ0QsZUFBT00sSUFBUCxDQUFZSixNQUFNRCxDQUFOLEVBQVNNLE9BQXJCO0FBREQsUUFFQSxPQUFPUCxPQUFPUSxJQUFQLENBQVksTUFBWixDQUFQO0FBQ0EsT0FqQm1EO0FBa0JwRHRCLFNBbEJvRCxpQkFrQi9DO0FBQ0osY0FBTyxLQUFLRyxFQUFMLEdBQVNILE1BQWhCO0FBQ0EsT0FwQm1EO0FBcUJwRFQsY0FyQm9ELG9CQXFCM0NELEdBckIyQyxFQXFCWjtBQUFBLFdBQTFCRSxLQUEwQix1RUFBcEJLLGNBQWNMLEtBQU07O0FBQ3ZDLFdBQUdGLE9BQU8sT0FBT0EsSUFBSWlDLFFBQVgsSUFBcUIsV0FBNUIsSUFBMkNDLEVBQUVDLFVBQUYsQ0FBYW5DLElBQUlpQyxRQUFqQixDQUE5QyxFQUNDLE9BQU9qQyxJQUFJaUMsUUFBSixDQUFhLEtBQUtWLFlBQUwsRUFBYixFQUFrQyxLQUFLYSxLQUFMLEVBQWxDLEVBQWdEbEMsS0FBaEQsQ0FBUDtBQUNELFdBQUltQyxPQUFLLENBQUMsd0dBQXNHbkMsTUFBTW9DLElBQU4sSUFBWSxFQUFsSCxJQUFzSCxpQkFBdkgsQ0FBVDtBQUNBRCxZQUFLUCxJQUFMLENBQVUsS0FBS1AsWUFBTCxFQUFWO0FBQ0FjLFlBQUtQLElBQUwsQ0FBVSx1QkFBVjtBQUNBTyxZQUFLUCxJQUFMLENBQVUsS0FBS00sS0FBTCxFQUFWO0FBQ0FwQyxjQUFPQSxJQUFJdUMsWUFBWCxJQUEyQkYsS0FBS1AsSUFBTCxDQUFVLGtCQUFnQjlCLElBQUl1QyxZQUFwQixHQUFpQyxhQUEzQyxDQUEzQjtBQUNBRixZQUFLUCxJQUFMLENBQVUsZUFBVjtBQUNBLGNBQU9PLEtBQUtMLElBQUwsQ0FBVSxNQUFWLENBQVA7QUFDQSxPQS9CbUQ7QUFnQ3BESSxXQWhDb0QsbUJBZ0M3QztBQUNOLFdBQUlJLE9BQUssS0FBS0MsZ0JBQUwsQ0FBc0IsaUJBQXRCLENBQVQ7QUFDQSxXQUFHRCxLQUFLWCxNQUFMLElBQWEsQ0FBaEIsRUFDQyxPQUFPLEtBQUthLFNBQVo7O0FBRUQ7Ozs7QUFJQSxXQUFJQyxlQUFhM0UsSUFBSTRDLGFBQUosQ0FBa0IsS0FBbEIsQ0FBakI7QUFBQSxXQUEyQ0YsTUFBSSxDQUEvQztBQUNBaUMsb0JBQWE5QixFQUFiLEdBQWdCLGNBQWhCO0FBQ0E4QixvQkFBYXJFLEtBQWIsQ0FBbUJnQixPQUFuQixHQUEyQixNQUEzQjtBQUNBLFlBQUsrQixXQUFMLENBQWlCc0IsWUFBakI7QUFDQSxZQUFJLElBQUlsQixJQUFFZSxLQUFLWCxNQUFMLEdBQVksQ0FBdEIsRUFBd0JKLElBQUUsQ0FBQyxDQUEzQixFQUE2QkEsR0FBN0IsRUFBaUM7QUFDaEMsWUFBSW1CLE1BQUlKLEtBQUtmLENBQUwsQ0FBUjtBQUFBLFlBQ0NvQixTQUFPRCxJQUFJRSxVQURaOztBQUdBLFlBQUcsQ0FBQ0YsSUFBSS9CLEVBQVIsRUFDQytCLElBQUkvQixFQUFKLEdBQU8sT0FBTSxFQUFFSCxHQUFmOztBQUVELFlBQUcsQ0FBQ21DLE9BQU9oQyxFQUFYLEVBQ0NnQyxPQUFPaEMsRUFBUCxHQUFVLE9BQUtILEdBQWY7O0FBRURrQyxZQUFJRyxZQUFKLENBQWlCLGFBQWpCLEVBQStCRixPQUFPaEMsRUFBdEM7QUFDQStCLFlBQUlHLFlBQUosQ0FBaUIsWUFBakIsRUFBOEJDLFFBQVFKLEdBQVIsRUFBWUMsT0FBT0ksVUFBbkIsQ0FBOUI7O0FBRUFOLHFCQUFhdEIsV0FBYixDQUF5Qm1CLEtBQUtmLENBQUwsQ0FBekI7QUFDQTs7QUFFRCxXQUFJWSxPQUFLLEtBQUtLLFNBQUwsR0FBZSxlQUFmLEdBQStCLEtBQUtRLFlBQUwsQ0FBa0JqRCxRQUFsQixFQUEvQixHQUE0RCxlQUFyRTtBQUNBLFlBQUtpRCxZQUFMO0FBQ0EsY0FBT2IsSUFBUDtBQUNBLE9BaEVtRDtBQWlFcERhLGtCQWpFb0QsMEJBaUV0QztBQUNiLFdBQUlDLElBQUUzQyxTQUFTNEMsYUFBVCxDQUF1QixlQUF2QixDQUFOO0FBQ0EsWUFBSSxJQUFJWixPQUFLVyxFQUFFRixVQUFYLEVBQXVCeEIsSUFBRWUsS0FBS1gsTUFBTCxHQUFZLENBQXpDLEVBQTJDSixJQUFFLENBQUMsQ0FBOUMsRUFBZ0RBLEdBQWhELEVBQW9EO0FBQ25ELFlBQUltQixNQUFJSixLQUFLZixDQUFMLENBQVI7QUFBQSxZQUNDNEIsV0FBU1QsSUFBSVUsWUFBSixDQUFpQixhQUFqQixDQURWO0FBQUEsWUFFQ0MsUUFBTUMsU0FBU1osSUFBSVUsWUFBSixDQUFpQixZQUFqQixDQUFULENBRlA7QUFBQSxZQUdDVCxTQUFPckMsU0FBUzRDLGFBQVQsQ0FBdUIsTUFBSUMsUUFBM0IsQ0FIUjtBQUlBUixlQUFPWSxZQUFQLENBQW9CYixHQUFwQixFQUF3QkMsT0FBT0ksVUFBUCxDQUFrQk0sS0FBbEIsQ0FBeEI7QUFDQTtBQUNESixTQUFFTCxVQUFGLENBQWFZLFdBQWIsQ0FBeUJQLENBQXpCO0FBQ0E7QUEzRW1ELE1BQTVDLENBQVQ7O0FBOEVBLGNBQVNILE9BQVQsQ0FBaUJXLEVBQWpCLEVBQXFCQyxHQUFyQixFQUF5QjtBQUN4QixXQUFJLElBQUluQyxJQUFFbUMsSUFBSS9CLE1BQUosR0FBVyxDQUFyQixFQUF1QkosSUFBRSxDQUF6QixFQUEyQkEsR0FBM0I7QUFDQyxXQUFHa0MsTUFBSUMsSUFBSW5DLENBQUosQ0FBUCxFQUNDLE9BQU9BLENBQVA7QUFGRixPQUdBLE9BQU8sQ0FBUDtBQUNBOztBQUVELE1BQUN6QixPQUFPQSxJQUFJNkQsU0FBWCxJQUF3QnJELFNBQVNZLElBQWxDLEVBQXdDQyxXQUF4QyxDQUFvRFYsSUFBcEQ7QUFDQUEsVUFBS1MsSUFBTCxHQUFVVCxJQUFWO0FBQ0EsWUFBT0EsSUFBUDtBQUNBLEtBMUZPLEVBQVI7O0FBNEZBLFdBQVEsU0FBU21ELEtBQVQsQ0FBZTlGLEdBQWYsRUFBbUI7QUFDMUIsU0FBSWtELGFBQVdsRCxJQUFJaUQsZ0JBQUosRUFBZjtBQUNBLFNBQUk4QyxZQUFVLEVBQWQ7QUFBQSxTQUFrQnZDLFNBQU8sRUFBekI7O0FBRUEsWUFBTyxzQkFBY2pCLGNBQWMyQixFQUFFOEIsTUFBRixHQUFXLFFBQVgsR0FBc0IsWUFBcEMsRUFBa0RoRyxHQUFsRCxFQUFzRGtELFVBQXRELEVBQWtFbEIsR0FBbEUsQ0FBZCxFQUFxRjtBQUMzRnBCLGlCQUQyRix1QkFDL0VxRixRQUQrRSxFQUN0RTtBQUNwQixXQUFHekMsT0FBT3lDLFFBQVAsQ0FBSCxFQUNDLE9BQU96QyxPQUFPeUMsUUFBUCxDQUFQO0FBQ0QsV0FBSXZDLFFBQU1SLFdBQVdTLFFBQXJCO0FBQUEsV0FBOEJDLE1BQUlGLE1BQU1HLE1BQXhDO0FBQ0EsV0FBSTtBQUNIWCxtQkFBV2dELFVBQVgsQ0FBc0JELFNBQVNFLEtBQVQsQ0FBZSxHQUFmLEVBQW9CQyxHQUFwQixDQUF3QixVQUFTakIsQ0FBVCxFQUFXO0FBQ3ZELGdCQUFPQSxFQUFFa0IsSUFBRixHQUFTLENBQVQsS0FBYSxHQUFiLEdBQW1CbEIsQ0FBbkIsR0FBdUIsTUFBSSxLQUFLdEMsRUFBVCxHQUFZLEdBQVosR0FBZ0JzQyxDQUE5QztBQUNBLFNBRjRDLENBRTNDcEMsSUFGMkMsQ0FFdEMsSUFGc0MsQ0FBeEIsRUFFUGlCLElBRk8sQ0FFRixHQUZFLElBRUcsSUFGekIsRUFFOEJKLEdBRjlCO0FBR0EsUUFKRCxDQUlFLE9BQU8wQyxDQUFQLEVBQVU7QUFDWHBELG1CQUFXZ0QsVUFBWCxDQUFzQkQsU0FBU0UsS0FBVCxDQUFlLEdBQWYsRUFBb0JDLEdBQXBCLENBQXdCLFVBQVNqQixDQUFULEVBQVc7QUFDdkQsZ0JBQU9BLEVBQUVrQixJQUFGLEdBQVMsQ0FBVCxLQUFhLEdBQWIsR0FBbUJsQixDQUFuQixHQUF1QixNQUFJLEtBQUt0QyxFQUFULEdBQVksR0FBWixHQUFpQixLQUFqQixHQUF5QnNDLEVBQUVvQixLQUFGLENBQVEsQ0FBUixDQUF2RDtBQUNBLFNBRjRDLENBRTNDeEQsSUFGMkMsQ0FFdEMsSUFGc0MsQ0FBeEIsRUFFUGlCLElBRk8sQ0FFRixHQUZFLElBRUcsSUFGekIsRUFFOEJKLEdBRjlCO0FBR0E5QixnQkFBUTBFLEdBQVIsQ0FBWVAsV0FBVyxNQUF2QjtBQUNBO0FBQ0EsY0FBUXpDLE9BQU95QyxRQUFQLElBQWlCL0MsV0FBV1MsUUFBWCxDQUFvQkMsR0FBcEIsRUFBeUJ0RCxLQUFsRDtBQUNELE9BaEIwRjtBQWlCM0ZtRyxlQWpCMkYscUJBaUJqRnRCLENBakJpRixFQWlCOUVOLE1BakI4RSxFQWlCdkU7QUFDbkIsV0FBR0EsTUFBSCxFQUNDLE9BQU9rQixVQUFVWixDQUFWLElBQWFOLE1BQXBCO0FBQ0QsV0FBSTZCLFFBQU0sQ0FBQ3ZCLENBQUQsQ0FBVjtBQUFBLFdBQWNOLFNBQU9NLENBQXJCO0FBQ0EsY0FBTU4sU0FBT2tCLFVBQVVsQixNQUFWLENBQWI7QUFDQzZCLGNBQU1DLE9BQU4sQ0FBYzlCLE1BQWQ7QUFERCxRQUVBLE9BQU82QixNQUFNMUMsSUFBTixDQUFXLEdBQVgsQ0FBUDtBQUNBLE9BeEIwRjtBQXlCM0Y3QixhQXpCMkYscUJBeUJsRjtBQUNSLGNBQU8sS0FBS1csT0FBWjtBQUNBLFlBQUs4RCxRQUFMO0FBQ0E7QUE1QjBGLE1BQXJGLENBQVA7QUE4QkEsS0FsQ00sQ0FrQ0o1RyxHQWxDSSxDQUFQO0FBbUNBLElBaElNLENBZ0lKa0UsRUFBRThCLE1BQUYsR0FBV25HLGdCQUFYLEdBQThCMkMsUUFoSTFCLENBQVA7QUFpSUE7Ozt5QkFFYXhDLEcsRUFBS2tELFUsRUFBWWxCLEcsRUFBSTtBQUNsQyxVQUFPLHNCQUFjaEMsR0FBZCxFQUFrQjtBQUN4QjRHLFlBRHdCLHNCQUNkLENBRVQsQ0FIdUI7QUFJeEJDLGNBSndCLHNCQUliQyxNQUphLEVBSU47QUFDakIsU0FBRzlFLE9BQU8sT0FBT0EsSUFBSTZFLFVBQVgsSUFBd0IsV0FBbEMsRUFDQyxPQUFPN0UsSUFBSTZFLFVBQUosQ0FBZUMsTUFBZixDQUFQO0FBQ0QsWUFBTyxvQkFBUDtBQUNBLEtBUnVCO0FBU3hCMUUsU0FUd0IsbUJBU2pCO0FBQ04sV0FBTSxJQUFJMkUsS0FBSixDQUFVLGFBQVYsQ0FBTjtBQUNBLEtBWHVCO0FBWXhCMUUsWUFad0Isc0JBWWQ7QUFDVCxXQUFNLElBQUkwRSxLQUFKLENBQVUsYUFBVixDQUFOO0FBQ0EsS0FkdUI7QUFleEJ6RSxRQWZ3QixrQkFlbEI7QUFDTCxXQUFNLElBQUl5RSxLQUFKLENBQVUsYUFBVixDQUFOO0FBQ0E7QUFqQnVCLElBQWxCLENBQVA7QUFtQkE7Ozs2QkFFaUIvRyxHLEVBQUtrRCxVLEVBQVlsQixHLEVBQUk7QUFDdEMsT0FBSWdGLGFBQVksVUFBUzdCLENBQVQsRUFBVztBQUN6QkEsUUFBRThCLElBQUlDLGVBQUosQ0FBb0IsSUFBSUMsSUFBSixFQUFwQixFQUFnQ2hCLEtBQWhDLENBQXNDLEdBQXRDLENBQUY7QUFDQWhCLE1BQUVpQyxHQUFGO0FBQ0EsV0FBT2pDLEVBQUVuQixJQUFGLENBQU8sR0FBUCxDQUFQO0FBQ0EsSUFKYSxFQUFmO0FBQUEsT0FLQ3FELGlCQUFlLElBQUlDLE1BQUosQ0FBV04sYUFBVyxlQUF0QixFQUFzQyxJQUF0QyxDQUxoQjs7QUFPQSxVQUFPLHNCQUFjaEgsR0FBZCxFQUFrQjtBQUN4Qm9DLFNBRHdCLGlCQUNsQkosR0FEa0IsRUFDYkUsS0FEYSxFQUNQO0FBQ2hCLFNBQUlxRixNQUFJLElBQUlDLGVBQUosRUFBUjtBQUFBLFNBQW9CQyxXQUFTLEtBQTdCO0FBQ0EsU0FBSUMsSUFBRUgsSUFBSUksTUFBSixDQUFXLFFBQVgsQ0FBTjtBQUNBLHlCQUFZLEtBQUtDLE1BQWpCLEVBQXlCQyxPQUF6QixDQUFpQyxVQUFTMUMsQ0FBVCxFQUFXO0FBQzNDc0MsaUJBQVMsSUFBVDtBQUNBQyxRQUFFSSxJQUFGLENBQU8zQyxFQUFFZ0IsS0FBRixDQUFRLEdBQVIsRUFBYWlCLEdBQWIsRUFBUCxFQUEwQixLQUFLakMsQ0FBTCxDQUExQjtBQUNBLE1BSEQsRUFHRSxLQUFLeUMsTUFIUDtBQUlBTCxTQUFJTyxJQUFKLENBQVMsWUFBVCxFQUFzQix5QkFBZTVGLEtBQWYsQ0FBdEI7QUFDQXFGLFNBQUlPLElBQUosQ0FBUyxXQUFULEVBQXFCTCxXQUFXLEtBQUt4RixRQUFMLENBQWNELEdBQWQsRUFBbUIrRixPQUFuQixDQUEyQmYsVUFBM0IsRUFBc0MsUUFBdEMsQ0FBWCxHQUE2RCxLQUFLL0UsUUFBTCxFQUFsRjtBQUNBLFlBQU9zRixHQUFQO0FBQ0EsS0FYdUI7QUFZeEJsRixZQVp3QixvQkFZZkwsR0FaZSxFQVlWRSxLQVpVLEVBWUo7QUFDbkIsU0FBSWlELElBQUUzQyxTQUFTSSxhQUFULENBQXVCLEdBQXZCLENBQU47QUFDQUosY0FBU1ksSUFBVCxDQUFjQyxXQUFkLENBQTBCOEIsQ0FBMUI7QUFDQUEsT0FBRTZDLElBQUYsR0FBT2YsSUFBSUMsZUFBSixDQUFvQixLQUFLOUUsS0FBTCxDQUFXSixHQUFYLEVBQWVFLEtBQWYsRUFBc0IrRixRQUF0QixDQUErQixFQUFDQyxNQUFLLE1BQU4sRUFBL0IsQ0FBcEIsQ0FBUDtBQUNBL0MsT0FBRTlDLFFBQUYsR0FBVyxDQUFDSCxNQUFNb0MsSUFBTixJQUFZLFVBQWIsSUFBeUIsTUFBcEM7QUFDQWEsT0FBRWdELEtBQUY7QUFDQWxCLFNBQUltQixlQUFKLENBQW9CakQsRUFBRTZDLElBQXRCO0FBQ0F4RixjQUFTWSxJQUFULENBQWNzQyxXQUFkLENBQTBCUCxDQUExQjtBQUNBLEtBcEJ1QjtBQXFCeEI3QyxRQXJCd0IsZ0JBcUJuQk4sR0FyQm1CLEVBcUJkRSxLQXJCYyxFQXFCUjtBQUNmLFNBQUl1RixXQUFTLEtBQWI7QUFBQSxTQUFvQkcsU0FBTyxFQUEzQjtBQUFBLFNBQStCUyxLQUFHLElBQWxDO0FBQ0EsWUFBT25FLEVBQUVvRSxRQUFGLENBQVdDLElBQVgsQ0FBZ0IsQ0FBQyxLQUFLWCxNQUFMLElBQWUsb0JBQVksS0FBS0EsTUFBakIsQ0FBZixJQUF5QyxFQUExQyxFQUE4Q3hCLEdBQTlDLENBQWtELFVBQVNqQixDQUFULEVBQVc7QUFDbkZzQyxpQkFBUyxJQUFUO0FBQ0EsYUFBT3pGLElBQUl3RyxTQUFKLENBQWMsS0FBS3JELENBQUwsQ0FBZCxFQUFzQmpELEtBQXRCLEVBQ0x1RyxJQURLLENBQ0EsVUFBU0MsR0FBVCxFQUFhO0FBQUMsY0FBT2QsT0FBT3pDLENBQVAsSUFBVXVELEdBQWpCO0FBQXFCLE9BRG5DLENBQVA7QUFFQSxNQUpzQixFQUlyQixLQUFLZCxNQUpnQixDQUFoQixFQUtOYSxJQUxNLENBS0QsWUFBVTtBQUNmLFVBQUlwRSxPQUFLZ0UsR0FBR3BHLFFBQUgsQ0FBWUQsR0FBWixFQUFpQkUsS0FBakIsQ0FBVDtBQUNBLFVBQUd1RixRQUFILEVBQ0NwRCxPQUFLQSxLQUFLMEQsT0FBTCxDQUFhVixjQUFiLEVBQTRCLFVBQVNsQyxDQUFULEVBQVd0QyxFQUFYLEVBQWM7QUFBQyxjQUFPK0UsT0FBT3pDLENBQVAsQ0FBUDtBQUFpQixPQUE1RCxDQUFMO0FBQ0QsYUFBT25ELElBQUkyRyxRQUFKLENBQWF0RSxJQUFiLEVBQW1CbkMsS0FBbkIsQ0FBUDtBQUNBLE1BVk0sQ0FBUDtBQVdBLEtBbEN1Qjs7QUFtQ3hCMEYsWUFBTyxFQW5DaUI7QUFvQ3hCZixjQXBDd0Isc0JBb0NiK0IsV0FwQ2EsRUFvQ0Q7QUFDdEIsU0FBSUYsTUFBSXpCLElBQUlDLGVBQUosQ0FBb0IsSUFBSUMsSUFBSixDQUFTLENBQUN5QixXQUFELENBQVQsRUFDM0IsRUFBQ1YsTUFBSyxZQUFVLE9BQU9VLFdBQVAsSUFBcUIsUUFBckIsR0FBZ0MsU0FBaEMsR0FBNEMsR0FBdEQsQ0FBTixFQUQyQixDQUFwQixDQUFSO0FBRUEsVUFBS2hCLE1BQUwsQ0FBWWMsR0FBWixJQUFpQkUsV0FBakI7QUFDQSxZQUFPRixHQUFQO0FBQ0EsS0F6Q3VCO0FBMEN4QjlCLFlBMUN3QixzQkEwQ2Q7QUFDVCx5QkFBWSxLQUFLZ0IsTUFBakIsRUFBeUJDLE9BQXpCLENBQWlDLFVBQVNnQixDQUFULEVBQVc7QUFDM0M1QixVQUFJbUIsZUFBSixDQUFvQlMsQ0FBcEI7QUFDQSxNQUZEO0FBR0EsWUFBTyxLQUFLakIsTUFBWjtBQUNBO0FBL0N1QixJQUFsQixDQUFQO0FBaURBOzs7RUF0VG9Da0IsbUI7O2tCQUFqQi9JLFE7OztBQXlUckIsQ0FBQyxVQUFTaUcsTUFBVCxFQUFpQitDLENBQWpCLEVBQW1CO0FBQ25CLEtBQUcsQ0FBQy9DLE1BQUosRUFBWTs7QUFFWm5HLGtCQUFlbUosUUFBUUQsQ0FBUixFQUFXRSxLQUExQjtBQUNBLEtBQUlDLFNBQU9ySixpQkFBaUJzSixXQUE1Qjs7QUFFQUMsUUFBT0MsSUFBUCxHQUFZSCxPQUFPRyxJQUFuQjtBQUNBdkosdUJBQW9Cb0osT0FBT3BKLG1CQUEzQjtBQUNBLENBUkQsRUFRR29FLEVBQUU4QixNQVJMLEVBUWEsT0FSYiIsImZpbGUiOiJkb2N1bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb252ZXJ0ZXIgZnJvbSAnLi9jb252ZXJ0ZXInXG5pbXBvcnQgSlNaaXAgZnJvbSAnanN6aXAnXG5cbnZhciBjcmVhdGVEb2N1bWVudCwgQ1NTU3R5bGVEZWNsYXJhdGlvblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2N1bWVudCBleHRlbmRzIENvbnZlcnRlcntcblx0Z2V0IHRhZygpe3JldHVybiAnaHRtbCd9XG5cblx0Y29udmVydCgpe1xuXHRcdHRoaXMuZG9jPXRoaXMuY29uc3RydWN0b3IuY3JlYXRlKHRoaXMub3B0aW9ucylcblx0XHR0aGlzLmNvbnRlbnQ9dGhpcy5kb2Ncblx0XHRsZXQgY29udGVudFN0eWxlPXRoaXMuY29udGVudC5zdHlsZVxuXHRcdGNvbnRlbnRTdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3RyYW5zcGFyZW50J1xuXHRcdGNvbnRlbnRTdHlsZS5taW5IZWlnaHQ9JzEwMDBweCdcblx0XHRjb250ZW50U3R5bGUud2lkdGg9JzEwMCUnXG5cdFx0Y29udGVudFN0eWxlLnBhZGRpbmdUb3A9JzIwcHgnXG5cdFx0Y29udGVudFN0eWxlLm92ZXJmbG93PSdhdXRvJ1xuXG5cdFx0dmFyIHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCcqJylcblx0XHRzdHlsZS5tYXJnaW49JzAnXG5cdFx0c3R5bGUuYm9yZGVyPScwJ1xuXHRcdHN0eWxlLnBhZGRpbmc9JzAnXG5cdFx0c3R5bGUuYm94U2l6aW5nPSdib3JkZXItYm94J1xuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3RhYmxlJylcblx0XHRzdHlsZS53aWR0aD0nMTAwJSdcblx0XHRzdHlsZS5ib3JkZXJDb2xsYXBzZT0nY29sbGFwc2UnXG5cdFx0c3R5bGUud29yZEJyZWFrPSdicmVhay13b3JkJ1xuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3NlY3Rpb24nKVxuXHRcdHN0eWxlLm1hcmdpbj0nYXV0bydcblx0XHRzdHlsZS5iYWNrZ3JvdW5kQ29sb3I9J3doaXRlJ1xuXHRcdHN0eWxlLmNvbG9yPSdibGFjaydcblx0XHRzdHlsZS5wb3NpdGlvbj0ncmVsYXRpdmUnXG5cdFx0c3R5bGUuekluZGV4PTBcblxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCdwOmVtcHR5OmJlZm9yZScpXG5cdFx0c3R5bGUuY29udGVudD0nXCJcIidcblx0XHRzdHlsZS5kaXNwbGF5PSdpbmxpbmUtYmxvY2snXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgndWwnKVxuXHRcdHN0eWxlLmxpc3RTdHlsZT1cIm5vbmVcIlxuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3VsPmxpPnAnKVxuXHRcdHN0eWxlLnBvc2l0aW9uPSdyZWxhdGl2ZSdcblxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCd1bCAubWFya2VyJylcblx0XHRzdHlsZS5wb3NpdGlvbj0nYWJzb2x1dGUnXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgnYScpXG5cdFx0c3R5bGUudGV4dERlY29yYXRpb249J25vbmUnXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgnLnVuc3VwcG9ydGVkJylcblx0XHRzdHlsZS5vdXRsaW5lPVwiMnB4IHJlZCBzb2xpZFwiXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgnLndhcm5pbmcnKVxuXHRcdHN0eWxlLm91dGxpbmU9XCIxcHggeWVsbG93IHNvbGlkXCJcblx0XHR0aGlzLmNvbnZlcnRTdHlsZSgpXG5cdH1cblx0XG5cdGNvbnZlcnRTdHlsZSgpe1xuXHRcdHZhciBiZ1N0eWxlPXRoaXMud29yZE1vZGVsLmdldEJhY2tncm91bmRTdHlsZSgpXG5cdFx0aWYoIWJnU3R5bGUpXG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHR2YXIgc3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3NlY3Rpb24nKVxuXHRcdHN3aXRjaCh0eXBlb2YgYmdTdHlsZSl7XG5cdFx0Y2FzZSAnb2JqZWN0JzovLyBmaWxsXG5cdFx0XHRjb25zb2xlLndhcm4oJ25vdCBzdXBwb3J0IGZpbGwgY29sb3Igb24gZG9jdW1lbnQgYmFja2dyb3VuZCB5ZXQnKVxuXHRcdGJyZWFrXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHN0eWxlLmJhY2tncm91bmRDb2xvcj1iZ1N0eWxlXG5cdFx0YnJlYWtcblx0XHR9XG5cdH1cblx0LyoqXG5cdCogb3B0OiB7XG5cdCogXHR0ZW1wbGF0ZTogZnVuY3Rpb24oc3R5bGUsIGh0bWwsIHByb3BzKXsgcmV0dXJuIChodG1sKX0sXG5cdFx0ZXh0ZW5kU2NyaXB0OiBcImh0dHA6Ly9hLmNvbS9hLmpzXCJcblx0XHR9XG5cdCovXG5cdHRvU3RyaW5nKG9wdCl7XG5cdFx0cmV0dXJuIHRoaXMuZG9jLnRvU3RyaW5nKG9wdCx0aGlzLnByb3BzKVxuXHR9XG5cdHJlbGVhc2UoKXtcblx0XHR0aGlzLmRvYy5yZWxlYXNlKClcblx0fVxuXHRhc1ppcChvcHQpe1xuXHRcdHJldHVybiB0aGlzLmRvYy5hc1ppcChvcHQsdGhpcy5wcm9wcylcblx0fVxuXHRkb3dubG9hZChvcHQpe1xuXHRcdHJldHVybiB0aGlzLmRvYy5kb3dubG9hZChvcHQsIHRoaXMucHJvcHMpXG5cdH1cblx0LyoqXG5cdCogb3B0PWV4dGVuZCh0b1N0cmluZy5vcHQse1xuXHRcdHNhdmVJbWFnZTogZnVuY3Rpb24oYXJyYXlCdWZmZXIsIGRvYy5wcm9wcyk6IHByb21pc2UodXJsKSB7fSxcblx0XHRzYXZlSHRtbDogZnVuY3Rpb24oKXt9XG5cdH0pXG5cdCovXG5cdHNhdmUgKG9wdCl7XG5cdFx0cmV0dXJuIHRoaXMuZG9jLnNhdmUob3B0LCB0aGlzLnByb3BzKVxuXHR9XG5cblx0c3RhdGljIGNyZWF0ZShvcHQpe1xuXHRcdHZhciBzZWxmQ29udmVydGVyPXRoaXNcblx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRvY3VtZW50KXtcblx0XHRcdHZhciBkb2M9KGZ1bmN0aW9uIGJyb3dzZXJEb2MoKXtcblx0XHRcdFx0dmFyIHVpZD0wO1xuXHRcdFx0XHR2YXIgcm9vdD1PYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLHtcblx0XHRcdFx0XHRpZCA6IFwiQVwiLFxuXHRcdFx0XHRcdHNlY3Rpb246IG51bGwsXG5cdFx0XHRcdFx0Y3JlYXRlRWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudC5iaW5kKGRvY3VtZW50KSxcblx0XHRcdFx0XHRjcmVhdGVUZXh0Tm9kZTogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUuYmluZChkb2N1bWVudCksXG5cdFx0XHRcdFx0Y3JlYXRlU3R5bGVTaGVldCgpe1xuXHRcdFx0XHRcdFx0aWYodGhpcy5zdHlsZXNoZWV0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zdHlsZXNoZWV0O1xuXHRcdFx0XHRcdFx0dmFyIGVsU3R5bGU9dGhpcy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0XHRcdFx0XHR0aGlzLmJvZHkuYXBwZW5kQ2hpbGQoZWxTdHlsZSxudWxsKTtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnN0eWxlc2hlZXQ9ZWxTdHlsZS5zaGVldFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Z2V0U3R5bGVUZXh0KCl7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGVzPVtdXG5cdFx0XHRcdFx0XHRmb3IodmFyIGk9MCwgcnVsZXM9dGhpcy5zdHlsZXNoZWV0LmNzc1J1bGVzLCBsZW49cnVsZXMubGVuZ3RoO2k8bGVuO2krKylcblx0XHRcdFx0XHRcdFx0c3R5bGVzLnB1c2gocnVsZXNbaV0uY3NzVGV4dClcblx0XHRcdFx0XHRcdHJldHVybiBzdHlsZXMuam9pbignXFxyXFxuJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHVpZCgpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuaWQrKHVpZCsrKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dG9TdHJpbmcob3B0LCBwcm9wcz1zZWxmQ29udmVydGVyLnByb3BzKXtcblx0XHRcdFx0XHRcdGlmKG9wdCAmJiB0eXBlb2Ygb3B0LnRlbXBsYXRlIT1cInVuZGVmaW5lZFwiICYmICQuaXNGdW5jdGlvbihvcHQudGVtcGxhdGUpKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0LnRlbXBsYXRlKHRoaXMuZ2V0U3R5bGVUZXh0KCksIHRoaXMuX2h0bWwoKSwgcHJvcHMpXG5cdFx0XHRcdFx0XHR2YXIgaHRtbD1bJzwhZG9jdHlwZSBodG1sPlxcclxcbjxodG1sPjxoZWFkPjxtZXRhIGNoYXJzZXQ9dXRmLTg+PG1ldGEga2V5PVwiZ2VuZXJhdG9yXCIgdmFsdWU9XCJkb2N4Mmh0bWxcIj48dGl0bGU+JysocHJvcHMubmFtZXx8JycpKyc8L3RpdGxlPjxzdHlsZT4nXVxuXHRcdFx0XHRcdFx0aHRtbC5wdXNoKHRoaXMuZ2V0U3R5bGVUZXh0KCkpXG5cdFx0XHRcdFx0XHRodG1sLnB1c2goJzwvc3R5bGU+PC9oZWFkPjxib2R5PicpXG5cdFx0XHRcdFx0XHRodG1sLnB1c2godGhpcy5faHRtbCgpKVxuXHRcdFx0XHRcdFx0b3B0ICYmIG9wdC5leHRlbmRTY3JpcHQgJiYgaHRtbC5wdXNoKCc8c2NyaXB0IHNyYz1cIicrb3B0LmV4dGVuZFNjcmlwdCsnXCI+PC9zY3JpcHQ+Jylcblx0XHRcdFx0XHRcdGh0bWwucHVzaCgnPC9ib2R5PjxodG1sPicpXG5cdFx0XHRcdFx0XHRyZXR1cm4gaHRtbC5qb2luKCdcXHJcXG4nKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0X2h0bWwoKXtcblx0XHRcdFx0XHRcdHZhciBkaXZzPXRoaXMucXVlcnlTZWxlY3RvckFsbCgncD5kaXYsIHNwYW4+ZGl2Jylcblx0XHRcdFx0XHRcdGlmKGRpdnMubGVuZ3RoPT0wKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5vdXRlckhUTUxcblxuXHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHQqIGlsbGVnYWwgPHA+IDxkaXYvPiA8L3A+XG5cdFx0XHRcdFx0XHQqIERPTSBvcGVyYXRpb24gZGlyZWN0bHkgaW4gb25sb2FkXG5cdFx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdFx0dmFyIGRpdmNvbnRhaW5lcj1kb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIHVpZD0wXG5cdFx0XHRcdFx0XHRkaXZjb250YWluZXIuaWQ9J2RpdmNvbnRhaW5lcidcblx0XHRcdFx0XHRcdGRpdmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5PVwibm9uZVwiXG5cdFx0XHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKGRpdmNvbnRhaW5lcilcblx0XHRcdFx0XHRcdGZvcih2YXIgaT1kaXZzLmxlbmd0aC0xO2k+LTE7aS0tKXtcblx0XHRcdFx0XHRcdFx0dmFyIGRpdj1kaXZzW2ldLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudD1kaXYucGFyZW50Tm9kZTtcblxuXHRcdFx0XHRcdFx0XHRpZighZGl2LmlkKVxuXHRcdFx0XHRcdFx0XHRcdGRpdi5pZD0nX3onKygrK3VpZClcblxuXHRcdFx0XHRcdFx0XHRpZighcGFyZW50LmlkKVxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudC5pZD0nX3knK3VpZFxuXG5cdFx0XHRcdFx0XHRcdGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyZW50JyxwYXJlbnQuaWQpXG5cdFx0XHRcdFx0XHRcdGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLGluZGV4T2YoZGl2LHBhcmVudC5jaGlsZE5vZGVzKSlcblxuXHRcdFx0XHRcdFx0XHRkaXZjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2c1tpXSlcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIGh0bWw9dGhpcy5vdXRlckhUTUwrJ1xcblxccjxzY3JpcHQ+KCcrdGhpcy5fdHJhbnNmb3JtZXIudG9TdHJpbmcoKSsnKSgpOzwvc2NyaXB0Pidcblx0XHRcdFx0XHRcdHRoaXMuX3RyYW5zZm9ybWVyKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaHRtbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0X3RyYW5zZm9ybWVyKCl7XG5cdFx0XHRcdFx0XHR2YXIgYT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGl2Y29udGFpbmVyJylcblx0XHRcdFx0XHRcdGZvcih2YXIgZGl2cz1hLmNoaWxkTm9kZXMsIGk9ZGl2cy5sZW5ndGgtMTtpPi0xO2ktLSl7XG5cdFx0XHRcdFx0XHRcdHZhciBkaXY9ZGl2c1tpXSxcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRJZD1kaXYuZ2V0QXR0cmlidXRlKCdkYXRhLXBhcmVudCcpLFxuXHRcdFx0XHRcdFx0XHRcdGluZGV4PXBhcnNlSW50KGRpdi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSksXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnK3BhcmVudElkKTtcblx0XHRcdFx0XHRcdFx0cGFyZW50Lmluc2VydEJlZm9yZShkaXYscGFyZW50LmNoaWxkTm9kZXNbaW5kZXhdKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBpbmRleE9mKGVsLCBlbHMpe1xuXHRcdFx0XHRcdGZvcih2YXIgaT1lbHMubGVuZ3RoLTE7aT4wO2ktLSlcblx0XHRcdFx0XHRcdGlmKGVsPT1lbHNbaV0pXG5cdFx0XHRcdFx0XHRcdHJldHVybiBpXG5cdFx0XHRcdFx0cmV0dXJuIDBcblx0XHRcdFx0fVxuXG5cdFx0XHRcdChvcHQgJiYgb3B0LmNvbnRhaW5lciB8fCBkb2N1bWVudC5ib2R5KS5hcHBlbmRDaGlsZChyb290KTtcblx0XHRcdFx0cm9vdC5ib2R5PXJvb3Rcblx0XHRcdFx0cmV0dXJuIHJvb3Rcblx0XHRcdH0pKCk7XG5cblx0XHRcdHJldHVybiAoZnVuY3Rpb24gbWl4aW4oZG9jKXtcblx0XHRcdFx0dmFyIHN0eWxlc2hlZXQ9ZG9jLmNyZWF0ZVN0eWxlU2hlZXQoKVxuXHRcdFx0XHR2YXIgcmVsU3R5bGVzPXt9LCBzdHlsZXM9e31cblxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzZWxmQ29udmVydGVyWyQuaXNOb2RlID8gJ25vZGVmeScgOiAnYnJvd3NlcmlmeSddKGRvYyxzdHlsZXNoZWV0LCBvcHQpLHtcblx0XHRcdFx0XHRjcmVhdGVTdHlsZShzZWxlY3Rvcil7XG5cdFx0XHRcdFx0XHRpZihzdHlsZXNbc2VsZWN0b3JdKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc3R5bGVzW3NlbGVjdG9yXVxuXHRcdFx0XHRcdFx0dmFyIHJ1bGVzPXN0eWxlc2hlZXQuY3NzUnVsZXMsbGVuPXJ1bGVzLmxlbmd0aFxuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0c3R5bGVzaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGEudHJpbSgpWzBdPT0nIycgPyBhIDogJyMnK3RoaXMuaWQrJyAnK2Fcblx0XHRcdFx0XHRcdFx0XHR9LmJpbmQodGhpcykpLmpvaW4oJywnKSsne30nLGxlbilcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0c3R5bGVzaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGEudHJpbSgpWzBdPT0nIycgPyBhIDogJyMnK3RoaXMuaWQrJyAnKyAnLmFiJyArIGEuc2xpY2UoMSlcblx0XHRcdFx0XHRcdFx0XHR9LmJpbmQodGhpcykpLmpvaW4oJywnKSsne30nLGxlbilcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coc2VsZWN0b3IgKyAn6Kej5p6Q5aSx6LSlJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiAgc3R5bGVzW3NlbGVjdG9yXT1zdHlsZXNoZWV0LmNzc1J1bGVzW2xlbl0uc3R5bGVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0eWxlUGF0aChhLCBwYXJlbnQpe1xuXHRcdFx0XHRcdFx0aWYocGFyZW50KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVsU3R5bGVzW2FdPXBhcmVudFxuXHRcdFx0XHRcdFx0dmFyIHBhdGhzPVthXSxwYXJlbnQ9YVxuXHRcdFx0XHRcdFx0d2hpbGUocGFyZW50PXJlbFN0eWxlc1twYXJlbnRdKVxuXHRcdFx0XHRcdFx0XHRwYXRocy51bnNoaWZ0KHBhcmVudClcblx0XHRcdFx0XHRcdHJldHVybiBwYXRocy5qb2luKCcgJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlbGVhc2UoKXtcblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLnNlY3Rpb25cblx0XHRcdFx0XHRcdHRoaXMuX3JlbGVhc2UoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pKGRvYylcblx0XHR9KSgkLmlzTm9kZSA/IGNyZWF0ZURvY3VtZW50KCkgOiBkb2N1bWVudClcblx0fVxuXG5cdHN0YXRpYyBub2RlZnkoZG9jLCBzdHlsZXNoZWV0LCBvcHQpe1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGRvYyx7XG5cdFx0XHRfcmVsZWFzZSgpe1xuXG5cdFx0XHR9LFxuXHRcdFx0YXNJbWFnZVVSTChidWZmZXIpe1xuXHRcdFx0XHRpZihvcHQgJiYgdHlwZW9mKG9wdC5hc0ltYWdlVVJMKSE9J3VuZGVmaW5lZCcpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdC5hc0ltYWdlVVJMKGJ1ZmZlcilcblx0XHRcdFx0cmV0dXJuIFwiaW1hZ2U6Ly9ub3RzdXBwb3J0XCJcblx0XHRcdH0sXG5cdFx0XHRhc1ppcCgpe1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0Jylcblx0XHRcdH0sXG5cdFx0XHRkb3dubG9hZCgpe1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0Jylcblx0XHRcdH0sXG5cdFx0XHRzYXZlKCl7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm90IHN1cHBvcnQnKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXHRzdGF0aWMgYnJvd3NlcmlmeShkb2MsIHN0eWxlc2hlZXQsIG9wdCl7XG5cdFx0dmFyIFByb3RvX0Jsb2I9KGZ1bmN0aW9uKGEpe1xuXHRcdFx0XHRhPVVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoKSkuc3BsaXQoJy8nKTtcblx0XHRcdFx0YS5wb3AoKTtcblx0XHRcdFx0cmV0dXJuIGEuam9pbignLycpXG5cdFx0XHR9KSgpLFxuXHRcdFx0UmVnX1Byb3RvX0Jsb2I9bmV3IFJlZ0V4cChQcm90b19CbG9iK1wiLyhbXFxcXHdcXFxcZC1dKylcIixcImdpXCIpO1xuXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jLHtcblx0XHRcdGFzWmlwKG9wdCwgcHJvcHMpe1xuXHRcdFx0XHR2YXIgemlwPW5ldyBKU1ppcCgpLGhhc0ltYWdlPWZhbHNlO1xuXHRcdFx0XHR2YXIgZj16aXAuZm9sZGVyKCdpbWFnZXMnKVxuXHRcdFx0XHRPYmplY3Qua2V5cyh0aGlzLmltYWdlcykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0XHRcdFx0XHRoYXNJbWFnZT10cnVlXG5cdFx0XHRcdFx0Zi5maWxlKGEuc3BsaXQoJy8nKS5wb3AoKSx0aGlzW2FdKVxuXHRcdFx0XHR9LHRoaXMuaW1hZ2VzKVxuXHRcdFx0XHR6aXAuZmlsZSgncHJvcHMuanNvbicsSlNPTi5zdHJpbmdpZnkocHJvcHMpKTtcblx0XHRcdFx0emlwLmZpbGUoJ21haW4uaHRtbCcsaGFzSW1hZ2UgPyB0aGlzLnRvU3RyaW5nKG9wdCkucmVwbGFjZShQcm90b19CbG9iLCdpbWFnZXMnKSA6IHRoaXMudG9TdHJpbmcoKSlcblx0XHRcdFx0cmV0dXJuIHppcFxuXHRcdFx0fSxcblx0XHRcdGRvd25sb2FkKG9wdCwgcHJvcHMpe1xuXHRcdFx0XHR2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpXG5cdFx0XHRcdGEuaHJlZj1VUkwuY3JlYXRlT2JqZWN0VVJMKHRoaXMuYXNaaXAob3B0LHByb3BzKS5nZW5lcmF0ZSh7dHlwZTonYmxvYid9KSlcblx0XHRcdFx0YS5kb3dubG9hZD0ocHJvcHMubmFtZXx8XCJkb2N1bWVudFwiKSsnLnppcCdcblx0XHRcdFx0YS5jbGljaygpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoYS5ocmVmKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpXG5cdFx0XHR9LFxuXHRcdFx0c2F2ZShvcHQsIHByb3BzKXtcblx0XHRcdFx0dmFyIGhhc0ltYWdlPWZhbHNlLCBpbWFnZXM9e30sIG1lPXRoaXM7XG5cdFx0XHRcdHJldHVybiAkLkRlZmVycmVkLndoZW4oKHRoaXMuaW1hZ2VzICYmIE9iamVjdC5rZXlzKHRoaXMuaW1hZ2VzKXx8W10pLm1hcChmdW5jdGlvbihhKXtcblx0XHRcdFx0XHRoYXNJbWFnZT10cnVlXG5cdFx0XHRcdFx0cmV0dXJuIG9wdC5zYXZlSW1hZ2UodGhpc1thXSxwcm9wcylcblx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVybCl7cmV0dXJuIGltYWdlc1thXT11cmx9KVxuXHRcdFx0XHR9LHRoaXMuaW1hZ2VzKSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaHRtbD1tZS50b1N0cmluZyhvcHQsIHByb3BzKTtcblx0XHRcdFx0XHRpZihoYXNJbWFnZSlcblx0XHRcdFx0XHRcdGh0bWw9aHRtbC5yZXBsYWNlKFJlZ19Qcm90b19CbG9iLGZ1bmN0aW9uKGEsaWQpe3JldHVybiBpbWFnZXNbYV19KTtcblx0XHRcdFx0XHRyZXR1cm4gb3B0LnNhdmVIdG1sKGh0bWwsIHByb3BzKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSxcblx0XHRcdGltYWdlczp7fSxcblx0XHRcdGFzSW1hZ2VVUkwoYXJyYXlCdWZmZXIpe1xuXHRcdFx0XHR2YXIgdXJsPVVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2FycmF5QnVmZmVyXSxcblx0XHRcdFx0XHR7dHlwZTpcImltYWdlL1wiKyh0eXBlb2YoYXJyYXlCdWZmZXIpPT0nc3RyaW5nJyA/ICdzdmcreG1sJyA6ICcqJyl9KSk7XG5cdFx0XHRcdHRoaXMuaW1hZ2VzW3VybF09YXJyYXlCdWZmZXJcblx0XHRcdFx0cmV0dXJuIHVybFxuXHRcdFx0fSxcblx0XHRcdF9yZWxlYXNlKCl7XG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMuaW1hZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uKGIpe1xuXHRcdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoYilcblx0XHRcdFx0fSlcblx0XHRcdFx0ZGVsZXRlIHRoaXMuaW1hZ2VzXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG4oZnVuY3Rpb24oaXNOb2RlLCBtKXtcblx0aWYoIWlzTm9kZSlcdHJldHVybjtcblxuXHRjcmVhdGVEb2N1bWVudD1yZXF1aXJlKG0pLmpzZG9tXG5cdGxldCB3aW5kb3c9Y3JlYXRlRG9jdW1lbnQoKS5kZWZhdWx0Vmlld1xuXG5cdGdsb2JhbC5idG9hPXdpbmRvdy5idG9hXG5cdENTU1N0eWxlRGVjbGFyYXRpb249d2luZG93LkNTU1N0eWxlRGVjbGFyYXRpb25cbn0pKCQuaXNOb2RlLCBcImpzZG9tXCIpXG4iXX0=