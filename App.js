import React, {Component} from 'react';
import Navigator from './Navigator';
import {ThemeManager} from './ThemeManager';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ThemeManager>
          <Navigator />
        </ThemeManager>
      </>
    );
  }
}

export default App;