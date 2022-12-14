# serial_monitor
A web based serial monitor for communicating with serial devices (like Arduino). The library is based on native web components and uses the WebSerial API to communicate with the external device.

### Description

This package offers a native web component for communicating to serial devices using WebSerial. It allows users to both send and receive byte and string data to/from the serial device. The serial monitor is compatible with popular microcontroller platforms like Arduino. The native web component can be embedded into any html page.

![A screenshot of the component](/doc/img/editor.png)


### Install

npm install @tomneutens/serial_monitor

### Usage

The component can both be used in plain html (built and bundled version) or integrated into a typescript frontend application using lit-element.

#### Plain html
Link the main.js file in your html and start using the serial-montitor tag.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Online Arduino compatible serial monitor using WebSerial</title>
        <script type="module" src="node_modules/@tomneutens/serial_monitor/dist/serial-monitor.js"></script>
        <style>
            body {
                width: 100vw;
                height: 100vh;
                margin:0;
            }
        </style>
    </head>
    <body>
        <serial-monitor serial-port-filters='[{"usbVendorId":54240}]'></serial-monitor>
    </body>
</html> 
```

The serial-port-filters attribute accepts a JSON encoded array of [SerialPortFilter](https://wicg.github.io/serial/#serialportfilter-dictionary) objects.

#### Typescript

You can import the serial-monitor element for use in your lit template by importing "@tomneutens/serial_monitor".

```javascript
import "@tomneutens/serial_monitor";

/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

 import { LitElement, html } from "lit";
 import {customElement} from 'lit/decorators.js';
 
 @customElement("test-serial")
 class TestSerial extends LitElement {

    constructor(){
        super()
    }

    protected render() {
        return html`
        <serial-monitor></serial-monitor>
        `
    }

 }

 declare global {
    interface HTMLElementTagNameMap {
        "test-serial": TestSerial;
    }
}

export default TestSerial
```

I recomend bundeling your application using a tool like webpack to be able to use your component (here test-serial) in your html. These tools will perform the module resolution for your component and allow you to use it in the browser. The component will not work without bundling since browsers do not support full module resolution. This might change in the future with "import maps".

If we assume you have bundled your application into the the dist/index.js file, the following example shows how to use the component.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Online Arduino compatible serial monitor using WebSerial</title>
        <script type="module" src="dist/index.js"></script>
    </head>
    <body>
        <test-serial></test-serial>
    </body>
</html> 
```

### Layout

The component automatically fills its container. Colors and fonts are set using the CSS variables defined by our theme:

```css
--component-foreground-color: var(--theme-foreground-color, #819F3D);
--component-foreground-color-hover: var(--theme-foreground-color-hover, #8BAB42);
--component-foreground-color-text: var(--theme-foreground-color-text, #819F3D);
--component-foreground-color-textarea-disabled: var(--theme-foreground-color-textarea-disabled, gray);
--component-foreground-color-disabled: var(--theme-disabled-foreground-color, black);
--component-foreground-color-button: var(--theme-foreground-color-button, black);

--component-background-color: var(--theme-background-color, #242424);
--component-background-color-text: var(--theme-background-color-text, #242424);
--component-background-color-button: var(--theme-background-color-button, #819F3D);
--component-background-color-disabled: var(--theme-background-color-disabled, gray);

--component-accent-color: var(--theme-accent-color, #9FBA63);
--component-accent-color-neutral: var(--theme-accent-color, #20270F);

--component-base-font-size: var(--theme-base-font-size, 1rem);
--component-base-font-family: var(--theme-base-font-family, sans-serif);
```

Override these theme settings by defining the variable prefixed with '--theme'.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Online Arduino compatible serial monitor using WebSerial</title>
        <script type="module" src="node_modules/@tomneutens/serial_monitor/dist/serial-monitor.js"></script>
        <style>
            body {
                width: 100vw;
                height: 100vh;
                margin:0;
            }

            serial-monitor {
                --theme-foreground-color: red;
                --theme-background-color: white;
                --theme-background-color-button: red;
                --theme-background-color-disabled: pink;
                --theme-accent-color: orange;
            }
        </style>
    </head>
    <body>
        <serial-monitor serial-port-filters='[{"usbVendorId":54240}]'></serial-monitor>
    </body>
</html> 
```

![A screenshot of the component](/doc/img/editor_themed.png)


### Localization

We use the [lit localization library to translate the interface](https://lit.dev/docs/localization/overview/). 

### Browser support

At the time of writing, the support for the Web Serial API is limited. Check [https://caniuse.com/web-serial](https://caniuse.com/web-serial) for latest support information.


### License info

Copyright (c) 2022 Tom Neutens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.