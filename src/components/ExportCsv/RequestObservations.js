import axios from 'axios';
import moment from 'moment';


let rowNumber;
let columnNumber
const defineArray = async (datastreamInfo, startDate, endDate) => {
    columnNumber = datastreamInfo.length;
    try {
        await axios.get("/Datastreams(" + datastreamInfo[0].id + ")/Observations", {
            params: {
                $expand: 'FeatureOfInterest($select=feature)',
                $filter: `phenomenonTime lt ${endDate} and phenomenonTime gt ${startDate}`
            }
        }).then(response => {
            rowNumber = response.data['@iot.count'];
        });

        let completeArray = [...Array(rowNumber + 1)].map(x => Array(columnNumber).fill(-9999));
        return completeArray;
    } catch (e) {
        console.log(e.message)
    }
}

const RequestObservations = async (datastreamInfo, startDateReceived, endDateReceived) => {
    let endDate = moment(endDateReceived).subtract(7, 'hour').toISOString();
    let startDate = moment(startDateReceived).subtract(7, 'hour').toISOString();

    let completedData = await defineArray(datastreamInfo, startDate, endDate)

    let limit = 1000;
    let repeat = Math.ceil(rowNumber / limit);
    let promises = [];
    for (let index = 0; index < datastreamInfo.length; index++) {
        try {
            let datastream = datastreamInfo[index]
            completedData[0][index] = datastream.name;

            //Using Axios parallel requesting
            for (let i = 1; i <= repeat; i++) {
                let skipValue = (i - 1) * limit;
                let topValue;
                if((i * limit) > rowNumber){
                    topValue = rowNumber - skipValue
                } else {
                    topValue = 1000;
                }
                promises.push( axios.get("/Datastreams(" + datastream.id + ")/Observations?$skip=" + skipValue + "&$top=" + topValue, {
                    params: {
                        $expand: 'FeatureOfInterest($select=feature)',
                        $filter: `phenomenonTime lt ${endDate} and phenomenonTime gt ${startDate}`
                    }
                }));
            }


            // for (let i = 1; i <= repeat; i++) {
            //     let skipValue = (i - 1) * limit;
            //     let topValue = i * limit;
            //     let observations = await axios.get("/Datastreams(" + datastream.id + ")/Observations?$skip=" + skipValue + "&$top=" + topValue, {
            //         params: {
            //             $expand: 'FeatureOfInterest/feature',
            //             $filter: `phenomenonTime lt ${endDate} and phenomenonTime gt ${startDate}&$top=2000`
            //         }
            //     })
            //     if (observations) {
            //         observations.data.value.map((observation, index2) => {
            //             let counter = skipValue + index2 + 1;
            //             completedData[counter][index] = observation.result;
            //         })
            //     }
            // }

        } catch (e) {
            console.log(e.message)
        }
    }
    await axios.all(promises).then(responseArr => {
        for (let i = 0 ; i < datastreamInfo.length; i++){
            for (let j = 0 ; j < repeat; j++){

                for (let index = 1 ; index <= responseArr[(i*repeat)+j].data.value.length ; index ++  ){

                    // console.log('Date created: ', responseArr[(i*repeat)+j].data.value[index-1].result)
                    if((j*limit)+ index > rowNumber){
                        break
                    }else {
                        completedData[(j*limit)+ index][i] = responseArr[(i*repeat)+j].data.value[index-1].result
                    }

                }

            }
        }
        return completedData;
    })
    return completedData
}

export default RequestObservations;
