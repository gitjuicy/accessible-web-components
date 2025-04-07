# **Juicyorange Accessible HTML Web Component for Shopify**

This is a respository for custom modular web components we use on Shopify.

Because Shopify instances have a set architecture, these components can only work by manually moving the liquid files to some folder (such as `snippets/`) and the javascript files to the `assets/` folder, and referencing it in the same template, i.e.

```liquid
<script type="text/javascript" src="{{ 'menu-drawer.js' | asset_url }}" async="async"></script>
{% render 'menu-drawer' %}
```

It is likely the components will need some configuring when added to a new Shopify instance, but they are built with a shadow DOM and zero external dependencies (besides being on a theme hosted by Shopify, _not_ a custom storefront) to minimze this.

## **Philosophy**

We take the approach on most Shopify sites we design that because [runtime peformance is important and leads to increase conversions](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates/), when coding for some custom functionality, it is better to write in the functionality with the [Standard Javascript built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) and APIs (in lieu of a [standard library](https://www.reddit.com/r/learnjavascript/comments/8wauhl/what_does_it_mean_when_people_say_javascript/)) whenever possible, without relying on third party libraries or frameworks.

We decided to start building a suite of custom elements of tested accessible components that fit the [W3C specifications](https://www.w3.org/standards/) and are [WCAG compliant](https://www.w3.org/WAI/standards-guidelines/wcag/).

All of these components extend the base `HTMLElement` and do _not_ extend any other HTML elements, as Safari [does not support the extension of built-in elements](https://stackoverflow.com/questions/72090155/what-web-component-features-are-not-supported-by-safari-desktop-and-safari-ios/72090672#72090672). If we were to build
a suite of custom elements that extend build-in elements, we would certainly have to include polyfills for Safari browsers, which defeats the purpose of creating peformant custom elements.

## **Tools**

- [jsdoc](https://jsdoc.app/about-getting-started) - _API documentation generator for JavaScript._
- [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/) - _Web API that provides developers a way to create custom HTML elements with developer-defined behavior._
- [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli) - _Command-line interface built by Shopify to develop theme and apps locally_
- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) - _Shopify Liquid linter to ensure all Liquid code we write is up to date with current Shopify Liquid sytnax and best practices. Use this with the Shopify CLI, by running `shopify theme check`._
- [Font Awesome](https://fontawesome.com/) - _Icon library and toolkit_

## **APIS**

- [Shopify Ajax API](https://shopify.dev/docs/api/ajax) - _Lightweight REST API endpoints for development of Shopify themes._
