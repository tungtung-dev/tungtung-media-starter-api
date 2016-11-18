import bcrypt from 'bcrypt';

const saltRounds = 10;

export default {
    generate: (text) => {
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(text, salt);
        return hash;
    },
    compare: (text, hash) => {
        return bcrypt.compareSync(text, hash);
    }
}