// This component is responsible for visualizing the observations on the map

import React from 'react';
import './Map.css';
import {Color} from "cesium";
import {Cartesian3} from "cesium";
import {Viewer, Entity, EntityDescription, CameraFlyTo,PointGraphics, GeoJsonDataSource} from "resium";
import {hot} from "react-hot-loader/root";
import Auxiliary from '../../hoc/Auxiliary';
import DialogBox from "../DialogBox/DialogBox";
import ReactSpeedometer from "react-d3-speedometer";
import flyTo from '../../assets/flyTo.png'
import ReactTooltip from 'react-tooltip'


const pointGraphics = {pixelSize: 50, color: new Color(1, 1, 1, 0.1)};


class Map extends React.Component {

    numberOfHistoricalPoints;
    windWidget;
    camera = null;
    constructor(props) {
        super(props);
        // If you want to change the number of represented historical points, you just need to change this number
        this.numberOfHistoricalPoints = this.props.historicalNumber; // It has been discussed to just represent the 100 latest points on the map

        this.state = {
            recievedThreshold: [2.5, 4],
            observation: [{id: 0, lat: 0, long: 0, resultValue: 0, phenomenonTime: ""}],
            pointColor: Color.RED,
            position: Cartesian3.fromDegrees(0, 0, 0),

            // // GeoJSON encoding to represent the polyline feature
            // polyline: {
            //     "type": "Feature",
            //     "properties": {},
            //     "geometry": {
            //         "type": "LineString",
            //         "coordinates": []
            //     }
            // },

            // GeoJSON encoding for the realtime point
            data: {
                type: "Feature",
                properties: {
                    name: "Pod's live information",
                    popupContent: "The live information of the PoMELO pod",
                },
                geometry: {
                    type: "Point",
                    coordinates: [],
                },
            },

            // The required GeoJSON encoding for the historical 100 points on the map as a FeatureCollection
            // The strategy is that I push a new feature to this FeatureCollection and after reaching at the desired number of points,
            // The oldest feature will be removed
            historicalData: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [0.0, 0.0]
                        },
                        properties: {
                            value: 0.0,
                            color: null
                        }
                    }
                ]
            }
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.observation && nextProps.observation[0] && nextProps.observation !== this.state.observation) {
            const receivedObservation = nextProps.observation[0];
            let threshould = nextProps.thresholdValues;
            // this.setState({recievedThreshold:nextProps.thresholdValues});

            // Setting the color based on the discussed thresholds 0 <= value < 2.5: Blue; 2.50 <= value < 4: Orange ; value >= 4: Red
            if (receivedObservation.id && receivedObservation.lat && receivedObservation.long) {
                let dotColor = "";
                // Setting the threshold for categorizing icon based on different colors
                if (receivedObservation.resultValue < this.state.recievedThreshold[0]) {
                    dotColor = Color.BLUE;
                } else if (receivedObservation.resultValue >= this.state.recievedThreshold[0] && receivedObservation.resultValue < this.state.recievedThreshold[1]) {
                    dotColor = Color.ORANGE;
                } else {
                    dotColor = Color.RED;
                }

                if(nextProps.historicalNumber != this.numberOfHistoricalPoints){
                    this.numberOfHistoricalPoints = nextProps.historicalNumber;
                }

                // // For the situation that we want to apply simbology to the historical points
                // if(nextProps.thresholdValues != this.state.recievedThreshold){
                //     this.applyColorToHistoricalPoints(this.state.historicalData, this.state.recievedThreshold[0], this.state.recievedThreshold[1]);
                // }

                // Calling the method to add this observation as a feature to the FeatureCollection
                this.addHistoricalPoint(receivedObservation.lat, receivedObservation.long, receivedObservation.resultValue, dotColor, threshould);

                // // To show polyline
                // let polylineCoordinates = [...this.state.polyline.geometry.coordinates];
                // polylineCoordinates.push([receivedObservation.lat, receivedObservation.long]);

                this.setState({
                    observation: nextProps.observation,
                    pointColor: dotColor,
                    position: Cartesian3.fromDegrees(receivedObservation.lat, receivedObservation.long, 0),

                    // // adding a new point to the polyline feature in the GeoJSON encoding defined in the state
                    // polyline: {
                    //     "type": "Feature",
                    //     "properties": {},
                    //     "geometry": {
                    //         "type": "LineString",
                    //         "coordinates": polylineCoordinates
                    //     }
                    // },

                    // Updating the coordinate of the live location by setting the received observation as the location of the point
                    data: {
                        type: "Feature",
                        properties: {
                            name: "Coors Field",
                            popupContent: "This is where the path will be started!",
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [receivedObservation.lat, receivedObservation.long],
                        },
                    }
                });
            }

        }
    }

    applyColorToHistoricalPoints = (FeatureCollectionHistorical, firstThreshold, secondThreshold) => {
        let latestHistoricalPnts = [...this.state.historicalData.features];
        let dotColor = "";
        // Setting the threshold for categorizing icon based on different colors
        let changedHistoricalPnts = latestHistoricalPnts.map(point => {
            if (point.properties.value < firstThreshold) {
                point.properties.color = Color.BLUE;
            } else if (point.properties.value >= firstThreshold && point.properties.value < secondThreshold) {
                point.properties.color = Color.ORANGE;
            } else {
                point.properties.color = Color.RED;
            }
        })
        this.setState({
            historicalData: {
                type: "FeatureCollection",
                features: changedHistoricalPnts
            }
        })
    }

    // This method is responsible to add the received observation as a new feature to the FeatureCollection
    addHistoricalPoint = (lat, long, ch4Value, dotColor, threshold) => {
        let currentHistoricalPoints = [...this.state.historicalData.features];

        // Adding the new feature
        currentHistoricalPoints.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [lat, long]
            },
            properties: {
                value: ch4Value,
                color: dotColor
            }
        });

        // Deciding about deleting the oldest features if the number of existing features passed the limit of required historical points
        let numberOfCurrentHisPnts = currentHistoricalPoints.length;
        if (numberOfCurrentHisPnts > this.numberOfHistoricalPoints) {
            let deleteLength = currentHistoricalPoints.length - this.numberOfHistoricalPoints;
            currentHistoricalPoints = currentHistoricalPoints.splice(deleteLength); // Deleting the fist x numbers of features in the "features" property of FeatureCollection
        }

        // Updating the existing features in the FeatureCollection
        this.setState({
            recievedThreshold: threshold,
            historicalData: {
                type: "FeatureCollection",
                features: currentHistoricalPoints
            }
        })
    }

    windWidgetHandler = (windDir, windSpd) => {
        this.windWidget = null;
        if (windDir && windSpd) {
            let windDirAbb = null;
            let windDirVal = windDir;
            let windSpeedVal = windSpd
            if (windDirVal >= 0 && windDirVal <= 90)
                windDirAbb = "NE"
            else if (windDirVal > 90 && windDirVal <= 180)
                windDirAbb = "SE"
            else if (windDirVal > 180 && windDirVal <= 270)
                windDirAbb = "SW"
            else if (windDirVal > 270 && windDirVal < 360)
                windDirAbb = "NW"

            // return [windDirAbb,windDirVal.toFixed(2),windSpeedVal.toFixed(4)]
            this.windWidget = <div data-tip data-for='windInfo'className="compass">
                <div  className="direction">
                    <p>{windDirAbb}<span>{windSpeedVal.toFixed(4)} m/s</span></p>
                </div>
                <ReactTooltip id='windInfo' type='light'>
                    <span>Wind Information</span>
                </ReactTooltip>
                <div style={{transform: "rotate(" + windDirVal.toFixed(2) + "deg)"}} className="arrow"></div>
            </div>
        } else
            this.windWidget = null;
        return this.windWidget;
    }

    flyTo = () => {
        this.camera = <CameraFlyTo duration={2} destination={Cartesian3.fromDegrees(this.state.observation[0].lat, this.state.observation[0].long, 1000)} />;
    }

    render() {
        // The information required to be set in the popup menu should be set here
        let ch4Info = null;
        let locationInfo = null;
        let timeInfo = null;
        let windDirInfo = null;
        let windSpdInfo = null;
        this.props.items.forEach((item) => {
            if (item.name === 'Methane' && item.displayInfo) {
                ch4Info = <p>Methane concentration: {(this.state.observation[0].resultValue).toFixed(4)} ppmv</p>
            }
            if (item.name === 'Location' && item.displayInfo) {
                locationInfo =
                    <p>Latitude: {Math.round(this.state.observation[0].lat * 100000 + Number.EPSILON) / 100000},
                        Longitude: {Math.round(this.state.observation[0].long * 100000 + Number.EPSILON) / 100000} </p>
            }
            if (item.name === 'Time' && item.displayInfo) {
                timeInfo = <p>Time: {this.state.observation[0].phenomenonTime}</p>
            }
            if (item.name === 'Wind Direction' && item.displayInfo) {
                windDirInfo = <p>Wind Direction: {(this.state.observation[0].true_wndDir).toFixed(4)} deg</p>
            }
            if (item.name === 'Wind Speed' && item.displayInfo) {
                windSpdInfo = <p>Wind Speed: {(this.state.observation[0].true_wndSpd).toFixed(4)} m/s</p>
            }
        })
        let windWidgetInfo = this.windWidgetHandler(this.state.observation[0].true_wndDir, this.state.observation[0].true_wndSpd);

        let methaneGauge = <div className='gauge'>
            <ReactSpeedometer style={{fontFamily: "Open Sans"}}
                              maxValue={8}
                              minValue={0}
                              value={this.state.observation[0].resultValue ? Number((this.state.observation[0].resultValue).toFixed(2)) : 0}
                              currentValueText="Methane Measurement (PPM): ${value}"
                              textColor={"white"}
                              needleColor="#D8DEE9"
                              ringWidth={20}
                              forceRender={true}
                              width={200}
                              height={200}
                              needleHeightRatio={0.75}
                              needleTransitionDuration={0}
                              valueTextFontSize="12px"
                              customSegmentStops={[0, this.state.recievedThreshold[0], this.state.recievedThreshold[1], 8]}
                              segmentColors={[
                                  'blue',
                                  'orange',
                                  'red'
                              ]}
            />

        </div>

        return (
            <Auxiliary>
                {windWidgetInfo}
                {methaneGauge}
                <div className="flyto">
                    <img data-tip data-for='flyto' src={flyTo} className="flyto icon" onClick={this.flyTo}/>
                    <ReactTooltip id='flyto' type='light'>
                        <span>Fly To</span>
                    </ReactTooltip>
                </div>

                <Viewer className='viewer'>
                    {this.camera}
                    <GeoJsonDataSource data={this.state.data}
                                       onLoad={dataSource => {
                                           dataSource.entities.values.forEach(e => {
                                               e.billboard = null;
                                               e.point = {
                                                   color: this.state.pointColor,
                                                   pixelSize: 10,
                                                   // outlineColor: Color.WHITE,
                                                   // outlineWidth: 1
                                               };
                                           })
                                       }}
                    >
                    </GeoJsonDataSource>

                    <Entity name="PoMELO pod information" position={this.state.position} point={pointGraphics}>
                        <EntityDescription>
                            <p>{ch4Info}</p>
                            <p>{windDirInfo} </p>
                            <p>{windSpdInfo} </p>
                            <p>{locationInfo}</p>
                            <p>{timeInfo} </p>
                        </EntityDescription>
                    </Entity>

                    <GeoJsonDataSource data={this.state.historicalData}
                                       onLoad={dataSource => {
                                           dataSource.entities.values.forEach(e => {
                                               e.billboard = null;
                                               e.point = {
                                                   color: e.properties.color,
                                                   // color: e.properties.value > 4 ? Color.RED:Color.GREEN,
                                                   pixelSize: 10,
                                                   // outlineColor: Color.WHITE,
                                                   // outlineWidth: 1
                                               };
                                           })
                                       }}
                    >
                    </GeoJsonDataSource>

                    {/*<GeoJsonDataSource data={this.state.polyline} fill={Color.RED}/>*/}
                </Viewer>
            </Auxiliary>
        );
    }
}

export default hot(Map);
