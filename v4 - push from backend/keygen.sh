#!/bin/bash
openssl ecparam -name prime256v1 -genkey -out key.pem
openssl ec -in key.pem -pubout -outform DER | dd bs=1 skip=$((2+2+19+2+1)) | base64 > pubkey.b64.txt
openssl ec -in key.pem -outform DER | dd bs=1 skip=$((2+2+1+2)) count=32 | base64 > privkey.b64.txt
cat pubkey.b64.txt | tr -d '=\n' | tr '/+' '_-' > pubkey.txt
cat privkey.b64.txt | tr -d '=\n' | tr '/+' '_-' > privkey.txt
