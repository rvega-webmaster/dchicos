import axios from 'axios';

export async function RequestBuilderService(path, payload, method){
    let apiData = null;
    let apiLoader = false;
    let apiError = null;
    let domain = 'https://www.dchicos.com'; //window.location.hostname;
    let requestUrl = '';

    requestUrl = domain + path;

    await axios({
        url: requestUrl,
        method: method,
        data: payload,
        timeout: 20000
    })
        .then((response) => {
            apiData = response;
            apiLoader = false;
        })
        .catch(error => {
            if (error.code === 'ECONNABORTED') {
                console.log('Timeout error: the request took more than 20 seconds.')
            }
            apiError = error;
            apiLoader = false;
        });

    return {apiData, apiError, apiLoader }
}