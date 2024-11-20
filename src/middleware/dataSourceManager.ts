import { DataSource } from 'typeorm';

let globalDataSource: DataSource | null = null;


export const setDataSource = (dataSource: any): void => {
    globalDataSource = dataSource;
};

export const getDataSource = (): DataSource | null => {
    // if (!globalDataSource) {
    //     throw new Error('DataSource has not been initialized.');
    // }
    return globalDataSource;

};
