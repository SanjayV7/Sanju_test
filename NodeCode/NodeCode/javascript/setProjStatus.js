module.exports.setProjStatus = function () {
    return new Promise((resolve, reject) => {
        try {
            console.log("3. Change Project Status to Active");
            setTimeout(() => {
                resolve({ status: "Success", msg: "Done" });
            }, 1000);
        } catch (err) {
            reject({ status: "Error", msg: err });
        }
    });
}

module.exports.notifyStatus = function () {
    return new Promise((resolve, reject) => {
        try {
            console.log("4. Notify GDM and PMs");
            setTimeout(() => {
                resolve({ status: "Success", msg: "Done" });
            }, 1000);
        } catch (err) {
            reject({ status: "Error", msg: err });
        }
    });
}