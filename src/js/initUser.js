const Store = require('electron-store');
const store = new Store();

function getUser() {
    let user = store.get("user", "new_user")

    if (user == "new_user") {
        
    }
}
