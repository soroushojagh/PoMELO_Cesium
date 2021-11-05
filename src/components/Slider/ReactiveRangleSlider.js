import React ,{Component} from 'react';

import { Range, getTrackBackground } from "react-range";


const STEP = 0.1;
const MIN = 0;
const MAX = 8;
const COLORS = ['blue', 'orange', 'red'];

class ReactiveRangeSlider extends Component {
    state = {
        values: [2.5, 4]
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
       if(nextState.values != this.state.values){
          this.props.threshodChangedHandler(nextState.values)
       }
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    borderRadius: "50px",
                    marginLeft:"0.1em",
                    marginRight:"0.1em",
                    paddingTop:"10px",
                    background:"#F1F1F5",
                    border: "2px solid #353536"
                    // marginTop: '2em'
                }}
            >
                <Range
                    values={this.state.values}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={values => this.setState({ values })}
                    renderTrack={({ props, children }) => (
                        <div
                            onMouseDown={props.onMouseDown}
                            onTouchStart={props.onTouchStart}
                            style={{
                                ...props.style,
                                height: '36px',
                                display: 'flex',

                                width: '100%',
                                margin: '1em'
                            }}
                        >
                            <div
                                ref={props.ref}
                                style={{
                                    height: '5px',
                                    width: '100%',

                                    borderRadius: '4px',
                                    background: getTrackBackground({
                                        values: this.state.values,
                                        colors: COLORS,
                                        min: MIN,
                                        max: MAX
                                    }),
                                    alignSelf: 'center'
                                }}
                            >
                                {children}
                            </div>
                        </div>
                    )}
                    renderThumb={({ props, isDragged, index }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '20px',
                                width: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 2px 6px black'
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-28px',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '0.7em',
                                    fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: 'gray'
                                }}
                            >
                                {this.state.values[index].toFixed(1)}
                            </div>
                        </div>
                    )}

                />
                {/*<output style={{ marginTop: '30px' }}>*/}
                {/*    {this.state.values[0].toFixed(1)} - {this.state.values[1].toFixed(1)}{' '}*/}
                {/*</output>*/}
            </div>
        );
    }
}

export default ReactiveRangeSlider;
