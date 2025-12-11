import * as fs from "fs"

export function checkIfExists(dataPath:string):boolean{
    return fs.existsSync(dataPath)
}