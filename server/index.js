// const express = require('express')
// const cors = require('cors')
// const { connect } = require('mongoose')
// require('dotenv').config()
// const upload = require('express-fileupload')

// const userRoutes = require('./routes/userRoutes')
// const postRoutes = require('./routes/postRoutes')
// const { notFound, errorMiddleware } = require('./middlewares/errorMiddleware')


// const app = express();

// app.use(express.json({ extended: true }))
// app.use(express.urlencoded({ extended: true }))
// app.use(cors({ credentials: true, origin: "https://unbound-blog-client.vercel.app" }))
// app.use(upload())
// app.use('/uploads', express.static(__dirname + '/uploads'))






// app.use('/api/users', userRoutes)
// app.use('/api/posts', postRoutes)

// app.use(notFound)
// app.use(errorMiddleware)

// connect(process.env.MONGODB_URI).then(app.listen(process.env.PORT || 5000, () => console.log(`server started on port ${process.env.PORT}`)))
//     .catch(error => { console.log(error) })


const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "https://unbound-blog-client.vercel.app" }));

// File upload with options for security
app.use(
  upload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    safeFileNames: true, // Enable safe filenames
    preserveExtension: true, // Preserve original file extensions
  })
);

// Serve static files
app.use('/uploads', express.static(__dirname + '/uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use(notFound);
app.use(errorMiddleware);

// MongoDB connection and server start
(async () => {
  try {
    await connect(process.env.MONGODB_URI);
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process on failure
  }
})();
