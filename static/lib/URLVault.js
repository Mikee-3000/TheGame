export default class URLVault {
    static instance;

    constructor() {
        if (URLVault.instance) {
            return URLVault.instance;
        }

        URLVault.instance = this;
        this.new_game_url = '/game/new'
    }
} 