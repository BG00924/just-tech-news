const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
// deals with the vote
const sequelize = require('../../config/connection');

// get all users
router.get('/', (req, res) => {
    console.log('===========')
    Post.findAll({
        //query configuration
        attributes: ['id', 
        'post_url', 
        'title', 
        'created_at',
        // adds vote count to post
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // orders newest added at top
        order: [['created_at', 'DESC']],
        include: [
            // comment model here
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes:['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 
        'post_url', 
        'title', 
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id'})
                return
            }
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})
router.post('/', (req, res) => {
    //expects title, post url, etc
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

// put /api/post/upvote
router.put('/upvote', (req, res) => {
    // Vote.create({
    //     user_id: req.body.user_id,
    //     post_id: req.body.post_id
    // }).then( () => {
            //then find the post we just voted on
        //     return Post.findOne({
        //         where: {
        //             id: req.body.post_id
        //         },
        //         attributes: [
        //             'id', 
        //             'post_url', 
        //             'title',
        //             'created_at',
        //             // use raw mysql aggregate function query to get a count of how man votes
        //             [
        //                 sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
        //                 'vote_count'
        //             ]
        //         ]
        //     })
        //     .then(dbPostData => res.json(dbPostData))
        //     .catch(err => {
        //         console.log(err)
        //         res.status(400).json(err)
        //     })
        // })
        // .then(dbPostData => res.json(dbPostData))
        // .catch(err => res.json(err))
    //custom static method created in models/posts.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' })
                return
            }
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id'})
                return
            }
            res.json(dbPostData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})





module.exports = router