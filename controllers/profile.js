const handleProfile = (req, res, db) => {
    const {
        id
    } = req.params;
    // partly controls the conditonal through a boolean
    //dont do the counter conditional in the loop
    // let found = false;
    // for loop to grab matching user
    db.select('*').from('users').where({
        // same as id: id
        id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
    /*   if (!found) {
          res.status(404).json('no such user')
      } */
}

module.exports = {
    handleProfile
}