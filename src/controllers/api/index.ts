import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import BookingService from "../../services/booking";

export default class ApiController {
    constructor (private booking: BookingService, private client: any, private mongo: MongoClient) {}

    private getFromRedis = async (id: number) => {
        return await this.client.get(id.toString())
    }

    private setRedis = async (id: number, value: any) => {
        return await this.client.set(id.toString(), value.toString());
    }

    private getOnline = async () => {
        return await this.mongo.db('mongo').collection('online').find({}).toArray();
    }

    private setOnline = async (online: number) => {
        return await this.mongo.db('mongo').collection('online').updateMany({},{$set: { online }}, { upsert: true });
    }

    getFilters = async (req: Request, res: Response) => {
        try {
            const resp = await this.booking.getFilters();
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    book = async (req: Request, res: Response) => {
        try {
            const { user, date_from, date_to, property } = req.body;
            const resp = await this.booking.book(user, date_from, date_to, property);
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    createPost = async (req: Request, res: Response) => {
        try {
            const { user, amenities, country, city, region, bedrooms, price, category } = req.body;
            const resp = await this.booking.createPost(user, amenities, country, city, region, bedrooms, price, category);
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    dropPost = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            const resp = await this.booking.dropPost(Number(id));
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    getPosts = async (req: Request, res: Response) => {
        try {
            const resp = await this.booking.getPost();
            const posts = await Promise.all(resp.map(async (el) => {
                const amenity = await this.booking.getAmenity(el.id);
                const booking = await this.booking.getBooking(el.id);
                const watches = await this.getFromRedis(Number(el.id));

                console.log(watches)
                
                el.watches = watches;
                el.amenity = amenity;
                el.booking = booking;
                return el;
            }));
            res.status(200).json(posts);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    addWatch = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            const currentId = await this.getFromRedis(Number(id));
            await this.setRedis(Number(id), Number(currentId) + 1);
            res.status(200).json(Number(currentId) + 1);
        } catch(err) {
            console.log(err)
        }
    }

    online = async (req: Request, res: Response) => {
        try {
            const current_online = (await this.getOnline())[0]?.online || 0;
            await this.setOnline(current_online + 1)
            res.status(200).json({
                current_online: current_online + 1
            })
        } catch (error) {
            console.log(error);
        }
    }

    ofline = async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}