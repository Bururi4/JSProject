import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = "GET", body = null) {

        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);

        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {

            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();

                if (result) {
                    return this.request(url, method, body);
                } else {
                    return null;
                }
            }
            if (response.status === 400) {
                return response.json();
            }
            throw new Error(response.message);
        }

        return await response.json();
    }
}