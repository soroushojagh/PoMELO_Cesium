import React from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoic29yb3VzaG9qYWdoIiwiYSI6ImNqenlwc3czNjFjc2gzY3AwaDJtajQyMDMifQ.A3GX97-C-twRjbG0PmzUrQ"
});

const MiddleBar = () => (
    <div>
        <Map
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
                height: "100vh",
                width: "100vw"
            }}>
            <Layer
                type="symbol"
                id="marker"
                layout={{ "icon-image": "marker-15" }}>
                <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
            </Layer>
        </Map>
    </div>
);

export default MiddleBar;