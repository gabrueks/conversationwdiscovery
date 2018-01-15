var credential = require('../credential');
var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var conversation = watson.conversation(credential.watson.conversation);
var discovery = new DiscoveryV1(credential.watson.discovery);
var url = "mongodb://admin:WVKJVYLNGCTLKWFA@sl-us-south-1-portal.15.dblayer.com:31775,sl-us-south-1-portal.14.dblayer.com:31775/compose?authSource=admin&ssl=true";

function completa(string1){
  var date = new Date();
  var month = date.getUTCMonth() + 1;
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  var horas = date.getHours();
  var minutos = date.getMinutes();
  var segundos = date.getSeconds();

  var dia = "Data:" + year + "/" + month + "/" + day + " Horário:" + horas + ":" + minutos + ":" + segundos;
MongoClient.connect(url, function(err, db){

    if(err){
      throw err;
    }

    db.collection("mensagens", function(err, res){

      if(err){
        throw err;
      }
    if(string1 != null){
      var myobj = { mensagem: string1 , date: dia};
      db.collection("mensagens").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("insertado");
      db.close();
  });
}

    })

  })
}

router.get('/', function(req, res, next) {

  res.render('index', { lembrar: 'Disso' });

});

router.get('/bd', function(req, res){

  MongoClient.connect(url, function(err, db){

    if(err){
      throw err;
    }

    db.collection("mensagens").find({}).toArray(function(err, result) {
       if (err) throw err;
       db.close();
       console.log(Object.keys(result).length);
       var array = [];
       var day = [];
       for(var count = 0; count < Object.keys(result).length; count++){
        if(result[count].mensagem[0]){
        array.push(JSON.stringify(result[count].mensagem[0]));
      }else{
        array.push(JSON.stringify(result[count].mensagem.text));
      }
        day.push(JSON.stringify(result[count].date));
      }
      res.render('bd', {dados: /*JSON.stringify(result[0].mensagem[0], null, 2)*/array, dados1: day})

     });
  })
})

router.post('/', function(req, res, next){

  var input = req.body;
  var txt = {text: input.text }
  completa(txt);
  conversation.message({ workspace_id:"f32ab514-384e-436e-b9e8-f593fc331542", input: input }, function(err, response){

    if(err){
      console.log('Deu erro', err);
    }else{
      if(response.output.text == "Eu não consigo responder essa pergunta :( Você pode tentar dar uma olhada em nosso FAQ: https://developer.ibm.com/startups/startups-faq/"){
        console.log(input.text);
        discovery.query({ environment_id: '219f2ec0-96a2-431b-9bb5-a616b2bffa66',collection_id: 'd80a9125-a43e-4e21-b2e8-d97761279029',query: input.text, passages: true }, function(err, data){

          if(err){
            console.log(err);
          }else{
              var string = { text: data.passages[0].passage_text };
            completa(string);
            res.json(data);
          }

        })

      }else{
       completa(response.output.text);
       res.json(response);

     }
    }

  })

})

module.exports = router;
