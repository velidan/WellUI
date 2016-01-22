(function (root) {
    'use strict';


    /**
     * to Array polyfill
     */
    if (!(Array.hasOwnProperty('toArray'))) {
        Array.toArray = toArray;
    }

    function toArray(elList) {
        var result = [],
            i;

        for (i = 0; i < elList.length; ++i) {
            result.push(elList[i]);
        }

        return result;

    }

    /**
     * Make Lib methods storage
     */
    function WellUI(elem) {
        var self = this;

        Object.defineProperty(self, 'elem', {
            get: function () {
                return elem;
            }
        });
    }

    /*  --- methods ---  */

    /**
     * Get array of elements
     * @param selector {String} -> Css class for a querySelector
     * @param [searchContext] {String} -> Search context
     * @returns {Array}
     */
    WellUI.getElemsArr = function (selector, searchContext) {

        var elemList,
            i;
        if (typeof selector === 'object') {
            elemList = selector;
        } else {
            if (!searchContext) {
                try {
                    elemList = document.querySelectorAll(selector);
                } catch (e) {
                    console.trace();
                }

            } else {
                if (Array.isArray(searchContext)) {
                    for (i in searchContext) {
                        if (searchContext.hasOwnProperty(i)) {
                            elemList = searchContext[i].querySelectorAll(selector);
                        }
                    }
                } else {
                    try {
                        elemList = searchContext.querySelectorAll(selector);
                    } catch (ex) {
                        console.trace();
                        console.log(ex);
                    }
                }
            }
        }
        return Array.toArray(elemList);


    };
    /**
     * Operations with elements. If 3 parameter is not set - works like forEach,
        if  set - bing operations to one event or multiple events
     * @param elemsArray {Array} -> Elements Array to operate
     * @param callback {Function} -> callback function
     * @param [eventsName] {String} -> Event name. Can be one event name like "click" or multiple,
     *                                 written in format ['click', 'mouseover']
     */
    WellUI.operateElems = function (elemsArray, callback, eventsName) {
        var elemsArrayLength = elemsArray.length, counter,
            localEventName = eventsName || null,
            emptyEvent,
            eventName;

        switch (typeof localEventName) {
        case 'object':
            emptyEvent = true;
            for (eventName in localEventName) {
                if (localEventName.hasOwnProperty(eventName)) {
                    core(eventsName[eventName]);
                    emptyEvent = false;
                }
            }

            if (emptyEvent) {
                core(localEventName);
            }

            break;
        case 'string':
            core(localEventName);

            break;

        default:
            console.log("incorrect event argument");
        }
        /**
        *  set event handler
         * @param finEventName -> event Name
         */
        function core(finEventName) {
            for (counter = 0; counter < elemsArrayLength; ++counter) {
                if (elemsArray[counter] !== null) {
                    if (localEventName !== null) {
                        elemsArray[counter].addEventListener(finEventName, callback);
                    } else {
                        callback.call(elemsArray[counter]);
                    }
                }
            }
        }

    };
    /**
     * Multiple add css - rule to element
     * @param element {Object} -> Object for styles add
     * @param propertyObject {Object} -> Object with css rules
     */
    WellUI.setStyles = function (element, propertyObject) {
        var property;
        for (property in propertyObject) {
            if (propertyObject.hasOwnProperty(property)) {
                if (element !== null) {
                    element.style[property] = propertyObject[property];
                }
            }
        }
    };

    /**
     * Get content height in some element
     * @param childsArr {Array} -> child nodes array
     * @returns {Number} -> height sum of all children
     */
    WellUI.getContentHeight = function (childsArr) {
        var elemsArrLength = childsArr.length,
            totalContentHeight = 0,
            cssRules,
            i;
        for (i = 0; i < elemsArrLength; ++i) {
            if (childsArr[i].nodeType !== 3) {
                cssRules = getComputedStyle(childsArr[i]);
                if (childsArr[i].offsetHeight) {
                    totalContentHeight = childsArr[i].offsetHeight + totalContentHeight;
                }
                totalContentHeight += parseInt(cssRules.marginTop.replace(/px/, ''), 10) + parseInt(cssRules.marginBottom.replace(/px/, ''), 10);
            }
        }
        return totalContentHeight;
    };

    /**
     * Get margin sum of an elements
     * @param elemsArr {Array} -> Array of content elements
     * @returns {number} -> margin sum of child nodes
     */
    WellUI.getContentMargin = function (elemsArr) {
        var elemsArrLength = elemsArr.length,
            marginValue = 0,
            currentMargin,
            cssRules,
            i;

        for (i = 0; i < elemsArrLength; ++i) {
            if (elemsArr[i].nodeType !== 3) {
                cssRules = getComputedStyle(elemsArr[i]);
                currentMargin = Math.max(parseInt(cssRules.marginTop.replace(/px/, ''), 10), parseInt(cssRules.marginBottom.replace(/px/, ''), 10));
                if (marginValue < currentMargin) {
                    marginValue = currentMargin;
                }
            }
        }
        return marginValue;
    };

    /**
     * blank for slide animation
     * @param elem [Object] ->  element for operate
     * @param options [Object] ->  animation config
     * @param callback [function] -> callback function
     */
    WellUI.slideDown = function (elem, options,  callback) {

    };

    /**
     * fade out animation
     * @param elem {HTMLElement} ->  element for operate
     * @param [options] {Object} ->  animation config
         duration {Int} {Default value| 1}  -> animation duration
         timing {String} {Default value| ease-in} -> animation timing function
         callback {function} {Default value| null} -> callback function
     */
    WellUI.fadeOut = function (elem, options) {
        var defaults = {
                duration: 1,
                timing : 'ease-in',
                callback : null
            },
            config = this.extend({}, defaults, options),
            initialOpacity = getComputedStyle(elem, null).opacity;

        this.setStyles(elem, {
            transition: 'opacity ' + config.duration + 's ' + config.timing,
            opacity: initialOpacity
        });

        elem.style.opacity = 0;
        if (config.callback) {
            this.transitionEndCallback(elem, config.callback);

        }
    };

    /**
     * fade in animation
     * @param elem {HTMLElement} ->  element for operate
     * @param [options] {Object} ->  animation config
     duration {Int} {Default value| 1}  -> animation duration
     timing {String} {Default value| ease-out} -> animation timing function
     callback {function} {Default value| null} -> callback function
     */
    WellUI.fadeIn = function (elem, options) {
        var WellUI_lib = this,
            defaults = {
                duration: '1',
                timing : 'ease-out',
                callback : null
            },
            config = WellUI.extend({}, defaults, options),
            initialOpacity = getComputedStyle(elem, null).opacity;

        if (+initialOpacity !== 0) {initialOpacity = 0}
        elem.style.opacity = initialOpacity;

        setTimeout(function () {
            WellUI_lib.setStyles(elem, {
                transition: 'opacity ' + config.duration + 's ' + config.timing,
                opacity: 1
            });
        }, 17);


        if (config.callback) {
            this.transitionEndCallback(elem, config.callback);

        }
    };

    /**
     * Check when transition is ended, fire callback and remove itself listener
     * @param elem {HTMLElement} -> operated element
     * @param callback {Function} -> callback function
     */
    WellUI.transitionEndCallback = function (elem, callback) {
        var WellUI_lib = this;

        elem.addEventListener(this.getTransitionEndEventName(), function anonymous() {
            elem.removeEventListener(WellUI_lib.getTransitionEndEventName(), anonymous);
            callback.apply(elem);
        });


    };
    /**
     * Search parent element that matched to class name
     * @param elem (HTMLElement) -> The element from which the search begins
     * @param parentClass (string) -> parent element with class name that we looking for
     * @returns {*} if nothing found, returning null
     * @constructor
     */
    WellUI.searchParentByClassName = function (elem, parentClass) {
        var localElem = elem,
            clearedParentClass = parentClass.replace(/^\./, '');

        while (localElem.parentNode && localElem.nodeName.toLowerCase() !== 'html') {
            if (localElem.parentNode.classList.contains(clearedParentClass)) {
                return localElem.parentNode;
            }
            localElem = localElem.parentNode;
        }
        return null;
    };

    /**
     * Improved stopPropagation without bubble stopping.
     * Set property to event object and than we can check - if we want to do something width this event or not
         set property to event Object,
             set: @param e {Event} -> event that we want to keep
         set event listener to element and than set property to event Object
            addAndKepEvent: @param element {HTMLElement} -> handled element
                            @param eventName {String} -> event that we add to element add keep them
     */
    WellUI.holdEvent = function () {
        var holdMarkName = "wellHoldEvent";
        return {
            set: function (e) {
                if (e) {
                    e[holdMarkName] = true;
                } else {
                    console.log('Event Object is not passed');
                    console.trace();
                }
            },
            addAndKeppEvent: function (element, eventName) {
                element.addEventListener(eventName, function (e) {
                    e.wellHoldEvent = true;
                });
            },
            getHoldMarkName : function () {
                return holdMarkName;
            }
        };
    };


    /**
     * Get the name of current transitionEnd Event
     * @returns {String} -> name of current transition end event
     */
    WellUI.getTransitionEndEventName = function () {
        var t,
            el = document.createElement("fakeelement"),
            transitions = {
                "transition"      : "transitionend",
                "OTransition"     : "oTransitionEnd",
                "MozTransition"   : "transitionend",
                "WebkitTransition": "webkitTransitionEnd"
            };

        for (t in transitions) {
            if (transitions.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
    };

    /**
     * Extends object by another object
     * (like default conf replaced by the custom if custom passed, or use default)
     * @param base {Object} -> empty temp object
     * @param defaultConfObj {Object} - object with default config
     * @param customConfObj {Object} - object with custom config that we want to extend
     * @returns {*}
     */
    WellUI.extend = function (base, defaultConfObj, customConfObj) {
        var i,
            key;
        for (i = 1; i < arguments.length; i++) {
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    base[key] = arguments[i][key];
                }
            }
        }
        return base;
    };

    root.WellUI = WellUI;
}(window));