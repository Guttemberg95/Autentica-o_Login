require('dotenv').config()

const app = require('./app');
const port = 3002;

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
