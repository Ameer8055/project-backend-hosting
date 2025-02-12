const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./DB/connection");
const app = new express();
app.use(morgan('dev'));
app.use(cors());

const AdminRoute = require("./Routes/Adminroute");
const UserRoute = require("./Routes/Userroute");
const VideoRoute = require("./Routes/Videoroute");
const CreatorRoute = require("./Routes/Creatorroute");
const ContinueRoute = require('./Routes/ContinueWatchingRoute');
const ViewerRoute = require('./Routes/viewerroute');
const paymentRoutes = require("./Routes/PaymentRoute");
const commentRoute = require("./Routes/CommentRoute")

app.use('/Admin', AdminRoute);
app.use('/user', UserRoute);
app.use('/Video', VideoRoute);
app.use('/Creator', CreatorRoute);
app.use('/Viewer', ViewerRoute);
app.use('/Playlist', ContinueRoute);
app.use('/Payment', paymentRoutes);
app.use('/Comment', commentRoute);

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
