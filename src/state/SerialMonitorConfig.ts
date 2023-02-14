/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import {msg} from "@lit/localize"
import InvalidArugmentError from "../errors/InvalidArgumentError"


enum SerialMonitorSetting {
    DISPLAY_TYPE = "displayType",
    DATA_TYPE = "dataType",
    BAUD_RATE = "baudRate",
    VIEW = "outputView"
}

enum DisplayTypeSetting {
    DEC = "dec", 
    BIN = "bin",
    OCT = "oct",
    HEX = "hex"
}

enum DataTypeSetting {
    BYTE = "byte",
    STRING = "string"
}

enum BaudRateSetting {
    RATE_300 = "300",
    RATE_600 = "600",
    RATE_1200 = "1200",
    RATE_2400 = "2400",
    RATE_4800 = "4800",
    RATE_9600 = "9600",
    RATE_14400 = "14400",
    RATE_19200 = "19200",
    RATE_28800 = "28800",
    RATE_38400 = "38400",
    RATE_57600 = "57600",
    RATE_115200 = "115200",
}

enum ViewSetting {
    RAW = "raw", 
    PLOT = "plot"
}

type SettingsList<T extends string> = {labelText: string, labelValue: T}[]

class SerialMonitorConfig {
    
    displayType: SettingsList<DisplayTypeSetting> = [
        {labelText: msg("dec"), labelValue: DisplayTypeSetting.DEC},
        {labelText: msg("bin"), labelValue: DisplayTypeSetting.BIN},
        {labelText: msg("oct"), labelValue: DisplayTypeSetting.OCT},
        {labelText: msg("hex"), labelValue: DisplayTypeSetting.HEX}
    ]
    dataType: SettingsList<DataTypeSetting> = [
        {labelText: msg("string"), labelValue: DataTypeSetting.STRING},
        {labelText: msg("byte"), labelValue: DataTypeSetting.BYTE},
    ]
    private rates = Object.values(BaudRateSetting) 
    baudRate: SettingsList<BaudRateSetting> = new Array<{labelText:string, labelValue:BaudRateSetting}> // init in constructor since no translations
    outputView: SettingsList<ViewSetting> = [
        {labelText: msg("raw"), labelValue: ViewSetting.RAW},
        {labelText: msg("plot"), labelValue: ViewSetting.PLOT},
    ]
    private settingsOptions: Record<SerialMonitorSetting, SettingsList<string>> = {
        [SerialMonitorSetting.DISPLAY_TYPE]: this.displayType,
        [SerialMonitorSetting.DATA_TYPE]: this.dataType,
        [SerialMonitorSetting.BAUD_RATE]: this.baudRate,
        [SerialMonitorSetting.VIEW]: this.outputView
    }
    selectionIndex: {[index: string]: number} = {displayType: 0, dataType: 0, baudRate: 5, outputView: 0}

    serialPortFilters: SerialPortFilter[] = [];

    constructor(){
        this.rates.forEach(element => {
            this.baudRate.push({"labelText": element, "labelValue": element})
        });
    }

    getDisplayType(): DisplayTypeSetting{
        return this.displayType[this.selectionIndex[SerialMonitorSetting.DISPLAY_TYPE]].labelValue;
    }

    getDataType(): DataTypeSetting{
        return this.dataType[this.selectionIndex[SerialMonitorSetting.DATA_TYPE]].labelValue;
    }

    getBaudRate(): BaudRateSetting{
        return this.baudRate[this.selectionIndex[SerialMonitorSetting.BAUD_RATE]].labelValue;
    }

    getOutpuView(): ViewSetting{
        return this.outputView[this.selectionIndex[SerialMonitorSetting.VIEW]].labelValue
    }

    getSerialPortFilters(): SerialPortFilter[]{
        return this.serialPortFilters;
    }

    setSetting(setting: SerialMonitorSetting, value: string){
        let values = this.settingsOptions[setting].map( elem => elem.labelValue )
        if (values.includes(value)){
            this.selectionIndex[setting] = values.indexOf(value);
        } else {
            throw new InvalidArugmentError("Not a valid setting", `one of ${JSON.stringify(this.settingsOptions)}`)
        }
    }

    setDisplayType(value: string){
        this.setSetting(SerialMonitorSetting.DISPLAY_TYPE, value)
    }

    setDataType(value: string){
        this.setSetting(SerialMonitorSetting.DATA_TYPE, value)
    }

    setBaudRate(value: string){
        this.setSetting(SerialMonitorSetting.BAUD_RATE, value)
    }

    setOutputView(value: string){
        this.setSetting(SerialMonitorSetting.VIEW, value)
    }

    setSerialPortFilters(filters: SerialPortFilter[]){
        this.serialPortFilters = filters
    }

}

export default SerialMonitorConfig

export { SerialMonitorSetting, SerialMonitorConfig, DisplayTypeSetting, DataTypeSetting, BaudRateSetting, ViewSetting }