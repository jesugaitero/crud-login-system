const app = require('./server');

app.listen(app.get('port'), () => {
    console.log('SERVER RUNNING UNDER PORT:', app.get('port'));
})