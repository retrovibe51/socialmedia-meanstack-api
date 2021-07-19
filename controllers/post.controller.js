
const Post = require('../models/post.model');


exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;   // + is to convert value to number from string
    const currentPage = +req.query.currentpage;
    let fetchedPosts;
    const postQuery = Post.find();
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1)) // to skip the items before current page
            .limit(pageSize);    // to limit the items we return (and ignore items after current page)
    }
    postQuery.then((documents) => {
        fetchedPosts = documents;
        return Post.count();    // returns the count of all                
    })
    .then((count) => {
        res.status(200).json({          // 200 - means everything is ok
            message: 'Posts fetched successfully!',
            posts: fetchedPosts,
            totalPosts: count
        }); 
    })
    .catch((error) => {
        res.status(500).json({
            message: "Failed to fetch posts!"
        })
    });
    
}


exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if(post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: 'Post not found!' });
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Failed to fetch post!"
        })
    });
}


exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");   // req.protocol returns http or https depending on how we're accessing the server.
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/imagesForStorage/" + req.file.filename,   // file property is provided by multer
        userId: req.userData.userId
    });

    post.save().then((createdPost) => {
        res.status(201).json({     // 201 - means everything is ok, new resource created
            message: 'Post added successfully',
            post: { ...createdPost,
                    id: createdPost._id // assigning _id again to id so that we have id without underscore
            }
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Failed to create post!"
        })
    })
}


exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, userId: req.userData.userId }).then((result) => {
        console.log(result);
        if(result.deletedCount > 0) {
            res.status(200).json({ message: "Post deleted successfully!" });
        }
        else {
            res.status(401).json({ message: "Not authorized!" });
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Failed to delete post!"
        })
    });
}


exports.updatePost = (req, res, next) => {
    let imagePath;
    if(req.file) {  // if req.file is there, it means a new file was uploaded
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/imagesForStorage/" + req.file.filename;
    }
    else {  // req.file is undefined if we submit a string. This is the case when we dont choose a new image, but send the existing one. 
        imagePath = req.body.imagePath;
    }    
    const updatedPost = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content, 
        imagePath: imagePath,
        userId: req.userData.userId
    });

    Post.updateOne({ _id: req.params.id, userId: req.userData.userId }, updatedPost).then((result) => {
        if(result.n > 0) {
            res.status(200).json({ message: "Updated Successfully!" });
        }
        else {
            res.status(401).json({ message: "Not authorized!" });
        }
    })
    .then((error) => {
        res.status(500).json({
            message: "Failed to update the post!"
        });
    });
}