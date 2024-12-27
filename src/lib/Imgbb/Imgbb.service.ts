import { Injectable } from '@nestjs/common';
import axios from 'axios';
import sharp from 'sharp';

@Injectable()
export class ImgbbService {
    private apiURL = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_APIKEY}`

    async getDimention(image: string) {
        return sharp(Buffer.from(image.split(';base64,').pop() as string, 'base64'))
            .metadata()
            .then(({ width, height }) => ({
                width: width!, height: height!,
            }))

    }

    async uploadPhoto(base64image: string[]) {
        return Promise.all(base64image.map(async (image) => {
            const dimention = await this.getDimention(image)
            const formData = new FormData();
            formData.append('image', image.split(';base64,').pop()!);

            const imbggResponse = await axios({
                method: 'post',
                url: this.apiURL,
                data: formData,
                headers: { 'content-type': 'multipart/form-data' },
            })

            return {
                ...dimention,
                imageUrl: imbggResponse.data.data.url as string
            }
        }))
    }
}
