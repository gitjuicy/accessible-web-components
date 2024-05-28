# Shopify Menu Drawer

This creates a custom menu drawer in the upper-right portion of the viewport with the total cart count and each menu item.

In order to render it, add the javascript file to the asset folder and the Liquid file to the snippet folder of a theme, and code the following in either the `theme.liquid` file (or another template).

```
<script type="text/javascript" src="{{ 'menu-drawer.js' | asset_url }}" async="async"></script>
{% render 'menu-drawer' %}
```

The snippet takes no arguments.
