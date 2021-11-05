import React, {Component} from 'react';
import Layout from './components/Layout/Layout';
import './App.css';
import LiveLocation from "./components/LiveLocation/LiveLocation";
import Dexie from 'dexie';

import {Route, Switch} from 'react-router-dom';
import ExportLayout from "./components/Layout/ExportLayout";
import GraphOverview from "./components/Layout/GraphOverview";

class App extends Component {
    db;
    state = {
        observation: [
            {id: 1, lat: -114.12741959095001, long: 51.08091108438578, resultValue: null, phenomenonTime: null}
        ],
        temp:false
    };

    componentDidMount() {
        this.interval = setInterval(async () => {
            const returnedObservation = await LiveLocation(); // Send a request for the latest observation from the STA sandbox 01
            this.setState({
                    observation: [
                        returnedObservation, // Set the latest observation in the state
                    ],
                }
            )

        }, 1000); // Set the time interval of 1000 milliseconds
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Stop sending request for the latest observations
    }

    render() {
        // this.db = new Dexie('PoMELO_Pod'); // Create an instance of DB with entitled PoMELO_pod
        // this.db.version(1).stores({
        //     observationStore: 'id, lat, long, methaneMoleratio, phenomenonTime'
        // }); // Creating an instance schema on the DB entitled observationStore with the defined columns
        // this.db.open().catch(function () {
        //     alert("Open failed: "); // Show alert if this process failed
        // });
        // // Adding observations to the defined schema
        // this.db.observationStore.put({
        //     id: this.state.observation[0].id,
        //     lat: this.state.observation[0].lat,
        //     long: this.state.observation[0].long,
        //     methaneMoleratio: this.state.observation[0].resultValue,
        //     phenomenonTime: this.state.observation[0].phenomenonTime
        // }); // .then(() => db.observationStore.get('Johnny'))
        //     // .then((samba) => {
        //     //     console.log(samba.race);
        //     //     this.setState({
        //     //         century: samba.race
        //     //     });
        //     // });

        return (
            <div>
                {/*<Layout observation={this.state.observation}></Layout>*/}
                <Switch>
                    <Route path="/" exact render={(props) => <Layout {...props} observation={this.state.observation}/>}/>
                    <Route path="/export" component={ExportLayout}/>
                    {/*<Route path="/graphoverview" component={GraphOverview}/>*/}
                </Switch>
            </div>
        );
    }
}

export default App;
