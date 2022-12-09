import {msg} from "@lit/localize"
import InvalidArugmentError from "../errors/InvalidArgumentError"

class SerialMonitorConfig {
    displayType = [
        {labelText: msg("dec"), labelValue: "dec"},
        {labelText: msg("bin"), labelValue: "bin"},
        {labelText: msg("oct"), labelValue: "oct"},
        {labelText: msg("hex"), labelValue: "hex"}
    ]
    dataType = [
        {labelText: msg("byte"), labelValue: "byte"},
        {labelText: msg("string"), labelValue: "string"},
    ]
    private rates = ["300", "600", "1200", "2400", "4800", "9600", "14400", "19200", "28800", "38400", "57600", "115200"]
    baudRate = new Array<{labelText:string, labelValue:string}> // init in constructor since no translations
    outputView = [
        {labelText: msg("raw"), labelValue: "raw"},
        {labelText: msg("plot"), labelValue: "plot"},
    ]
    private settingsOptions:{[index: string]: {labelText:string, labelValue:string}[]} = {
        "displayType": this.displayType,
        "dataType": this.dataType,
        "baudRate": this.baudRate,
        "outputView": this.outputView
    }
    selectionIndex: {[index: string]: number} = {displayType: 0, dataType: 0, baudRate: 5, outputView: 0}
    constructor(){
        this.rates.forEach(element => {
            this.baudRate.push({"labelText": element, "labelValue": element})
        });
    }

    getDisplayType(){
        return this.displayType[this.selectionIndex["displayType"]].labelValue;
    }

    getDataType(){
        return this.dataType[this.selectionIndex["dataType"]].labelValue;
    }

    getBaudRate(): string{
        return this.baudRate[this.selectionIndex["baudRate"]].labelValue;
    }

    getOutpuView(){
        return this.outputView[this.selectionIndex["outputView"]].labelValue
    }

    setSetting(setting: string, value: string){
        let values = this.settingsOptions[setting].map( elem => elem.labelValue )
        if (values.includes(value)){
            console.log(`Old settings: 
            displayType: ${JSON.stringify(this.displayType[this.selectionIndex.displayType])}
            dataType: ${JSON.stringify(this.dataType[this.selectionIndex.dataType])}
            baudRate: ${JSON.stringify(this.baudRate[this.selectionIndex.baudRate])}
            outputView: ${JSON.stringify(this.outputView[this.selectionIndex.outputView])}`)
            this.selectionIndex[setting] = values.indexOf(value);
            console.log(`New settings: 
            displayType: ${JSON.stringify(this.displayType[this.selectionIndex.displayType])}
            dataType: ${JSON.stringify(this.dataType[this.selectionIndex.dataType])}
            baudRate: ${JSON.stringify(this.baudRate[this.selectionIndex.baudRate])}
            outputView: ${JSON.stringify(this.outputView[this.selectionIndex.outputView])}`)
        } else {
            throw new InvalidArugmentError("Not a valid setting", `one of ${JSON.stringify(this.settingsOptions)}`)
        }
    }

    setDisplayType(value: string){
        this.setSetting("displayType", value)
    }

    setDataType(value: string){
        this.setSetting("dataType", value)
    }

    setBaudRate(value: string){
        this.setSetting("baudRate", value)
    }

    setOutputView(value: string){
        this.setSetting("outputView", value)
    }

}

export default SerialMonitorConfig