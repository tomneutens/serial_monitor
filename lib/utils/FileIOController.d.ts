/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
declare class FileIOController {
    constructor();
    /**
     * Downloads a file with the name "filename" and contents "text" to the user his/her computer.
     * @param {string} filename - the name under which the file should be saved
     * @param {string} text - the contents of the file
     */
    static download(filename: string, text: string): void;
}
export default FileIOController;
//# sourceMappingURL=FileIOController.d.ts.map