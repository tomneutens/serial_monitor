/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
class FileIOController {
    constructor() {
    }
    /**
     * Downloads a file with the name "filename" and contents "text" to the user his/her computer.
     * @param {string} filename - the name under which the file should be saved
     * @param {string} text - the contents of the file
     */
    static download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
export default FileIOController;
//# sourceMappingURL=FileIOController.js.map