import React from 'react';
import {
  View,
  VrButton,
  NativeModules,
} from 'react-360';

import PdfPlane from './PdfPlane';

const { PdfModule } = NativeModules;

export default class PdfThumbnails extends React.Component {
  constructor(props) {
    super(props);
    const pages = [];
    for (let i = 0; i < this.props.numPages; i++) {
      pages.push({ loading: true, texture: `pdf_texture_thumbnail_${i + 1}`, num: i + 1 });
    };
    this.state = { pages, loading: 0 };
  }
  componentWillMount() {
    this.loadNext();
  }
  loadNext() {
    const idx = this.state.loading;
    const page = this.state.pages[idx];
    if (!page) {
      return;
    }
    PdfModule.renderPage(page.num, page.texture).then(() => {
      const pages = this.state.pages.concat([]);
      pages[idx].loading = false;
      this.setState({ pages, loading: idx + 1 });
      this.loadNext();
    });
  }
  render() {
    return (
      <View style={{
        width: 1000, height: 600,
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'flex-start', alignItems: 'center',
      }}>
        {this.state.pages.map(page => (
          <VrButton key={page.num} style={{ marginRight: 30, marginBottom: 1 }}
            onClick={this.props.showPage.bind(this.props, page.num)}
          >
            <PdfPlane
              width={72 * 3} height={54 * 3}
              texture={page.texture} loading={page.loading}
            />
          </VrButton>
        ))}
      </View>
    );
  }
}
