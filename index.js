import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  VrButton,
  NativeModules,
  asset,
} from 'react-360';

import PdfPlane from './src/PdfPlane';
import PdfThumbnails from './src/PdfThumbnails';

const { PdfModule } = NativeModules;
const textureA = 'pdf_texture_A';
const textureB = 'pdf_texture_B';

export default class react_360_pdf_viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      numPages: 1,
      loading: false,
      texture: textureA,
      mode: 0,
      source: asset('demo.pdf').uri,
    }
  }
  componentWillMount() {
    PdfModule.getDocument(this.state.source).then(pdf => {
      this.setState({ numPages: pdf.numPages });
      this.showPage(this.state.page);
    });
  }
  showPage(page) {
    const texture = (this.state.texture === textureA) ? textureB : textureA;
    this.setState({ page, loading: true, mode: 0 });
    PdfModule.renderPage(page, texture).then(() => {
      this.setState({ loading: false, texture });
    });
  }
  next = () => {
    const page = this.state.page + 1;
    if (page <= this.state.numPages) {
      this.showPage(page);
    }
  }
  prev = () => {
    const page = this.state.page - 1;
    if (page > 0) {
      this.showPage(page);
    }
  }
  showThumbnails = () => {
    this.setState({ mode: 1 });
  }
  render() {
    if (this.state.mode === 1) {
      return (
        <View style={styles.panel}>
          <PdfThumbnails numPages={this.state.numPages} showPage={this.showPage.bind(this)} />
        </View>
      );
    }
    return (
      <View style={styles.panel}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <VrButton style={styles.greetingBox} onClick={this.prev}>
            <Text style={styles.greeting}>&lt;</Text>
          </VrButton>
          <PdfPlane width={720} height={540} texture={this.state.texture} loading={false} />
          <VrButton style={styles.greetingBox} onClick={this.next}>
            <Text style={styles.greeting}>&gt;</Text>
          </VrButton>
        </View>
        <View style={{ width: 720, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <VrButton onClick={this.showThumbnails}><Text>Thumbnails</Text></VrButton>
          <Text>{this.state.page} / {this.state.numPages} {this.state.loading ? 'loading...' : ''}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    //backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBox: {
    margin: 10,
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
  },
  greeting: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('react_360_pdf_viewer', () => react_360_pdf_viewer);
