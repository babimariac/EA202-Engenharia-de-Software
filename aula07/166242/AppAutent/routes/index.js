var express = require('express');
var router = express.Router();
var mongoOp = require('../models/mongo');
var userModel = require('../models/userModel');

function checkAuth(req, res) {
  const cookies = req.cookies;
  if (!cookies || !cookies.userAuth) return 'unauthorized';
  try {
    const content = JSON.parse(cookies.userAuth);
    if (content.key == 'secret') return content.role;
  } catch (error) {
    console.error('Error parsing userAuth cookie:', error);
  }
  return 'unauthorized';
}

function sendIndexFile(req, res) {  // GET
  var path = 'index.html';
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path, {"root": "./"});
}

async function getAlunos(req, res) {  // GET
  if(checkAuth(req, res) == 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }
  var response = {};
  
  try {
    var data = await mongoOp.find({});
    response = {"alunos": data};
  } catch(err) {
    response = {"resultado": "falha de acesso ao BD"};
  }
  res.json(response);
}

async function createAluno(req, res) {   // POST (cria)
  if(checkAuth(req, res) != 'admin') {
    res.status(401).send('Unauthorized');
    return;
  }
  var query = {"ra": req.body.ra};
  var response = {};
  var data = await mongoOp.findOne(query);
  console.log(data);
  if (data == null) {
     var db = new mongoOp();
     db.ra = req.body.ra;
     db.nome = req.body.nome;
     db.curso = req.body.curso;
     try {
       db.save();
       response = {"resultado": "aluno inserido"};
     } catch (err) {
       response = {"resultado": "falha de acesso ao BD"};
     }
     res.json(response);
   }
   else {
       response = {"resultado": "aluno ja existente"};
       res.json(response);
   }   
}

async function getAlunoByRA(req, res) {   // GET
  if(checkAuth(req, res) == 'unauthorized') {
    res.status(401).send('Unauthorized');
    return;
  }
  var response = {};
  var query = {"ra": req.params.ra};
  try {
    var data = await mongoOp.findOne(query);
    if (data == null) 
        response = {"resultado": "aluno inexistente"};
    else response = {"alunos": [data]}; 
  } catch (err) {
    response = {"resultado": "falha de acesso ao BD"};
  }
  res.json(response);
}  

async function alteraAlunoByRA(req, res) {   // PUT (altera)
   if(checkAuth(req, res) != 'admin') {
    res.status(401).send('Unauthorized');
    return;
  }   
  var response = {};
  var query = {"ra": req.params.ra};
  var data = {"nome": req.body.nome, "curso": req.body.curso};
  try {
    var dat = await mongoOp.findOneAndUpdate(query, data);
    if (dat == null) response = {"resultado": "aluno inexistente"};
    else response = {"resultado": "aluno atualizado"};  
  } catch(err) {
    response = {"resultado": "falha de acesso ao DB"};
  }
  res.json(response);
}

async function deleteAlunoByRA(req, res) {   // DELETE (remove)
  if(checkAuth(req, res) != 'admin') {
    res.status(401).send('Unauthorized');
    return;
  }
  var response = {};
  var query = {"ra": req.params.ra};
  try {
      var data = await mongoOp.findOneAndRemove(query);
      if (data == null) response = {"resultado": "aluno inexistente"};
      else response = {"resultado": "aluno removido"};
  } catch(err) {
      response = {"resultado": "falha de acesso ao DB"};
  }
  res.json(response);
}

function getLoginPage(req, res) {  // GET
    var path = 'login.html';
    res.header('Cache-Control', 'no-cache');
    res.sendFile(path, {"root": "./"});
}

function getUserRegisterPage(req, res) {
    var path = 'register.html';
    res.header('Cache-Control', 'no-cache');
    res.sendFile(path, {"root": "./"});
}

async function getUsers(req, res) {
    if(checkAuth(req, res) != 'admin') {
        res.status(401).send('Unauthorized');
        return;
    }
    var response = {};
    try {
        var data = await userModel.find({}, {password: 0});
        response = {"users": data};
    } catch(err) {
        response = {"resultado": "falha de acesso ao BD"};
    }
    res.json(response);
}

async function createUser(req, res) {
    if(checkAuth(req, res) != 'admin') {
        res.status(401).send('Unauthorized');
        return;
    }
    var query = {"username": req.body.username};
    var response = {};
    var data = await userModel.findOne(query);
    if (data == null) {
        var newUser = new userModel();
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.role = req.body.role;
        try {
            await newUser.save();
            response = {"resultado": "usuário inserido"};
        } catch (err) {
            response = {"resultado": "falha de acesso ao BD"};
        }
    } else {
        response = {"resultado": "usuário já existente"};
    }
    res.json(response);
}

