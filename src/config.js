export default {
    'secret': 'tungtung-media-starter/starter',
    'database': 'mongodb://127.0.0.1:27017/media_starter',
    "dbOptions": {
        'db': {'native_parser': true},
        'server': {'poolSize': 5},
        'user': 'tungtung',
        'pass': '123456'
    },
    'port': 3333,
    'domainPublic': 'http://localhost:3333',
    'authApi': 'http://auth-api.tungtung.vn',
    'sessionCookie': 'tungtungtung^5',
    'cookieMaxAge': 900000
}