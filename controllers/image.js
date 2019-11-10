const Clarifai = require('clarifai');


// for clarifai
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API,
});

const handleApiCall = (req, res) => {
    // Outputs result of input
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to get request'))
}


const handleImage = (req, res, db) => {
    const {
        id
    } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        // partly controls the conditonal through a boolean
        //dont do the counter conditional in the loop
        /*  let found = false;
         // for loop to grab matching user
         database.users.forEach(user => {
             // You have to use return to stop it from re-looping
     
             if (user.id === id) {
                 found = true;
                 // increment user
                 user.entries++;
                 return res.json(user.entries);
             }
         })
         if (!found) {
             res.status(404).json('no such user')
         } */
        .catch(err => res.status(400).json('Unable to get entries'))
}


module.exports = {
    handleImage,
    handleApiCall
}