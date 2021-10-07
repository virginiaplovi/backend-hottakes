const Sauce = require('../models/sauce');
const fs = require('fs'); //file system package

exports.addSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    //if the request has a new file
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename, // generate image URL
            heat: req.body.sauce.heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        };
    } else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        };
    }

    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            //delete img from folder and sauce from database
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );

};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = async (req, res, next) => {
    let idSauce = await Sauce.findById(req.params.id);

    if (req.body.like === 1 && !idSauce.usersLiked.includes(req.body.userId)) { //if like = 1 and userId is not in userLiked array 
        idSauce.usersLiked.push(req.body.userId); // push userId in the array
        idSauce.likes++; // add 1 like

    } else if (req.body.like === 1 && idSauce.usersLiked.includes(req.body.userId)) { // if the userId is already in userLiked array send message
        res.status(201).json({
            message: 'You have already liked this sauce!'
        });
    }

    if (req.body.like === -1 && !idSauce.usersDisliked.includes(req.body.userId)) { // if like -1 and userId is not in userDisliked array
        idSauce.usersDisliked.push(req.body.userId); // push userId in the array
        idSauce.dislikes++; // add 1 dislike

    } else if (req.body.like === -1 && idSauce.usersDisliked.includes(req.body.userId)) { // if the userId is already in userDislike array send message
        res.status(201).json({
            message: 'You have already disliked this sauce!'
        });
    }

    if (req.body.like === 0 && idSauce.usersLiked.includes(req.body.userId)) { // if like = 0 and userId is in userLiked
            idSauce.usersLiked.remove(req.body.userId); // remove userId from the array
            idSauce.likes--; //remove 1 like

        } else if (req.body.like === 0 && idSauce.usersDisliked.includes(req.body.userId)) { // if like = 0 and userId is in userDisliked
            idSauce.usersDisliked.remove(req.body.userId); // remove userId from the array
            idSauce.dislikes--; // remove 1 dislike
        }
    
    idSauce.save().then(
        () => {
            res.status(201).json({
                message: 'Preference updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};