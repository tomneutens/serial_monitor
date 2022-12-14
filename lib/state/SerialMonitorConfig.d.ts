/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
/// <reference types="w3c-web-serial" />
declare enum SerialMonitorSetting {
    DISPLAY_TYPE = "displayType",
    DATA_TYPE = "dataType",
    BAUD_RATE = "baudRate",
    VIEW = "outputView"
}
declare enum DisplayTypeSetting {
    DEC = "dec",
    BIN = "bin",
    OCT = "oct",
    HEX = "hex"
}
declare enum DataTypeSetting {
    BYTE = "byte",
    STRING = "string"
}
declare enum BaudRateSetting {
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
    RATE_115200 = "115200"
}
declare enum ViewSetting {
    RAW = "raw",
    PLOT = "plot"
}
type SettingsList<T extends string> = {
    labelText: string;
    labelValue: T;
}[];
declare class SerialMonitorConfig {
    displayType: SettingsList<DisplayTypeSetting>;
    dataType: SettingsList<DataTypeSetting>;
    private rates;
    baudRate: SettingsList<BaudRateSetting>;
    outputView: SettingsList<ViewSetting>;
    private settingsOptions;
    selectionIndex: {
        [index: string]: number;
    };
    serialPortFilters: SerialPortFilter[];
    constructor();
    getDisplayType(): DisplayTypeSetting;
    getDataType(): DataTypeSetting;
    getBaudRate(): BaudRateSetting;
    getOutpuView(): ViewSetting;
    getSerialPortFilters(): SerialPortFilter[];
    setSetting(setting: SerialMonitorSetting, value: string): void;
    setDisplayType(value: string): void;
    setDataType(value: string): void;
    setBaudRate(value: string): void;
    setOutputView(value: string): void;
    setSerialPortFilters(filters: SerialPortFilter[]): void;
}
export default SerialMonitorConfig;
export { SerialMonitorSetting, SerialMonitorConfig, DisplayTypeSetting, DataTypeSetting, BaudRateSetting, ViewSetting };
//# sourceMappingURL=SerialMonitorConfig.d.ts.map