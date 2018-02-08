const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// send the object
const respond = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};


// send the head
const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseObj = {
    users,
  };

  return respond(request, response, 200, responseObj);
};

const getUsersMeta = (request, response) => respondMeta(request, response, 200);

const addUser = (request, response, body) => {
  const responseObj = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseObj.id = 'missingParams';
    return respond(request, response, 400, responseObj);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseObj.message = 'Created Successfully';
    return respond(request, response, responseCode, responseObj);
  }
  return respondMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseObj);
};

const notFoundMeta = (request, response) => respond(request, response, 404);

module.exports = {
  getIndex,
  getCss,
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};
