const app = require('./server');

app.listen(app.get('port'), () => {
    console.log('SERVER RUNNING SUCCCES UNDER PORT:', app.get('port'));
})