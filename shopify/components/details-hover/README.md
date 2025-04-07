# Shopify Non-modal Dialog using Details and Summary HTML Elements

This custom element is a "Wrapper" to be used with the Details and Summary HTML elements. This allows them to function as a dialog, but only on the `onMouseEnter` and `onMouseLeave` events. While this technically sounds closer to the [Tooltip W3C pattern]("https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"), the nature of this custom element/component requires there to be nested focusable elements inside of the element itself, which is not allowed under the W3C guidelines. Their suggestion is a "non-modal dialog", which this should be compliant as.

You will need to add any CSS yourself.

In order to render it, add the javascript file to the asset folder and the Liquid file to the snippet folder of a theme, and code the following in either the `theme.liquid` file (or another template).

```
<script type="text/javascript" src="{{ 'details-hover.js' | asset_url }}" async="async"></script>
{% render 'details-hover' %}
```

The snippet takes no arguments.
