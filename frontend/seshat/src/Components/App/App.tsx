import * as React from 'react';
import './App.css';
import Header from '../Header/header';
//import HeaderLinks from "../Header/HeaderLinks";
import Home from "../Home/home" ;
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import HomeIcon from '@material-ui/icons/Home';
import BookIcon from '@material-ui/icons/Book';

import Stuff from "../Stuff/stuff" ;
import Contact from "../Contact/contact" ;

import {
  Route,
  //NavLink,
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
           <Route render={({ location, history }) => (
        <React.Fragment>
            <SideNav
                onSelect={(selected:any) => {
                    const to = '/' + selected;
                    if (location.pathname !== to) {
                        history.push(to);
                    }
                }}
            >
            <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                    <NavItem eventKey="home">
                        <NavIcon>
                            <HomeIcon />
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="stuff">
                        <NavIcon>
                            <BookIcon />
                        </NavIcon>
                        <NavText>
                            My Books
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            <main>
                <Route path="/home" exact component={Home} />
                <Route path="/stuff" component={Stuff} />
                <Route path="/contact" component={Contact} />
            </main>
        </React.Fragment>
    )}
    />

        </div>
      </HashRouter>
    ) ;
  }
}
/*
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
*/
export default App;
