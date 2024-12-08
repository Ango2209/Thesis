const { parentPort, workerData } = require('worker_threads');
const Web3 = require('web3').default;
const contractABI = require('./abi.json');

(async () => {
  const { recordHash, patientId, recordDate, doctorId } = workerData;

  if (!recordHash || !patientId || !recordDate || !doctorId) {
    parentPort.postMessage({
      status: 'error',
      error: 'Invalid input: One or more parameters are missing',
    });
    return;
  }

  const web3 = new Web3(process.env.INFURA_URL);
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY,
  );
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    const data = contract.methods
      .addMedicalRecord(patientId, recordDate, recordHash, doctorId)
      .encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const gas = await web3.eth.estimateGas({
      to: contractAddress,
      data: data,
      from: account.address,
    });

    const tx = {
      to: contractAddress,
      data: data,
      gas: gas,
      gasPrice: gasPrice,
      from: account.address,
    };

    const signed = await web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY,
    );
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

    parentPort.postMessage({
      status: 'success',
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    parentPort.postMessage({
      status: 'error',
      error: error.message,
    });
  }
})();
