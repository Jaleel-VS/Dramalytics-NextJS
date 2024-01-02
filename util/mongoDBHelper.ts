// Class that connects to a mongodb database and runs some queries

import { MongoClient, Db, Collection } from 'mongodb';
import databaseConfig from './dbConfig';
import { Show } from '../types/types';

export class MongoDBHelper {
    private static _instance: MongoDBHelper | null;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collection: Collection | null = null;
    private allShowIds: string[] | null = null;

    private constructor() {
        
    }

    public static async getInstance(): Promise<MongoDBHelper> {
        if (!this._instance) {
            this._instance = new MongoDBHelper();
            await this._instance.connect(); // Ensure connection before returning
        }
        return this._instance;
    }

    private async connect(): Promise<void> {
        try {
            const dbConfig: databaseConfig = new databaseConfig();
            const connectionUri: string | undefined = dbConfig.getConnectionString();
            if (!connectionUri) {
                throw new Error("No connection string");
            }
            this.client = new MongoClient(connectionUri);
            await this.client.connect();
            this.db = this.client.db(dbConfig.DATABASE_NAME);
            this.collection = this.db.collection(dbConfig.COLLECTION_NAME);
            await this.initializeShowIds();
            console.log("Connected to MongoDB");
        } catch (e) {
            console.error(`Failed to connect to MongoDB: ${e}`);
            throw e; // Ensure that errors are thrown for the caller to handle
        }
    }

    private async initializeShowIds(): Promise<void> {
        try {
            if (this.collection) {
                const shows = await this.collection.find({}, { projection: { show_id: 1, _id: 0 } }).toArray();
                this.allShowIds = shows.map(show => show.show_id);
            }
        } catch (e) {
            console.error(`Failed to initialize show IDs: ${e}`);
        }
    }

    public async addShow(showJson: Show): Promise<void> {
        try {
            await this.collection?.insertOne(showJson);
            if (this.allShowIds) {
                this.allShowIds.push(showJson.showId);
            }
        } catch (e) {
            console.error(`Failed to add show: ${e}`);
        }
    }

    public async getShow(showId: string): Promise<any> {
        try {
            return await this.collection?.findOne({ show_id: showId }, { projection: { _id: 0 } });
        } catch (e) {
            console.error(`Failed to retrieve show: ${e}`);
        }
    }

    public getAllShowIds(): string[] | null {
        return this.allShowIds;
    }
}




