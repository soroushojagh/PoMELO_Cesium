//  This component is responsible for requesting the required observations, parsing the JSON object and return the data back to the App component

// The most popular library for requesting the server is axios
import axios from 'axios';
import moment from 'moment';


const ExportDataSTA = async (startDate,endDate) => {
    // let thingName = 'PoMELO_pod_Demo_Test';
    // let thingName = 'PoMELO_Archived_Demo';
    let thingName = 'PoMELO_Live';

    let DatastreamID = null;
    let filterStatement = "$filter=phenomenonTime ge '" + startDate + "' and phenomenonTime lt '" + endDate + "'";
    // console.log(filterStatement)
    let observationID = null;
    let lat = null;
    let long = null;
    let resultValue = null;
    let phenomenonTime = null;

    try{
        // result1 contains information about the desired thing with expanded datastream and select all the ids for all the datastreams
        // While, result2 digs into the first datastream and return back its latest observation
        const result1 = await axios.get("/Things?$filter=substringof('" + thingName + "',name)&$expand=Datastreams($select=id)");
        // const result1 = await axios.get("/Things?$filter=substringof('PoMELO_pod_Demo_Test',name)&$expand=Datastreams($select=id)");
        if (result1.data) {
            // The ID of the datastream will be stored in DatastreamID variable
            // As the next step it should return back the ids based on the name of datastream

            // // PoMELO_Archived_Demo
            // DatastreamID = result1.data.value[0].Datastreams[4]['@iot.id'];

            // PoMELO_Live
            DatastreamID = result1.data.value[0].Datastreams[0]['@iot.id'];

            const result2 = await axios.get("/Datastreams(" + DatastreamID + ")/Observations",{
                params:{
                    $expand:'FeatureOfInterest/feature',
                    $filter:`phenomenonTime lt ${endDate} and phenomenonTime gt ${startDate}&$top=2000`
                }
            });
            return result2.data
        }
    }catch (e) {
        console.log(e.message)
    }
}

export default ExportDataSTA;
