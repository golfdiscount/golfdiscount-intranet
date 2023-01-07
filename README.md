# Project Setup
## Setting Secrets
Set the secret `vault-uri` to the URI for the KeyVault containing credentials for this application. This can be done with 
`dotnet user-secrets set "vault-uri" "URI to KeyVault"`.

## Setting up HTTPS
You will have to create a self-signed SSL certificate to run the HTTPS server locally. This can be done by executing `aspnetcore-https.js --name=intranet` and
`aspnetcore-react.js` located in the `Client` directory. These will require `NodeJS` to run.

`aspnetcore-https.js` handles the creation of the self-signed certificate and `aspnetcore-react.js` creates an `env.development.local` file containing
the necessary environment variables to use the certificate.

During the execution of `aspnetcore-https.js --name=intranet`, you may get an error saying that "A valid HTTPS certificate is already present". This can be
ignored as it seems to be a bug in the script.

**Please do not commit the `env.development.local` file to VCS.**