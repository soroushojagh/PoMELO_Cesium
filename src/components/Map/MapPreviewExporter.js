// This component is responsible for visualizing the observations on the map

import React from 'react';
import './Map.css';
import {Color} from "cesium";
import {Cartesian3} from "cesium";
import {Viewer, Entity, EntityDescription, PointGraphics, GeoJsonDataSource, CameraFlyTo} from "resium";
import {hot} from "react-hot-loader/root";
import Auxiliary from '../../hoc/Auxiliary';
import DialogBox from "../DialogBox/DialogBox";
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import flyTo from '../../assets/flyTo.png'



const pointGraphics = {pixelSize: 50, color: new Color(1, 1, 1, 0.1)};


class MapPreviewExporter extends React.Component {
    camera;
    constructor(props) {
        super(props);
        this.state = {
            thresholds: [2.5,4],
            previewStatus: false,
            data: {
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
        if (nextProps.thresholds[0] != this.state.thresholds[0] || nextProps.thresholds[1] != this.state.thresholds[1]) {
            this.setState({
                thresholds: nextProps.thresholds,
            })
        }
        if (nextProps.archivedData && nextProps.archivedData != this.state.data) {
            this.setState({data: nextProps.archivedData})
        }
        if (nextProps.previewStatus != this.state.previewStatus) {
            this.setState({previewStatus: nextProps.previewStatus})

        }
    }
    flyTo = () => {
        if (this.state.data.features[0].geometry.coordinates[0] != 0) {
            this.camera = <CameraFlyTo duration={2}
                                       destination={Cartesian3.fromDegrees(this.state.data.features[0].geometry.coordinates[0], this.state.data.features[0].geometry.coordinates[1], 1000)}/>;
        } else
            this.camera = null
    }
    render() {

        return (
            <Auxiliary>
                <div className="flyto">
                    <img data-tip data-for='flyto' src={flyTo} className="flyto icon" onClick={this.flyTo}/>
                    <ReactTooltip id='flyto' type='light'>
                        <span>Fly To</span>
                    </ReactTooltip>
                </div>
                <Viewer className='viewer'>
                    {this.camera}
                    {this.state.previewStatus ? <GeoJsonDataSource data={this.state.data}
                                                                   onLoad={dataSource => {
                                                                       dataSource.entities.values.forEach(e => {
                                                                           e.billboard = null;
                                                                           e.point = {
                                                                               color: e.properties.color,
                                                                               pixelSize: 10,
                                                                           };
                                                                       })
                                                                   }}
                    >
                    </GeoJsonDataSource> : null}
                </Viewer>
            </Auxiliary>
        );
    }
}

export default hot(MapPreviewExporter);
