/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


class InvalidArugmentError extends Error {
    constructor(argumentName: string, expectedFormat: string){
        super(`The argument ${argumentName} does not adhere to the input requirements: ${expectedFormat}`)
    }
}

export default InvalidArugmentError