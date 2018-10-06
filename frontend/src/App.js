import React from "react";
import axios from "axios";
// import hero from "./assets/hero.svg";
import { Route, Switch, withRouter, NavLink } from "react-router-dom";
// Do not change the order of imports on lines 6 - 8 to preserve styling specificty
import './css/AntDesignOverride.css';
import './css/App.css';
import { Account,
  Billing,
  CompanyLanding,
  Dashboard,
  Job,
  JobList,
  JobPost,
  Landing,
  Navigation,
  NoMatch,
  EmployerProfile } from "./components";
import { Alert, Button} from "antd";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      error: null,
      message: null,
      token: null,
      jobs: null,
      employer: false,
      clicked: false,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${process.env.REACT_APP_LOGIN_API}refresh/`, { token: token })
        .then(response => {
          this.logIn(response.data);
          this.props.history.push('/jobs');
        })
        .catch(err => {
          this.logOut();
          this.setState({ error: `Error processing request. Please log in or register.`});
        });
    }
    else {
      let path = this.props.history.location.pathname;
      this.props.history.push('/');
      if (path !== '/' && path !== '/signin' && path !== '/company') {
        this.setState({ error: `Please log in or register.`});
      }
    }
  }

  logIn = data => {
    this.setState({ 
      loggedIn: true,
      error: null,
      message: null,
      token: data.token,
      employer: data.user.is_employer
    });
    localStorage.setItem('token', data.token);
    // Redirect based on user type
    if (data.user.is_employer) {
      this.props.history.push('/dashboard');
    } else {
      this.props.history.push('/jobs');
    }
  }

  logOut = (e, error) => {
    localStorage.removeItem('token');
    this.setState({ 
      loggedIn: false,
      // loggedOut: true,
      jobs: null, 
      token: null,
      error: error,
      message: null
    });
    this.props.history.push('/signin');
  }

  setJobs = jobs => {
    this.setState({ jobs: jobs });
  }

  render() {
    const { loggedIn, error, message, token, jobs, employer } = this.state;
    let location = this.props.history.location.pathname;
    const home = location === '/';
    const company = location === '/company';
    const signin = location === '/signin';

    return (
      <div className="App">

        {error ? (
          <Alert message={error} type="error" closable showIcon banner />
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon />
        ) : (null)}

        {loggedIn ? (
          <div>
            <Navigation logOut={this.logOut} employer={employer}/>
          </div>
        ) : (
            // Navigation for unauthenticated users
            <div>

              {home ? (
                <div className="home-navigation">
                  <div>
                    <h1>Open Jobs</h1>
                    <h3>No Degree, No Problem.<br/>Your next job is just a click away.</h3>
                    <div className="whitespace"></div>
                    <NavLink to='/company'><Button type="secondary">Post a Job</Button></NavLink>
                    <NavLink to='/signin'><Button type="primary">Sign In</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

              {company ? (
                <div className="home-navigation">
                  <div>
                    <div className="whitespace"></div>
                    <NavLink to='/'><Button type="secondary">Job Seeker</Button></NavLink>
                    <NavLink to='/signin'><Button type="primary">Sign In</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

              {signin ? (
                <div className="home-navigation">
                  <div>
                    <div className="whitespace"></div>
                    <NavLink to='/company'><Button type="secondary">Post a Job</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

            </div>
        )}

        <div className="main">
          <Switch>
            <Route exact path="/signin" render={() => <Landing logIn={this.logIn}/>} />
            <Route path="/company" render={() => <CompanyLanding logIn={this.logIn}/>} />
            <Route exact path="/" render={() => <JobList jobs={jobs} setJobs={this.setJobs}/>} />
            <Route exact path="/jobs" render={() => <JobList jobs={jobs} setJobs={this.setJobs}/>} />
            <Route path="/jobs/:id" render={() => <Job />} />
            <Route path="/addjob" render={() => <JobPost token={token} logOut={this.logOut}/>} />
            {employer ? (
              <Route path="/account" render={() => <EmployerProfile token={token} logOut={this.logOut}/>} />
              ) : (
              <Route path="/account" render={() => <Account token={token} logOut={this.logOut}/>} />
            )}
            <Route path="/billing" render={() => <Billing token={token} logOut={this.logOut}/>} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NoMatch} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default withRouter(App);