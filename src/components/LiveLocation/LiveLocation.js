//  This component is responsible for requesting the required observations, parsing the JSON object and return the data back to the App component

// The most popular library for requesting the server is axios
import axios from 'axios';

// let thingName = 'PoMELO_Archived_Demo';
let thingName = 'PoMELO_Live';

let dataStreamIDs = [];
let observationID1 = null;
let lat1 = null;
let long1 = null;
let resultValue1 = null;
let phenomenonTime1 = null;

let returnedObject = {
    id: 441757,
    lat: 0,
    long: 0,
    resultValue: 1.97781,
    phenomenonTime: "2019-11-06T17:35:39.341Z"
};

const LiveLocation = async () => {


    let DatastreamID = null;

    let DatastreamID_WndDir = null;
    let DatastreamID_WndSpd = null;

    let observationID = null;
    let lat = null;
    let long = null;
    let resultValue = null;
    let phenomenonTime = null;
    let true_wndSpd = null;
    let true_wndDir = null;

    try {
        // result1 contains information about the desired thing with expanded datastream and select all the ids for all the datastreams
        // While, result2 digs into the first datastream and return back its latest observation
        const result1 = await axios.get("/Things?$filter=substringof('" + thingName + "',name)&$expand=Datastreams($select=id,name)");
        // const result1 = await axios.get("/Things?$filter=substringof('PoMELO_pod_Demo_Test',name)&$expand=Datastreams($select=id)");
        if (result1.data) {
            // The ID of the datastream will be stored in DatastreamID variable
            // As the next step it should return back the ids based on the name of datastream

            //PoMELO_Live
            DatastreamID = result1.data.value[0].Datastreams[0]['@iot.id'];
            DatastreamID_WndDir = result1.data.value[0].Datastreams[4]['@iot.id'];
            DatastreamID_WndSpd = result1.data.value[0].Datastreams[3]['@iot.id'];

            // //PoMELO_Archived_Demo
            // DatastreamID = result1.data.value[0].Datastreams[4]['@iot.id'];
            // DatastreamID_WndDir = result1.data.value[0].Datastreams[2]['@iot.id'];
            // DatastreamID_WndSpd = result1.data.value[0].Datastreams[1]['@iot.id'];


            // //Second Method for different datastreams
            // result1.data.value[0].Datastreams.map(datastream => {
            //     // dataStreamIDs.push({"id":datastream['@iot.id']});
            //     switch (datastream.name) {
            //         case "Ch4_concentration_umol":
            //             dataStreamIDs.push({"name": "Ch4_concentration_umol", "value": datastream['@iot.id']});
            //             break;
            //         case "GPS_latitude":
            //             dataStreamIDs.push({"name": "GPS_latitude", "value": datastream['@iot.id']});
            //             break;
            //         case "GPS_longitude":
            //             dataStreamIDs.push({"name": "GPS_longitude", "value": datastream['@iot.id']});
            //             break;
            //         case "true_wdir":
            //             dataStreamIDs.push({"name": "true_wdir", "value": datastream['@iot.id']});
            //             break;
            //         case "Frame_number":
            //             dataStreamIDs.push({"name": "Frame_number", "value": datastream['@iot.id']});
            //             break;
            //         case "Ch4_concentration_mol":
            //             dataStreamIDs.push({"name": "Ch4_concentration_mol", "value": datastream['@iot.id']});
            //             break;
            //         case "GPS_altitude":
            //             dataStreamIDs.push({"name": "GPS_altitude", "value": datastream['@iot.id']});
            //             break;
            //         case "true_wspd":
            //             dataStreamIDs.push({"name": "true_wspd", "value": datastream['@iot.id']});
            //             break;
            //     }
            // });
            // if (dataStreamIDs) {
            //     dataStreamIDs.map(async datastreamID => {
            //         // console.log("Before: "+ lat1)
            //
            //         if (datastreamID.name == "Ch4_concentration_mol") {
            //             const methaneMoleObservations = await axios.get("/Datastreams(" + datastreamID.value + ")/Observations?$top=1&$expand=FeatureOfInterest/feature");
            //             if (methaneMoleObservations.data) {
            //                 returnedObject.resultValue = methaneMoleObservations.data.value[0].result;
            //                 returnedObject.phenomenonTime = methaneMoleObservations.data.value[0].phenomenonTime;
            //                 returnedObject.id = methaneMoleObservations.data.value[0]['@iot.id'];
            //             }
            //         } else if (datastreamID.name == "GPS_latitude") {
            //             const latitudeObservations = await axios.get("/Datastreams(" + datastreamID.value + ")/Observations?$top=1&$expand=FeatureOfInterest/feature").then(response => {
            //                 returnedObject.lat = Number(response.data.value[0].result);
            //                 // console.log("Inloop: "+ lat1)
            //             });
            //         } else if (datastreamID.name == "GPS_longitude") {
            //             const longitudeObservations = await axios.get("/Datastreams(" + datastreamID.value + ")/Observations?$top=1&$expand=FeatureOfInterest/feature");
            //             if (longitudeObservations.data) {
            //                 returnedObject.long = Number(longitudeObservations.data.value[0].result);
            //             }
            //         }
            //     })
            //     if(returnedObject.id){
            //         return returnedObject
            //     }
            //
            // }

            const result2 = await axios.get("/Datastreams(" + DatastreamID + ")/Observations?$top=1&$expand=FeatureOfInterest/feature");
            const resultWndDir = await axios.get("/Datastreams(" + DatastreamID_WndDir + ")/Observations?$top=1&$expand=FeatureOfInterest/feature");
            const resultWndSpd = await axios.get("/Datastreams(" + DatastreamID_WndSpd + ")/Observations?$top=1&$expand=FeatureOfInterest/feature");
            if (result2.data && resultWndDir.data && resultWndSpd.data) {
                resultValue = result2.data.value[0].result;
                phenomenonTime = result2.data.value[0].phenomenonTime;
                observationID = result2.data.value[0]['@iot.id'];
                lat = Number(result2.data.value[0].FeatureOfInterest.feature.coordinates[0]);
                long = Number(result2.data.value[0].FeatureOfInterest.feature.coordinates[1]);
                true_wndDir = resultWndDir.data.value[0].result;
                true_wndSpd = resultWndSpd.data.value[0].result;
                return ({
                    id: observationID,
                    lat: lat,
                    long: long,
                    resultValue: resultValue,
                    phenomenonTime: phenomenonTime,
                    true_wndDir:true_wndDir,
                    true_wndSpd:true_wndSpd
                });
            }
        }


    } catch (e) {
        console.log(e.message)
    }
}

export default LiveLocation;
