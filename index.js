const solanaWeb3 = require('@solana/web3.js');

const secret = new Uint8Array([192,147,150,141,14,153,106,37,250,223,102,102,117,36,197,3,47,111,222,220,45,74,11,190,182,150,84,71,180,98,198,155,161,83,51,226,155,30,67,60,197,26,97,224,208,198,251,144,41,160,209,92,120,177,73,206,91,99,210,106,149,49,29,32]);
const keypair = solanaWeb3.Keypair.fromSecretKey(secret);
const rpcUrl = "https://api.devnet.solana.com";

const connection = new solanaWeb3.Connection(rpcUrl);

async function transferTask() {
    await connection.requestAirdrop(keypair.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
    let transaction = new solanaWeb3.Transaction();

    transaction = transaction.add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: "HtUaVzWiSNrrY2NSVKroE3883vnBfn8SMrLM2UxA2vDy",
            lamports: solanaWeb3.LAMPORTS_PER_SOL
        })
    );

    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [keypair]);
}

transferTask();