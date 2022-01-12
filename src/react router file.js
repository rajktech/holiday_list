import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, NavLink, Switch, Route, useParams } from "react-router-dom";
//import { Home, About, Contact } from "./Comp";

function Home1() {
  return <div>This is Home page</div>;
}
function About1() {
  return <div>This is about us page</div>;
}
function Contact() {
  const {id} = useParams();
  return <div>This is Contact page with id: {id}</div>;
}

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <NavLink to="">Home</NavLink>
        <NavLink to="about">About</NavLink>
        <NavLink to="contact">Contact us</NavLink>

        <Switch>
          <Route path="/" exact component={Home1} />
          <Route path="/about" exact component={About1} />
          <Route path="/contact/:id" exact component={Contact} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;


//render(<App />, document.querySelector('#app'));