async function updateUserPassword(req, res) {
    if(checkAuth(req, res) != 'admin') {
        res.status(401).send('Unauthorized');
        return;
    }
    var query = {"username": req.params.username};
    var update = {"password": req.body.password};
    var response = {};
    try {
        var data = await userModel.findOneAndUpdate(query, update);
        if (data == null) {
            response = {"resultado": "usuário inexistente"};
        } else {
            response = {"resultado": "senha atualizada"};
        }
    } catch(err) {
        response = {"resultado": "falha de acesso ao BD"};
    }
    res.json(response);
}

async function deleteUser(req, res) {
    if(checkAuth(req, res) != 'admin') {
        res.status(401).send('Unauthorized');
        return;
    }
    var query = {"username": req.params.username};
    var response = {};
    try {
        var data = await userModel.findOneAndRemove(query);
        if (data == null) {
            response = {"resultado": "usuário inexistente"};
        } else {
            response = {"resultado": "usuário removido"};
        }
    } catch(err) {
        response = {"resultado": "falha de acesso ao BD"};
    }
    res.json(response);
}

async function verifyUserCredentials(req, res) {
    var user = req.body.user;
    var pass = req.body.pass;
    try {
        var userData = await userModel.findOne({username: user, password: pass});
        if(userData) {
            var content = {"key":"secret", "role": userData.role};
            res.cookie('userAuth', JSON.stringify(content), {'maxAge': 3600000*24*5});
            res.status(200).send('Sucesso');
        } else {
            res.status(401).send('Falha de autenticação');
        }
    } catch(err) {
        res.status(500).send('Erro interno do servidor');
    }
}

function logoutCurrentUser(req, res) {
      if(checkAuth(req, res) != 'unauthorized') {
        res.clearCookie('userAuth');	 // remove cookie no cliente
        res.status(200).send('Sucesso');
      } else {
         res.status(401).send('Unauthorized');
         return;
      } 
}   

// ... (código anterior permanece o mesmo)

router.get('/check-auth', (req, res) => {
  const userAuth = req.cookies.userAuth;
  if (userAuth) {
    try {
      const user = JSON.parse(userAuth);
      res.json({ user: { username: user.key, role: user.role } });
    } catch (error) {
      res.json({ user: null });
    }
  } else {
    res.json({ user: null });
  }
});

router.get('/users', async (req, res) => {
    const auth = checkAuth(req, res);
    if(auth == 'unauthorized') {
        return res.status(401).send('Unauthorized');
    }
    try {
        const users = await userModel.find({}, { password: 0 });
        res.json({ users: users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ resultado: "Erro ao buscar usuários" });
    }
});

router.put('/users/:username', async (req, res) => {
    const auth = checkAuth(req, res);
    if(auth == 'unauthorized') {
        return res.status(401).send('Unauthorized');
    }
    const { username } = req.params;
    const { password } = req.body;
    
    const userAuth = JSON.parse(req.cookies.userAuth);
    if (userAuth.key !== username && auth !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const user = await userModel.findOneAndUpdate(
            { username: username },
            { $set: { password: password } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ resultado: "Usuário não encontrado" });
        }
        res.json({ resultado: "Senha atualizada com sucesso" });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ resultado: "Erro ao atualizar senha" });
    }
});

router.delete('/users/:username', async (req, res) => {
    if(checkAuth(req, res) != 'admin') {
        return res.status(401).send('Unauthorized');
    }
    const { username } = req.params;
    try {
        const user = await userModel.findOneAndDelete({ username: username });
        if (!user) {
            return res.status(404).json({ resultado: "Usuário não encontrado" });
        }
        res.json({ resultado: "Usuário removido com sucesso" });
    } catch (err) {
        console.error('Error removing user:', err);
        res.status(500).json({ resultado: "Erro ao remover usuário" });
    }
});

router.route('/') 
 .get(sendIndexFile);

router.route('/alunos')
  .get(getAlunos)
  .post(createAluno);

router.route('/alunos/:ra')
  .get(getAlunoByRA)
  .put(alteraAlunoByRA)
  .delete(deleteAlunoByRA);

router.route('/authentication')
  .get(getLoginPage)
  .post(verifyUserCredentials)
  .delete(logoutCurrentUser);

router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:username')
    .put(updateUserPassword)
    .delete(deleteUser);

router.route('/register')
    .get(getUserRegisterPage);

router.route('/user-list')
    .get((req, res) => {
        res.sendFile('user-list.html', { root: './' });
    });

module.exports = router;