# **Juicyorange Accessible HTML Web Components**

This is a respository for custom modular web components we use at JO.

This is NOT a component library. It's a collection of re-usable components that can be used in JO sites and apps.

It is likely the components will need some configuring when added to a new project, but they are built with zero external dependencies to minimze this.

## **Philosophy**

We decided to start building a suite of custom elements of tested accessible components that fit the [W3C specifications](https://www.w3.org/standards/) and are [WCAG compliant](https://www.w3.org/WAI/standards-guidelines/wcag/).

All of these components extend the base `HTMLElement` and do _not_ extend any other HTML elements, as Safari [does not support the extension of built-in elements](https://stackoverflow.com/questions/72090155/what-web-component-features-are-not-supported-by-safari-desktop-and-safari-ios/72090672#72090672). If we were to build
a suite of custom elements that extend build-in elements, we would certainly have to include polyfills for Safari browsers, which defeats the purpose of creating peformant custom elements.

## **Tools**

- [jsdoc](https://jsdoc.app/about-getting-started) - _API documentation generator for JavaScript._
- [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/) - _Web API that provides developers a way to create custom HTML elements with developer-defined behavior._
- [Font Awesome](https://fontawesome.com/) - _Icon library and toolkit_
