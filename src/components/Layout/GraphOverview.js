import React from 'react';
import Toolbar from "../Toolbar/Toolbar";
import SideBar from "../SideBar/SideBar";
import classes from "./Layout.module.css";
import MiddleBar from "../MiddleBar/MiddleBar";
import Map from "../Map/Map";
import Auxiliary from "../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";

class GraphOverview extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            sidebarOpen: false,
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
    render(){
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
                    <div className={classes.filters}>
                        <p>Filters</p>
                    </div>
                    <div className={classes.content}>Graph Overview</div>
                    {/*<div className={classes.map}>*/}
                    {/*    /!*<p>Content</p>*!/*/}
                    {/*    <Map observation = {this.state.observation} items={this.state.items} thresholdValues={this.state.thresholds}/>*/}
                    {/*</div>*/}
                </div>
            </Auxiliary>
        )
    }
}
export default GraphOverview;
