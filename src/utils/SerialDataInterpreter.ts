/**
 * @author Tom Neutens <tomneutens@gmail.com>
 *
 * Converts a stream of raw serial bytes into human readable log entries.
 *
 * The interpretation depends on the currently selected data type (string / byte / int / long)
 * and display type (dec / bin / oct / hex). Both are read lazily through the supplied accessors so
 * that changing a setting takes effect immediately. Decoded output is pushed to the host through the
 * `print` (append to current line) and `println` (start a new line) callbacks, keeping this class free
 * of any UI/DOM concerns.
 */
class SerialDataInterpreter {
    private readBuffer: number[] = [];
    private radixMap: { [index: string]: number } = {
        "bin": 2,
        "oct": 8,
        "dec": 10,
        "hex": 16
    };
    private radixPrefix: { [index: string]: string } = {
        "bin": "0b",
        "oct": "0",
        "dec": "",
        "hex": "0x"
    };

    constructor(
        private getDataType: () => string,
        private getDisplayType: () => string,
        private print: (value: string) => void,
        private println: () => void
    ) {}

    /** Discard any partially assembled multi-byte value (call on (dis)connect). */
    reset(): void {
        this.readBuffer = [];
    }

    /** Interpret a single incoming byte according to the current data type. */
    interpret(byte: number): void {
        const handler = this.interpreters[this.getDataType()];
        if (handler) {
            handler(byte);
        }
    }

    private interpreters: { [index: string]: (value: number) => void } = {
        "string": (value: number) => {
            let strValue = String.fromCharCode(value);
            if (strValue == "\r") return; // Ignore carriage return
            if (strValue == "\n") {
                this.println();
            } else {
                this.print(strValue);
            }
        },
        "byte": (value: number) => {
            this.print(this.radixPrefix[this.getDisplayType()] + value.toString(this.radixMap[this.getDisplayType()]));
            this.println();
        },
        "int": (value: number) => {  // Javascript uses 32 bit integers, Arduino 16 bit integers => padding required
            this.readBuffer.push(value);
            if (this.readBuffer.length >= 2) {
                let bytes = this.readBuffer;
                this.readBuffer = [];
                let sign = bytes[0] & (1 << 7);
                let combined = ((bytes[0] & 0xFF) << 8) | (bytes[1] & 0xFF);
                combined = sign ? 0xFFFF0000 & combined : combined;  // Add ones to beginning for sign in two complement representation
                this.print(combined.toString(this.radixMap[this.getDisplayType()]));
                this.println();
            }
        },
        "long": (value: number) => {
            this.readBuffer.push(value);
            if (this.readBuffer.length >= 4) {
                let bytes = this.readBuffer;
                this.readBuffer = [];
                let combined = ((bytes[0] & 0xFF) << 24) | ((bytes[1] & 0xFF) << 16) | ((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF);
                this.print(combined.toString(this.radixMap[this.getDisplayType()]));
                this.println();
            }
        }
    };
}

export default SerialDataInterpreter;
