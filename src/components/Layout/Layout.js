// This component is responsible to get new observation and send it to the desired components
// Also, the appearance of the main page is configured in this component through its css styling file
import React from 'react';
import classes from './Layout.module.css';
import SideBar from "../SideBar/SideBar";
import MiddleBar from "../MiddleBar/MiddleBar";
import Map from "../Map/Map";
import Auxiliary from '../../hoc/Auxiliary';
import withClass from "../../hoc/withClass";
import Toolbar from "../Toolbar/Toolbar";
import Backdrop from "../Backdrop/Backdrop";


class layout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            thresholds: [2.5,4],
            count:[1,1],
            sidebarOpen: false,
            observation:[{id:null,lat:null,long:null,resultValue:null,phenomenonTime:null}],
            // Setting the required items need to be defined in the filter bar. Here is the place you need to add or remove items
            items: [
                {id: "I1", name: 'Methane', displayInfo: false},
                {id: "I2", name: 'Wind Direction', displayInfo: false},
                {id: "I3", name: 'Wind Speed', displayInfo: false},
                {id: "I4", name: 'Location', displayInfo: false},
                {id: "I5", name: 'Time', displayInfo: false}
            ],
            historicalPointsNumber : 100
        }
    }

    // Click handler for the sliding menu
    sidebarToggleClickHandler = () => {
        this.setState((prevState) => {
            return {sidebarOpen: !prevState.sidebarOpen};
        });
    };

    // How to hide the sliding menu bar
    backdropClickHandler =() => {
        this.setState({sidebarOpen:false})
    };

    // Setting the new value comes to the layout from App.js file (Every one second a new value will come and here it will be set as the new observation
    componentWillUpdate(nextProps, nextState, nextContext) {
        if(nextProps.observation  && nextProps.observation !== this.state.observation)
        this.setState({
            observation:nextProps.observation
        })

    }

    thresholdsHandler =  (thresholds) => {
        this.setState({
            thresholds:[thresholds[0],thresholds[1]]
        })
    }

    // This function is responsible for
    displayedFilterHandler = (items) => {
        this.setState({
            items:items
        })
    }

    historicalNumberHandler = (number) => {
        this.setState({
            historicalPointsNumber : number
        })
    }

    render() {
        let backdrop;
        if(this.state.sidebarOpen){
            backdrop = <Backdrop click={this.backdropClickHandler}/>;
        }
        return (
            <Auxiliary>
                {/*<div style={{'height':'100%'}}>*/}
                <div >
                    <Toolbar sidebarClickHandler={this.sidebarToggleClickHandler}/>
                    <SideBar show={this.state.sidebarOpen}/>
                    {backdrop}
                    <div className={classes.middlebar}>
                        <MiddleBar historicalNumber = {this.historicalNumberHandler} items={this.state.items} displayedFilters={this.displayedFilterHandler} threshodChangedHandler={this.thresholdsHandler}/>
                    </div>
                    {/*<div className={classes.dialogbox}>*/}
                    {/*    <DialogBox observation = {this.state.observation}/>*/}
                    {/*</div>*/}
                    <div className={classes.map}>
                        {/*<p>Content</p>*/}
                        <Map observation = {this.state.observation} items={this.state.items} thresholdValues={this.state.thresholds} historicalNumber = {this.state.historicalPointsNumber}/>
                    </div>
                </div>
            </Auxiliary>
        );
    }

}
export default withClass(layout,classes.container);
