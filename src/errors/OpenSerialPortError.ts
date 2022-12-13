/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


class OpenSerialPortError extends Error {
    constructor(msg: string){
        super(JSON.stringify({
            error: "Unable to open serial port!",
            message: msg
        }))
    }
}

export default OpenSerialPortError