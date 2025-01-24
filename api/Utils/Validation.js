'use strict';
module.exports = {
    isElementNull: (element) => {
        if (element instanceof Object) {
            return Object.keys(element).length === 0;
        }
        return element == null || element == undefined;
    }
}