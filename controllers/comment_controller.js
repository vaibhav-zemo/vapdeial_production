const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.createComment = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        // if (post) {
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id,
        });
        // }

        post.comments.push(comment);
        post.save();

        req.flash('success',"Your comment is published");
        return res.redirect('back');
        
    } catch (err) {
        console.log("Error", err);
        return;
    }
}

module.exports.destroy = async function (req, res) {

    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            comment.remove();

            let post = await Post.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } })

            req.flash('success',"Your comment is deleted");
            return res.redirect('back');
        }
        
    } catch (err) {
        console.log("Error", err);
        return;
    }

}