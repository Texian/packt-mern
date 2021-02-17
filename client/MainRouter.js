import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home.js'
import Users from './user/Users.js'
import Signup from './user/Signup.js'
import Signin from './auth/Signin.js'
import Profile from './user/Profile.js'

const MainRouter = () => {
    return ( <div>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/users" component={Users}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/user/:userId" component={Profile}/>
        </Switch>
    </div>
    )
}

export default MainRouter