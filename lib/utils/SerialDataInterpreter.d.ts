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
declare class SerialDataInterpreter {
    private getDataType;
    private getDisplayType;
    private print;
    private println;
    private readBuffer;
    private radixMap;
    private radixPrefix;
    constructor(getDataType: () => string, getDisplayType: () => string, print: (value: string) => void, println: () => void);
    /** Discard any partially assembled multi-byte value (call on (dis)connect). */
    reset(): void;
    /** Interpret a single incoming byte according to the current data type. */
    interpret(byte: number): void;
    private interpreters;
}
export default SerialDataInterpreter;
//# sourceMappingURL=SerialDataInterpreter.d.ts.map