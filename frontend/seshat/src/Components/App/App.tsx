import * as React from 'react';
import './App.css';
import Header from '../Header/header';
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

class App extends React.Component {
  public render() {
    return (
      <HashRouter>
      <div className="App">
        <header className="App-header">
          <Header name="Bimbam" enthusiasmLevel={10}/>
        </header>
        <h1>Simple SPA</h1>
        <ul className="header">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/Stuff">Stuff</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
        <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/contact" component={Contact}/>
        </div>
      </div>
      </HashRouter>
    );
  }
}

export default App;
