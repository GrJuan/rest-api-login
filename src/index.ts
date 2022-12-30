import { AppDataSource } from "./data-source"
import * as express from "express";
import routes from "./routes";


const PORT = process.env.PORT || 8030

AppDataSource.initialize().then(async () => {

     // create express app
     const app = express();
     app.use(express.json());

     //RUTAS
     app.use('/', routes);
     
     app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
    // console.log("Inserting a new user into the database...")
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
