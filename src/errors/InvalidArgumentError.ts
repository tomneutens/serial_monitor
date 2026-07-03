/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


class InvalidArgumentError extends Error {
    constructor(argumentName: string, expectedFormat: string){
        super(`The argument ${argumentName} does not adhere to the input requirements: ${expectedFormat}`)
    }
}

export default InvalidArgumentError
export { InvalidArgumentError }