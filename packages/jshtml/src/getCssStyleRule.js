function getCssStyleRule(name) {
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const styleSheet = styleSheets[i];
        let cssRules;
        try {
            cssRules = styleSheet.cssRules;
        } catch (error) {
            // 跨域样式表无法访问 cssRules，跳过
            continue;
        }
        for (let j = 0; j < cssRules.length; j++) {
            const cssRule = cssRules[j];
            if (cssRule.selectorText === name)
                return cssRule;
        }
    }
}

export default getCssStyleRule;
export { getCssStyleRule };