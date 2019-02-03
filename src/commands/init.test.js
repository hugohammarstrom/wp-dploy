import init from "./init"
import inquirer from "inquirer"
import tmp from "tmp"
import fs from "fs-extra"

inquirer.prompt = jest.fn(() => {
    return Promise.resolve({
        use_wizard: false
    })
})

jest.mock("./../logger")
 

describe("test init command", () => {
    let tmpobj
    beforeAll(() => {
        tmpobj = tmp.dirSync();
        process.chdir(tmpobj.name);

        init() //Run command
    })

    it("should initialize .dployrc.json file with valid json", () => {
        return fs.readFile(".dployrc.json")
            .then((data) => {
                try {
                    JSON.parse(data.toString())
                    return true
                } catch (error) {
                    return false
                }
            })
    })

    it("should add docker-compose file", () => {
        return fs.readFile("docker-compose.yml")
    })

    it("should add php.ini file", () => {
        expect(fs.existsSync("env/data/php/php.ini")).toBe(true)
    })

    it("should setup folder structure", () => {
        expect(fs.existsSync("env/data/mysql")).toBe(true)
        expect(fs.existsSync("env/dnsmasq.conf")).toBe(true)
    })

    afterAll(() => {
        tmpobj.removeCallback()
    })
})