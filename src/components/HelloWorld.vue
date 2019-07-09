<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <button v-on:click="connectLedger">Connect Ledger</button>
  </div>
</template>

<script>
import NemH from "./hw-app-nem";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import nem from "nem-sdk";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    connectLedger() {
      this.createWallet(104)
      .then(wallet => {
        window.opener.postMessage({ message: "getAccountResult", result: wallet }, "*");
        window.close();
      })
      .catch(error => {
        console.log('error: ' + error);
      });
    },

    RunCallbackFunction(wallet) {
      window.opener.
      console.log('RunCallbackFunction()');
    },

    createWallet(network) {
        return this.createAccount(network, 0, "Primary")
            .then((account) => ({
                "name": "LEDGER",
                "accounts": {
                    "0": account
                }
            }))
            .catch(err => {
                throw err;
            });
    },

    bip44(network, index) {
        // recognize networkId by bip32Path;
        // "44'/43'/networkId'/walletIndex'/accountIndex'"
        const networkId = network == -104 ? 152 : 104;
        return (`44'/43'/${networkId}'/${index}'/0'`);
    },

    async createAccount(network, index, label) {
        const hdKeypath = this.bip44(network, index);
        const result = await this.getAccount(hdKeypath, network, label);
        return result;
    },

    deriveRemote(account, network) {},

    serialize(transaction, account) {
        return new Promise(async(resolve, reject) => {
            //Transaction with testnet and mainnet
            //Correct the signer
            transaction.signer = account.publicKey;

            //If it is a MosaicDefinition Creation Transaction, then correct the creator
            if (transaction.type == 0x4001) {
                transaction.mosaicDefinition.creator = account.publicKey;
            }

            //Serialize the transaction
            let serializedTx = nem.utils.convert.ua2hex(nem.utils.serialization.serializeTransaction(transaction));

            let payload = await this.signTransaction(account, serializedTx)
                .catch(err => {
                    this._Alert.createWalletFailed(err);
                    reject(err);
                });
            resolve(payload);
        });
    },

    showAccount(account) {},

    async getAccount(hdKeypath, network, label) {
        const transport = await TransportWebUSB.create()
            .catch(err => {
                throw err.message;
            });

        this.nemH = new NemH(transport);

        let result = await this.nemH.getAddress(hdKeypath)
            .catch(err => {
                throw err;
            });
        return ({
            "brain": false,
            "algo": "ledger",
            "encrypted": "",
            "iv": "",
            "address": result.address,
            "label": label,
            "network": network,
            "child": "",
            "hdKeypath": hdKeypath,
            "publicKey": result.publicKey
        })
    },

    async signTransaction(account, serializedTx) {
        let sig = await this.nemH.signTransaction(account.hdKeypath, serializedTx)
            .catch(err => {
                throw err;
            });

        let payload = {
            data: serializedTx,
            signature: sig.signature
        }
        return payload;
    }

    // End methods region //
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
