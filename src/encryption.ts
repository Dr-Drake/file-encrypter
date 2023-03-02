import { CipherCCMTypes, createCipheriv, createDecipheriv, scryptSync } from "crypto";
import fs from 'fs';
import cliProgress from 'cli-progress';
import progress from 'progress-stream';

// Instance variables
const DEFAULT_ALGORITHM = 'aes-192-cbc';
const iv = Buffer.alloc(16,0);

// Types
export interface EncryptConfig{
    filePath: string;
    outputPath: string;
    password: string;
}

export function encrypt(config: EncryptConfig) {

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    // Configs
    let { password, filePath, outputPath } = config


    // Check if file exists
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        throw new Error("We could not find the file you entered");
    }

    // Prompt user that process has begun
    console.log("Encrypting file...");
    progressBar.start(100, 0);

    // Set up progress stream
    let stat = fs.statSync(filePath);
    let str = progress({
        length: stat.size,
        time: 100 /* ms */
    });
    str.on('progress', (prog)=>{
        progressBar.update(Math.ceil(prog.percentage));
    })

    // Write Stream
    const outputFileStream = fs.createWriteStream(outputPath);

    // Read stream
    let readstream = fs.createReadStream(filePath);

    /** Create cipher */
    let key = scryptSync(password, 'salt', 24);
    const cipher = createCipheriv(DEFAULT_ALGORITHM, key, iv);

    /** Encrypt file */
    readstream.pipe(cipher).pipe(str).pipe(outputFileStream);

    outputFileStream.on('close', ()=>{
        progressBar.stop();
        console.log("Your encrypted file is ready at: ", outputFileStream.path);
    })

}

export function decrypt(config: EncryptConfig) {

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    // Configs
    let { password, filePath, outputPath } = config

    console.log(config);

    // Check if file exists
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        throw new Error("We could not find the file you entered");
    }

    // Prompt user that process has begun
    console.log("Decrypting file...");
    progressBar.start(100, 0);

    // Set up progress stream
    let stat = fs.statSync(filePath);
    let str = progress({
        length: stat.size,
        time: 100 /* ms */
    });
    str.on('progress', (prog)=>{
        progressBar.update(Math.ceil(prog.percentage));
    })

    // Write Stream
    const outputFileStream = fs.createWriteStream(outputPath);

    // Read stream
    let readstream = fs.createReadStream(filePath);

    /** Create cipher */
    let key = scryptSync(password, 'salt', 24);
    const decipher = createDecipheriv(DEFAULT_ALGORITHM, key, iv);

    /** Encrypt file */
    readstream.pipe(decipher).pipe(str).pipe(outputFileStream);

    outputFileStream.on('close', ()=>{
        progressBar.stop();
        console.log("Your decrypted file is ready at: ", outputFileStream.path);
    })

}