import mongoose from "mongoose";
export const Connect = async () => {
    try{
        console.log(process.env.DB_CONN);
        const conn = await mongoose.connect(`${process.env.DB_CONN}`, {
            dbName : "Split_Buddy"
        });
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to mongo DB");
        })

        connection.on("error", (error) => {
            console.log("Connection failed to mongo DB : " + error);
        })
    }
    catch(e){
        console.log("Failed to connect with database" + e);
    }
}