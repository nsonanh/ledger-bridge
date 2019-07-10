import GetWalletComponent from './components/GetWalletComponent.vue'
import SignComponent from './components/SignComponent.vue'

const routes = [
    { path: '/getWallet/:networkId', component: GetWalletComponent },
    { path: '/sign/:networkId', component: SignComponent }
];

export default routes;