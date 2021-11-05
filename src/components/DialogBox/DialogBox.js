import React,{Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary';



class DialogBox extends Component{
    constructor(props) {
        super(props)
        this.state = {
            observation: [{id: 0, lat: 0, long: 0,resultValue:0,phenomenonTime:""}],
        }
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.observation && nextProps.observation[0] && nextProps.observation !== this.state.observation) {
            const receivedObservation = nextProps.observation[0];
            if (receivedObservation.id && receivedObservation.lat && receivedObservation.long) {
                this.setState({
                    observation: nextProps.observation,
                })
            }
        }
    }
    render() {
        return(
            <Auxiliary>
                <h2>Observations</h2>
                <hr/>
                <div><b>CH4 concentration: </b>{this.state.observation[0].resultValue}</div>
                <div><b>PhenomenonTime: </b>{this.state.observation[0].phenomenonTime}</div>
            </Auxiliary>
        );
    }
}



export default DialogBox;