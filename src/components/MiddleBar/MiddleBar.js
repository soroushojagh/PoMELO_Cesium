import React, {Component} from 'react';
import TimeComponent from "./TimeComponent";
import ParameterItems from "./ParameterItems";
import ReactiveRangeSlider from "../Slider/ReactiveRangleSlider";
import './MiddleBar.css'
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.less';
import {Button} from "react-bootstrap";
import {Container, Row, Col} from 'reactstrap';

class MiddleBar extends Component {
    maxLimit = 500;
    steps = 10;
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            value: 100,
        }

    }

    // This method is responsible to send back show/hide status of each filter
    clickedHandler = async (index) => {
        const item = {...this.state.items[index]}; //or
        item.displayInfo = !item.displayInfo;
        const items = [...this.state.items];
        items[index] = item;

        // console.log(items)
        await this.setState({
            items: items
        })
        this.props.displayedFilters(items); // Send the current status of items back to the Layout JS
    }

    threshodChangedHandler = (thresholds) => {
        this.props.threshodChangedHandler(thresholds);
    }

    addValue = async () => {
        if (this.state.value < this.maxLimit) {
            await this.setState({
                value: this.state.value + this.steps
            });
            this.props.historicalNumber(this.state.value)

        } else
            this.state.value = this.maxLimit
    }

    reduceValue = async () => {
        if (this.state.value > 0) {

            await this.setState({
                value: this.state.value - this.steps
            });
            this.props.historicalNumber(this.state.value)
        } else
            this.state.value = 0
    }

    render() {
        return (
            // Get each ot filtering items and send them to the ParameteItems component in order to visualize them in the middle bar
            <div>
                <div className="containerMiddleBarSection1">
                    <div className="headerMiddleBar">
                        <p className="textHeaderMiddleBar">Parameters</p>
                    </div>
                    {
                        this.state.items.map((item, index) => {
                            return (<ParameterItems
                                click={this.clickedHandler}
                                item={item.name}
                                key={item.id}
                                itemId={index}
                            />)
                        })

                    }
                </div>


                <div className="containerMiddleBarSection2">
                    <p className="textHeaderMiddleBar">Previous Observations</p>
                    <div className='inlineInput'>
                        <input value={this.state.value} style={{width: '130px'}} disabled/>
                        <Button onClick={this.addValue} size='sm'
                                style={{marginLeft: '2px', marginRight: '2px'}}>+</Button>
                        <Button onClick={this.reduceValue} size='sm'
                                style={{marginLeft: '2px', marginRight: '2px', width: '35px'}}>-</Button>
                    </div>
                </div>
                <div className="containerMiddleBarSection3">
                    <p className="textHeaderMiddleBar">Methane Color Index</p>
                    <ReactiveRangeSlider threshodChangedHandler={this.threshodChangedHandler}/>
                </div>
            </div>

            // <TimeComponent/>
        );
    }
}


export default MiddleBar;
