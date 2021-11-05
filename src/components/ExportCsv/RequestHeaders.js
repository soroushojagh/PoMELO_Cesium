
import axios from 'axios';
import moment from 'moment';


const RequestHeaders = async () => {
    //let thingName = 'PoMELO_pod_Demo_Test';
    // let thingName = 'PoMELO_Archived_Demo';
    let thingName = 'PoMELO_Live';

    let datastreamInfo = [];
    try{
        const allDatastreams = await axios.get("/Things?$filter=substringof('" + thingName + "',name)&$expand=Datastreams($select=id,name)");
        if (allDatastreams.data) {
            allDatastreams.data.value[0].Datastreams.map(datastream => {
                datastreamInfo.push({"id":datastream['@iot.id'] ,"name":datastream.name})
            });
            return(datastreamInfo)
        }
    }catch (e) {
        console.log(e.message)
    }
}

export default RequestHeaders;
