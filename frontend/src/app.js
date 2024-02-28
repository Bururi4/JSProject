import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'air-datepicker/air-datepicker.css';
import '../styles/common-styles.css';
import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
    }
}

(new App());