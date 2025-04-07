"use strict";

/**
 * @class DetailsHover
 * @extends HTMLElement
 * @description Creates a component that fits the non-modal dialog pattern to allow nested focusable content 
 * @example See accompanying .liquid file
 */
class DetailsHover extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');

    this.summaryToggle.addEventListener(
      "mouseenter",
      this.onSummaryMouseEnter.bind(this)
    );

    this.detailsContainer.addEventListener(
      'mouseleave',
      this.onDetailsMouseLeave.bind(this)
    );

    this.summaryToggle.setAttribute('role', 'button');
  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }

  onSummaryMouseEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isOpen()) {
      this.open();
    }
  }

  onDetailsMouseLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isOpen()) {
      this.close();
    }
  }

  open() {
    this.detailsContainer.setAttribute('open', true);
  }

  close() {
    this.detailsContainer.removeAttribute('open');
  }
}

customElements.define('details-hover', DetailsHover);
