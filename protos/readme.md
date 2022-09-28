 ```bash
# client
npm install protoc-gen-grpc 
npx protoc-gen-grpc --js_out=import_style=commonjs:. --grpc_out=. ./hello.proto

# server
npm install grpc google-protobuf --save
```# node-server-function-template
