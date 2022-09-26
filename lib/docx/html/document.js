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
								return styles[selector] = stylesheet.cssRules[len].style;
							} catch (e) {
								console.log(selector + '解析失败');
								return styles[selector] = "";
							}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb2N4L2h0bWwvZG9jdW1lbnQuanMiXSwibmFtZXMiOlsiY3JlYXRlRG9jdW1lbnQiLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwiRG9jdW1lbnQiLCJkb2MiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZSIsIm9wdGlvbnMiLCJjb250ZW50IiwiY29udGVudFN0eWxlIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtaW5IZWlnaHQiLCJ3aWR0aCIsInBhZGRpbmdUb3AiLCJvdmVyZmxvdyIsImNyZWF0ZVN0eWxlIiwibWFyZ2luIiwiYm9yZGVyIiwicGFkZGluZyIsImJveFNpemluZyIsImJvcmRlckNvbGxhcHNlIiwid29yZEJyZWFrIiwiY29sb3IiLCJwb3NpdGlvbiIsInpJbmRleCIsImRpc3BsYXkiLCJsaXN0U3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsIm91dGxpbmUiLCJjb252ZXJ0U3R5bGUiLCJiZ1N0eWxlIiwid29yZE1vZGVsIiwiZ2V0QmFja2dyb3VuZFN0eWxlIiwiY29uc29sZSIsIndhcm4iLCJvcHQiLCJ0b1N0cmluZyIsInByb3BzIiwicmVsZWFzZSIsImFzWmlwIiwiZG93bmxvYWQiLCJzYXZlIiwic2VsZkNvbnZlcnRlciIsImRvY3VtZW50IiwiYnJvd3NlckRvYyIsInVpZCIsInJvb3QiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJzZWN0aW9uIiwiYmluZCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlU3R5bGVTaGVldCIsInN0eWxlc2hlZXQiLCJlbFN0eWxlIiwiYm9keSIsImFwcGVuZENoaWxkIiwic2hlZXQiLCJnZXRTdHlsZVRleHQiLCJzdHlsZXMiLCJpIiwicnVsZXMiLCJjc3NSdWxlcyIsImxlbiIsImxlbmd0aCIsInB1c2giLCJjc3NUZXh0Iiwiam9pbiIsInRlbXBsYXRlIiwiJCIsImlzRnVuY3Rpb24iLCJfaHRtbCIsImh0bWwiLCJuYW1lIiwiZXh0ZW5kU2NyaXB0IiwiZGl2cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvdXRlckhUTUwiLCJkaXZjb250YWluZXIiLCJkaXYiLCJwYXJlbnQiLCJwYXJlbnROb2RlIiwic2V0QXR0cmlidXRlIiwiaW5kZXhPZiIsImNoaWxkTm9kZXMiLCJfdHJhbnNmb3JtZXIiLCJhIiwicXVlcnlTZWxlY3RvciIsInBhcmVudElkIiwiZ2V0QXR0cmlidXRlIiwiaW5kZXgiLCJwYXJzZUludCIsImluc2VydEJlZm9yZSIsInJlbW92ZUNoaWxkIiwiZWwiLCJlbHMiLCJjb250YWluZXIiLCJtaXhpbiIsInJlbFN0eWxlcyIsImlzTm9kZSIsInNlbGVjdG9yIiwiaW5zZXJ0UnVsZSIsInNwbGl0IiwibWFwIiwidHJpbSIsImUiLCJsb2ciLCJzdHlsZVBhdGgiLCJwYXRocyIsInVuc2hpZnQiLCJfcmVsZWFzZSIsImFzSW1hZ2VVUkwiLCJidWZmZXIiLCJFcnJvciIsIlByb3RvX0Jsb2IiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJCbG9iIiwicG9wIiwiUmVnX1Byb3RvX0Jsb2IiLCJSZWdFeHAiLCJ6aXAiLCJKU1ppcCIsImhhc0ltYWdlIiwiZiIsImZvbGRlciIsImltYWdlcyIsImZvckVhY2giLCJmaWxlIiwicmVwbGFjZSIsImhyZWYiLCJnZW5lcmF0ZSIsInR5cGUiLCJjbGljayIsInJldm9rZU9iamVjdFVSTCIsIm1lIiwiRGVmZXJyZWQiLCJ3aGVuIiwic2F2ZUltYWdlIiwidGhlbiIsInVybCIsInNhdmVIdG1sIiwiYXJyYXlCdWZmZXIiLCJiIiwiQ29udmVydGVyIiwibSIsInJlcXVpcmUiLCJqc2RvbSIsIndpbmRvdyIsImRlZmF1bHRWaWV3IiwiZ2xvYmFsIiwiYnRvYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSUEsY0FBSixFQUFvQkMsbUJBQXBCOztJQUVxQkMsUTs7Ozs7Ozs7Ozs0QkFHWDtBQUNSLFFBQUtDLEdBQUwsR0FBUyxLQUFLQyxXQUFMLENB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dW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29udmVydGVyIGZyb20gJy4vY29udmVydGVyJ1xuaW1wb3J0IEpTWmlwIGZyb20gJ2pzemlwJ1xuXG52YXIgY3JlYXRlRG9jdW1lbnQsIENTU1N0eWxlRGVjbGFyYXRpb25cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBDb252ZXJ0ZXJ7XG5cdGdldCB0YWcoKXtyZXR1cm4gJ2h0bWwnfVxuXG5cdGNvbnZlcnQoKXtcblx0XHR0aGlzLmRvYz10aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZSh0aGlzLm9wdGlvbnMpXG5cdFx0dGhpcy5jb250ZW50PXRoaXMuZG9jXG5cdFx0bGV0IGNvbnRlbnRTdHlsZT10aGlzLmNvbnRlbnQuc3R5bGVcblx0XHRjb250ZW50U3R5bGUuYmFja2dyb3VuZENvbG9yPSd0cmFuc3BhcmVudCdcblx0XHRjb250ZW50U3R5bGUubWluSGVpZ2h0PScxMDAwcHgnXG5cdFx0Y29udGVudFN0eWxlLndpZHRoPScxMDAlJ1xuXHRcdGNvbnRlbnRTdHlsZS5wYWRkaW5nVG9wPScyMHB4J1xuXHRcdGNvbnRlbnRTdHlsZS5vdmVyZmxvdz0nYXV0bydcblxuXHRcdHZhciBzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgnKicpXG5cdFx0c3R5bGUubWFyZ2luPScwJ1xuXHRcdHN0eWxlLmJvcmRlcj0nMCdcblx0XHRzdHlsZS5wYWRkaW5nPScwJ1xuXHRcdHN0eWxlLmJveFNpemluZz0nYm9yZGVyLWJveCdcblxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCd0YWJsZScpXG5cdFx0c3R5bGUud2lkdGg9JzEwMCUnXG5cdFx0c3R5bGUuYm9yZGVyQ29sbGFwc2U9J2NvbGxhcHNlJ1xuXHRcdHN0eWxlLndvcmRCcmVhaz0nYnJlYWstd29yZCdcblxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCdzZWN0aW9uJylcblx0XHRzdHlsZS5tYXJnaW49J2F1dG8nXG5cdFx0c3R5bGUuYmFja2dyb3VuZENvbG9yPSd3aGl0ZSdcblx0XHRzdHlsZS5jb2xvcj0nYmxhY2snXG5cdFx0c3R5bGUucG9zaXRpb249J3JlbGF0aXZlJ1xuXHRcdHN0eWxlLnpJbmRleD0wXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgncDplbXB0eTpiZWZvcmUnKVxuXHRcdHN0eWxlLmNvbnRlbnQ9J1wiXCInXG5cdFx0c3R5bGUuZGlzcGxheT0naW5saW5lLWJsb2NrJ1xuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3VsJylcblx0XHRzdHlsZS5saXN0U3R5bGU9XCJub25lXCJcblxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCd1bD5saT5wJylcblx0XHRzdHlsZS5wb3NpdGlvbj0ncmVsYXRpdmUnXG5cblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgndWwgLm1hcmtlcicpXG5cdFx0c3R5bGUucG9zaXRpb249J2Fic29sdXRlJ1xuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ2EnKVxuXHRcdHN0eWxlLnRleHREZWNvcmF0aW9uPSdub25lJ1xuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJy51bnN1cHBvcnRlZCcpXG5cdFx0c3R5bGUub3V0bGluZT1cIjJweCByZWQgc29saWRcIlxuXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJy53YXJuaW5nJylcblx0XHRzdHlsZS5vdXRsaW5lPVwiMXB4IHllbGxvdyBzb2xpZFwiXG5cdFx0dGhpcy5jb252ZXJ0U3R5bGUoKVxuXHR9XG5cdFxuXHRjb252ZXJ0U3R5bGUoKXtcblx0XHR2YXIgYmdTdHlsZT10aGlzLndvcmRNb2RlbC5nZXRCYWNrZ3JvdW5kU3R5bGUoKVxuXHRcdGlmKCFiZ1N0eWxlKVxuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0dmFyIHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCdzZWN0aW9uJylcblx0XHRzd2l0Y2godHlwZW9mIGJnU3R5bGUpe1xuXHRcdGNhc2UgJ29iamVjdCc6Ly8gZmlsbFxuXHRcdFx0Y29uc29sZS53YXJuKCdub3Qgc3VwcG9ydCBmaWxsIGNvbG9yIG9uIGRvY3VtZW50IGJhY2tncm91bmQgeWV0Jylcblx0XHRicmVha1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRzdHlsZS5iYWNrZ3JvdW5kQ29sb3I9YmdTdHlsZVxuXHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQqIG9wdDoge1xuXHQqIFx0dGVtcGxhdGU6IGZ1bmN0aW9uKHN0eWxlLCBodG1sLCBwcm9wcyl7IHJldHVybiAoaHRtbCl9LFxuXHRcdGV4dGVuZFNjcmlwdDogXCJodHRwOi8vYS5jb20vYS5qc1wiXG5cdFx0fVxuXHQqL1xuXHR0b1N0cmluZyhvcHQpe1xuXHRcdHJldHVybiB0aGlzLmRvYy50b1N0cmluZyhvcHQsdGhpcy5wcm9wcylcblx0fVxuXHRyZWxlYXNlKCl7XG5cdFx0dGhpcy5kb2MucmVsZWFzZSgpXG5cdH1cblx0YXNaaXAob3B0KXtcblx0XHRyZXR1cm4gdGhpcy5kb2MuYXNaaXAob3B0LHRoaXMucHJvcHMpXG5cdH1cblx0ZG93bmxvYWQob3B0KXtcblx0XHRyZXR1cm4gdGhpcy5kb2MuZG93bmxvYWQob3B0LCB0aGlzLnByb3BzKVxuXHR9XG5cdC8qKlxuXHQqIG9wdD1leHRlbmQodG9TdHJpbmcub3B0LHtcblx0XHRzYXZlSW1hZ2U6IGZ1bmN0aW9uKGFycmF5QnVmZmVyLCBkb2MucHJvcHMpOiBwcm9taXNlKHVybCkge30sXG5cdFx0c2F2ZUh0bWw6IGZ1bmN0aW9uKCl7fVxuXHR9KVxuXHQqL1xuXHRzYXZlIChvcHQpe1xuXHRcdHJldHVybiB0aGlzLmRvYy5zYXZlKG9wdCwgdGhpcy5wcm9wcylcblx0fVxuXG5cdHN0YXRpYyBjcmVhdGUob3B0KXtcblx0XHR2YXIgc2VsZkNvbnZlcnRlcj10aGlzXG5cdFx0cmV0dXJuIChmdW5jdGlvbihkb2N1bWVudCl7XG5cdFx0XHR2YXIgZG9jPShmdW5jdGlvbiBicm93c2VyRG9jKCl7XG5cdFx0XHRcdHZhciB1aWQ9MDtcblx0XHRcdFx0dmFyIHJvb3Q9T2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSx7XG5cdFx0XHRcdFx0aWQgOiBcIkFcIixcblx0XHRcdFx0XHRzZWN0aW9uOiBudWxsLFxuXHRcdFx0XHRcdGNyZWF0ZUVsZW1lbnQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChkb2N1bWVudCksXG5cdFx0XHRcdFx0Y3JlYXRlVGV4dE5vZGU6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlLmJpbmQoZG9jdW1lbnQpLFxuXHRcdFx0XHRcdGNyZWF0ZVN0eWxlU2hlZXQoKXtcblx0XHRcdFx0XHRcdGlmKHRoaXMuc3R5bGVzaGVldClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuc3R5bGVzaGVldDtcblx0XHRcdFx0XHRcdHZhciBlbFN0eWxlPXRoaXMuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuXHRcdFx0XHRcdFx0dGhpcy5ib2R5LmFwcGVuZENoaWxkKGVsU3R5bGUsbnVsbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zdHlsZXNoZWV0PWVsU3R5bGUuc2hlZXRcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGdldFN0eWxlVGV4dCgpe1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlcz1bXVxuXHRcdFx0XHRcdFx0Zm9yKHZhciBpPTAsIHJ1bGVzPXRoaXMuc3R5bGVzaGVldC5jc3NSdWxlcywgbGVuPXJ1bGVzLmxlbmd0aDtpPGxlbjtpKyspXG5cdFx0XHRcdFx0XHRcdHN0eWxlcy5wdXNoKHJ1bGVzW2ldLmNzc1RleHQpXG5cdFx0XHRcdFx0XHRyZXR1cm4gc3R5bGVzLmpvaW4oJ1xcclxcbicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR1aWQoKXtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmlkKyh1aWQrKylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRvU3RyaW5nKG9wdCwgcHJvcHM9c2VsZkNvbnZlcnRlci5wcm9wcyl7XG5cdFx0XHRcdFx0XHRpZihvcHQgJiYgdHlwZW9mIG9wdC50ZW1wbGF0ZSE9XCJ1bmRlZmluZWRcIiAmJiAkLmlzRnVuY3Rpb24ob3B0LnRlbXBsYXRlKSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdC50ZW1wbGF0ZSh0aGlzLmdldFN0eWxlVGV4dCgpLCB0aGlzLl9odG1sKCksIHByb3BzKVxuXHRcdFx0XHRcdFx0dmFyIGh0bWw9Wyc8IWRvY3R5cGUgaHRtbD5cXHJcXG48aHRtbD48aGVhZD48bWV0YSBjaGFyc2V0PXV0Zi04PjxtZXRhIGtleT1cImdlbmVyYXRvclwiIHZhbHVlPVwiZG9jeDJodG1sXCI+PHRpdGxlPicrKHByb3BzLm5hbWV8fCcnKSsnPC90aXRsZT48c3R5bGU+J11cblx0XHRcdFx0XHRcdGh0bWwucHVzaCh0aGlzLmdldFN0eWxlVGV4dCgpKVxuXHRcdFx0XHRcdFx0aHRtbC5wdXNoKCc8L3N0eWxlPjwvaGVhZD48Ym9keT4nKVxuXHRcdFx0XHRcdFx0aHRtbC5wdXNoKHRoaXMuX2h0bWwoKSlcblx0XHRcdFx0XHRcdG9wdCAmJiBvcHQuZXh0ZW5kU2NyaXB0ICYmIGh0bWwucHVzaCgnPHNjcmlwdCBzcmM9XCInK29wdC5leHRlbmRTY3JpcHQrJ1wiPjwvc2NyaXB0PicpXG5cdFx0XHRcdFx0XHRodG1sLnB1c2goJzwvYm9keT48aHRtbD4nKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGh0bWwuam9pbignXFxyXFxuJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF9odG1sKCl7XG5cdFx0XHRcdFx0XHR2YXIgZGl2cz10aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoJ3A+ZGl2LCBzcGFuPmRpdicpXG5cdFx0XHRcdFx0XHRpZihkaXZzLmxlbmd0aD09MClcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMub3V0ZXJIVE1MXG5cblx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0KiBpbGxlZ2FsIDxwPiA8ZGl2Lz4gPC9wPlxuXHRcdFx0XHRcdFx0KiBET00gb3BlcmF0aW9uIGRpcmVjdGx5IGluIG9ubG9hZFxuXHRcdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdHZhciBkaXZjb250YWluZXI9ZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCB1aWQ9MFxuXHRcdFx0XHRcdFx0ZGl2Y29udGFpbmVyLmlkPSdkaXZjb250YWluZXInXG5cdFx0XHRcdFx0XHRkaXZjb250YWluZXIuc3R5bGUuZGlzcGxheT1cIm5vbmVcIlxuXHRcdFx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZChkaXZjb250YWluZXIpXG5cdFx0XHRcdFx0XHRmb3IodmFyIGk9ZGl2cy5sZW5ndGgtMTtpPi0xO2ktLSl7XG5cdFx0XHRcdFx0XHRcdHZhciBkaXY9ZGl2c1tpXSxcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnQ9ZGl2LnBhcmVudE5vZGU7XG5cblx0XHRcdFx0XHRcdFx0aWYoIWRpdi5pZClcblx0XHRcdFx0XHRcdFx0XHRkaXYuaWQ9J196JysoKyt1aWQpXG5cblx0XHRcdFx0XHRcdFx0aWYoIXBhcmVudC5pZClcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnQuaWQ9J195Jyt1aWRcblxuXHRcdFx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXBhcmVudCcscGFyZW50LmlkKVxuXHRcdFx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JyxpbmRleE9mKGRpdixwYXJlbnQuY2hpbGROb2RlcykpXG5cblx0XHRcdFx0XHRcdFx0ZGl2Y29udGFpbmVyLmFwcGVuZENoaWxkKGRpdnNbaV0pXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBodG1sPXRoaXMub3V0ZXJIVE1MKydcXG5cXHI8c2NyaXB0PignK3RoaXMuX3RyYW5zZm9ybWVyLnRvU3RyaW5nKCkrJykoKTs8L3NjcmlwdD4nXG5cdFx0XHRcdFx0XHR0aGlzLl90cmFuc2Zvcm1lcigpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGh0bWxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF90cmFuc2Zvcm1lcigpe1xuXHRcdFx0XHRcdFx0dmFyIGE9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpdmNvbnRhaW5lcicpXG5cdFx0XHRcdFx0XHRmb3IodmFyIGRpdnM9YS5jaGlsZE5vZGVzLCBpPWRpdnMubGVuZ3RoLTE7aT4tMTtpLS0pe1xuXHRcdFx0XHRcdFx0XHR2YXIgZGl2PWRpdnNbaV0sXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ9ZGl2LmdldEF0dHJpYnV0ZSgnZGF0YS1wYXJlbnQnKSxcblx0XHRcdFx0XHRcdFx0XHRpbmRleD1wYXJzZUludChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JykpLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJytwYXJlbnRJZCk7XG5cdFx0XHRcdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoZGl2LHBhcmVudC5jaGlsZE5vZGVzW2luZGV4XSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gaW5kZXhPZihlbCwgZWxzKXtcblx0XHRcdFx0XHRmb3IodmFyIGk9ZWxzLmxlbmd0aC0xO2k+MDtpLS0pXG5cdFx0XHRcdFx0XHRpZihlbD09ZWxzW2ldKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaVxuXHRcdFx0XHRcdHJldHVybiAwXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQob3B0ICYmIG9wdC5jb250YWluZXIgfHwgZG9jdW1lbnQuYm9keSkuYXBwZW5kQ2hpbGQocm9vdCk7XG5cdFx0XHRcdHJvb3QuYm9keT1yb290XG5cdFx0XHRcdHJldHVybiByb290XG5cdFx0XHR9KSgpO1xuXG5cdFx0XHRyZXR1cm4gKGZ1bmN0aW9uIG1peGluKGRvYyl7XG5cdFx0XHRcdHZhciBzdHlsZXNoZWV0PWRvYy5jcmVhdGVTdHlsZVNoZWV0KClcblx0XHRcdFx0dmFyIHJlbFN0eWxlcz17fSwgc3R5bGVzPXt9XG5cblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc2VsZkNvbnZlcnRlclskLmlzTm9kZSA/ICdub2RlZnknIDogJ2Jyb3dzZXJpZnknXShkb2Msc3R5bGVzaGVldCwgb3B0KSx7XG5cdFx0XHRcdFx0Y3JlYXRlU3R5bGUoc2VsZWN0b3Ipe1xuXHRcdFx0XHRcdFx0aWYoc3R5bGVzW3NlbGVjdG9yXSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN0eWxlc1tzZWxlY3Rvcl1cblx0XHRcdFx0XHRcdHZhciBydWxlcz1zdHlsZXNoZWV0LmNzc1J1bGVzLGxlbj1ydWxlcy5sZW5ndGhcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3Rvci5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbihhKXtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhLnRyaW0oKVswXT09JyMnID8gYSA6ICcjJyt0aGlzLmlkKycgJythXG5cdFx0XHRcdFx0XHRcdFx0fS5iaW5kKHRoaXMpKS5qb2luKCcsJykrJ3t9JyxsZW4pXG5cdFx0XHRcdFx0XHRcdHJldHVybiAgc3R5bGVzW3NlbGVjdG9yXT1zdHlsZXNoZWV0LmNzc1J1bGVzW2xlbl0uc3R5bGVcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coc2VsZWN0b3IgKyAn6Kej5p6Q5aSx6LSlJyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdHlsZXNbc2VsZWN0b3JdPVwiXCJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0eWxlUGF0aChhLCBwYXJlbnQpe1xuXHRcdFx0XHRcdFx0aWYocGFyZW50KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVsU3R5bGVzW2FdPXBhcmVudFxuXHRcdFx0XHRcdFx0dmFyIHBhdGhzPVthXSxwYXJlbnQ9YVxuXHRcdFx0XHRcdFx0d2hpbGUocGFyZW50PXJlbFN0eWxlc1twYXJlbnRdKVxuXHRcdFx0XHRcdFx0XHRwYXRocy51bnNoaWZ0KHBhcmVudClcblx0XHRcdFx0XHRcdHJldHVybiBwYXRocy5qb2luKCcgJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlbGVhc2UoKXtcblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLnNlY3Rpb25cblx0XHRcdFx0XHRcdHRoaXMuX3JlbGVhc2UoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH0pKGRvYylcblx0XHR9KSgkLmlzTm9kZSA/IGNyZWF0ZURvY3VtZW50KCkgOiBkb2N1bWVudClcblx0fVxuXG5cdHN0YXRpYyBub2RlZnkoZG9jLCBzdHlsZXNoZWV0LCBvcHQpe1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGRvYyx7XG5cdFx0XHRfcmVsZWFzZSgpe1xuXG5cdFx0XHR9LFxuXHRcdFx0YXNJbWFnZVVSTChidWZmZXIpe1xuXHRcdFx0XHRpZihvcHQgJiYgdHlwZW9mKG9wdC5hc0ltYWdlVVJMKSE9J3VuZGVmaW5lZCcpXG5cdFx0XHRcdFx0cmV0dXJuIG9wdC5hc0ltYWdlVVJMKGJ1ZmZlcilcblx0XHRcdFx0cmV0dXJuIFwiaW1hZ2U6Ly9ub3RzdXBwb3J0XCJcblx0XHRcdH0sXG5cdFx0XHRhc1ppcCgpe1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0Jylcblx0XHRcdH0sXG5cdFx0XHRkb3dubG9hZCgpe1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0Jylcblx0XHRcdH0sXG5cdFx0XHRzYXZlKCl7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm90IHN1cHBvcnQnKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXHRzdGF0aWMgYnJvd3NlcmlmeShkb2MsIHN0eWxlc2hlZXQsIG9wdCl7XG5cdFx0dmFyIFByb3RvX0Jsb2I9KGZ1bmN0aW9uKGEpe1xuXHRcdFx0XHRhPVVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoKSkuc3BsaXQoJy8nKTtcblx0XHRcdFx0YS5wb3AoKTtcblx0XHRcdFx0cmV0dXJuIGEuam9pbignLycpXG5cdFx0XHR9KSgpLFxuXHRcdFx0UmVnX1Byb3RvX0Jsb2I9bmV3IFJlZ0V4cChQcm90b19CbG9iK1wiLyhbXFxcXHdcXFxcZC1dKylcIixcImdpXCIpO1xuXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jLHtcblx0XHRcdGFzWmlwKG9wdCwgcHJvcHMpe1xuXHRcdFx0XHR2YXIgemlwPW5ldyBKU1ppcCgpLGhhc0ltYWdlPWZhbHNlO1xuXHRcdFx0XHR2YXIgZj16aXAuZm9sZGVyKCdpbWFnZXMnKVxuXHRcdFx0XHRPYmplY3Qua2V5cyh0aGlzLmltYWdlcykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0XHRcdFx0XHRoYXNJbWFnZT10cnVlXG5cdFx0XHRcdFx0Zi5maWxlKGEuc3BsaXQoJy8nKS5wb3AoKSx0aGlzW2FdKVxuXHRcdFx0XHR9LHRoaXMuaW1hZ2VzKVxuXHRcdFx0XHR6aXAuZmlsZSgncHJvcHMuanNvbicsSlNPTi5zdHJpbmdpZnkocHJvcHMpKTtcblx0XHRcdFx0emlwLmZpbGUoJ21haW4uaHRtbCcsaGFzSW1hZ2UgPyB0aGlzLnRvU3RyaW5nKG9wdCkucmVwbGFjZShQcm90b19CbG9iLCdpbWFnZXMnKSA6IHRoaXMudG9TdHJpbmcoKSlcblx0XHRcdFx0cmV0dXJuIHppcFxuXHRcdFx0fSxcblx0XHRcdGRvd25sb2FkKG9wdCwgcHJvcHMpe1xuXHRcdFx0XHR2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpXG5cdFx0XHRcdGEuaHJlZj1VUkwuY3JlYXRlT2JqZWN0VVJMKHRoaXMuYXNaaXAob3B0LHByb3BzKS5nZW5lcmF0ZSh7dHlwZTonYmxvYid9KSlcblx0XHRcdFx0YS5kb3dubG9hZD0ocHJvcHMubmFtZXx8XCJkb2N1bWVudFwiKSsnLnppcCdcblx0XHRcdFx0YS5jbGljaygpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoYS5ocmVmKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpXG5cdFx0XHR9LFxuXHRcdFx0c2F2ZShvcHQsIHByb3BzKXtcblx0XHRcdFx0dmFyIGhhc0ltYWdlPWZhbHNlLCBpbWFnZXM9e30sIG1lPXRoaXM7XG5cdFx0XHRcdHJldHVybiAkLkRlZmVycmVkLndoZW4oKHRoaXMuaW1hZ2VzICYmIE9iamVjdC5rZXlzKHRoaXMuaW1hZ2VzKXx8W10pLm1hcChmdW5jdGlvbihhKXtcblx0XHRcdFx0XHRoYXNJbWFnZT10cnVlXG5cdFx0XHRcdFx0cmV0dXJuIG9wdC5zYXZlSW1hZ2UodGhpc1thXSxwcm9wcylcblx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVybCl7cmV0dXJuIGltYWdlc1thXT11cmx9KVxuXHRcdFx0XHR9LHRoaXMuaW1hZ2VzKSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaHRtbD1tZS50b1N0cmluZyhvcHQsIHByb3BzKTtcblx0XHRcdFx0XHRpZihoYXNJbWFnZSlcblx0XHRcdFx0XHRcdGh0bWw9aHRtbC5yZXBsYWNlKFJlZ19Qcm90b19CbG9iLGZ1bmN0aW9uKGEsaWQpe3JldHVybiBpbWFnZXNbYV19KTtcblx0XHRcdFx0XHRyZXR1cm4gb3B0LnNhdmVIdG1sKGh0bWwsIHByb3BzKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSxcblx0XHRcdGltYWdlczp7fSxcblx0XHRcdGFzSW1hZ2VVUkwoYXJyYXlCdWZmZXIpe1xuXHRcdFx0XHR2YXIgdXJsPVVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2FycmF5QnVmZmVyXSxcblx0XHRcdFx0XHR7dHlwZTpcImltYWdlL1wiKyh0eXBlb2YoYXJyYXlCdWZmZXIpPT0nc3RyaW5nJyA/ICdzdmcreG1sJyA6ICcqJyl9KSk7XG5cdFx0XHRcdHRoaXMuaW1hZ2VzW3VybF09YXJyYXlCdWZmZXJcblx0XHRcdFx0cmV0dXJuIHVybFxuXHRcdFx0fSxcblx0XHRcdF9yZWxlYXNlKCl7XG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMuaW1hZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uKGIpe1xuXHRcdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoYilcblx0XHRcdFx0fSlcblx0XHRcdFx0ZGVsZXRlIHRoaXMuaW1hZ2VzXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG4oZnVuY3Rpb24oaXNOb2RlLCBtKXtcblx0aWYoIWlzTm9kZSlcdHJldHVybjtcblxuXHRjcmVhdGVEb2N1bWVudD1yZXF1aXJlKG0pLmpzZG9tXG5cdGxldCB3aW5kb3c9Y3JlYXRlRG9jdW1lbnQoKS5kZWZhdWx0Vmlld1xuXG5cdGdsb2JhbC5idG9hPXdpbmRvdy5idG9hXG5cdENTU1N0eWxlRGVjbGFyYXRpb249d2luZG93LkNTU1N0eWxlRGVjbGFyYXRpb25cbn0pKCQuaXNOb2RlLCBcImpzZG9tXCIpXG4iXX0=