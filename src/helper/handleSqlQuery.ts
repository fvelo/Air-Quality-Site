import conPool from './connectionToDb';

export default function handleSqlQuery (sqlQuery: string, valuesToEscape: any[] = [null]): Promise<any> {
    return new Promise((resolve, reject) => {
        if(valuesToEscape[0] === null){
            conPool.query(sqlQuery, (error: any, results: any[], fields: any) => { // fields is "any" because I don't use it, so I don't care what it is
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }else{
            conPool.query(sqlQuery, valuesToEscape, (error: any, results: any[], fields: any) => { // fields is "any" because I don't use it, so I don't care what it is
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        }
    });
};