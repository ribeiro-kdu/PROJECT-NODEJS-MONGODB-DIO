import { URLModel } from 'database/model/URL'
import { Request, response, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            response.json(url)
            return
        }
    
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        response.json(newURL)
    }

    public async redirect(req: Request, res: Response): Promise<void> {
        // Pegar hash da URL
        const { hash } = req.params
        const url = URLModel.findOne({ hash })
        // Encontrar a URL original pelo hash
        if (url) {
            response.redirect(url.originURL)
            return
        }

        response.status(400).json({ error: 'URL not found' })

        // const url = {
        //     originURL: "https://cloud.mongodb.com/v2/62bc3f769437540762e123a2#clusters",
        //     hash: "CUSD3DgEb",
        //     shortURL: "http://localhost:5000/USD3DgEb",
        // }
        // Redirecionar para a URL original a partir do que encontramos no DB
        
    }
}