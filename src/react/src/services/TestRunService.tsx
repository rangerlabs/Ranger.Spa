import RestUtilities, { IRestResponse } from './RestUtilities';
import TestRun from '../models/app/geofences/TestRun';

export default class TestRunService {
    async postTestRun(projectName: string, testRun: TestRun): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectName}/test-runs`, testRun);
    }
}
