import crypto from 'crypto';

class CryptoService { // Singleton
    private readonly inputEncoding: BufferEncoding = 'utf8';
    private readonly outputEncoding: BufferEncoding = 'hex';
    constructor() { }
    get algorithm() {
        const algorithm = process.env.ENCRYPTION_ALGORITHM;
        if (!algorithm) {
            throw new Error('Encryption algorithm is not defined in environment variables.');
        }
        return algorithm;
    }
    get key() {
        const key = process.env.CRYPTO_KEY;
        if (!key) {
            throw new Error('Encryption key is not defined in environment variables.');
        }
        return key;
    }
    encrypt(data: string) {
        const iv = crypto.randomBytes(8).toString('hex');
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const encrypted = cipher.update(data, this.inputEncoding, this.outputEncoding) + cipher.final(this.outputEncoding);
        return encrypted + ':' + iv;
    }
    decrypt(encryptedData: string) {
        const [encrypted, iv] = encryptedData.split(':');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        const decrypted = decipher.update(encrypted, this.outputEncoding, this.inputEncoding) + decipher.final(this.inputEncoding);
        return decrypted;
    }
}

export default new CryptoService();