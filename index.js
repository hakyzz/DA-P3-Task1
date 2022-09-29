import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import { Keypair, Connection, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';

const secret = new Uint8Array([192,147,150,141,14,153,106,37,250,223,102,102,117,36,197,3,47,111,222,220,45,74,11,190,182,150,84,71,180,98,198,155,161,83,51,226,155,30,67,60,197,26,97,224,208,198,251,144,41,160,209,92,120,177,73,206,91,99,210,106,149,49,29,32]);
const keypair = Keypair.fromSecretKey(secret);
const rpcUrl = "https://api.devnet.solana.com";

const connection = new Connection(rpcUrl);

const toWallet = new PublicKey("HtUaVzWiSNrrY2NSVKroE3883vnBfn8SMrLM2UxA2vDy");

async function transferTask() {
    await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
    let transaction = new Transaction();

    transaction = transaction.add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: toWallet,
            lamports: LAMPORTS_PER_SOL
        })
    );

    await sendAndConfirmTransaction(connection, transaction, [keypair]);
}

async function instructionsTask() {
    let transaction = new Transaction();

    transaction = transaction.add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: toWallet,
            lamports: LAMPORTS_PER_SOL / 10
        })
    );

    let solTransferHash = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    console.log("Sol transfer: ", solTransferHash);

    const mint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        9
    );

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey
    )

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, 
        keypair, 
        mint, 
        toWallet
    );

    let mintSignature = await mintTo(
        connection,
        keypair,
        mint,
        tokenAccount.address,
        keypair.publicKey,
        100000000000 
    )
    console.log('Mint tx:', mintSignature);

    let tokenTransfer = await transfer(
        connection,
        keypair,
        tokenAccount.address,
        toTokenAccount.address,
        keypair.publicKey,
        LAMPORTS_PER_SOL / 10
    )

    console.log("Token Transfer: ", tokenTransfer);
}

transferTask();
instructionsTask();