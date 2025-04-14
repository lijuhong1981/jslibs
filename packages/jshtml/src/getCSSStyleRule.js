function getCssStyleRule(name) {
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

export default getCssStyleRule;
export { getCssStyleRule };