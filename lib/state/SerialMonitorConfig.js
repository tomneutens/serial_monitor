/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { msg } from "@lit/localize";
import InvalidArugmentError from "../errors/InvalidArgumentError";
var SerialMonitorSetting;
(function (SerialMonitorSetting) {
    SerialMonitorSetting["DISPLAY_TYPE"] = "displayType";
    SerialMonitorSetting["DATA_TYPE"] = "dataType";
    SerialMonitorSetting["BAUD_RATE"] = "baudRate";
    SerialMonitorSetting["VIEW"] = "outputView";
})(SerialMonitorSetting || (SerialMonitorSetting = {}));
var DisplayTypeSetting;
(function (DisplayTypeSetting) {
    DisplayTypeSetting["DEC"] = "dec";
    DisplayTypeSetting["BIN"] = "bin";
    DisplayTypeSetting["OCT"] = "oct";
    DisplayTypeSetting["HEX"] = "hex";
})(DisplayTypeSetting || (DisplayTypeSetting = {}));
var DataTypeSetting;
(function (DataTypeSetting) {
    DataTypeSetting["BYTE"] = "byte";
    DataTypeSetting["STRING"] = "string";
})(DataTypeSetting || (DataTypeSetting = {}));
var BaudRateSetting;
(function (BaudRateSetting) {
    BaudRateSetting["RATE_300"] = "300";
    BaudRateSetting["RATE_600"] = "600";
    BaudRateSetting["RATE_1200"] = "1200";
    BaudRateSetting["RATE_2400"] = "2400";
    BaudRateSetting["RATE_4800"] = "4800";
    BaudRateSetting["RATE_9600"] = "9600";
    BaudRateSetting["RATE_14400"] = "14400";
    BaudRateSetting["RATE_19200"] = "19200";
    BaudRateSetting["RATE_28800"] = "28800";
    BaudRateSetting["RATE_38400"] = "38400";
    BaudRateSetting["RATE_57600"] = "57600";
    BaudRateSetting["RATE_115200"] = "115200";
})(BaudRateSetting || (BaudRateSetting = {}));
var ViewSetting;
(function (ViewSetting) {
    ViewSetting["RAW"] = "raw";
    ViewSetting["PLOT"] = "plot";
})(ViewSetting || (ViewSetting = {}));
class SerialMonitorConfig {
    constructor() {
        this.displayType = [
            { labelText: msg("dec"), labelValue: DisplayTypeSetting.DEC },
            { labelText: msg("bin"), labelValue: DisplayTypeSetting.BIN },
            { labelText: msg("oct"), labelValue: DisplayTypeSetting.OCT },
            { labelText: msg("hex"), labelValue: DisplayTypeSetting.HEX }
        ];
        this.dataType = [
            { labelText: msg("string"), labelValue: DataTypeSetting.STRING },
            { labelText: msg("byte"), labelValue: DataTypeSetting.BYTE },
        ];
        this.rates = Object.values(BaudRateSetting);
        this.baudRate = new Array; // init in constructor since no translations
        this.outputView = [
            { labelText: msg("raw"), labelValue: ViewSetting.RAW },
            { labelText: msg("plot"), labelValue: ViewSetting.PLOT },
        ];
        this.settingsOptions = {
            [SerialMonitorSetting.DISPLAY_TYPE]: this.displayType,
            [SerialMonitorSetting.DATA_TYPE]: this.dataType,
            [SerialMonitorSetting.BAUD_RATE]: this.baudRate,
            [SerialMonitorSetting.VIEW]: this.outputView
        };
        this.selectionIndex = { displayType: 0, dataType: 0, baudRate: 5, outputView: 0 };
        this.serialPortFilters = [];
        this.rates.forEach(element => {
            this.baudRate.push({ "labelText": element, "labelValue": element });
        });
    }
    getDisplayType() {
        return this.displayType[this.selectionIndex[SerialMonitorSetting.DISPLAY_TYPE]].labelValue;
    }
    getDataType() {
        return this.dataType[this.selectionIndex[SerialMonitorSetting.DATA_TYPE]].labelValue;
    }
    getBaudRate() {
        return this.baudRate[this.selectionIndex[SerialMonitorSetting.BAUD_RATE]].labelValue;
    }
    getOutpuView() {
        return this.outputView[this.selectionIndex[SerialMonitorSetting.VIEW]].labelValue;
    }
    getSerialPortFilters() {
        return this.serialPortFilters;
    }
    setSetting(setting, value) {
        let values = this.settingsOptions[setting].map(elem => elem.labelValue);
        if (values.includes(value)) {
            this.selectionIndex[setting] = values.indexOf(value);
        }
        else {
            throw new InvalidArugmentError("Not a valid setting", `one of ${JSON.stringify(this.settingsOptions)}`);
        }
    }
    setDisplayType(value) {
        this.setSetting(SerialMonitorSetting.DISPLAY_TYPE, value);
    }
    setDataType(value) {
        this.setSetting(SerialMonitorSetting.DATA_TYPE, value);
    }
    setBaudRate(value) {
        this.setSetting(SerialMonitorSetting.BAUD_RATE, value);
    }
    setOutputView(value) {
        this.setSetting(SerialMonitorSetting.VIEW, value);
    }
    setSerialPortFilters(filters) {
        this.serialPortFilters = filters;
    }
}
export default SerialMonitorConfig;
export { SerialMonitorSetting, SerialMonitorConfig, DisplayTypeSetting, DataTypeSetting, BaudRateSetting, ViewSetting };
//# sourceMappingURL=SerialMonitorConfig.js.map