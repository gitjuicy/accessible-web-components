# Select only combobox
based on [APG example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)

Allows the developer to use the familiar ```<select>``` tag and apply class names in a familiar way. Behind the scenes it hides the real select and generates accessible markup for a custom select and passes the class names down to the corresponding element in the generated markup. The value of the combobox is copied to the real select element so adding it to a form or listening for change events on the select will work normally.

** Important note: styles using the element names as the selector won't be applied to generated markup as the element types are different. E.g. select { border-radius: 16px } will not affect the combobox, however if you add a class to the combobox like ```.select-wrapper``` then you can style it using ```.select-wrapper { border-radius: 16px }``` **

