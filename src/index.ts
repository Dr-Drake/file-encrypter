#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import { decrypt, encrypt } from './encryption';

function welcome() {
    console.log(`
        Hello there!
        Thanks for using file-encrypter
    `)
}

async function askForOperation(){
    const answers = await inquirer.prompt([
        {
            name: 'operation',
            type: 'list',
            message: 'What operation would you like to perform?',
            choices: [
                'Encryption',
                'Decryption'
            ]
        }
    ]);

    if (answers.operation === "Encryption") {
        let encryptionAnswers = await inquirer.prompt([
            {
                name: 'filePath',
                type: 'input',
                message: 'Enter the path to the file you will like to encrypt: ',
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter a password to use to lock the file: ',
            },
            {
                name: 'confirmPassword',
                type: 'password',
                message: 'Confirm the password: ',
            }
        ]);

        // console.log(encryptionAnswers);

        if (encryptionAnswers.password !== encryptionAnswers.confirmPassword) {
            console.log(chalk.red("Password did not match :("));
            process.exit(0);
        }

        let outputAnswers = await inquirer.prompt({
            name: 'filePath',
            type: 'input',
            message: 'Enter the path to output your file: ',
            // default: `${encryptionAnswers.filePath}`
        })

        //File encryption
        try {
            encrypt({
                filePath: encryptionAnswers.filePath,
                password: encryptionAnswers.password,
                outputPath: outputAnswers.filePath
            })
        } catch (error: any) {
            if (error?.message) {
                console.log('\n');
                console.log(chalk.red(error?.message));
                process.exit(1);
            }
            else{
                console.log('\n');
                console.log(chalk.red(error));
                process.exit(1);
            }
        }

    }

    if (answers.operation === "Decryption") {
        let decryptionAnswers = await inquirer.prompt([
            {
                name: 'filePath',
                type: 'input',
                message: 'Enter the path to the file you will like to decrypt: ',
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter the password used to lock the file: ',
            },
            {
                name: 'outputfilePath',
                type: 'input',
                message: 'Enter the path to output your file: ',
            },

        ]);

        //File decryption
        try {
            decrypt({
                filePath: decryptionAnswers.filePath,
                password: decryptionAnswers.password,
                outputPath: decryptionAnswers.outputfilePath
            })
        } catch (error: any) {
            if (error?.message) {
                console.log('\n');
                console.log(chalk.red(error?.message));
                process.exit(1);
            }
            else{
                console.log('\n');
                console.log(chalk.red(error));
                process.exit(1);
            }
        }

    }


}

// Run app
welcome();
askForOperation();
