db.createUser({
  user: "testUser",
  pwd: "testPwd",
  roles: [
    {
      role: "readWrite",
      db: "mnemosyne",
    },
  ],
});
