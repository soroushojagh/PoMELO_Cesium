import React, {Component} from 'react'
import {Cartesian3, Color} from "cesium";

let historicalData= {
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
};

let emptyData= {
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
};

const addHistoricalPoint = async (archivedJSON,thresholds) => {
    let currentHistoricalPoints = [...historicalData.features];
    await archivedJSON.value.map(observation => {
        let color = null;
        if(observation.result < thresholds[0]){
            color=Color.BLUE;
        }else if (observation.result >= thresholds[0] && observation.result <= thresholds[1]){
            color = Color.ORANGE;
        }else if(observation.result > thresholds[1]) {
            color = Color.RED;
        }
        // Adding the new feature
        currentHistoricalPoints.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [Number(observation.FeatureOfInterest.feature.coordinates[0]), Number(observation.FeatureOfInterest.feature.coordinates[1])]
            },
            properties: {
                value: observation.result,
                color: color
            }
        });

    });
    currentHistoricalPoints.splice(0,1);
    historicalData = {
        type: "FeatureCollection",
            features: currentHistoricalPoints
    };
    return historicalData;
}


const ArchivedData = async (archivedJSON,thresholds) => {
    if(archivedJSON['@iot.count'] == 0 ){
        return emptyData;
    }else {
        let completedJSON = await addHistoricalPoint(archivedJSON,thresholds);
        return completedJSON;
    }

};

export default ArchivedData;
