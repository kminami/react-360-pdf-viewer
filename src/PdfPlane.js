import React from 'react';
import {
  View,
  Text,
  Plane,
  texture,
} from 'react-360';

export default class PdfPlane extends React.Component {
  render() {
    return (
      <View style={{
        width: this.props.width,
        height: this.props.height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {this.props.loading ? (
          <Text>loading...</Text>
        ) : (
            <Plane
              dimWidth={this.props.width}
              dimHeight={this.props.height}
              texture={texture(this.props.texture)} // Use our custom texture
            />
          )}
      </View>
    );
  }
}
