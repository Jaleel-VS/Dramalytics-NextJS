// Database configuration

class databaseConfig {
    DATABASE_NAME: string = "Dramalytics";
    COLLECTION_NAME: string = "Dramalytics";
    // read from env
    USER_NAME: string | undefined = process.env.DB_USER_NAME;
    PASSWORD: string | undefined = process.env.DB_PASSWORD;
    SERVERLESS_INSTANCE: string = "serverlessinstance0.ksq2r.mongodb.net/?retryWrites=true&w=majority";

    // empty constructor
    constructor() { }

    getConnectionString(): string | undefined {
        if (this.USER_NAME && this.PASSWORD) {
            const encodedUserName = encodeURIComponent(this.USER_NAME);
            const encodedPassword = encodeURIComponent(this.PASSWORD);

            return `mongodb+srv://${encodedUserName}:${encodedPassword}@${this.SERVERLESS_INSTANCE}`;

        }
        return undefined;
    }
}

export default databaseConfig;

const config = new databaseConfig();
const connectionString = config.getConnectionString();

console.log("Connection string:");

if (connectionString) {
    console.log(connectionString);
}
else {
    console.log("No connection string");
}