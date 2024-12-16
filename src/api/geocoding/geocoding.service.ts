import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Place = {
    placeId: number
    licence: string
    name: string
    displayName: string
    lat: number
    lng: number
}

@Injectable()
export class GeocodingService {

    async search(query: string) {
        return axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`)
            .then(e => e.data)
            .then(e => e.map(({ place_id, name, licence, display_name, lat, lon }) => ({
                placeId: place_id,
                licence,
                name,
                displayName: display_name,
                lat: +lat,
                lng: +lon,
            })))
    }

    async reverse(lat: number, lng: number): Promise<Place> {
        return axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=13&addressdetails=0&oceans=1&accept-language=id&format=json`)
            .then(e => e.data)
            .then(({ place_id, name, licence, display_name, lat, lon }) => ({
                placeId: place_id,
                licence,
                name,
                displayName: display_name,
                lat: +lat,
                lng: +lon,
            }))
    }
}
