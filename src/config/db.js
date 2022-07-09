 const config =  {
    HOST: 'localhost',
    PORT: '27017',
    DATABASE: 'authdb'
}

export const mongoURL = `mongodb://${config.HOST}:${config.PORT}/${config.DATABASE}`