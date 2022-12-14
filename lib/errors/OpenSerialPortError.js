/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
class OpenSerialPortError extends Error {
    constructor(msg) {
        super(JSON.stringify({
            error: "Unable to open serial port!",
            message: msg
        }));
    }
}
export default OpenSerialPortError;
//# sourceMappingURL=OpenSerialPortError.js.map