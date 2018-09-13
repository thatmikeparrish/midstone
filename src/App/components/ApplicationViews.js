import { Route, Redirect } from "../../../node_modules/react-router-dom"
import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import APIManager from '../modules/APIManager'

import Login from './Login/loginForm'
import Dashboard from './Dashboard/Dashboard'
import Registration from "./Registration/Registration"
import NewCharacter from './Characters/NewCharacter'


export default class ApplicationViews  extends Component {
    
    isAuthenticated = () => sessionStorage.getItem("user") !== null
    
    state = {
        user: [],
        users: {},
        races: [],
        classes: [],
        characters: []
    }
    
    componentDidMount() {
        let newState = {};
        newState.user = JSON.parse(sessionStorage.getItem("user")) || {};
        APIManager.getAll("users")
        .then(users => newState.users = users)
        .then(() => APIManager.getAll("races"))
        .then(races => newState.races = races)
        .then(() => APIManager.getAll("classes"))
        .then(classes => newState.classes = classes)
        .then(() => APIManager.getAllCharactersByUserID(newState.user.id, "characters"))
        .then(characters => {newState.characters = characters})
        .then(() => {
            this.setState(newState)
        })
    }
    
    delete = (resources, id) => APIManager.delete(resources, id).then(data => {
        this.setState({[resources]: data})
    })

    post = (resources, newItem) => APIManager.post(resources, newItem).then(data => {
        this.setState({[resources]: data})
    })

    edit = (resources, updateItem, id) => APIManager.update(resources, updateItem, id).then(data => {
        this.setState({[resources]: data})
    })
    
    render() {
        
        return (
            <React.Fragment>
                
                <Route exact path="/" render={(props) => {
                    return <Login {...props}/>
                }} />

                <Route exact path="/login" render={(props) => {
                    return <Login {...props}/>
                }} />
                
                <Route exact path="/registration" render={(props) => {
                    return <Registration {...props} users={this.state.users} post={this.post} />
                }} />

                <Route exact path="/dashboard" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <Dashboard {...props} user={this.state.user} characters={this.state.characters}/>
                    }else {
                        return <Redirect to="/login" />
                    }
                }} />

                <Route exact path="/new-character" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <NewCharacter {...props} post={this.post} user={this.state.user} races={this.state.races} classes={this.state.classes}/>
                    }else {
                        return <Redirect to="/login" />
                    }
                }} />

            </React.Fragment>
        )
    }
}