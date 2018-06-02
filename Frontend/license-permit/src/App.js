import React, { Component } from 'react';
import { 
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom'
import { Provider } from "react-redux";
import './App.css';

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Application from "./components/application";

class App extends Component {

  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div className="wrapper">
            <Switch>
              <Route exact path="/" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/apply" component={Application}/>
              <Route path="/admin/dashboard" component={Dashboard}/>
              <Route component={Application}/>
            </Switch>
          </div>
          {/* end of wrapper */}
        </Router>
      </Provider>
    );
  }
}

export default App;
