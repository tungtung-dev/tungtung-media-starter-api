import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default {
    generate: (text) => {
        var salt = bcrypt.genSaltSync(SALT_ROUNDS);
        return bcrypt.hashSync(text, salt);

    },
    compare: (text, hash) => {
        return bcrypt.compareSync(text, hash);
    }
}