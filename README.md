# React 360 PDF viewer

PDF viewer in VR space based on [React 360](https://facebook.github.io/react-360/) and [PDF.js](http://mozilla.github.io/pdf.js/)

Inspired by
- https://github.com/facebook/react-360/issues/392
- https://github.com/LiuC520/ReactVR/blob/master/examples/show_pdf_in_react360/RADEME.md

## How to use (simple)

You can show your pdf with GitHub Pages by cloning this repository and replacing the `docs/static_assets/demo.pdf`.

## How to use (complex)

1. Install this package

```bash
$ npm install -S react-360-pdf-viewer
```

2. Import `PDF.js` at index.html

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.min.js"></script>
```

3. Install `PdfModule` in clinet.js

```javascript
import { ReactInstance } from 'react-360-web';
import { PdfModule } from 'react-360-pdf-viewer';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent {
    // Add custom options here
    fullScreen: true,
    nativeModules: [
      ctx => new PdfModule(ctx),
    ],
    ...options,
  });
}
```

4. Open document and render a page

```javascript
import { NativeModules } from 'react-360';
const { PdfModule } = NativeModules;
const url = 'some.pdf';

PdfModule.getDocument(url).then(pdf => {
  console.log(pdf.numPages);
  // loading
  return PdfModule.renderPage(1, 'pdf_texture');
}).then(() => {
  // done
});

```

5. Show the texture in render method

```javascript
import React from 'react';
import { PdfPlane } from 'react-360-pdf-viewer';

class YourComponent extends React.Component {
  render() {
    return (
      <PdfPlane width={720} height={540} texture="pdf_texture" loading={false} />
    );
  }
}
```

## Reference

### Native Modules
#### PdfModule
- PdfModule.getDocument(url) -> Promise({numPages})
    - execute `pdfjsLib.getDocument(url)` and store the result

- PdfModule.renderPage(pagenum, textureName) -> Promise()
    - render page `pagenum` of stored document to a canvas and register it as a texture named `textureName`

### React Components

#### PdfPlane

A React 360 component to show a rendered texture

- Properties
    - width
    - height
    - texture: textureName to show
    - loading: if true, hide the texture and print the text `loading`

## License

Copyright (c) 2018 Keisuke Minami

MIT