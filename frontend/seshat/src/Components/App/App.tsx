import * as React from 'react';
import './App.css';
import Header from '../Header/header';
//import HeaderLinks from "../Header/HeaderLinks";
import Home from "../Home/home" ;
import Stuff from "../Stuff/stuff" ;
import Contact from "../Contact/contact" ;

import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

//import logo from './logo.svg';
//https://github.com/Microsoft/TypeScript-React-Starter
//https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm
//const dashboardRoutes:any = [];
https://reactjsexample.com/react-side-nav-component/


class App extends React.Component {
  public render() {
    return (
      
      <HashRouter>
      <div className="App">
        <header className="App-header">
          <Header brand="Seshat" />
        </header>
        <div >
          <ul className="header">
            <li><NavLink exact to="/">My Books</NavLink></li>
            <li><NavLink to="/Stuff">My book helper</NavLink></li>
            <li><NavLink to="/contact">test</NavLink></li>
          </ul>
          <div className="content">
              <Route exact path="/" component={Home}/>
              <Route path="/stuff" component={Stuff}/>
              <Route path="/contact" component={Contact}/>
          </div>
        </div> 
      </div>
      </HashRouter>
    );
  }
}

export default App;
