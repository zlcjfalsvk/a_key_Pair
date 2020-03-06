import crypto, { generateKeyPair } from "crypto";



/**
 * 10 미만의 버전에서 사용한다면 generateKeyPair 지원을 안하여 npm-rsa 모듈을 이용해야한다.
 * 10 버전에서 이용 한다면 createPrivateKey를 지원을 안한다 => 11.6 버전부터 
 */
const a = async (): Promise<{ publicK: string, privateK: string }> => {
    return new Promise((resolve, reject) => {
        generateKeyPair("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem",
              cipher: "aes-256-cbc",
              passphrase: "절대로알면 안되는 키"
            }
          },(err, publicKey, privateKey) => {
            // Handle errors and use the generated key pair.
            resolve({
                publicK: publicKey,
                privateK: privateKey
            });    
          });
    });
};

export default a().then(r => {
    const str: string = "public key로 암호화 해보기";
    console.log(`${str} \r\n`);
    
    console.log("public Key로 암호화");
    const enc = crypto.publicEncrypt(r.publicK, Buffer.from(str));
    const encstr = enc.toString("base64");
    console.log(encstr);

    console.log("\r\n");
    console.log("private Key로 복호화");
    // node 11버전부터 이용 가능
    const key = crypto.createPrivateKey({
        key: r.privateK,
        format: "pem",
        passphrase: "절대로알면 안되는 키"      
    });
    // node 10 버전 대에서는 다음과 같이 직접 Object 형태로 만들어야한다.
    // const key = {
    //     key: r.privateK,
    //     format: "pem",
    //     passphrase: "절대로알면 안되는 키"      
    // };
    const dec = crypto.privateDecrypt(key, Buffer.from(encstr, "base64"));
    const decstr = dec.toString("utf8");
    console.log(decstr);

    
    console.log("---------------------------------------------------");
    console.log("---------------------------------------------------");


    const strp: string = "private key로 암호화 해보기";
    console.log(`${strp} \r\n`);

    console.log("private Key로 암호화");

    const keyp = crypto.createPrivateKey({
        key: r.privateK,
        format: "pem",
        passphrase: "절대로알면 안되는 키"      
    });    

    const dec2 = crypto.privateEncrypt(keyp, Buffer.from(strp));
    const decstr2 = dec2.toString("base64");
    console.log(decstr2);

    console.log("\r\n");

    console.log("public Key로 복호화");
    const enc2 = crypto.publicDecrypt(r.publicK, Buffer.from(decstr2, "base64"));
    const encstr2 = enc2.toString("utf8");
    console.log(encstr2);    


}).catch(err => {
    console.log("에러");
    console.log(err);
});



/**
 * 참고 
 * new Buffer은 deprecated 되어 Buffer.from으로 해야함
 * https://nodejs.org/fr/docs/guides/buffer-constructor-deprecation/
 * 
 * 
 * https://stackoverflow.com/questions/37198831/how-to-load-encrypted-private-key-in-node-js
 * https://stackoverflow.com/questions/54087514/asymmetric-encryption-using-nodejs-crypto-module
 */