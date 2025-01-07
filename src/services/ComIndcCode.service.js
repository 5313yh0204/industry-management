import http from '../http-common';

class ComIndcCodeService {
    getAll(data) {
        console.log('=====IndcCodeService====getAll');
        return http.post('/indcListAll', data);
    }
    saveIndc(data) {
        console.log('=====IndcCodeService====saveIndc');
        console.log(data);
        return http.post('/saveIndc', data);
    }

    updateIndc(data) {
        console.log('=====IndcCodeService====updateIndc');
        return http.post('/updateIndc', data);
    }

    deleteIndc(data) {
        console.log('=====IndcCodeService====deleteIndc');
        return http.post('/deleteIndc', data);
    }
}

export default new ComIndcCodeService();
