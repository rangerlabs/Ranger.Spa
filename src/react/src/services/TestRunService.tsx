import RestUtilities, { IRestResponse } from './RestUtilities';
import TestRun from '../models/app/geofences/TestRun';

export default class TestRunService {
    async postTestRun(projectId: string, testRun: TestRun): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectId}/test-runs`, testRun);
    }
}
