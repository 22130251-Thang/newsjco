import { BaseRecord } from "./baserecord.type";

export interface User extends BaseRecord{
    username:string,
    useremail:string,
    password:string
}