import bcrypt from 'bcrypt';

export function isPasswordCorrect(plain: string , hashPassword: string) {
    return bcrypt.compareSync(plain, hashPassword);
}

export function hashPassword(plainPassword: string) {
    return bcrypt.hashSync(plainPassword, 10);
}