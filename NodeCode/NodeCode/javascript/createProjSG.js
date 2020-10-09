module.exports.createProjSG = function () {
    return new Promise((resolve, reject) => {
        try {
            console.log("1. Creating Project Security Group");
            setTimeout(() => {
                resolve({ status: "Success", msg: "Done" });
            }, 1000);
        } catch (err) {
            reject({ status: "Error", msg: err });
        }
    });
}