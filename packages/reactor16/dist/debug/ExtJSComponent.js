import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import ReactDOM from 'react-dom';
import { l } from './index';
import React from 'react';
import { Component, Children, cloneElement } from 'react';
import EXTRenderer from './ReactEXT.js';
import union from 'lodash.union';
import isEqual from 'lodash.isequal';
import capitalize from 'lodash.capitalize';
import cloneDeepWith from 'lodash.clonedeepwith';

export var ExtJSComponent = function (_Component) {
    _inherits(ExtJSComponent, _Component);

    function ExtJSComponent(element) {
        _classCallCheck(this, ExtJSComponent);

        var _this = _possibleConstructorReturn(this, _Component.call(this, element));

        _this.cmp = null;
        _this.el = null;

        _this.reactProps = {};
        _this.reactChildren = {};
        _this.reactElement = {};
        _this._getReactStuff(element);

        var config = _this._getConfig();
        _this.cmp = new _this.extJSClass(config);
        _this.cmp.$createdByReactor = true;

        // if (Ext.isClassic) {
        //   this.cmp.on('resize', () => this.cmp && this.cmp.updateLayout());
        //   this.el = this.cmp.el.dom;
        // } else {
        //   this.el = this.cmp.renderElement.dom;
        // }
        //this.cmp.$reactorComponentName = componentName;
        l('in ExtJSComponent constructor for ' + _this.target + ', Ext.create ' + _this.xtype, config);
        return _this;
    }

    ExtJSComponent.prototype.componentWillMount = function componentWillMount() {
        l('componentWillMount ' + this.target, this);
    };

    ExtJSComponent.prototype.componentDidMount = function componentDidMount() {
        l('componentDidMount ' + this.target, this);

        l('call EXTRenderer.createContainer for ' + this.target + ', (cmp)', this.cmp);
        this._mountNode = EXTRenderer.createContainer(this.cmp);
        l('call EXTRenderer.updateContainer for ' + this.target + ', (children)', this.reactChildren);
        EXTRenderer.updateContainer(this.reactChildren, this._mountNode, this);
    };

    ExtJSComponent.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        l('componentDidUpdate');
        if (this.isRootContainer) {
            EXTRenderer.updateContainer(this.reactChildren, this._mountNode, this);
        }
    };

    ExtJSComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        l('componentWillUnmount');
        EXTRenderer.updateContainer(null, this._mountNode, this);
    };

    ExtJSComponent.prototype.render = function render() {
        l('render');
        return null;
    };

    ExtJSComponent.prototype._getReactStuff = function _getReactStuff(element) {
        /*******reactElement */
        if (element.children == undefined || element.children == false) {
            for (var prop in element) {
                if (prop != 'children') {
                    this.reactProps[prop] = element[prop];
                }
            }
        } else {
            this.reactChildren = element.children;
            if (element.props == undefined) {
                for (var prop in element) {
                    if (prop != 'children') {
                        this.reactProps[prop] = element[prop];
                    }
                }
            } else {
                this.reactProps = element.props;
            }
        }
        //    l(`element`, element)
        //    l(`reactProps`, this.reactProps)
        //    l(`reactChildren`, this.reactChildren)
        this.reactElement.props = this.reactProps;
        this.reactElement.children = this.reactChildren;
        //    l(`reactElement`, this.reactElement)
        /*******reactElement */
    };

    ExtJSComponent.prototype._getConfig = function _getConfig() {
        var config = {};
        config.xtype = this.xtype;
        var props = this.reactProps;
        for (var key in props) {
            //if (key == 'defaults') { debugger }
            if (key.substr(0, 2) === 'on') {
                var event = key.substr(2).toLowerCase();
                if (config.listeners == undefined) {
                    config.listeners = {};
                }
                config.listeners[event] = props[key];
                //MetaData
            } else {
                config[key] = props[key];
                //MetaData
            }
        }
        // if (config['cls'] != undefined) {
        //   config['cls'] = config['cls'] + ' ' + 'XR' + this.xtype
        // }
        // else {
        //   config['cls'] = 'XR' + this.xtype
        // }
        if (config['className'] != undefined) {
            config['cls'] = config['cls'] + ' ' + config['className'];
        }
        this._ensureResponsivePlugin(config);

        if (this.isRootContainer) {
            if (config['layout'] == undefined) {
                config['layout'] = 'fit';
                if (config['cls'] != undefined) {
                    config['cls'] = config['cls'] + ' ' + 'ExtReactRoot';
                } else {
                    config['cls'] = 'ExtReactRoot';
                }
            }
            if (Ext.isClassic) {
                config['height'] = '100%';
                config['width'] = '100%';
                var root = document.getElementsByClassName('reactroot')[0];
                config.renderTo = root;
            } else {
                config['fullscreen'] = true;
                var root = document.getElementsByClassName('x-viewport-body-el')[0];
                config.renderTo = root;
            }
            this.extJSConfig = config;
        }
        return config;
    };

    ExtJSComponent.prototype._ensureResponsivePlugin = function _ensureResponsivePlugin(config) {
        if (config.responsiveConfig) {
            var plugins = config.plugins;


            if (plugins == null) {
                config.plugins = 'responsive';
            } else if (Array.isArray(plugins) && plugins.indexOf('responsive') === -1) {
                plugins.push('responsive');
            } else if (typeof plugins === 'string') {
                if (plugins !== 'responsive') {
                    config.plugins = [plugins, 'responsive'];
                }
            } else if (!plugins.resposive) {
                plugins.responsive = true;
            }
        }
    };

    /**
     * Returns the Ext JS component instance
     */


    ExtJSComponent.prototype.getHostNode = function getHostNode() {
        return this.el;
    };

    /**
     * Returns the Ext JS component instance
     */


    ExtJSComponent.prototype.getPublicInstance = function getPublicInstance() {
        return this.cmp;
    };

    // _renderRootComponent(renderToDOMNode, config) {
    //     defaults(config, {
    //         height: '100%',
    //         width: '100%'
    //     });

    //     config.renderTo = renderToDOMNode;

    //     this.cmp = this.createExtJSComponent(config);

    //     if (Ext.isClassic) {
    //         this.cmp.el.on('resize', () => this.cmp && this.cmp.updateLayout());
    //         this.el = this.cmp.el.dom;
    //     } else {
    //         this.el = this.cmp.renderElement.dom;
    //     }

    //     return { node: this.el, children: [] };
    // }

    ExtJSComponent.prototype._applyDefaults = function _applyDefaults(_ref) {
        var defaults = _ref.defaults,
            children = _ref.children;

        if (defaults) {
            return Children.map(children, function (child) {
                if (child.type.prototype instanceof ExtJSComponent) {
                    return cloneElement(child, _extends({}, defaults, child.props));
                } else {
                    return child;
                }
            });
        } else {
            return children;
        }
    };

    //   /**
    //    * Creates an Ext JS component config from react element props
    //    * @private
    //    */
    //   _createInitialConfig(element) {
    //       const { props } = this.reactElement;
    //       const config = this._createConfig(props, false);

    //       this._ensureResponsivePlugin(config);

    // //      const items = [], dockedItems = [];

    //       // if (children) {
    //       //     //const children = this.mountChildren(this._applyDefaults(props), transaction, context);
    //       //     //const children = props.children

    //       //     for (let i=0; i<children.length; i++) {
    //       //         const item = children[i];

    //       //         if (item instanceof Ext.Base) {
    //       //           console.log('should never get here...')
    //       //             const prop = this._propForChildElement(item);

    //       //             if (prop) {
    //       //                 item.$reactorConfig = true;
    //       //                 const value = config;

    //       //                 if (prop.array) {
    //       //                     let array = config[prop.name];
    //       //                     if (!array) array = config[prop.name] = [];
    //       //                     array.push(item);
    //       //                 } else {
    //       //                     config[prop.name] = prop.value || item;
    //       //                 }
    //       //             } else {
    //       //                 (item.dock ? dockedItems : items).push(item);
    //       //             }
    //       //         } else if (item.node) {
    //       //             items.push(wrapDOMElement(item));
    //       //         } else if (typeof item === 'string') {
    //       //             // will get here when rendering html elements in react-test-renderer
    //       //             // no need to do anything
    //       //         } else {
    //       //             throw new Error('Could not render child item: ' + item);
    //       //         }
    //       //     }
    //       // }

    //       // if (items.length) config.items = items;
    //       // if (dockedItems.length) config.dockedItems = dockedItems;

    //       return config;
    //   }

    /**
     * Determines whether a child element corresponds to a config or a container item based on the presence of a rel config or
     * matching other known relationships
     * @param {Ext.Base} item
     */


    ExtJSComponent.prototype._propForChildElement = function _propForChildElement(item) {
        if (item.config && item.config.rel) {
            if (typeof item.config.rel === 'string') {
                return { name: item.config.rel };
            } else {
                return item.config.rel;
            }
        }

        var extJSClass = this.extJSClass;


        if (isAssignableFrom(extJSClass, CLASS_CACHE.Button) && CLASS_CACHE.Menu && item instanceof CLASS_CACHE.Menu) {
            return { name: 'menu', array: false };
        } else if (isAssignableFrom(extJSClass, Ext.Component) && CLASS_CACHE.ToolTip && item instanceof CLASS_CACHE.ToolTip) {
            return { name: 'tooltip', array: false };
        } else if (CLASS_CACHE.Column && item instanceof CLASS_CACHE.Column) {
            return { name: 'columns', array: true };
        } else if (isAssignableFrom(extJSClass, CLASS_CACHE.Column) && CLASS_CACHE.CellBase && item instanceof CLASS_CACHE.CellBase) {
            return { name: 'cell', array: false, value: this._cloneConfig(item) };
        } else if (isAssignableFrom(extJSClass, CLASS_CACHE.WidgetCell)) {
            return { name: 'widget', array: false, value: this._cloneConfig(item) };
        } else if (isAssignableFrom(extJSClass, CLASS_CACHE.Dialog) && CLASS_CACHE.Button && item instanceof CLASS_CACHE.Button) {
            return { name: 'buttons', array: true };
        } else if (isAssignableFrom(extJSClass, CLASS_CACHE.Column) && CLASS_CACHE.Field && item instanceof CLASS_CACHE.Field) {
            return { name: 'editor', array: false, value: this._cloneConfig(item) };
        }
    };

    ExtJSComponent.prototype._cloneConfig = function _cloneConfig(item) {
        return _extends({}, item.initialConfig, { xclass: item.$className });
    };

    /**
     * If the propName corresponds to an event listener (starts with "on" followed by a capital letter), returns the name of the event.
     * @param {String} propName 
     * @param {String}
     */


    ExtJSComponent.prototype._eventNameForProp = function _eventNameForProp(propName) {
        if (propName.match(/^on[A-Z]/)) {
            return propName.slice(2).toLowerCase();
        } else {
            return null;
        }
    };

    /**
     * Creates an Ext config object for this specified props
     * @param {Object} props
     * @param {Boolean} [includeEvents] true to convert on* props to listeners, false to exclude them
     * @private
     */


    ExtJSComponent.prototype._createConfig = function _createConfig(props, includeEvents) {
        props = this._cloneProps(props);

        var config = {};
        config.xtype = this.xtype;

        if (includeEvents) config.listeners = {};

        for (var key in props) {
            if (props.hasOwnProperty(key)) {
                var value = props[key];
                var eventName = this._eventNameForProp(key);

                if (eventName) {
                    if (value && includeEvents) config.listeners[eventName] = value;
                } else if (key === 'config') {
                    _Object$assign(config, value);
                } else if (key !== 'children' && key !== 'defaults') {
                    config[key.replace(/className/, 'cls')] = value;
                }
            }
        }

        var extJSClass = this.extJSClass;

        //need this???
        // if (isAssignableFrom(extJSClass, CLASS_CACHE.Column) && typeof config.renderer === 'function' && CLASS_CACHE.RendererCell) {
        //     config.cell = config.cell || {};
        //     config.cell.xtype = 'renderercell';
        // }

        return config;
    };

    /**
     * Cloning props rather than passing them directly on as configs fixes issues where Ext JS mutates configs during
     * component initialization.  One example of this is grid columns get $initParent added when the grid initializes.
     * @param {Object} props
     * @private
     */


    ExtJSComponent.prototype._cloneProps = function _cloneProps(props) {
        debugger;
        return cloneDeepWith(props, function (value) {
            if (value instanceof Ext.Base || typeof value === 'function') {
                return value;
            }
        });
    };

    ExtJSComponent.prototype._rushProps = function _rushProps(oldProps, newProps) {
        debugger;
        var rushConfigs = this.extJSClass.__reactorUpdateConfigsBeforeChildren;
        if (!rushConfigs) return;
        var oldConfigs = {},
            newConfigs = {};

        for (var name in rushConfigs) {
            oldConfigs[name] = oldProps[name];
            newConfigs[name] = newProps[name];
        }

        this._applyProps(oldConfigs, newConfigs);
    };

    /**
     * Calls config setters for all react props that have changed
     * @private
     */


    ExtJSComponent.prototype._applyProps = function _applyProps(oldProps, props) {
        var keys = union(_Object$keys(oldProps), _Object$keys(props));

        for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
            var _ref2;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref2 = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref2 = _i.value;
            }

            var key = _ref2;

            var oldValue = oldProps[key],
                newValue = props[key];

            if (key === 'children') continue;

            if (!isEqual(oldValue, newValue)) {
                var eventName = this._eventNameForProp(key);

                if (eventName) {
                    this._replaceEvent(eventName, oldValue, newValue);
                } else {
                    var setter = this._setterFor(key);

                    if (setter) {
                        var value = this._cloneProps(newValue);
                        if (this.reactorSettings.debug) console.log(setter, newValue);
                        this.cmp[setter](value);
                    }
                }
            }
        }
    };

    /**
     * Detaches the old event listener and adds the new one.
     * @param {String} eventName 
     * @param {Function} oldHandler 
     * @param {Function} newHandler 
     */


    ExtJSComponent.prototype._replaceEvent = function _replaceEvent(eventName, oldHandler, newHandler) {
        debugger;
        if (oldHandler) {
            if (this.reactorSettings.debug) console.log('detaching old listener for ' + eventName);
            this.cmp.un(eventName, oldHandler);
        }

        if (this.reactorSettings.debug) console.log('attaching new listener for ' + eventName);
        this.cmp.on(eventName, newHandler);
    };

    /**
     * Returns the name of the setter method for a given prop.
     * @param {String} prop
     */


    ExtJSComponent.prototype._setterFor = function _setterFor(prop) {
        if (prop === 'className') {
            prop = 'cls';
        }
        var name = 'set' + this._capitalize(prop);
        return this.cmp[name] && name;
    };

    /**
     * Returns the name of a getter for a given prop.
     * @param {String} prop
     */


    ExtJSComponent.prototype._getterFor = function _getterFor(prop) {
        var name = 'get' + this._capitalize(prop);
        return this.cmp[name] && name;
    };

    /**
     * Capitalizes the first letter in the string
     * @param {String} str
     * @return {String}
     * @private
     */


    ExtJSComponent.prototype._capitalize = function _capitalize(str) {
        return capitalize(str[0]) + str.slice(1);
    };

    ExtJSComponent.prototype._precacheNode = function _precacheNode() {
        this._flags |= Flags.hasCachedChildNodes;

        if (this.el) {
            // will get here when rendering root component
            precacheNode(this, this.el);
        } else if (this.cmp.el) {
            this._doPrecacheNode();
        } else if (Ext.isClassic) {
            // we get here when rendering child components due to lazy rendering
            this.cmp.on('afterrender', this._doPrecacheNode, this, { single: true });
        }
    };

    ExtJSComponent.prototype._doPrecacheNode = function _doPrecacheNode() {
        this.el = this.cmp.el.dom;
        this.el._extCmp = this.cmp;
        precacheNode(this, this.el);
    };

    /**
     * Returns the child item at the given index, only counting those items which were created by Reactor
     * @param {Number} n
     */


    ExtJSComponent.prototype._toReactChildIndex = function _toReactChildIndex(n) {
        var items = this.cmp.items;

        if (!items) return n;
        if (items.items) items = items.items;

        var found = 0,
            i = void 0,
            item = void 0;

        for (i = 0; i < items.length; i++) {
            item = items[i];

            if (item.$createdByReactor && found++ === n) {
                return i;
            }
        }

        return i;
    };

    /**
     * Translates and index in props.children to an index within a config value that is an array.  Use
     * this to determine the position of an item in props.children within the array config to which it is mapped.
     * @param {*} prop
     * @param {*} indexInChildren
     */


    ExtJSComponent.prototype._toArrayConfigIndex = function _toArrayConfigIndex(prop, indexInChildren) {
        var _this2 = this;

        var i = 0,
            found = 0;

        Children.forEach(this.props.children, function (child) {
            var propForChild = _this2._propForChildElement(child);

            if (propForChild && propForChild.name === prop.name) {
                if (i === indexInChildren) return found;
                found++;
            }
        });

        return -1;
    };

    /**
     * Updates a config based on a child element
     * @param {Object} prop The prop descriptor (name and array)
     * @param {Ext.Base} value The value to set
     * @param {Number} [index] The index of the child element in props.children
     * @param {Boolean} [isArrayDelete=false] True if removing the item from an array
     */


    ExtJSComponent.prototype._mergeConfig = function _mergeConfig(prop, value, index, isArrayDelete) {
        var setter = this._setterFor(prop.name);
        if (!setter) return;

        if (value) value.$reactorConfig = true;

        if (prop.array) {
            var getter = this._getterFor(prop.name);
            if (!getter) return;

            var currentValue = this.cmp[getter]() || [];

            if (isArrayDelete) {
                // delete
                value = currentValue.filter(function (item) {
                    return item !== value;
                });
            } else if (index !== undefined) {
                // move
                value = currentValue.filter(function (item) {
                    return item !== value;
                });
                value = value.splice(this._toArrayConfigIndex(index, prop), 0, item);
            } else {
                // append
                value = currentValue.concat(value);
            }
        }

        if (this.reactorSettings.debug) console.log(setter, value);

        this.cmp[setter](value);
    };

    ExtJSComponent.prototype._ignoreChildrenOrder = function _ignoreChildrenOrder() {
        // maintaining order in certain components, like Transition's container, can cause problems with animations, _reactorIgnoreOrder gives us a way to opt out in such scenarios
        if (this.cmp._reactorIgnoreOrder) return true;

        // moving the main child of a container with layout fit causes it to disappear.  Instead we do nothing, which
        // should be ok because fit containers are not ordered
        if (CLASS_CACHE.FitLayout && this.cmp.layout instanceof CLASS_CACHE.FitLayout) return true;

        // When tab to the left of the active tab is removed, the left-most tab would always be selected as the tabs to the right are reinserted
        if (CLASS_CACHE.TabPanel && this.cmp instanceof CLASS_CACHE.TabPanel) return true;
    };

    return ExtJSComponent;
}(Component);

/**
 * Wraps a dom element in an Ext Component so it can be added as a child item to an Ext Container.  We attach
 * a reference to the generated Component to the dom element so it can be destroyed later if the dom element
 * is removed when rerendering
 * @param {Object} node A React node object with node, children, and text
 * @returns {Ext.Component}
 */
function wrapDOMElement(node) {
    debugger;
    var contentEl = node.node;

    var cmp = new Ext.Component({
        // We give the wrapper component a class so that developers can reset css 
        // properties (ex. box-sizing: context-box) for third party components.
        cls: 'x-react-element'
    });

    if (cmp.element) {
        // modern
        DOMLazyTree.insertTreeBefore(cmp.element.dom, node);
    } else {
        // classic
        var target = document.createElement('div');
        DOMLazyTree.insertTreeBefore(target, node);
        cmp.contentEl = contentEl instanceof HTMLElement ? contentEl : target /* text fragment or comment */;
    }

    cmp.$createdByReactor = true;
    contentEl._extCmp = cmp;

    // this is needed for devtools when using dangerouslyReplaceNodeWithMarkup
    // this not needed in fiber
    cmp.node = contentEl;

    return cmp;
}
//# sourceMappingURL=ExtJSComponent.js.map