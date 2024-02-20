const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/encodeUri/:env', (req, res) => {

  if(req.params.env == "prod") {
    url = `https://learn.eltngl.com/lti/v1/launch`;
    key = `dcfab8be8d6c1f8d55580fce1ccc29`;
    secret = `abbab91ee6c02bb43ae9a4090a31e6edcbaa4c8e`;
    isbn = '9780357783795';
  } else {
    url = `https://learn.eltngl.com/lti/v1/test`;
    key = `f34de744c349d39c8d5feb3fcba551`;
    secret = `f9d5a1497c3f8ea5da20b7d590c27a3e96a487d1`;
    isbn = '9780357784624';
  }

  params = {
    context_id: 1,
    context_title: 'Test Course',
    custom_isbn: isbn,
    lis_person_name_full: 'Henrique',
    lti_message_type: 'basic-lti-launch-request',
    lti_version: 'LTI-1p0',
    oauth_callback: 'about:blank',
    oauth_consumer_key: key,
    oauth_nonce: null,
    oauth_signature: null,
    oauth_signature_method: 'HMAC_SHA1',
    oauth_timestamp: Date.now(),
    oauth_version: '1.0',
    resource_link_id: url,
    roles: 'Student',
    user_id: '3',
  }

  const uuid = uuidv4();
  params.oauth_nonce = uuid;

  let queryString = "";
  for(let atr in params){
    if(atr == 'oauth_signature') continue;
    queryString += `${encodeURIComponent(atr)}=${encodeURIComponent(params[atr])}&`;
  }
  let queryString2 = encodeURIComponent( queryString.substring(0, queryString.length-1) );
  let queryString3 = `POST&${encodeURIComponent(params.resource_link_id)}&${encodeURIComponent(queryString2)}`;

  params.oauth_signature = crypto.createHmac('sha1', params.secret + '&').update(queryString3).digest("base64");

  axios.post(params.resource_link_id, JSON.stringify(params), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function (response) {
    console.log("response");
    console.log(response.data);
    res.send({status: 200, queryString, queryString2, queryString3, oauth_signature: params.oauth_signature, data: response.data});
  })
  .catch(function (error) {
    console.log("error");
    console.log(error);
    res.send({status: 400, queryString, queryString2, queryString3, oauth_signature: params.oauth_signature, data: error.response.data.error});
  });

});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
