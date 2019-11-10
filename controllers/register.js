const handleRegister = (req, res, db, bcrypt) => {
    // Destructure dynamically added values in reg form
    const {
        email,
        name,
        password
    } = req.body;
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json('wrong credentials please')
    }

    /* 
        bcrypt.hash(password, null, null, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash)
        }); */

    const hash = bcrypt.hashSync(password);
    // Creating db transactions
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        // [0] will prevent  email  wrapping with "", as res returns an array
                        res.json(user[0]);
                    })

            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        // add req.body to the existing database
        //how kinex populates the database with data
        .catch(err => res.status(400).json('Unable to register'))
}

// exporting
module.exports = {
    handleRegister
}