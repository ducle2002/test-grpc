const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.userPackage;

const PORT = 8083

const server = new grpc.Server();
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`Your server as started on port ${port}`)
        server.start()
    })

server.addService(userPackage.Users.service,
    {
        "createUser": createUser,
        "deleteUser": deleteUser,
        "readUsers" : readUsers
    });
// server.start();

const users = []
function createUser (call, callback) {
    const userAccount = {
        "name": call.request.name,
        "roleId": call.request.roleId,
        "phone": call.request.phone
    }
    users.push(userAccount)
    callback(null, userAccount);
}

function deleteUser(call, callback) {
    const found = users.find(element => element.name == call.request.name);
    const index = users.indexOf(found);
    if (index > -1) { // only splice array when item is found
        users.splice(index, 1); // 2nd parameter means remove one item only
    }
    callback(null, index);
}

function readUsers(call, callback) {
    callback(null, {"Accounts": users})
}
