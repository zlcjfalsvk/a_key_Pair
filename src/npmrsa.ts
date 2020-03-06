import nodeRSA from "node-rsa";
import crypto from "crypto";

/**
 * 10 미만은 crypto에 generateKeyPair 기능이 없어 npm-rsa 모듈을 이용하면 쉽다.
 */
const key = new nodeRSA({b: 512}).generateKeyPair();    
const publicKey = key.exportKey("pkcs1-public-pem");
const privateKey = key.exportKey("pkcs8-private-pem");

export default ( () => {
    return new Promise((resolve, reject) => {
        const text = "Node-Rsa 모듈을 이용한 테스트";
        // const encrypted = key.encrypt(text, "base64");
        // console.log("encrypted: ", encrypted);
        // const decrypted = key.decrypt(encrypted, "utf8");
        // console.log("decrypted: ", decrypted);

        console.log(text);
        console.log("\r\n");
        console.log("암호화");
        const enc = crypto.publicEncrypt({
            key:publicKey,
            passphrase: "절대로 알면 안되는 키"
        }, Buffer.from(text)).toString("base64");
        console.log(enc);

        console.log("\r\n");
        console.log("복호화");
        const dnc = crypto.privateDecrypt({
            key: privateKey
        }, Buffer.from(enc, "base64")).toString("utf8");
        console.log(dnc);
    });
})();



/**
 * 참고 
 * https://www.npmjs.com/package/node-rsa
 * https://nodejs.org/docs/latest-v8.x/api/crypto.html#crypto_crypto_privatedecrypt_privatekey_buffer
 */