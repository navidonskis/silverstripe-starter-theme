import {utils} from './core/utils';
import BaseModule from './modules/BaseModule'; // import your modules

window.app = {
    documentReady: false,
    instances: [],
    modules: [
        // clear this line and change within your modules.
        // Your module will be initialized when element have an attribute
        // example <div data-module="base"></div>.
        {name: 'base', class: BaseModule}
    ]
};

((funcName, baseObj) => {
    funcName = funcName || "documentReady";
    baseObj = baseObj || window;

    let readyList = [],
        readyFired = false,
        readyEventHandlersInstalled = false;

    function ready() {
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    baseObj[funcName] = (callback, context) => {
        if (typeof callback !== "function") {
            throw new TypeError("callback for documentReady(fn) must be a function");
        }

        if (readyFired) {
            setTimeout(function () {
                callback(context);
            }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }

        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };
})("documentReady", window);

documentReady(function () {
    if (!window.app.documentReady) {
        window.app.documentReady = true;
        global._utils = utils;

        // load modules and components
        window.app.modules.forEach(module => {
            [].forEach.call(document.querySelectorAll(`*[data-module="${module.name}"]`), (element) => {
                window.app.instances.push(new module.class(element));
            });
        });
    }
});