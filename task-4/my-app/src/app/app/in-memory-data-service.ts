import {InMemoryDbService} from 'angular-in-memory-web-api';

import * as employees from '../../assets/data/data.json';

export class InMemoryDataService implements InMemoryDbService{
    createDb(){
        return { employees:employees }
    }
}