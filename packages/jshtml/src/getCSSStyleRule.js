import Check from '@lijuhong1981/jscheck/src/Check.js';

function getCSSStyleRule(name) {
    Check.typeOf.string('name', name);
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const styleSheet = styleSheets[i];
        const cssRules = styleSheet.cssRules;
        for (let j = 0; j < cssRules.length; j++) {
            const cssRule = cssRules[j];
            if (cssRule.selectorText === name)
                return cssRule;
        }
    }
}

export default getCSSStyleRule;