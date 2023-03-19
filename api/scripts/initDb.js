/* 
Usage : node initDb.js {url} {em} {pwd} {nCols} {nCards}
Create the user email pwd with nCol cardCollections with 
nCard cards each in the api located at url
*/

import * as path from "path";

const args = process.argv.slice(2);
const [url, email, pwd, nCols, nCards] = args;

const createUser = async (url, email, pwd) => {
  const signupUrl = path.join(url, "auth", "signup");
  let response = await fetch(signupUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: pwd,
    }),
  });
  response = await response.json();
  return response;
};

const login = async (url, email, pwd) => {
  const loginUrl = path.join(url, "auth", "login");
  let response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: pwd,
    }),
  });
  response = await response.json();
  return response;
};

const createCardCollection = async (url, token, cardCollectioName) => {
  const createCollectionUrl = path.join(url, "collections");
  let response = await fetch(createCollectionUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: cardCollectioName,
    }),
  });
  response = await response.json();
  return response;
};

const createCard = async (url, token, collectionId, recto, verso) => {
  const createCardUrl = path.join(url, "cards");
  let response = await fetch(createCardUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      cardCollectionId: collectionId,
      rectoContent: recto,
      versoContent: verso,
    }),
  });
  response = response.json();
  return response;
};

await createUser(url, email, pwd);
const loginResponse = await login(url, email, pwd);
const loginToken = loginResponse.token;
for (let i = 0; i < nCols; i++) {
  const collectionName = `TestCollection${i}`;
  const collectionResponse = await createCardCollection(
    url,
    loginToken,
    collectionName
  );
  const collectionId = collectionResponse.cardCollection._id;
  for (let j = 0; j < nCards; j++) {
    const cardName = `TestCard${j}`;
    await createCard(
      url,
      loginToken,
      collectionId,
      cardName,
      `Collection${i}Recto${j}`,
      `Collection${i}Verso${j}`
    );
  }
}
