const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/encodeUri', (req, res) => {
 
  let queryString = "";
  for(let atr in req.body.params){
    if(atr == 'oauth_signature') continue;
    queryString += `${encodeURIComponent(atr)}=${encodeURIComponent(req.body.params[atr])}&`;
  }
  let queryString2 = encodeURIComponent( queryString.substring(0, queryString.length-1) );
  let queryString3 = `POST&${encodeURIComponent(req.body.params.resource_link_id)}&${encodeURIComponent(queryString2)}`;

  let oauth_signature = crypto.createHmac('sha1', req.body.params.secret + '&').update(queryString3).digest("base64");

  res.send({queryString, queryString2, queryString3, oauth_signature});

});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});