const midtransClient = require("midtrans-client");
const snap = new midtransClient.Snap({
    isProducions: false,
    serverKey: "SB-Mid-server-WaAS3iCPDOFK0WhAK1KtysMO",
    clientKey: "SB-Mid-client-OHcs5afUmRBuLFzB",
})
module.exports = {
    post: (data) => new Promise((resolve, reject) =>{
        let parameter = {
            transaction_details: {
                order_id: data.id,
                gross_amount: data.total,
            }, credit_card:{
                secure : true
            }
        }; 
        snap.createTransaction(parameter)
            .then((transaction)=>{
                // transaction token
                let transactionToken = transaction.token;
                console.log(transaction);
                console.log('transactionToken:',transactionToken);
                resolve(transaction);
            }).catch((error) => {
                reject(error);
            });
    }),
    notif : (data)=> new Promise((resolve,reject) =>{
    snap.transaction.notification(data)
    .then((statusResponse)=>{
        console.log(statusResponse);
        resolve(statusResponse);
    }).catch((error) => {
        reject(error);
        });
    }),
}