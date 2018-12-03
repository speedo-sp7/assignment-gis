let Calls = {
    call(method, url, dtoIn) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        Client[method](url, dtoIn || null, headers);
    },

    getCommandUri(command) {
        return '/' + command;
    },

    /* (UC1) */
    getAllStationsWithinPolygon(dtoIn) {
        let commandUri = Calls.getCommandUri("getAllStationsWithinPolygon");
        Calls.call("post", commandUri, dtoIn);
    },

    /* (UC2) */
    getStationsNearRoute(dtoIn) {
        let commandUri = Calls.getCommandUri("getStationsNearRoute");
        Calls.call("post", commandUri, dtoIn);
    },

    /* (UC3) */
    getStation(dtoIn) {
        let commandUri = Calls.getCommandUri("getStation");
        Calls.call("post", commandUri, dtoIn);
    },

    /* (UC3) */
    getStationAreals(dtoIn) {
        let commandUri = Calls.getCommandUri("getStationAreals");
        Calls.call("post", commandUri, dtoIn);
    },

    /* (UC3) */
    getAllSpecialPlacesNearStation(dtoIn) {
        let commandUri = Calls.getCommandUri("getAllSpecialPlacesNearStation");
        Calls.call("post", commandUri, dtoIn);
    },
};

let Client = {
    get(url, dtoIn, headers) {
        fetch(url, {
            method: 'GET',
            headers: headers,
            body: JSON.stringify(dtoIn.data)
        })
            .then(this.handleErrors)
            .then(res => res.json() )
            .then(data => dtoIn.done(data))
            .catch(error => {
                dtoIn.fail(error);
            });
    },

    post(url, dtoIn, headers) {
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dtoIn.data)
        })
            .then(this.handleErrors)
            .then(res => res.json() )
            .then(data => dtoIn.done(data))
            .catch(error => {
                dtoIn.fail(error);
            });
    },

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
};

export default Calls;