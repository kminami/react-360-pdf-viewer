import { Module } from 'react-360-web';

export default class PdfModule extends Module {
  constructor(context) {
    super('PdfModule');
    this._context = context;
    this.scale = 1;
    this.canvas = {};
  }
  _getCanvas(id) {
    if (!this.canvas[id]) {
      this.canvas[id] = document.createElement('canvas');
      this._context.registerTextureSource(id, this.canvas[id], { updateOnFrame: true }); // Needs an update each frame
    }
    return this.canvas[id];
  }
  $getDocument(pdfUrl, resolveID, rejectID) {
    pdfjsLib.getDocument(pdfUrl).then(pdf => {
      this.pdf = pdf;
      this._context.invokeCallback(
        resolveID,
        [{ numPages: pdf.numPages }],
      );
    }).catch(e => {
      this._context.invokeCallback(rejectID, [e]);
    });
  }
  $numPages(resolveID, rejectID) {
    if (this.pdf) {
      this._context.invokeCallback(resolveID, [this.pdf.numPages]);
    } else {
      this._context.invokeCallback(rejectID, []);
    }
  }
  $renderPage(pagenum, id, resolveID, rejectID) {
    if (pagenum < 1) {
      this._context.invokeCallback(rejectID, []);
      return;
    } else if (pagenum > this.pdf.numPages) {
      this._context.invokeCallback(rejectID, []);
      return;
    }
    this.pdf.getPage(pagenum).then(page => {
      const viewport = page.getViewport(this.scale);
      const canvas = this._getCanvas(id);
      // canvas.width = 512;
      // canvas.height = 512;
      // viewport.width = 512;
      // viewport.height = 512;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      return page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      });
    }).then(() => {
      this._context.invokeCallback(resolveID, []);
    }).catch(e => {
      this._context.invokeCallback(rejectID, [e]);
    });
  }
}