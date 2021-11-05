import React, { useEffect } from 'react';

const location = (location) => {
    // let id = location.id;
    // console.log(location);
    return({id: location.id + 1 , lat: location.lat + 0.00001 ,long:location.long + 0.00001});
}

export default location;