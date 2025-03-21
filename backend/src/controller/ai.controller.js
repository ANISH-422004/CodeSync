import { generateResult } from "../services/gemini.service.js"

export const getResult = async(req, res) => {
    try {
        const {prompt} = req.query
        const result = await generateResult(prompt)
        res.send(result)


    } catch (error) {
        console.log(error)
        res.status(500).send({message : error.message})
    }


}