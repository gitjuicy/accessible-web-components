customElements.define('test-component',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.querySelector('#test-component');
      const templateContent = template.content;

      this.attachShadow({mode: 'open'}).appendChild(
        templateContent.cloneNode(true)
      );
    }
  }
);

const slottedSpan = document.querySelector('test-component span');
console.log(slottedSpan.assignedSlot);
console.log(slottedSpan.slot);

/*
  https://github.com/mdn/web-components-examples/tree/main/simple-template
  <template id="my-paragraph">
    <style>
      p {
        color: white;
        background-color: #666;
        padding: 5px;
      }
    </style>
    <p><slot name="my-text">My default text</slot></p>
  </template>

  <my-paragraph>
    <span slot="my-text">Let's have some different text!</span>
  </my-paragraph>
*/