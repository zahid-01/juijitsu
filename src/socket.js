import {io} from 'socket.io-client';
import { BASE_URI } from './Config/url';
export let socket;
export const socketConnect = (token = null)=>{
    console.log(token)
    try{
        socket = io(`${BASE_URI}/?token=${token}`)
    }catch(e){
        console.log(e);
    }
}